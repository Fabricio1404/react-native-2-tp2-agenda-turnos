import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { getServicios } from '../services/serviciosService';

export default function ServicioSelector({ servicioIdSeleccionado, onSeleccionar }) {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    getServicios().then((serviciosCargados) => {
      if (!activo) return;
      setServicios(serviciosCargados);
      setCargando(false);
    });
    return () => {
      activo = false;
    };
  }, []);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.lista}>
      {servicios.map((servicio) => {
        const seleccionado = servicio.id === servicioIdSeleccionado;
        return (
          <Pressable
            key={servicio.id}
            onPress={() => onSeleccionar(servicio.id)}
            style={[styles.chip, seleccionado && styles.chipSeleccionado]}
          >
            <Text style={[styles.chipTexto, seleccionado && styles.chipTextoSeleccionado]}>
              {servicio.nombre}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cargando: {
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  chipSeleccionado: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  chipTexto: {
    fontSize: 14,
    color: '#333',
  },
  chipTextoSeleccionado: {
    color: '#fff',
    fontWeight: '600',
  },
});
