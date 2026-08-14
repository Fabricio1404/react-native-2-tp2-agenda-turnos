# Feature Specification: Agenda de Turnos para Barbería

**Feature Branch**: `001-agenda-turnos-barberia`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Quiero hacer un sistema de agenda de turnos para una barbería. La usa el barbero/dueño para gestionar sus turnos (no es una app pública para que los clientes reserven solos). Necesito: una pantalla de listado de turnos del día/semana, una pantalla de detalle de cada turno (nombre del cliente, servicio, hora, estado), una pantalla de alta de turno nuevo con formulario (nombre cliente, servicio, fecha y hora, validando que los campos no estén vacíos y que la fecha/hora sea válida), y navegación entre todas las pantallas con expo-router. Los datos vienen de mocks locales con latencia simulada de 500-1000ms, sin backend real. Fuera de alcance: no hay login de usuarios, no hay pagos, no hay notificaciones push."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver la agenda de turnos del día/semana (Priority: P1)

El barbero abre la app y ve el listado de los turnos que tiene agendados, ya sea para el día
actual o para la semana, con la información esencial de cada uno (cliente, servicio, hora) de
un vistazo.

**Why this priority**: Es el valor central del producto: sin poder ver su agenda, el barbero no
puede organizar su jornada. Esta funcionalidad es útil por sí sola incluso con datos precargados
(mock), sin depender de que exista aún la pantalla de alta.

**Independent Test**: Puede probarse por completo cargando la app con turnos de ejemplo
(mockeados) y verificando que el barbero ve la lista del día actual, puede alternar a la vista
semanal, y ve los turnos agrupados/ordenados por hora.

**Acceptance Scenarios**:

1. **Given** existen turnos cargados para el día de hoy, **When** el barbero abre la pantalla de
   listado, **Then** ve todos los turnos de hoy ordenados por hora, cada uno con cliente,
   servicio y hora visibles.
2. **Given** el barbero está viendo el listado del día, **When** cambia a la vista semanal,
   **Then** ve los turnos de toda la semana organizados por día.
3. **Given** no hay turnos cargados para el día/semana seleccionado, **When** el barbero abre el
   listado, **Then** ve un mensaje indicando que no hay turnos, en lugar de una pantalla vacía
   sin explicación.

---

### User Story 2 - Ver el detalle de un turno (Priority: P2)

El barbero selecciona un turno del listado para ver toda su información antes de atender al
cliente: nombre, servicio, hora y estado del turno.

**Why this priority**: Complementa el listado dándole al barbero la confirmación completa de un
turno puntual antes de atender al cliente. Depende de que existan turnos para poder navegar a un
detalle, pero es independiente de la posibilidad de crear turnos nuevos.

**Independent Test**: Puede probarse por completo con turnos mockeados: tocar un turno del
listado y verificar que la pantalla de detalle muestra correctamente nombre del cliente,
servicio, hora y estado de ese turno específico.

**Acceptance Scenarios**:

1. **Given** el barbero está en el listado de turnos, **When** selecciona un turno, **Then** se
   abre la pantalla de detalle mostrando nombre del cliente, servicio, hora y estado de ese
   turno.
2. **Given** el barbero está en la pantalla de detalle de un turno, **When** presiona volver,
   **Then** regresa al listado en el mismo punto (día/semana) desde el que navegó.

---

### User Story 3 - Crear un turno nuevo (Priority: P3)

El barbero completa un formulario para agendar un turno nuevo, indicando nombre del cliente,
servicio, fecha y hora, y el sistema valida los datos antes de guardarlo.

**Why this priority**: Permite que la agenda crezca con turnos reales cargados por el barbero.
Se prioriza después de ver el listado y el detalle porque el listado ya aporta valor con datos
mockeados precargados, mientras que la alta es la funcionalidad que completa el ciclo de uso.

**Independent Test**: Puede probarse por completo abriendo el formulario de alta, completando
todos los campos con datos válidos, guardando, y verificando que el turno nuevo aparece en el
listado correspondiente a su fecha.

**Acceptance Scenarios**:

1. **Given** el barbero abre el formulario de alta, **When** completa nombre de cliente,
   servicio, fecha y hora válidos y confirma, **Then** el turno se guarda y aparece en el
   listado en la fecha correspondiente.
2. **Given** el barbero abre el formulario de alta, **When** intenta guardar dejando algún campo
   obligatorio vacío, **Then** el sistema impide guardar y muestra un mensaje indicando qué
   campo(s) faltan completar.
3. **Given** el barbero abre el formulario de alta, **When** ingresa una fecha y/u hora inválida
   (por ejemplo, una fecha inexistente o un horario mal formado), **Then** el sistema impide
   guardar y muestra un mensaje de error explicando el problema.
4. **Given** el barbero completó el formulario correctamente, **When** confirma el guardado,
   **Then** ve un indicador de carga mientras se simula la escritura de datos, y luego una
   confirmación de que el turno fue creado.

---

### User Story 4 - Editar un turno existente (Priority: P4)

El barbero abre un turno ya cargado y modifica cualquiera de sus datos (cliente, servicio,
fecha, hora o estado), reutilizando el mismo formulario que usa para dar de alta un turno nuevo,
pero precargado con los valores actuales del turno.

**Why this priority**: Permite corregir datos cargados por error y mantener actualizado el
estado de un turno (por ejemplo, marcarlo como completado o cancelado). Se prioriza después de
listado, detalle y alta porque depende de que ya exista un turno para poder editarlo, y no es
indispensable para el valor mínimo de la app (ver y crear turnos).

**Independent Test**: Puede probarse por completo con un turno mockeado existente: abrir su
edición, modificar uno o más campos (incluido el estado), guardar, y verificar que el listado y
el detalle reflejan los nuevos valores.

**Acceptance Scenarios**:

1. **Given** el barbero está en la pantalla de detalle de un turno, **When** elige editarlo,
   **Then** se abre el mismo formulario usado para el alta, precargado con el cliente, servicio,
   fecha, hora y estado actuales del turno.
2. **Given** el barbero está editando un turno, **When** modifica uno o más campos con datos
   válidos y confirma, **Then** el turno se actualiza y los nuevos valores se reflejan tanto en
   el listado como en la pantalla de detalle.
3. **Given** el barbero está editando un turno, **When** intenta guardar dejando algún campo
   obligatorio vacío o con una fecha/hora inválida, **Then** el sistema impide guardar y muestra
   el mismo tipo de mensaje de error que en el alta.
4. **Given** el barbero está editando un turno, **When** cambia únicamente el estado (por
   ejemplo, de "pendiente" a "completado") y confirma, **Then** el turno conserva el resto de
   sus datos y el nuevo estado se refleja de inmediato en detalle y listado.
5. **Given** el barbero está editando un turno, **When** navega hacia atrás sin confirmar,
   **Then** el turno conserva sus datos originales sin cambios.

---

### Edge Cases

- ¿Qué pasa si no hay turnos para el día o la semana seleccionada? El sistema debe mostrar un
  estado vacío explicativo, no una pantalla en blanco.
- ¿Qué pasa si el barbero intenta crear un turno con fecha/hora en el pasado? El sistema debe
  rechazar el guardado y explicar el motivo (ver Assumptions sobre el alcance de esta
  validación).
- ¿Qué pasa mientras los datos (mock) están cargando o guardándose (latencia simulada de
  500-1000ms)? El sistema debe mostrar un estado de carga visible en cada pantalla afectada.
- ¿Qué pasa si el barbero navega hacia atrás desde el formulario de alta sin guardar? Los datos
  ingresados se descartan y no se crea ningún turno.
- ¿Qué pasa si el barbero edita un turno y cancela sin guardar? El turno conserva sus datos
  originales, sin cambios.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE mostrar un listado de turnos del día actual, con cada turno
  mostrando al menos nombre del cliente, servicio y hora.
- **FR-002**: El sistema DEBE permitir alternar el listado entre una vista diaria y una vista
  semanal.
- **FR-003**: El sistema DEBE permitir seleccionar un turno del listado para navegar a su
  pantalla de detalle.
- **FR-004**: La pantalla de detalle DEBE mostrar nombre del cliente, servicio, hora y estado
  del turno seleccionado.
- **FR-005**: El sistema DEBE proveer un formulario de alta de turno con los campos: nombre del
  cliente, servicio, fecha y hora.
- **FR-006**: El sistema DEBE validar que ninguno de los campos obligatorios del formulario de
  alta esté vacío antes de permitir guardar el turno.
- **FR-007**: El sistema DEBE validar que la fecha y la hora ingresadas en el formulario de alta
  sean válidas (fecha existente, hora en formato válido, no anterior al momento actual) antes de
  permitir guardar el turno.
- **FR-008**: El sistema DEBE mostrar mensajes de error específicos cuando la validación del
  formulario falla, indicando qué corregir.
- **FR-009**: El sistema DEBE permitir la navegación entre el listado, el detalle de un turno y
  el formulario de alta, incluyendo volver a la pantalla anterior.
- **FR-010**: El sistema DEBE mostrar un indicador de carga visible mientras obtiene o guarda
  datos, simulando una latencia de red de entre 500 y 1000 ms.
- **FR-011**: Un turno recién creado DEBE quedar visible en el listado, en la fecha
  correspondiente, inmediatamente después de guardarse.
- **FR-012**: El sistema NO DEBE requerir inicio de sesión ni autenticación de usuarios.
- **FR-013**: El sistema NO DEBE incluir funcionalidad de pagos o cobros.
- **FR-014**: El sistema NO DEBE incluir notificaciones push.
- **FR-015**: El sistema DEBE permitir elegir el servicio del turno a partir de una lista
  predefinida de servicios del barbero (catálogo fijo, ej. "Corte", "Barba", "Corte + Barba"),
  no como texto libre.
- **FR-016**: El sistema NO DEBE impedir la creación de un turno cuyo horario se superponga con
  uno ya existente; los turnos superpuestos son responsabilidad del barbero y se permiten sin
  restricción ni advertencia bloqueante.
- **FR-017**: El sistema DEBE permitir acceder a la edición de un turno existente desde su
  pantalla de detalle.
- **FR-018**: El sistema DEBE reutilizar el mismo formulario del alta para editar un turno,
  precargado con los valores actuales del turno (cliente, servicio, fecha, hora y estado).
- **FR-019**: El sistema DEBE aplicar al editar un turno las mismas validaciones que al crearlo
  (campos obligatorios completos, fecha/hora válida) antes de permitir guardar los cambios.
- **FR-020**: El sistema DEBE permitir modificar el estado del turno (por ejemplo: pendiente,
  confirmado, completado, cancelado) como parte de la edición.
- **FR-021**: Los cambios guardados al editar un turno DEBEN reflejarse inmediatamente en el
  listado y en la pantalla de detalle correspondiente.

### Key Entities *(include if feature involves data)*

- **Turno**: Representa una cita agendada por el barbero. Atributos: nombre del cliente,
  servicio, fecha, hora y estado (por ejemplo: pendiente, confirmado, completado o cancelado).
- **Cliente**: Dato de texto asociado a un turno (nombre de la persona que será atendida); no es
  una cuenta de usuario del sistema.
- **Servicio**: Tipo de servicio de barbería asociado a un turno, elegido de un catálogo fijo
  predefinido (por ejemplo, corte, barba, corte + barba).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El barbero puede ver todos los turnos del día actual dentro de los 2 segundos
  posteriores a abrir la app (incluyendo la latencia simulada de datos).
- **SC-002**: El barbero puede completar y guardar un turno nuevo con datos válidos en menos de
  1 minuto desde que abre el formulario de alta.
- **SC-003**: El 100% de los intentos de guardar un turno con campos vacíos o fecha/hora
  inválida son rechazados, mostrando un mensaje de error claro y sin crear turnos incompletos o
  corruptos.
- **SC-004**: El barbero puede crear un turno y encontrarlo en el listado, en la fecha
  correspondiente, en el 100% de los casos, sin necesidad de reiniciar la app.
- **SC-005**: El barbero puede pasar del listado al detalle de cualquier turno visible en, como
  máximo, un toque/interacción.
- **SC-006**: El barbero puede editar un turno existente (incluyendo su estado) y ver los
  cambios reflejados en el listado y en el detalle en menos de 1 minuto desde que abre la
  edición.

## Assumptions

- Un único usuario (el barbero/dueño) usa la app; no existen múltiples roles ni cuentas, por lo
  que no se requiere pantalla de login.
- Los turnos tienen un estado (por ejemplo: pendiente, confirmado, completado, cancelado); un
  turno nuevo se crea inicialmente en estado "pendiente", y ese estado puede modificarse
  posteriormente mediante la edición del turno (Historia 4).
- La semana se muestra de lunes a domingo, siguiendo la convención local usada en Argentina.
- Los datos se sirven desde mocks locales en memoria, con latencia simulada de 500-1000 ms, sin
  backend real, según la constitución del proyecto. La persistencia de los turnos entre
  reinicios de la app (por ejemplo, mediante AsyncStorage) es opcional y no es un requisito
  obligatorio de esta primera versión.
- La validación de fecha/hora rechaza valores en el pasado respecto al momento actual, ya que no
  tendría sentido agendar un turno ya vencido.
- El sistema permite turnos con horarios superpuestos sin bloquear ni advertir; al ser un único
  barbero gestionando su propia agenda, la resolución de conflictos de horario queda a su
  criterio y está fuera de alcance de esta primera versión.
- El catálogo de servicios (ej. "Corte", "Barba", "Corte + Barba") es fijo y se define como parte
  de los datos mockeados; no se incluye en esta versión una pantalla para gestionar/editar el
  catálogo de servicios.
