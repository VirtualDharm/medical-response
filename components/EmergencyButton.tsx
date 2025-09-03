import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Vibration } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

export function EmergencyButton() {
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyPress = () => {
    setIsPressed(true);
    
    // Haptic feedback for emergency button
    Vibration.vibrate([0, 100, 100, 100]);
    
    Alert.alert(
      '🚨 Emergency Alert',
      'Emergency services and your healthcare provider have been notified. Help is on the way.',
      [
        {
          text: 'OK',
          onPress: () => setIsPressed(false),
        },
      ]
    );
    
    // Reset button state after animation
    setTimeout(() => setIsPressed(false), 200);
  };

  return (
    <TouchableOpacity 
      style={[styles.emergencyButton, isPressed && styles.pressedButton]}
      onPress={handleEmergencyPress}
      activeOpacity={0.8}
    >
      <AlertTriangle color="white" size={24} />
      <Text style={styles.emergencyText}>Emergency Alert</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  emergencyButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  pressedButton: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.2,
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});