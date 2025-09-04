# Native Module Setup for Face Recognition

This directory contains the setup instructions and code templates for integrating Python face recognition into your React Native app.

## Prerequisites

To implement face recognition, you'll need to:

1. **Export this project** from Bolt to your local development environment
2. **Set up native development tools**:
   - Android Studio for Android development
   - Xcode for iOS development
3. **Install Python dependencies** on your development machine

## Android Setup (Using Chaquopy)

### Step 1: Configure Gradle

Add to `android/app/build.gradle`:

```gradle
plugins {
    id 'com.chaquo.python'
}

android {
    defaultConfig {
        ndk {
            abiFilters "arm64-v8a", "x86_64"
        }
    }
}

chaquopy {
    python {
        version "3.8"
    }
    pip {
        install "opencv-python"
        install "face-recognition"
        install "numpy"
    }
}
```

Add to `android/build.gradle`:

```gradle
buildscript {
    dependencies {
        classpath 'com.chaquo.python:gradle:12.0.0'
    }
}
```

### Step 2: Create Python Module

Create `android/app/src/main/python/face_recognition_module.py`:

```python
import cv2
import face_recognition
import numpy as np
import os
import base64
from io import BytesIO
from PIL import Image

class FaceRecognitionHandler:
    def __init__(self):
        self.encodings_path = '/data/data/com.yourapp/files/faces'
        self.known_encodings = []
        self.known_names = []
        self.load_encodings()
    
    def load_encodings(self):
        if not os.path.exists(self.encodings_path):
            os.makedirs(self.encodings_path, exist_ok=True)
            return
        
        for file in os.listdir(self.encodings_path):
            if file.endswith("_encoding.npy"):
                name = file.split('_')[0]
                try:
                    encoding = np.load(os.path.join(self.encodings_path, file))
                    self.known_encodings.append(encoding)
                    self.known_names.append(name)
                except Exception as e:
                    print(f"Error loading {file}: {e}")
    
    def capture_training_image(self, name, image_base64):
        try:
            # Decode base64 image
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))
            img_array = np.array(image)
            
            # Convert to RGB if needed
            if len(img_array.shape) == 3 and img_array.shape[2] == 4:
                img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
            elif len(img_array.shape) == 3 and img_array.shape[2] == 3:
                img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
            
            # Find face encodings
            encodings = face_recognition.face_encodings(img_array)
            
            if encodings:
                # Save encoding
                encoding_path = os.path.join(self.encodings_path, f'{name}_encoding.npy')
                np.save(encoding_path, encodings[0])
                
                # Save image
                image_path = os.path.join(self.encodings_path, f'{name}.jpg')
                cv2.imwrite(image_path, cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR))
                
                # Reload encodings
                self.load_encodings()
                
                return {"success": True, "message": f"Training completed for {name}"}
            else:
                return {"success": False, "message": "No face detected in image"}
                
        except Exception as e:
            return {"success": False, "message": f"Error: {str(e)}"}
    
    def recognize_face(self, image_base64):
        try:
            # Decode base64 image
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))
            img_array = np.array(image)
            
            # Convert to RGB
            if len(img_array.shape) == 3 and img_array.shape[2] == 4:
                img_array = cv2.cvtColor(img_array, cv2.COLOR_RGBA2RGB)
            elif len(img_array.shape) == 3 and img_array.shape[2] == 3:
                img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2RGB)
            
            # Find face encodings
            face_encodings = face_recognition.face_encodings(img_array)
            
            if not face_encodings:
                return {"success": False, "message": "No face detected"}
            
            # Compare with known faces
            face_encoding = face_encodings[0]
            matches = face_recognition.compare_faces(self.known_encodings, face_encoding, tolerance=0.6)
            face_distances = face_recognition.face_distance(self.known_encodings, face_encoding)
            
            if True in matches:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = self.known_names[best_match_index]
                    confidence = 1 - face_distances[best_match_index]
                    return {
                        "success": True, 
                        "userName": name, 
                        "confidence": float(confidence)
                    }
            
            return {"success": True, "userName": "Unknown", "confidence": 0.0}
            
        except Exception as e:
            return {"success": False, "message": f"Error: {str(e)}"}

# Global instance
face_handler = FaceRecognitionHandler()

def capture_training_image(name, image_base64):
    return face_handler.capture_training_image(name, image_base64)

def recognize_face(image_base64):
    return face_handler.recognize_face(image_base64)

def get_known_users():
    return face_handler.known_names

def initialize():
    face_handler.load_encodings()
    return True
```

### Step 3: Create Java Bridge

Create `android/app/src/main/java/com/yourapp/PythonModule.java`:

```java
package com.yourapp;

import com.facebook.react.bridge.*;
import com.chaquo.python.*;

public class PythonModule extends ReactContextBaseJavaModule {
    private Python python;
    private PyObject pythonModule;

    public PythonModule(ReactApplicationContext context) {
        super(context);
        if (!Python.isStarted()) {
            Python.start(new AndroidPlatform(context));
        }
        python = Python.getInstance();
        pythonModule = python.getModule("face_recognition_module");
    }

    @Override
    public String getName() {
        return "PythonModule";
    }

    @ReactMethod
    public void initializeFaceRecognition(Promise promise) {
        try {
            PyObject result = pythonModule.callAttr("initialize");
            promise.resolve(result.toBoolean());
        } catch (Exception e) {
            promise.reject("INIT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void captureTrainingImage(String name, String imageBase64, Promise promise) {
        try {
            PyObject result = pythonModule.callAttr("capture_training_image", name, imageBase64);
            WritableMap map = Arguments.createMap();
            map.putBoolean("success", result.asList().get(0).toBoolean());
            map.putString("message", result.asList().get(1).toString());
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("CAPTURE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void recognizeFace(String imageBase64, Promise promise) {
        try {
            PyObject result = pythonModule.callAttr("recognize_face", imageBase64);
            WritableMap map = Arguments.createMap();
            map.putBoolean("success", result.asList().get(0).toBoolean());
            if (result.asList().size() > 1) {
                map.putString("userName", result.asList().get(1).toString());
                map.putDouble("confidence", result.asList().get(2).toDouble());
            }
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject("RECOGNITION_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getKnownUsers(Promise promise) {
        try {
            PyObject result = pythonModule.callAttr("get_known_users");
            WritableArray array = Arguments.createArray();
            for (PyObject item : result.asList()) {
                array.pushString(item.toString());
            }
            promise.resolve(array);
        } catch (Exception e) {
            promise.reject("GET_USERS_ERROR", e.getMessage());
        }
    }
}
```

## iOS Setup (Using PythonKit)

### Step 1: Add to Podfile

```ruby
pod 'PythonKit', :git => 'https://github.com/pvieito/PythonKit.git'
```

### Step 2: Create Swift Bridge

Create `ios/YourApp/PythonModule.swift`:

```swift
import Foundation
import PythonKit

@objc(PythonModule)
class PythonModule: NSObject {
  
  @objc
  func initializeFaceRecognition(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Initialize Python environment
    resolve(true)
  }
  
  @objc
  func captureTrainingImage(_ name: String, imageBase64: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Implement face training capture
    let result = ["success": true, "message": "Training completed for \(name)"]
    resolve(result)
  }
  
  @objc
  func recognizeFace(_ imageBase64: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    // Implement face recognition
    let result = ["success": true, "userName": "JohnDoe", "confidence": 0.95] as [String : Any]
    resolve(result)
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

## Next Steps

1. **Export your project** from Bolt to your local machine
2. **Follow the setup instructions** above for your target platform(s)
3. **Test the integration** on actual devices
4. **Customize the Python code** based on your specific requirements

## Important Notes

- Face recognition requires actual device testing (not simulator/emulator)
- Ensure proper permissions for camera access
- Consider privacy and security implications of storing biometric data
- Test thoroughly on different lighting conditions and angles