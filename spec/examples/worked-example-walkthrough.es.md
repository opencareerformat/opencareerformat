# Ejemplo trabajado

> Traducción española no canónica. Fuente canónica: [`worked-example-walkthrough.md`](worked-example-walkthrough.md), commit `f3d01f2`, traducido el 2026-06-15. Si hay conflicto, controla el inglés.

> Nota: este ejemplo está traducido al español, pero varios archivos enlazados son fuentes, schemas o documentación canónica en inglés.

[English](worked-example-walkthrough.md) | [Español](worked-example-walkthrough.es.md)

Los detalles detrás de un bullet de currículum se desvanecen rápido, normalmente justo cuando vuelves a necesitarlos. Este recorrido toma un bullet, una respuesta a ransomware en un hospital, y recupera la memoria profesional que había detrás.

Este recorrido explica el ciclo de vida de los archivos ficticios de Maria E. Reyes. No es un requisito nuevo del schema; es una forma concreta de leer los ejemplos como un pequeño flujo OCF.

Archivos:

| Archivo | Sitio web | Fuente en GitHub |
|---|---|---|
| Currículum fuente | [`sample-resume-source.txt`](https://opencareerformat.org/spec/examples/sample-resume-source.txt) | [`spec/examples/sample-resume-source.txt`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-resume-source.txt) |
| Archivo OCF enriquecido | [`sample-resume.ocf.json`](https://opencareerformat.org/spec/examples/sample-resume.ocf.json) | [`spec/examples/sample-resume.ocf.json`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-resume.ocf.json) |
| Historial detallado de cambios | [`sample-resume.html`](https://opencareerformat.org/spec/examples/sample-resume.html) | [`spec/examples/sample-resume.md`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-resume.md) |
| Descripción del puesto objetivo | [`sample-job-description.txt`](https://opencareerformat.org/spec/examples/sample-job-description.txt) | [`spec/examples/sample-job-description.txt`](https://github.com/opencareerformat/opencareerformat/blob/main/spec/examples/sample-job-description.txt) |

## 1. Se captura el currículum fuente

El punto de partida es un currículum corto y ordinario. En términos OCF, el currículum no es la verdad maestra. Es un `sourceArtifact`.

El importador o LLM debería:

- registrar el currículum como una entrada en `sourceArtifacts`;
- extraer persona, educación, certificaciones, habilidades, experiencia, posiciones y logros;
- conservar redacción útil del currículum;
- asignar provenance a los items importados;
- evitar inventar métricas, fechas, supervisores o resultados faltantes.

En este punto, el archivo se entiende mejor como un `candidate-master` provisional: ya puede ser el master de trabajo de la persona, pero los items importados deberían permanecer visiblemente sin revisar hasta que la persona los acepte.

## 2. La entrevista convierte bullets en memoria de carrera

El currículum fuente contiene un bullet público comprimido:

```text
- Led response to a ransomware incident and restored critical clinical systems within 41 hours with zero patient-care impact.
```

Cargado en un modelo con guía OCF, ese bullet primero se captura como material fuente. El modelo no debería tratarlo como verdad completa ni reescribirlo de inmediato. Debería preguntar qué significa: qué hizo Maria personalmente, qué evidencia respaldó la decisión, qué métricas son seguras de usar, qué debe quedar privado y qué deberían evitar exagerar las herramientas futuras.

Un intake orientado a OCF hace más que reescribir bullets. Pregunta si cada bullet debería convertirse en:

- un logro canónico;
- métricas estructuradas;
- hechos de apoyo;
- una reflexión privada;
- una caution;
- una open question;
- una narrative variant para una audiencia particular.

La historia de ransomware en `sample-resume.ocf.json` muestra este patrón. Después de preguntas de seguimiento, el evento profesional que se reducía a un bullet corto se convierte en datos estructurados y memoria reutilizable:

- un logro estructurado;
- hechos de apoyo y métricas;
- material de reflexión privada;
- cautions sobre sobreafirmar;
- narrative variants para distintas audiencias.

Ese es el ciclo central de OCF: preservar los hechos una vez y dejar que la curación futura elija la redacción correcta.

En el OCF, eso se vuelve un logro más rico. La afirmación pública sigue allí, pero el master también conserva el juicio, la evidencia, las métricas y el contexto de revisión que un currículum no puede sostener:

```json
{
  "id": "mhs-ransomware-2024",
  "statement": "Led response to a hospital-wide ransomware incident — performed forensic analysis on the attacker tooling, advised leadership against paying the ransom based on observed decryption failures in adjacent engagements, and executed an alternate recovery path from offline backups; restored critical clinical systems within 41 hours with zero patient-care impact.",
  "metrics": [
    { "kind": "duration", "value": 41, "unit": "hours", "note": "time-to-restore: critical clinical systems back online from offline backups" },
    { "kind": "other", "value": 0, "unit": "patients", "note": "patient_care_impact: zero patient-care incidents attributed to the outage" },
    { "kind": "other", "value": 0, "unit": "USD", "note": "ransom_paid: no ransom was paid; recommendation against payment was accepted by leadership" }
  ],
  "provenance": {
    "source": "interview-derived",
    "sessionTopic": "Tailoring resume for CISO-track role"
  }
}
```

La entrevista de seguimiento también cambia la memoria alrededor del logro. La explicación de Maria agrega habilidades que solo estaban implícitas, crea redacción reutilizable para distintas audiencias y registra una caution a partir de un borrador excesivo:

```json
{
  "skills": [
    "Incident Response Leadership",
    "Ransomware Analysis",
    "Executive Risk Communication",
    "Backup Recovery Operations",
    "Forensic Tooling Triage"
  ],
  "narrativeVariants": [
    {
      "id": "mhs-ransomware-public-resume",
      "label": "Public resume bullet point",
      "statement": "Led ransomware response that restored critical clinical systems from offline backups within 41 hours with no patient-care impact.",
      "visibility": "public"
    },
    {
      "id": "mhs-ransomware-security-leadership",
      "label": "Security leadership framing",
      "statement": "Led evidence-based ransomware recovery by analyzing attacker tooling, advising executives against payment, and restoring critical systems from backups within 41 hours.",
      "visibility": "shared"
    },
    {
      "id": "mhs-ransomware-healthcare-security",
      "label": "Healthcare security framing",
      "statement": "Protected patient-care continuity during a ransomware event by leading evidence-based recovery from offline backups and restoring critical clinical systems within 41 hours.",
      "visibility": "shared"
    }
  ],
  "cautions": [
    {
      "claim": "claimed as an AI / ML security specialist",
      "reason": "Has good operational exposure to ML-based detection tooling but does not have research-level expertise. Past LLM draft positioned this too strongly; corrected here."
    }
  ]
}
```

No son tres historias separadas. Son tres consecuencias reutilizables de una historia aclarada: qué habilidades demuestra, cómo contarla a distintas audiencias y qué no afirmar.

### El currículum prueba el punto final; la conversación recupera el camino

El mismo patrón aplica a líneas de tiempo, no solo a eventos. El currículum de Maria enumera su rango una sola vez, como suelen escribir los veteranos:

```text
United States Army | Cyber Operations Specialist (17C), Staff Sergeant (E-6) | 2016-01 - 2018-08
```

Esa línea alcanza para un lector civil. No alcanza para memoria de carrera, porque cualquiera que haya servido puede leer rango contra años de servicio en segundos: la progresión detrás del rango final es una historia que los lectores militares reconstruyen aunque el archivo no la cuente. Un intercambio corto recupera el camino:

> **LLM:** Your resume shows you separated as a Staff Sergeant after eight years. What was the progression behind that?
>
> **Maria:** Came in as a PV2 in 2010. PFC in '11, Specialist in '12, made Sergeant in 2014, and pinned Staff Sergeant in March 2017 after I reclassed to 17C.

El master guarda cada paso como un supporting fact fechado en un logro que abarca todo el periodo. El bloque `progression` sigue siendo el resumen narrativo; este logro conserva los pasos verificables:

```json
{
  "id": "army-rank-progression",
  "kind": "recognition",
  "statement": "Progressed from Private (E-2) to Staff Sergeant (E-6) across eight years of service, with four promotions.",
  "supportingFacts": [
    {
      "id": "army-promo-e5",
      "statement": "Promoted to Sergeant (E-5)",
      "date": { "year": 2014 },
      "visibility": "shared"
    },
    {
      "id": "army-promo-e6",
      "statement": "Promoted to Staff Sergeant (E-6)",
      "date": { "year": 2017, "month": 3 },
      "visibility": "shared"
    }
  ],
  "visibility": "shared",
  "provenance": {
    "source": "interview-derived",
    "date": "2026-06-11",
    "sessionTopic": "Military record pass",
    "operation": "recovered-promotion-dates-behind-final-rank",
    "confidence": 0.9,
    "sourceArtifactId": "sample-resume-source-2026-05",
    "note": "Final rank and MOS appear on the source resume; the dated steps were established in conversation for this fictional example."
  }
}
```

El excerpt muestra dos de los seis supporting facts del archivo de muestra. El rango final está respaldado por el currículum; los pasos fechados vienen de la entrevista. El currículum prueba el punto final; la conversación recupera el camino.

## 3. Las historias mejoran la memoria de carrera

Un flujo OCF de primera sesión también debería pedir una historia sobre el trabajo de la persona que nunca pondría en un currículum formal. El objetivo no es forzar esa historia a convertirse en un bullet. El objetivo es preservar memoria profesional en las propias palabras de la persona y luego buscar un patrón ganado solo si la evidencia lo sostiene.

En el ejemplo de Maria, la transición de liderazgo militar a civil es un buen lugar para hacerlo. La heurística general es buscar la costura que el currículum cruza en silencio. El currículum prueba liderazgo cyber en el Ejército y luego liderazgo de seguridad en salud, pero no explica cómo tradujo autoridad entre esos mundos.

Una versión breve de la conversación podría verse así:

> **Maria:** I have this resume and a Director of Security job description. I do not have an OCF yet. Can you help me with the application?
>
> **LLM:** Yes. First, a gap read: the job appears to want healthcare security leadership, incident response judgment, SOC maturity, compliance depth, and executive communication. Your resume already proves healthcare security leadership, SOC buildout, HITRUST/SOC 2, ransomware response, Army cyber operations, and executive-facing communication. The gaps I would probe before drafting are: what you personally owned in the SOC buildout, what judgment you exercised in the ransomware event, and how your military leadership translated into civilian teams.
>
> *Maria answers the targeted questions; the LLM drafts the resume and cover letter; then it closes the session by saving what should improve the next one.*
>
> **LLM:** Before I create the starter OCF, one more question: tell me one story about your work that you would never put on a formal resume. It can be something that happened at work, how you work, what you like doing at work, or an anecdote that explains a role. It does not need an outcome or metric.

La historia de Maria, preservada textualmente:

> My first month at Meridian, I asked an analyst to cover a weekend shift and he just said no. In the Army I never heard "no" to a lawful tasking. I'd been a civilian five years by then — but as an analyst, then a consultant. Meridian was the first time since the Army I had people to task. I sat in my car in the parking garage for a while after that one. What I eventually understood is that nobody in that building had ever watched me earn anything. In the Army, my rank was the authority. Out here, working for someone meant something different. So I stopped asking for anything I hadn't done first. I took the worst on-call rotations for two months and wrote up every handoff like it mattered, because it did. By the time we staffed the overnight shift, I had a waiting list to get on my team. The Army would have called that bad delegation. I call it the thing that worked.

Un LLM no debería pulir eso hasta convertirlo en prosa de caso de estudio. La textura sin pulir enseña a herramientas futuras qué sintió la transición y cómo Maria la explica.

Versión mala y aplanada:

> Maria adapted her military leadership style to civilian healthcare security by modeling commitment, improving team trust, and increasing shift coverage engagement.

Esa versión es más corta, pero destruye la memoria: elimina el estacionamiento, el choque del rango, la suposición fallida y la razón por la que el talking point posterior está ganado.

Después de preservar la historia, la herramienta puede ofrecer un through-line ganado solo si puede citar evidencia independiente:

> Does this ring true — you rebuild authority from demonstrated work rather than inherited position? It's in this story, and it's how the SOC got built: 24/7 coverage in six months, staffed by people who'd watched you take the first shifts yourself.

Si Maria lo confirma, la historia cruda queda como reflexión privada y el through-line confirmado se guarda como talking point reutilizable para entrevistas, cartas y coaching.

El update OCF resultante es concreto. La historia se guarda donde ocurrió, como reflexión del rol:

```json
{
  "kind": "never-on-resume-story",
  "text": "My first month at Meridian, I asked an analyst to cover a weekend shift and he just said no. In the Army I never heard 'no' to a lawful tasking. I'd been a civilian five years by then — but as an analyst, then a consultant. Meridian was the first time since the Army I had people to task. I sat in my car in the parking garage for a while after that one. What I eventually understood is that nobody in that building had ever watched me earn anything. In the Army, my rank was the authority. Out here, working for someone meant something different. So I stopped asking for anything I hadn't done first. I took the worst on-call rotations for two months and wrote up every handoff like it mattered, because it did. By the time we staffed the overnight shift, I had a waiting list to get on my team. The Army would have called that bad delegation. I call it the thing that worked.",
  "visibility": "private",
  "provenance": {
    "source": "interview-derived",
    "date": "2026-05-24",
    "sessionTopic": "Story-ask pass (per the first-session script)",
    "operation": "never-on-resume-story"
  }
}
```

El through-line confirmado se guarda aparte, porque no es una historia cruda ni un logro individual:

```json
{
  "talkingPoints": [
    {
      "id": "authority-from-demonstrated-work",
      "label": "Authority from demonstrated work",
      "statement": "I rebuild authority from demonstrated work rather than inherited position.",
      "uses": [
        "interview-prep",
        "leadership-screen",
        "military-to-civilian-transition"
      ],
      "visibility": "private",
      "supportingItemIds": ["mhs-soc-buildout"],
      "supportingEvidence": [
        {
          "kind": "reflection",
          "path": "experience[name=Meridian Health Systems].positions[title=Director of Cybersecurity].reflections[kind=never-on-resume-story]",
          "summary": "First-month Meridian story about rebuilding authority after an analyst declined a weekend shift."
        },
        {
          "kind": "achievement",
          "id": "mhs-soc-buildout",
          "summary": "Built SOC from 0 to 12 analysts and reached 24/7 coverage within six months."
        }
      ],
      "evidenceSummary": "Supported by Maria's first-month Meridian story and by the SOC buildout that reached 24/7 coverage in six months.",
      "reviewStatus": "user-confirmed",
      "provenance": {
        "source": "llm-suggested",
        "operation": "earned-through-line-reflection"
      }
    }
  ]
}
```

La regla de almacenamiento es simple: la redacción cruda del usuario va a una reflexión privada; un patrón sintetizado y confirmado va a un talking point; las implicaciones no resueltas se vuelven open questions o las actualizan.

## 4. La revisión agrega guardrails

Los primeros borradores suelen exagerar algo. OCF registra esas correcciones para que la persona no tenga que repetirlas en cada sesión futura.

En el archivo de muestra, `cautions` y `openQuestions` conservan:

- afirmaciones que no deben hacerse;
- detalles de attribution faltantes;
- preguntas sobre cómo el liderazgo militar se traduce a contextos civiles;
- áreas donde una conversación futura debería pedir mejor evidencia.

Las cautions son controles iniciales. Una curación futura debería leerlas antes de redactar.

Por ejemplo, el archivo registra una caution contra presentar a Maria como "AI / ML security specialist". El hecho útil es que tiene exposición operativa a herramientas de detección basadas en ML. El salto riesgoso es convertir esa exposición en especialización de investigación en AI/ML. Una vez guardada la caution, una herramienta posterior puede usar el hecho real con una frase más segura, como "evaluated and operationalized ML-assisted detection tooling".

## 5. El candidate master acumula con el tiempo

Después de la revisión, el material aceptado puede formar parte de un OCF master propiedad del candidato. El master puede contener más de lo que cualquier currículum debería mostrar:

- logros que pueden compartirse;
- reflexiones privadas que mejoran coaching o entrevista;
- source artifacts;
- provenance;
- open questions;
- cautions;
- narrative variants;
- habilidades y certificaciones.

El master no es una salida. Es la capa privada de memoria.

## 6. Curación para un objetivo

Cuando la persona proporciona una descripción de puesto, un curator lee el master más el objetivo y decide:

- qué filtrar por privacidad o relevancia;
- qué preguntar porque falta, está obsoleto o no está claro;
- qué priorizar porque es evidencia fuerte para el objetivo.

La salida de este paso no siempre es un currículum final. Puede ser:

- mejoras propuestas para el master;
- contenido export-ready para un currículum o carta;
- notas de preparación de entrevista;
- una lista corta de preguntas que la persona debería responder primero.

Si un item es real pero irrelevante para el objetivo, permanece en el master y se filtra de la salida actual.

Para esta descripción de puesto de ciberseguridad en salud, la respuesta a ransomware, el buildout del SOC, HITRUST/SOC 2 y la comunicación ejecutiva de riesgo son muy relevantes. El logro `mhs-mssp-transition` sigue siendo memoria útil, pero normalmente se curaría fuera para este objetivo salvo que la persona quiera enfatizar stewardship presupuestario o eficiencia de operaciones.

La curación también puede invertirse por audiencia. Para el objetivo de salud de Maria, su rango se traduce correctamente a alcance civil: "led a 6-person cyber operations team." Para un objetivo federal o defensa, la lógica se invierte: rango y MOS se esperan, y omitirlos puede leerse como ocultamiento, no brevedad. El master conserva ambas versiones como narrative variants del mismo logro.

La misma inversión puede aplicar a nivel persona. `person.headline` sigue siendo el headline general de Maria, mientras `positioningVariants` registra alternativas según objetivo con evidencia de apoyo:

```json
{
  "positioningVariants": [
    {
      "id": "maria-healthcare-security-headline",
      "kind": "headline",
      "label": "Healthcare security leadership headline",
      "headline": "Healthcare cybersecurity leader protecting clinical continuity through incident response, compliance, and SOC maturity",
      "audiences": [
        "healthcare-security",
        "ciso-track",
        "security-leadership"
      ],
      "supportingItemIds": [
        "mhs-ransomware-2024",
        "mhs-soc-buildout"
      ],
      "evidenceSummary": "Supported by Maria's ransomware recovery leadership and the Meridian SOC buildout.",
      "visibility": "shared",
      "reviewStatus": "user-confirmed"
    },
    {
      "id": "maria-federal-cyber-headline",
      "kind": "headline",
      "label": "Federal / defense cyber headline",
      "headline": "Former Army Staff Sergeant (17C) and cybersecurity leader with enterprise incident response and SOC buildout experience",
      "audiences": [
        "federal",
        "defense",
        "cleared-cyber",
        "military-transition"
      ],
      "supportingItemIds": [
        "army-rank-progression",
        "army-cyber-leadership",
        "mhs-ransomware-2024"
      ],
      "evidenceSummary": "Supported by Maria's Army rank/MOS progression, Army cyber leadership, and later healthcare incident-response leadership.",
      "visibility": "shared",
      "reviewStatus": "user-confirmed"
    }
  ]
}
```

El headline cambia, pero la evidencia no. Un curator puede elegir la versión de salud para un rol CISO hospitalario y la versión federal para un contratista de defensa sin inventar nuevas afirmaciones.

## 7. La exportación produce archivos

Una vez que la curación seleccionó el material correcto, la herramienta que Maria use puede producir los archivos que necesita, típicamente un currículum y una carta de presentación para el rol objetivo. Maria todavía debe revisar y editar cuidadosamente esos documentos; cuando los envía, es responsable de cada palabra.

## 8. Las actualizaciones vuelven al master

Después de redactar la salida, la pregunta útil de cierre no es solo "¿se ve bien este currículum?" Es:

> What did we learn that should be saved for next time?

Ejemplos:

- una corrección se convierte en `caution`;
- una métrica faltante se convierte en `openQuestions`;
- una historia nueva se convierte en reflexión privada;
- un bullet pulido para una audiencia se convierte en `narrativeVariant`;
- una afirmación confirmada se convierte en actualización canónica de logro.

Ese ciclo de feedback es la razón por la que OCF se vuelve más útil después de cada sesión.

## 9. La segunda sesión reutiliza y mejora la memoria

Seis meses después, Maria puede llevar el OCF a otra conversación:

> **Maria:** I am applying for a VP Security role. Use my OCF and help me prepare for the interview.
>
> **LLM:** Your resume alone would show SOC buildout and ransomware response. Your OCF adds a useful leadership pattern: you rebuild authority from demonstrated work rather than inherited position. For a VP interview, I would use that carefully as a military-to-civilian leadership answer, not as a resume bullet point.
>
> **LLM draft answer:** "The biggest adjustment after the Army was learning that civilian authority starts from evidence, not rank. At Meridian, I learned that the hard way when a weekend coverage request got a flat no. I took the worst rotations first, wrote clean handoffs, and let the team see the standard before I asked them to share it. That became part of how we built 24/7 SOC coverage: not just a staffing plan, but a credibility plan."

Ese párrafo no podría salir solo del currículum fuente. Necesita el hecho del currículum, la historia preservada y el through-line confirmado. Esta segunda sesión también es un buen momento para capturar items e historias frescas del rol actual de Maria antes de que se reduzcan a taquigrafía de currículum viejo. Esa es la promesa de valor compuesto: cada sesión revisada le da mejor memoria a la siguiente.
