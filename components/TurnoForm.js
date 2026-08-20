import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ESTADOS_TURNO } from '../constants/estadosTurno';
import EstadoSelector from './EstadoSelector';
import ServicioSelector from './ServicioSelector';

function pad(numero) {
  return String(numero).padStart(2, '0');
}

function aFechaString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function aHoraString(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fechaHoraDesdeStrings(fechaStr, horaStr) {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  const [horas, minutos] = horaStr.split(':').map(Number);
  return new Date(anio, mes - 1, dia, horas, minutos);
}

function formatearFecha(date) {
  const texto = date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearHora(date) {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// Tolerancia para que completar el formulario no invalide una fecha/hora "ahora" por defecto.
const MARGEN_TOLERANCIA_MS = 5 * 60 * 1000;

export default function TurnoForm({ turnoInicial, onSubmit }) {
  const modoEdicion = Boolean(turnoInicial);

  const [clienteNombre, setClienteNombre] = useState(turnoInicial?.clienteNombre ?? '');
  const [servicioId, setServicioId] = useState(turnoInicial?.servicioId ?? null);
  const [fechaHora, setFechaHora] = useState(() =>
    turnoInicial ? fechaHoraDesdeStrings(turnoInicial.fecha, turnoInicial.hora) : new Date()
  );
  const [estado, setEstado] = useState(turnoInicial?.estado ?? ESTADOS_TURNO.PENDIENTE);
  const [mostrarPickerFecha, setMostrarPickerFecha] = useState(false);
  const [mostrarPickerHora, setMostrarPickerHora] = useState(false);
  const [errores, setErrores] = useState({});

  function manejarCambioFecha(evento, seleccionada) {
    setMostrarPickerFecha(false);
    if (evento.type === 'dismissed' || !seleccionada) return;
    setFechaHora((previo) => {
      const actualizado = new Date(previo);
      actualizado.setFullYear(seleccionada.getFullYear(), seleccionada.getMonth(), seleccionada.getDate());
      return actualizado;
    });
  }

  function manejarCambioHora(evento, seleccionada) {
    setMostrarPickerHora(false);
    if (evento.type === 'dismissed' || !seleccionada) return;
    setFechaHora((previo) => {
      const actualizado = new Date(previo);
      actualizado.setHours(seleccionada.getHours(), seleccionada.getMinutes(), 0, 0);
      return actualizado;
    });
  }

  function validar() {
    const nuevosErrores = {};
    if (!clienteNombre.trim()) {
      nuevosErrores.clienteNombre = 'Ingresá el nombre del cliente.';
    }
    if (!servicioId) {
      nuevosErrores.servicioId = 'Seleccioná un servicio.';
    }
    if (!modoEdicion && fechaHora.getTime() < Date.now() - MARGEN_TOLERANCIA_MS) {
      nuevosErrores.fechaHora = 'Elegí una fecha y hora que no sean anteriores al momento actual.';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function manejarConfirmar() {
    if (!validar()) return;
    const datos = {
      clienteNombre: clienteNombre.trim(),
      servicioId,
      fecha: aFechaString(fechaHora),
      hora: aHoraString(fechaHora),
    };
    if (modoEdicion) {
      datos.estado = estado;
    }
    onSubmit(datos);
  }

  return (
    <View style={styles.container}>
      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Cliente</Text>
        <TextInput
          style={styles.input}
          value={clienteNombre}
          onChangeText={setClienteNombre}
          placeholder="Nombre del cliente"
          placeholderTextColor="#999"
        />
        {errores.clienteNombre && <Text style={styles.error}>{errores.clienteNombre}</Text>}
      </View>

      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Servicio</Text>
        <ServicioSelector servicioIdSeleccionado={servicioId} onSeleccionar={setServicioId} />
        {errores.servicioId && <Text style={styles.error}>{errores.servicioId}</Text>}
      </View>

      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Fecha y hora</Text>
        <View style={styles.filaFechaHora}>
          <Pressable style={styles.selectorFechaHora} onPress={() => setMostrarPickerFecha(true)}>
            <Text style={styles.selectorFechaHoraTexto}>{formatearFecha(fechaHora)}</Text>
          </Pressable>
          <Pressable style={styles.selectorFechaHora} onPress={() => setMostrarPickerHora(true)}>
            <Text style={styles.selectorFechaHoraTexto}>{formatearHora(fechaHora)}</Text>
          </Pressable>
        </View>
        {errores.fechaHora && <Text style={styles.error}>{errores.fechaHora}</Text>}
        {mostrarPickerFecha && (
          <DateTimePicker value={fechaHora} mode="date" onChange={manejarCambioFecha} />
        )}
        {mostrarPickerHora && (
          <DateTimePicker value={fechaHora} mode="time" onChange={manejarCambioHora} />
        )}
      </View>

      {modoEdicion && (
        <View style={styles.campo}>
          <Text style={styles.etiqueta}>Estado</Text>
          <EstadoSelector estadoSeleccionado={estado} onSeleccionar={setEstado} />
        </View>
      )}

      <Pressable style={styles.botonGuardar} onPress={manejarConfirmar}>
        <Text style={styles.botonGuardarTexto}>
          {modoEdicion ? 'Guardar cambios' : 'Guardar turno'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  campo: {
    marginBottom: 20,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#222',
  },
  filaFechaHora: {
    flexDirection: 'row',
    gap: 8,
  },
  selectorFechaHora: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectorFechaHoraTexto: {
    fontSize: 14,
    color: '#222',
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    color: '#c0392b',
  },
  botonGuardar: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
