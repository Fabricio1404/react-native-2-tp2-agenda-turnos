import { ESTADOS_TURNO } from '../constants/estadosTurno';

const MIN_LATENCIA_MS = 500;
const MAX_LATENCIA_MS = 1000;

function simularLatencia() {
  const ms = MIN_LATENCIA_MS + Math.random() * (MAX_LATENCIA_MS - MIN_LATENCIA_MS);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pad(numero) {
  return String(numero).padStart(2, '0');
}

function aFecha(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function sumarDias(date, dias) {
  const resultado = new Date(date);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
}

const hoy = new Date();

let turnos = [
  {
    id: '1',
    clienteNombre: 'Juan Pérez',
    servicioId: '1',
    fecha: aFecha(hoy),
    hora: '10:00',
    estado: ESTADOS_TURNO.PENDIENTE,
    creadoEn: new Date().toISOString(),
  },
  {
    id: '2',
    clienteNombre: 'Martín Gómez',
    servicioId: '3',
    fecha: aFecha(hoy),
    hora: '11:30',
    estado: ESTADOS_TURNO.CONFIRMADO,
    creadoEn: new Date().toISOString(),
  },
  {
    id: '3',
    clienteNombre: 'Lucas Fernández',
    servicioId: '2',
    fecha: aFecha(hoy),
    hora: '16:00',
    estado: ESTADOS_TURNO.PENDIENTE,
    creadoEn: new Date().toISOString(),
  },
  {
    id: '4',
    clienteNombre: 'Sofía Díaz',
    servicioId: '1',
    fecha: aFecha(sumarDias(hoy, 1)),
    hora: '09:30',
    estado: ESTADOS_TURNO.PENDIENTE,
    creadoEn: new Date().toISOString(),
  },
  {
    id: '5',
    clienteNombre: 'Nicolás Ruiz',
    servicioId: '3',
    fecha: aFecha(sumarDias(hoy, 2)),
    hora: '15:00',
    estado: ESTADOS_TURNO.COMPLETADO,
    creadoEn: new Date().toISOString(),
  },
];

let siguienteId = turnos.length + 1;

export function getTurnos() {
  return simularLatencia().then(() => [...turnos]);
}

export function getTurnoById(id) {
  return simularLatencia().then(() => turnos.find((turno) => turno.id === id) ?? null);
}

export function createTurno(datos) {
  return simularLatencia().then(() => {
    const nuevoTurno = {
      id: String(siguienteId++),
      clienteNombre: datos.clienteNombre,
      servicioId: datos.servicioId,
      fecha: datos.fecha,
      hora: datos.hora,
      estado: ESTADOS_TURNO.PENDIENTE,
      creadoEn: new Date().toISOString(),
    };
    turnos = [...turnos, nuevoTurno];
    return nuevoTurno;
  });
}

export function updateTurno(id, datos) {
  return simularLatencia().then(() => {
    const indice = turnos.findIndex((turno) => turno.id === id);
    if (indice === -1) {
      throw new Error(`No existe un turno con id "${id}"`);
    }
    const turnoActualizado = {
      ...turnos[indice],
      clienteNombre: datos.clienteNombre,
      servicioId: datos.servicioId,
      fecha: datos.fecha,
      hora: datos.hora,
      estado: datos.estado,
    };
    turnos = turnos.map((turno, i) => (i === indice ? turnoActualizado : turno));
    return turnoActualizado;
  });
}
