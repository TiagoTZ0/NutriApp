import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { AnimatedPressableButton } from '../../../shared/components/animations/AnimatedPressableButton';
import { useAuthStore } from '../store/auth-store';

export const OnboardingScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const updateProfile = useAuthStore(state => state.updateProfile);
    const isLoading = useAuthStore(state => state.isLoading);
    const role = route.params?.role || 'PATIENT';
    const email = route.params?.email || '';

    const data = useAuthStore(state => state.onboardingForm[role] || state.onboardingForm['PATIENT']);
    const setOnboardingForm = useAuthStore(state => state.setOnboardingForm);

    const setData = (newData: any) => setOnboardingForm(role, newData);

    const handleComplete = async () => {
        if (!data.age || !data.gender) {
            Alert.alert('Casi listo', 'Por favor completa al menos tu edad y género.');
            return;
        }

        // Construimos el body para el PUT según el rol
        const updateData: any = {
            // Datos compartidos o específicos dependiendo de cómo esté el modelo User
            first_name: useAuthStore.getState().user?.first_name, // Mantener datos actuales
        };

        if (role === 'PROFESSIONAL') {
            updateData.professional_profile = {
                phone: data.phone,
                bio: '', // Inicializar vacío
            };
            // Si el backend espera 'age' y 'gender' en el perfil u otro campo:
        } else {
            updateData.patient_profile = {
                gender: data.gender === 'male' ? 'MALE' : data.gender === 'female' ? 'FEMALE' : 'OTHER',
                height: parseFloat(data.height) || 0,
                // Si el backend usa date_of_birth en vez de age, podríamos calcularlo o guardarlo así
            };
        }

        const success = await updateProfile(updateData);

        if (success) {
            useAuthStore.getState().resetRegistrationForm(role); // Limpiamos la persistencia tras completar
            Alert.alert(
                '¡Todo listo!',
                'Tu perfil ha sido completado con éxito.',
                [{ text: 'Comenzar', onPress: () => navigation.navigate('Landing') }] // O a la Home
            );
        } else {
            Alert.alert('Error', 'No se pudo guardar la información adicional.');
        }
    };

    const renderGenderOption = (val: string, icon: any, label: string) => (
        <TouchableOpacity style={[styles.genderCard, data.gender === val && styles.genderCardActive]} onPress={() => setData({ ...data, gender: val })} activeOpacity={0.8}>
            <Ionicons name={icon} size={32} color={data.gender === val ? '#fff' : '#009688'} />
            <Text style={[styles.genderLabel, data.gender === val && styles.genderLabelActive]}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#b6e1bbff" />
            <View style={styles.topBar}>
                <View style={styles.topBarLeft}><BackButton /></View>
                <View style={styles.topBarCenter}><Text style={styles.topBarTitle}>Finalizar Perfil</Text></View>
                <View style={styles.topBarRight} />
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <Text style={styles.emoji}>✨</Text>
                        <Text style={styles.title}>Queremos conocerte</Text>
                        <Text style={styles.subtitle}>Solo unos detalles más para personalizar tu experiencia en NutriApp.</Text>
                    </View>
                    <View style={styles.card}>
                        {role === 'PROFESSIONAL' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Número de Celular</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="call-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
                                    <TextInput style={styles.input} placeholder="+51 999 999 999" keyboardType="phone-pad" value={data.phone} onChangeText={(text) => setData({ ...data, phone: text })} />
                                </View>
                            </View>
                        )}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Edad</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="calendar-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
                                <TextInput style={styles.input} placeholder="Ej. 25" keyboardType="number-pad" value={data.age} onChangeText={(text) => setData({ ...data, age: text })} />
                            </View>
                        </View>
                        {role === 'PATIENT' && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Altura (cm)</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="resize-outline" size={20} color="#90A4AE" style={styles.inputIcon} />
                                    <TextInput style={styles.input} placeholder="Ej. 175" keyboardType="number-pad" value={data.height} onChangeText={(text) => setData({ ...data, height: text })} />
                                </View>
                            </View>
                        )}
                        <Text style={styles.label}>Género</Text>
                        <View style={styles.genderContainer}>
                            {renderGenderOption('male', 'male-outline', 'Hombre')}
                            {renderGenderOption('female', 'female-outline', 'Mujer')}
                            {renderGenderOption('other', 'ellipsis-horizontal-outline', 'Otro')}
                        </View>
                        <AnimatedPressableButton style={styles.completeButton} onPress={handleComplete} disabled={isLoading}>
                            <Text style={styles.completeButtonText}>{isLoading ? 'Guardando...' : 'Finalizar Registro'}</Text>
                        </AnimatedPressableButton>
                    </View>
                    <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Login')} activeOpacity={0.6}>
                        <Text style={styles.skipText}>Completar luego</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#b6e1bbff' },
    flex: { flex: 1 },
    topBar: { flexDirection: 'row', alignItems: 'center', height: 60, paddingHorizontal: 15 },
    topBarLeft: { width: 90, alignItems: 'flex-start' },
    topBarCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    topBarRight: { width: 90 },
    topBarTitle: { fontSize: 18, fontWeight: '800', color: '#263238' },
    scrollContent: { padding: 24, paddingTop: 10, flexGrow: 1 },
    header: { alignItems: 'center', marginBottom: 30 },
    emoji: { fontSize: 40, marginBottom: 8 },
    title: { fontSize: 28, fontWeight: '900', color: '#263238', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#78909C', textAlign: 'center', marginTop: 8, paddingHorizontal: 10, lineHeight: 22 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '700', color: '#546E7A', marginBottom: 8, marginLeft: 4 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#ECEFF1' },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#263238' },
    genderContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, marginTop: 4 },
    genderCard: { flex: 1, backgroundColor: '#F5F7FA', borderRadius: 12, paddingVertical: 16, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#ECEFF1' },
    genderCardActive: { backgroundColor: '#009688', borderColor: '#009688' },
    genderLabel: { fontSize: 12, fontWeight: '700', color: '#78909C', marginTop: 8 },
    genderLabelActive: { color: '#fff' },
    completeButton: { backgroundColor: '#009688', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8 },
    completeButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
    skipButton: { alignSelf: 'center', marginTop: 24, padding: 10, marginBottom: 20 },
    skipText: { color: '#90A4AE', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
});
