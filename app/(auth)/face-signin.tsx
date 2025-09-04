import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { FaceRecognitionCamera } from '@/components/FaceRecognitionCamera';
import { faceRecognitionService } from '@/services/PythonBridge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Scan, UserCheck, UserX } from 'lucide-react-native';

export default function FaceSignInScreen() {
  const { signInWithFace } = useAuth();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionAttempts, setRecognitionAttempts] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);

  const handleImageCaptured = async (imageUri: string) => {
    setIsRecognizing(true);
    setRecognitionAttempts(prev => prev + 1);

    try {
      // Use Python face recognition module
      const result = await faceRecognitionService.recognizeFace(imageUri);
      
      if (result.success && result.userName) {
        // Add to detection history
        setDetectionHistory(prev => [...prev, result.userName!]);
        
        // Check if we have enough consistent detections (3 out of 5)
        if (recognitionAttempts >= 4) {
          const recentDetections = [...detectionHistory, result.userName].slice(-5);
          const userCounts = recentDetections.reduce((acc, user) => {
            acc[user] = (acc[user] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          const mostFrequent = Object.entries(userCounts).reduce((a, b) => 
            userCounts[a[0]] > userCounts[b[0]] ? a : b
          );
          
          if (mostFrequent[1] >= 3) {
            // Successful recognition
            const success = await signInWithFace(mostFrequent[0], result.confidence || 0);
            if (success) {
              Alert.alert(
                '✅ Face Recognition Successful',
                `Welcome back, ${mostFrequent[0]}!`,
                [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
              );
              return;
            }
          }
        }
        
        // Continue recognition if not enough consistent detections
        if (recognitionAttempts < 5) {
          setTimeout(() => setIsRecognizing(false), 1000);
        } else {
          // Failed after 5 attempts
          Alert.alert(
            'Recognition Failed',
            'Unable to confirm your identity. Please try again or use email sign-in.',
            [
              { text: 'Try Again', onPress: resetRecognition },
              { text: 'Use Email', onPress: () => router.push('/(auth)/signin') }
            ]
          );
        }
      } else {
        // Unknown face detected
        setDetectionHistory(prev => [...prev, 'Unknown']);
        
        if (recognitionAttempts >= 5) {
          Alert.alert(
            'Face Not Recognized',
            'Your face was not recognized. Please ensure you have completed face registration or use email sign-in.',
            [
              { text: 'Try Again', onPress: resetRecognition },
              { text: 'Use Email', onPress: () => router.push('/(auth)/signin') }
            ]
          );
        } else {
          setTimeout(() => setIsRecognizing(false), 1000);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Face recognition failed. Please try again.');
      setTimeout(() => setIsRecognizing(false), 1000);
    }
  };

  const resetRecognition = () => {
    setRecognitionAttempts(0);
    setDetectionHistory([]);
    setIsRecognizing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft color="#64748B" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Face Recognition Sign In</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Look at the Camera</Text>
        <Text style={styles.subtitle}>
          Position your face in the frame for secure biometric authentication.
        </Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <Scan color="#2563EB" size={20} />
            <Text style={styles.statusText}>
              Attempt {recognitionAttempts + 1} of 5
            </Text>
          </View>
          
          {detectionHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Detection History:</Text>
              <View style={styles.historyItems}>
                {detectionHistory.slice(-3).map((detection, index) => (
                  <View key={index} style={styles.historyItem}>
                    {detection === 'Unknown' ? (
                      <UserX color="#DC2626" size={16} />
                    ) : (
                      <UserCheck color="#059669" size={16} />
                    )}
                    <Text style={[
                      styles.historyText,
                      { color: detection === 'Unknown' ? '#DC2626' : '#059669' }
                    ]}>
                      {detection}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.cameraContainer}>
          <FaceRecognitionCamera
            mode="recognition"
            onImageCaptured={handleImageCaptured}
          />
        </View>

        {isRecognizing && (
          <View style={styles.recognitionOverlay}>
            <Text style={styles.recognitionText}>Analyzing face...</Text>
            <Text style={styles.recognitionSubtext}>
              Comparing with registered users
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.emailButtonText}>Use Email Instead</Text>
          </TouchableOpacity>
          
          {recognitionAttempts > 0 && (
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetRecognition}
            >
              <Text style={styles.resetButtonText}>Reset Recognition</Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginBottom: 24,
  },
  statusContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  historyContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  historyItems: {
    gap: 4,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  recognitionOverlay: {
    position: 'absolute',
    top: '50%',
    left: 24,
    right: 24,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
  },
  recognitionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  recognitionSubtext: {
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
  footer: {
    gap: 12,
    paddingBottom: 24,
  },
  emailButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});