import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import TurnoCard from '../../components/TurnoCard';
import { getServicios } from '../../services/serviciosService';
import { getTurnoById } from '../../services/turnosService';

function formatearFecha(fechaStr) {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  const texto = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function DetalleTurnoScreen() {
  const { id } = useLocalSearchParams();
  const [turno, setTurno] = useState(null);
  const [mapaServicios, setMapaServicios] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    Promise.all([getTurnoById(id), getServicios()]).then(([turnoCargado, servicios]) => {
      if (!activo) return;
      setTurno(turnoCargado);
      setMapaServicios(
        servicios.reduce((mapa, servicio) => {
          mapa[servicio.id] = servicio.nombre;
          return mapa;
        }, {})
      );
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return <LoadingState mensaje="Cargando turno..." />;
  }

  if (!turno) {
    return (
      <>
        <Stack.Screen options={{ title: 'Turno' }} />
        <EmptyState mensaje="No se encontró el turno solicitado." />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: turno.clienteNombre }} />
      <TurnoCard
        turno={turno}
        nombreServicio={mapaServicios[turno.servicioId] ?? 'Servicio'}
        mostrarEstado
      />
      <View style={styles.fila}>
        <Text style={styles.etiqueta}>Fecha</Text>
        <Text style={styles.valor}>{formatearFecha(turno.fecha)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: 16,
  },
  fila: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  valor: {
    fontSize: 15,
    color: '#222',
  },
});
