# Implementation Plan: Agenda de Turnos para Barbería

**Branch**: `001-agenda-turnos-barberia` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-agenda-turnos-barberia/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Una app móvil de un solo usuario (el barbero/dueño) para gestionar su agenda de turnos, con 4
pantallas/rutas: listado de turnos del día/semana, detalle de un turno, alta de turno nuevo y
edición de un turno existente, esta última reutilizando el mismo formulario que el alta. Se
construye con Expo + expo-router en JavaScript, sin backend real: los datos (turnos y catálogo
de servicios) vienen de un módulo de mocks que simula latencia de red de 500-1000 ms. El array de
turnos vive como estado de módulo dentro de `services/turnosService.js` (sin Context ni
Provider), durante la sesión de la app (persistencia con AsyncStorage queda como mejora futura
opcional).

## Technical Context

**Language/Version**: JavaScript (ES2022+), sin TypeScript — según la constitución del proyecto.

**Primary Dependencies**: Expo (última SDK estable) + `expo-router` (navegación por sistema de
archivos) + `@react-native-community/datetimepicker` (selección de fecha/hora nativa). Sin
librería de manejo de estado externa ni Context/Provider: el array de turnos vive como estado de
módulo (singleton) dentro de `services/turnosService.js`, y cada pantalla lo consume llamando
directamente a las funciones exportadas del service (ver `research.md` #2).

**Storage**: N/A en esta versión — estado de turnos en memoria durante la sesión de la app.
AsyncStorage queda como mejora opcional futura, no requerida (ver constitución, sección
Restricciones de Desarrollo).

**Testing**: Pruebas manuales guiadas por `quickstart.md`. No se define un framework de testing
automatizado en el alcance de esta primera versión (ausencia de requisito explícito en la
constitución o en el spec; agregar uno sin una necesidad concreta violaría el Principio I —
Simplicidad/YAGNI).

**Target Platform**: App móvil Expo (iOS y Android) ejecutada vía Expo Go o build de desarrollo.

**Project Type**: mobile-app (proyecto Expo único, sin backend ni proyecto separado).

**Performance Goals**: Listado de turnos visible en menos de 2s incluyendo la latencia mock
(500-1000ms), acorde a SC-001; interacciones de UI fluidas a la tasa de refresco estándar de
React Native (sin requisito numérico adicional más allá de eso).

**Constraints**: Sin backend real (solo mocks locales con latencia simulada 500-1000ms); estado
de turnos en memoria (se reinicia al cerrar la app, salvo que se implemente la mejora opcional de
AsyncStorage); catálogo de servicios fijo y predefinido (no editable desde la app); turnos con
horarios superpuestos permitidos sin validación de conflicto (FR-016).

**Scale/Scope**: Un único usuario (el barbero/dueño), sin roles ni login; volumen de datos
esperado bajo (decenas de turnos por semana, típico de una barbería); 4 pantallas/rutas
funcionales (listado, detalle, alta, edición — requisito mínimo del TP), con el formulario de
alta y edición implementado como un único componente reutilizado por ambas rutas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Evaluación | Estado |
|-----------|------------|--------|
| I. Calidad de Código y Simplicidad | Sin librerías de estado externas, sin Context/Provider ni abstracciones extra: el estado vive directamente en `turnosService.js`; un solo componente de formulario reutilizado (`TurnoForm`) en vez de duplicarlo; lógica de mocks/latencia centralizada en `services/`, separada de la UI. | PASS |
| II. Consistencia de UX | Componentes compartidos (`TurnoCard`, `LoadingState`, `EmptyState`, `ServicioSelector`) reutilizados entre listado/detalle/formulario; toda operación async (listar, crear, editar) maneja explícitamente carga y error, sin pantallas en blanco. | PASS |
| III. Flujo de Trabajo Git y Revisiones | No aplica directamente a decisiones técnicas de este plan (es un requisito de proceso, no de arquitectura); se cumple en la ejecución de las tareas vía ramas de feature y PR revisado, no en el diseño técnico. | PASS (N/A a nivel de diseño) |

No hay violaciones que requieran justificación — se omite la sección Complexity Tracking.

**Re-chequeo post Phase 1**: `data-model.md` y `contracts/services.md` no introducen nuevas
dependencias, estado global adicional ni acoplamientos entre pantallas más allá de lo ya
evaluado arriba. Los tres principios se mantienen en **PASS** tras el diseño.

## Project Structure

### Documentation (this feature)

```text
specs/001-agenda-turnos-barberia/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/                          # Rutas de expo-router (una pantalla por archivo) — 4 pantallas
├── _layout.js                 # Stack raíz (sin Provider — el estado vive en turnosService.js)
├── index.js                   # 1. Listado de turnos, con toggle día/semana (US1)
└── turno/
    ├── [id].js                # 2. Detalle de turno, solo lectura (US2)
    ├── nuevo.js                # 3. Alta de turno — usa TurnoForm en modo alta (US3)
    └── editar/
        └── [id].js             # 4. Edición de turno — usa TurnoForm en modo edición (US4)

components/                   # Componentes reutilizables entre pantallas
├── TurnoCard.js                # Tarjeta de turno (listado)
├── TurnoForm.js                # Formulario compartido alta/edición (US3 + US4)
├── ServicioSelector.js         # Selector del catálogo fijo de servicios
├── EstadoSelector.js           # Selector de estado del turno (usado al editar)
├── LoadingState.js             # Estado de carga reutilizable
└── EmptyState.js               # Estado vacío reutilizable (listado sin turnos)

services/                     # Mocks locales (simulan backend) + estado en memoria
├── turnosService.js            # Array de turnos (módulo singleton) + getTurnos, getTurnoById,
│                                 createTurno, updateTurno (500-1000ms de latencia simulada)
└── serviciosService.js         # getServicios (catálogo fijo, con latencia simulada)

constants/                    # Datos/valores fijos del dominio
├── servicios.js                # Catálogo fijo de servicios (fuente de serviciosService)
└── estadosTurno.js             # Enum de estados posibles de un turno
```

**Structure Decision**: Proyecto Expo único (mobile-app), sin backend ni carpeta de API
separada — no aplica el layout de "Web application" ni "Mobile + API" del template genérico.
Se usa el layout estándar de `expo-router`: pantallas en `app/` (una por ruta), UI compartida en
`components/`, y valores fijos del dominio (catálogo de servicios, estados) en `constants/`. No
hay carpeta `hooks/` ni Context: el estado de turnos en memoria vive directamente como variable
de módulo dentro de `services/turnosService.js` (un único array compartido, ya que ES modules se
cachean/singleton por naturaleza), y listado, detalle y formulario lo leen/escriben llamando
directamente a las funciones exportadas del service — sin capa intermedia de Context ni
prop-drilling entre rutas. Se mantienen 4 pantallas/rutas separadas (requisito mínimo del TP):
la edición vive en `app/turno/editar/[id].js`, una ruta propia pero **no anidada bajo el
detalle** (no es `turno/[id]/editar.js`) — es un segmento hermano de `turno/[id].js` dentro de
`turno/`, que reutiliza `TurnoForm` precargado con los datos del turno indicado por `[id]`.

## Complexity Tracking

> No aplica — el Constitution Check no encontró violaciones que requieran justificación.
