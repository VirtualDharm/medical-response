import { NativeModules, Platform } from 'react-native';

// Type definitions for the Python module
interface PythonModuleType {
  // Face recognition methods
  captureTrainingImage: (name: string) => Promise<{ success: boolean; message: string; imagePath?: string }>;
  recognizeFace: (imageUri: string) => Promise<{ success: boolean; userName?: string; confidence?: number }>;
  
  // Utility methods
  initializeFaceRecognition: () => Promise<boolean>;
  getKnownUsers: () => Promise<string[]>;
  deleteUserTraining: (userName: string) => Promise<boolean>;
}

// Get the native module
const PythonModule: PythonModuleType = NativeModules.PythonModule;

export class FaceRecognitionService {
  private static instance: FaceRecognitionService;
  private isInitialized = false;

  static getInstance(): FaceRecognitionService {
    if (!FaceRecognitionService.instance) {
      FaceRecognitionService.instance = new FaceRecognitionService();
    }
    return FaceRecognitionService.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      if (!PythonModule) {
        console.warn('PythonModule not available. Face recognition will use mock data.');
        return false;
      }
      
      const result = await PythonModule.initializeFaceRecognition();
      this.isInitialized = result;
      return result;
    } catch (error) {
      console.error('Failed to initialize face recognition:', error);
      return false;
    }
  }

  async captureTrainingImage(userName: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!PythonModule) {
        // Mock implementation for web/development
        return {
          success: true,
          message: `Training image captured for ${userName} (mock)`
        };
      }
      
      return await PythonModule.captureTrainingImage(userName);
    } catch (error) {
      console.error('Error capturing training image:', error);
      return {
        success: false,
        message: 'Failed to capture training image'
      };
    }
  }

  async recognizeFace(imageUri: string): Promise<{ success: boolean; userName?: string; confidence?: number }> {
    try {
      if (!PythonModule) {
        // Mock implementation for web/development
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
        return {
          success: true,
          userName: 'John Doe',
          confidence: 0.95
        };
      }
      
      return await PythonModule.recognizeFace(imageUri);
    } catch (error) {
      console.error('Error recognizing face:', error);
      return {
        success: false
      };
    }
  }

  async getKnownUsers(): Promise<string[]> {
    try {
      if (!PythonModule) {
        return ['John Doe', 'Jane Smith']; // Mock data
      }
      
      return await PythonModule.getKnownUsers();
    } catch (error) {
      console.error('Error getting known users:', error);
      return [];
    }
  }

  async deleteUserTraining(userName: string): Promise<boolean> {
    try {
      if (!PythonModule) {
        return true; // Mock success
      }
      
      return await PythonModule.deleteUserTraining(userName);
    } catch (error) {
      console.error('Error deleting user training:', error);
      return false;
    }
  }
}

// Export singleton instance
export const faceRecognitionService = FaceRecognitionService.getInstance();