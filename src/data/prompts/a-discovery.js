// A. Business and Product Discovery — approved in Content Batch 1.
// Each prompt: id, phase, step, cat, sub, roles, title, desc, when[], prepare, ph[[name, hint, example]],
// body (placeholders in [Square Brackets]), output, next[], tags[], tr { vi|ko|fr: [title, description, when to use] }.

export default [
  {
    id: 'P-A01', phase: 'discover', step: 1, cat: 'A', sub: 'Business idea generation and validation', roles: ['PO', 'PM'],
    title: 'Validate a business idea',
    desc: 'Tests a new idea against the problem, the customer, the value and the main risks before anyone builds it.',
    when: ['Someone brings a new product or feature idea', 'Before asking for budget or a team', 'When two ideas compete for the same slot'],
    prepare: 'One-paragraph idea, who it is for, why now, anything already known (data, complaints, competitor moves)',
    ph: [['Idea', 'What is the idea?', 'A mobile app for small shops to order stock from wholesalers'],
      ['Target Customer', 'Who has the problem?', 'Owners of grocery shops in Ho Chi Minh City'],
      ['Known Facts', 'Evidence you already have', 'Shops order by phone; 30% of orders are wrong']],
    body: `Act as an experienced product owner who validates ideas before investment.

Idea: [Idea]
Target customer: [Target Customer]
What we already know: [Known Facts]

Validate this idea in five steps:
1. Problem: restate the problem in the customer's words. How painful and how frequent is it? What do they do today instead?
2. Customer: who exactly feels it most? Name the early-adopter segment.
3. Value: what changes for the customer if this works? Estimate the value in time, money or risk.
4. Risky assumptions: list the 5 assumptions that would kill the idea if wrong. Rank them by impact and uncertainty.
5. Tests: for the top 3 assumptions, propose a test that takes under two weeks and costs almost nothing (interviews, landing page, concierge test, data check). Give the pass/fail signal for each.

Rules: be honest about weak points; separate facts from guesses; do not suggest building the product as a test.
Output: short sections with the headings above, then a final line: Go, Test more, or Stop, with one sentence why.
If something important is missing, ask me up to 3 questions first.`,
    output: 'A one-page validation: problem fit, customer fit, value, top 5 risky assumptions ranked, and 3 cheap tests with a pass/fail signal each. Ends with a go / test-more / stop recommendation.',
    next: ['P-A02', 'P-A03'], tags: ['idea', 'validation', 'assumptions', 'lean'],
    tr: {
      vi: ['Kiểm chứng một ý tưởng kinh doanh', 'Kiểm tra ý tưởng mới về vấn đề, khách hàng, giá trị và rủi ro chính trước khi bắt tay xây dựng.', 'Có ý tưởng sản phẩm mới; trước khi xin ngân sách; khi hai ý tưởng cạnh tranh nhau.'],
      ko: ['비즈니스 아이디어 검증하기', '개발에 들어가기 전에 문제, 고객, 가치, 핵심 위험 측면에서 새 아이디어를 검증합니다.', '새 아이디어가 나왔을 때; 예산 요청 전; 두 아이디어가 경쟁할 때.'],
      fr: ['Valider une idée business', 'Teste une nouvelle idée sur le problème, le client, la valeur et les risques majeurs avant de construire.', 'Une nouvelle idée arrive ; avant de demander un budget ; quand deux idées sont en concurrence.'],
    },
  },
  {
    id: 'P-A02', phase: 'discover', step: 2, cat: 'A', sub: 'Business model analysis', roles: ['PO'],
    title: 'Analyse a business model',
    desc: 'Maps the idea onto a Business Model Canvas and flags the weakest blocks to test first.',
    when: ['After a first validation of the idea', 'When the team argues about who pays and why', 'Before writing a business case'],
    prepare: 'The idea, target customers, how it might make or save money, key partners you already have',
    ph: [['Idea', 'What is the idea?', 'Mobile ordering app for small grocery shops'],
      ['Customers', 'Who uses and who pays?', 'Shop owners; wholesalers as a second side'],
      ['Revenue Idea', 'How it makes or saves money', '2% fee per order paid by wholesalers']],
    body: `Act as a product strategist.

Idea: [Idea]
Customers: [Customers]
How it makes or saves money: [Revenue Idea]

Fill in a Business Model Canvas for this idea: customer segments, value propositions, channels, customer relationships, revenue streams, key resources, key activities, key partners, cost structure.
For each block write 1–3 short lines and label it Known (we have evidence), Assumed (we believe it) or Unknown.
Then name the 3 weakest blocks — the ones that are assumed or unknown and would break the model — and suggest one quick way to test each.

Output: a table with columns Block | Content | Status, then a short list "Weakest blocks and tests".
If this is a multi-sided platform, show each side's value proposition separately.`,
    output: 'A 9-block canvas as a table, one line per block, each marked Known / Assumed / Unknown, then the 3 weakest blocks with one test each.',
    next: ['P-A03', 'P-A07'], tags: ['business model canvas', 'revenue', 'strategy'],
    tr: {
      vi: ['Phân tích mô hình kinh doanh', 'Đặt ý tưởng vào Business Model Canvas và chỉ ra các khối yếu nhất cần kiểm chứng trước.', 'Sau khi kiểm chứng ý tưởng lần đầu; khi nhóm tranh luận ai trả tiền và vì sao; trước khi viết business case.'],
      ko: ['비즈니스 모델 분석하기', '아이디어를 비즈니스 모델 캔버스에 넣고 먼저 검증해야 할 가장 약한 블록을 찾습니다.', '첫 검증 후; 누가 왜 돈을 내는지 팀 의견이 갈릴 때; 비즈니스 케이스 작성 전.'],
      fr: ['Analyser un modèle économique', "Place l'idée sur un Business Model Canvas et signale les blocs les plus fragiles à tester d'abord.", "Après une première validation ; quand l'équipe débat de qui paie et pourquoi ; avant un business case."],
    },
  },
  {
    id: 'P-A03', phase: 'discover', step: 3, cat: 'A', sub: 'Market and competitor research', roles: ['BA', 'PO'],
    title: 'Research the market and competitors',
    desc: 'Compares 3–5 competitors on features, pricing and positioning, and points out the gaps you can use.',
    when: ['Before defining scope or a roadmap', 'When a stakeholder says "competitor X already does this"', 'Preparing a pitch or business case'],
    prepare: 'Your product idea, the market and country, competitor names you know',
    ph: [['Product', 'What are you building?', 'Mobile ordering app for small grocery shops'],
      ['Market', 'Country and segment', 'Vietnam, B2B retail supply'],
      ['Competitors', 'Names you know (optional)', 'KiotViet, Telio, Sapo']],
    body: `Act as a market research analyst.

Our product: [Product]
Market: [Market]
Competitors I know: [Competitors]

1. List the 3–5 most relevant competitors or alternatives (include "do nothing" or manual workarounds if customers use them). Add any I missed.
2. Compare them in a table: target customer, key features, pricing model, strengths, weaknesses.
3. Summarise how each positions itself in one sentence.
4. Identify 3–5 gaps or underserved needs we could use, and say which customers feel them.

Rules: mark anything you are not sure is current with "(verify)", because your knowledge may be out of date. Do not invent prices or user numbers; write "unknown" instead.
Output: the table, then "Positioning" and "Opportunities for us" as short lists.`,
    output: 'A comparison table (target customer, key features, pricing model, strengths, weaknesses), a positioning summary, and 3–5 gaps or opportunities. Facts to verify are flagged.',
    next: ['P-A04', 'P-A08'], tags: ['competitors', 'market research', 'benchmarking'],
    tr: {
      vi: ['Nghiên cứu thị trường và đối thủ', 'So sánh 3–5 đối thủ về tính năng, giá và định vị, chỉ ra khoảng trống có thể tận dụng.', 'Trước khi xác định phạm vi hay lộ trình; khi có người nói "đối thủ X đã làm rồi"; khi chuẩn bị bài pitch.'],
      ko: ['시장과 경쟁사 조사하기', '경쟁사 3~5곳의 기능, 가격, 포지셔닝을 비교하고 활용할 수 있는 빈틈을 찾습니다.', '범위나 로드맵 정의 전; "경쟁사가 이미 한다"는 말을 들었을 때; 피치 준비 시.'],
      fr: ['Étudier le marché et la concurrence', 'Compare 3 à 5 concurrents sur les fonctionnalités, les prix et le positionnement, et repère les manques à exploiter.', 'Avant de définir le périmètre ou la roadmap ; quand on vous dit « le concurrent X le fait déjà » ; pour préparer un pitch.'],
    },
  },
  {
    id: 'P-A04', phase: 'discover', step: 4, cat: 'A', sub: 'Stakeholder identification and analysis', roles: ['BA', 'PO', 'PM'],
    title: 'Identify and map your stakeholders',
    desc: 'Produces a stakeholder register and a power–interest map for a new initiative, with a RACI for the main decisions.',
    when: ['At the start of a project or initiative', 'When a new department or partner joins', 'Before planning elicitation sessions'],
    prepare: 'A short description of the initiative, departments and teams involved, names of known decision makers',
    ph: [['Business Context', 'What is the initiative?', 'A retail bank replacing its paper loan application with a mobile journey'],
      ['Departments', 'Who is involved?', 'Retail lending, Risk, Compliance, IT, Branch operations'],
      ['Known Stakeholders', 'Optional', 'Head of Lending, CRO']],
    body: `Act as a senior business analyst.

Context: [Business Context]
Departments involved: [Departments]
Known decision makers: [Known Stakeholders]

Task: Identify every stakeholder group affected by this initiative, including indirect and external ones (customers, regulators, vendors, support teams). For each one give: name or group, role, interest in the outcome, influence (high / medium / low), current attitude (supporter / neutral / resistant / unknown), and RACI for the main decisions.
Then place them on a power–interest grid and suggest an engagement approach for each quadrant.

Output: a table first, then the grid as four lists (Manage closely, Keep satisfied, Keep informed, Monitor), then the top 3 risks if a key stakeholder is missed.
Ask me up to 3 questions if anything important is unclear.`,
    output: 'A stakeholder table (group, role, interest, influence, attitude, RACI), a power–interest grid as four lists, and the top 3 risks of missing a stakeholder.',
    next: ['P-A05', 'P-F05'], tags: ['stakeholders', 'RACI', 'power interest grid', 'BABOK 3.2'],
    tr: {
      vi: ['Xác định và lập bản đồ các bên liên quan', 'Tạo danh sách bên liên quan và bản đồ quyền lực – mức quan tâm cho một sáng kiến mới, kèm RACI cho các quyết định chính.', 'Khi bắt đầu dự án; khi có phòng ban hay đối tác mới tham gia; trước khi lên kế hoạch thu thập yêu cầu.'],
      ko: ['이해관계자 파악 및 매핑', '새 과제의 이해관계자 목록과 권력–관심도 맵, 주요 의사결정의 RACI를 만듭니다.', '프로젝트 시작 시; 새 부서나 파트너가 합류할 때; 요구사항 수집 계획 전.'],
      fr: ['Identifier et cartographier les parties prenantes', 'Produit un registre des parties prenantes et une matrice pouvoir–intérêt, avec un RACI pour les décisions clés.', "Au démarrage d'un projet ; quand un nouveau service ou partenaire arrive ; avant de planifier l'élicitation."],
    },
  },
  {
    id: 'P-A05', phase: 'discover', step: 5, cat: 'A', sub: 'Business problem identification', roles: ['BA'],
    title: 'Define the business problem',
    desc: 'Turns symptoms and complaints into one clear problem statement with evidence, impact and root causes to check.',
    when: ['Stakeholders describe solutions ("we need an app") instead of problems', 'Before writing requirements', 'When different teams describe the problem differently'],
    prepare: 'Complaints, symptoms or requests you heard; any numbers (volumes, delays, costs, error rates); who is affected',
    ph: [['Symptoms', 'What people complain about', 'Loan applications take 9 days; 25% come back incomplete'],
      ['Affected Groups', 'Who feels it?', 'Applicants, branch staff, credit analysts'],
      ['Requested Solution', 'Optional — what someone already asked for', 'A mobile app']],
    body: `Act as a senior business analyst who separates problems from solutions.

Symptoms we hear: [Symptoms]
Who is affected: [Affected Groups]
Solution already requested (if any): [Requested Solution]

1. Write one problem statement in this form: "[group] experiences [problem] when [situation], which causes [impact], as shown by [evidence]." Keep it free of any solution.
2. Ask "why" five times to show how the symptoms connect to deeper causes.
3. List 3 possible root causes and how to verify each (data to check, people to ask).
4. Say whether the requested solution addresses the root causes, partly addresses them, or only treats symptoms.

Output: the statement in bold, then the 5 Whys as a numbered list, then a table Root cause | How to verify, then one paragraph on the requested solution.
If the evidence is weak, say so and suggest what to measure first.`,
    output: 'A problem statement (who, what, where, impact, evidence), a 5 Whys chain, 3 possible root causes to verify, and a note on whether the requested solution fits the problem.',
    next: ['P-A06', 'P-D08'], tags: ['problem statement', '5 whys', 'root cause'],
    tr: {
      vi: ['Xác định vấn đề kinh doanh', 'Biến các triệu chứng và lời phàn nàn thành một phát biểu vấn đề rõ ràng, có bằng chứng, tác động và nguyên nhân gốc cần kiểm tra.', 'Khi các bên mô tả giải pháp thay vì vấn đề; trước khi viết yêu cầu; khi các nhóm hiểu vấn đề khác nhau.'],
      ko: ['비즈니스 문제 정의하기', '증상과 불만을 근거, 영향, 확인할 근본 원인을 담은 명확한 문제 정의로 바꿉니다.', '이해관계자가 문제 대신 해결책을 말할 때; 요구사항 작성 전; 팀마다 문제를 다르게 설명할 때.'],
      fr: ['Définir le problème métier', 'Transforme symptômes et plaintes en un énoncé de problème clair, avec preuves, impact et causes racines à vérifier.', "Quand on vous décrit des solutions au lieu de problèmes ; avant d'écrire les exigences ; quand les équipes ne décrivent pas le même problème."],
    },
  },
  {
    id: 'P-A06', phase: 'discover', step: 6, cat: 'A', sub: 'Business objectives and KPI definition', roles: ['BA', 'PO', 'PM'],
    title: 'Set business objectives and KPIs',
    desc: 'Writes SMART business objectives and the KPIs, baselines and targets that will prove the initiative worked.',
    when: ['Right after the problem is agreed', 'Before a business case or roadmap', 'When "success" means different things to different people'],
    prepare: 'The agreed problem statement, any current numbers (baselines), the deadline or budget period',
    ph: [['Problem Statement', 'The agreed problem', 'Applicants wait 9 days for a loan decision; 25% of applications are incomplete'],
      ['Current Numbers', 'Baselines you have', '9 days average; 25% incomplete; 1,200 applications a month'],
      ['Time Frame', 'By when?', 'By end of Q3 2027']],
    body: `Act as a business analyst who helps teams define measurable success.

Problem: [Problem Statement]
Current numbers: [Current Numbers]
Time frame: [Time Frame]

1. Write 2–4 business objectives. Each must be Specific, Measurable, Achievable, Relevant and Time-bound.
2. For each objective give 1–2 KPIs with: exact definition (formula), baseline, target, data source, how often it is measured, owner role.
3. Add 2 leading indicators we can watch weekly before the KPIs move.
4. Add 1 guardrail metric that must not get worse (e.g. approval quality, customer complaints).

Rules: if a baseline is missing, write "baseline needed" and say how to get it. Do not invent numbers.
Output: a table Objective | KPI | Definition | Baseline | Target | Source | Owner, then the leading indicators and guardrail as short lists.`,
    output: '2–4 SMART objectives, each with 1–2 KPIs (definition, baseline, target, data source, owner), plus leading indicators and one guardrail metric.',
    next: ['P-A07', 'P-B10'], tags: ['SMART', 'KPI', 'objectives', 'metrics'],
    tr: {
      vi: ['Đặt mục tiêu kinh doanh và KPI', 'Viết mục tiêu SMART và các KPI, mức cơ sở, mục tiêu cần đạt để chứng minh sáng kiến thành công.', 'Ngay sau khi thống nhất vấn đề; trước business case hay lộ trình; khi mỗi người hiểu "thành công" một kiểu.'],
      ko: ['비즈니스 목표와 KPI 설정하기', 'SMART 목표와 성공을 증명할 KPI, 기준값, 목표값을 작성합니다.', '문제에 합의한 직후; 비즈니스 케이스나 로드맵 전; 사람마다 "성공"의 의미가 다를 때.'],
      fr: ['Fixer les objectifs métier et les KPI', 'Rédige des objectifs SMART et les KPI, valeurs de référence et cibles qui prouveront le succès.', "Juste après l'accord sur le problème ; avant un business case ou une roadmap ; quand « succès » n'a pas le même sens pour tous."],
    },
  },
  {
    id: 'P-A07', phase: 'discover', step: 7, cat: 'A', sub: 'Business case and feasibility analysis', roles: ['BA', 'PM'],
    title: 'Build a business case',
    desc: 'Drafts a business case with options, costs, benefits, risks and a recommendation a sponsor can approve.',
    when: ['Before asking for budget or a team', 'When the sponsor asks "why should we do this now?"', 'Comparing build, buy or do nothing'],
    prepare: 'Problem statement, objectives and KPIs, rough cost estimates, known constraints (deadline, regulation, vendors)',
    ph: [['Problem Statement', 'The agreed problem', 'Applicants wait 9 days for a loan decision'],
      ['Objectives', 'What success looks like', 'Cut decision time to 2 days by Q3 2027'],
      ['Options', 'Options you are considering', 'Build in-house; buy a loan-origination platform; do nothing'],
      ['Cost Estimates', 'Rough figures', 'Build ~US$250k; buy ~US$120k/year']],
    body: `Act as a business analyst preparing a business case for an executive sponsor.

Problem: [Problem Statement]
Objectives: [Objectives]
Options considered: [Options]
Cost estimates: [Cost Estimates]

Write a business case with these sections:
1. Executive summary (5 lines max, the recommendation first)
2. Problem and opportunity
3. Options compared in a table: description, one-off cost, running cost, benefits, main risks, time to value. Always include "do nothing".
4. Recommended option and why
5. Financial view: payback period and a simple ROI, showing the formula and every assumption
6. Risks, assumptions and dependencies
7. Decision needed: what, from whom, by when

Rules: use only the numbers I gave; where a number is missing, write "estimate needed". Keep it under 2 pages.`,
    output: 'A business case in 7 sections: summary, problem, options compared (cost, benefit, risk, time), recommended option, financial view (payback, simple ROI), risks and assumptions, decision needed.',
    next: ['P-A08', 'P-B01'], tags: ['business case', 'ROI', 'feasibility', 'options'],
    tr: {
      vi: ['Xây dựng business case', 'Soạn business case gồm các phương án, chi phí, lợi ích, rủi ro và đề xuất để nhà tài trợ phê duyệt.', 'Trước khi xin ngân sách hay nhân sự; khi nhà tài trợ hỏi "vì sao làm bây giờ?"; khi so sánh tự xây, mua hoặc không làm.'],
      ko: ['비즈니스 케이스 작성하기', '스폰서가 승인할 수 있도록 대안, 비용, 편익, 위험, 권고안을 담은 비즈니스 케이스를 작성합니다.', '예산이나 인력 요청 전; 스폰서가 "왜 지금인가?"라고 물을 때; 개발, 구매, 현상 유지를 비교할 때.'],
      fr: ['Construire un business case', 'Rédige un business case avec options, coûts, bénéfices, risques et une recommandation que le sponsor peut approuver.', 'Avant de demander un budget ou une équipe ; quand le sponsor demande « pourquoi maintenant ? » ; pour comparer développer, acheter ou ne rien faire.'],
    },
  },
  {
    id: 'P-A08', phase: 'discover', step: 8, cat: 'A', sub: 'Opportunity assessment and prioritization', roles: ['PO'],
    title: 'Assess and prioritise opportunities',
    desc: 'Scores a list of opportunities on value, effort, confidence and strategic fit, and recommends which to pursue first.',
    when: ['More ideas than capacity', 'Quarterly or annual planning', 'When the loudest stakeholder is setting priorities'],
    prepare: 'The list of opportunities (one line each), the product goal or strategy, rough effort sizes if known',
    ph: [['Opportunities', 'One per line', '1. Mobile loan application 2. Instant ID check 3. SMS status updates'],
      ['Product Goal', 'The goal they should serve', 'Cut loan decision time to 2 days'],
      ['Capacity', 'Team and time available', 'One team of 6 for 2 quarters']],
    body: `Act as a product owner running an opportunity review.

Opportunities:
[Opportunities]
Product goal: [Product Goal]
Team capacity: [Capacity]

1. Score each opportunity with RICE: Reach (people per quarter), Impact (0.25–3), Confidence (%), Effort (person-months). Show the score.
2. Note how well each one fits the product goal (high / medium / low).
3. Place each on a value–effort 2×2: quick win, big bet, fill-in, money pit.
4. Recommend a ranked shortlist that fits the capacity, and say what you would drop and why.

Rules: when you estimate a number, label it as an estimate and explain the reasoning in a few words; low confidence must lower the score.
Output: a table Opportunity | Reach | Impact | Confidence | Effort | RICE | Goal fit | Quadrant, then the shortlist.`,
    output: 'A scoring table (RICE with confidence), a 2×2 placement (quick wins, big bets, fill-ins, money pits), and a ranked shortlist that fits the capacity.',
    next: ['P-B02', 'P-E07'], tags: ['RICE', 'prioritisation', 'opportunity'],
    tr: {
      vi: ['Đánh giá và ưu tiên cơ hội', 'Chấm điểm các cơ hội theo giá trị, công sức, độ tin cậy và mức phù hợp chiến lược, đề xuất việc nên làm trước.', 'Ý tưởng nhiều hơn năng lực; khi lập kế hoạch quý hay năm; khi ưu tiên bị quyết định bởi người nói to nhất.'],
      ko: ['기회 평가 및 우선순위 결정', '기회를 가치, 노력, 확신도, 전략 적합성으로 채점하고 먼저 추진할 것을 추천합니다.', '아이디어가 역량보다 많을 때; 분기·연간 계획 시; 목소리 큰 사람이 우선순위를 정할 때.'],
      fr: ['Évaluer et prioriser les opportunités', "Note chaque opportunité sur la valeur, l'effort, la confiance et l'alignement stratégique, et recommande lesquelles lancer d'abord.", 'Plus d’idées que de capacité ; planification trimestrielle ou annuelle ; quand la voix la plus forte fixe les priorités.'],
    },
  },
];
