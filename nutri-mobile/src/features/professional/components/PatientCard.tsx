import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PatientCardProps {
    name: string;
    age: number;
    goal: string;
    status: 'Al día' | 'Alertas' | 'Sin Plan';
    weightStart: number;
    weightCurrent: number;
    lastCheckIn: string;
    photo?: string;
    onPress?: () => void;
}

export const PatientCard = ({
    name, age, goal, status,
    weightStart, weightCurrent, lastCheckIn,
    photo, onPress
}: PatientCardProps) => {

    // Determinar color del badge
    const getStatusStyle = () => {
        switch (status) {
            case 'Al día': return { bg: '#E0F2F1', text: '#00897B' };
            case 'Alertas': return { bg: '#FFEBEE', text: '#D32F2F' };
            case 'Sin Plan': return { bg: '#FFF3E0', text: '#EF6C00' };
            default: return { bg: '#F5F7FA', text: '#78909C' };
        }
    };

    const statusStyle = getStatusStyle();
    const isLosing = weightCurrent < weightStart;

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            {/* Perfil */}
            <View style={styles.leftSection}>
                {photo ? (
                    <Image source={{ uri: photo }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.initials}>{name.charAt(0)}</Text>
                    </View>
                )}
            </View>

            {/* Información Centro */}
            <View style={styles.middleSection}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <Text style={styles.subtext}>{age} años • {goal}</Text>
            </View>

            {/* Métricas Derecha */}
            <View style={styles.rightSection}>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>{status}</Text>
                </View>

                <View style={styles.progressRow}>
                    <Text style={styles.weightText}>
                        {weightStart}kg <Ionicons name="arrow-forward" size={10} color="#90A4AE" /> {weightCurrent}kg
                    </Text>
                    {isLosing && <Ionicons name="caret-down" size={12} color="#00897B" style={{ marginLeft: 4 }} />}
                </View>

                <Text style={styles.lastCheckIn}>Hace {lastCheckIn}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        // Soft Shadow
        shadowColor: '#37474F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ECEFF1',
    },
    leftSection: {
        marginRight: 12,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F7FA',
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#009688',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    middleSection: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#263238',
        marginBottom: 4,
    },
    subtext: {
        fontSize: 13,
        color: '#78909C',
    },
    rightSection: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 60,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weightText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#455A64',
    },
    lastCheckIn: {
        fontSize: 11,
        color: '#90A4AE',
        fontStyle: 'italic',
    }
});
