# Maria Reyes: An OCF Growing Through Conversation

Maria E. Reyes, most of her employers, and the specific events in this example are fictional. They are not based on a real person, but they are designed to be credible. The conversations are based on real interactions with LLMs, with some exchanges reconstructed or lightly edited to demonstrate the OCF workflow.

The example shows how one person's Open Career Format file can be created and grow through repeated conversations using OCF and modern LLMs. Maria's questions, corrections, targets, and remembered stories shape what her file contains. A different person, or different conversations, would produce a different OCF.

OCF provides the structure for what is learned; it does not prescribe a single interview or finished career record. The model follows what Maria is trying to accomplish in each conversation, preserves what matters, and leaves unanswered questions for another time.

<!-- markdown-only:start -->
> The conversations below are easiest to follow in the [rendered HTML version](index.html).
<!-- markdown-only:end -->

## How Maria's OCF Grew

1. **[Conversation One](#conversation-one-maria-creates-her-first-ocf) — 2026-05-20: create the first OCF.** Maria brings a conventional resume and a healthcare cybersecurity job description. She wants help with the application, not a long intake project. The assistant produces a gap read, works only from supported claims, saves unanswered questions, and creates a useful first OCF from the same session.
2. **Conversation Two — 2026-05-21: recover the story behind a bullet.** A CISO-track review expands Maria's short ransomware bullet into a structured achievement with context, metrics, private reflections, and language for different audiences.
3. **Conversation Three — 2026-05-21: preserve corrections.** Maria rejects positioning that overstates Big Four consulting and AI/ML specialization. The OCF records those corrections so future drafts do not repeat them.
4. **Conversation Four — 2026-05-24: find the next useful questions.** A coaching review notices that the file says little about Maria's military-to-civilian leadership transition and that the SOC buildout needs more precise attribution.
5. **[Conversation Five](#conversation-five-maria-explores-a-leadership-transition) — 2026-05-24: follow the question Maria chooses.** Maria explores the leadership transition, preserves the parking-garage story in her own words, and confirms a pattern connecting that story to the later SOC buildout.
6. **Conversation Six — 2026-06-11: recover the path behind the endpoint.** Maria fills in how she progressed from PV2 to Staff Sergeant and clarifies when she moved into cyber operations and leadership. Her OCF can now emphasize team scope for civilian audiences or retain rank and military specialty where government contractors expect them. The accumulated career-memory file at this point is [`OCF revision 6`](maria-reyes-revision-6.ocf.json).
7. **[Conversation Seven](#conversation-seven-maria-considers-a-government-contractor-role) — 2026-07-14: reuse and improve the memory.** A government-contractor role first receives a resume-only gap read. Maria then supplies revision 6, which reveals much more relevant evidence and several claims that need correction. She clarifies her cybersecurity timeline, management scope, FedRAMP responsibility, executive briefings, and clearance wording. The accepted result is [`OCF revision 7`](maria-reyes-revision-7.ocf.json).

The full versions of Conversations One, Five, and Seven follow on this page. We haven't shared the other conversations or intermediate OCF snapshots, but their accepted results live in revisions 6 and 7.

## Conversation One: Maria Creates Her First OCF

This reconstructed conversation shows one plausible first OCF session. It is not a required interview script: the assistant follows what Maria wants to accomplish and records unanswered questions for another time.

**Date:** 2026-05-20

Files used in the conversation:

| File | Purpose |
|---|---|
| [`source-resume.txt`](source-resume.txt) | Maria's current resume. |
| [`healthcare-job-description.txt`](healthcare-job-description.txt) | The healthcare cybersecurity role she wants to pursue. |
| [`application-bootstrap.md`](../../../prompts/application-bootstrap.md) | The OCF first-application guidance used by the assistant. |

### Starting With The Application

> **Maria:** I have attached my current resume and the job description. Use the [OCF application bootstrap](../../../prompts/application-bootstrap.md) to help me apply.
>
> I want a better resume and cover letter for this role, but I do not want to spend the whole session building a career database.
>
> **Attachments:** [`source-resume.txt`](source-resume.txt) and [`healthcare-job-description.txt`](healthcare-job-description.txt)

> **Assistant:** I have read both files. Do you already have an OCF file?

> **Maria:** No.

> **Assistant:** That is fine. We can work on the application first and create a useful provisional OCF from the same material at the end. You do not need to reconstruct your entire career today.
>
> **Gap read**
>
> This is a strong match. Your resume already supports the role's central requirements:
>
> - You lead cybersecurity for a healthcare technology company handling PHI for more than two million patients.
> - You built a SOC from zero to 12 analysts and reached 24/7 coverage within six months.
> - You reduced mean time to detect from 72 hours to under four.
> - You led a first-assessment HITRUST certification with zero corrective actions and also supported SOC 2 Type II.
> - You led recovery from a ransomware incident with no patient-care impact.
> - Your earlier consulting, DoD, and Army work supports the incident-response and critical-infrastructure parts of the role.
>
> The main gaps are not necessarily missing experience. They are areas the resume names without showing enough evidence:
>
> - vulnerability-management ownership;
> - AWS, cloud-security, and zero-trust implementation;
> - executive reporting and the decisions your briefings influenced.
>
> I would ask three focused questions before making stronger claims:
>
> 1. The job makes vulnerability management a core responsibility. Did you run a formal program, own part of it through the SOC, or mainly provide oversight?
> 2. Your skills list AWS and zero trust. What did you personally design, implement, or operate, and at what scale?
> 3. You report to the CISO. What decisions, priorities, funding, or risk acceptance changed because of information you presented?

### Maria Chooses The Depth

> **Maria:** I would need to think about those. For now, use only what the resume already supports. The SOC buildout, ransomware response, detection improvement, and HITRUST work are the parts I most want to emphasize. Keep the other questions for later.

> **Assistant:** I will. I will not turn skills into accomplishments you have not confirmed.
>
> For this application, I would lead with healthcare security operations and use your military and consulting background as supporting depth. A targeted opening could read:
>
> **Cybersecurity leader with Army cyber operations, incident-response consulting, and healthcare security leadership experience. Built a 24/7 SOC, reduced detection time from 72 hours to under four, led first-assessment HITRUST certification, and restored critical clinical systems after ransomware with no patient-care impact.**
>
> The strongest resume bullets remain close to your source evidence:
>
> - Built a SOC from zero to 12 analysts, achieving 24/7 coverage within six months.
> - Reduced mean time to detect from 72 hours to under four through SIEM tuning and automated triage.
> - Led HITRUST r2 certification, passing the first assessment with zero corrective actions.
> - Led response to a ransomware incident, restoring critical clinical systems within 41 hours with zero patient-care impact.
>
> A cover-letter paragraph can connect those facts to the target without copying the job description:
>
> **At Meridian Health Systems, I built the security operations function supporting healthcare technology used for more than two million patients. My team reached 24/7 coverage within six months, reduced mean time to detect from 72 hours to under four, and restored critical clinical systems within 41 hours during a ransomware incident without patient-care impact. That combination of operational leadership, healthcare context, and measurable improvement is what I would bring to this role.**
>
> You should carefully review and edit every word before using either document. The claims remain yours.

### Saving Something For Next Time

> **Assistant:** Before I create the provisional OCF, tell me one story about your work that you would never put on a formal resume. It can be something that happened, how you work, or what you most enjoy doing. I will preserve it in your own words rather than turn it into a bullet.

> **Maria:** Not today. I want to finish the application, and I would rather think about that question first.

> **Assistant:** No problem. I will leave it for another conversation.
>
> I can still create a useful first OCF from what you provided. It will contain:
>
> - the resume and job description as private source records;
> - your roles, education, certifications, and skills from the resume;
> - the resume's supported achievements, marked as imported and still open to your review;
> - private contact information that should not be exported automatically;
> - open questions about vulnerability management, cloud and zero-trust work, and executive communication.
>
> The job description helps choose what matters for this application, but it does not become truth about your career. The unanswered questions remain questions rather than invented accomplishments.
>
> Save the provisional OCF file next to your resume. Next time, attach both.

## Conversation Five: Maria Explores A Leadership Transition

This reconstructed conversation begins with an open question saved during Maria's previous coaching review. It shows how a person can choose to explore one thread from their career memory when it becomes interesting or useful. It is not a required fifth step or a prescribed interview sequence.

**Date:** 2026-05-24

### An Open Question Creates A Starting Point

> **Maria:** The last review left an open question about how my Army leadership translated into civilian work. What are we actually trying to understand? My resume already says I led an Army team and later built a SOC.

> **Assistant:** The resume shows both endpoints, but not what you had to change between them. Was there a moment when something that worked in the Army did not work in a civilian team, or when you realized leadership meant something different?
>
> Tell it in your own words. It does not need to sound polished, end with a metric, or turn into a resume bullet. I will preserve what you say rather than rewrite it.

> **Maria:** My first month at Meridian, I asked an analyst to cover a weekend shift and he just said no. In the Army I never heard "no" to a lawful tasking. I'd been a civilian five years by then — but as an analyst, then a consultant. Meridian was the first time since the Army I had people to task. I sat in my car in the parking garage for a while after that one. What I eventually understood is that nobody in that building had ever watched me earn anything. In the Army, my rank was the authority. Out here, working for someone meant something different. So I stopped asking for anything I hadn't done first. I took the worst on-call rotations for two months and wrote up every handoff like it mattered, because it did. By the time we staffed the overnight shift, I had a waiting list to get on my team. The Army would have called that bad delegation. I call it the thing that worked.

> **Assistant:** I will keep that story exactly as you told it and mark it private. I will not flatten it into something like "adapted military leadership style to improve team engagement." That would discard the part worth remembering.
>
> I see a possible pattern, but I want to offer it as a question rather than tell you what your story means.
>
> **Does this ring true: you rebuild authority from demonstrated work rather than inherited position?** I see it in this story, where you took the first shifts yourself, and in the SOC buildout already in your OCF: zero to 12 analysts and 24/7 coverage within six months.

> **Maria:** Yes, that rings true. Keep the story private, but save the pattern because I may want to use it in a leadership conversation later.

### The OCF Remembers Both

> **Assistant:** I will save two different things because they serve different purposes:
>
> - Your complete story remains a private reflection in your own words.
> - "I rebuild authority from demonstrated work rather than inherited position" becomes a private talking point, marked as suggested by the model and confirmed by you.
>
> The talking point will cite both the story and the SOC buildout that made the pattern defensible. I will also narrow the existing question about your military-to-civilian leadership transition. This story gives us one strong example, but it does not answer every future question about coaching, performance management, or difficult staffing decisions.

> **Maria:** That sounds right. Do not turn the story itself into a resume bullet.

> **Assistant:** Understood. A future tool can interpret the story, ask questions about it, or propose a use for it. It should not replace the source memory with polished AI prose.

## Conversation Seven: Maria Considers A Government-Contractor Role

This is a lightly edited transcript from a model session using Maria's example files. Tool traces, permission messages, repeated file reads, and pasted copies of linked files have been removed. A final clarification exchange completes the correction loop.

**Date:** 2026-07-14

Files used in the conversation:

| File | Purpose |
|---|---|
| [`source-resume.txt`](source-resume.txt) | Maria's short source resume. |
| [`government-contractor-job-description.txt`](government-contractor-job-description.txt) | A private-employer role supporting U.S. government customers. |
| [`maria-reyes-revision-6.ocf.json`](maria-reyes-revision-6.ocf.json) | Maria's accumulated career memory before this conversation. |
| [`application-bootstrap.md`](../../../prompts/application-bootstrap.md) | The OCF first-application guidance used by the assistant. |

### The Session Starts With The Resume

> **Maria:** I am considering this cybersecurity role at a government contractor. Use the [OCF application bootstrap](../../../prompts/application-bootstrap.md) to help me apply. Start with my resume and tell me how well it fits.
>
> **Attachments:** [`source-resume.txt`](source-resume.txt) and [`government-contractor-job-description.txt`](government-contractor-job-description.txt)

> **Assistant:** This is a strong match, but the resume leaves several of the role's government-program requirements under-evidenced.
>
> **What the role asks for**
>
> The hiring case rests on four pillars:
>
> - Leading defensive cyber operations and developing teams.
> - Directing serious incidents involving ransomware and nation-state activity.
> - Delivering security programs for federal or defense customers.
> - Applying federal controls while explaining risk to government and company leaders.
>
> **What your resume proves**
>
> Your strongest direct matches are:
>
> - Approximately 10 years in dedicated cybersecurity roles by 2026, plus earlier Army signal experience.
> - Director-level leadership and a SOC built from zero to 12 analysts with 24/7 coverage.
> - Army defensive-cyber leadership for a 15,000-node network.
> - DoD-contractor threat-analysis experience.
> - Leadership during ransomware, nation-state, and critical-infrastructure incidents.
> - Detection improvement from 72 hours to under four.
> - Threat intelligence, SIEM, AWS security, endpoint security, zero trust, vulnerability management, Python, and Terraform in your skills inventory.
> - CISSP and CISM, both explicitly preferred.
> - San Antonio location and prior military cyber experience.
>
> The combined Army and Meridian roles may satisfy the five-year leadership requirement, but the resume should make that chronology unmistakable.
>
> **What remains missing or under-evidenced**
>
> The largest issue is **government-program delivery**. Your resume says you performed DoD threat analysis, but it does not show whether you owned contract deliverables, briefed government customers, supported reviews, or coordinated across program organizations.
>
> Other gaps:
>
> - U.S. citizenship and clearance history are absent.
> - RMF, NIST 800-53, and FedRAMP appear as skills without an applied example.
> - No government authorization artifacts or processes are named.
> - No evidence of DISA STIG work.
> - AWS, endpoint security, vulnerability management, Terraform, and zero trust lack supporting accomplishments.
> - No explicit example of briefing government stakeholders or influencing investment and risk decisions.
> - "Built a SOC team" is excellent, but distributed or multi-team leadership is not established.
>
> FedRAMP ownership is not strictly required here; the posting asks for working knowledge. If your experience is limited, we can say that accurately. RMF and DoD authorization experience may be more important for this position.
>
> **Three questions that would resolve the major risks**
>
> 1. **Clearance eligibility:** Are you a U.S. citizen, and have you previously held a clearance? If so, what level, when was it last active, and is it accurate to say you are eligible for reactivation?
> 2. **Government-controls evidence:** In any role, what did you actually do with RMF, NIST 800-53, FedRAMP, DISA STIGs, eMASS, SSPs, POA&Ms, control assessments, or authorization decisions? It is fine if your level was contribution rather than ownership.
> 3. **Government-program delivery and communication:** At Tidewater or in the Army, did you brief government leaders, support a contract or mission program, lead distributed personnel, establish escalation practices, or prepare material for customer reviews? Please identify the audience without disclosing anything sensitive.

### The Existing OCF Changes The Assessment

> **Maria:** I am sorry, I did have an OCF file. Perhaps it is better to start with that.
>
> I attached [`maria-reyes-revision-6.ocf.json`](maria-reyes-revision-6.ocf.json).

> **Assistant:** Yes, this is the better source of career memory. Starting with the OCF materially improves the match assessment. It contains several qualifications that the short resume omitted:
>
> - U.S. citizenship.
> - Previously held TS/SCI with CI polygraph, recorded as inactive since 2022.
> - Leadership of teams across military and civilian settings.
> - Briefings to flag officers, C-suite leaders, and board audit committees.
> - A claim of leading FedRAMP authorization for a SaaS product.
> - DISA STIG experience.
> - Zero-trust architecture for hybrid cloud environments.
> - AWS Security Hub, Terraform, CrowdStrike, Splunk, and security-automation evidence.
> - An OIR deployment and richer Army rank/MOS progression.
> - A federal-specific, previously confirmed positioning headline.
>
> That changes this from "strong but under-evidenced" to "very strong match with a few facts needing attribution."
>
> The OCF also reveals three items I would not use externally without clarification:
>
> 1. **FedRAMP attribution:** Which employer and SaaS product were involved? What authorization level or baseline applied, what did "led" mean, and did the work reach authorization or only readiness or assessment?
> 2. **Government leadership evidence:** What is the strongest specific example behind briefing flag officers or government stakeholders? Separately, the competency says you led teams of 8-40, but the detailed entries currently establish six Army personnel, 12 direct reports, and an 18-person Meridian organization. Where does 40 come from?
> 3. **Clearance wording:** Can we accurately state, "Previously held TS/SCI with CI polygraph; inactive since 2022 and able to pursue reactivation"? If not, I will use the narrower first clause.
>
> One OCF inconsistency also needs correction eventually: its summary says "a decade in private-sector cybersecurity," but the dated civilian roles begin in September 2018. Your defensible qualification is over 10 years in cybersecurity when Army cyber service from January 2016 is included, not 10 years in the private sector.

### Private Does Not Mean Never Useful

> **Maria:** Do any of my private details make sense to consider adding to the resume, or perhaps to my talking points for this role?

> **Assistant:** Yes. A few private details are valuable for this government-contractor role, but most belong in interview talking points rather than the resume. Nothing marked private should be included automatically; I would ask before using specific items.
>
> | Private detail | Resume? | Talking points? | Recommended use |
> |---|---:|---:|---|
> | U.S. citizenship and prior TS/SCI with CI polygraph | Yes, with approval | Yes | Highly relevant. Use precise status and do not imply an active clearance. |
> | Ransomware executive-room decision | Sanitized version | Yes, fuller version | Strong evidence of incident command and executive risk communication. |
> | SOC budget, headcount, and hiring ownership | Yes, after confirmation | Yes | Establishes director-level authority beyond technical leadership. |
> | First-month civilian leadership story | No | Yes | Strong answer about leadership style, trust, and team development. |
> | Security-awareness underinvestment | No | Yes | A useful failure-and-learning story showing strategic judgment. |
> | Career motivations | No | Yes | Useful for "Why this role?" and "What are you looking for?" after confirming that the framing fits. |
> | Supervisor and reference contact details | No | Usually no | Keep private until a formal reference stage. |
> | Army exit rationale | No | Rarely | Not important to this application. |
> | Travel and on-call constraints | No | During fit discussions | The 25 percent travel ceiling matches the posting, but it is a fit constraint rather than a resume fact. |
>
> For the resume, I would consider this after you approve using it:
>
> > **U.S. citizen | Previously held DoD TS/SCI with CI polygraph; inactive since 2022**
>
> That should not say "eligible for reactivation" unless you confirm that wording.
>
> The OCF also contains a stronger, user-confirmed version of the ransomware achievement:
>
> > Led evidence-based ransomware recovery by analyzing attacker tooling, advising executives against payment, and restoring critical systems from backups within 41 hours.
>
> I would add "with no patient-care impact" if space permits. I would exclude the ransom amount, names of executives, and internal uncertainty from the resume.
>
> For interviews, three private stories are especially strong:
>
> - **Leadership and team development:** The story about learning that civilian authority had to be earned through demonstrated work.
> - **Executive judgment under pressure:** The full ransomware story, including the forensic work, recommendation against payment, and commitment to a recovery timeline.
> - **Failure and learning:** Underinvesting in security awareness while prioritizing the SOC, then recognizing that technical controls and human-risk programs have different time-to-impact curves.

### The Conversation Improves The Career Memory

> **Maria:** The private-sector summary is wrong. What I meant was that I have about 10 years in dedicated cybersecurity beginning when I reclassified to 17C in January 2016. My civilian employment began in 2018.
>
> The 40-person number was a cross-functional incident group, not a team that reported to me. The largest security function I led was 18 people at Meridian, with 12 direct reports. We should not say I led a team of 40.
>
> The FedRAMP work was at Meridian for a SaaS product pursuing the Moderate baseline. Our GRC director owned the overall authorization program and the 3PAO relationship. I was accountable for the security-operations workstream: logging and monitoring, incident response, vulnerability remediation, operational evidence, and closing the findings assigned to my team. Cloud engineering owned the infrastructure changes. The product received authorization in 2025, but saying I led the entire authorization is too broad.
>
> At Meridian, I briefed the CISO monthly and the board audit committee quarterly. In the Army, I briefed operational status through the chain of command, but I cannot point to a specific flag-officer briefing without checking old records. Do not use that claim yet.
>
> My TS/SCI with CI polygraph is correctly recorded as inactive since 2022. I do not know whether "eligible for reactivation" is accurate, so use only the narrower statement.

> **Assistant:** That resolves the important discrepancies without weakening your fit for the role.
>
> I would carry these corrections forward in the same OCF career-memory file:
>
> - Replace "a decade in private-sector cybersecurity" with a supported statement: **10 years in dedicated cybersecurity across Army cyber operations and civilian roles.**
> - Replace "led teams of 8-40" with the supported scope: **led a 6-person Army cyber team and later an 18-person civilian security function with 12 direct reports.** The 40-person incident group can remain context for a specific event, but not management scope.
> - Replace "led FedRAMP authorization" with an attributed statement: **led the security-operations workstream supporting a successful FedRAMP Moderate authorization, accountable for monitoring, incident response, vulnerability remediation, operational evidence, and assigned findings.**
> - Retain the CISO and board-audit-committee briefings with their cadence. Remove the flag-officer claim unless a later review recovers a specific, supportable example.
> - Keep the clearance wording narrow: **previously held DoD TS/SCI with CI polygraph; inactive since 2022.** Do not assert reactivation eligibility.
>
> Those changes make the application stronger because they make responsibility clearer, not because they make the claims larger. The resume can now use the relevant, approved subset. The same OCF file also becomes more reliable for the next conversation.
>
> I saved the accepted changes in the complete [`OCF revision 7`](maria-reyes-revision-7.ocf.json).

### Continue Into The Implementation Details

The conversation shows what using OCF can feel like. The [Implementation Details](implementation-details.md) page then opens the file and explains how the source resume, structured achievements, provenance, narrative variants, private reflections, talking points, cautions, and target-aware curation fit together.
