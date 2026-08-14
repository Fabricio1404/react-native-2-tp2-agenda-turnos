import { SERVICIOS } from '../constants/servicios';

const MIN_LATENCIA_MS = 500;
const MAX_LATENCIA_MS = 1000;

function simularLatencia() {
  const ms = MIN_LATENCIA_MS + Math.random() * (MAX_LATENCIA_MS - MIN_LATENCIA_MS);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getServicios() {
  return simularLatencia().then(() => [...SERVICIOS]);
}
