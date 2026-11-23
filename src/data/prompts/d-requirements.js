// D. Business Analysis and Requirement Engineering
export default [
  {
    id: 'P-D01', phase: 'define', step: 3, cat: 'D', sub: 'Requirement elicitation and analysis', roles: ['BA'],
    title: 'Plan requirement elicitation',
    desc: 'Plans who to talk to, which technique to use with each group, and writes the interview or workshop questions.',
    when: ['Start of requirements work', 'Before a workshop or interview round', 'When previous sessions produced vague answers'],
    prepare: 'Stakeholder map, problem statement, scope, time available',
    ph: [['Business Context', 'The initiative', 'A retail bank replacing its paper loan application with a mobile journey'],
      ['Stakeholders', 'Groups to involve', 'Applicants, branch staff, credit analysts, Risk, Compliance, IT'],
      ['Time Available', 'Weeks and constraints', '3 weeks; Risk team only available on Thursdays']],
    body: `Act as a senior business analyst planning elicitation (BABOK: Prepare for Elicitation).

Context: [Business Context]
Stakeholders: [Stakeholders]
Time available: [Time Available]

1. For each stakeholder group, choose the best technique (interview, workshop, observation, survey, document analysis, prototype) and explain why in one line.
2. Draft a schedule within the time available.
3. Write 8–12 open questions for the most important interview, grouped by goals, current process, pain points, rules, data, success measures.
4. Write a 90-minute workshop agenda for the cross-team session.
5. List documents to analyse before the sessions.

Output: a plan table Group | Technique | Why | When, the question list, the agenda, then documents to read.`,
    output: 'An elicitation plan by stakeholder group with techniques and timing, an interview question list, a 90-minute workshop agenda and documents to analyse.',
    next: ['P-D05', 'P-I03'], tags: ['elicitation', 'interview', 'workshop', 'BABOK 4.1'],
    tr: {
      vi: ['Lập kế hoạch thu thập yêu cầu', 'Lên kế hoạch gặp ai, dùng kỹ thuật nào với từng nhóm, và soạn câu hỏi phỏng vấn hoặc workshop.', 'Khi bắt đầu công việc yêu cầu; trước đợt phỏng vấn hay workshop; khi các buổi trước cho câu trả lời mơ hồ.'],
      ko: ['요구사항 도출 계획하기', '누구와 이야기할지, 그룹별로 어떤 기법을 쓸지 계획하고 인터뷰·워크숍 질문을 작성합니다.', '요구사항 작업 시작 시; 워크숍이나 인터뷰 전; 이전 세션 답변이 모호했을 때.'],
      fr: ['Planifier l’élicitation des exigences', 'Planifie qui rencontrer, quelle technique utiliser avec chaque groupe, et rédige les questions d’entretien ou d’atelier.', 'Au début du travail sur les exigences ; avant une série d’entretiens ou d’ateliers ; quand les séances précédentes ont donné des réponses vagues.'],
    },
  },
  {
    id: 'P-D02', phase: 'define', step: 7, cat: 'D', sub: 'Functional and non-functional requirement definition', roles: ['BA'],
    title: 'Write functional and non-functional requirements',
    desc: 'Turns elicitation notes into clear, numbered functional and non-functional requirements with priorities and sources.',
    when: ['After elicitation sessions', 'Before writing user stories or an SRS', 'When notes are full of solutions and opinions'],
    prepare: 'Elicitation notes, business rules, scope, quality expectations (speed, security, availability)',
    ph: [['Notes', 'Your elicitation notes', 'Customers want to apply in 10 minutes; analysts re-type data; Risk needs a full audit trail; app must work on weak 4G'],
      ['Scope', 'Agreed scope', 'Mobile application, document upload, back-office review']],
    body: `Act as a business analyst writing requirements.

Elicitation notes: [Notes]
Scope: [Scope]

1. Write functional requirements as "The system shall…" statements, one capability each, numbered FR-01…, grouped by feature.
2. Write non-functional requirements numbered NFR-01…, covering performance, availability, security, privacy, usability, accessibility, compatibility and audit — each with a measurable target.
3. Give each requirement a MoSCoW priority and its source (stakeholder or document).
4. Rewrite anything vague ("fast", "user-friendly") with a number or a test.
5. List items in the notes that are out of scope, solutions in disguise, or need confirmation.

Output: an FR table (ID, requirement, priority, source), an NFR table (ID, category, requirement, measure, priority), then Out of scope / To confirm.`,
    output: 'Numbered FR and NFR tables with measurable targets, MoSCoW priority and source, plus items out of scope or to confirm.',
    next: ['P-D03', 'P-D10'], tags: ['functional requirements', 'non-functional requirements', 'NFR', 'SRS'],
    tr: {
      vi: ['Viết yêu cầu chức năng và phi chức năng', 'Biến ghi chú thu thập thành các yêu cầu chức năng và phi chức năng rõ ràng, đánh số, có ưu tiên và nguồn.', 'Sau các buổi thu thập yêu cầu; trước khi viết user story hay SRS; khi ghi chú toàn giải pháp và ý kiến.'],
      ko: ['기능·비기능 요구사항 작성하기', '도출 메모를 우선순위와 출처가 있는 명확한 번호형 기능·비기능 요구사항으로 바꿉니다.', '도출 세션 후; 사용자 스토리나 SRS 작성 전; 메모가 해결책과 의견으로 가득할 때.'],
      fr: ['Rédiger les exigences fonctionnelles et non fonctionnelles', 'Transforme les notes d’élicitation en exigences fonctionnelles et non fonctionnelles claires, numérotées, avec priorité et source.', 'Après les séances d’élicitation ; avant les user stories ou une SRS ; quand les notes sont pleines de solutions et d’opinions.'],
    },
  },
  {
    id: 'P-D03', phase: 'define', step: 8, cat: 'D', sub: 'Requirement decomposition and refinement', roles: ['BA', 'PO'],
    title: 'Decompose and refine a requirement',
    desc: 'Breaks a large or vague requirement into smaller, testable requirements and lists the questions still open.',
    when: ['A requirement is too big to estimate', 'Developers interpret a requirement differently', 'Before backlog refinement'],
    prepare: 'The requirement as written, related rules, who requested it',
    ph: [['Requirement', 'The requirement to refine', 'The system shall allow customers to manage their loan application online'],
      ['Context', 'Related rules or notes', 'Customers can save drafts; documents can be added until review starts']],
    body: `Act as a business analyst refining requirements.

Requirement: [Requirement]
Context: [Context]

1. Explain what is vague or too big in the requirement.
2. Decompose it into 4–10 child requirements, each atomic, testable and independent where possible (numbered 1.1, 1.2…).
3. For each child, note the business rules and data involved.
4. Check each child against the criteria: clear, complete, consistent, feasible, testable, traceable.
5. List open questions and who should answer each.

Output: a short diagnosis, a table Child requirement | Rules and data | Quality check, then Open questions.`,
    output: 'A diagnosis of the original requirement, 4–10 atomic child requirements with rules and a quality check, and open questions with owners.',
    next: ['P-D04', 'P-E01'], tags: ['decomposition', 'refinement', 'requirement quality'],
    tr: {
      vi: ['Phân rã và tinh chỉnh một yêu cầu', 'Chia nhỏ một yêu cầu lớn hoặc mơ hồ thành các yêu cầu nhỏ hơn, kiểm thử được, và liệt kê câu hỏi còn mở.', 'Khi yêu cầu quá lớn để ước lượng; khi dev hiểu yêu cầu khác nhau; trước buổi refinement backlog.'],
      ko: ['요구사항 분해 및 구체화하기', '크거나 모호한 요구사항을 테스트 가능한 작은 요구사항으로 나누고 남은 질문을 정리합니다.', '요구사항이 너무 커서 추정이 어려울 때; 개발자마다 해석이 다를 때; 백로그 정제 전.'],
      fr: ['Décomposer et affiner une exigence', 'Découpe une exigence trop large ou floue en exigences plus petites et testables, et liste les questions ouvertes.', 'Quand une exigence est trop grosse pour être estimée ; quand les développeurs l’interprètent différemment ; avant l’affinage du backlog.'],
    },
  },
  {
    id: 'P-D04', phase: 'define', step: 9, cat: 'D', sub: 'Requirement prioritization', roles: ['BA', 'PO'],
    title: 'Prioritise requirements with MoSCoW',
    desc: 'Applies MoSCoW to a requirement list with clear reasons, checks the Must list fits the time box, and prepares the conversation with stakeholders.',
    when: ['Too many "must haves"', 'Fixed deadline with flexible scope', 'Before agreeing the MVP'],
    prepare: 'The requirement list, the deadline and capacity, business objectives',
    ph: [['Requirements', 'List of requirements', 'FR-01 Apply on mobile; FR-02 Save draft; FR-03 Upload documents; FR-04 Chat with an advisor; FR-05 E-signature'],
      ['Objective', 'Main business objective', 'Loan decision in 2 days for 40% of applications'],
      ['Time Box', 'Deadline and capacity', 'Release in 12 weeks, one team']],
    body: `Act as a business analyst facilitating prioritisation.

Requirements: [Requirements]
Main objective: [Objective]
Time box: [Time Box]

1. Assign Must, Should, Could or Won't (this time) to each requirement, with a one-line reason linked to the objective, regulation or risk.
2. Test every Must: "Would the release be useless, illegal or unsafe without it?" Downgrade those that fail.
3. Check that Musts are no more than about 60% of the effort; if they are more, say what to cut or split.
4. Suggest how to present the result to stakeholders who will disagree.

Output: a table Requirement | Priority | Reason, then the effort check and stakeholder notes.`,
    output: 'A MoSCoW table with reasons, a stress-test of the Must list, a 60% effort check, and tips for the stakeholder conversation.',
    next: ['P-D10', 'P-E07'], tags: ['MoSCoW', 'prioritisation', 'MVP'],
    tr: {
      vi: ['Ưu tiên yêu cầu bằng MoSCoW', 'Áp dụng MoSCoW cho danh sách yêu cầu kèm lý do rõ ràng, kiểm tra danh sách Must vừa khung thời gian và chuẩn bị trao đổi với các bên.', 'Khi có quá nhiều "bắt buộc"; khi hạn cố định còn phạm vi linh hoạt; trước khi chốt MVP.'],
      ko: ['MoSCoW로 요구사항 우선순위 정하기', '요구사항 목록에 이유와 함께 MoSCoW를 적용하고 Must 목록이 기간 안에 맞는지 확인하며 이해관계자 논의를 준비합니다.', '"필수"가 너무 많을 때; 마감은 고정되고 범위는 유연할 때; MVP 합의 전.'],
      fr: ['Prioriser les exigences avec MoSCoW', 'Applique MoSCoW à une liste d’exigences avec des raisons claires, vérifie que les Must tiennent dans le délai et prépare l’échange avec les parties prenantes.', 'Trop de « must have » ; délai fixe et périmètre flexible ; avant de valider le MVP.'],
    },
  },
  {
    id: 'P-D05', phase: 'define', step: 4, cat: 'D', sub: 'Business process analysis (AS-IS / TO-BE)', roles: ['BA'],
    title: 'Model the AS-IS and TO-BE process',
    desc: 'Describes the current process step by step, finds waste and pain points, and proposes the future process with measurable improvements.',
    when: ['Before automating or changing a process', 'When the team argues about how things work today', 'For a process improvement initiative'],
    prepare: 'How the process runs today (steps, roles, systems, time per step), known problems, goals',
    ph: [['Process', 'Process name and scope', 'Loan application, from customer enquiry to decision'],
      ['Current Steps', 'Steps as they happen today', 'Customer visits branch; officer fills paper form; scans documents; analyst re-types data; risk reviews; decision by phone'],
      ['Goal', 'Improvement goal', 'Decision in 2 days, no re-typing']],
    body: `Act as a business process analyst.

Process: [Process]
Current steps: [Current Steps]
Goal: [Goal]

1. AS-IS: a numbered table of steps with role, system, input, output, average time and pain points.
2. Mark waste: waiting, re-work, re-typing, hand-offs, approvals with no value.
3. TO-BE: the future steps, showing what is removed, automated or changed, and who does what.
4. Compare AS-IS vs TO-BE on total time, hand-offs and manual steps.
5. List what has to change to get there: people, process, technology, policy.

Output: AS-IS table, Waste list, TO-BE table, a comparison table, Change list. Add both flows as Mermaid code if useful.`,
    output: 'An AS-IS step table with pain points, waste, a TO-BE table, a before/after comparison of time and hand-offs, and the changes needed.',
    next: ['P-D06', 'P-C05'], tags: ['AS-IS', 'TO-BE', 'process modelling', 'BPMN'],
    tr: {
      vi: ['Mô hình hóa quy trình AS-IS và TO-BE', 'Mô tả quy trình hiện tại từng bước, tìm lãng phí và điểm đau, đề xuất quy trình tương lai với cải thiện đo được.', 'Trước khi tự động hóa hay thay đổi quy trình; khi nhóm tranh cãi quy trình hiện tại chạy thế nào; trong dự án cải tiến quy trình.'],
      ko: ['AS-IS와 TO-BE 프로세스 모델링하기', '현재 프로세스를 단계별로 설명하고 낭비와 불편을 찾아 측정 가능한 개선이 담긴 미래 프로세스를 제안합니다.', '프로세스 자동화나 변경 전; 현재 방식에 대해 팀 의견이 다를 때; 프로세스 개선 과제에서.'],
      fr: ['Modéliser les processus AS-IS et TO-BE', 'Décrit le processus actuel pas à pas, repère gaspillages et irritants, et propose le processus cible avec des gains mesurables.', 'Avant d’automatiser ou de changer un processus ; quand l’équipe n’est pas d’accord sur le fonctionnement actuel ; pour une amélioration de processus.'],
    },
  },
  {
    id: 'P-D06', phase: 'define', step: 5, cat: 'D', sub: 'Gap analysis', roles: ['BA'],
    title: 'Run a gap analysis',
    desc: 'Compares the current state with the target state across process, people, data and technology, and turns the gaps into actions.',
    when: ['After the AS-IS and TO-BE are drafted', 'Evaluating a package against requirements', 'Planning a transformation'],
    prepare: 'Current state description, target state or requirements, constraints',
    ph: [['Current State', 'How it works today', 'Paper forms, manual data entry, decisions by email, no tracking'],
      ['Target State', 'Where you want to be', 'Mobile application, automatic data capture, workflow with SLA tracking']],
    body: `Act as a business analyst running a gap analysis.

Current state: [Current State]
Target state: [Target State]

1. Compare current and target across: process, people and skills, data, technology, policy and compliance.
2. For each gap: describe it, its impact if not closed (high / medium / low), and the action to close it.
3. Classify each action as quick win, project, or needs decision.
4. Note dependencies between actions.

Output: a table Area | Current | Target | Gap | Impact | Action | Type, then Dependencies.`,
    output: 'A gap table across process, people, data, technology and policy with impact and closing actions, classified and with dependencies.',
    next: ['P-D08', 'P-D02'], tags: ['gap analysis', 'current state', 'future state'],
    tr: {
      vi: ['Phân tích khoảng cách (gap analysis)', 'So sánh hiện trạng với trạng thái mục tiêu về quy trình, con người, dữ liệu, công nghệ và biến khoảng cách thành hành động.', 'Sau khi phác thảo AS-IS và TO-BE; khi đánh giá phần mềm đóng gói theo yêu cầu; khi lập kế hoạch chuyển đổi.'],
      ko: ['갭 분석 수행하기', '현재 상태와 목표 상태를 프로세스, 사람, 데이터, 기술 측면에서 비교하고 격차를 실행 항목으로 바꿉니다.', 'AS-IS와 TO-BE 초안 후; 패키지 솔루션을 요구사항과 비교할 때; 전환 계획 시.'],
      fr: ['Réaliser une analyse d’écarts', 'Compare l’état actuel et l’état cible (processus, personnes, données, technologie) et transforme les écarts en actions.', 'Après les ébauches AS-IS et TO-BE ; pour évaluer un progiciel face aux exigences ; pour planifier une transformation.'],
    },
  },
  {
    id: 'P-D07', phase: 'define', step: 11, cat: 'D', sub: 'Impact analysis', roles: ['BA', 'PM'],
    title: 'Analyse the impact of a change',
    desc: 'Assesses a change request against scope, requirements, systems, people, cost, time and risk, and recommends a decision.',
    when: ['A change request arrives mid-project', 'A regulation or policy changes', 'Before approving a "small" change'],
    prepare: 'The change request, current requirements and design, plan and budget status',
    ph: [['Change Request', 'What is being asked and why', 'Add e-signature for the loan contract so customers do not visit the branch'],
      ['Current Status', 'Project status', 'Sprint 5 of 8; contract screen built; budget 70% used']],
    body: `Act as a business analyst assessing a change request.

Change request: [Change Request]
Current status: [Current Status]

1. Summarise the change and the business reason.
2. Assess impact on: requirements (added / changed / removed), design and systems, data, testing, users and training, documentation, schedule, cost, risk and compliance.
3. Estimate effort roughly (S / M / L) and say what assumption drives it.
4. Give options: accept now, defer to a later release, accept a reduced version, reject — with the consequence of each.
5. Recommend one option and the approver needed.

Output: a table Area | Impact | Notes, then Options and Recommendation.`,
    output: 'A change summary, an impact table across 10 areas, rough effort, options with consequences, and a recommendation with the approver.',
    next: ['P-D09', 'P-F05'], tags: ['impact analysis', 'change request', 'change control'],
    tr: {
      vi: ['Phân tích tác động của thay đổi', 'Đánh giá yêu cầu thay đổi theo phạm vi, yêu cầu, hệ thống, con người, chi phí, thời gian và rủi ro, đề xuất quyết định.', 'Khi có yêu cầu thay đổi giữa dự án; khi quy định hay chính sách thay đổi; trước khi duyệt một thay đổi "nhỏ".'],
      ko: ['변경 영향 분석하기', '변경 요청을 범위, 요구사항, 시스템, 사람, 비용, 일정, 위험 측면에서 평가하고 결정을 권고합니다.', '프로젝트 중 변경 요청이 들어올 때; 규정이나 정책이 바뀔 때; "작은" 변경 승인 전.'],
      fr: ['Analyser l’impact d’un changement', 'Évalue une demande de changement sur le périmètre, les exigences, les systèmes, les personnes, le coût, le délai et le risque, puis recommande une décision.', 'Quand une demande de changement arrive en cours de projet ; quand une réglementation change ; avant d’approuver un « petit » changement.'],
    },
  },
  {
    id: 'P-D08', phase: 'define', step: 6, cat: 'D', sub: 'Root cause analysis', roles: ['BA'],
    title: 'Run a root cause analysis',
    desc: 'Finds the root causes of a problem with a fishbone and 5 Whys, and separates verified causes from hypotheses.',
    when: ['A problem keeps coming back', 'Before choosing a solution', 'After an incident or a failed release'],
    prepare: 'The problem statement, data and examples, people involved',
    ph: [['Problem', 'The problem to analyse', '25% of loan applications are returned to customers for missing documents'],
      ['Evidence', 'Data and examples', 'Most returns are for income proof; more in the first week after policy changes']],
    body: `Act as a business analyst running a root cause analysis.

Problem: [Problem]
Evidence: [Evidence]

1. Build a fishbone (Ishikawa) with categories: People, Process, Policy, Technology, Data, Environment. List possible causes under each.
2. Pick the 3 most likely causes and run 5 Whys on each.
3. For every root cause, say whether it is verified by the evidence or a hypothesis, and how to verify it.
4. Suggest a countermeasure for each verified or likely root cause, and how to measure that it worked.

Output: the fishbone as a list by category, the 5 Whys chains, then a table Root cause | Verified? | How to verify | Countermeasure | Measure.`,
    output: 'A fishbone by category, three 5 Whys chains, and a table of root causes (verified or hypothesis) with verification steps, countermeasures and measures.',
    next: ['P-D02', 'P-A06'], tags: ['root cause', 'fishbone', 'Ishikawa', '5 whys'],
    tr: {
      vi: ['Phân tích nguyên nhân gốc rễ', 'Tìm nguyên nhân gốc của vấn đề bằng sơ đồ xương cá và 5 Whys, tách nguyên nhân đã kiểm chứng khỏi giả thuyết.', 'Khi vấn đề cứ lặp lại; trước khi chọn giải pháp; sau sự cố hay một đợt phát hành thất bại.'],
      ko: ['근본 원인 분석하기', '피시본과 5 Whys로 문제의 근본 원인을 찾고 검증된 원인과 가설을 구분합니다.', '문제가 반복될 때; 해결책 선택 전; 장애나 실패한 릴리스 후.'],
      fr: ['Mener une analyse des causes racines', 'Trouve les causes racines d’un problème avec un diagramme d’Ishikawa et les 5 pourquoi, en séparant causes vérifiées et hypothèses.', 'Quand un problème revient sans cesse ; avant de choisir une solution ; après un incident ou une release ratée.'],
    },
  },
  {
    id: 'P-D09', phase: 'define', step: 12, cat: 'D', sub: 'Requirement traceability', roles: ['BA'],
    title: 'Build a requirements traceability matrix',
    desc: 'Links business needs to requirements, stories, test cases and releases, and highlights anything not covered.',
    when: ['Regulated or audited projects', 'Before UAT, to check coverage', 'When scope changes and you need to see the impact'],
    prepare: 'Business objectives, requirement IDs, story IDs, test case IDs (whatever exists)',
    ph: [['Needs', 'Business needs or objectives', 'BN-1 Decision in 2 days; BN-2 No re-typing; BN-3 Full audit trail'],
      ['Requirements', 'Requirements with IDs', 'FR-01 mobile form; FR-02 save draft; FR-03 document upload; FR-04 auto data capture; NFR-05 audit log'],
      ['Tests', 'Stories and tests with IDs (optional)', 'US-12 → TC-30, TC-31; US-14 → TC-40']],
    body: `Act as a business analyst maintaining traceability.

Business needs: [Needs]
Requirements: [Requirements]
Stories and tests: [Tests]

1. Build a matrix linking each business need → requirements → stories → test cases → release.
2. Highlight gaps: needs with no requirement, requirements with no story or test, tests with no requirement (gold-plating).
3. Note requirements that change often or carry high risk, and suggest extra coverage.
4. Explain how to keep the matrix up to date with little effort.

Output: the traceability table, then Coverage gaps, High-risk items, Maintenance tips.`,
    output: 'A need → requirement → story → test → release matrix, coverage gaps in both directions, high-risk items and maintenance tips.',
    next: ['P-D11', 'P-G07'], tags: ['traceability', 'RTM', 'coverage', 'BABOK 5.1'],
    tr: {
      vi: ['Xây dựng ma trận truy vết yêu cầu', 'Liên kết nhu cầu kinh doanh với yêu cầu, story, test case và đợt phát hành, chỉ ra phần chưa được bao phủ.', 'Dự án có quản lý hay kiểm toán; trước UAT để kiểm tra độ bao phủ; khi phạm vi đổi và cần thấy tác động.'],
      ko: ['요구사항 추적 매트릭스 만들기', '비즈니스 요구를 요구사항, 스토리, 테스트 케이스, 릴리스와 연결하고 누락된 부분을 보여줍니다.', '규제나 감사 대상 프로젝트; UAT 전 커버리지 점검; 범위 변경 영향 파악 시.'],
      fr: ['Construire une matrice de traçabilité des exigences', 'Relie besoins métier, exigences, user stories, cas de test et releases, et signale ce qui n’est pas couvert.', 'Projets réglementés ou audités ; avant la recette, pour vérifier la couverture ; quand le périmètre change et qu’il faut voir l’impact.'],
    },
  },
  {
    id: 'P-D10', phase: 'define', step: 10, cat: 'D', sub: 'Acceptance criteria definition', roles: ['BA', 'PO'],
    title: 'Write acceptance criteria for requirements',
    desc: 'Writes clear, testable acceptance criteria for each requirement, covering rules, data and error cases.',
    when: ['Before requirements are signed off', 'When testers ask how to check a requirement', 'Before sizing work'],
    prepare: 'Requirements with IDs, business rules, examples of valid and invalid cases',
    ph: [['Requirements', 'Requirements with IDs', 'FR-02 Customers can save a draft application and continue later'],
      ['Rules', 'Related rules', 'Drafts expire after 30 days; one draft per customer; documents kept with the draft']],
    body: `Act as a business analyst writing acceptance criteria.

Requirements: [Requirements]
Rules: [Rules]

For each requirement:
1. Write 3–7 acceptance criteria as short, testable statements (or Given / When / Then if the team prefers).
2. Cover the main case, each business rule, boundaries, error handling and permissions.
3. Avoid UI details unless they matter to the business.
4. Note any test data needed.

Output: one block per requirement: ID, the criteria as a checklist, test data notes. Then a list of questions where the rule is unclear.`,
    output: 'Per requirement: 3–7 testable acceptance criteria covering rules, boundaries, errors and permissions, test data notes, and open questions.',
    next: ['P-D07', 'P-E05'], tags: ['acceptance criteria', 'testable', 'definition of done'],
    tr: {
      vi: ['Viết tiêu chí chấp nhận cho yêu cầu', 'Viết tiêu chí chấp nhận rõ ràng, kiểm thử được cho từng yêu cầu, bao gồm quy tắc, dữ liệu và trường hợp lỗi.', 'Trước khi ký duyệt yêu cầu; khi tester hỏi cách kiểm tra yêu cầu; trước khi ước lượng công việc.'],
      ko: ['요구사항 인수 기준 작성하기', '요구사항마다 규칙, 데이터, 오류 상황을 포함한 명확하고 테스트 가능한 인수 기준을 작성합니다.', '요구사항 승인 전; 테스터가 확인 방법을 물을 때; 작업 규모 산정 전.'],
      fr: ['Rédiger les critères d’acceptation des exigences', 'Rédige des critères d’acceptation clairs et testables pour chaque exigence, couvrant règles, données et cas d’erreur.', 'Avant la validation des exigences ; quand les testeurs demandent comment vérifier une exigence ; avant le chiffrage.'],
    },
  },
  {
    id: 'P-D11', phase: 'define', step: 13, cat: 'D', sub: 'Requirement validation and review', roles: ['BA'],
    title: 'Review and validate requirements',
    desc: 'Reviews a set of requirements for quality and business value, and prepares a structured walkthrough with stakeholders.',
    when: ['Before sign-off', 'Before handing requirements to development or a vendor', 'When rework rates are high'],
    prepare: 'The requirements document or list, objectives, list of reviewers',
    ph: [['Requirements Text', 'Paste the requirements', 'FR-01…FR-24 and NFR-01…NFR-09 from the loan application SRS'],
      ['Objectives', 'Business objectives', 'Decision in 2 days; no re-typing; full audit trail']],
    body: `Act as a senior business analyst reviewing requirements (BABOK: Verify and Validate Requirements).

Requirements: [Requirements Text]
Objectives: [Objectives]

1. Verify quality: for each requirement, flag problems — ambiguous, incomplete, not testable, inconsistent, duplicated, a solution not a need, missing priority or source. Suggest a rewrite.
2. Validate value: check each requirement supports at least one objective; flag those that do not.
3. Find missing requirements (e.g. reporting, audit, error handling, data migration, NFRs).
4. Prepare a 60-minute walkthrough agenda with questions for the reviewers.

Output: a table ID | Problem | Suggested rewrite, then Not linked to objectives, Possibly missing, and the walkthrough agenda.`,
    output: 'A quality review table with rewrites, requirements not linked to objectives, likely missing requirements, and a walkthrough agenda.',
    next: ['P-D12', 'P-D09'], tags: ['requirements review', 'verification', 'validation', 'BABOK 7.2'],
    tr: {
      vi: ['Rà soát và xác nhận yêu cầu', 'Rà soát bộ yêu cầu về chất lượng và giá trị kinh doanh, chuẩn bị buổi walkthrough có cấu trúc với các bên liên quan.', 'Trước khi ký duyệt; trước khi giao yêu cầu cho đội phát triển hay nhà cung cấp; khi tỷ lệ làm lại cao.'],
      ko: ['요구사항 검토 및 확인하기', '요구사항 품질과 비즈니스 가치를 검토하고 이해관계자와의 구조화된 워크스루를 준비합니다.', '승인 전; 개발팀이나 공급업체에 넘기기 전; 재작업이 많을 때.'],
      fr: ['Revoir et valider les exigences', 'Revoit un ensemble d’exigences (qualité et valeur métier) et prépare une revue structurée avec les parties prenantes.', 'Avant la validation ; avant de confier les exigences au développement ou à un fournisseur ; quand le taux de reprise est élevé.'],
    },
  },
  {
    id: 'P-D12', phase: 'define', step: 14, cat: 'D', sub: 'BRD, SRS and BA documentation', roles: ['BA'],
    title: 'Draft a BRD or SRS',
    desc: 'Assembles a business requirements document or software requirements specification from your notes, with a standard structure.',
    when: ['A sponsor, vendor or auditor needs a formal document', 'Consolidating requirements at the end of analysis', 'Handing over to another team'],
    prepare: 'Objectives, scope, stakeholders, requirements, rules, NFRs, assumptions',
    ph: [['Document Type', 'BRD or SRS', 'BRD'],
      ['Project Notes', 'Everything you have', 'Objectives, scope table, stakeholder list, FR and NFR tables, business rules, open issues']],
    body: `Act as a senior business analyst writing a [Document Type].

Material: [Project Notes]

Build the document with standard sections:
- For a BRD: purpose, background and problem, objectives and success measures, scope (in / out), stakeholders, current and future process summary, business requirements, business rules, assumptions, constraints, dependencies, risks, glossary, sign-off.
- For an SRS: introduction, overall description (users, environment, constraints), functional requirements by feature, external interfaces, non-functional requirements, data requirements, appendix.

Rules: reuse the IDs from my notes; write "TBD — owner" where information is missing instead of inventing it; keep the language plain.
Output: the document in markdown with numbered headings, then a list of TBD items.`,
    output: 'A complete BRD or SRS in markdown with numbered standard sections, existing IDs kept, and a list of TBD items with owners.',
    next: ['P-D11', 'P-E01'], tags: ['BRD', 'SRS', 'documentation', 'specification'],
    tr: {
      vi: ['Soạn BRD hoặc SRS', 'Tổng hợp tài liệu yêu cầu kinh doanh (BRD) hoặc đặc tả yêu cầu phần mềm (SRS) từ ghi chú, theo cấu trúc chuẩn.', 'Khi nhà tài trợ, nhà cung cấp hay kiểm toán cần tài liệu chính thức; khi tổng hợp yêu cầu cuối giai đoạn phân tích; khi bàn giao cho nhóm khác.'],
      ko: ['BRD 또는 SRS 초안 작성하기', '메모를 바탕으로 표준 구조의 비즈니스 요구사항 문서나 소프트웨어 요구사항 명세서를 만듭니다.', '스폰서, 공급업체, 감사인이 공식 문서를 요구할 때; 분석 단계 말 요구사항 통합 시; 다른 팀에 인계할 때.'],
      fr: ['Rédiger un BRD ou une SRS', 'Assemble un document d’exigences métier ou une spécification logicielle à partir de vos notes, selon une structure standard.', 'Quand un sponsor, un fournisseur ou un auditeur exige un document formel ; pour consolider les exigences en fin d’analyse ; pour passer le relais à une autre équipe.'],
    },
  },
];
