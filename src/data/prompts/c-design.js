// C. Application and Solution Design
export default [
  {
    id: 'P-C01', phase: 'design', step: 1, cat: 'C', sub: 'Designing a new application from business intent', roles: ['BA', 'PO'],
    title: 'Design a new application from business intent',
    desc: 'Turns a business intent into a first solution outline: users, core journeys, modules, data, integrations and an MVP cut.',
    when: ['A new system is approved but nobody has shaped it yet', 'Before talking to designers or vendors', 'To compare build options on the same baseline'],
    prepare: 'Business intent and objectives, target users, the main things they must be able to do, constraints',
    ph: [['Business Intent', 'The outcome the business wants', 'Let small shops reorder stock from wholesalers in under 2 minutes'],
      ['Users', 'Who uses it', 'Shop owners, wholesaler sales staff, wholesaler admins'],
      ['Constraints', 'Budget, platform, rules', 'Mobile first; Vietnamese and English; 4-month MVP']],
    body: `Act as a solution-minded business analyst and product owner.

Business intent: [Business Intent]
Users: [Users]
Constraints: [Constraints]

Design a first solution outline:
1. Restate the intent as a measurable outcome.
2. User roles and their top 3 goals each.
3. Core user journeys (5–8), each as one line: trigger → steps → result.
4. Functional modules and what each does.
5. Main data entities and their key attributes.
6. External systems to integrate with.
7. An MVP cut: which journeys and modules are in the first release and why.
8. Open questions and risky assumptions.

Rules: stay technology-neutral; don't design screens yet.
Output: numbered sections with short tables where helpful.`,
    output: 'A solution outline in 8 sections: outcome, roles and goals, core journeys, modules, data entities, integrations, MVP cut, open questions.',
    next: ['P-C04', 'P-C06'], tags: ['solution design', 'MVP', 'new application'],
    tr: {
      vi: ['Thiết kế ứng dụng mới từ mục tiêu kinh doanh', 'Biến mục tiêu kinh doanh thành phác thảo giải pháp đầu tiên: người dùng, hành trình chính, phân hệ, dữ liệu, tích hợp và phạm vi MVP.', 'Khi hệ thống mới được duyệt nhưng chưa ai định hình; trước khi làm việc với designer hay nhà cung cấp; để so sánh phương án trên cùng một nền.'],
      ko: ['비즈니스 의도로 새 애플리케이션 설계하기', '비즈니스 의도를 사용자, 핵심 여정, 모듈, 데이터, 연동, MVP 범위를 담은 첫 솔루션 개요로 바꿉니다.', '새 시스템이 승인됐지만 아직 구체화되지 않았을 때; 디자이너나 공급업체와 이야기하기 전; 같은 기준으로 대안을 비교할 때.'],
      fr: ['Concevoir une nouvelle application à partir de l’intention métier', 'Transforme une intention métier en première esquisse de solution : utilisateurs, parcours clés, modules, données, intégrations et périmètre MVP.', 'Quand un nouveau système est approuvé mais pas encore façonné ; avant de parler aux designers ou fournisseurs ; pour comparer des options sur une même base.'],
    },
  },
  {
    id: 'P-C02', phase: 'design', step: 2, cat: 'C', sub: 'Designing new features for an existing application', roles: ['BA', 'PO'],
    title: 'Design a new feature for an existing application',
    desc: 'Shapes a new feature inside an existing product: the user problem, where it fits, the flow, rules, impact on what exists and an MVP.',
    when: ['A feature request arrives for a live product', 'Before writing user stories', 'When a feature touches several existing screens'],
    prepare: 'Short description of the product today, the feature request and who asked, related screens or data',
    ph: [['Product Today', 'What the app does now', 'Loan app: apply, upload documents, track status'],
      ['Feature Request', 'The request', 'Let customers save an application and finish it later'],
      ['Related Areas', 'Screens or data it touches', 'Application form, document upload, notifications']],
    body: `Act as a senior business analyst working on a live product.

Product today: [Product Today]
Feature request: [Feature Request]
Related areas: [Related Areas]

1. State the user problem and the outcome this feature should achieve.
2. Describe where it fits in the current journey (before / after which step).
3. Write the main flow and 2–3 alternative flows.
4. List business rules and validations.
5. Impact on existing screens, data, notifications, reports and permissions.
6. Suggest an MVP version and what can wait.
7. List questions for stakeholders.

Output: headed sections; the impact as a table Area | Change | Risk.`,
    output: 'A feature brief: problem and outcome, placement in the journey, main and alternative flows, rules, an impact table, an MVP cut and open questions.',
    next: ['P-C07', 'P-E01'], tags: ['feature design', 'impact', 'existing product'],
    tr: {
      vi: ['Thiết kế tính năng mới cho ứng dụng hiện có', 'Định hình tính năng mới trong sản phẩm đang chạy: vấn đề người dùng, vị trí, luồng, quy tắc, tác động đến phần hiện có và MVP.', 'Khi có yêu cầu tính năng cho sản phẩm đang vận hành; trước khi viết user story; khi tính năng chạm vào nhiều màn hình.'],
      ko: ['기존 애플리케이션의 새 기능 설계하기', '운영 중인 제품의 새 기능을 사용자 문제, 위치, 흐름, 규칙, 기존 기능 영향, MVP로 구체화합니다.', '운영 제품에 기능 요청이 들어올 때; 사용자 스토리 작성 전; 기능이 여러 화면에 걸칠 때.'],
      fr: ['Concevoir une nouvelle fonctionnalité pour une application existante', 'Façonne une fonctionnalité dans un produit en service : problème utilisateur, place dans le parcours, flux, règles, impact sur l’existant et MVP.', 'Quand une demande arrive pour un produit en production ; avant d’écrire les user stories ; quand la fonctionnalité touche plusieurs écrans.'],
    },
  },
  {
    id: 'P-C03', phase: 'design', step: 3, cat: 'C', sub: 'Analyzing existing application functionality', roles: ['BA'],
    title: 'Analyse an existing application for improvements',
    desc: 'Reviews how an existing application works today, finds pain points and gaps, and ranks improvement opportunities.',
    when: ['Taking over a product you did not build', 'Users complain but nobody knows where to start', 'Before a redesign or replacement'],
    prepare: 'Feature list or screen list, known complaints, usage numbers if any, business goals',
    ph: [['Application', 'What it is and who uses it', 'Back-office loan review system used by 40 credit analysts'],
      ['Functions', 'Main functions or screens', 'Queue, application detail, document viewer, approve / reject, reports'],
      ['Complaints', 'Known pain points or data', 'Analysts re-type data; slow document viewer; 30% of time on rework']],
    body: `Act as a business analyst reviewing an existing system.

Application: [Application]
Main functions: [Functions]
Known complaints and data: [Complaints]

1. Summarise how the application supports the work today (a short as-is description per function).
2. List pain points, workarounds and gaps, each linked to evidence or marked "to verify".
3. Group them into themes (usability, data quality, performance, missing capability, process).
4. Propose improvement opportunities and score each on value and effort (high / medium / low).
5. Recommend the top 3 to tackle first and what to measure.

Output: a table Function | Today | Pain points, then Themes, then a table Opportunity | Value | Effort | Recommendation.`,
    output: 'An as-is summary per function, pain points with evidence, themes, scored improvement opportunities and a top-3 recommendation.',
    next: ['P-D05', 'P-C02'], tags: ['as-is', 'improvement', 'heuristic review'],
    tr: {
      vi: ['Phân tích ứng dụng hiện có để cải tiến', 'Rà soát cách ứng dụng hiện tại vận hành, tìm điểm đau và khoảng trống, xếp hạng cơ hội cải tiến.', 'Khi tiếp quản sản phẩm không do mình xây; khi người dùng phàn nàn mà không biết bắt đầu từ đâu; trước khi thiết kế lại hay thay thế.'],
      ko: ['기존 애플리케이션 개선점 분석하기', '현재 애플리케이션의 동작을 검토해 불편과 공백을 찾고 개선 기회의 우선순위를 정합니다.', '직접 만들지 않은 제품을 인수할 때; 불만은 많은데 어디서 시작할지 모를 때; 재설계나 교체 전.'],
      fr: ['Analyser une application existante pour l’améliorer', 'Examine le fonctionnement actuel d’une application, repère irritants et manques, et classe les pistes d’amélioration.', 'Quand vous reprenez un produit que vous n’avez pas construit ; quand les utilisateurs se plaignent sans savoir par où commencer ; avant une refonte.'],
    },
  },
  {
    id: 'P-C04', phase: 'design', step: 4, cat: 'C', sub: 'User journeys and workflows', roles: ['BA', 'PO'],
    title: 'Map the user journey',
    desc: 'Maps a user journey stage by stage: actions, touchpoints, thoughts, emotions, pain points and opportunities.',
    when: ['Designing a new journey or redesigning one', 'To build empathy with stakeholders', 'Before writing stories, to see the whole flow'],
    prepare: 'The persona or user type, the goal of the journey, where it starts and ends, research notes',
    ph: [['Persona', 'Who the user is', 'Lan, 32, office worker applying for a personal loan on her phone'],
      ['Journey Goal', 'What she wants to achieve', 'Get a loan decision without visiting a branch'],
      ['Research Notes', 'What you know (optional)', 'Users drop off at income proof; many apply at night']],
    body: `Act as a UX-minded business analyst.

Persona: [Persona]
Journey goal: [Journey Goal]
What we know: [Research Notes]

Map the journey from the first trigger to the goal (or abandonment):
1. 5–8 stages.
2. For each stage: user actions, touchpoints or channels, what the user thinks, emotion (positive / neutral / negative), pain points, and opportunities for us.
3. Mark the moments that matter most (where users drop off or decide).
4. Suggest 3–5 improvements and the metric that would show each works.

Rules: describe what the user does, not the system; mark guesses as "assumption".
Output: a table with stages as rows and the attributes as columns, then Moments that matter and Improvements.`,
    output: 'A journey map table (stages × actions, touchpoints, thoughts, emotion, pain points, opportunities), key moments, and improvements with metrics.',
    next: ['P-C05', 'P-E01'], tags: ['user journey', 'customer journey map', 'persona', 'UX'],
    tr: {
      vi: ['Lập bản đồ hành trình người dùng', 'Vẽ hành trình người dùng theo từng giai đoạn: hành động, điểm chạm, suy nghĩ, cảm xúc, điểm đau và cơ hội.', 'Khi thiết kế hoặc thiết kế lại một hành trình; để các bên thấu hiểu người dùng; trước khi viết story để thấy toàn luồng.'],
      ko: ['사용자 여정 맵 만들기', '단계별로 행동, 접점, 생각, 감정, 불편, 기회를 담은 사용자 여정을 그립니다.', '새 여정 설계나 재설계 시; 이해관계자 공감을 위해; 스토리 작성 전 전체 흐름을 보기 위해.'],
      fr: ['Cartographier le parcours utilisateur', 'Cartographie un parcours étape par étape : actions, points de contact, pensées, émotions, irritants et opportunités.', 'Pour concevoir ou refondre un parcours ; pour créer de l’empathie chez les parties prenantes ; avant les user stories, pour voir le flux complet.'],
    },
  },
  {
    id: 'P-C05', phase: 'design', step: 5, cat: 'C', sub: 'Functional flow diagrams', roles: ['BA'],
    title: 'Create a functional flow diagram',
    desc: 'Describes a process as a flow with actors, steps, decisions and exceptions, and outputs Mermaid code you can paste into a diagram tool.',
    when: ['Explaining a process to developers or testers', 'When a written description is too long to follow', 'Checking a flow for missing branches'],
    prepare: 'The process name, actors, start and end, main steps and decisions you know',
    ph: [['Process', 'Name, start and end', 'Loan application review: starts when an application is submitted, ends with approve / reject'],
      ['Actors', 'Who or what takes part', 'Applicant, system, credit analyst, risk manager'],
      ['Known Steps', 'Steps and decisions you know', 'Auto-check documents; analyst review; above 500m VND needs risk approval']],
    body: `Act as a business analyst who models processes clearly.

Process: [Process]
Actors: [Actors]
Known steps and decisions: [Known Steps]

1. List the steps in order with the actor responsible.
2. Add every decision with all its outcomes (yes / no or more), plus exception paths (timeouts, missing data, errors).
3. Produce the flow as Mermaid flowchart code using swimlane-style subgraphs per actor.
4. List any gaps or questions the flow reveals.

Rules: one action per box, verb first; every decision has a labelled exit for each outcome; no dead ends.
Output: the step table, the Mermaid code block, then Gaps and questions.`,
    output: 'A step table, a Mermaid flowchart with swimlanes per actor (decisions and exceptions included), and the gaps the flow reveals.',
    next: ['P-C07', 'P-C11'], tags: ['flowchart', 'Mermaid', 'BPMN', 'swimlane'],
    tr: {
      vi: ['Vẽ sơ đồ luồng chức năng', 'Mô tả quy trình thành luồng với tác nhân, bước, điểm quyết định và ngoại lệ, kèm mã Mermaid để dán vào công cụ vẽ sơ đồ.', 'Khi giải thích quy trình cho dev hay tester; khi mô tả bằng chữ quá dài; khi kiểm tra luồng có thiếu nhánh không.'],
      ko: ['기능 흐름도 만들기', '프로세스를 행위자, 단계, 분기, 예외가 있는 흐름으로 설명하고 다이어그램 도구에 붙일 Mermaid 코드를 만듭니다.', '개발자나 테스터에게 프로세스를 설명할 때; 글로 된 설명이 너무 길 때; 누락된 분기를 점검할 때.'],
      fr: ['Créer un diagramme de flux fonctionnel', 'Décrit un processus sous forme de flux avec acteurs, étapes, décisions et exceptions, et produit le code Mermaid à coller dans un outil de diagramme.', 'Pour expliquer un processus aux développeurs ou testeurs ; quand une description écrite est trop longue ; pour repérer les branches manquantes.'],
    },
  },
  {
    id: 'P-C06', phase: 'design', step: 6, cat: 'C', sub: 'Information architecture and navigation', roles: ['BA', 'PO'],
    title: 'Design the information architecture and navigation',
    desc: 'Proposes a sitemap, navigation and content grouping based on user tasks, with labels users will understand.',
    when: ['Before wireframes for a new app or site', 'When users cannot find things', 'Adding a large new section'],
    prepare: 'User roles and their top tasks, the content or features to organise, platform (web, mobile)',
    ph: [['Users And Tasks', 'Roles and their top tasks', 'Shop owner: reorder, track delivery, pay; Admin: manage catalogue, see reports'],
      ['Content', 'Features and content to organise', 'Catalogue, cart, orders, invoices, promotions, profile, help'],
      ['Platform', 'Web, mobile or both', 'Mobile app first, web admin']],
    body: `Act as an information architect working with a business analyst.

Users and top tasks: [Users And Tasks]
Content and features: [Content]
Platform: [Platform]

1. Group the content by user tasks (not by internal departments).
2. Propose a sitemap 2–3 levels deep, separately per role if their apps differ.
3. Propose the main navigation (for mobile: bottom navigation with at most 5 items) and secondary navigation.
4. Suggest plain labels and note any label that might confuse users.
5. Check the top 5 tasks: how many taps or clicks from the home screen?

Output: the sitemap as an indented list, a navigation table, a label table, and a task-path check.`,
    output: 'A task-based sitemap, main and secondary navigation, label suggestions, and a check of clicks needed for the top tasks.',
    next: ['P-C10', 'P-C09'], tags: ['information architecture', 'sitemap', 'navigation'],
    tr: {
      vi: ['Thiết kế kiến trúc thông tin và điều hướng', 'Đề xuất sơ đồ trang, điều hướng và cách nhóm nội dung theo tác vụ người dùng, với nhãn dễ hiểu.', 'Trước khi vẽ wireframe cho ứng dụng mới; khi người dùng không tìm thấy thứ cần; khi thêm một phần lớn mới.'],
      ko: ['정보 구조와 내비게이션 설계하기', '사용자 과업에 맞춰 사이트맵, 내비게이션, 콘텐츠 묶음과 이해하기 쉬운 레이블을 제안합니다.', '새 앱이나 사이트 와이어프레임 전; 사용자가 원하는 것을 못 찾을 때; 큰 섹션을 추가할 때.'],
      fr: ['Concevoir l’architecture de l’information et la navigation', 'Propose une arborescence, une navigation et un regroupement du contenu fondés sur les tâches, avec des libellés compréhensibles.', 'Avant les wireframes d’une nouvelle app ; quand les utilisateurs ne trouvent rien ; pour ajouter une grande section.'],
    },
  },
  {
    id: 'P-C07', phase: 'design', step: 7, cat: 'C', sub: 'Business rules and validation logic', roles: ['BA'],
    title: 'Define business rules and validation logic',
    desc: 'Writes clear, numbered business rules and field validations, separating policy rules from screen checks.',
    when: ['Requirements mention "it depends" or many conditions', 'Before developers ask "what happens if…"', 'When rules live only in people\'s heads'],
    prepare: 'Policies, regulations, current practice, examples of valid and invalid cases',
    ph: [['Process Or Feature', 'Where the rules apply', 'Personal loan application'],
      ['Known Rules', 'Policies and conditions you know', 'Age 20–60; income at least 8m VND; loans above 500m need risk approval; ID must be valid'],
      ['Fields', 'Fields to validate (optional)', 'Full name, date of birth, ID number, income, loan amount, term']],
    body: `Act as a business analyst specialising in business rules.

Process or feature: [Process Or Feature]
Known rules: [Known Rules]
Fields: [Fields]

1. Rewrite each rule as one atomic, testable statement with an ID (BR-01…), in the form "IF condition THEN outcome".
2. Classify each: constraint, calculation, inference, or authorisation. Note the source (policy, regulation, assumption).
3. Build a decision table for any rule with several combined conditions.
4. List field validations separately: field, rule, error message in plain language.
5. Flag conflicts, gaps and rules that need an owner's confirmation.

Output: a rules table (ID, rule, type, source), decision tables, a validation table, then Conflicts and questions.`,
    output: 'Numbered atomic business rules with type and source, decision tables, a field validation table with error messages, and conflicts to resolve.',
    next: ['P-C11', 'P-E05'], tags: ['business rules', 'validation', 'decision table'],
    tr: {
      vi: ['Xác định quy tắc nghiệp vụ và logic kiểm tra', 'Viết các quy tắc nghiệp vụ và kiểm tra dữ liệu rõ ràng, đánh số, tách quy tắc chính sách khỏi kiểm tra trên màn hình.', 'Khi yêu cầu có nhiều điều kiện "tùy trường hợp"; trước khi dev hỏi "nếu… thì sao"; khi quy tắc chỉ nằm trong đầu người dùng.'],
      ko: ['비즈니스 규칙과 검증 로직 정의하기', '정책 규칙과 화면 검증을 구분해 명확하고 번호가 매겨진 비즈니스 규칙과 필드 검증을 작성합니다.', '요구사항에 "경우에 따라"가 많을 때; 개발자가 "만약…"을 묻기 전; 규칙이 사람 머릿속에만 있을 때.'],
      fr: ['Définir les règles métier et la logique de validation', 'Rédige des règles métier et des validations de champs claires et numérotées, en séparant règles de gestion et contrôles d’écran.', 'Quand les exigences disent souvent « ça dépend » ; avant que les développeurs demandent « que se passe-t-il si… » ; quand les règles ne sont que dans les têtes.'],
    },
  },
  {
    id: 'P-C08', phase: 'design', step: 8, cat: 'C', sub: 'System integrations and dependencies', roles: ['BA', 'PM'],
    title: 'Identify system integrations and dependencies',
    desc: 'Lists every system the solution must talk to, what data flows each way, how and when, and the risks of each integration.',
    when: ['Early in solution design', 'Before estimating', 'When a vendor or another team owns part of the flow'],
    prepare: 'The solution outline, systems you know exist, owners of those systems',
    ph: [['Solution', 'What you are building', 'Mobile loan application'],
      ['Known Systems', 'Systems involved', 'Core banking, e-KYC vendor, credit bureau, SMS gateway, document storage']],
    body: `Act as a business analyst working with a solution architect.

Solution: [Solution]
Known systems: [Known Systems]

1. List each integration: source, target, data exchanged, direction, trigger (real-time, batch, event), frequency and volume estimate.
2. Note the owner of each external system and whether an interface already exists.
3. For each, list failure scenarios (down, slow, wrong data) and the expected behaviour.
4. Identify dependencies on other teams or vendors and the date we need them by.
5. Flag security or privacy concerns (personal data, credentials, data residency).

Output: an integration table, a failure-handling table, then Dependencies and Security notes. Add a simple context diagram as Mermaid code.`,
    output: 'An integration inventory (data, direction, trigger, volume, owner), failure handling, dependencies with dates, security notes and a Mermaid context diagram.',
    next: ['P-B07', 'P-C09'], tags: ['integration', 'API', 'dependencies', 'context diagram'],
    tr: {
      vi: ['Xác định tích hợp hệ thống và phụ thuộc', 'Liệt kê mọi hệ thống giải pháp phải kết nối, dữ liệu trao đổi hai chiều, cách thức, thời điểm và rủi ro của từng tích hợp.', 'Sớm trong thiết kế giải pháp; trước khi ước lượng; khi nhà cung cấp hay nhóm khác sở hữu một phần luồng.'],
      ko: ['시스템 연동과 의존성 파악하기', '솔루션이 연결해야 할 모든 시스템과 양방향 데이터, 방식, 시점, 연동별 위험을 정리합니다.', '솔루션 설계 초기; 추정 전; 공급업체나 다른 팀이 흐름 일부를 맡을 때.'],
      fr: ['Identifier les intégrations et dépendances système', 'Liste chaque système avec lequel la solution doit communiquer, les données échangées, comment et quand, et les risques de chaque intégration.', 'Tôt dans la conception ; avant d’estimer ; quand un fournisseur ou une autre équipe possède une partie du flux.'],
    },
  },
  {
    id: 'P-C09', phase: 'design', step: 9, cat: 'C', sub: 'Roles, permissions and access control', roles: ['BA'],
    title: 'Define roles, permissions and access control',
    desc: 'Builds a role–permission matrix with data visibility rules and segregation of duties.',
    when: ['Any system with more than one type of user', 'Before security review or audit', 'When "who can approve what" is unclear'],
    prepare: 'User types, the main actions in the system, sensitive data, approval rules',
    ph: [['Roles', 'User types', 'Applicant, branch officer, credit analyst, risk manager, admin, auditor'],
      ['Actions', 'Main actions or screens', 'Create application, view documents, approve, override score, export report, manage users'],
      ['Sensitive Data', 'Data needing protection', 'ID numbers, income, credit score']],
    body: `Act as a business analyst defining access control.

Roles: [Roles]
Actions: [Actions]
Sensitive data: [Sensitive Data]

1. Build a matrix: actions as rows, roles as columns, values Allow / Deny / Own records only / With approval.
2. Define data visibility rules (e.g. branch officers see only their branch).
3. Apply least privilege and flag segregation-of-duties conflicts (e.g. the same person creates and approves).
4. Describe how roles are granted and removed, and what is logged for audit.
5. List questions for security and compliance.

Output: the matrix table, Visibility rules, SoD conflicts, Role lifecycle, Audit logging, Questions.`,
    output: 'A role–permission matrix, data visibility rules, segregation-of-duties conflicts, role lifecycle and audit logging requirements.',
    next: ['P-C10', 'P-D02'], tags: ['roles', 'permissions', 'RBAC', 'security'],
    tr: {
      vi: ['Xác định vai trò, quyền hạn và kiểm soát truy cập', 'Xây dựng ma trận vai trò – quyền với quy tắc hiển thị dữ liệu và phân tách nhiệm vụ.', 'Mọi hệ thống có nhiều loại người dùng; trước đánh giá bảo mật hay kiểm toán; khi chưa rõ "ai được duyệt gì".'],
      ko: ['역할, 권한, 접근 제어 정의하기', '데이터 가시성 규칙과 직무 분리를 포함한 역할–권한 매트릭스를 만듭니다.', '사용자 유형이 둘 이상인 모든 시스템; 보안 검토나 감사 전; "누가 무엇을 승인하는지" 불분명할 때.'],
      fr: ['Définir rôles, permissions et contrôle d’accès', 'Construit une matrice rôles–permissions avec règles de visibilité des données et séparation des tâches.', 'Tout système avec plusieurs types d’utilisateurs ; avant une revue sécurité ou un audit ; quand « qui approuve quoi » n’est pas clair.'],
    },
  },
  {
    id: 'P-C10', phase: 'design', step: 10, cat: 'C', sub: 'UI/UX design requirements', roles: ['BA', 'PO'],
    title: 'Write UI/UX design requirements',
    desc: 'Writes a design brief per screen: purpose, users, content, actions, states, accessibility and success measures.',
    when: ['Handing work to a designer', 'Before wireframes', 'When designs come back missing states or edge cases'],
    prepare: 'Screens needed, user tasks per screen, brand or design system, accessibility needs',
    ph: [['Screens', 'Screens to design', 'Application form, document upload, application status'],
      ['Users And Context', 'Who uses them and where', 'Customers on mobile, often at night, some with poor connections'],
      ['Design System', 'Brand or design system (optional)', 'Bank design system v2, Be Vietnam Pro font']],
    body: `Act as a business analyst writing a brief for a UX/UI designer.

Screens: [Screens]
Users and context: [Users And Context]
Design system: [Design System]

For each screen write:
1. Purpose and the one main action.
2. Content and data shown, in priority order.
3. Actions and where they lead.
4. States to design: empty, loading, error, success, partial data, no permission.
5. Validation messages and help text needed.
6. Accessibility: WCAG 2.2 AA, keyboard use, screen reader labels, touch target size.
7. How we will know the design works (task success, time on task).

Output: one section per screen, plus a shared list of components and patterns to reuse.`,
    output: 'A per-screen design brief (purpose, content priority, actions, all states, messages, accessibility, success measures) and shared components.',
    next: ['P-C11', 'P-E01'], tags: ['UX', 'UI', 'design brief', 'accessibility'],
    tr: {
      vi: ['Viết yêu cầu thiết kế UI/UX', 'Viết brief thiết kế cho từng màn hình: mục đích, người dùng, nội dung, hành động, trạng thái, khả năng tiếp cận và thước đo thành công.', 'Khi giao việc cho designer; trước khi vẽ wireframe; khi bản thiết kế thiếu trạng thái hay trường hợp biên.'],
      ko: ['UI/UX 설계 요구사항 작성하기', '화면별로 목적, 사용자, 콘텐츠, 동작, 상태, 접근성, 성공 지표를 담은 디자인 브리프를 작성합니다.', '디자이너에게 작업을 넘길 때; 와이어프레임 전; 디자인에 상태나 예외가 빠져 있을 때.'],
      fr: ['Rédiger les exigences de design UI/UX', 'Rédige un brief par écran : objectif, utilisateurs, contenu, actions, états, accessibilité et mesures de succès.', 'Pour confier le travail à un designer ; avant les wireframes ; quand les maquettes oublient des états ou des cas limites.'],
    },
  },
  {
    id: 'P-C11', phase: 'design', step: 11, cat: 'C', sub: 'Edge cases and exception scenarios', roles: ['BA', 'PO'],
    title: 'Find edge cases and exception scenarios',
    desc: 'Systematically lists edge cases and exceptions for a flow — data, timing, permissions, integrations — with the expected behaviour.',
    when: ['After the happy path is agreed', 'Before acceptance criteria and test design', 'After an incident, to find similar gaps'],
    prepare: 'The flow or feature, its business rules, the systems involved',
    ph: [['Feature', 'Flow or feature', 'Customer uploads income documents during the loan application'],
      ['Rules', 'Rules that apply', 'PDF or JPG, max 10 MB each, up to 5 files; must be from the last 3 months']],
    body: `Act as a business analyst and tester looking for what can go wrong.

Feature: [Feature]
Rules: [Rules]

List edge cases and exceptions under these headings:
1. Data: empty, too long, wrong format, duplicates, special characters, boundary values.
2. User behaviour: back button, double submit, abandoning halfway, two devices at once.
3. Timing: session timeout, cut-off times, time zones, slow network, offline.
4. Permissions: wrong role, expired access, account locked.
5. Integrations: a dependency is down, slow or returns wrong data.
6. Business exceptions: policy changes mid-process, cancellations, reversals.

For each case give the expected system behaviour and the user message, and a priority (high / medium / low).
Output: a table Case | Category | Expected behaviour | User message | Priority.`,
    output: 'An edge-case table across data, user behaviour, timing, permissions, integrations and business exceptions, with expected behaviour, messages and priority.',
    next: ['P-E05', 'P-G03'], tags: ['edge cases', 'exceptions', 'negative scenarios'],
    tr: {
      vi: ['Tìm trường hợp biên và tình huống ngoại lệ', 'Liệt kê có hệ thống các trường hợp biên và ngoại lệ của một luồng — dữ liệu, thời gian, quyền, tích hợp — kèm hành vi mong đợi.', 'Sau khi thống nhất luồng chính; trước khi viết tiêu chí chấp nhận và thiết kế test; sau sự cố, để tìm lỗ hổng tương tự.'],
      ko: ['예외 상황과 엣지 케이스 찾기', '흐름의 엣지 케이스와 예외를 데이터, 시간, 권한, 연동별로 체계적으로 나열하고 기대 동작을 정리합니다.', '정상 흐름 합의 후; 인수 기준과 테스트 설계 전; 장애 후 비슷한 허점을 찾을 때.'],
      fr: ['Trouver les cas limites et les exceptions', 'Liste méthodiquement les cas limites et exceptions d’un flux — données, temps, permissions, intégrations — avec le comportement attendu.', 'Après l’accord sur le parcours nominal ; avant les critères d’acceptation et les tests ; après un incident, pour trouver des failles similaires.'],
    },
  },
];
