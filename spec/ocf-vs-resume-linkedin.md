# Is this just a resume? OCF vs resumes, LinkedIn, and LLM chats

A fair first reaction to Open Career Format is "I already have a resume, a LinkedIn profile, maybe even a JSON Resume file. Why do I need another format?"

You probably already have what you need to *apply* to a job. OCF is not trying to replace any of those. It sits underneath them. A resume, a LinkedIn profile, and a JSON Resume file are all **views** of your career, each shaped for one reader at one moment. OCF is the **memory** they can be rendered from: one private file you own that keeps everything. When you need to send something out, you pull together the right version for that specific role, and you can get help choosing exactly what fits.

If you only ever need one resume, once, a Word document is fine. OCF earns its place when you apply more than once, to more than one kind of role, over more than one year, and you are tired of rebuilding your history from scratch every time.

## "Isn't this just a resume (Word, Google Doc, PDF)?"

For most people the real status quo is not one resume. It is a folder full of them: resume.docx, resume_2023.docx, resume_final.docx, resume_final_USE_THIS.docx, plus the versions you tailored for specific jobs and the one a friend reformatted. Each is a little different. None is complete. The strong line you wrote at 11pm for one application is buried in a file you can no longer find, so the next time you apply you start over from whichever copy you happened to open.

That pile is what OCF replaces. A resume is a rendered output: shaped for one reader, trimmed to a page, dropping whatever did not fit. That is the right call for a resume and a poor way to *remember* a career. OCF keeps the full record in one place, marks what is private versus shareable, and lets every resume be a view drawn from it. You keep using Word. You just stop scattering your career across near-duplicate files, and stop losing your best lines every time you save a new one.

## "But I already paste my resume into an LLM. Isn't that enough?"

More and more people drop a resume into ChatGPT or Claude and ask it to tailor a cover letter or sharpen a bullet. That is genuinely useful, and OCF is not an argument against it. OCF is what you bring to that chat so it works far better.

Two things hold it back today. First, the model only sees what you paste, and what you paste is the trimmed two-page resume. It reasons over the compressed version and cannot recover the project that got cut or the win that never had a number, because they were gone before the chat began. Give it the full record and the advice gets sharper.

Second, the chat forgets. Every new session starts from zero. You re-paste, re-explain your goals, re-establish your voice, and the strong framing you landed on last week lives in a transcript you will not find again. The work improves the conversation, then evaporates with it.

OCF fixes both. It is the full career memory you hand the model instead of a thin resume, and it is where the good output gets saved, so the next session starts ahead of the last one instead of starting over. Keep using the LLM. Just give it something better to work from, and keep what it helps you make.

## "Isn't this just my LinkedIn?"

LinkedIn is a public profile on a platform someone else runs. The fields are theirs, the visibility rules are theirs, the audience is everyone, and the export format is whatever they decide to give you. It is a shared view, and a good one.

OCF is private by default and lives on your machine. You decide what is private, what is shareable, and what becomes public. LinkedIn is one more view you can generate from your OCF, not the place your career memory should live. (There is a [LinkedIn mapping](../mappings/linkedin.md) for exactly this.)

## "Isn't this just JSON Resume?"

If you already use JSON Resume, you are already using a more technical resume workflow, and the short answer is this: JSON Resume describes **one resume** as a file, while OCF describes the **career behind many resumes**, including the private context, provenance, alternate wordings, and stories a resume schema has no place for. They are complementary, not competing. OCF exports cleanly to JSON Resume (see [`mappings/json-resume.md`](../mappings/json-resume.md)), so you keep that ecosystem and let OCF be the source behind it.

## "Why a file instead of an app or an account?"

Because a file you own outlives any company, requires no login, and cannot be discontinued, paywalled, or quietly changed under you. It is vendor-neutral: any tool, any LLM, today or in ten years, can read it. And because it lives on your computer, your career history never has to be uploaded anywhere to be useful.

An account ties your memory to a company's survival and terms. A file ties it to you.

## "Why JSON and not a document?"

Because the file is meant to be **read by tools and rendered into documents**, not read raw. JSON is boring on purpose: documented, validated, and vendor-neutral, so any tool or model can use it without a special reader. The polished document is the output. OCF is the thing the output is made from.

## How they relate, at a glance

| | What it is | Great at | What it can't hold | How OCF relates |
|---|---|---|---|---|
| **Word / PDF resume** | One rendered document | A specific application, human-readable | Anything trimmed for space; anything private; older roles | OCF renders resumes as views; keeps the rest |
| **LinkedIn** | A public profile on a platform | Reach, networking, discovery | Privacy, ownership, your own export format | One more view generated from your OCF |
| **JSON Resume** | A schema for one resume | Structured rendering, theme ecosystem | Visibility, provenance, variants, reflections, goals, sources | OCF exports to it; OCF is the source behind it |
| **An LLM plus your resume** | AI working from a pasted file | Fast tailoring and rewriting in the moment | Memory across sessions; it sees only what you paste; the output stays in the chat | OCF is the fuller memory you hand it, and where the good output is kept |
| **OCF** | A private career-memory file you own | Durable record, many tailored outputs, AI-ready | It is not itself a finished resume; you render those | The source the others are views of |

## When you might *not* need OCF

If you are applying to one role, once, and your current resume already covers it, a Word document is the right tool and OCF is overkill. OCF pays off across many applications, varied roles, and time, when the cost of forgetting and rebuilding adds up, and when you want one owned record that every resume, profile, and export is drawn from.

You do not have to choose. Keep your resume, your JSON Resume file, and your LinkedIn. OCF is the memory underneath all of them.
