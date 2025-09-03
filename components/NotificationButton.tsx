import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Send } from 'lucide-react-native';

export function NotificationButton() {
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    setIsSending(true);
    
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSending(false);
    
    Alert.alert(
      '✅ Notification Sent',
      'Your healthcare provider has been notified about your current status.',
      [{ text: 'OK' }]
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.notificationButton, isSending && styles.sendingButton]}
      onPress={handleSendNotification}
      disabled={isSending}
      activeOpacity={0.8}
    >
      <Send color="#2563EB" size={20} />
      <Text style={styles.notificationText}>
        {isSending ? 'Sending...' : 'Send Update to Provider'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sendingButton: {
    opacity: 0.6,
  },
  notificationText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
});