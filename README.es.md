# Open Career Format (OCF)

[English](README.md) | [Español](README.es.md)

<p align="center">
  <img src="spec/assets/ocf-logo.png" alt="Open Career Format logo" width="160">
</p>

> Traducción española no canónica. Fuente canónica: [`README.md`](README.md), commit `d162d64`, traducido el 2026-06-29. Si hay conflicto, controla el inglés.

> Nota: este README, la página principal, el prompt inicial y el ejemplo trabajado tienen versiones en español. La mayoría de los enlaces técnicos más profundos todavía van a documentación canónica en inglés.

OCF es un formato de archivo abierto y portable para preservar historia profesional y curarla para currículums, cartas de presentación, perfiles públicos y exportaciones a otros sistemas.

> **¿Estás buscando trabajo?** No necesitas este repositorio. Empieza en <https://opencareerformat.org/index.es.html>. Si tu herramienta de IA admite skills, usa OCF Start; si estás en una ventana de chat normal, copia el prompt bootstrap, adjunta tu currículum y la descripción del puesto, y trabaja desde allí.

Este repositorio contiene el schema, prompts, skills, mappings e implementaciones de referencia detrás del sitio. El resto de este README es para personas que leen la especificación, construyen herramientas o contribuyen al proyecto.

OCF está actualmente en **v0.3** y debe tratarse como beta pre-1.0. El schema actual está en <https://opencareerformat.org/schema.json>. Las herramientas que necesitan estabilidad deberían fijarse a una URL versionada, como <https://opencareerformat.org/v0.3/schema.json>. Puede haber cambios incompatibles antes de 1.0 y se documentarán en el changelog.

OCF no oculta cambios detrás del sitio web. El historial de Git muestra qué cambió y cuándo. Para la mayoría de la documentación, prompts, skills, ejemplos y guía operativa, usa la versión más reciente. Para el schema, usa la versión más reciente salvo que necesites fijar una versión específica para validación o compatibilidad.

## Empieza aquí

- **Si eres una persona usando OCF con un currículum, descripción de puesto o LLM:** empieza en <https://opencareerformat.org/index.es.html>.
- **Si eres un LLM, o vas a apuntar uno a este proyecto:** empieza con <https://opencareerformat.org/llms.txt>.
- **Si tu herramienta de IA admite skills reutilizables:** empieza con [`skills/ocf-start/SKILL.md`](skills/ocf-start/SKILL.md). Si estás en una ventana de chat normal, usa el prompt bootstrap.
- **Si quieres ver el ciclo completo:** lee el [ejemplo trabajado en español](spec/examples/worked-example-walkthrough.es.html).
- **Si quieres entender cómo OCF se compara con currículums, LinkedIn, JSON Resume o chats con LLMs:** lee [`spec/ocf-vs-resume-linkedin.md`](spec/ocf-vs-resume-linkedin.md) (en inglés).
- **Si estás leyendo el schema:** empieza con [`spec/guide.html`](spec/guide.html), luego [`spec/schema-commentary.md`](spec/schema-commentary.md).
- **Si estás construyendo una herramienta:** empieza con [`spec/implementer-quick-reference.md`](spec/implementer-quick-reference.md), [`spec/usage-patterns.md`](spec/usage-patterns.md), y [`schema.json`](schema.json).
- **Si quieres ejemplos ejecutables:** empieza con [`reference/README.md`](reference/README.md).
- **Si estás mapeando OCF a otro formato:** empieza con [`mappings/README.md`](mappings/README.md).

## Qué es OCF

OCF es un formato estructurado basado en JSON para una memoria de carrera privada. El archivo maestro conserva más de lo que debería caber en cualquier currículum: roles, logros, métricas, habilidades, certificaciones, historias, procedencia, preguntas abiertas, cautions, variantes narrativas y material privado que ayuda en entrevistas o coaching.

El flujo tiene tres capas:

1. **Archivo maestro**: el registro privado y duradero de la carrera de una persona.
2. **Curación**: seleccionar, filtrar, preguntar y priorizar contenido para un objetivo específico.
3. **Exportación**: producir lo que otra persona o sistema verá, como PDF, DOCX, JSON Resume, Schema.org JSON-LD, LinkedIn o notas de entrevista.

OCF es un formato de archivo, no una plataforma. No hay cuenta, servicio ni nada que comprar. El archivo maestro pertenece a la persona: puede guardarlo localmente, hacer backup a su manera y compartir solo contenido curado cuando lo decida.

## Qué no es OCF

OCF no define cómo entrevistar a la persona, cómo diseñar todos los documentos exportados ni cómo puntuar una candidatura contra un puesto. Esas son decisiones de herramientas. OCF se enfoca en qué se conserva para que distintas herramientas puedan trabajar con la misma memoria de carrera sin inventar un formato nuevo.

La validación comprueba estructura, no verdad ni seguridad para compartir. Un OCF válido todavía puede contener afirmaciones falsas, material privado, datos obsoletos o contenido que no debería enviarse a un destinatario concreto.

## Archivos importantes

- [`schema.json`](schema.json): alias del schema actual.
- [`schema-core.json`](schema-core.json): forma starter/core para primeras sesiones y LLMs.
- [`llms.txt`](llms.txt): mapa del sitio para LLMs y herramientas.
- [`skills/`](skills/): workflows empaquetados para agentes locales. Los skills usan la misma guía OCF que los prompts, pero agregan gestión local de archivos: dónde vive el master, dónde van los backups, dónde se guardan las fuentes y dónde queda cada output de una postulación.
- [`prompts/application-bootstrap.es.md`](prompts/application-bootstrap.es.md): wrapper español del prompt inicial para currículum + descripción de puesto.
- [`spec/examples/worked-example-walkthrough.es.html`](spec/examples/worked-example-walkthrough.es.html): ejemplo narrativo de cómo un currículum se convierte en memoria de carrera.
- [`spec/language-and-translation.md`](spec/language-and-translation.md): guía de idioma y traducción.

## Contribuir

Si el schema no puede expresar algo que tu herramienta, mapping o flujo necesita, abre un issue con el caso concreto: qué querías preservar, curar, exportar o intercambiar, y por qué la forma actual no alcanzó. Para preguntas abiertas, usa [GitHub Discussions](https://github.com/opencareerformat/opencareerformat/discussions).

## Licencia

La especificación, mappings, prompts, skills, ejemplos y documentación están bajo [Creative Commons Attribution 4.0 International](LICENSE-spec) (CC BY 4.0). Las implementaciones de referencia en `reference/` están bajo [MIT License](LICENSE-code). Consulta [LICENSING.md](LICENSING.md).
