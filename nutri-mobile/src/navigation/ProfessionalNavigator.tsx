import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { ProfessionalHomeScreen } from '../features/professional/screens/ProfessionalHomeScreen';
import { PatientListScreen } from '../features/professional/screens/PatientListScreen';
import { CalendarScreen } from '../features/professional/screens/CalendarScreen';
import { MessagesScreen } from '../features/professional/screens/MessagesScreen';
import { ProfileScreen } from '../features/professional/screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();
// No hay necesidad de PatientsStack aquí para ocultar el TabBar en sub-pantallas


export const ProfessionalNavigator = () => {
    // Ya no manejamos el botón de atrás físico para cerrar sesión, 
    // siguiendo la petición del usuario de que no se pueda de esa manera.


    return (
        <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={({ route }) => ({
                swipeEnabled: true,
                tabBarActiveTintColor: '#009688',
                tabBarInactiveTintColor: '#90A4AE',
                tabBarIndicatorStyle: {
                    backgroundColor: '#009688',
                    height: 3,
                    top: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 8,
                    fontWeight: '700',
                    textTransform: 'none',
                },
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused, color }) => {
                    let iconName: any;

                    if (route.name === 'Inicio') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Pacientes') {
                        iconName = focused ? 'people' : 'people-outline';
                    } else if (route.name === 'Citas') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Mensajes') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return (
                        <View style={{ marginBottom: -5 }}>
                            <Ionicons name={iconName} size={22} color={color} />
                        </View>
                    );
                },
                tabBarShowIcon: true,
            })}
        >
            <Tab.Screen
                name="Inicio"
                component={ProfessionalHomeScreen}
                options={{ tabBarLabel: 'Inicio' }}
            />
            <Tab.Screen
                name="Pacientes"
                component={PatientListScreen}
                options={{ tabBarLabel: 'Pacientes' }}
            />
            <Tab.Screen
                name="Citas"
                component={CalendarScreen}
                options={{ tabBarLabel: 'Citas' }}
            />
            <Tab.Screen
                name="Mensajes"
                component={MessagesScreen}
                options={{ tabBarLabel: 'Mensajes' }}
            />
            <Tab.Screen
                name="Perfil"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Perfil' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#ECEFF1',
        height: 65,
        paddingBottom: 5,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    }
});
