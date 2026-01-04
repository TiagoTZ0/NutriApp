import React from 'react';
import { Modal, StyleSheet, Text, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 1. Importamos el hook
import { AnimatedPressableText } from '../../../shared/components/animations/AnimatedPressableText';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export const SelectTermsPolScreen = ({ isVisible, onClose }: Props) => {

  // 3. Hook para cerrar la pantalla
  const navigation = useNavigation();

  const urlTerminos = 'https://bim.pavcowavin.com.pe/wp-content/uploads/2023/10/Terminos-y-condiciones.pdf';
  const urlPoliticas = 'https://www.mindef.gob.pe/uaip/politica_aip.pdf';

  const handlePressTerminos = async () => {
    const supported = await Linking.canOpenURL(urlTerminos);
    if (supported) {
      await Linking.openURL(urlTerminos);
    } else {
      console.log("No se puede abrir la URL:", urlTerminos);
    }
  };

  const handlePressPolíticas = async () => {
    const supported = await Linking.canOpenURL(urlPoliticas);
    if (supported) {
      await Linking.openURL(urlPoliticas);
    } else {
      console.log("No se puede abrir la URL:", urlPoliticas);
    }
  };

  // 4. USAMOS VIEW EN LUGAR DE MODAL
  return (
    <Modal
      visible={isVisible}      // Si esto es false, no se ve nada.
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>NutriApp</Text>
          <Text style={styles.text}>selecciona una opción</Text>

          <View style={styles.separator} />

          {/* BOTÓN CERRAR: Usa goBack() */}
          <AnimatedPressableText
            style={styles.buttonWrapper}
            onPress={() => onClose()}
          >
            <Text style={styles.textButton}>CERRAR</Text>
          </AnimatedPressableText>

          <AnimatedPressableText
            style={styles.buttonWrapper}
            onPress={() => {
              console.log('Términos de Servicio');
              handlePressTerminos();
            }}
          >
            <Text style={styles.textButton}>TÉRMINOS DE SERVICIO</Text>
          </AnimatedPressableText>

          <AnimatedPressableText
            style={styles.buttonWrapper}
            onPress={() => {
              console.log('Política de Privacidad');
              handlePressPolíticas(); // ¡No olvides los paréntesis!
            }}
          >
            <Text style={styles.textButton}>POLÍTICA DE PRIVACIDAD</Text>
          </AnimatedPressableText>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '80%'
  },
  title: {
    fontSize: 22,
    color: 'black',
    textAlign: 'left',
    fontWeight: '500',
    marginBottom: 5
  },
  text: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    fontWeight: '400',
    marginBottom: 20
  },
  textButton: {
    fontSize: 16,
    color: 'black',
    fontWeight: '500'
  },
  separator: {
    height: 10
  },
  buttonWrapper: {
    width: '100%',
    textAlign: 'right', // Alinea a la derecha
    marginBottom: 15
  }
});