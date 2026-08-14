# Quickstart: Agenda de Turnos para Barbería

**Feature**: `001-agenda-turnos-barberia` | **Date**: 2026-08-14

Guía para levantar la app y validar manualmente que el feature funciona de punta a punta,
cubriendo las 4 historias de usuario del spec. No requiere backend ni configuración externa.

## Prerrequisitos

- Node.js y npm instalados.
- Expo CLI disponible (`npx expo` funciona sin instalación global).
- App **Expo Go** en un dispositivo físico, o un emulador/simulador iOS/Android configurado.

## Puesta en marcha

```bash
npm install
npx expo start
```

Escanear el código QR con Expo Go (dispositivo físico) o presionar `a` / `i` en la terminal para
abrir en un emulador Android / simulador iOS.

Al iniciar, la app debe cargar el listado de turnos mockeados (ver `data-model.md` y
`contracts/services.md`) tras el breve retraso simulado (500-1000ms), mostrando un indicador de
carga mientras tanto.

## Escenarios de validación

### 1. Ver la agenda (US1 — Listado día/semana)

1. Abrir la app → esperar el indicador de carga → ver el listado de turnos de **hoy**, ordenados
   por hora, cada uno con cliente, servicio y hora visibles.
2. Alternar a la vista **semanal** → ver los turnos agrupados por día de la semana.
3. **Resultado esperado**: si no hay turnos para el día/semana, se ve un mensaje de estado vacío,
   nunca una pantalla en blanco (referencia: `spec.md` Edge Cases).

### 2. Ver el detalle de un turno (US2)

1. Desde el listado, tocar cualquier turno.
2. **Resultado esperado**: se abre el detalle mostrando nombre del cliente, servicio, hora y
   estado. Volver atrás regresa al listado en el mismo punto (día/semana) desde el que se navegó.

### 3. Crear un turno nuevo (US3 — Alta)

1. Desde el listado, ir a "Nuevo turno".
2. Intentar guardar sin completar ningún campo → **debe** rechazar el guardado y mostrar qué
   campos faltan (FR-006).
3. Completar cliente, servicio (elegido del selector), fecha y hora con un valor **pasado** →
   **debe** rechazar el guardado explicando el problema (FR-007).
4. Completar todos los campos con datos válidos → confirmar → ver el indicador de carga
   (simulando el guardado) → volver al listado y encontrar el turno nuevo en la fecha
   correspondiente, con estado inicial "pendiente" (FR-011, SC-004).

### 4. Editar un turno existente (US4)

1. Desde el detalle de un turno, tocar "Editar" → navega a la pantalla de edición
   (`app/turno/editar/[id].js`), una ruta propia y separada del detalle.
2. **Resultado esperado**: se abre el mismo formulario usado en el alta (`TurnoForm`), precargado
   con los datos actuales del turno (incluido el estado).
3. Cambiar únicamente el estado (por ejemplo, a "completado") y guardar → el resto de los datos
   se mantiene, la app vuelve a la pantalla de detalle mostrando el turno actualizado, y el
   nuevo estado se refleja también en el listado al volver (FR-020, FR-021, SC-006).
4. Repetir el flujo de validación (campos vacíos / fecha-hora inválida) → debe comportarse igual
   que en el alta (FR-019).
5. Abrir la edición de un turno, modificar un campo, y navegar hacia atrás **sin** guardar → al
   volver al detalle, el turno debe conservar sus datos originales sin cambios.

### 5. Turnos superpuestos (comportamiento esperado, no un bug)

1. Crear dos turnos distintos con la misma fecha y hora.
2. **Resultado esperado**: ambos se guardan sin advertencia ni bloqueo (FR-016) — este es el
   comportamiento definido para esta versión, no una regresión a reportar.

## Qué NO debe estar presente

Confirmar explícitamente la ausencia de lo que quedó fuera de alcance (spec.md):

- Ninguna pantalla de login o registro de usuario.
- Ningún flujo de pago o cobro.
- Ninguna notificación push.

## Referencias

- Reglas de validación de campos: `data-model.md`
- Firmas de las funciones mockeadas usadas en estos flujos: `contracts/services.md`
- Requisitos funcionales completos: `spec.md` (sección Requirements)
