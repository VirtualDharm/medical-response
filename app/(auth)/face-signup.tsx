import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FaceRecognitionCamera } from '@/components/FaceRecognitionCamera';
import { faceRecognitionService } from '@/services/PythonBridge';
import { ArrowLeft, Camera, Check } from 'lucide-react-native';

export default function FaceSignUpScreen() {
  const params = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Get user data from previous signup step
  const userData = {
    firstName: params.firstName as string,
    lastName: params.lastName as string,
    email: params.email as string,
    phone: params.phone as string,
    dateOfBirth: params.dateOfBirth as string,
  };

  const userName = `${userData.firstName}${userData.lastName}`.replace(/\s+/g, '');

  const handleImageCaptured = async (uri: string) => {
    setImageUri(uri);
    setIsProcessing(true);

    try {
      // Initialize face recognition service
      await faceRecognitionService.initialize();
      
      // Capture training image using Python module
      const result = await faceRecognitionService.captureTrainingImage(userName);
      
      if (result.success) {
        setIsCompleted(true);
        Alert.alert(
          'Training Complete!',
          'Your face has been successfully registered for secure sign-in.',
          [
            {
              text: 'Continue',
              onPress: () => router.replace('/(tabs)')
            }
          ]
        );
      } else {
        Alert.alert('Training Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process training image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const retakePhoto = () => {
    setImageUri(null);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Check color="white" size={48} />
          </View>
          <Text style={styles.successTitle}>Face Recognition Setup Complete!</Text>
          <Text style={styles.successMessage}>
            Your face has been successfully registered. You can now use face recognition to sign in securely.
          </Text>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#64748B" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Face Recognition Setup</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Capture Training Image</Text>
        <Text style={styles.subtitle}>
          We'll capture your face to enable secure biometric sign-in for future sessions.
        </Text>

        <View style={styles.cameraContainer}>
          <FaceRecognitionCamera
            mode="training"
            userName={userName}
            onImageCaptured={handleImageCaptured}
          />
        </View>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <Text style={styles.processingText}>Processing training image...</Text>
            <Text style={styles.processingSubtext}>
              Creating face recognition model for {userData.firstName} {userData.lastName}
            </Text>
          </View>
        )}

        {imageUri && !isProcessing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  processingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  processingSubtext: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 24,
  },
  retakeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});