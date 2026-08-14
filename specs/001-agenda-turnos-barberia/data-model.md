# Data Model: Agenda de Turnos para Barbería

**Feature**: `001-agenda-turnos-barberia` | **Date**: 2026-08-14

Todas las entidades viven únicamente en memoria durante la sesión (sin backend ni base de
datos), servidas a través del módulo de mocks descrito en `contracts/services.md`.

## Turno

Representa una cita agendada por el barbero. Es la entidad central del feature.

| Campo | Tipo | Obligatorio | Descripción / Reglas de validación |
|-------|------|-------------|-------------------------------------|
| `id` | string | sí (generado) | Identificador único del turno, generado al crearlo. No editable. |
| `clienteNombre` | string | sí | Nombre del cliente. No puede estar vacío ni ser solo espacios (FR-006). |
| `servicioId` | string | sí | Referencia a un `Servicio` del catálogo fijo (FR-015). Debe existir en el catálogo. |
| `fecha` | string (ISO `YYYY-MM-DD`) | sí | Fecha del turno. Debe ser una fecha calendario válida (FR-007). |
| `hora` | string (`HH:mm`, 24h) | sí | Hora del turno. Debe tener formato válido (FR-007). |
| `estado` | string (enum `EstadoTurno`) | sí | Uno de: `pendiente`, `confirmado`, `completado`, `cancelado`. Por defecto `pendiente` al crear (Assumptions). Editable en la Historia 4 (FR-020), sin restricciones de transición (cualquier estado puede pasar a cualquier otro). |
| `creadoEn` | string (ISO datetime) | sí (generado) | Marca de tiempo de creación, usada solo para orden/depuración interna, no se muestra como requisito funcional. |

**Reglas de validación combinadas** (aplican tanto al crear como al editar, FR-006/FR-007/FR-019):

- `clienteNombre`, `servicioId`, `fecha` y `hora` no pueden estar vacíos.
- La combinación `fecha` + `hora` debe representar un instante igual o posterior al momento
  actual (no se permiten turnos en el pasado — ver spec, sección Assumptions).
- No se valida superposición de horarios entre turnos (FR-016): un turno puede compartir
  fecha/hora con otro sin que el sistema lo impida ni lo advierta.

**Transiciones de estado**: no hay una máquina de estados estricta. `estado` es un campo de
selección libre entre los 4 valores del enum al editar un turno (FR-020); un turno nuevo siempre
inicia en `pendiente`.

## Servicio

Representa un tipo de servicio de barbería, parte de un catálogo fijo predefinido (FR-015). No
es editable desde la app en esta versión.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|--------------|
| `id` | string | sí | Identificador único del servicio dentro del catálogo. |
| `nombre` | string | sí | Nombre visible del servicio (ej. "Corte", "Barba", "Corte + Barba"). |

**Origen**: definido de forma estática en `constants/servicios.js`, expuesto a través de
`serviciosService.getServicios()` (ver `contracts/services.md`).

## EstadoTurno (enum de valores)

Conjunto fijo de estados posibles para un `Turno`, definido en `constants/estadosTurno.js`:

- `pendiente` — estado inicial de todo turno nuevo.
- `confirmado`
- `completado`
- `cancelado`

## Relaciones

```text
Turno.servicioId  →  Servicio.id   (referencia simple, no hay borrado en cascada:
                                     el catálogo de servicios es fijo y no se elimina)
```

No existen otras entidades relacionales (no hay entidad `Cliente` como registro propio — el
nombre del cliente es un campo de texto dentro de `Turno`, según Key Entities del spec).
