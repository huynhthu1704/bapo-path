// I. AI Productivity Prompts — useful in every phase
export default [
  {
    id: 'P-I01', phase: 'every', step: 12, cat: 'I', sub: 'AI-assisted BA/PO/PM workflow improvement', roles: ['BA', 'PO', 'PM'],
    title: 'Improve your workflow with AI',
    desc: 'Reviews your weekly tasks and shows where AI can save time safely, with ready-to-use prompts and the checks you still need.',
    when: ['You feel busy with repetitive work', 'Starting to use AI at work', 'Your company has just approved an AI tool'],
    prepare: 'Your typical weekly tasks with rough hours, tools you use, any data rules at your company',
    ph: [['Role', 'Your role and context', 'Product owner in a retail bank, 2 Scrum teams'],
      ['Weekly Tasks', 'Tasks and time spent', 'Writing stories 6h; meetings and minutes 8h; status reports 2h; stakeholder emails 3h; backlog grooming 4h'],
      ['Data Rules', 'Rules about company data (optional)', 'No customer data in external AI tools']],
    body: `Act as a productivity coach for business analysts, product owners and project managers.

Role: [Role]
Weekly tasks: [Weekly Tasks]
Data rules: [Data Rules]

1. For each task, rate the AI opportunity (high / medium / low) and explain how AI can help (draft, summarise, check, structure, brainstorm).
2. Estimate hours that could be saved per week, conservatively.
3. For the top 3 opportunities, give a ready-to-use prompt and a short human review checklist.
4. List the tasks AI should not do for me (judgement, relationships, confidential decisions) and why.
5. Explain how to stay within the data rules (anonymise, summarise first, use approved tools).

Output: an opportunity table, the 3 prompts with checklists, the "keep human" list, and data safety tips.`,
    output: 'An AI opportunity table with estimated time saved, 3 ready-to-use prompts with review checklists, tasks to keep human, and data safety tips.',
    next: ['P-I03', 'P-I02'], tags: ['AI', 'productivity', 'workflow', 'automation'],
    tr: {
      vi: ['Cải thiện cách làm việc với AI', 'Rà soát công việc hằng tuần và chỉ ra chỗ AI giúp tiết kiệm thời gian an toàn, kèm prompt dùng ngay và các bước kiểm tra cần giữ.', 'Khi bận rộn với việc lặp lại; khi bắt đầu dùng AI trong công việc; khi công ty vừa duyệt một công cụ AI.'],
      ko: ['AI로 업무 방식 개선하기', '주간 업무를 검토해 AI가 안전하게 시간을 아낄 수 있는 부분과 바로 쓸 프롬프트, 필요한 검토 사항을 알려 줍니다.', '반복 업무로 바쁠 때; 업무에 AI를 쓰기 시작할 때; 회사가 AI 도구를 막 승인했을 때.'],
      fr: ['Améliorer votre façon de travailler avec l’IA', 'Passe en revue vos tâches hebdomadaires et montre où l’IA fait gagner du temps sans risque, avec des prompts prêts à l’emploi et les vérifications à garder.', 'Quand les tâches répétitives vous débordent ; quand vous commencez à utiliser l’IA au travail ; quand votre entreprise vient d’approuver un outil d’IA.'],
    },
  },
  {
    id: 'P-I02', phase: 'every', step: 13, cat: 'I', sub: 'Document summarization and insight extraction', roles: ['BA', 'PO', 'PM'],
    title: 'Extract insights from a long document',
    desc: 'Summarises a long document for your purpose: key points, decisions, requirements, risks and open questions, with references to where each came from.',
    when: ['You receive a long policy, contract, RFP or spec', 'Preparing for a meeting with little time', 'Onboarding to a new project'],
    prepare: 'The document text (anonymised if needed) and why you are reading it',
    ph: [['Purpose', 'Why you are reading it', 'Find requirements that affect the mobile loan application'],
      ['Document', 'Paste the text', '(paste the policy, RFP or specification here)']],
    body: `Act as a business analyst reading a document for a specific purpose.

Purpose: [Purpose]
Document:
"""
[Document]
"""

1. Give a summary in 5 bullet points focused on my purpose.
2. Extract: requirements or obligations, decisions already made, numbers and dates, risks, and terms that need a glossary entry.
3. For each item, reference the section or paragraph it came from.
4. List open questions or contradictions to raise with the author.
5. Say which parts are not relevant to my purpose, so I can skip them.

Rules: use only what is in the document; write "not stated" instead of guessing.
Output: Summary, an extraction table (Type | Item | Source), Open questions, Skip list.`,
    output: 'A purpose-focused 5-bullet summary, a table of requirements, decisions, numbers, risks and terms with source references, open questions and parts to skip.',
    next: ['P-D02', 'P-I05'], tags: ['summary', 'document analysis', 'insights', 'reading'],
    tr: {
      vi: ['Rút ra insight từ tài liệu dài', 'Tóm tắt tài liệu dài theo mục đích của bạn: điểm chính, quyết định, yêu cầu, rủi ro và câu hỏi mở, có ghi rõ nguồn từng mục.', 'Khi nhận chính sách, hợp đồng, RFP hay đặc tả dài; khi cần chuẩn bị họp gấp; khi mới tham gia dự án.'],
      ko: ['긴 문서에서 인사이트 추출하기', '목적에 맞춰 긴 문서의 핵심, 결정 사항, 요구사항, 위험, 열린 질문을 출처와 함께 요약합니다.', '긴 정책, 계약서, RFP, 명세서를 받았을 때; 시간이 없는데 회의를 준비할 때; 새 프로젝트에 합류할 때.'],
      fr: ['Extraire l’essentiel d’un long document', 'Résume un long document selon votre objectif : points clés, décisions, exigences, risques et questions ouvertes, avec la source de chaque élément.', 'Quand vous recevez une longue politique, un contrat, un appel d’offres ou une spécification ; pour préparer une réunion vite ; en arrivant sur un projet.'],
    },
  },
  {
    id: 'P-I03', phase: 'every', step: 14, cat: 'I', sub: 'Meeting summary generation', roles: ['BA', 'PO', 'PM'],
    title: 'Summarise a meeting into notes and actions',
    desc: 'Turns a transcript or rough notes into a short summary with decisions, action items, open questions and a follow-up message.',
    when: ['Right after a meeting with a transcript', 'You took messy notes', 'Someone missed the meeting and needs a recap'],
    prepare: 'The transcript or notes, attendees, the meeting purpose',
    ph: [['Meeting', 'Meeting name, date and attendees', 'Release 1 scope review, 4 Dec, Lending, Risk, PO, BA, Tech lead'],
      ['Transcript', 'Paste the transcript or notes', '(paste the transcript or notes here)']],
    body: `Act as an efficient meeting note-taker.

Meeting: [Meeting]
Transcript or notes:
"""
[Transcript]
"""

1. Summary in 3–5 bullets, focused on outcomes.
2. Decisions made (with who decided, if stated).
3. Action items: action, owner, due date. Mark missing owners or dates as "to confirm".
4. Open questions and parking-lot items.
5. A short follow-up message to send to attendees.

Rules: use only what was said; do not invent decisions; keep names as written.
Output: the sections above with headings, actions as a table.`,
    output: 'An outcome-focused summary, decisions, an action table with owners and dates, open questions and a ready-to-send follow-up message.',
    next: ['P-F06', 'P-I04'], tags: ['meeting summary', 'minutes', 'action items', 'transcript'],
    tr: {
      vi: ['Tóm tắt cuộc họp thành ghi chú và đầu việc', 'Biến bản ghi hoặc ghi chú thô thành tóm tắt ngắn với quyết định, đầu việc, câu hỏi mở và tin nhắn gửi sau họp.', 'Ngay sau cuộc họp có bản ghi; khi ghi chú lộn xộn; khi có người vắng mặt cần tóm tắt.'],
      ko: ['회의를 요약해 메모와 실행 항목 만들기', '녹취록이나 거친 메모를 결정 사항, 실행 항목, 열린 질문, 후속 메시지가 담긴 짧은 요약으로 바꿉니다.', '녹취록이 있는 회의 직후; 메모가 엉망일 때; 불참자에게 요약이 필요할 때.'],
      fr: ['Résumer une réunion en notes et actions', 'Transforme une transcription ou des notes brutes en résumé court avec décisions, actions, questions ouvertes et message de suivi.', 'Juste après une réunion transcrite ; quand vos notes sont désordonnées ; quand quelqu’un a manqué la réunion.'],
    },
  },
  {
    id: 'P-I04', phase: 'every', step: 15, cat: 'I', sub: 'Email and stakeholder update drafting', roles: ['BA', 'PO', 'PM'],
    title: 'Write a stakeholder email or update',
    desc: 'Drafts a clear, polite work email with the right tone for the reader, a subject line and one clear ask.',
    when: ['Writing to senior stakeholders', 'Delivering bad news or saying no', 'Writing in English as a second language'],
    prepare: 'Who the reader is, what you need from them, the key facts, the tone you want',
    ph: [['Reader', 'Who will read it', 'Head of Risk, senior, busy, prefers short emails'],
      ['Goal', 'What you need', 'Approval of the draft expiry rule (30 days) by Friday'],
      ['Key Facts', 'Facts to include', 'Legal agreed; 8% of drafts resumed after day 20; no customer impact on existing loans'],
      ['Tone', 'Tone', 'Polite and confident']],
    body: `Act as a business writing coach for non-native English speakers.

Reader: [Reader]
What I need: [Goal]
Key facts: [Key Facts]
Tone: [Tone]

Write the email:
1. A subject line that says what is needed and when.
2. First sentence: the ask or the main point.
3. Short context with the key facts (3 bullets maximum).
4. A clear next step and deadline.
5. A polite close.

Keep it under 150 words in simple, natural English. Then give one shorter version for chat, and explain 2 phrasing choices I can reuse.`,
    output: 'An email with subject, ask-first opening, brief context, next step and close; a short chat version; and 2 reusable phrases explained.',
    next: ['P-I07', 'P-F07'], tags: ['email', 'stakeholder update', 'business writing', 'tone'],
    tr: {
      vi: ['Viết email hoặc cập nhật cho các bên liên quan', 'Soạn email công việc rõ ràng, lịch sự, đúng giọng điệu với người đọc, có tiêu đề và một yêu cầu cụ thể.', 'Khi viết cho lãnh đạo cấp cao; khi báo tin xấu hay từ chối; khi viết tiếng Anh như ngôn ngữ thứ hai.'],
      ko: ['이해관계자 이메일·업데이트 작성하기', '독자에 맞는 어조, 제목, 하나의 명확한 요청을 담은 깔끔하고 정중한 업무 이메일을 작성합니다.', '고위 이해관계자에게 쓸 때; 나쁜 소식을 전하거나 거절할 때; 영어가 모국어가 아닐 때.'],
      fr: ['Rédiger un e-mail ou un point aux parties prenantes', 'Rédige un e-mail professionnel clair et courtois, au ton adapté, avec un objet et une demande précise.', 'Pour écrire à des dirigeants ; pour annoncer une mauvaise nouvelle ou dire non ; quand l’anglais n’est pas votre langue maternelle.'],
    },
  },
  {
    id: 'P-I05', phase: 'every', step: 16, cat: 'I', sub: 'Presentation and report preparation', roles: ['BA', 'PO', 'PM'],
    title: 'Outline a presentation or report',
    desc: 'Builds a storyline for a presentation or report: key message, slide-by-slide outline, the data to show and likely questions.',
    when: ['Preparing a steering committee or demo', 'Presenting a recommendation', 'Turning analysis into a story'],
    prepare: 'Audience, goal, time available, your main findings or data',
    ph: [['Audience', 'Who and what they care about', 'Executive committee; care about cost, risk and customer growth'],
      ['Goal', 'What you want them to do', 'Approve phase 2 budget for co-applicant support'],
      ['Findings', 'Main findings and data', 'Mobile share 46%; 18% of rejected applications would pass with a co-applicant; cost 1.2bn VND'],
      ['Time', 'Time available', '15 minutes plus 10 minutes Q&A']],
    body: `Act as a presentation coach for business and product people.

Audience: [Audience]
Goal: [Goal]
Findings: [Findings]
Time: [Time]

1. Write the key message in one sentence (the answer first).
2. Build the storyline using situation → complication → resolution, or a pyramid structure.
3. Give a slide-by-slide outline: slide title written as a takeaway sentence, the content, and the chart or visual to use.
4. Suggest timing per slide.
5. List the 5 hardest questions the audience may ask, with short answers.
6. Suggest what to put in the appendix.

Output: Key message, Storyline, an outline table (Slide | Takeaway title | Content | Visual | Minutes), Q&A, Appendix.`,
    output: 'A one-sentence key message, a storyline, a slide-by-slide outline with takeaway titles, visuals and timing, likely Q&A and appendix items.',
    next: ['P-I08', 'P-I04'], tags: ['presentation', 'storytelling', 'report', 'steering committee'],
    tr: {
      vi: ['Lập dàn ý bài thuyết trình hoặc báo cáo', 'Xây dựng mạch trình bày: thông điệp chính, dàn ý từng slide, số liệu cần đưa và các câu hỏi có thể gặp.', 'Khi chuẩn bị họp ban chỉ đạo hay demo; khi trình bày một đề xuất; khi biến phân tích thành câu chuyện.'],
      ko: ['발표나 보고서 개요 잡기', '핵심 메시지, 슬라이드별 개요, 보여줄 데이터, 예상 질문을 담은 발표·보고서 스토리라인을 만듭니다.', '운영위원회나 데모 준비 시; 권고안을 발표할 때; 분석을 이야기로 바꿀 때.'],
      fr: ['Structurer une présentation ou un rapport', 'Construit le fil d’une présentation ou d’un rapport : message clé, plan slide par slide, données à montrer et questions probables.', 'Pour préparer un comité de pilotage ou une démo ; pour présenter une recommandation ; pour transformer une analyse en récit.'],
    },
  },
  {
    id: 'P-I06', phase: 'every', step: 17, cat: 'I', sub: 'Interview preparation', roles: ['BA', 'PO', 'PM'],
    title: 'Prepare for a BA, PO or PM interview',
    desc: 'Prepares you for a specific job interview: likely questions, STAR answers from your experience, a case exercise and questions to ask.',
    when: ['You have an interview coming up', 'Moving into a BA, PO or PM role', 'Practising in English'],
    prepare: 'The job description, your experience highlights, the company and domain',
    ph: [['Job Description', 'Paste the key parts of the JD', 'Product Owner, digital lending; Scrum; stakeholder management; data-driven decisions'],
      ['My Experience', 'Your highlights', '3 years BA in banking, wrote 200+ user stories, led UAT for a mobile app, some PO tasks'],
      ['Company', 'Company and domain', 'Regional digital bank, consumer lending']],
    body: `Act as an interview coach for business analyst, product owner and project manager roles.

Job description: [Job Description]
My experience: [My Experience]
Company: [Company]

1. List 10 likely questions: behavioural, role skills, domain, and one case question.
2. For the 4 most important, draft STAR answers using my experience (Situation, Task, Action, Result with numbers). Mark anything I must fill in.
3. Give a short case exercise typical for this role and a model approach.
4. Suggest 5 smart questions to ask the interviewer.
5. Point out gaps between the JD and my experience, and how to talk about them honestly.

Output: question list, STAR answers, the case and approach, my questions, and gap talking points. Use simple, natural English.`,
    output: '10 likely questions, 4 STAR answers from your experience, a case exercise with a model approach, questions to ask, and honest gap talking points.',
    next: ['P-I07', 'P-I08'], tags: ['interview', 'career', 'STAR', 'job search'],
    tr: {
      vi: ['Chuẩn bị phỏng vấn vị trí BA, PO hoặc PM', 'Chuẩn bị cho buổi phỏng vấn cụ thể: câu hỏi có thể gặp, câu trả lời STAR từ kinh nghiệm của bạn, bài tình huống và câu hỏi nên đặt.', 'Khi sắp có buổi phỏng vấn; khi chuyển sang vai trò BA, PO hay PM; khi luyện phỏng vấn bằng tiếng Anh.'],
      ko: ['BA·PO·PM 면접 준비하기', '예상 질문, 내 경험으로 만든 STAR 답변, 사례 과제, 면접관에게 할 질문으로 특정 면접을 준비합니다.', '면접이 다가올 때; BA, PO, PM 역할로 옮길 때; 영어로 연습할 때.'],
      fr: ['Préparer un entretien BA, PO ou PM', 'Prépare un entretien précis : questions probables, réponses STAR tirées de votre expérience, étude de cas et questions à poser.', 'Quand un entretien approche ; pour passer à un rôle de BA, PO ou PM ; pour s’entraîner en anglais.'],
    },
  },
  {
    id: 'P-I07', phase: 'every', step: 18, cat: 'I', sub: 'Professional communication improvement', roles: ['BA', 'PO', 'PM'],
    title: 'Improve your professional communication',
    desc: 'Rewrites your text to be clearer and more professional, and explains each change so you learn the pattern.',
    when: ['Before sending an important message', 'Your writing feels too long or too direct', 'Learning business English'],
    prepare: 'The text you wrote, who will read it, the effect you want',
    ph: [['Text', 'Your draft', 'Hi team, I want to inform that the release is maybe delay because the vendor is late, please kindly check and revert.'],
      ['Reader', 'Who reads it', 'Project team and the sponsor'],
      ['Effect', 'Effect you want', 'Clear, calm, professional; not alarming']],
    body: `Act as a business English coach for non-native speakers.

My text: [Text]
Reader: [Reader]
Effect I want: [Effect]

1. Rewrite the text so it is clear, concise and professional, keeping my meaning.
2. Give a table of changes: original phrase → better phrase → why (grammar, tone, clarity, word choice).
3. Point out 2–3 patterns I should remember (e.g. avoid "revert" for "reply", put the main point first).
4. Offer one more formal and one more friendly version.

Rules: keep my voice; do not add facts; use common words over rare ones.`,
    output: 'A rewritten version, a change table with reasons, 2–3 patterns to remember, and a more formal and a more friendly alternative.',
    next: ['P-I04', 'P-I08'], tags: ['business English', 'writing', 'tone', 'communication'],
    tr: {
      vi: ['Nâng cao cách giao tiếp chuyên nghiệp', 'Viết lại đoạn văn của bạn rõ ràng, chuyên nghiệp hơn và giải thích từng thay đổi để bạn học được mẫu câu.', 'Trước khi gửi tin nhắn quan trọng; khi văn viết quá dài hay quá thẳng; khi đang học tiếng Anh công sở.'],
      ko: ['업무 커뮤니케이션 개선하기', '글을 더 명확하고 전문적으로 다시 쓰고, 패턴을 익힐 수 있도록 바뀐 부분을 하나씩 설명합니다.', '중요한 메시지를 보내기 전; 글이 너무 길거나 직설적으로 느껴질 때; 비즈니스 영어를 배울 때.'],
      fr: ['Améliorer votre communication professionnelle', 'Réécrit votre texte pour le rendre plus clair et professionnel, et explique chaque changement pour que vous reteniez la tournure.', 'Avant d’envoyer un message important ; quand vos écrits semblent trop longs ou trop directs ; pour apprendre l’anglais des affaires.'],
    },
  },
  {
    id: 'P-I08', phase: 'every', step: 19, cat: 'I', sub: 'Explaining technical concepts to non-technical stakeholders', roles: ['BA', 'PO', 'PM'],
    title: 'Explain a technical concept to non-technical people',
    desc: 'Explains a technical topic in plain language with an analogy, the business impact and the decision the audience needs to make.',
    when: ['Developers explain something stakeholders do not follow', 'Asking for budget for technical work', 'Explaining a risk or incident'],
    prepare: 'The concept, the audience, why it matters now',
    ph: [['Concept', 'Technical concept', 'Technical debt in the loan application service; we need 2 sprints to refactor'],
      ['Audience', 'Who needs to understand', 'Head of Retail Lending and the sales director'],
      ['Why Now', 'Why it matters now', 'Releases are getting slower and we had 2 incidents this quarter']],
    body: `Act as a business analyst who translates between tech and business.

Concept: [Concept]
Audience: [Audience]
Why it matters now: [Why Now]

1. Explain the concept in 3 plain sentences, no jargon.
2. Give an everyday analogy that fits this audience, and say where the analogy breaks.
3. Explain the business impact: money, time, risk, customers — with numbers if possible.
4. Present the options and the decision they need to make.
5. Prepare short answers to 3 likely questions.
6. Give a 30-second version I can say out loud.

Output: the sections above with headings.`,
    output: 'A jargon-free explanation, an analogy with its limits, business impact, options and the decision needed, likely Q&A and a 30-second spoken version.',
    next: ['P-I05', 'P-F08'], tags: ['explaining', 'non-technical', 'analogy', 'stakeholders'],
    tr: {
      vi: ['Giải thích khái niệm kỹ thuật cho người không chuyên', 'Giải thích chủ đề kỹ thuật bằng ngôn ngữ đơn giản, có ví dụ so sánh, tác động kinh doanh và quyết định người nghe cần đưa ra.', 'Khi lập trình viên giải thích mà các bên không hiểu; khi xin ngân sách cho việc kỹ thuật; khi giải thích rủi ro hay sự cố.'],
      ko: ['비기술 이해관계자에게 기술 개념 설명하기', '쉬운 말과 비유, 비즈니스 영향, 청중이 내려야 할 결정으로 기술 주제를 설명합니다.', '개발자 설명을 이해관계자가 따라가지 못할 때; 기술 작업 예산을 요청할 때; 위험이나 장애를 설명할 때.'],
      fr: ['Expliquer un concept technique à des non-techniciens', 'Explique un sujet technique en langage simple, avec une analogie, l’impact métier et la décision attendue du public.', 'Quand les développeurs expliquent quelque chose que les métiers ne suivent pas ; pour demander un budget technique ; pour expliquer un risque ou un incident.'],
    },
  },
];
