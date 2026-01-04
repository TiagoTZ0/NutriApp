import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MessagesScreen = () => (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            <Text style={styles.icon}>💬</Text>
            <Text style={styles.title}>Mensajes</Text>
            <Text style={styles.subtitle}>Chat con pacientes disponible pronto.</Text>
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    icon: { fontSize: 60, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: '800', color: '#263238', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#90A4AE', textAlign: 'center' }
});
