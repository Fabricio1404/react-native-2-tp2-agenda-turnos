---

description: "Task list template for feature implementation"
---

# Tasks: Agenda de Turnos para Barbería

**Input**: Design documents from `/specs/001-agenda-turnos-barberia/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/services.md, quickstart.md

**Tests**: No se generan tareas de test automatizado — el plan define `Testing: Pruebas manuales
guiadas por quickstart.md`, sin framework automatizado en el alcance de esta versión (ver
`plan.md`, Technical Context).

**Organization**: Las tareas están agrupadas por historia de usuario (US1-US4, según prioridad
de `spec.md`) para permitir implementación y prueba independiente de cada una.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1, US2, US3, US4)
- Cada descripción incluye la ruta exacta del archivo

## Path Conventions

Proyecto Expo único (mobile-app), sin backend — rutas relativas a la raíz del repositorio, según
`plan.md` (Project Structure): `app/`, `components/`, `services/`, `constants/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto Expo y estructura base de carpetas.

- [ ] T001 Inicializar proyecto Expo (template en blanco de JavaScript) en la raíz del repositorio
      con `npx create-expo-app`, e instalar `expo-router` y
      `@react-native-community/datetimepicker` como dependencias principales, configurando el
      punto de entrada según `expo-router` (per `plan.md` Primary Dependencies)
- [ ] T002 [P] Crear la estructura base de carpetas `app/`, `app/turno/`, `app/turno/editar/`,
      `components/`, `services/`, `constants/` per `plan.md` Project Structure
- [ ] T003 [P] Configurar ESLint/Prettier del proyecto (configuración por defecto de Expo) per
      Constitución Principio I (Calidad de Código y Simplicidad)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura central que DEBE estar completa antes de implementar cualquier
historia de usuario (catálogo de datos, capa de mocks, navegación raíz).

**⚠️ CRÍTICO**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

- [ ] T004 [P] Crear `constants/estadosTurno.js` — enum de estados de un turno (`pendiente`,
      `confirmado`, `completado`, `cancelado`) per `data-model.md` (EstadoTurno)
- [ ] T005 [P] Crear `constants/servicios.js` — catálogo fijo de servicios (`id`, `nombre`, ej.
      "Corte", "Barba", "Corte + Barba") per `data-model.md` (Servicio)
- [ ] T006 [P] Crear `components/LoadingState.js` — indicador de carga reutilizable, usado por
      todas las pantallas durante operaciones async (500-1000ms) per Constitución Principio II
- [ ] T007 Crear `services/serviciosService.js` con `getServicios()` — retorna el catálogo desde
      `constants/servicios.js` simulando latencia aleatoria de 500-1000ms per
      `contracts/services.md` (depende de T005)
- [ ] T008 Crear `services/turnosService.js` — array de turnos en memoria (módulo singleton,
      seedeado con turnos mock de ejemplo) y las funciones `getTurnos()`, `getTurnoById(id)`,
      `createTurno(datos)` (asigna `id`, `estado: "pendiente"` y `creadoEn`) y
      `updateTurno(id, datos)`, cada una simulando latencia de 500-1000ms, per
      `contracts/services.md` y `data-model.md` (depende de T004 para el estado inicial)
- [ ] T009 [P] Crear `app/_layout.js` — Stack raíz de `expo-router` (sin Context/Provider, el
      estado vive en `turnosService.js`) per `plan.md` Project Structure

**Checkpoint**: Fundación lista — las historias de usuario pueden implementarse a continuación.

---

## Phase 3: User Story 1 - Ver la agenda de turnos del día/semana (Priority: P1) 🎯 MVP

**Goal**: El barbero abre la app y ve el listado de turnos de hoy o de la semana, con cliente,
servicio y hora de cada uno.

**Independent Test**: Abrir la app con turnos mock precargados, verificar que el listado del día
muestra los turnos de hoy ordenados por hora, alternar a vista semanal y verificar agrupación por
día, y verificar el estado vacío cuando no hay turnos.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Crear `components/EmptyState.js` — estado vacío reutilizable (mensaje
      cuando no hay turnos para el día/semana seleccionado) per spec.md Edge Cases
- [ ] T011 [P] [US1] Crear `components/TurnoCard.js` — tarjeta de turno (cliente, servicio, hora)
      reutilizable entre el listado y el detalle (US2) per `plan.md` Project Structure
- [ ] T012 [US1] Crear `app/index.js` — pantalla de listado con toggle día/semana, usando
      `getTurnos()` y `getServicios()` (para resolver `servicioId → nombre`), mostrando
      `LoadingState` mientras carga, `EmptyState` si no hay turnos, y `TurnoCard` por cada turno
      ordenado por hora (día) o agrupado por día (semana) per FR-001, FR-002 (depende de T006,
      T007, T008, T010, T011)

**Checkpoint**: User Story 1 completamente funcional y testeable de forma independiente — MVP
alcanzado.

---

## Phase 4: User Story 2 - Ver el detalle de un turno (Priority: P2)

**Goal**: El barbero toca un turno del listado y ve toda su información (cliente, servicio,
hora, estado).

**Independent Test**: Desde el listado, tocar un turno mock y verificar que el detalle muestra
correctamente sus datos completos; volver atrás y verificar que el listado conserva el día/semana
desde el que se navegó.

### Implementation for User Story 2

- [ ] T013 [US2] Crear `app/turno/[id].js` — pantalla de detalle usando `getTurnoById(id)` y
      `getServicios()`, mostrando `LoadingState` mientras carga y reutilizando `TurnoCard` como
      resumen junto con el estado del turno per FR-003, FR-004 (depende de T006, T008, T011)
- [ ] T014 [US2] Conectar la navegación desde `app/index.js`: al tocar un `TurnoCard` del
      listado, navegar a `app/turno/[id].js` con `router.push` per FR-003 (depende de T012, T013)

**Checkpoint**: User Stories 1 y 2 funcionan de forma independiente y en conjunto.

---

## Phase 5: User Story 3 - Crear un turno nuevo (Priority: P3)

**Goal**: El barbero completa un formulario (cliente, servicio, fecha, hora) y el sistema valida
los datos antes de guardar el turno.

**Independent Test**: Abrir el formulario de alta, intentar guardar vacío (debe rechazar),
intentar guardar con fecha/hora pasada (debe rechazar), completar con datos válidos y verificar
que el turno aparece en el listado con estado "pendiente".

### Implementation for User Story 3

- [ ] T015 [P] [US3] Crear `components/ServicioSelector.js` — selector del catálogo fijo de
      servicios, usando `getServicios()` per FR-015 (depende de T007)
- [ ] T016 [US3] Crear `components/TurnoForm.js` — formulario compartido de alta/edición (modo
      inicial "alta": campos cliente, servicio vía `ServicioSelector`, fecha y hora vía
      `@react-native-community/datetimepicker`), con validación de campos obligatorios no vacíos
      y de fecha/hora válida y no pasada, mostrando mensajes de error específicos per FR-005,
      FR-006, FR-007, FR-008 (depende de T015)
- [ ] T017 [US3] Crear `app/turno/nuevo.js` — usa `TurnoForm` en modo alta, llama a
      `createTurno(datos)` al confirmar, muestra `LoadingState` durante el guardado simulado y
      navega de vuelta al listado tras crear el turno per FR-010, FR-011 (depende de T006, T008,
      T016)
- [ ] T018 [US3] Conectar la navegación "Nuevo turno" desde `app/index.js` hacia
      `app/turno/nuevo.js` per FR-009 (depende de T012, T017)

**Checkpoint**: User Stories 1, 2 y 3 funcionan de forma independiente y en conjunto.

---

## Phase 6: User Story 4 - Editar un turno existente (Priority: P4)

**Goal**: El barbero edita cualquier dato de un turno existente (incluido el estado) reutilizando
el mismo formulario del alta, precargado con los valores actuales.

**Independent Test**: Desde el detalle de un turno mock, ir a editar, verificar que el formulario
aparece precargado, cambiar solo el estado y guardar, y verificar que el cambio se refleja en
detalle y listado; repetir validaciones de campos vacíos/fecha inválida; cancelar sin guardar y
verificar que no hay cambios.

### Implementation for User Story 4

- [ ] T019 [P] [US4] Crear `components/EstadoSelector.js` — selector de estado del turno, usando
      `constants/estadosTurno.js` per FR-020 (depende de T004)
- [ ] T020 [US4] Extender `components/TurnoForm.js` para soportar modo "edición": aceptar un
      `turno` inicial (precarga cliente, servicio, fecha, hora) y mostrar `EstadoSelector` solo
      en este modo, reutilizando la misma validación de FR-006/FR-007 per FR-018, FR-019, FR-020
      (depende de T016, T019)
- [ ] T021 [US4] Crear `app/turno/editar/[id].js` — pantalla de edición (ruta hermana de
      `turno/[id].js`, no anidada) que precarga el turno con `getTurnoById(id)`, usa `TurnoForm`
      en modo edición, y llama a `updateTurno(id, datos)` al confirmar, navegando de vuelta al
      detalle per FR-017, FR-021 (depende de T006, T008, T020)
- [ ] T022 [US4] Conectar la navegación "Editar" desde `app/turno/[id].js` hacia
      `app/turno/editar/[id].js` per FR-017 (depende de T013, T021)

**Checkpoint**: Las 4 historias de usuario funcionan de forma independiente y en conjunto.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan a más de una historia de usuario.

- [ ] T023 [P] Revisar consistencia de los mensajes de error de validación en
      `components/TurnoForm.js` (mismo estilo/tono para todos los campos) per FR-008
- [ ] T024 [P] Revisar que las 4 pantallas (`app/index.js`, `app/turno/[id].js`,
      `app/turno/nuevo.js`, `app/turno/editar/[id].js`) manejen explícitamente estados de carga
      sin pantallas en blanco per Constitución Principio II
- [ ] T025 Ejecutar manualmente todos los escenarios de `specs/001-agenda-turnos-barberia/quickstart.md`
      y confirmar que las 4 historias de usuario y los criterios de éxito (SC-001 a SC-006) se
      cumplen

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias — puede iniciar de inmediato
- **Foundational (Phase 2)**: depende de Setup — BLOQUEA todas las historias de usuario
- **User Stories (Phase 3-6)**: todas dependen de Foundational; entre sí pueden avanzar en
  paralelo si hay más de una persona, o en orden de prioridad (US1 → US2 → US3 → US4)
- **Polish (Phase 7)**: depende de que las historias de usuario deseadas estén completas

### User Story Dependencies

- **US1 (P1)**: puede iniciar tras Foundational — sin dependencia de otras historias
- **US2 (P2)**: puede iniciar tras Foundational; reutiliza `TurnoCard` creado en US1 (T011), pero
  es independientemente testeable con turnos mock precargados aunque US1 no tenga navegación
  cableada
- **US3 (P3)**: puede iniciar tras Foundational — sin dependencia funcional de US1/US2 (aunque en
  la práctica se navega desde el listado, per T018)
- **US4 (P4)**: depende de que exista `TurnoForm` (creado en US3, T016) para extenderlo en modo
  edición — es la única historia con dependencia directa de otra historia

### Parallel Opportunities

- T002 y T003 (Setup) en paralelo
- T004, T005, T006 y T009 (Foundational) en paralelo entre sí
- T010 y T011 (US1) en paralelo
- T015 (US3) puede iniciar en paralelo con tareas de otras historias ya habilitadas
- T019 (US4) puede iniciar en paralelo con T015/T016 de US3 si hay más de una persona, aunque
  T020 debe esperar a que T016 esté terminado
- T023 y T024 (Polish) en paralelo

---

## Parallel Example: Foundational Phase

```bash
# Lanzar en paralelo las tareas de datos/estado base:
Task: "Crear constants/estadosTurno.js — enum de estados de un turno"
Task: "Crear constants/servicios.js — catálogo fijo de servicios"
Task: "Crear components/LoadingState.js — indicador de carga reutilizable"
Task: "Crear app/_layout.js — Stack raíz de expo-router"
```

## Parallel Example: User Story 1

```bash
Task: "Crear components/EmptyState.js — estado vacío reutilizable"
Task: "Crear components/TurnoCard.js — tarjeta de turno reutilizable"
```

---

## Implementation Strategy

### MVP First (User Story 1 solamente)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloquea todas las historias)
3. Completar Phase 3: User Story 1
4. **DETENER y VALIDAR**: probar el listado de turnos de forma independiente (con datos mock)
5. Demostrar si está listo — ya cumple el valor central del producto

### Incremental Delivery

1. Setup + Foundational → fundación lista
2. Agregar US1 → probar independientemente → demo (¡MVP!)
3. Agregar US2 → probar independientemente → demo
4. Agregar US3 → probar independientemente → demo
5. Agregar US4 → probar independientemente → demo
6. Cada historia agrega valor sin romper las anteriores

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes entre sí
- [Story] mapea cada tarea a su historia de usuario para trazabilidad
- Sin tareas de test automatizado en esta versión (ver sección Tests arriba)
- Confirmar visualmente cada historia contra su Independent Test antes de pasar a la siguiente
- Evitar: tareas vagas, conflictos de archivo entre tareas paralelas, dependencias cruzadas entre
  historias que rompan su independencia (más allá de la reutilización documentada de US3 → US4)
