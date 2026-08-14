# Contracts: Capa de servicios (mocks)

**Feature**: `001-agenda-turnos-barberia` | **Date**: 2026-08-14

El proyecto no expone ni consume APIs externas (sin backend real). El "contrato" relevante para
este feature es el de la capa de servicios mockeados en `services/`, que es el único punto de
acceso —tanto para leer como para escribir— al array de turnos en memoria. `turnosService.js`
mantiene ese array como estado de módulo (singleton): no hay Context, Provider ni hook
intermedio, las pantallas (`app/`) llaman directamente a las funciones exportadas del service.
Cualquier reemplazo futuro de estos mocks por un backend real debe preservar estas firmas.

Todas las funciones son asíncronas (retornan `Promise`) y simulan una latencia de red aleatoria
de 500 a 1000 ms antes de resolver o rechazar (ver `research.md` #6).

## `services/turnosService.js`

### `getTurnos()`

- **Entrada**: ninguna.
- **Salida**: `Promise<Turno[]>` — todos los turnos existentes (el filtrado por día/semana se
  hace en la UI, no en el servicio).
- **Errores**: no aplica en esta versión (los mocks no simulan fallas de red, solo latencia).

### `getTurnoById(id)`

- **Entrada**: `id: string`.
- **Salida**: `Promise<Turno | null>` — el turno correspondiente, o `null` si no existe.
- **Uso**: pantalla de detalle (US2) y precarga del formulario de edición (US4).

### `createTurno(datos)`

- **Entrada**: `datos: { clienteNombre, servicioId, fecha, hora }` (sin `id`, `estado` ni
  `creadoEn` — el servicio los genera; `estado` inicial siempre `pendiente`).
- **Salida**: `Promise<Turno>` — el turno creado, con `id`, `estado: "pendiente"` y `creadoEn`
  ya asignados.
- **Validación**: el servicio asume que los datos ya fueron validados por `TurnoForm` (campos no
  vacíos, fecha/hora válida y no pasada) antes de llamarlo; no re-valida internamente.

### `updateTurno(id, datos)`

- **Entrada**: `id: string`, `datos: { clienteNombre, servicioId, fecha, hora, estado }`
  (reemplaza todos los campos editables del turno existente dentro del array en memoria).
- **Salida**: `Promise<Turno>` — el turno actualizado.
- **Errores**: `Promise` rechazada si `id` no corresponde a ningún turno existente.
- **Uso**: pantalla de edición `app/turno/editar/[id].js` (US4), incluyendo el caso de cambiar
  solo el `estado` (FR-020).

## `services/serviciosService.js`

### `getServicios()`

- **Entrada**: ninguna.
- **Salida**: `Promise<Servicio[]>` — el catálogo fijo completo de servicios (ver
  `data-model.md`), leído desde `constants/servicios.js`.
- **Uso**: `ServicioSelector` dentro de `TurnoForm`, y para resolver `servicioId → nombre` al
  mostrar un turno en `TurnoCard` / detalle.

## Notas de consistencia

- Estas funciones son el único punto de acceso a los datos de turnos y servicios; ninguna
  pantalla o componente debe leer/escribir `constants/servicios.js` o el array en memoria de
  `turnosService.js` directamente (por ejemplo, mutando un array importado desde afuera del
  service), para mantener centralizada la simulación de latencia y la lógica de mutación
  (Principio I de la constitución).
- Como el array de turnos es una variable de módulo dentro de `turnosService.js` (y los módulos
  ES son singletons cacheados por Metro), cualquier pantalla que vuelva a llamar `getTurnos()` o
  `getTurnoById(id)` después de un `createTurno`/`updateTurno` ve automáticamente los datos ya
  actualizados, sin necesidad de un Context ni de propagar el estado manualmente (FR-011,
  FR-021). Cada pantalla es responsable de volver a pedir los datos tras una escritura (por
  ejemplo, al volver del alta o al confirmar una edición).
