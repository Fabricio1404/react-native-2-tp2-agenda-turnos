import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState({ mensaje = 'No hay turnos para mostrar.' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  mensaje: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});
