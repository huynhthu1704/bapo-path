// B. Project and Product Planning
export default [
  {
    id: 'P-B01', phase: 'define', step: 1, cat: 'B', sub: 'Project initiation and planning', roles: ['PM'],
    title: 'Plan project initiation',
    desc: 'Drafts a one-page project charter: purpose, objectives, scope, stakeholders, milestones, risks and governance.',
    when: ['A project has been approved and needs to start', 'Before the kickoff meeting', 'When nobody can say who decides what'],
    prepare: 'The approved business case or objectives, sponsor name, known constraints, target dates',
    ph: [['Project', 'Name and one-line purpose', 'QuickLoan – mobile loan application'],
      ['Objectives', 'Agreed objectives', 'Loan decision in 2 days; 40% of applications on mobile by Q3 2027'],
      ['Constraints', 'Budget, dates, rules', 'US$250k; go-live before Tet; State Bank e-KYC rules']],
    body: `Act as an experienced project manager.

Project: [Project]
Objectives: [Objectives]
Constraints: [Constraints]

Draft a one-page project charter with: purpose, objectives with measures, in-scope and out-of-scope, key stakeholders and roles (sponsor, PM, PO, BA, tech lead), major milestones, top 5 risks with owners, governance (who decides what, steering cadence) and success criteria.
Rules: mark anything you assumed with "(assumed)"; keep each section to 3–5 lines.
Output: the charter as headed sections, then a list "Questions to settle at kickoff".`,
    output: 'A one-page charter in 8 headed sections, assumptions marked, plus questions to settle at kickoff.',
    next: ['P-B03', 'P-B05'], tags: ['charter', 'kickoff', 'initiation', 'PMBOK'],
    tr: {
      vi: ['Lập kế hoạch khởi động dự án', 'Soạn project charter một trang: mục đích, mục tiêu, phạm vi, các bên liên quan, mốc chính, rủi ro và cơ chế quản trị.', 'Dự án vừa được duyệt; trước buổi kickoff; khi không ai biết ai quyết định việc gì.'],
      ko: ['프로젝트 착수 계획하기', '목적, 목표, 범위, 이해관계자, 마일스톤, 위험, 거버넌스를 담은 1페이지 프로젝트 헌장을 작성합니다.', '프로젝트가 승인되어 시작할 때; 킥오프 회의 전; 누가 무엇을 결정하는지 불분명할 때.'],
      fr: ['Planifier le lancement du projet', 'Rédige une charte projet d’une page : finalité, objectifs, périmètre, parties prenantes, jalons, risques et gouvernance.', 'Un projet vient d’être approuvé ; avant la réunion de lancement ; quand personne ne sait qui décide de quoi.'],
    },
  },
  {
    id: 'P-B02', phase: 'discover', step: 9, cat: 'B', sub: 'Product vision, strategy and roadmap', roles: ['PO'],
    title: 'Write the product vision and strategy',
    desc: 'Writes a one-line vision, a product vision board and a first Now / Next / Later roadmap tied to the business goals.',
    when: ['Starting a new product or a big new capability', "When the team can't say why the product exists", 'Before the first release plan'],
    prepare: 'Target customers, the problem, the business objectives, the top opportunities you chose',
    ph: [['Product', 'Product name', 'QuickLoan mobile journey'],
      ['Target Customers', 'Who it is for', 'Existing bank customers aged 25–45'],
      ['Problem', 'The problem it solves', 'Loan decisions take 9 days'],
      ['Business Goals', 'Agreed goals', 'Decision in 2 days; +20% digital applications'],
      ['Chosen Opportunities', 'Opportunities you picked', 'Mobile application, instant ID check, SMS updates']],
    body: `Act as an experienced product owner.

Product: [Product]
Target customers: [Target Customers]
Problem: [Problem]
Business goals: [Business Goals]
Opportunities we chose: [Chosen Opportunities]

1. Write a vision statement in one sentence that a new team member could repeat.
2. Fill in a product vision board: target group, needs, product (top 3 features), business goals.
3. Propose 3 strategic themes that connect the opportunities to the goals.
4. Draft a Now / Next / Later roadmap. For each item give the outcome it should achieve and the metric that will show it, not a date.

Rules: keep features out of the vision statement; say what we will NOT do in the next 6 months.
Output: the statement, the board as a table, the themes, the roadmap as a three-column table, then "Not now".`,
    output: 'A vision statement, a vision board, 3 strategic themes, and a Now / Next / Later roadmap with outcomes, not dates.',
    next: ['P-B10', 'P-B04'], tags: ['vision', 'strategy', 'roadmap', 'now next later'],
    tr: {
      vi: ['Viết tầm nhìn và chiến lược sản phẩm', 'Viết tầm nhìn một câu, bảng tầm nhìn sản phẩm và lộ trình Now / Next / Later đầu tiên gắn với mục tiêu kinh doanh.', 'Khi bắt đầu sản phẩm mới; khi nhóm không nói được vì sao sản phẩm tồn tại; trước kế hoạch phát hành đầu tiên.'],
      ko: ['제품 비전과 전략 작성하기', '한 줄 비전, 제품 비전 보드, 비즈니스 목표와 연결된 첫 Now / Next / Later 로드맵을 작성합니다.', '새 제품 시작 시; 팀이 제품의 존재 이유를 말하지 못할 때; 첫 릴리스 계획 전.'],
      fr: ['Rédiger la vision et la stratégie produit', 'Rédige une vision en une phrase, un product vision board et une première roadmap Now / Next / Later liée aux objectifs métier.', "Au lancement d'un nouveau produit ; quand l'équipe ne sait pas dire pourquoi le produit existe ; avant le premier plan de release."],
    },
  },
  {
    id: 'P-B03', phase: 'define', step: 2, cat: 'B', sub: 'Project scope definition', roles: ['BA', 'PM'],
    title: 'Define the project scope',
    desc: 'Writes a clear scope statement with in-scope, out-of-scope, deliverables, assumptions and constraints.',
    when: ['After the charter, before detailed requirements', 'When stakeholders keep adding "small" items', 'Before estimating'],
    prepare: 'Objectives, the features or changes discussed so far, known exclusions and constraints',
    ph: [['Objectives', 'What the project must achieve', 'Loan decision in 2 days via mobile'],
      ['Ideas Discussed', 'Everything mentioned so far', 'Mobile form, ID scan, credit scoring change, branch tablet, chatbot'],
      ['Constraints', 'Budget, time, technology, rules', 'US$250k, 6 months, must reuse core banking APIs']],
    body: `Act as a business analyst defining scope with a project manager.

Objectives: [Objectives]
Ideas discussed so far: [Ideas Discussed]
Constraints: [Constraints]

1. Sort every idea into In scope, Out of scope, or To decide, with a one-line reason linked to the objectives.
2. List the deliverables (what will exist at the end), each with a simple acceptance measure.
3. List assumptions and constraints.
4. Write a short scope-change rule: how new requests are raised, assessed and approved.

Output: a table Item | Decision | Reason, then Deliverables, Assumptions, Constraints, Change rule.`,
    output: 'A scope table (in / out / to decide with reasons), deliverables with acceptance measures, assumptions, constraints and a scope-change rule.',
    next: ['P-D01', 'P-B05'], tags: ['scope', 'in scope', 'out of scope', 'scope creep'],
    tr: {
      vi: ['Xác định phạm vi dự án', 'Viết phát biểu phạm vi rõ ràng gồm trong phạm vi, ngoài phạm vi, sản phẩm bàn giao, giả định và ràng buộc.', 'Sau charter, trước khi viết yêu cầu chi tiết; khi các bên liên tục thêm việc "nhỏ"; trước khi ước lượng.'],
      ko: ['프로젝트 범위 정의하기', '범위 내·외, 산출물, 가정, 제약을 담은 명확한 범위 기술서를 작성합니다.', '헌장 이후 상세 요구사항 전; 이해관계자가 계속 "작은" 항목을 추가할 때; 추정 전.'],
      fr: ['Définir le périmètre du projet', 'Rédige un énoncé de périmètre clair : inclus, exclus, livrables, hypothèses et contraintes.', 'Après la charte, avant les exigences détaillées ; quand on ajoute sans cesse de « petits » éléments ; avant d’estimer.'],
    },
  },
  {
    id: 'P-B04', phase: 'build', step: 1, cat: 'B', sub: 'Release and sprint planning', roles: ['PO', 'PM'],
    title: 'Plan releases and sprints',
    desc: 'Turns the roadmap and backlog into a release plan with sprint goals, scope per release and the risks to watch.',
    when: ['After the backlog has rough estimates', 'Before committing a date to stakeholders', 'When a release keeps slipping'],
    prepare: 'Prioritised epics or features with rough sizes, team velocity or capacity, target dates',
    ph: [['Features', 'Prioritised features with sizes', 'Mobile form (21 pts), ID scan (13), SMS updates (8), document upload (13)'],
      ['Velocity', 'Points per sprint and sprint length', '20 points per 2-week sprint'],
      ['Target Date', 'Date or event to hit', 'First release before 15 Jan 2027']],
    body: `Act as a product owner planning releases with the team.

Features (priority order, with size): [Features]
Team velocity: [Velocity]
Target date: [Target Date]

1. Group the features into releases, each a usable increment with a clear release goal.
2. Lay out the sprints: sprint goal and features per sprint, keeping about 15% buffer.
3. Show whether the target date is realistic; if not, offer two options (cut scope or move the date) with what each costs.
4. List the top risks to the plan and an early warning sign for each.

Output: a table Sprint | Goal | Features | Points, a release summary, then Options and Risks.`,
    output: 'A sprint-by-sprint table with goals and points, releases with goals, a realism check with options, and plan risks with early warning signs.',
    next: ['P-B05', 'P-E09'], tags: ['release plan', 'sprint goal', 'velocity'],
    tr: {
      vi: ['Lập kế hoạch phát hành và sprint', 'Biến lộ trình và backlog thành kế hoạch phát hành với mục tiêu sprint, phạm vi từng đợt và rủi ro cần theo dõi.', 'Khi backlog đã có ước lượng sơ bộ; trước khi cam kết ngày với các bên; khi đợt phát hành liên tục trễ.'],
      ko: ['릴리스와 스프린트 계획하기', '로드맵과 백로그를 스프린트 목표, 릴리스별 범위, 주의할 위험을 담은 릴리스 계획으로 바꿉니다.', '백로그에 대략적 추정이 있을 때; 이해관계자에게 일정을 약속하기 전; 릴리스가 계속 지연될 때.'],
      fr: ['Planifier les releases et les sprints', 'Transforme la roadmap et le backlog en plan de release avec objectifs de sprint, périmètre par release et risques à surveiller.', 'Quand le backlog a des estimations grossières ; avant de promettre une date ; quand une release glisse sans cesse.'],
    },
  },
  {
    id: 'P-B05', phase: 'build', step: 2, cat: 'B', sub: 'Work breakdown structure (WBS)', roles: ['PM'],
    title: 'Create a work breakdown structure',
    desc: 'Breaks the project into a deliverable-based WBS down to work packages, with a WBS dictionary for each package.',
    when: ['After scope is agreed', 'Before estimating effort and cost', 'When the team is unsure what "done" includes'],
    prepare: 'Scope statement and deliverables, the delivery approach (agile, waterfall, hybrid)',
    ph: [['Scope', 'Agreed scope and deliverables', 'Mobile loan form, e-KYC integration, back-office review screen, training, go-live'],
      ['Approach', 'Delivery approach', 'Hybrid: agile build, waterfall go-live']],
    body: `Act as a project manager.

Scope and deliverables: [Scope]
Delivery approach: [Approach]

Create a work breakdown structure:
1. Level 1 = major deliverables (include project management, testing, training and deployment, which are often forgotten).
2. Break each down to work packages small enough to estimate and assign (roughly 1–10 days).
3. Number them (1.1, 1.2, 1.2.1 …).
4. Write a short WBS dictionary entry for each work package: description, output, owner role, dependencies.

Rules: describe deliverables as nouns, not activities. Follow the 100% rule: children add up to the whole parent.
Output: the WBS as an indented numbered list, then the dictionary as a table.`,
    output: 'A numbered, indented WBS down to work packages, plus a WBS dictionary table (description, output, owner, dependencies).',
    next: ['P-B08', 'P-B06'], tags: ['WBS', 'work packages', 'PMBOK'],
    tr: {
      vi: ['Tạo cấu trúc phân chia công việc (WBS)', 'Chia dự án thành WBS theo sản phẩm bàn giao đến mức gói công việc, kèm từ điển WBS cho từng gói.', 'Sau khi chốt phạm vi; trước khi ước lượng công sức và chi phí; khi nhóm chưa rõ "xong" gồm những gì.'],
      ko: ['작업 분류 체계(WBS) 만들기', '프로젝트를 산출물 기준 WBS로 작업 패키지까지 나누고 패키지별 WBS 사전을 작성합니다.', '범위 합의 후; 공수와 비용 추정 전; "완료"에 무엇이 포함되는지 불분명할 때.'],
      fr: ['Créer un organigramme des tâches (WBS)', 'Découpe le projet en WBS par livrables jusqu’aux lots de travail, avec un dictionnaire WBS pour chaque lot.', 'Après l’accord sur le périmètre ; avant d’estimer charge et coût ; quand l’équipe ne sait pas ce que « terminé » inclut.'],
    },
  },
  {
    id: 'P-B06', phase: 'build', step: 4, cat: 'B', sub: 'Resource and capacity planning', roles: ['PM', 'PO'],
    title: 'Plan resources and capacity',
    desc: 'Compares the work planned with the people available per sprint or month, and shows gaps, overloads and options.',
    when: ['Planning the next quarter or release', 'When people are spread across projects', 'When the team says they are overloaded'],
    prepare: 'Team members with roles and availability (days off, other projects), planned work with estimates',
    ph: [['Team', 'People, roles, availability', 'Lan BA 100%; Minh dev 50% (other project); Hoa QA 100%, on leave 2–6 Jan'],
      ['Planned Work', 'Work with estimates', 'Release 1: 60 dev days, 15 QA days, 10 BA days in Jan–Feb']],
    body: `Act as a delivery manager doing capacity planning.

Team and availability: [Team]
Planned work: [Planned Work]

1. Calculate available capacity per person and role for each month (or sprint), removing leave, meetings (about 15%) and other projects.
2. Compare it with the demand from the planned work, by role.
3. Highlight overloads and idle time, and the bottleneck role.
4. Suggest options: re-sequence work, move scope, borrow or add people, accept the risk — with the impact of each.

Output: a table Role | Period | Capacity (days) | Demand (days) | Gap, then Bottlenecks and Options.`,
    output: 'A capacity vs demand table by role and period, the bottleneck, and options with their impact.',
    next: ['P-B07', 'P-F11'], tags: ['capacity', 'resources', 'allocation'],
    tr: {
      vi: ['Lập kế hoạch nguồn lực và năng lực', 'So sánh khối lượng công việc với nhân lực sẵn có theo sprint hoặc tháng, chỉ ra thiếu hụt, quá tải và phương án.', 'Khi lập kế hoạch quý hay đợt phát hành; khi nhân sự làm nhiều dự án; khi nhóm báo bị quá tải.'],
      ko: ['자원과 역량 계획하기', '스프린트나 월 단위로 계획된 작업과 가용 인력을 비교해 부족, 과부하, 대안을 보여줍니다.', '다음 분기나 릴리스 계획 시; 인력이 여러 프로젝트에 분산될 때; 팀이 과부하를 호소할 때.'],
      fr: ['Planifier les ressources et la capacité', 'Compare le travail prévu aux personnes disponibles par sprint ou par mois, et montre les écarts, surcharges et options.', 'Pour planifier le trimestre ou la release ; quand les personnes sont partagées entre projets ; quand l’équipe se dit surchargée.'],
    },
  },
  {
    id: 'P-B07', phase: 'build', step: 5, cat: 'B', sub: 'Risk, issue and dependency management', roles: ['PM', 'BA'],
    title: 'Build a RAID log',
    desc: 'Builds a log of risks, assumptions, issues and dependencies with probability, impact, owner and response.',
    when: ['At kickoff and every sprint review', 'Before a steering committee', 'When something keeps surprising the team'],
    prepare: 'Project summary, worries you or the team have, known blockers and external dependencies',
    ph: [['Project Summary', 'What the project delivers', 'Mobile loan application integrated with core banking and e-KYC vendor'],
      ['Concerns', 'Anything that worries the team', 'Vendor API not ready; compliance sign-off slow; one senior dev leaving']],
    body: `Act as a project manager setting up a RAID log.

Project: [Project Summary]
Concerns raised: [Concerns]

1. Turn the concerns into Risks (might happen), Issues (happening now), Assumptions and Dependencies. Add others a similar project usually faces.
2. For each risk: cause → event → impact statement, probability (1–5), impact (1–5), score, owner role, response (avoid, reduce, transfer, accept) and a trigger to watch.
3. For each issue: impact, owner, next action, due date placeholder.
4. For each dependency: who provides what, by when, and what happens if it is late.

Output: four tables (Risks, Assumptions, Issues, Dependencies), risks sorted by score.`,
    output: 'Four RAID tables; risks written as cause–event–impact with scores, owners, responses and triggers.',
    next: ['P-B08', 'P-F08'], tags: ['RAID', 'risk register', 'issues', 'dependencies'],
    tr: {
      vi: ['Xây dựng nhật ký RAID', 'Lập nhật ký rủi ro, giả định, vấn đề và phụ thuộc kèm xác suất, tác động, người phụ trách và cách xử lý.', 'Khi kickoff và mỗi buổi review sprint; trước họp ban chỉ đạo; khi nhóm liên tục gặp bất ngờ.'],
      ko: ['RAID 로그 만들기', '위험, 가정, 이슈, 의존성을 확률, 영향, 담당자, 대응과 함께 기록합니다.', '킥오프와 매 스프린트 리뷰 때; 운영위원회 전; 팀이 계속 예상치 못한 일을 겪을 때.'],
      fr: ['Construire un journal RAID', 'Constitue un journal des risques, hypothèses, problèmes et dépendances avec probabilité, impact, responsable et réponse.', 'Au lancement et à chaque revue de sprint ; avant un comité de pilotage ; quand l’équipe est sans cesse surprise.'],
    },
  },
  {
    id: 'P-B08', phase: 'build', step: 3, cat: 'B', sub: 'Timeline and milestone planning', roles: ['PM'],
    title: 'Plan the timeline and milestones',
    desc: 'Sequences the work into a timeline with milestones, dependencies and the critical path.',
    when: ['After the WBS', 'When a sponsor asks "when will it be ready?"', 'Re-planning after a delay'],
    prepare: 'Work packages or features with durations, dependencies, fixed dates (events, regulations)',
    ph: [['Work Items', 'Items with durations', 'Design 3 wks; Build 8 wks; Vendor integration 4 wks; UAT 2 wks; Training 1 wk'],
      ['Dependencies', 'What waits for what', 'Build after design; UAT after build and vendor; training before go-live'],
      ['Fixed Dates', 'Dates that cannot move', 'Start 2 Dec 2026; go-live before Tet (10 Feb 2027)']],
    body: `Act as a project planner.

Work items and durations: [Work Items]
Dependencies: [Dependencies]
Fixed dates: [Fixed Dates]

1. Sequence the items and calculate start and end dates, working weeks only.
2. Identify the critical path and the float on other items.
3. Propose 5–7 milestones with a clear completion criterion each (e.g. "UAT signed off by Lending").
4. Say whether the fixed dates are met; if not, show the gap and 2–3 ways to close it (fast-tracking, crashing, scope).

Output: a table Item | Start | End | Depends on | Critical?, then Milestones, then Feasibility.`,
    output: 'A dated schedule table with the critical path marked, milestones with completion criteria, and a feasibility check with options.',
    next: ['P-B06', 'P-B07'], tags: ['timeline', 'milestones', 'critical path', 'Gantt'],
    tr: {
      vi: ['Lập tiến độ và các mốc chính', 'Sắp xếp công việc thành tiến độ với các mốc, phụ thuộc và đường găng.', 'Sau WBS; khi nhà tài trợ hỏi "khi nào xong?"; khi lập lại kế hoạch sau trễ hạn.'],
      ko: ['일정과 마일스톤 계획하기', '작업을 마일스톤, 의존성, 주공정이 담긴 일정으로 배열합니다.', 'WBS 이후; 스폰서가 "언제 준비되나?"라고 물을 때; 지연 후 재계획 시.'],
      fr: ['Planifier le calendrier et les jalons', 'Ordonne le travail dans un calendrier avec jalons, dépendances et chemin critique.', 'Après le WBS ; quand le sponsor demande « quand sera-ce prêt ? » ; pour replanifier après un retard.'],
    },
  },
  {
    id: 'P-B09', phase: 'define', step: 15, cat: 'B', sub: 'Budget estimation and planning', roles: ['PM'],
    title: 'Estimate the budget',
    desc: 'Builds a bottom-up budget from roles, effort and other costs, with contingency and a range instead of one number.',
    when: ['Before the business case is approved', 'When scope changes significantly', 'Preparing a vendor proposal comparison'],
    prepare: 'Effort estimates by role, day rates, licences, infrastructure, vendor quotes',
    ph: [['Effort', 'Days per role', 'BA 60, Dev 240, QA 80, PM 50, Designer 30'],
      ['Rates', 'Cost per day per role', 'BA $250, Dev $300, QA $200, PM $300, Designer $250'],
      ['Other Costs', 'Licences, cloud, vendors, training', 'e-KYC vendor $1,500/month; cloud $800/month; training $3,000']],
    body: `Act as a project manager preparing a budget estimate.

Effort by role: [Effort]
Rates: [Rates]
Other costs: [Other Costs]

1. Calculate labour cost by role and the total.
2. Add one-off and recurring non-labour costs (show 12 months of recurring costs separately).
3. Add contingency based on uncertainty (explain the percentage) and a management reserve line.
4. Give a range: optimistic, most likely, pessimistic, and the main drivers of the range.

Output: a cost table, a summary (one-off vs recurring), contingency explanation, and the range. Show all formulas.`,
    output: 'A budget table with labour and non-labour costs, contingency with reasons, and an optimistic / likely / pessimistic range with formulas.',
    next: ['P-A07', 'P-B06'], tags: ['budget', 'estimate', 'contingency', 'cost'],
    tr: {
      vi: ['Ước tính ngân sách', 'Lập ngân sách từ dưới lên theo vai trò, công sức và chi phí khác, kèm dự phòng và một khoảng giá thay vì một con số.', 'Trước khi duyệt business case; khi phạm vi thay đổi nhiều; khi so sánh đề xuất của nhà cung cấp.'],
      ko: ['예산 추정하기', '역할, 공수, 기타 비용으로 상향식 예산을 만들고 예비비와 단일 수치가 아닌 범위를 제시합니다.', '비즈니스 케이스 승인 전; 범위가 크게 바뀔 때; 공급업체 제안 비교 시.'],
      fr: ['Estimer le budget', 'Construit un budget ascendant à partir des rôles, de la charge et des autres coûts, avec une provision et une fourchette plutôt qu’un chiffre.', 'Avant l’approbation du business case ; quand le périmètre change fortement ; pour comparer des offres fournisseurs.'],
    },
  },
  {
    id: 'P-B10', phase: 'discover', step: 10, cat: 'B', sub: 'OKR and KPI development', roles: ['PO', 'PM'],
    title: 'Draft OKRs for the initiative',
    desc: 'Turns the business objectives into 1–3 quarterly OKRs with measurable key results and the initiatives that will move them.',
    when: ['Start of a quarter', 'After the vision and roadmap are agreed', "When the team's work is not clearly linked to outcomes"],
    prepare: 'Business objectives and KPIs, the roadmap\'s "Now" items, the quarter and team',
    ph: [['Business Objectives', 'Agreed objectives', 'Cut loan decision time to 2 days by Q3 2027'],
      ['Now Items', 'Work planned now', 'Mobile application form, instant ID check'],
      ['Quarter', 'Which quarter', 'Q1 2027']],
    body: `Act as an OKR coach working with a product team.

Business objectives: [Business Objectives]
Work planned now: [Now Items]
Quarter: [Quarter]

1. Write 1–3 objectives for the quarter: qualitative, inspiring, and tied to the business objectives.
2. For each, write 2–4 key results that are measurable outcomes (baseline → target), not tasks. Give an owner role for each.
3. Link each key result to the initiatives from the planned work that should move it. Flag any planned work that moves no key result.
4. Review your own draft: mark any key result that is really a task ("launch X", "build Y") and rewrite it as an outcome.

Output: for each objective, a table Key result | Baseline | Target | Owner | Initiatives, then "Work that moves no key result" and "Rewritten key results".`,
    output: '1–3 objectives, each with 2–4 key results (baseline → target, owner), linked initiatives, and a check that no key result is a task in disguise.',
    next: ['P-B01', 'P-D01'], tags: ['OKR', 'key results', 'outcomes'],
    tr: {
      vi: ['Xây dựng OKR cho sáng kiến', 'Chuyển mục tiêu kinh doanh thành 1–3 OKR theo quý với kết quả then chốt đo được và các sáng kiến tương ứng.', 'Đầu quý; sau khi thống nhất tầm nhìn và lộ trình; khi công việc của nhóm chưa gắn rõ với kết quả.'],
      ko: ['과제의 OKR 초안 작성하기', '비즈니스 목표를 측정 가능한 핵심 결과와 이를 움직일 이니셔티브를 담은 분기별 OKR 1~3개로 바꿉니다.', '분기 시작; 비전과 로드맵 합의 후; 팀의 일이 성과와 명확히 연결되지 않을 때.'],
      fr: ['Rédiger les OKR de l’initiative', 'Transforme les objectifs métier en 1 à 3 OKR trimestriels avec des résultats clés mesurables et les initiatives qui les feront bouger.', 'En début de trimestre ; après l’accord sur la vision et la roadmap ; quand le travail de l’équipe n’est pas clairement lié aux résultats.'],
    },
  },
];
