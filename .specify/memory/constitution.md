<!--
Sync Impact Report
- Version change: 1.1.0 → 1.1.1
- Modified principles: n/a (los 3 principios no cambian)
- Added principles: ninguno
- Added sections: ninguna
- Removed sections: ninguna
- Modified sections: "Restricciones de Desarrollo" — se corrigió el lenguaje del proyecto de
  TypeScript a JavaScript (Expo + expo-router en JavaScript, sin backend con mocks de latencia
  simulada 500-1000 ms, AsyncStorage opcional)
- Templates requiring updates:
  - .specify/templates/plan-template.md ⚠ pendiente de revisión manual (no revisado en esta corrida)
  - .specify/templates/spec-template.md ⚠ pendiente de revisión manual (no revisado en esta corrida)
  - .specify/templates/tasks-template.md ⚠ pendiente de revisión manual (no revisado en esta corrida)
- Follow-up TODOs: ninguno
-->

# Constitución de Agenda de Turnos (React Native II - TP2)

## Principios Fundamentales

### I. Calidad de Código y Simplicidad
El código DEBE mantenerse simple y legible, evitando soluciones ingeniosas o especulativas: sin
abstracciones prematuras, sin dependencias sin uso, sin código escrito para requisitos futuros
hipotéticos (YAGNI). Los componentes y módulos DEBEN ser pequeños y de responsabilidad única —
si un archivo mezcla responsabilidades no relacionadas (por ejemplo, obtención de datos,
estilos y lógica de negocio todo en un mismo componente), DEBE dividirse. La nomenclatura y el
formato DEBEN ser consistentes en todo el código; si hay un linter/formateador configurado (por
ejemplo, ESLint/Prettier), DEBE pasar antes de mergear el código.
**Justificación**: Este es un proyecto académico evaluado, construido por un equipo pequeño —
los revisores (docentes y compañeros) necesitan entender cualquier archivo rápidamente, y el
código inconsistente o sobre-diseñado ralentiza tanto la corrección como la colaboración.

### II. Consistencia de UX
Todas las pantallas DEBEN compartir patrones de navegación consistentes (comportamiento de
retroceso, headers, estructura de tabs/stack). Toda operación asíncrona que involucre datos
importantes para el usuario (por ejemplo, cargar, crear o cancelar un turno) DEBE manejar
visiblemente sus estados de carga y error — las pantallas NO DEBEN fallar en silencio ni mostrar
una UI en blanco o congelada. El lenguaje visual (espaciado, color, tipografía, iconografía)
DEBE reutilizarse desde componentes/estilos compartidos en lugar de redefinirse por pantalla.
**Justificación**: "Agenda de Turnos" es una app de reservas usada de punta a punta en un flujo
real (explorar → reservar → gestionar turnos); una UX inconsistente o fallas silenciosas
socavan directamente el propósito central de la app y son fáciles de introducir cuando varias
personas construyen distintas pantallas.

### III. Flujo de Trabajo Git y Revisiones (NO NEGOCIABLE)
El trabajo DEBE realizarse en ramas de feature; los commits directos a `main` NO están
permitidos. Los mensajes de commit DEBEN ser lo suficientemente descriptivos para que un
compañero entienda el cambio sin necesidad de abrir el diff. Todo cambio DEBE mergearse a
través de un pull request, y todo pull request DEBE ser revisado y aprobado por al menos otro
miembro del equipo antes de mergear a `main`.
**Justificación**: Con un equipo de 2 a 4 personas, un gate de revisión liviano es la principal
defensa contra regresiones y convenciones divergentes, y mantiene a todos al tanto de lo que
cambia en un código compartido.

## Restricciones de Desarrollo

El proyecto usa **Expo** junto con **expo-router** para la navegación, en **JavaScript**. El
proyecto **no tiene backend**: los datos se manejan con mocks locales que simulan
latencia de red (entre 500 y 1000 ms) para reproducir un comportamiento realista de carga.
**AsyncStorage** puede usarse de forma opcional para persistir datos localmente en el
dispositivo (por ejemplo, turnos creados por el usuario) cuando la funcionalidad lo requiera.
Toda nueva dependencia DEBE justificarse por una necesidad concreta y actual del spec/plan que
se está implementando, no por un uso anticipado a futuro.

## Flujo de Trabajo de Desarrollo

Las ramas DEBEN nombrarse reflejando la feature o el fix que contienen (por ejemplo,
`feature/booking-flow`, `fix/date-picker`). Antes de abrir un pull request, el autor DEBE
autorrevisar el diff en busca de cumplimiento con los Principios Fundamentales. Los pull
requests DEBEN describir qué cambió y por qué, y NO DEBEN mergearse hasta que al menos un
compañero los apruebe. Si el proyecto agrega tests automatizados o CI, que los checks pasen se
suma como requisito adicional para mergear, sin reemplazar la revisión entre pares.

## Gobernanza

Esta constitución tiene prioridad sobre cualquier convención de equipo o práctica ad hoc en
conflicto. Las enmiendas requieren acuerdo entre los miembros activos del equipo, deben
registrarse como una nueva versión de este archivo siguiendo versionado semántico (MAYOR:
eliminación o redefinición incompatible de gobernanza/principios; MENOR: nuevo principio o guía
materialmente ampliada; PARCHE: aclaraciones o redacción únicamente), y deben actualizar la
fecha de `Última Modificación` debajo. Toda revisión de pull request DEBE incluir una
verificación de que el cambio cumple con los Principios Fundamentales; la complejidad
injustificada o las desviaciones deben señalarse en la revisión en lugar de mergearse en
silencio.

**Versión**: 1.1.1 | **Ratificada**: 2026-08-14 | **Última Modificación**: 2026-08-14
