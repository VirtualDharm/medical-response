import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { MedicalReadingCard } from '@/components/MedicalReadingCard';
import { EmergencyButton } from '@/components/EmergencyButton';
import { NotificationButton } from '@/components/NotificationButton';
import { Activity, Droplets, Thermometer, Heart, Clock } from 'lucide-react-native';

interface MedicalReading {
  id: string;
  type: 'glucose' | 'blood_pressure' | 'temperature' | 'oxygen';
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  icon: any;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  
  const [medicalReadings] = useState<MedicalReading[]>([
    {
      id: '1',
      type: 'glucose',
      value: '98',
      unit: 'mg/dL',
      status: 'normal',
      timestamp: '2 hours ago',
      icon: Droplets,
    },
    {
      id: '2',
      type: 'blood_pressure',
      value: '120/80',
      unit: 'mmHg',
      status: 'normal',
      timestamp: '3 hours ago',
      icon: Activity,
    },
    {
      id: '3',
      type: 'temperature',
      value: '98.6',
      unit: '°F',
      status: 'normal',
      timestamp: '4 hours ago',
      icon: Thermometer,
    },
    {
      id: '4',
      type: 'oxygen',
      value: '98',
      unit: '%',
      status: 'normal',
      timestamp: '5 hours ago',
      icon: Heart,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#059669';
      case 'warning': return '#D97706';
      case 'critical': return '#DC2626';
      default: return '#64748B';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.patientInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth:</Text>
              <Text style={styles.infoValue}>{user?.dateOfBirth}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Patient ID:</Text>
              <Text style={styles.infoValue}>#{user?.id.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Vital Signs */}
        <View style={styles.vitalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Vital Signs</Text>
            <TouchableOpacity>
              <Clock color="#64748B" size={20} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.readingsGrid}>
            {medicalReadings.map((reading) => (
              <MedicalReadingCard
                key={reading.id}
                reading={reading}
                statusColor={getStatusColor(reading.status)}
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <EmergencyButton />
            <NotificationButton />
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  patientCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  patientInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  vitalsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  readingsGrid: {
    gap: 16,
  },
  actionsSection: {
    marginBottom: 40,
  },
  actionButtons: {
    gap: 16,
  },
});