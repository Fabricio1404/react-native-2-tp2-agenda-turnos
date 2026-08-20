# Documento del Proceso — Agenda de Turnos para Barbería (TP2, React Native II)

**Integrantes**: Fabricio [apellido] y [compañero]
**Repositorio**: https://github.com/Fabricio1404/react-native-2-tp2-agenda-turnos

---

## 1. Investigación

> (Completar acá las respuestas de la etapa 1 con sus propias palabras y fuentes citadas —
> React Native, Expo, SDD, Agentes de código y skills, Mocks. Ya tenemos el material armado en
> la conversación previa con Claude, solo falta pasarlo a este documento con las fuentes.)

---

## 2. Especificación y Planificación

### 2.1 Herramienta SDD elegida

Se utilizó **GitHub Spec Kit**, instalado con `uv` (`uv tool install specify-cli --from
git+https://github.com/github/spec-kit.git`) e integrado con **Claude Code** como agente de IA
(`specify init . --integration claude`).

### 2.2 Constitution

**Prompt inicial** (a través del comando `/speckit-constitution`, con selección guiada de
opciones):
- Principios elegidos: Code Quality & Simplicity, UX Consistency, Git Workflow & Reviews
- Tipo de proyecto: Small team (2-4)
- Fecha de ratificación: hoy (2026-08-14)

**Qué generó la IA**: un documento en inglés con 3 principios fundamentales, restricciones de
desarrollo con un `TODO(TECH_STACK)` pendiente (porque todavía no existía el proyecto de Expo),
y reglas de gobernanza/versionado.

**Qué corregimos**:
1. Pedimos que tradujera todo el documento al español y completara el TODO del stack con:
   Expo + expo-router, TypeScript, sin backend (mocks con latencia simulada 500-1000ms),
   AsyncStorage opcional. → versión 1.1.0
2. Detectamos que **no íbamos a usar TypeScript** — se lo pedimos corregir a JavaScript en toda
   la sección de Restricciones de Desarrollo. → versión 1.1.1 (versión final aprobada)

**Cómo lo verificamos**: leyendo el archivo completo generado en `.specify/memory/constitution.md`
y confirmando que no quedara ninguna mención residual a TypeScript.

**Commit**: `docs: ratify project constitution v1.1.1 (JS en vez de TypeScript)`

### 2.3 Especificación (spec.md)

**Prompt usado** (`/speckit-specify`):
> "Quiero hacer un sistema de agenda de turnos para una barbería. La usa el barbero/dueño para
> gestionar sus turnos (no es una app pública para que los clientes reserven solos). Necesito:
> una pantalla de listado de turnos del día/semana, una pantalla de detalle de cada turno
> (nombre del cliente, servicio, hora, estado), una pantalla de alta de turno nuevo con
> formulario (nombre cliente, servicio, fecha y hora, validando que los campos no estén vacíos y
> que la fecha/hora sea válida), y navegación entre todas las pantallas con expo-router. Los
> datos vienen de mocks locales con latencia simulada de 500-1000ms, sin backend real. Fuera de
> alcance: no hay login de usuarios, no hay pagos, no hay notificaciones push."

**Qué generó la IA**: una spec con 3 historias de usuario (listado, detalle, alta), criterios de
aceptación, edge cases, y 2 preguntas de aclaración (`[NEEDS CLARIFICATION]`):
1. ¿El servicio del turno es de una lista fija o texto libre?
2. ¿Se deben impedir turnos con horarios superpuestos?

**Qué corregimos**:
1. Respondimos: servicio = lista predefinida fija (opción A); turnos superpuestos = permitidos
   sin restricción (opción B) — decisión tomada en equipo pensando en simplicidad para el MVP.
2. Detectamos que la spec **solo cubría 3 pantallas**, y la consigna del TP exige un mínimo de
   4. Pedimos agregar una cuarta historia de usuario: **editar un turno existente**
   (reutilizando el mismo formulario del alta), y actualizar los Functional Requirements y
   Assumptions en consecuencia.

**Cómo lo verificamos**: releyendo la spec completa entre los dos integrantes, confirmando que
las 4 historias de usuario, los 21 Functional Requirements y los Success Criteria fueran
coherentes con lo que queríamos construir.

**Commit**: `docs: spec agenda de turnos (4 pantallas: listado, detalle, alta, edicion)`

### 2.4 Plan técnico (plan.md)

**Prompt usado** (`/speckit-plan`):
> "El proyecto usa Expo + expo-router con JavaScript. Estructura de carpetas: app/ para las
> pantallas (rutas de expo-router), components/ para componentes reutilizables (...),
> services/ para los mocks (...), y types/ o constants/ para el catálogo fijo de servicios. La
> pantalla de alta y edición de turno deben reutilizar el mismo componente de formulario. El
> estado de los turnos se maneja en memoria durante la sesión (...)."

**Qué generó la IA** (primera versión): estructura con Context API + Provider para el estado
global, y la pantalla de edición como ruta anidada bajo el detalle (`app/turno/[id]/editar.js`).

**Qué corregimos**: decidimos que, pensando en la defensa oral individual, convenía bajar la
complejidad técnica. Pedimos:
1. Sacar el Context API/Provider y reemplazarlo por un estado simple: el array de turnos como
   variable de módulo (singleton) directamente en `services/turnosService.js`.
2. Cambiar la ruta anidada de edición por una ruta hermana no anidada:
   `app/turno/editar/[id].js` en vez de `app/turno/[id]/editar.js` — manteniendo las 4 pantallas
   requeridas por la consigna, pero con una estructura de rutas más simple de explicar.

**Cómo lo verificamos**: revisamos la tabla de "Constitution Check" que genera el plan
automáticamente, confirmando que las 3 secciones (Calidad de Código, UX, Git Workflow) pasaran
en PASS sin violaciones.

**Commit**: `docs: plan tecnico agenda de turnos (4 pantallas, estado simple sin Context)`

### 2.5 Tareas (tasks.md)

**Comando usado**: `/speckit-tasks` (sin prompt adicional — tomó automáticamente spec.md y
plan.md ya commiteados).

**Qué generó la IA**: 25 tareas (T001-T025) organizadas en 7 fases: Setup, Foundational
(bloqueante), y una fase por cada historia de usuario (US1 a US4), más una fase de Polish final.
Incluye dependencias explícitas entre tareas y oportunidades de paralelización.

**Qué corregimos**: no fue necesario corregir el contenido — se revisó la coherencia con el plan
y se aprobó tal cual.

**Reparto acordado entre el equipo**:
- Setup + Foundational (T001-T009): ambos integrantes juntos (base compartida, bloqueante).
- US1 + US2 — listado y detalle (T010-T014): Fabricio.
- US3 + US4 — alta y edición (T015-T022): [compañero].
- Polish (T023-T025): ambos juntos al final.

**Commit**: `docs: tasks agenda de turnos (25 tareas, 4 historias de usuario)`

---

## 3. Setup

**Herramientas instaladas**:
- `uv` (gestor de paquetes Python) — necesario para instalar Spec Kit.
- `specify-cli` (GitHub Spec Kit) — vía `uv tool install specify-cli --from
  git+https://github.com/github/spec-kit.git`.
- Claude Code (`npm install -g @anthropic-ai/claude-code`) — agente de IA usado como integración
  de Spec Kit.

**Repositorio Git**: creado desde el primer commit (`inicio del proyecto`), con `.gitignore`
configurado para excluir `node_modules/`, `.expo/`, `.env` y `.claude/` (esta última por
seguridad: puede contener credenciales de sesión).

*(Agregar acá la captura de la app base corriendo en Expo Go en el teléfono, para cumplir el
requisito de la etapa 4.)*

---

## 4. Desarrollo

### T001 — Inicializar proyecto Expo

**Prompt/comando**: `npx create-expo-app@latest temp-app --template blank` (en carpeta
temporal, luego movido a la raíz del repo porque ya contenía `.specify/`, `.claude/`, etc.),
seguido de `npx expo install expo-router @react-native-community/datetimepicker`.

**Qué generó**: proyecto Expo base con `App.js`/`index.js` (entry point clásico).

**Qué corregimos/verificamos**: se probó que la app corriera en el teléfono vía Expo Go antes de
continuar.

**Commit**: `feat: T001 - inicializar proyecto Expo con expo-router y datetimepicker`

### T002-T003 — Estructura de carpetas y ESLint

**Comando**: `mkdir app, app\turno, app\turno\editar, components, services, constants` +
`npx expo lint`.

**Problemas encontrados y solución**:
- Conflicto de versiones de npm al instalar ESLint → resuelto con `--legacy-peer-deps`.
- El plugin de TypeScript de ESLint requería el paquete `typescript` instalado aunque no se
  fuera a usar para escribir código (el linter lo necesita para su chequeo de configuración) →
  se instaló como dependencia técnica (`npm install typescript --save-dev --legacy-peer-deps`).
- La versión más nueva de TypeScript (7.0) no era compatible con el plugin → se fijó una versión
  estable (`typescript@~5.6.0`).

**Commit**: `feat: T002-T003 - estructura de carpetas y configuracion de ESLint`

### T004-T005 — Constants (estados y servicios)

**Prompt usado**: "Creá el archivo constants/estadosTurno.js con un enum de estados de turno
(pendiente, confirmado, completado, cancelado) y constants/servicios.js con el catálogo fijo de
servicios (Corte, Barba, Corte + Barba), cada uno con id y nombre."

**Qué generó**: los dos archivos con la estructura pedida, más un array derivado
`ESTADOS_TURNO_LISTA` (útil para poblar el selector de estados en T019, sin duplicar valores).

**Cómo lo verificamos**: se contrastó contra `data-model.md` para confirmar que los campos
coincidieran con lo definido en el plan.

**Commit**: `feat: T004-T005 - constants de estados y catalogo de servicios`

### T006-T009 — Foundational (LoadingState, services de mocks, layout raíz)

**Prompt usado**: "Dale, segui con T006-T009: LoadingState.js, serviciosService.js,
turnosService.js y app/_layout.js."

**Qué generó**:
- `components/LoadingState.js`: indicador de carga reutilizable.
- `services/serviciosService.js` y `services/turnosService.js`: funciones que simulan latencia
  de 500-1000ms; `turnosService.js` mantiene el array de turnos en memoria (5 turnos mock de
  ejemplo) con `getTurnos`, `getTurnoById`, `createTurno`, `updateTurno`.
- `app/_layout.js`: Stack raíz de expo-router.

**Corrección adicional detectada por la IA (no pedida explícitamente)**: el proyecto todavía
tenía el entry point clásico de Expo (`App.js`/`index.js`, con `"main": "index.js"` en
`package.json`), lo cual hacía que `expo-router` —y por lo tanto `app/_layout.js`— no se
utilizara realmente. Se corrigió `"main"` a `"expo-router/entry"` y se eliminaron `App.js` e
`index.js` por quedar como código muerto. **Verificamos manualmente por qué era necesario este
cambio** antes de aceptarlo, entendiendo que expo-router necesita ese entry point específico
para leer las rutas desde la carpeta `app/`.

**Cómo lo verificamos**: se corrió `npx eslint` sobre los 4 archivos nuevos, sin errores.

**Commit**: `feat: T006-T009 - foundational (loading, services de mocks, layout raiz, fix entry point a expo-router)`

### T010-T012 — EmptyState, TurnoCard y pantalla de listado

**Prompt usado**: "Dale, segui con las tareas T010, T011 y T012. Son el EmptyState, la TurnoCard
y la pantalla de listado (app/index.js). Fijate bien en tasks.md y plan.md antes de arrancar, y
usá lo que ya está armado en services/ y components/."

**Qué generó**:
- `components/EmptyState.js`: estado vacío reutilizable, con mensaje configurable.
- `components/TurnoCard.js`: tarjeta de turno (hora, cliente, servicio), con una prop opcional
  `mostrarEstado` pensada para reutilizarse también en la pantalla de detalle (US2) sin duplicar
  el componente, y una prop `onPress` que por ahora queda sin cablear (la navegación real se
  conecta en T014).
- `app/index.js`: pantalla de listado con toggle Día/Semana. Carga `getTurnos()` y
  `getServicios()` en paralelo y arma un mapa `servicioId → nombre`. En vista semana, agrupa los
  turnos por día (lunes a domingo) calculando las fechas de forma local para evitar el
  corrimiento de zona horaria (UTC) que puede dar `Date` por defecto. Usa `SectionList` para
  ambos modos, mostrando `LoadingState` mientras carga y `EmptyState` si no hay turnos.

**Qué corregimos**: no fue necesario corregir nada — se revisó el código generado y se aprobó tal
cual, verificando que reutilizara componentes en vez de duplicar lógica.

**Cómo lo verificamos**: se corrió `eslint` sobre los 3 archivos nuevos (sin errores), y se
probó visualmente el toggle Día/Semana en el teléfono con los turnos mock precargados.

**Commit**: `feat: T010-T012 - EmptyState, TurnoCard y pantalla de listado`

### T013-T014 — Pantalla de detalle y navegación

**Prompt usado**: continuación directa tras T010-T012 (Claude Code encadenó T013 y T014 sin
prompt adicional, siguiendo el orden de `tasks.md`).

**Qué generó**:
- `app/turno/[id].js`: pantalla de detalle. Lee el `id` de la URL con `useLocalSearchParams`,
  carga `getTurnoById(id)` y `getServicios()` en paralelo. Muestra `LoadingState` mientras carga
  y, si el turno no existe, `EmptyState` con un mensaje explicativo (caso defensivo). Reutiliza
  `TurnoCard` (con `mostrarEstado`) como resumen, y usa `<Stack.Screen options={{ title }} />`
  para poner el nombre del cliente como título del header de forma dinámica.
- `app/index.js`: se agregó `onPress` a cada `TurnoCard` del listado, que navega con
  `router.push('/turno/${id}')` usando `useRouter` de expo-router.

**Qué corregimos**: no fue necesario corregir nada — se verificó que la navegación "volver"
restaurara el listado tal cual estaba (como pide el criterio de aceptación de US2), lo cual
funciona por defecto gracias a cómo expo-router maneja el Stack (no remonta la pantalla
anterior).

**Cómo lo verificamos**: `eslint` sin errores, y prueba manual en el teléfono: tocar un turno del
listado, ver el detalle completo, volver atrás y confirmar que el listado sigue en el mismo
día/semana desde el que se navegó.

**Commit**: `feat: T013-T014 - pantalla de detalle y navegacion desde el listado`

### T015-T018 — (en progreso)


---

## 5. Conclusiones
