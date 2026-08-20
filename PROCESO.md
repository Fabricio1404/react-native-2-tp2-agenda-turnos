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

### T015-T018 — ServicioSelector, TurnoForm (alta) y pantalla de nuevo turno

**Prompt usado**: "Dale, segui con las tareas T015, T016, T017 y T018. Son el ServicioSelector,
el TurnoForm en modo alta, la pantalla de nuevo turno y conectar la navegación desde el listado.
Fijate en tasks.md, plan.md y en lo que ya está armado en services/, components/ y app/ antes de
arrancar."

**Qué generó**:
- `components/ServicioSelector.js`: carga `getServicios()` y muestra el catálogo como chips
  seleccionables, con su propio indicador de carga chico (no el `LoadingState` de pantalla
  completa, para no romper el layout del formulario mientras carga).
- `components/TurnoForm.js`: formulario compartido de alta/edición, ya preparado para recibir un
  `turnoInicial` opcional (precarga) pensando en la futura edición (US4/T020), aunque todavía sin
  el selector de estado. Incluye campo cliente, `ServicioSelector`, selectores de fecha/hora con
  `@react-native-community/datetimepicker`, y validación de campos obligatorios + fecha/hora no
  pasada, con mensajes de error específicos (FR-006, FR-007, FR-008).
- `app/turno/nuevo.js`: usa `TurnoForm` en modo alta, llama a `createTurno(datos)` al confirmar,
  muestra `LoadingState` durante el guardado simulado y vuelve al listado con `router.back()`.
- `app/index.js`: se agregó el botón "+ Nuevo" en el header (navega a `turno/nuevo`).

**Qué corregimos**: se detectó que el listado usaba `useEffect` para cargar los datos una sola
vez al montar la pantalla — pero como expo-router no vuelve a montar la pantalla anterior al
navegar "atrás", un turno recién creado no aparecería en el listado hasta reiniciar la app. Se
corrigió reemplazando `useEffect` por `useFocusEffect`, que recarga los datos cada vez que la
pantalla vuelve a estar en foco, cumpliendo FR-011 y SC-004 (el turno creado debe verse
inmediatamente en el listado).

**Cómo lo verificamos**: `eslint` sin errores en los 4 archivos, y prueba manual en el teléfono:
crear un turno nuevo con datos válidos y confirmar que aparece en el listado sin reiniciar la
app; intentar guardar con campos vacíos o fecha pasada y confirmar que se rechaza con el mensaje
correspondiente.

**Commit**: `feat: T015-T018 - selector de servicio, formulario de alta y navegacion`

### T019-T022 — EstadoSelector, TurnoForm (edición) y pantalla de editar turno

**Prompt usado**: "Dale, segui con las tareas T019, T020, T021 y T022. Son el EstadoSelector,
extender el TurnoForm para que soporte modo edición, la pantalla de editar turno y conectar el
botón 'Editar' desde el detalle. Fijate en tasks.md, plan.md y en lo que ya está armado antes de
arrancar."

**Qué generó**:
- `components/EstadoSelector.js`: selector de estado (chips), usando `ESTADOS_TURNO_LISTA`, con
  el mismo estilo visual que `ServicioSelector` para mantener consistencia de UX.
- `components/TurnoForm.js` extendido: agrega `modoEdicion = Boolean(turnoInicial)`; en ese modo
  precarga el estado del turno y muestra `EstadoSelector` (oculto en modo alta); el botón cambia
  su texto a "Guardar cambios"; el campo `estado` solo se incluye en los datos enviados cuando
  está en modo edición (en alta lo asigna el service automáticamente).
- `app/turno/editar/[id].js` (nuevo, ruta hermana de `turno/[id].js`, no anidada, tal como se
  definió en el plan): precarga el turno con `getTurnoById(id)`, usa `TurnoForm` en modo edición,
  llama a `updateTurno(id, datos)` y vuelve al detalle con `router.back()`.
- `app/turno/[id].js`: se agregó el botón "Editar" en el header (vía `Stack.Screen` con
  `headerRight` dinámico) que navega a `/turno/editar/${id}`.

**Qué corregimos**: mismo problema detectado en T018 pero ahora en la pantalla de detalle — se
cambió `useEffect` por `useFocusEffect`, porque al volver de editar un turno (`router.back()`),
expo-router no remonta la pantalla de detalle, así que sin este cambio seguiría mostrando los
datos viejos hasta reiniciar la app, violando FR-021 (los cambios deben reflejarse de inmediato).

**Cómo lo verificamos**: `eslint` sin errores en los 4 archivos, y prueba manual en el teléfono:
editar un turno cambiando solo el estado, guardar, y confirmar que el cambio se ve reflejado
tanto en el detalle como en el listado sin reiniciar la app; repetir las validaciones de campos
vacíos y fecha inválida ya probadas en el alta.

**Commit**: `feat: T019-T022 - EstadoSelector, TurnoForm modo edicion y pantalla de editar turno`

**Con esto quedan completas las 4 historias de usuario (T001-T022).** Falta la fase de Polish
(T023-T025): revisión de consistencia de mensajes de error, confirmación de manejo de estados de
carga en las 4 pantallas, y prueba manual completa contra `quickstart.md`.

### T023-T025 — Polish: mensajes, estados de carga y validación end-to-end

**Prompt usado**: "Dale, seguí con las tareas T023, T024 y T025."

**T023 — Consistencia de mensajes de error**: se detectó que dos mensajes de `TurnoForm.js`
usaban modo imperativo ("Ingresá...", "Seleccioná...") y el de fecha/hora era una oración
declarativa distinta ("La fecha y hora no pueden ser..."). Se unificó todo a modo imperativo
("Elegí una fecha y hora que no sean anteriores al momento actual.").

**T024 — Estados de carga**: se repasaron las 4 pantallas; todas ya manejaban `LoadingState`/
`EmptyState` explícitamente, sin pantallas en blanco. No hizo falta modificar código.

**T025 — Validación end-to-end**: sin acceso a emulador en el entorno de la IA, se hizo en su
lugar: lint completo, un `npx expo export` real para forzar el bundling de las 4 pantallas, y un
trace manual del código contra cada escenario de `quickstart.md`. Esto encontró y corrigió 3
problemas reales que la revisión de archivos sueltos no había detectado:

1. **El proyecto nunca había hecho un build completo**: faltaban `babel.config.js`,
   `babel-preset-expo`, `expo-linking` y `react-native-safe-area-context` (dependencias que
   `expo-router` necesita), y `react-native-screens` había quedado en una versión incompatible
   con el SDK 54. Se instalaron/fijaron las versiones correctas y se agregó `babel.config.js`.
2. **Bug de validación en el alta**: la fecha/hora por defecto se precargaba como "ahora" al
   abrir el formulario; si el barbero tardaba más de unos segundos en completarlo, esa fecha
   quedaba en el pasado respecto al momento de guardar y rechazaba turnos válidos. Se agregó un
   margen de tolerancia de 5 minutos.
3. **Conflicto entre `data-model.md` y `spec.md`**: la regla "no permitir fecha pasada" heredada
   del alta impedía cumplir el escenario central de Historia 4 (marcar un turno como
   "completado" después de que su horario ya pasó, sin tocar la fecha). Se decidió que esa
   validación solo aplique al crear un turno, no al editarlo.

**Bug adicional encontrado al probar en el teléfono (no detectado por el análisis de código)**:
al probar la app en un dispositivo Android real, se encontraron dos problemas visuales:
- El header del listado mostraba **"index"** en vez de "Agenda de Turnos" — causado por usar
  `export const options` estático en `app/index.js`, que `expo-router` no aplica correctamente en
  ese contexto. Se corrigió reemplazándolo por `<Stack.Screen options={...}>` renderizado dentro
  del componente, el mismo patrón ya usado en `app/turno/[id].js`.
- **El texto se cortaba en el último carácter** en varios lugares ("10:0" en vez de "10:00",
  "Pendient" en vez de "Pendiente", "Cort" en vez de "Corte"). Se investigó la causa (no era un
  problema de ancho fijo ni de estilos): es un bug conocido de React Native 0.81 en Android,
  donde el motor de texto mide el ancho con el "advance width" pero pinta con el ancho real del
  glifo, recortando el último carácter en texto con negrita/seminegrita. Se aplicó el fix de la
  comunidad, `textBreakStrategy="simple"`, en los `Text` afectados de `TurnoCard.js`,
  `ServicioSelector.js` y `EstadoSelector.js`.

**Cómo lo verificamos**: `eslint` sin errores, `npx expo export` bundlea limpio (992 módulos), y
prueba manual completa en un teléfono Android real, confirmando que el header y los textos ya no
se cortan.

**Commit**: `fix: T023-T025 polish - titulo de header y texto cortado en Android (RN 0.81)`

**Corrección adicional (segundo intento)**: el primer fix (`textBreakStrategy="simple"` aplicado
a mano en `TurnoCard.js`, `ServicioSelector.js` y `EstadoSelector.js`) **no resolvió el
problema** — al probar de nuevo en el teléfono, el texto seguía cortándose exactamente igual en
todos lados ("10:0", "Pendient", "Cort", "Dí", "Seman", etc.), incluyendo componentes que ese
primer intento no había tocado. Se identificó que el bug afectaba a **todo texto corto en
negrita de la app**, no a componentes puntuales, así que aplicar el arreglo componente por
componente era propenso a dejar casos sin cubrir (como efectivamente pasó).

**Solución definitiva**: se creó un componente wrapper, `components/AppText.js`, que envuelve el
`Text` de React Native aplicando el arreglo (`textBreakStrategy="simple"` + ajuste de fuente) una
única vez. Se reemplazaron **todos** los usos de `Text` por `AppText` en toda la app
(`app/index.js`, `app/turno/[id].js`, `app/turno/nuevo.js`, `app/turno/editar/[id].js`,
`components/TurnoCard.js`, `components/ServicioSelector.js`, `components/EstadoSelector.js`,
`components/TurnoForm.js`, `components/EmptyState.js`), en vez de aplicar el fix a mano en cada
archivo. Esto centraliza la solución: cualquier texto nuevo que se agregue a futuro usando
`AppText` en vez de `Text` queda arreglado automáticamente.

**Cómo lo verificamos**: prueba manual completa en el teléfono, confirmando que ya no se corta
ningún texto en ninguna pantalla (listado, detalle, alta, edición), incluyendo los chips de
servicio/estado y los tabs Día/Semana.

**Commit**: `fix: crear AppText wrapper para solucionar texto cortado en toda la app (RN 0.81 Android)`

**Con esto quedan completas las 25 tareas planificadas (T001-T025), con el bug de texto cortado
resuelto de forma definitiva y centralizada.**

---


