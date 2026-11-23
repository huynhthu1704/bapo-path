// E. User Story and Backlog Management
export default [
  {
    id: 'P-E01', phase: 'build', step: 6, cat: 'E', sub: 'Epic and feature breakdown', roles: ['PO', 'BA'],
    title: 'Break an epic into features and stories',
    desc: 'Splits an epic into features and thin, valuable user stories using proven splitting patterns, ready for the backlog.',
    when: ['An epic is too big for a release', 'Before story mapping or refinement', 'When stories keep spilling over sprints'],
    prepare: 'The epic and its goal, user roles, main journey steps, known rules',
    ph: [['Epic', 'Epic and its goal', 'Online loan application — customers apply and get a decision without visiting a branch'],
      ['Users', 'User roles', 'Customer, credit analyst, risk manager'],
      ['Journey', 'Main steps (optional)', 'Check eligibility → fill form → upload documents → submit → track status → sign contract']],
    body: `Act as a product owner experienced in story mapping.

Epic: [Epic]
Users: [Users]
Journey: [Journey]

1. Lay out a story map: the backbone of user activities (left to right) and the tasks under each.
2. Group tasks into features.
3. Split each feature into user stories ("As a… I want… so that…") using patterns such as workflow steps, business rule variations, data variations, happy path first, and simple before complex.
4. Draw a release line: which stories form the first usable slice (walking skeleton).
5. Flag stories that are still too big (more than a few days of work).

Output: the story map as a table (activities as columns), a story list with IDs grouped by feature, the first-release slice, and stories to split further.`,
    output: 'A story map, features, user stories with IDs, a first-release slice and a list of stories still too big.',
    next: ['P-E02', 'P-E04'], tags: ['epic', 'story mapping', 'splitting', 'feature'],
    tr: {
      vi: ['Chia epic thành tính năng và user story', 'Tách epic thành tính năng và các user story mỏng, có giá trị bằng các kỹ thuật chia nhỏ phổ biến, sẵn sàng cho backlog.', 'Khi epic quá lớn cho một đợt phát hành; trước story mapping hay refinement; khi story liên tục tràn qua sprint.'],
      ko: ['에픽을 기능과 스토리로 나누기', '검증된 분할 패턴으로 에픽을 기능과 가치 있는 얇은 사용자 스토리로 나눠 백로그를 준비합니다.', '에픽이 한 릴리스에 너무 클 때; 스토리 매핑이나 정제 전; 스토리가 스프린트를 계속 넘길 때.'],
      fr: ['Découper un epic en fonctionnalités et user stories', 'Découpe un epic en fonctionnalités et en user stories fines et utiles grâce à des techniques éprouvées, prêtes pour le backlog.', 'Quand un epic est trop gros pour une release ; avant le story mapping ou l’affinage ; quand les stories débordent des sprints.'],
    },
  },
  {
    id: 'P-E02', phase: 'build', step: 7, cat: 'E', sub: 'User story generation', roles: ['BA', 'PO'],
    title: 'Write user stories with Gherkin acceptance criteria',
    desc: 'Turns a feature brief into INVEST user stories, each with Given / When / Then acceptance criteria.',
    when: ['A feature is agreed and needs to go into the backlog', 'Preparing for refinement', 'Turning requirements into stories'],
    prepare: 'The feature brief, user roles, business rules, related requirements',
    ph: [['Feature Brief', 'What the feature does', 'Customers can save a loan application and finish it later on any device'],
      ['User Roles', 'Who uses it', 'Customer, credit analyst'],
      ['Business Rules', 'Rules that apply', 'Drafts expire after 30 days; one draft per customer']],
    body: `Act as a business analyst and product owner writing backlog items.

Feature brief: [Feature Brief]
User roles: [User Roles]
Business rules: [Business Rules]

1. Write 3–8 user stories in the form "As a [role], I want [goal], so that [benefit]". Give each an ID and a short title.
2. For each story write acceptance criteria in Gherkin: Scenario, Given, When, Then. Cover the main path, each business rule, and at least one negative case.
3. Note dependencies, open questions and a rough size (S / M / L).
4. Check each story against INVEST and say if one should be split.

Output: one block per story: ID, title, story statement, Gherkin scenarios, notes. Keep UI wording out unless it matters.`,
    output: '3–8 user stories with IDs, Gherkin scenarios for main, rule and negative cases, notes and size, and an INVEST check.',
    next: ['P-E03', 'P-G02'], tags: ['user stories', 'Gherkin', 'acceptance criteria', 'INVEST'],
    tr: {
      vi: ['Viết user story kèm tiêu chí chấp nhận Gherkin', 'Biến mô tả tính năng thành các user story đạt INVEST, mỗi story có tiêu chí chấp nhận Given / When / Then.', 'Khi tính năng đã chốt và cần đưa vào backlog; khi chuẩn bị refinement; khi chuyển yêu cầu thành story.'],
      ko: ['Gherkin 인수 기준과 함께 사용자 스토리 작성하기', '기능 설명을 INVEST 사용자 스토리로 바꾸고 각 스토리에 Given / When / Then 인수 기준을 붙입니다.', '기능이 합의되어 백로그에 넣을 때; 정제 준비 시; 요구사항을 스토리로 바꿀 때.'],
      fr: ['Rédiger des user stories avec critères Gherkin', 'Transforme une description de fonctionnalité en user stories INVEST, chacune avec des critères Given / When / Then.', 'Quand une fonctionnalité est validée et doit entrer au backlog ; pour préparer l’affinage ; pour transformer des exigences en stories.'],
    },
  },
  {
    id: 'P-E03', phase: 'build', step: 8, cat: 'E', sub: 'User story refinement', roles: ['PO', 'BA'],
    title: 'Refine a user story',
    desc: 'Improves a weak user story: clearer value, sharper criteria, questions for the team and a check that it is ready for a sprint.',
    when: ['Before or during backlog refinement', 'A story was rejected or misunderstood', 'Stories written in a hurry'],
    prepare: 'The story as written, its acceptance criteria, related rules',
    ph: [['Story', 'The story and its criteria', 'As a user I want to upload files so that I can apply. AC: upload works.'],
      ['Context', 'What you know about it', 'Income proof and ID; PDF or JPG; up to 5 files']],
    body: `Act as a product owner coaching a team on story quality.

Story: [Story]
Context: [Context]

1. Diagnose what is weak: role, goal, benefit, size, criteria, testability.
2. Rewrite the story with a specific role and a real benefit.
3. Rewrite the acceptance criteria to be complete and testable (main path, rules, errors, limits).
4. List questions the team will ask in refinement, with a suggested answer where possible.
5. Say whether it meets a typical Definition of Ready; if not, what is missing.

Output: Diagnosis, Improved story, Acceptance criteria, Questions, Ready check.`,
    output: 'A diagnosis, the rewritten story, complete acceptance criteria, likely refinement questions with suggested answers, and a Definition of Ready check.',
    next: ['P-E04', 'P-E08'], tags: ['refinement', 'grooming', 'story quality'],
    tr: {
      vi: ['Tinh chỉnh một user story', 'Cải thiện user story yếu: giá trị rõ hơn, tiêu chí sắc hơn, câu hỏi cho nhóm và kiểm tra sẵn sàng cho sprint.', 'Trước hoặc trong buổi refinement; khi story bị từ chối hay hiểu sai; với story viết vội.'],
      ko: ['사용자 스토리 다듬기', '약한 스토리의 가치와 기준을 명확히 하고 팀 질문을 정리하며 스프린트 준비 여부를 확인합니다.', '백로그 정제 전이나 중; 스토리가 반려되거나 오해받았을 때; 급하게 쓴 스토리.'],
      fr: ['Affiner une user story', 'Améliore une story faible : valeur plus claire, critères plus précis, questions pour l’équipe et vérification qu’elle est prête pour un sprint.', 'Avant ou pendant l’affinage ; quand une story a été rejetée ou mal comprise ; pour des stories écrites à la hâte.'],
    },
  },
  {
    id: 'P-E04', phase: 'build', step: 9, cat: 'E', sub: 'INVEST principle validation', roles: ['PO', 'BA'],
    title: 'Check stories against INVEST',
    desc: 'Scores each story on the six INVEST criteria and suggests how to fix or split the ones that fail.',
    when: ['Reviewing a batch of new stories', 'Before sprint planning', 'Teaching a team what good stories look like'],
    prepare: 'The stories with their acceptance criteria',
    ph: [['Stories', 'Paste the stories', 'US-21 Save draft; US-22 Resume on another device; US-23 Draft expiry notification; US-24 Manage all applications']],
    body: `Act as an agile coach reviewing user stories.

Stories: [Stories]

For each story, check the INVEST criteria: Independent, Negotiable, Valuable, Estimable, Small, Testable.
1. Mark each criterion pass or fail with a one-line reason.
2. For each failure, suggest a concrete fix: rewrite, add criteria, remove a dependency, or split (name the splitting pattern).
3. Show the split stories where you recommend a split.

Output: a table Story | I | N | V | E | S | T | Main issue, then Fixes and Splits.`,
    output: 'An INVEST scorecard for each story, the main issue, and concrete fixes or splits with the pattern used.',
    next: ['P-E05', 'P-E06'], tags: ['INVEST', 'story quality', 'splitting'],
    tr: {
      vi: ['Kiểm tra user story theo INVEST', 'Chấm từng story theo sáu tiêu chí INVEST và gợi ý cách sửa hoặc chia nhỏ story chưa đạt.', 'Khi rà soát một loạt story mới; trước sprint planning; khi hướng dẫn nhóm thế nào là story tốt.'],
      ko: ['INVEST 기준으로 스토리 점검하기', '스토리를 INVEST 6개 기준으로 평가하고 통과하지 못한 스토리의 수정이나 분할 방법을 제안합니다.', '새 스토리 묶음 검토 시; 스프린트 계획 전; 좋은 스토리를 팀에 가르칠 때.'],
      fr: ['Vérifier les stories avec INVEST', 'Évalue chaque story sur les six critères INVEST et propose comment corriger ou découper celles qui échouent.', 'Pour revoir un lot de nouvelles stories ; avant le sprint planning ; pour montrer à l’équipe ce qu’est une bonne story.'],
    },
  },
  {
    id: 'P-E05', phase: 'build', step: 10, cat: 'E', sub: 'Acceptance criteria using Gherkin syntax', roles: ['BA', 'PO'],
    title: 'Write acceptance criteria in Gherkin',
    desc: 'Turns each user story into testable Given / When / Then scenarios, including negative and edge cases.',
    when: ['Stories have weak or missing criteria', 'The team uses BDD or automated acceptance tests', 'Before test design'],
    prepare: 'User stories, business rules, examples of data',
    ph: [['Business Context', 'Short context', 'A retail bank replacing its paper loan application with a mobile journey'],
      ['User Stories', 'Stories to cover', 'US-21 As a customer I want to save my application so that I can finish it later']],
    body: `Act as a senior business analyst and QA lead.

Context: [Business Context]
User stories: [User Stories]

For each user story, write acceptance criteria in Gherkin (Feature, Background if useful, Scenario / Scenario Outline, Given, When, Then, And).
Cover the main path, at least two negative cases and the boundary values. Use Scenario Outline with an Examples table when only the data changes.
Flag any story that fails INVEST and say which letter it fails.

Rules: one behaviour per scenario; describe behaviour, not clicks; use concrete example data.
Output: a Gherkin code block per story, then a table with story, number of scenarios, and open questions.`,
    output: 'Gherkin feature files per story (main, negative and boundary scenarios, outlines with examples), plus a summary table with open questions.',
    next: ['P-G02', 'P-E06'], tags: ['Gherkin', 'BDD', 'Given When Then', 'acceptance criteria'],
    tr: {
      vi: ['Viết tiêu chí chấp nhận bằng Gherkin', 'Biến mỗi user story thành các kịch bản Given / When / Then kiểm thử được, gồm cả trường hợp lỗi và biên.', 'Khi story thiếu hoặc yếu tiêu chí; khi nhóm dùng BDD hay kiểm thử chấp nhận tự động; trước khi thiết kế test.'],
      ko: ['Gherkin으로 인수 기준 작성하기', '각 사용자 스토리를 부정·경계 사례를 포함한 테스트 가능한 Given / When / Then 시나리오로 바꿉니다.', '스토리 기준이 약하거나 없을 때; 팀이 BDD나 자동 인수 테스트를 쓸 때; 테스트 설계 전.'],
      fr: ['Rédiger les critères d’acceptation en Gherkin', 'Transforme chaque user story en scénarios Given / When / Then testables, y compris cas négatifs et limites.', 'Quand les critères manquent ou sont faibles ; quand l’équipe pratique le BDD ou les tests d’acceptation automatisés ; avant la conception des tests.'],
    },
  },
  {
    id: 'P-E06', phase: 'build', step: 11, cat: 'E', sub: 'Definition of Ready and Definition of Done', roles: ['PO', 'PM'],
    title: 'Define the Definition of Ready and Done',
    desc: 'Drafts a practical Definition of Ready and Definition of Done for your team, sized to your context.',
    when: ['A new team or project starts', 'Stories enter sprints half-ready', '"Done" means different things to different people'],
    prepare: 'Team setup, tools, quality expectations, compliance needs',
    ph: [['Team Context', 'Team, product and tools', '7-person Scrum team, mobile banking app, Jira, automated CI, external pen test each release'],
      ['Pain Points', 'What goes wrong today', 'Stories start without designs; bugs found after the sprint; docs never updated']],
    body: `Act as an agile coach.

Team context: [Team Context]
Pain points: [Pain Points]

1. Draft a Definition of Ready: 6–10 checklist items a story must meet before sprint planning.
2. Draft a Definition of Done at three levels: story, sprint, release. 6–10 items each.
3. Link each item to a pain point it prevents, where possible.
4. Mark items as must-have now vs later, so the team starts small.
5. Suggest how to check the lists in refinement and review without slowing the team down.

Output: two checklists (DoR, DoD by level) with the must-have items marked, then a short adoption plan.`,
    output: 'A Definition of Ready and a three-level Definition of Done as checklists, linked to pain points, with must-have items and an adoption plan.',
    next: ['P-E07', 'P-F02'], tags: ['Definition of Ready', 'Definition of Done', 'DoR', 'DoD', 'Scrum'],
    tr: {
      vi: ['Xây dựng Definition of Ready và Done', 'Soạn Definition of Ready và Definition of Done thực tế, phù hợp với bối cảnh nhóm.', 'Khi nhóm hay dự án mới bắt đầu; khi story vào sprint khi chưa sẵn sàng; khi mỗi người hiểu "xong" một kiểu.'],
      ko: ['DoR과 DoD 정의하기', '팀 상황에 맞는 실용적인 Definition of Ready와 Definition of Done을 작성합니다.', '새 팀이나 프로젝트 시작 시; 준비 안 된 스토리가 스프린트에 들어올 때; "완료"의 의미가 사람마다 다를 때.'],
      fr: ['Définir la Definition of Ready et la Definition of Done', 'Rédige une Definition of Ready et une Definition of Done pratiques, adaptées à votre contexte.', 'Au démarrage d’une équipe ou d’un projet ; quand des stories entrent en sprint à moitié prêtes ; quand « terminé » n’a pas le même sens pour tous.'],
    },
  },
  {
    id: 'P-E07', phase: 'build', step: 12, cat: 'E', sub: 'Backlog prioritization', roles: ['PO'],
    title: 'Prioritise the backlog',
    desc: 'Orders the backlog by value, cost of delay, risk and dependencies using WSJF, and explains the trade-offs.',
    when: ['Before sprint planning', 'When new requests compete with planned work', 'Stakeholders disagree on what comes first'],
    prepare: 'Backlog items with rough sizes, the product goal, deadlines and dependencies',
    ph: [['Backlog Items', 'Items with sizes', 'Save draft (5), E-signature (13), SMS status (3), Income auto-check (8), Dark mode (3)'],
      ['Product Goal', 'Current goal', 'Increase completed mobile applications from 40% to 70%'],
      ['Constraints', 'Deadlines, dependencies', 'E-signature vendor ready in March; regulator deadline for audit log in February']],
    body: `Act as a product owner.

Backlog items: [Backlog Items]
Product goal: [Product Goal]
Constraints: [Constraints]

1. Score each item with WSJF: user/business value, time criticality, risk reduction / opportunity enablement (1–10 each), divided by job size. Show the numbers.
2. Adjust the order for hard dependencies and deadlines, and explain each adjustment.
3. Give the final ranked list and draw a line at what fits the next two sprints.
4. Write a short note for stakeholders whose items fell below the line.

Output: a WSJF table, the ranked list with the cut line, then the stakeholder note.`,
    output: 'A WSJF scoring table, a ranked backlog adjusted for dependencies with a cut line, and a note for stakeholders below the line.',
    next: ['P-E09', 'P-E08'], tags: ['backlog', 'WSJF', 'prioritisation', 'cost of delay'],
    tr: {
      vi: ['Ưu tiên backlog', 'Sắp xếp backlog theo giá trị, chi phí trì hoãn, rủi ro và phụ thuộc bằng WSJF, giải thích các đánh đổi.', 'Trước sprint planning; khi yêu cầu mới cạnh tranh với việc đã lên kế hoạch; khi các bên không đồng ý việc nào trước.'],
      ko: ['백로그 우선순위 정하기', 'WSJF로 가치, 지연 비용, 위험, 의존성에 따라 백로그를 정렬하고 트레이드오프를 설명합니다.', '스프린트 계획 전; 새 요청이 계획된 일과 경쟁할 때; 무엇을 먼저 할지 의견이 갈릴 때.'],
      fr: ['Prioriser le backlog', 'Ordonne le backlog selon la valeur, le coût du retard, le risque et les dépendances avec WSJF, et explique les arbitrages.', 'Avant le sprint planning ; quand de nouvelles demandes concurrencent le travail prévu ; quand les parties prenantes ne s’accordent pas sur l’ordre.'],
    },
  },
  {
    id: 'P-E08', phase: 'build', step: 13, cat: 'E', sub: 'Story point estimation support', roles: ['PO', 'PM'],
    title: 'Prepare for story point estimation',
    desc: 'Prepares stories for estimation: reference stories, complexity and uncertainty drivers, and questions to settle before planning poker.',
    when: ['Before an estimation session', 'Estimates vary wildly between team members', 'A new team sets up its scale'],
    prepare: 'Stories to estimate, a few past stories with their actual points',
    ph: [['Stories', 'Stories to estimate', 'US-21 Save draft; US-30 E-signature integration; US-31 SMS status updates'],
      ['Reference Stories', 'Past stories with points', 'US-05 Login with OTP = 5; US-09 Profile page = 3; US-12 Document upload = 8']],
    body: `Act as a scrum master preparing a planning poker session. You do not estimate for the team; you help them estimate well.

Stories to estimate: [Stories]
Reference stories: [Reference Stories]

1. For each story, list what drives size: complexity, amount of work, uncertainty, dependencies, testing effort.
2. Compare it with the reference stories ("similar to US-12 but adds…") and suggest a likely range, not a single number.
3. List the questions that must be answered before the team can estimate with confidence.
4. Flag stories that should be split or need a spike first.

Output: a table Story | Size drivers | Closest reference | Likely range | Questions, then Split or spike.`,
    output: 'Per story: size drivers, the closest reference story, a likely range, questions to settle, and stories needing a split or spike.',
    next: ['P-E09', 'P-F02'], tags: ['estimation', 'story points', 'planning poker'],
    tr: {
      vi: ['Chuẩn bị ước lượng story point', 'Chuẩn bị story cho buổi ước lượng: story tham chiếu, yếu tố độ phức tạp và bất định, câu hỏi cần làm rõ trước planning poker.', 'Trước buổi ước lượng; khi ước lượng giữa các thành viên chênh lệch lớn; khi nhóm mới xây dựng thang điểm.'],
      ko: ['스토리 포인트 추정 준비하기', '추정을 위해 참고 스토리, 복잡도와 불확실성 요인, 플래닝 포커 전 정리할 질문을 준비합니다.', '추정 세션 전; 팀원 간 추정치가 크게 다를 때; 새 팀이 척도를 정할 때.'],
      fr: ['Préparer l’estimation en story points', 'Prépare les stories à estimer : stories de référence, facteurs de complexité et d’incertitude, questions à régler avant le planning poker.', 'Avant une séance d’estimation ; quand les estimations varient énormément ; quand une nouvelle équipe définit son échelle.'],
    },
  },
  {
    id: 'P-E09', phase: 'build', step: 16, cat: 'E', sub: 'Sprint backlog preparation', roles: ['PO'],
    title: 'Prepare the sprint backlog',
    desc: 'Proposes a sprint goal and a realistic sprint backlog from the ordered product backlog and the team\'s capacity.',
    when: ['The day before sprint planning', 'When sprints are always over-committed', 'Starting a new team'],
    prepare: 'Top of the ordered backlog with points, velocity of the last sprints, team availability',
    ph: [['Top Backlog', 'Ordered items with points', 'Save draft (5), Income auto-check (8), SMS status (3), Audit log export (5), Fix upload timeout (2)'],
      ['Velocity', 'Last 3 sprints', '18, 22, 20'],
      ['Availability', 'Days off and events', 'One developer away 3 days; public holiday on Friday']],
    body: `Act as a product owner preparing sprint planning.

Top of backlog: [Top Backlog]
Recent velocity: [Velocity]
Availability: [Availability]

1. Calculate a realistic capacity for this sprint from the velocity and availability; show the calculation.
2. Propose one sprint goal that gives the sprint a single focus and a business outcome.
3. Select items that serve the goal and fit the capacity, keeping a small buffer; include any urgent bug.
4. List what is needed to start each item (designs, data, access) and the risks to the goal.
5. Suggest 3 questions to ask the team during planning.

Output: Capacity, Sprint goal, a table Item | Points | Why it serves the goal | Ready?, then Risks and Questions.`,
    output: 'A capacity calculation, one sprint goal, a selected sprint backlog with readiness, risks to the goal and questions for planning.',
    next: ['P-F02', 'P-E11'], tags: ['sprint backlog', 'sprint goal', 'capacity', 'Scrum'],
    tr: {
      vi: ['Chuẩn bị sprint backlog', 'Đề xuất mục tiêu sprint và sprint backlog thực tế từ product backlog đã sắp xếp và năng lực của nhóm.', 'Một ngày trước sprint planning; khi sprint luôn bị cam kết quá sức; khi nhóm mới bắt đầu.'],
      ko: ['스프린트 백로그 준비하기', '정렬된 제품 백로그와 팀 역량으로 스프린트 목표와 현실적인 스프린트 백로그를 제안합니다.', '스프린트 계획 전날; 스프린트가 항상 과다 약속될 때; 새 팀 시작 시.'],
      fr: ['Préparer le sprint backlog', 'Propose un objectif de sprint et un sprint backlog réaliste à partir du backlog ordonné et de la capacité de l’équipe.', 'La veille du sprint planning ; quand les sprints sont toujours surchargés ; au démarrage d’une équipe.'],
    },
  },
  {
    id: 'P-E10', phase: 'build', step: 14, cat: 'E', sub: 'Dependency identification', roles: ['PO', 'PM', 'BA'],
    title: 'Identify backlog dependencies',
    desc: 'Finds dependencies between stories, teams and external parties, and suggests how to order or decouple the work.',
    when: ['Planning a release across several teams', 'Stories keep getting blocked', 'Before PI or quarterly planning'],
    prepare: 'Stories or features in scope, teams involved, external parties',
    ph: [['Items', 'Stories or features', 'E-signature, contract generation, SMS status, core banking account opening'],
      ['Teams', 'Teams and external parties', 'Mobile team, Core banking team, E-signature vendor, Compliance']],
    body: `Act as a delivery manager mapping dependencies.

Items: [Items]
Teams and parties: [Teams]

1. List each dependency: from item, to item or party, type (technical, data, decision, resource, external), and what is needed by when.
2. Rate each by risk (likelihood of delay × impact).
3. Suggest how to reduce each: reorder, stub or mock, contract-first API, feature flag, split, or escalate.
4. Propose an order of work that respects the dependencies.

Output: a dependency table, a risk-sorted list of actions, and the proposed order. Add a Mermaid graph of the dependencies.`,
    output: 'A dependency table with type, need-by and risk, actions to reduce each, a proposed order of work and a Mermaid dependency graph.',
    next: ['P-E11', 'P-F10'], tags: ['dependencies', 'cross-team', 'PI planning'],
    tr: {
      vi: ['Xác định phụ thuộc trong backlog', 'Tìm phụ thuộc giữa story, các nhóm và bên ngoài, gợi ý cách sắp xếp hoặc tách rời công việc.', 'Khi lập kế hoạch phát hành nhiều nhóm; khi story liên tục bị chặn; trước PI planning hay kế hoạch quý.'],
      ko: ['백로그 의존성 파악하기', '스토리, 팀, 외부 당사자 간 의존성을 찾고 작업 순서 조정이나 분리 방법을 제안합니다.', '여러 팀에 걸친 릴리스 계획 시; 스토리가 계속 막힐 때; PI나 분기 계획 전.'],
      fr: ['Identifier les dépendances du backlog', 'Trouve les dépendances entre stories, équipes et tiers, et propose comment ordonner ou découpler le travail.', 'Pour planifier une release multi-équipes ; quand les stories sont sans cesse bloquées ; avant un PI planning ou une planification trimestrielle.'],
    },
  },
  {
    id: 'P-E11', phase: 'build', step: 15, cat: 'E', sub: 'Technical story and task breakdown support', roles: ['PO', 'BA'],
    title: 'Break a story into technical tasks',
    desc: 'Suggests a task breakdown for a story (front end, back end, data, tests, docs) to help the team plan — for the team to adjust.',
    when: ['During sprint planning part two', 'A story is ready but the team is unsure where to start', 'Onboarding new developers'],
    prepare: 'The story with acceptance criteria, the main components or tech stack',
    ph: [['Story', 'Story and acceptance criteria', 'US-21 Save draft application; AC: save on any step, resume on any device, expire after 30 days'],
      ['Tech Stack', 'Components involved', 'React Native app, Node API, PostgreSQL, scheduled jobs']],
    body: `Act as a tech lead helping a team plan a story. Your breakdown is a starting point for the team to change.

Story: [Story]
Tech stack: [Tech Stack]

1. Break the story into tasks of half a day to two days: UI, API, data model and migration, background jobs, integration, automated tests, manual test, documentation, analytics events.
2. Note dependencies between tasks and which can run in parallel.
3. Flag technical risks or unknowns that may need a spike.
4. Suggest any technical story or enabler the team should add to the backlog.

Output: a task table Task | Area | Depends on | Notes, then Risks and Enablers.`,
    output: 'A task table by area with dependencies, technical risks or spikes, and suggested enabler stories.',
    next: ['P-E09', 'P-G02'], tags: ['tasks', 'technical story', 'sprint planning'],
    tr: {
      vi: ['Chia story thành các task kỹ thuật', 'Gợi ý chia story thành task (giao diện, back end, dữ liệu, kiểm thử, tài liệu) để nhóm lập kế hoạch và tự điều chỉnh.', 'Trong phần hai của sprint planning; khi story sẵn sàng nhưng nhóm chưa biết bắt đầu từ đâu; khi hướng dẫn dev mới.'],
      ko: ['스토리를 기술 작업으로 나누기', '팀 계획을 돕기 위해 스토리를 프런트엔드, 백엔드, 데이터, 테스트, 문서 작업으로 나누는 안을 제안합니다.', '스프린트 계획 2부에서; 스토리는 준비됐지만 어디서 시작할지 모를 때; 새 개발자 온보딩 시.'],
      fr: ['Découper une story en tâches techniques', 'Propose un découpage d’une story en tâches (front, back, données, tests, documentation) pour aider l’équipe à planifier — à ajuster par l’équipe.', 'Pendant la seconde partie du sprint planning ; quand une story est prête mais qu’on ne sait pas par où commencer ; pour intégrer de nouveaux développeurs.'],
    },
  },
];
