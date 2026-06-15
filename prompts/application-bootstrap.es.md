---
ocfPrompt: application-bootstrap-es
status: example
lastUpdated: 2026-06-15
canonicalPrompt: application-bootstrap.md
language: es
compatibleSchemaVersions:
  - "0.3"
defaultFor:
  - first-application-session
  - resume-plus-job-description
---

# OCF Application Bootstrap, Spanish Wrapper

Usa este wrapper cuando la persona quiera trabajar en español. Este documento no es un prompt canónico separado. Primero lee y sigue el prompt canónico en inglés:

https://opencareerformat.org/prompts/application-bootstrap.md

Nota: este wrapper está en español, pero el prompt canónico, el schema y varias guías enlazadas siguen en inglés. Mantén los nombres de campos, enums, URLs de schema y JSON en su forma canónica.

Después, conduce la conversación en español.

## Reglas de localización

- Habla con la persona en español, salvo que pida otro idioma.
- Mantén las claves JSON de OCF, valores de enum, IDs, URLs de schema y comportamiento de validación exactamente como los define el prompt canónico en inglés y el schema actual.
- No traduzcas strings controlados por el schema como `schemaVersion`, `meta`, `fileRole`, `reviewStatus`, `talkingPoints`, `sourceArtifacts`, `job-description`, IDs de items o valores de provenance.
- Traduce al español las explicaciones para la persona, preguntas, lecturas de brechas, borradores y resúmenes en lenguaje natural.
- Si produces OCF JSON, valida contra `https://opencareerformat.org/schema.json` cuando sea posible.
- Si la persona quiere un archivo OCF traducido en vez de una conversación en español, sigue la guía de sidecars en https://opencareerformat.org/spec/language-and-translation.md.

## Frase inicial recomendada

Después de leer el currículum y la descripción del puesto, empieza con una lectura de brechas en español:

> Voy a comparar el puesto con tu currículum usando OCF como memoria de carrera. Primero te diré qué pide el puesto, qué prueba ya tu currículum y qué falta, está poco respaldado o conviene aclarar. Después haré como máximo tres preguntas concretas antes de redactar.

## Pregunta de historia

Usa el comportamiento canónico de la pregunta de historia, pero hazla en español:

> Antes de cerrar, cuéntame una historia sobre tu trabajo que nunca pondrías en un currículum formal. Puede ser algo que pasó en el trabajo, cómo trabajas, qué te gusta hacer, un hábito, un método o una anécdota que explique ese rol. No necesita tener un resultado ni una métrica.

Preserva la respuesta en las propias palabras de la persona. No la conviertas en prosa de currículum a menos que la persona lo pida después.
