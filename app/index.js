import { router, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import TurnoCard from '../components/TurnoCard';
import { getServicios } from '../services/serviciosService';
import { getTurnos } from '../services/turnosService';

export const options = {
  title: 'Agenda de Turnos',
  headerRight: () => (
    <Pressable onPress={() => router.push('/turno/nuevo')} hitSlop={8} style={styles.botonNuevo}>
      <Text style={styles.botonNuevoTexto}>+ Nuevo</Text>
    </Pressable>
  ),
};

const VISTA_DIA = 'dia';
const VISTA_SEMANA = 'semana';

function pad(numero) {
  return String(numero).padStart(2, '0');
}

function aFechaString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function fechaDesdeString(fechaStr) {
  const [anio, mes, dia] = fechaStr.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function inicioDeSemana(date) {
  const resultado = new Date(date);
  const diaSemana = resultado.getDay();
  const offset = diaSemana === 0 ? -6 : 1 - diaSemana;
  resultado.setDate(resultado.getDate() + offset);
  return resultado;
}

function formatearEncabezadoDia(fechaStr) {
  const texto = fechaDesdeString(fechaStr).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function ordenarPorHora(turnos) {
  return [...turnos].sort((a, b) => a.hora.localeCompare(b.hora));
}

export default function ListadoTurnosScreen() {
  const router = useRouter();
  const [vista, setVista] = useState(VISTA_DIA);
  const [turnos, setTurnos] = useState([]);
  const [mapaServicios, setMapaServicios] = useState({});
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(() => {
    setCargando(true);
    Promise.all([getTurnos(), getServicios()])
      .then(([turnosCargados, servicios]) => {
        setTurnos(turnosCargados);
        setMapaServicios(
          servicios.reduce((mapa, servicio) => {
            mapa[servicio.id] = servicio.nombre;
            return mapa;
          }, {})
        );
      })
      .finally(() => setCargando(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  if (cargando) {
    return <LoadingState mensaje="Cargando turnos..." />;
  }

  const hoyStr = aFechaString(new Date());

  let secciones;
  if (vista === VISTA_DIA) {
    const turnosDeHoy = ordenarPorHora(turnos.filter((turno) => turno.fecha === hoyStr));
    secciones = turnosDeHoy.length > 0 ? [{ title: 'Hoy', data: turnosDeHoy }] : [];
  } else {
    const inicio = inicioDeSemana(new Date());
    const diasSemana = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + i);
      return aFechaString(fecha);
    });
    secciones = diasSemana
      .map((fechaStr) => ({
        title: formatearEncabezadoDia(fechaStr),
        data: ordenarPorHora(turnos.filter((turno) => turno.fecha === fechaStr)),
      }))
      .filter((seccion) => seccion.data.length > 0);
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggle}>
        <Pressable
          style={[styles.toggleBoton, vista === VISTA_DIA && styles.toggleBotonActivo]}
          onPress={() => setVista(VISTA_DIA)}
        >
          <Text style={[styles.toggleTexto, vista === VISTA_DIA && styles.toggleTextoActivo]}>
            Día
          </Text>
        </Pressable>
        <Pressable
          style={[styles.toggleBoton, vista === VISTA_SEMANA && styles.toggleBotonActivo]}
          onPress={() => setVista(VISTA_SEMANA)}
        >
          <Text style={[styles.toggleTexto, vista === VISTA_SEMANA && styles.toggleTextoActivo]}>
            Semana
          </Text>
        </Pressable>
      </View>

      {secciones.length === 0 ? (
        <EmptyState
          mensaje={
            vista === VISTA_DIA
              ? 'No hay turnos agendados para hoy.'
              : 'No hay turnos agendados para esta semana.'
          }
        />
      ) : (
        <SectionList
          sections={secciones}
          keyExtractor={(turno) => turno.id}
          renderItem={({ item }) => (
            <TurnoCard
              turno={item}
              nombreServicio={mapaServicios[item.servicioId] ?? 'Servicio'}
              onPress={() => router.push(`/turno/${item.id}`)}
            />
          )}
          renderSectionHeader={({ section }) =>
            vista === VISTA_SEMANA ? <Text style={styles.encabezadoSeccion}>{section.title}</Text> : null
          }
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  toggle: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  toggleBoton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  toggleBotonActivo: {
    backgroundColor: '#222',
  },
  toggleTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  toggleTextoActivo: {
    color: '#fff',
  },
  lista: {
    paddingBottom: 24,
  },
  encabezadoSeccion: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    textTransform: 'capitalize',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  botonNuevo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  botonNuevoTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007aff',
  },
});
