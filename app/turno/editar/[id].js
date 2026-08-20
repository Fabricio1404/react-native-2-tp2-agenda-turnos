import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import EmptyState from '../../../components/EmptyState';
import LoadingState from '../../../components/LoadingState';
import TurnoForm from '../../../components/TurnoForm';
import { getTurnoById, updateTurno } from '../../../services/turnosService';

export default function EditarTurnoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [turno, setTurno] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    getTurnoById(id).then((turnoCargado) => {
      if (!activo) return;
      setTurno(turnoCargado);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  function manejarConfirmar(datos) {
    setGuardando(true);
    updateTurno(id, datos).then(() => {
      router.back();
    });
  }

  if (cargando || guardando) {
    return <LoadingState mensaje={guardando ? 'Guardando cambios...' : 'Cargando turno...'} />;
  }

  if (!turno) {
    return (
      <>
        <Stack.Screen options={{ title: 'Editar turno' }} />
        <EmptyState mensaje="No se encontró el turno a editar." />
      </>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contenido}>
      <Stack.Screen options={{ title: `Editar: ${turno.clienteNombre}` }} />
      <TurnoForm turnoInicial={turno} onSubmit={manejarConfirmar} />
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
