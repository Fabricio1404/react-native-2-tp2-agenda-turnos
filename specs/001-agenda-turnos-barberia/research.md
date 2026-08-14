# Research: Agenda de Turnos para Barbería

**Feature**: `001-agenda-turnos-barberia` | **Date**: 2026-08-14

Este documento resuelve los puntos técnicos no cerrados por el usuario en el Technical Context
del plan, antes de pasar al diseño (Phase 1).

## 1. Versión de Expo / React Native

**Decision**: Expo SDK más reciente disponible al iniciar el proyecto (instalado vía
`create-expo-app` con el template en blanco de JavaScript), con `expo-router` como paquete de
navegación principal.

**Rationale**: El proyecto no tiene requisitos de compatibilidad con versiones antiguas de
Expo/React Native (es un proyecto nuevo, sin código previo). Empezar en la última versión estable
evita deuda técnica temprana y da acceso a las últimas APIs de `expo-router`.

**Alternatives considered**: Fijar una versión específica de antemano — descartado porque
agregaría un dato arbitrario sin beneficio; el equipo puede fijarla en el momento de ejecutar
`create-expo-app`, documentándola en el `package.json` que se genere.

## 2. Manejo de estado de los turnos (en memoria, durante la sesión)

**Decision**: El array de turnos vive como estado de módulo (singleton) directamente dentro de
`services/turnosService.js` — una variable a nivel de módulo, inicializada con datos mock al
cargarse por primera vez. No hay Context, Provider ni hook intermedio: cada pantalla llama
directamente a `getTurnos()`, `getTurnoById(id)`, `createTurno(datos)` o `updateTurno(id, datos)`
importadas del service.

**Rationale**: La constitución del proyecto (Principio I: Calidad de Código y Simplicidad) exige
evitar dependencias y abstracciones innecesarias. Los módulos de JavaScript/ES ya son
singletons cacheados por el bundler (Metro): un mismo `import` desde cualquier pantalla apunta a
la misma instancia del array en memoria, así que no hace falta React Context para "compartir"
ese estado — alcanza con que las pantallas vuelvan a pedir los datos (`getTurnos()` /
`getTurnoById(id)`) después de cada `createTurno`/`updateTurno` para reflejar los cambios. Esto
elimina una capa completa (Context + Provider + hook) sin perder funcionalidad.

**Alternatives considered**:
- *Redux/Zustand*: descartado por complejidad innecesaria para el alcance (YAGNI).
- *React Context + hook (`useTurnos`/`TurnosProvider`)*: descartado tras simplificar el plan —
  agregaba una capa de indirección (Provider en `_layout.js`, hook propio) que no aporta nada
  sobre importar el service directamente, dado que el array ya es un singleton de módulo.
- *Prop drilling puro*: descartado porque las pantallas están en rutas distintas de
  `expo-router` (no comparten árbol de props directo); importar el service resuelve esto sin
  necesidad de Context.

## 3. Selección de fecha y hora en el formulario

**Decision**: Usar `@react-native-community/datetimepicker` (el picker nativo estándar del
ecosistema Expo) para los campos de fecha y hora del formulario de alta/edición.

**Rationale**: Es el componente estándar recomendado por Expo para selección de fecha/hora
nativa en iOS/Android, evita reinventar un picker propio (alineado con Principio I) y da una UX
consistente con el sistema operativo (alineado con Principio II).

**Alternatives considered**: Inputs de texto libre para fecha/hora — descartado porque dificulta
cumplir FR-007 (validar que la fecha/hora sea válida) y empeora la UX frente a un picker nativo.

## 4. Estructura de navegación con expo-router (día/semana, detalle, alta, edición)

**Decision**: Una pantalla raíz (`app/index.js`) con el listado y un control para alternar entre
vista "día" y vista "semana" (estado local de la pantalla, no una ruta separada). Las otras 3
pantallas son rutas independientes dentro de `turno/`: `turno/[id].js` (detalle, solo lectura),
`turno/nuevo.js` (alta) y `turno/editar/[id].js` (edición). La edición es una ruta propia — no un
modo alternable dentro del detalle — pero **no está anidada bajo `[id].js`**: vive como segmento
hermano `editar/[id]` dentro de `turno/`, en vez de `turno/[id]/editar.js`.

**Rationale**: El TP exige un mínimo de 4 pantallas con navegación, por lo que detalle y edición
deben ser rutas separadas (no un toggle dentro de la misma pantalla). Ubicar la edición en
`turno/editar/[id].js` en lugar de `turno/[id]/editar.js` evita anidar la ruta de edición bajo la
de detalle (que forzaría pasar primero por `turno/[id]` en la jerarquía de archivos y complicaría
el layout de esa carpeta); como segmento hermano, `editar/[id]` es una ruta independiente y
explícita, mientras sigue reutilizando `TurnoForm` (FR-018) precargado con los datos del turno
`[id]`. El toggle día/semana no necesita ser una ruta propia porque no cambia el tipo de
pantalla, solo el filtro de datos mostrado.

**Alternatives considered**:
- *Edición como modo alternable dentro de `turno/[id].js` (sin ruta propia)*: descartada porque
  no cumple el requisito del TP de un mínimo de 4 pantallas/rutas de navegación.
- *Ruta anidada `turno/[id]/editar.js`*: descartada porque anida la edición bajo el detalle en
  el sistema de archivos, cuando ambas son conceptualmente rutas hermanas (dos vistas distintas
  del mismo turno, no una jerarquía padre-hijo).
- *Rutas separadas `app/dia.js` y `app/semana.js`*: descartado porque duplicaría la lógica de
  listado; un toggle de estado local es más simple y evita navegación innecesaria entre
  pantallas casi idénticas.

## 5. Reutilización del formulario para alta y edición

**Decision**: Un único componente `components/TurnoForm.js` que recibe un `turno` opcional
(valores iniciales) y un callback `onSubmit`. La ruta `turno/nuevo` lo instancia sin datos
iniciales (modo alta); la ruta `turno/editar/[id]` lo instancia precargado con los datos del
turno existente (modo edición, incluyendo el campo estado).

**Rationale**: Cumple directamente FR-018 (reutilizar el mismo formulario) y evita duplicar la
lógica de validación (FR-006, FR-007, FR-019) en dos lugares, alineado con Principio I.

**Alternatives considered**: Dos componentes de formulario separados con lógica duplicada —
descartado por violar DRY y el principio de simplicidad de la constitución.

## 6. Simulación de latencia en la capa de mocks

**Decision**: Las funciones del módulo `services/turnosService.js` (y `services/serviciosService.js`)
envuelven sus respuestas en una promesa con `setTimeout` de duración aleatoria entre 500 y
1000 ms antes de resolver, simulando una llamada de red real.

**Rationale**: Requisito explícito de la constitución del proyecto y de FR-010; centralizar la
simulación de latencia en la capa de servicios (en vez de en cada pantalla) evita duplicación y
hace trivial reemplazar los mocks por llamadas reales a un backend en el futuro sin tocar las
pantallas.

**Alternatives considered**: Simular la latencia directamente en los componentes de pantalla —
descartado porque mezclaría responsabilidades (UI + acceso a datos) en el mismo archivo,
violando Principio I.

## Resumen de NEEDS CLARIFICATION resueltos

Ninguno de los puntos anteriores quedó marcado como `NEEDS CLARIFICATION` en el Technical
Context final del plan: todas las decisiones técnicas necesarias para pasar a Phase 1 quedaron
resueltas arriba.
