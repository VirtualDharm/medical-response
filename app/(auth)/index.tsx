import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Heart, Activity } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Heart color="#2563EB" size={40} />
          <Text style={styles.logoText}>HealthTracker</Text>
        </View>
        <Activity color="#059669" size={24} style={styles.activityIcon} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to HealthTracker</Text>
        <Text style={styles.subtitle}>
          Your personal health monitoring companion. Track vital signs, manage your health data, and stay connected with your healthcare team.
        </Text>

        <View style={styles.featureList}>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📊 Real-time vital signs monitoring</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>🚨 Emergency alert system</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureText}>📱 Instant healthcare notifications</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={() => router.push('/(auth)/face-signin')}
        >
          <Text style={styles.primaryButtonText}>Face Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.tertiaryButton]} 
          onPress={() => router.push('/(auth)/signin')}
        >
          <Text style={styles.tertiaryButtonText}>Email Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 8,
  },
  activityIcon: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featureList: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#94A3B8',
  },
  tertiaryButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
});