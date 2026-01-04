import React, { useState, useMemo, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TextInput,
    TouchableOpacity, ScrollView, StatusBar, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PatientCard } from '../components/PatientCard';
import { useNavigation } from '@react-navigation/native';
import { usePatientStore } from '../store/patient-store';

// Mock data ampliada para el diseño de alta fidelidad (Demo)
const MOCK_DEMO_PATIENTS = [
    { id: 'mock-1', name: 'Ana García', age: 28, goal: 'Pérdida de peso', status: 'Al día', weightStart: 70.5, weightCurrent: 65, lastCheckIn: '2h', photo: 'https://i.pravatar.cc/150?u=ana' },
    { id: 'mock-2', name: 'Marco Bandon', age: 34, goal: 'Aumento de masa', status: 'Al día', weightStart: 68, weightCurrent: 72, lastCheckIn: '5h', photo: 'https://i.pravatar.cc/150?u=marco' },
    { id: 'mock-3', name: 'Bathra Palick', age: 42, goal: 'Control diabetes', status: 'Alertas', weightStart: 85, weightCurrent: 84.5, lastCheckIn: '1d', photo: 'https://i.pravatar.cc/150?u=bathra' },
    { id: 'mock-4', name: 'Carlos Ruiz', age: 25, goal: 'Pérdida de peso', status: 'Sin Plan', weightStart: 95, weightCurrent: 95, lastCheckIn: 'N/A' },
];

export const PatientListScreen = () => {
    const navigation = useNavigation<any>();
    const { patients, fetchPatients, isLoading } = usePatientStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');

    useEffect(() => {
        fetchPatients();
    }, []);

    const filters = ['Todos', 'Activos', 'Sin Plan', 'Alertas'];

    // Combinar datos reales con mock si está vacío (para propósitos de demostración)
    const displayPatients = useMemo(() => {
        const list = patients.length > 0 ? patients.map(p => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`,
            age: 0, // Placeholder
            goal: 'Consultoría', // Placeholder
            status: p.app_user_id ? 'Al día' : 'Sin Plan',
            weightStart: 0,
            weightCurrent: 0,
            lastCheckIn: 'N/A',
            photo: p.photo
        })) : MOCK_DEMO_PATIENTS;

        return (list as any[]).filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'Todos' ||
                (activeFilter === 'Activos' && p.status === 'Al día') ||
                (p.status === activeFilter);
            return matchesSearch && matchesFilter;
        });
    }, [patients, searchQuery, activeFilter]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Mis Pacientes</Text>
                    {patients.length > 0 && (
                        <Text style={styles.statusCount}>{patients.length} pacientes registrados</Text>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.getParent()?.navigate('AddPatient')}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* BUSCADOR */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#90A4AE" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar por nombre..."
                        placeholderTextColor="#90A4AE"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery !== '' && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#B0BEC5" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* FILTROS */}
            <View style={{ height: 50, marginBottom: 10 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    {filters.map(filter => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterChip,
                                activeFilter === filter && styles.filterChipActive
                            ]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                activeFilter === filter && styles.filterTextActive
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* LISTA */}
            <FlatList
                data={displayPatients}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <PatientCard
                        name={item.name}
                        age={item.age}
                        goal={item.goal}
                        status={item.status as any}
                        weightStart={item.weightStart}
                        weightCurrent={item.weightCurrent}
                        lastCheckIn={item.lastCheckIn}
                        photo={item.photo}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={isLoading}
                onRefresh={fetchPatients}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search" size={60} color="#ECEFF1" />
                        <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
                        <Text style={styles.emptySubtitle}>Intenta con otro nombre o filtro.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#263238',
    },
    statusCount: {
        fontSize: 12,
        color: '#90A4AE',
        marginTop: 2,
        fontWeight: '600'
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#009688',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#009688',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#ECEFF1',
    },
    searchIcon: { marginRight: 10 },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#37474F',
    },
    filterContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ECEFF1',
    },
    filterChipActive: {
        backgroundColor: '#009688',
        borderColor: '#009688',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#78909C',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#37474F',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#90A4AE',
        marginTop: 8,
    }
});
