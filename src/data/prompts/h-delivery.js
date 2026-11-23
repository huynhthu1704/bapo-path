// H. Product Delivery and Continuous Improvement
export default [
  {
    id: 'P-H01', phase: 'release', step: 6, cat: 'H', sub: 'Release planning and readiness assessment', roles: ['PM', 'PO'],
    title: 'Assess release readiness',
    desc: 'Checks readiness across product, quality, operations, people and compliance, and prepares the go / no-go decision.',
    when: ['A week before go-live', 'Before the go / no-go meeting', 'After a release slipped or failed before'],
    prepare: 'Test summary, open defects, deployment plan, support and training status, approvals',
    ph: [['Release', 'Release name and date', 'QuickLoan R1, planned go-live 10 Feb 2027'],
      ['Status Notes', 'What you know about readiness', 'UAT signed off with 2 major defects; runbook drafted; branch training 70% done; Compliance approval pending']],
    body: `Act as a release manager.

Release: [Release]
Status notes: [Status Notes]

1. Assess readiness in six areas: product scope, quality, technical deployment, operations and support, people (training, communication), compliance and approvals. Rate each Ready / At risk / Not ready with evidence.
2. List the open items that must close before go-live, with owners and dates.
3. Define the rollback trigger and plan in one paragraph.
4. Recommend go, go with conditions, or no-go, and draft the agenda for the go / no-go meeting.

Output: a readiness table, open items, rollback summary, recommendation and agenda.`,
    output: 'A readiness table across 6 areas with evidence, open items with owners, a rollback summary, a recommendation and a go / no-go meeting agenda.',
    next: ['P-H02', 'P-F05'], tags: ['release readiness', 'go no-go', 'release management'],
    tr: {
      vi: ['Đánh giá mức sẵn sàng phát hành', 'Kiểm tra mức sẵn sàng về sản phẩm, chất lượng, vận hành, con người và tuân thủ, chuẩn bị quyết định go / no-go.', 'Một tuần trước go-live; trước họp go / no-go; sau một lần phát hành từng trễ hay thất bại.'],
      ko: ['릴리스 준비도 평가하기', '제품, 품질, 운영, 사람, 규정 준수 측면의 준비도를 점검하고 go / no-go 결정을 준비합니다.', 'go-live 일주일 전; go / no-go 회의 전; 이전 릴리스가 지연되거나 실패한 후.'],
      fr: ['Évaluer la préparation à la mise en production', 'Vérifie la préparation (produit, qualité, exploitation, personnes, conformité) et prépare la décision go / no-go.', 'Une semaine avant la mise en production ; avant la réunion go / no-go ; après une release ratée ou retardée.'],
    },
  },
  {
    id: 'P-H02', phase: 'release', step: 7, cat: 'H', sub: 'Go-live checklist preparation', roles: ['PM', 'BA'],
    title: 'Build the go-live checklist',
    desc: 'Creates a time-ordered go-live checklist for before, during and after deployment, with owners and a rollback path.',
    when: ['Preparing a production release', 'First release of a new product', 'A cut-over with data migration'],
    prepare: 'Deployment steps, teams involved, data migration, communication plan, support model',
    ph: [['Release', 'What goes live and when', 'QuickLoan R1, Saturday 10 Feb 2027, 22:00–02:00'],
      ['Teams', 'Teams and their parts', 'Mobile team, Core banking, Ops, Vendor, Customer service, Branch network'],
      ['Special Steps', 'Migration, freezes, approvals', 'Migrate 3,200 draft paper applications; CAB approval; app store review']],
    body: `Act as a release manager preparing a cut-over.

Release: [Release]
Teams: [Teams]
Special steps: [Special Steps]

Build a go-live checklist in time order:
1. T-14 to T-1 days: approvals, freeze, communication, training, data preparation, store submissions.
2. Go-live window: each step with start time, owner, duration, verification check.
3. Go / no-go checkpoints during the window and the rollback decision point.
4. Smoke tests after deployment.
5. Hypercare: first 72 hours — monitoring, support rota, daily check-in, success signals.

Output: a checklist table (When | Step | Owner | Check | Done?), then the rollback plan and hypercare plan.`,
    output: 'A time-ordered go-live checklist with owners and checks, go / no-go checkpoints, smoke tests, a rollback plan and a 72-hour hypercare plan.',
    next: ['P-H03', 'P-H06'], tags: ['go-live', 'cut-over', 'checklist', 'hypercare'],
    tr: {
      vi: ['Lập checklist go-live', 'Tạo checklist go-live theo thời gian cho trước, trong và sau triển khai, có người phụ trách và phương án rollback.', 'Khi chuẩn bị phát hành lên production; lần phát hành đầu của sản phẩm mới; khi chuyển đổi có di chuyển dữ liệu.'],
      ko: ['go-live 체크리스트 만들기', '배포 전, 중, 후를 시간 순서로 담고 담당자와 롤백 경로가 있는 go-live 체크리스트를 만듭니다.', '운영 릴리스 준비 시; 새 제품의 첫 릴리스; 데이터 이관이 있는 전환 시.'],
      fr: ['Construire la checklist de mise en production', 'Crée une checklist chronologique avant, pendant et après le déploiement, avec responsables et plan de retour arrière.', 'Pour préparer une mise en production ; première release d’un nouveau produit ; bascule avec migration de données.'],
    },
  },
  {
    id: 'P-H03', phase: 'release', step: 8, cat: 'H', sub: 'Production issue analysis', roles: ['BA', 'PM', 'PO'],
    title: 'Analyse a production issue',
    desc: 'Structures a production incident: impact, timeline, likely causes, workaround, communication and a blameless follow-up.',
    when: ['An incident during hypercare', 'Users report a serious problem', 'Preparing a post-incident review'],
    prepare: 'What users see, when it started, error messages or logs, who is affected, actions taken so far',
    ph: [['Symptoms', 'What users see and when', 'Since 09:10, 30% of customers cannot submit applications; error "Service unavailable"'],
      ['Context', 'Recent changes and facts', 'Release R1.1 deployed at 08:30; e-KYC vendor reported slowness at 09:00'],
      ['Actions So Far', 'What has been done', 'Restarted API pods 09:40, no change']],
    body: `Act as an incident lead with business analysis skills.

Symptoms: [Symptoms]
Context: [Context]
Actions so far: [Actions So Far]

1. Impact: who is affected, how many, business impact per hour, severity level.
2. Timeline of events so far.
3. Likely causes ranked, with the evidence for and against each and the next check to confirm.
4. Workaround options for users and the business.
5. A status message for users or stakeholders now, and when the next update will be.
6. After resolution: an outline for a blameless post-incident review and preventive actions.

Output: headed sections; causes as a table.`,
    output: 'Impact and severity, a timeline, ranked likely causes with checks, workarounds, a stakeholder status message, and a blameless post-incident review outline.',
    next: ['P-D08', 'P-H09'], tags: ['incident', 'production issue', 'post-mortem', 'hypercare'],
    tr: {
      vi: ['Phân tích sự cố production', 'Cấu trúc hóa sự cố production: tác động, dòng thời gian, nguyên nhân có thể, cách tạm khắc phục, truyền thông và rà soát không đổ lỗi.', 'Khi có sự cố trong giai đoạn hypercare; khi người dùng báo lỗi nghiêm trọng; khi chuẩn bị họp rút kinh nghiệm sau sự cố.'],
      ko: ['운영 장애 분석하기', '운영 장애의 영향, 타임라인, 가능한 원인, 임시 해결책, 커뮤니케이션, 비난 없는 후속 검토를 구조화합니다.', '하이퍼케어 중 장애 발생 시; 사용자가 심각한 문제를 보고할 때; 장애 후 검토 준비 시.'],
      fr: ['Analyser un incident de production', 'Structure un incident : impact, chronologie, causes probables, contournement, communication et revue sans reproche.', 'Incident pendant l’hypercare ; quand les utilisateurs signalent un problème grave ; pour préparer une revue post-incident.'],
    },
  },
  {
    id: 'P-H04', phase: 'monitor', step: 3, cat: 'H', sub: 'User feedback analysis', roles: ['PO', 'PM'],
    title: 'Analyse user feedback into themes',
    desc: 'Groups raw feedback into themes ranked by frequency and impact, with next actions.',
    when: ['After launch or a survey', 'App store reviews pile up', 'Before backlog planning'],
    prepare: 'Raw feedback (reviews, tickets, survey answers) with the source and date if you have them',
    ph: [['Feedback', 'Paste the raw feedback', '"Upload keeps failing" / "Took 5 min, great" / "Why do I need income proof again?" / "Can\'t find my draft"'],
      ['Product Context', 'What the product does', 'Mobile loan application, live for 6 weeks']],
    body: `Act as a product owner synthesising user feedback.

Product: [Product Context]
Feedback: [Feedback]

1. Group the feedback into 5–8 themes. Name each theme as a user need or problem, not a feature.
2. For each theme: number of mentions, sentiment, 1–2 representative quotes (short), and the likely impact on the product goal.
3. Rank themes by frequency × impact.
4. For the top 3, suggest the next action: fix, investigate, design an experiment, or communicate.
5. Note what the feedback cannot tell us (sample bias) and what data to check next.

Output: a theme table sorted by rank, then Next actions and Limits.`,
    output: 'Themes with counts, sentiment, short quotes and impact, ranked; next actions for the top 3; and the limits of the data.',
    next: ['P-H05', 'P-H10'], tags: ['user feedback', 'themes', 'voice of customer', 'synthesis'],
    tr: {
      vi: ['Phân tích phản hồi người dùng theo chủ đề', 'Nhóm phản hồi thô thành các chủ đề, xếp hạng theo tần suất và tác động, kèm hành động tiếp theo.', 'Sau khi ra mắt hay khảo sát; khi đánh giá trên app store tăng nhiều; trước khi lập kế hoạch backlog.'],
      ko: ['사용자 피드백을 주제별로 분석하기', '원본 피드백을 빈도와 영향에 따라 순위가 매겨진 주제로 묶고 다음 행동을 제시합니다.', '출시나 설문 후; 앱스토어 리뷰가 쌓일 때; 백로그 계획 전.'],
      fr: ['Analyser les retours utilisateurs par thèmes', 'Regroupe les retours bruts en thèmes classés par fréquence et impact, avec les actions suivantes.', 'Après un lancement ou une enquête ; quand les avis s’accumulent ; avant la planification du backlog.'],
    },
  },
  {
    id: 'P-H05', phase: 'monitor', step: 4, cat: 'H', sub: 'Product performance evaluation', roles: ['PO', 'PM'],
    title: 'Evaluate product performance',
    desc: 'Compares the product\'s results with its objectives and recommends whether to scale, iterate or roll back.',
    when: ['30, 60 or 90 days after launch', 'Quarterly business review', 'When leadership asks "did it work?"'],
    prepare: 'Objectives and targets, current metric values and trends, costs, feedback themes',
    ph: [['Objectives', 'Objectives with targets', 'Decision in 2 days for 40% of applications; mobile share 40%'],
      ['Results', 'Current values and trend', 'Decision in 2 days for 28% (rising 3 pts/week); mobile share 46%; drop-off at upload 22%'],
      ['Costs And Feedback', 'Costs, incidents, feedback', 'On budget; 2 incidents; top complaint: upload failures']],
    body: `Act as a product owner reviewing outcomes with leadership.

Objectives: [Objectives]
Results: [Results]
Costs and feedback: [Costs And Feedback]

1. Compare each objective with its target: met, on track, off track — with numbers and trend.
2. Explain the main drivers behind the results, separating evidence from interpretation.
3. Note side effects (good or bad) and guardrail metrics.
4. Recommend: scale, iterate (what to change), or roll back — with reasons.
5. Propose the next 3 actions and how we will measure them.

Output: a scorecard table, Drivers, Side effects, Recommendation, Next actions.`,
    output: 'An objective-vs-target scorecard with trends, drivers, side effects, a scale / iterate / roll back recommendation and the next 3 measured actions.',
    next: ['P-H10', 'P-H07'], tags: ['product performance', 'outcomes', 'review', 'scale iterate'],
    tr: {
      vi: ['Đánh giá hiệu quả sản phẩm', 'So sánh kết quả sản phẩm với mục tiêu và đề xuất mở rộng, cải tiến hay quay lui.', '30, 60 hay 90 ngày sau ra mắt; trong họp đánh giá kinh doanh quý; khi lãnh đạo hỏi "có hiệu quả không?".'],
      ko: ['제품 성과 평가하기', '제품 결과를 목표와 비교하고 확대, 반복 개선, 롤백 중 무엇을 할지 권고합니다.', '출시 후 30·60·90일; 분기 비즈니스 리뷰; 경영진이 "효과가 있었나?"를 물을 때.'],
      fr: ['Évaluer la performance du produit', 'Compare les résultats du produit à ses objectifs et recommande d’étendre, d’itérer ou de revenir en arrière.', '30, 60 ou 90 jours après le lancement ; revue trimestrielle ; quand la direction demande « est-ce que ça marche ? ».'],
    },
  },
  {
    id: 'P-H06', phase: 'monitor', step: 1, cat: 'H', sub: 'Feature adoption analysis', roles: ['PO'],
    title: 'Analyse feature adoption',
    desc: 'Builds an adoption funnel for a feature, finds where users drop off and suggests experiments to improve it.',
    when: ['A new feature has been live for 2–4 weeks', 'Usage is lower than expected', 'Deciding whether to invest more in a feature'],
    prepare: 'Feature usage numbers by step (exposed, tried, completed, repeated), user segments',
    ph: [['Feature', 'Feature and its purpose', 'Save draft — let customers finish applications later'],
      ['Funnel Data', 'Numbers per step', 'Saw save button 10,000; saved a draft 2,100; came back 900; completed 600'],
      ['Segments', 'Segments if known (optional)', 'Android vs iOS; new vs existing customers']],
    body: `Act as a product analyst.

Feature: [Feature]
Funnel data: [Funnel Data]
Segments: [Segments]

1. Build the adoption funnel: exposed → tried → activated → retained, with conversion between each step.
2. Identify the biggest drop-off and 3 hypotheses for it (discoverability, value, usability, timing).
3. Compare segments if data allows and note differences.
4. Propose 2–3 experiments (A/B test, copy change, nudge, onboarding) with the metric and expected effect.
5. Say what extra tracking is needed.

Output: a funnel table with conversion rates (show the calculation), Hypotheses, Segment notes, Experiments, Tracking gaps.`,
    output: 'A funnel table with step conversion rates, the biggest drop-off with hypotheses, segment differences, 2–3 experiments and tracking gaps.',
    next: ['P-H07', 'P-H04'], tags: ['adoption', 'funnel', 'experiments', 'analytics'],
    tr: {
      vi: ['Phân tích mức độ sử dụng tính năng', 'Xây phễu sử dụng tính năng, tìm điểm người dùng rời bỏ và gợi ý thử nghiệm để cải thiện.', 'Khi tính năng mới chạy được 2–4 tuần; khi mức sử dụng thấp hơn kỳ vọng; khi quyết định có đầu tư thêm hay không.'],
      ko: ['기능 사용률 분석하기', '기능의 사용 퍼널을 만들고 이탈 지점을 찾아 개선 실험을 제안합니다.', '새 기능 출시 2~4주 후; 사용률이 기대보다 낮을 때; 추가 투자 여부를 정할 때.'],
      fr: ['Analyser l’adoption d’une fonctionnalité', 'Construit l’entonnoir d’adoption d’une fonctionnalité, repère les abandons et propose des expériences pour l’améliorer.', 'Quand une fonctionnalité est en ligne depuis 2 à 4 semaines ; quand l’usage est inférieur aux attentes ; pour décider d’investir davantage.'],
    },
  },
  {
    id: 'P-H07', phase: 'monitor', step: 2, cat: 'H', sub: 'Product KPI monitoring', roles: ['PO', 'PM'],
    title: 'Set up product KPI monitoring',
    desc: 'Designs a KPI tree, a simple dashboard and alert thresholds so the team notices changes early.',
    when: ['Right after launch', 'Metrics are spread across tools', 'Problems are noticed too late'],
    prepare: 'Business objectives, available data sources, who needs to see what',
    ph: [['Objectives', 'Business objectives', 'Faster loan decisions; more applications through mobile; fewer incomplete applications'],
      ['Data Sources', 'Where data lives', 'Product analytics, loan system database, call-centre tickets']],
    body: `Act as a product owner setting up monitoring.

Objectives: [Objectives]
Data sources: [Data Sources]

1. Build a KPI tree: north-star metric → driver metrics → leading indicators.
2. For each metric: definition (formula), source, frequency, owner, target, and alert threshold (e.g. drop over 15% week on week).
3. Design a one-page dashboard: what goes at the top, which charts, which filters.
4. Define the review routine: daily check, weekly review, monthly deep dive — who attends and what they decide.
5. List tracking events still missing.

Output: the KPI tree as an indented list, a metrics table, the dashboard layout, the review routine and missing events.`,
    output: 'A KPI tree, a metrics table with formulas, sources, targets and alert thresholds, a dashboard layout, a review routine and missing tracking events.',
    next: ['P-H05', 'P-H06'], tags: ['KPI', 'dashboard', 'monitoring', 'north star metric'],
    tr: {
      vi: ['Thiết lập theo dõi KPI sản phẩm', 'Thiết kế cây KPI, dashboard đơn giản và ngưỡng cảnh báo để nhóm sớm nhận ra thay đổi.', 'Ngay sau ra mắt; khi số liệu nằm rải rác nhiều công cụ; khi vấn đề được phát hiện quá muộn.'],
      ko: ['제품 KPI 모니터링 구성하기', 'KPI 트리, 간단한 대시보드, 알림 기준을 설계해 팀이 변화를 일찍 알아차리게 합니다.', '출시 직후; 지표가 여러 도구에 흩어져 있을 때; 문제를 너무 늦게 알아차릴 때.'],
      fr: ['Mettre en place le suivi des KPI produit', 'Conçoit un arbre de KPI, un tableau de bord simple et des seuils d’alerte pour que l’équipe voie les changements tôt.', 'Juste après le lancement ; quand les métriques sont éparpillées ; quand les problèmes sont repérés trop tard.'],
    },
  },
  {
    id: 'P-H08', phase: 'monitor', step: 5, cat: 'H', sub: 'Process optimization', roles: ['BA', 'PM'],
    title: 'Optimise a business process',
    desc: 'Finds bottlenecks and waste in a live process using Lean ideas, and proposes improvements with expected gains.',
    when: ['A process is slow or costly after go-live', 'Operations teams ask for help', 'Continuous improvement cycles'],
    prepare: 'Process steps with times and volumes, error or rework rates, constraints',
    ph: [['Process Data', 'Steps, times, volumes', 'Review queue: wait 1.5 days; analyst review 25 min; risk check 2 days for loans above 500m; 18% sent back for documents'],
      ['Goal', 'Target', 'Decision in 2 days for 60% of applications']],
    body: `Act as a Lean process improvement specialist.

Process data: [Process Data]
Goal: [Goal]

1. Calculate lead time, touch time and flow efficiency; show the maths.
2. Identify the bottleneck and the main types of waste (waiting, rework, motion, over-processing, hand-offs).
3. Propose 5–8 improvements (eliminate, simplify, automate, parallelise, standardise) with expected gain and effort.
4. Recommend a first experiment and how to measure it for 2 weeks.

Output: a metrics summary, a waste table, an improvement table (Improvement | Gain | Effort | Owner), then the first experiment.`,
    output: 'Lead time, touch time and flow efficiency with the maths, bottleneck and waste, prioritised improvements with gain and effort, and a first experiment.',
    next: ['P-H09', 'P-D05'], tags: ['Lean', 'process improvement', 'bottleneck', 'waste'],
    tr: {
      vi: ['Tối ưu quy trình nghiệp vụ', 'Tìm điểm nghẽn và lãng phí trong quy trình đang vận hành bằng tư duy Lean, đề xuất cải tiến kèm lợi ích kỳ vọng.', 'Khi quy trình chậm hay tốn kém sau go-live; khi đội vận hành cần hỗ trợ; trong các chu kỳ cải tiến liên tục.'],
      ko: ['비즈니스 프로세스 최적화하기', '린 관점으로 운영 중인 프로세스의 병목과 낭비를 찾고 기대 효과와 함께 개선안을 제안합니다.', 'go-live 후 프로세스가 느리거나 비쌀 때; 운영팀이 도움을 요청할 때; 지속적 개선 주기.'],
      fr: ['Optimiser un processus métier', 'Repère goulets et gaspillages d’un processus en service avec une approche Lean, et propose des améliorations chiffrées.', 'Quand un processus est lent ou coûteux après la mise en service ; quand les équipes opérationnelles demandent de l’aide ; en amélioration continue.'],
    },
  },
  {
    id: 'P-H09', phase: 'monitor', step: 6, cat: 'H', sub: 'Retrospective insights', roles: ['PO', 'PM'],
    title: 'Turn retrospectives into insights',
    desc: 'Analyses notes from several retrospectives to find recurring themes, actions that never get done, and systemic fixes.',
    when: ['Every quarter', 'The same problems come up in every retro', 'Preparing a release or project closure review'],
    prepare: 'Notes or boards from the last 3–6 retrospectives, with their actions and status',
    ph: [['Retro Notes', 'Notes from several retros', 'S8: late requirement changes, flaky tests; S9: late changes again, good pairing; S10: unclear priorities, flaky tests'],
      ['Actions Status', 'Past actions and status', 'Refine 2 days earlier — not done; fix flaky tests — partly; weekly PO office hours — done']],
    body: `Act as an agile coach analysing a team's retrospectives.

Retro notes: [Retro Notes]
Action status: [Actions Status]

1. Find recurring themes and count how many retros mention each.
2. Separate symptoms from likely systemic causes (process, structure, tooling, stakeholders).
3. Review the actions: completion rate and why actions fail (too big, no owner, outside team control).
4. Propose 2–3 systemic improvements, including any that need management support, with an owner and a measure.
5. Highlight what is working well and should be protected.

Output: a theme table, a causes list, action review, systemic improvements, and strengths.`,
    output: 'Recurring themes with counts, systemic causes, an action completion review, 2–3 systemic improvements with owners and measures, and strengths to protect.',
    next: ['P-F03', 'P-H08'], tags: ['retrospective', 'insights', 'continuous improvement', 'team health'],
    tr: {
      vi: ['Rút ra insight từ các buổi retrospective', 'Phân tích ghi chú nhiều buổi retro để tìm chủ đề lặp lại, hành động không bao giờ hoàn thành và giải pháp mang tính hệ thống.', 'Mỗi quý; khi cùng một vấn đề xuất hiện ở mọi buổi retro; khi chuẩn bị tổng kết đợt phát hành hay dự án.'],
      ko: ['회고에서 인사이트 도출하기', '여러 회고 메모를 분석해 반복 주제, 끝내 실행되지 않는 행동, 구조적 개선책을 찾습니다.', '매 분기; 모든 회고에 같은 문제가 나올 때; 릴리스나 프로젝트 종료 검토 준비 시.'],
      fr: ['Tirer des enseignements des rétrospectives', 'Analyse les notes de plusieurs rétros pour trouver les thèmes récurrents, les actions jamais réalisées et des solutions systémiques.', 'Chaque trimestre ; quand les mêmes problèmes reviennent à chaque rétro ; pour préparer une revue de fin de release ou de projet.'],
    },
  },
  {
    id: 'P-H10', phase: 'monitor', step: 7, cat: 'H', sub: 'Product enhancement recommendations', roles: ['PO'],
    title: 'Recommend product enhancements',
    desc: 'Combines metrics, feedback and business goals into a ranked list of enhancement recommendations for the next cycle.',
    when: ['Planning the next release or quarter', 'After a performance review', 'Stakeholders send many unconnected requests'],
    prepare: 'Metrics and trends, feedback themes, stakeholder requests, strategy and goals',
    ph: [['Evidence', 'Metrics, feedback themes, requests', '22% drop-off at upload; top complaint upload failures; Sales asks for co-applicant; Risk asks for bank statement parsing'],
      ['Goals', 'Next-cycle goals', 'Decision in 2 days for 60%; reduce incomplete applications to 10%']],
    body: `Act as a product owner preparing the next-cycle recommendations.

Evidence: [Evidence]
Goals: [Goals]

1. Turn the evidence into 6–10 enhancement candidates, each written as the problem it solves and the outcome expected.
2. Link each to the evidence and the goal it serves.
3. Score each on impact, confidence and effort, and rank them.
4. Recommend the top 3 with a success metric each, and say what you would not do and why.
5. Suggest how to validate the riskiest recommendation before building it.

Output: a candidate table (Candidate | Evidence | Goal | Impact | Confidence | Effort | Rank), then Recommendations, Not doing, Validation plan.`,
    output: 'A ranked table of evidence-based enhancement candidates, the top 3 with success metrics, what not to do, and a validation plan.',
    next: ['P-E07', 'P-B02'], tags: ['enhancements', 'roadmap', 'prioritisation', 'evidence'],
    tr: {
      vi: ['Đề xuất cải tiến sản phẩm', 'Kết hợp số liệu, phản hồi và mục tiêu kinh doanh thành danh sách đề xuất cải tiến được xếp hạng cho chu kỳ tới.', 'Khi lập kế hoạch đợt phát hành hay quý tới; sau buổi đánh giá hiệu quả; khi các bên gửi nhiều yêu cầu rời rạc.'],
      ko: ['제품 개선 사항 권고하기', '지표, 피드백, 비즈니스 목표를 종합해 다음 주기의 개선 권고 목록을 순위별로 만듭니다.', '다음 릴리스나 분기 계획 시; 성과 검토 후; 이해관계자 요청이 제각각 쏟아질 때.'],
      fr: ['Recommander des améliorations produit', 'Combine métriques, retours et objectifs métier en une liste classée d’améliorations pour le prochain cycle.', 'Pour planifier la prochaine release ou le prochain trimestre ; après une revue de performance ; quand les demandes arrivent en ordre dispersé.'],
    },
  },
];
