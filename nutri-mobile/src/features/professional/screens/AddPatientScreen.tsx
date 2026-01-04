import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePatientStore } from '../store/patient-store';

export const AddPatientScreen = () => {
    const navigation = useNavigation<any>();
    const { addPatient, isLoading } = usePatientStore();
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        goal: 'Pérdida de peso',
    });

    const handleSave = async () => {
        if (!form.first_name || !form.last_name || !form.email) {
            Alert.alert('Error', 'Por favor completa los campos básicos.');
            return;
        }

        const success = await addPatient({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            goal: form.goal
        });

        if (success) {
            Alert.alert('Éxito', 'Paciente registrado correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else {
            Alert.alert('Error', 'No se pudo registrar al paciente.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#263238" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Nuevo Paciente</Text>
                    <View style={styles.spacer} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={20} color="#009688" />
                        <Text style={styles.infoText}>
                            Se enviará una invitación por correo al paciente para que descargue la App.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombres</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. Ana María"
                            value={form.first_name}
                            onChangeText={(text) => setForm({ ...form, first_name: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Apellidos</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. García López"
                            value={form.last_name}
                            onChangeText={(text) => setForm({ ...form, last_name: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej. paciente@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={form.email}
                            onChangeText={(text) => setForm({ ...form, email: text })}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Objetivo Principal</Text>
                        <View style={styles.pickerContainer}>
                            {['Pérdida de peso', 'Masa Muscular', 'Salud/Clínico'].map((obj) => (
                                <TouchableOpacity
                                    key={obj}
                                    style={[styles.chip, form.goal === obj && styles.chipActive]}
                                    onPress={() => setForm({ ...form, goal: obj })}
                                >
                                    <Text style={[styles.chipText, form.goal === obj && styles.chipTextActive]}>
                                        {obj}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        <Text style={styles.saveButtonText}>
                            {isLoading ? 'Registrando...' : 'Registrar Paciente'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    flex: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ECEFF1',
    },
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#263238' },
    spacer: { width: 40 },
    scrollContent: { padding: 24 },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E0F2F1',
        padding: 12,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    infoText: {
        marginLeft: 10,
        fontSize: 13,
        color: '#00796B',
        flex: 1,
        lineHeight: 18,
    },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#546E7A', marginBottom: 8 },
    input: {
        backgroundColor: '#F5F7FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        fontSize: 16,
        color: '#263238',
        borderWidth: 1,
        borderColor: '#ECEFF1',
    },
    pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
    chip: {
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#ECEFF1',
    },
    chipActive: { backgroundColor: '#009688', borderColor: '#009688' },
    chipText: { fontSize: 13, color: '#78909C', fontWeight: '600' },
    chipTextActive: { color: '#ffffff' },
    saveButton: {
        backgroundColor: '#009688',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        elevation: 4,
        shadowColor: '#009688',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    saveButtonDisabled: { backgroundColor: '#B0BEC5' },
});
