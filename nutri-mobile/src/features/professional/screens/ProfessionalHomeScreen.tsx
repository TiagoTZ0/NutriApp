import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../auth/store/auth-store';
import { usePatientStore } from '../store/patient-store';

export const ProfessionalHomeScreen = () => {
  const { user } = useAuthStore();
  const { patients, fetchPatients } = usePatientStore();

  useEffect(() => {
    fetchPatients();
  }, []);

  const stats = [
    { label: 'Pacientes', value: patients.length || '12', icon: 'people', color: '#009688' },
    { label: 'Citas Hoy', value: '5', icon: 'calendar', color: '#FF9800' },
    { label: 'Alertas', value: '2', icon: 'warning', color: '#D32F2F' },
    { label: 'Mensajes', value: '8', icon: 'chatbubbles', color: '#2196F3' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header de Bienvenida */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, Dr. {user?.last_name || 'Nutricionista'}</Text>
            <Text style={styles.date}>Viernes, 26 de Diciembre</Text>
          </View>
          <TouchableOpacity style={styles.profileIcon}>
            <Text style={styles.profileText}>{user?.first_name?.charAt(0)}</Text>
          </TouchableOpacity>
        </View>

        {/* Grid de Estadísticas */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.iconCircle, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Sección "Próximas Citas" (Placeholder visual interesante) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Citas</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Ver todo</Text></TouchableOpacity>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTime}>10:00 AM</Text>
            <Text style={styles.appointmentPatient}>Ana García</Text>
            <Text style={styles.appointmentGoal}>Control de peso</Text>
          </View>
          <TouchableOpacity style={styles.checkButton}>
            <Ionicons name="checkmark-circle" size={24} color="#009688" />
          </TouchableOpacity>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTime}>11:30 AM</Text>
            <Text style={styles.appointmentPatient}>Marco Bandon</Text>
            <Text style={styles.appointmentGoal}>Ganancia muscular</Text>
          </View>
          <TouchableOpacity style={styles.checkButton}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#B0BEC5" />
          </TouchableOpacity>
        </View>

        {/* Sección "Tips del día" */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={30} color="#FFD600" />
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>Tip de salud</Text>
            <Text style={styles.tipDescription}>
              Recuerda recomendar a tus pacientes beber al menos 2 litros de agua para mejorar la digestión.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scrollContent: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#263238' },
  date: { fontSize: 14, color: '#90A4AE', marginTop: 4 },
  profileIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#009688', justifyContent: 'center', alignItems: 'center' },
  profileText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '47%', backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#263238' },
  statLabel: { fontSize: 12, color: '#90A4AE', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#263238' },
  seeAll: { color: '#009688', fontWeight: '600' },
  appointmentCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12, alignItems: 'center' },
  appointmentInfo: { flex: 1 },
  appointmentTime: { fontSize: 12, fontWeight: '800', color: '#009688' },
  appointmentPatient: { fontSize: 16, fontWeight: '700', color: '#263238', marginVertical: 4 },
  appointmentGoal: { fontSize: 13, color: '#78909C' },
  checkButton: { padding: 4 },
  tipCard: { flexDirection: 'row', backgroundColor: '#263238', padding: 20, borderRadius: 24, marginTop: 20, alignItems: 'center' },
  tipTextContainer: { flex: 1, marginLeft: 16 },
  tipTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  tipDescription: { color: '#B0BEC5', fontSize: 13, marginTop: 4, lineHeight: 18 }
});