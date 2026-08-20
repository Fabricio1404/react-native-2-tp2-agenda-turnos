import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ESTADOS_TURNO_LISTA } from '../constants/estadosTurno';

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function EstadoSelector({ estadoSeleccionado, onSeleccionar }) {
  return (
    <View style={styles.lista}>
      {ESTADOS_TURNO_LISTA.map((estado) => {
        const seleccionado = estado === estadoSeleccionado;
        return (
          <Pressable
            key={estado}
            onPress={() => onSeleccionar(estado)}
            style={[styles.chip, seleccionado && styles.chipSeleccionado]}
          >
            <Text style={[styles.chipTexto, seleccionado && styles.chipTextoSeleccionado]}>
              {capitalizar(estado)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
