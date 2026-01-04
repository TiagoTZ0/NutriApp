import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../auth/store/auth-store';

export const ProfileScreen = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres salir?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sí, Salir', style: 'destructive', onPress: logout }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                        </Text>
                    </View>
                    <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
                    <Text style={styles.role}>{user?.role || 'Profesional de Salud'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cuenta</Text>
                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="person-outline" size={22} color="#009688" />
                        <Text style={styles.itemText}>Editar Perfil</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="notifications-outline" size={22} color="#009688" />
                        <Text style={styles.itemText}>Notificaciones</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Soporte</Text>
                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="help-circle-outline" size={22} color="#009688" />
                        <Text style={styles.itemText}>Ayuda y Soporte</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#009688" />
                        <Text style={styles.itemText}>Privacidad</Text>
                        <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

                <Text style={styles.version}>NutriApp v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#fff', marginBottom: 20 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#009688', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
    name: { fontSize: 22, fontWeight: '700', color: '#263238' },
    role: { fontSize: 14, color: '#90A4AE', marginTop: 4 },
    section: { backgroundColor: '#fff', paddingHorizontal: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 13, fontWeight: '800', color: '#B0BEC5', textTransform: 'uppercase', marginVertical: 15 },
    item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F7FA' },
    itemText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#37474F' },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 15, marginTop: 10 },
    logoutText: { marginLeft: 10, fontSize: 16, fontWeight: '700', color: '#D32F2F' },
    version: { textAlign: 'center', marginTop: 30, color: '#B0BEC5', fontSize: 12, marginBottom: 40 }
});
