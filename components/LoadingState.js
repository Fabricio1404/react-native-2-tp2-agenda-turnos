import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingState({ mensaje = 'Cargando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  mensaje: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
