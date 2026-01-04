import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { AnimatedPressableButton } from '../../../shared/components/animations/AnimatedPressableButton';
import { useAuthStore } from '../store/auth-store';

export const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const register = useAuthStore(state => state.register);
    const isLoading = useAuthStore(state => state.isLoading);
    const error = useAuthStore(state => state.error);
    const initialRole = route.params?.targetRole || 'PATIENT';
    const form = useAuthStore(state => state.registrationForm[initialRole] || state.registrationForm['PATIENT']);
    const setRegistrationForm = useAuthStore(state => state.setRegistrationForm);
    const resetRegistrationForm = useAuthStore(state => state.resetRegistrationForm);

    const setForm = (data: any) => setRegistrationForm(initialRole, data);
    const resetForm = () => resetRegistrationForm(initialRole);

    const handleRegister = async () => {
        if (!form.first_name || !form.last_name || !form.email || !form.password) {
            Alert.alert('Error', 'Por favor completa todos los campos.');
            return;
        }
        if (form.password !== form.confirm_password) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }
        const success = await register({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            password: form.password,
            role: initialRole,
            newsletter: form.newsletter
        });
        if (success) {
            const savedEmail = form.email; // Capturamos el email antes de resetear
            resetForm(); // Limpiamos el formulario tras éxito
            Alert.alert('¡Cuenta creada!', 'Ahora completemos unos datos adicionales.', [{ text: 'Continuar', onPress: () => navigation.navigate('Onboarding', { role: initialRole, email: savedEmail }) }]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#b6e1bbff" />
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}><BackButton /></View>
                <Text style={styles.topBarTitle}>Crear Cuenta</Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Únete a NutriApp</Text>
                        <Text style={styles.subtitle}>{initialRole === 'PROFESSIONAL' ? 'Lleva tu consultorio al siguiente nivel.' : 'Comienza tu viaje hacia una vida saludable.'}</Text>
                    </View>
                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}><Text style={styles.label}>Nombre</Text><TextInput style={styles.input} placeholder="Ej. Juan" value={form.first_name} onChangeText={(text) => setForm({ first_name: text })} /></View>
                        <View style={styles.inputGroup}><Text style={styles.label}>Apellido</Text><TextInput style={styles.input} placeholder="Ej. Pérez" value={form.last_name} onChangeText={(text) => setForm({ last_name: text })} /></View>
                        <View style={styles.inputGroup}><Text style={styles.label}>Correo Electrónico</Text><TextInput style={styles.input} placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={(text) => setForm({ email: text })} /></View>
                        <View style={styles.inputGroup}><Text style={styles.label}>Contraseña</Text><TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={form.password} onChangeText={(text) => setForm({ password: text })} /></View>
                        <View style={styles.inputGroup}><Text style={styles.label}>Confirmar Contraseña</Text><TextInput style={styles.input} placeholder="••••••••" secureTextEntry value={form.confirm_password} onChangeText={(text) => setForm({ confirm_password: text })} /></View>
                        <TouchableOpacity style={styles.newsletterItem} activeOpacity={0.7} onPress={() => setForm({ newsletter: !form.newsletter })}>
                            <View style={[styles.checkbox, form.newsletter && styles.checkboxActive]}>{form.newsletter && <Ionicons name="checkmark" size={16} color="#fff" />}</View>
                            <Text style={styles.newsletterText}>Acepto recibir noticias y novedades de NutriApp.</Text>
                        </TouchableOpacity>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        <AnimatedPressableButton style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
                            <Text style={styles.registerButtonText}>{isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}</Text>
                        </AnimatedPressableButton>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerBaseText}>¿Ya tienes una cuenta? <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>Inicia Sesión</Text></Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b6e1bbff' },
    flex: { flex: 1 },
    topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 60, paddingHorizontal: 16, position: 'relative' },
    topBarLeft: { position: 'absolute', left: 16, zIndex: 10 },
    topBarTitle: { fontSize: 18, fontWeight: '800', color: '#263238' },
    scrollContent: { padding: 24, paddingTop: 10 },
    header: { marginBottom: 30 },
    title: { fontSize: 32, fontWeight: '900', color: '#263238', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#78909C', lineHeight: 22 },
    formCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '700', color: '#546E7A', marginBottom: 8, marginLeft: 4 },
    input: { backgroundColor: '#F5F7FA', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#263238', borderWidth: 1, borderColor: '#ECEFF1' },
    newsletterItem: { flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingVertical: 12 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#009688', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    checkboxActive: { backgroundColor: '#009688' },
    newsletterText: { flex: 1, fontSize: 14, color: '#546E7A', lineHeight: 20 },
    registerButton: { backgroundColor: '#009688', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 24 },
    registerButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
    errorText: { color: '#D32F2F', fontSize: 14, textAlign: 'center', marginTop: 12, fontWeight: '600' },
    footer: { marginTop: 30, marginBottom: 40, alignItems: 'center' },
    footerBaseText: { fontSize: 16, color: '#78909C' },
    footerLink: { color: '#009688', fontWeight: '800' }
});
