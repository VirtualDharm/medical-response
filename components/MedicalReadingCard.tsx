import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MedicalReading {
  id: string;
  type: 'glucose' | 'blood_pressure' | 'temperature' | 'oxygen';
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  timestamp: string;
  icon: any;
}

interface Props {
  reading: MedicalReading;
  statusColor: string;
}

export function MedicalReadingCard({ reading, statusColor }: Props) {
  const getReadingTitle = (type: string) => {
    switch (type) {
      case 'glucose': return 'Blood Glucose';
      case 'blood_pressure': return 'Blood Pressure';
      case 'temperature': return 'Body Temperature';
      case 'oxygen': return 'Oxygen Saturation';
      default: return 'Unknown';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Attention';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  const IconComponent = reading.icon;

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: statusColor + '15' }]}>
          <IconComponent color={statusColor} size={24} />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {getStatusText(reading.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.readingType}>{getReadingTitle(reading.type)}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.readingValue}>{reading.value}</Text>
          <Text style={styles.readingUnit}>{reading.unit}</Text>
        </View>
        <Text style={styles.timestamp}>{reading.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    gap: 4,
  },
  readingType: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  readingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
  },
  readingUnit: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
});