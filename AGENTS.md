# AGENTS.md — Agenda de Turnos para Barbería

Este archivo documenta las convenciones del proyecto para cualquier agente de codificación IA
(Claude Code, GitHub Copilot, etc.) que trabaje sobre este repositorio. Las reglas completas y
su justificación están en `.specify/memory/constitution.md`; esto es un resumen operativo.

# Expo

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## Stack fijo

- **Expo** (SDK 54) + **expo-router** para navegación por sistema de archivos.
- **JavaScript** — este proyecto NO usa TypeScript. No agregar archivos `.ts`/`.tsx`.
- Sin backend real: los datos vienen de mocks en `services/`, con latencia simulada de
  500-1000ms (`Promise` + `setTimeout`).
- Estado de turnos en memoria durante la sesión, como variable de módulo (singleton) en
  `services/turnosService.js`. **No usar Context API, Redux, Zustand ni ninguna librería de
  manejo de estado externa** — se prioriza la simplicidad para que el código sea fácil de
  explicar en la defensa oral individual del TP.
- `AsyncStorage` es **opcional**, no obligatorio, para persistencia local.

## Estructura de carpetas

```
app/            # Pantallas — una ruta de expo-router por archivo
components/     # Componentes reutilizables entre pantallas
services/       # Mocks (simulan backend) — getTurnos, createTurno, etc.
constants/      # Catálogo fijo de servicios y enum de estados de turno
specs/          # Documentos de Spec-Driven Development (spec, plan, tasks)
```

## Convenciones de código

- Componentes funcionales con hooks (nada de componentes de clase).
- Un componente = una responsabilidad. Si un archivo mezcla obtención de datos, estilos y
  lógica de negocio sin relación entre sí, dividirlo.
- Nomenclatura de archivos: `PascalCase` para componentes (`TurnoCard.js`), `camelCase` para
  servicios y utilidades (`turnosService.js`).
- Todo texto de la interfaz (`<Text>`) debe usar el componente `AppText` (`components/AppText.js`)
  en lugar del `Text` nativo de React Native — soluciona un bug de recorte de texto conocido de
  React Native 0.81 en Android.
- Toda operación asíncrona (cargar o guardar datos) debe mostrar explícitamente sus estados de
  carga (`LoadingState`) y vacío (`EmptyState`) — nunca dejar una pantalla en blanco.
- Usar `useFocusEffect` (no `useEffect`) para recargar datos en pantallas a las que se puede
  volver navegando "atrás", ya que expo-router no remonta la pantalla anterior.

## Idioma

- Código, nombres de variables/funciones y comentarios: **español**.
- Mensajes de error y textos de la interfaz: español, en tono imperativo consistente (ej.
  "Elegí un servicio.", no "Debe elegir un servicio." ni mezclar formas).

## Flujo de Git

- No commitear directo a `main`. Trabajar en ramas de feature (`feature/nombre-descriptivo`).
- Un commit por tarea de `tasks.md`, referenciando su número (ej.
  `feat: T010-T012 - EmptyState, TurnoCard y listado`).
- Pull request revisado y aprobado por el otro integrante antes de mergear a `main`.

## Qué NO hacer (fuera de alcance del TP)

- No agregar login ni autenticación de usuarios.
- No agregar funcionalidad de pagos.
- No agregar notificaciones push.
- No agregar validación de superposición de horarios entre turnos (decisión tomada: se permite,
  queda a criterio del barbero).
- No agregar una pantalla de gestión del catálogo de servicios (el catálogo es fijo).