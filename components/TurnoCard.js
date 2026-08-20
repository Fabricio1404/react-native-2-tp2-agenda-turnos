import { Pressable, StyleSheet, Text, View } from 'react-native';

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function TurnoCard({ turno, nombreServicio, onPress, mostrarEstado = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.card, pressed && onPress && styles.cardPresionada]}
    >
      <View style={styles.filaSuperior}>
        <Text style={styles.hora}>{turno.hora}</Text>
        {mostrarEstado && <Text style={styles.estado}>{capitalizar(turno.estado)}</Text>}
      </View>
      <Text style={styles.cliente}>{turno.clienteNombre}</Text>
      <Text style={styles.servicio}>{nombreServicio}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cardPresionada: {
    backgroundColor: '#f2f2f2',
  },
  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hora: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  estado: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
  },
  cliente: {
    fontSize: 15,
    color: '#222',
  },
  servicio: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
