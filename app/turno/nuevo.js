import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import LoadingState from '../../components/LoadingState';
import TurnoForm from '../../components/TurnoForm';
import { createTurno } from '../../services/turnosService';

export const options = {
  title: 'Nuevo turno',
};

export default function NuevoTurnoScreen() {
  const router = useRouter();
  const [guardando, setGuardando] = useState(false);

  function manejarConfirmar(datos) {
    setGuardando(true);
    createTurno(datos).then(() => {
      router.back();
    });
  }

  if (guardando) {
    return <LoadingState mensaje="Guardando turno..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <TurnoForm onSubmit={manejarConfirmar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  contenido: {
    flexGrow: 1,
  },
});
