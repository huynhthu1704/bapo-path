// G. Quality Assurance and Testing
export default [
  {
    id: 'P-G01', phase: 'build', step: 17, cat: 'G', sub: 'Test strategy and test plan creation', roles: ['BA', 'PM'],
    title: 'Write a test strategy and test plan',
    desc: 'Drafts a test strategy and plan: scope, levels and types, environments, data, roles, entry and exit criteria, and risks.',
    when: ['Start of a release or project', 'Before UAT is organised', 'An audit or vendor asks for a test plan'],
    prepare: 'Scope and requirements, risk areas, environments, team and dates',
    ph: [['Scope', 'What will be tested', 'Mobile loan application release 1: form, documents, e-KYC, back-office review'],
      ['Risk Areas', 'What worries you most', 'e-KYC integration, credit rules, performance at month end'],
      ['Team And Dates', 'Testers, environments, dates', '2 QA, BA for UAT; SIT 5–16 Jan, UAT 19–30 Jan']],
    body: `Act as a test manager (ISTQB-aware).

Scope: [Scope]
Risk areas: [Risk Areas]
Team and dates: [Team And Dates]

Write a concise test strategy and plan:
1. Objectives and scope (in / out).
2. Risk-based approach: rate product risks and how much testing each gets.
3. Test levels (unit, integration, system, SIT, UAT) and types (functional, regression, performance, security, accessibility) with owners.
4. Environments and test data, including how personal data is masked.
5. Entry and exit criteria for each level.
6. Defect management: severity definitions and the triage process.
7. Schedule, deliverables, risks and assumptions.

Output: numbered sections, with tables for risks, levels and criteria.`,
    output: 'A test strategy and plan in 7 sections: scope, risk-based approach, levels and types with owners, environments and data, entry/exit criteria, defect process, schedule and risks.',
    next: ['P-G02', 'P-G05'], tags: ['test strategy', 'test plan', 'ISTQB', 'risk-based testing'],
    tr: {
      vi: ['Viết chiến lược và kế hoạch kiểm thử', 'Soạn chiến lược và kế hoạch kiểm thử: phạm vi, cấp độ và loại test, môi trường, dữ liệu, vai trò, tiêu chí vào/ra và rủi ro.', 'Đầu đợt phát hành hay dự án; trước khi tổ chức UAT; khi kiểm toán hay nhà cung cấp yêu cầu kế hoạch test.'],
      ko: ['테스트 전략과 계획 작성하기', '범위, 테스트 수준과 유형, 환경, 데이터, 역할, 진입·종료 기준, 위험을 담은 테스트 전략과 계획을 작성합니다.', '릴리스나 프로젝트 시작 시; UAT 준비 전; 감사인이나 공급업체가 테스트 계획을 요구할 때.'],
      fr: ['Rédiger une stratégie et un plan de test', 'Rédige une stratégie et un plan de test : périmètre, niveaux et types, environnements, données, rôles, critères d’entrée et de sortie, risques.', 'Au début d’une release ou d’un projet ; avant d’organiser la recette ; quand un audit ou un fournisseur demande un plan de test.'],
    },
  },
  {
    id: 'P-G02', phase: 'build', step: 18, cat: 'G', sub: 'Test scenario and test case generation', roles: ['BA'],
    title: 'Generate test scenarios and test cases',
    desc: 'Turns requirements or user stories into test scenarios and step-by-step test cases with data and expected results.',
    when: ['Stories have acceptance criteria and need test cases', 'Preparing SIT or UAT', 'Testers join late and need a head start'],
    prepare: 'User stories or requirements with acceptance criteria, business rules',
    ph: [['Requirements', 'Stories or requirements with criteria', 'US-21 Save draft: save on any step; resume on any device; drafts expire after 30 days'],
      ['Rules', 'Related business rules', 'One draft per customer; documents kept with the draft']],
    body: `Act as a QA analyst writing test cases.

Requirements: [Requirements]
Rules: [Rules]

1. List test scenarios (what to test) for each requirement, covering positive, negative and edge cases. Give each an ID.
2. For the most important scenarios, write test cases: ID, title, preconditions, steps, test data, expected result, priority.
3. Map each test case to its requirement or acceptance criterion.
4. List test data that needs to be prepared.

Rules: one expected result per step where possible; use realistic data; do not test the same thing twice.
Output: a scenario table, a test case table, a coverage map and a test data list.`,
    output: 'Scenario list (positive, negative, edge), detailed test cases with steps, data and expected results, a coverage map and a test data list.',
    next: ['P-G03', 'P-G07'], tags: ['test cases', 'test scenarios', 'QA'],
    tr: {
      vi: ['Tạo kịch bản và test case', 'Biến yêu cầu hoặc user story thành kịch bản kiểm thử và test case từng bước, có dữ liệu và kết quả mong đợi.', 'Khi story đã có tiêu chí chấp nhận và cần test case; khi chuẩn bị SIT hay UAT; khi tester tham gia muộn.'],
      ko: ['테스트 시나리오와 테스트 케이스 생성하기', '요구사항이나 사용자 스토리를 데이터와 기대 결과가 있는 테스트 시나리오와 단계별 테스트 케이스로 바꿉니다.', '스토리에 인수 기준이 있고 테스트 케이스가 필요할 때; SIT나 UAT 준비 시; 테스터가 늦게 합류했을 때.'],
      fr: ['Générer scénarios et cas de test', 'Transforme exigences ou user stories en scénarios de test et cas de test pas à pas, avec données et résultats attendus.', 'Quand les stories ont des critères et qu’il faut des cas de test ; pour préparer l’intégration ou la recette ; quand les testeurs arrivent tard.'],
    },
  },
  {
    id: 'P-G03', phase: 'build', step: 19, cat: 'G', sub: 'Positive and negative test coverage', roles: ['BA'],
    title: 'Check positive and negative test coverage',
    desc: 'Reviews a set of test cases and adds the missing negative, error-handling and abuse cases.',
    when: ['Test cases cover only the happy path', 'Before a release review', 'After a production defect slipped through'],
    prepare: 'The existing test cases and the requirement they cover',
    ph: [['Feature', 'Feature under test', 'Document upload for loan applications'],
      ['Existing Tests', 'Current test cases', 'TC-40 upload 1 PDF; TC-41 upload 3 JPGs; TC-42 delete a file']],
    body: `Act as a QA lead who looks for what can go wrong.

Feature: [Feature]
Existing tests: [Existing Tests]

1. Classify the existing tests as positive or negative.
2. List missing negative cases: invalid input, missing data, wrong format, limits exceeded, unauthorised access, duplicates, interrupted actions, dependency failures.
3. Add security and abuse cases where relevant (very large files, malicious file names, repeated submissions).
4. Write the new test cases briefly: ID, scenario, data, expected result, priority.
5. Give a coverage summary: positive vs negative before and after.

Output: classification, a gap list, new test cases table, coverage summary.`,
    output: 'Existing tests classified, missing negative and abuse cases, new test cases with priority, and a before/after coverage summary.',
    next: ['P-G04', 'P-G08'], tags: ['negative testing', 'coverage', 'error handling'],
    tr: {
      vi: ['Kiểm tra độ bao phủ test tích cực và tiêu cực', 'Rà soát bộ test case và bổ sung các trường hợp tiêu cực, xử lý lỗi và lạm dụng còn thiếu.', 'Khi test case chỉ phủ luồng thuận; trước buổi review phát hành; sau khi lỗi lọt ra production.'],
      ko: ['긍정·부정 테스트 커버리지 점검하기', '테스트 케이스를 검토하고 빠진 부정, 오류 처리, 오용 사례를 추가합니다.', '테스트가 정상 흐름만 다룰 때; 릴리스 검토 전; 운영 결함이 빠져나간 후.'],
      fr: ['Vérifier la couverture des tests positifs et négatifs', 'Passe en revue un jeu de cas de test et ajoute les cas négatifs, de gestion d’erreur et d’abus manquants.', 'Quand les tests ne couvrent que le chemin nominal ; avant une revue de release ; après un défaut passé en production.'],
    },
  },
  {
    id: 'P-G04', phase: 'build', step: 20, cat: 'G', sub: 'Boundary value and equivalence partitioning', roles: ['BA'],
    title: 'Design tests with boundary values and equivalence partitions',
    desc: 'Applies equivalence partitioning and boundary value analysis to each input and produces the minimum set of test values.',
    when: ['Fields with ranges, limits or categories', 'Calculation and eligibility rules', 'Reducing a large test set without losing coverage'],
    prepare: 'Input fields and their rules (ranges, formats, categories)',
    ph: [['Inputs', 'Fields and their rules', 'Age 20–60; loan amount 10m–2,000m VND; term 6, 12, 24, 36 months; income at least 8m VND']],
    body: `Act as a test designer using ISTQB techniques.

Inputs and rules: [Inputs]

For each input:
1. Define equivalence partitions (valid and invalid).
2. Identify boundary values using 3-value boundary analysis (just below, on, just above each boundary).
3. Pick the minimum set of test values that covers every partition and boundary.
4. Note any rule that is ambiguous at the boundary (e.g. "up to" — inclusive or not?).

Then combine inputs into a small set of test cases where one invalid value is tested at a time.
Output: a table per input (partition, valid?, representative value, boundaries), the combined test cases, and the ambiguities to clarify.`,
    output: 'Per input: valid and invalid partitions, 3-value boundaries, minimal test values; combined test cases; boundary ambiguities to clarify.',
    next: ['P-G08', 'P-G02'], tags: ['boundary value analysis', 'equivalence partitioning', 'ISTQB', 'test design'],
    tr: {
      vi: ['Thiết kế test bằng giá trị biên và phân vùng tương đương', 'Áp dụng phân vùng tương đương và phân tích giá trị biên cho từng đầu vào, tạo bộ giá trị test tối thiểu.', 'Với trường có khoảng, giới hạn hay phân loại; với quy tắc tính toán và điều kiện; khi muốn giảm bộ test mà không mất độ bao phủ.'],
      ko: ['경계값과 동등 분할로 테스트 설계하기', '입력마다 동등 분할과 경계값 분석을 적용해 최소한의 테스트 값을 만듭니다.', '범위, 한도, 범주가 있는 필드; 계산·자격 규칙; 커버리지를 유지하며 테스트를 줄일 때.'],
      fr: ['Concevoir des tests par valeurs limites et partitions d’équivalence', 'Applique partitions d’équivalence et analyse des valeurs limites à chaque entrée et produit le jeu minimal de valeurs de test.', 'Champs avec plages, limites ou catégories ; règles de calcul ou d’éligibilité ; pour réduire un gros jeu de tests sans perdre en couverture.'],
    },
  },
  {
    id: 'P-G05', phase: 'release', step: 1, cat: 'G', sub: 'UAT preparation', roles: ['BA', 'PM'],
    title: 'Prepare a UAT plan and test scenarios',
    desc: 'Builds a UAT plan with scope, roles, schedule and business-readable test scenarios that real users can run.',
    when: ['2–3 weeks before UAT', 'Business users are new to testing', 'Sign-off criteria are not agreed'],
    prepare: 'Release scope, business processes affected, UAT testers and their availability, dates',
    ph: [['Release Scope', 'What is being released', 'Mobile loan application: apply, upload, e-KYC, track status; back-office review screen'],
      ['UAT Team', 'Business testers and availability', '3 branch officers, 2 credit analysts, 1 Risk reviewer; half days'],
      ['Dates', 'UAT window', '19–30 January 2027']],
    body: `Act as a business analyst organising user acceptance testing.

Release scope: [Release Scope]
UAT team: [UAT Team]
Dates: [Dates]

1. UAT objectives and scope (business processes, not screens), plus what is out of scope.
2. Roles: UAT lead, testers, defect triage, sign-off owner.
3. 10–15 end-to-end scenarios written in business language: goal, starting data, steps in plain words, expected business result. Assign each to a tester.
4. Schedule: kickoff, daily triage, retest window, sign-off meeting.
5. Entry criteria, exit and sign-off criteria (e.g. no open critical defects, 95% scenarios passed).
6. Tester briefing notes and a defect report template.

Output: the plan as headed sections, the scenarios as a table, and the templates.`,
    output: 'A UAT plan: objectives and scope, roles, 10–15 business-language end-to-end scenarios assigned to testers, schedule, entry/exit criteria, briefing notes and a defect template.',
    next: ['P-G06', 'P-G09'], tags: ['UAT', 'user acceptance testing', 'sign-off'],
    tr: {
      vi: ['Chuẩn bị kế hoạch UAT và kịch bản kiểm thử', 'Xây dựng kế hoạch UAT với phạm vi, vai trò, lịch và kịch bản bằng ngôn ngữ nghiệp vụ mà người dùng thật có thể thực hiện.', '2–3 tuần trước UAT; khi người dùng nghiệp vụ mới làm kiểm thử; khi chưa thống nhất tiêu chí ký duyệt.'],
      ko: ['UAT 계획과 테스트 시나리오 준비하기', '범위, 역할, 일정, 실제 사용자가 수행할 수 있는 업무 언어 시나리오를 담은 UAT 계획을 만듭니다.', 'UAT 2~3주 전; 현업 사용자가 테스트에 익숙하지 않을 때; 승인 기준이 합의되지 않았을 때.'],
      fr: ['Préparer le plan de recette (UAT) et les scénarios', 'Construit un plan de recette avec périmètre, rôles, calendrier et scénarios en langage métier que de vrais utilisateurs peuvent dérouler.', '2 à 3 semaines avant la recette ; quand les utilisateurs métier découvrent les tests ; quand les critères de validation ne sont pas définis.'],
    },
  },
  {
    id: 'P-G06', phase: 'release', step: 2, cat: 'G', sub: 'Defect analysis and classification', roles: ['BA', 'PM'],
    title: 'Triage and classify defects',
    desc: 'Classifies a list of defects by severity, priority, type and root area, spots patterns and proposes the fix order.',
    when: ['Daily during SIT or UAT', 'The defect list keeps growing', 'Before a go / no-go discussion'],
    prepare: 'Defect list (title, description, who found it), severity definitions if you have them',
    ph: [['Defects', 'Defect list', 'D-101 Upload fails above 5 MB; D-102 Typo on status screen; D-103 Wrong interest shown for 36 months; D-104 App crashes on Android 10 when returning from camera']],
    body: `Act as a test lead running defect triage.

Defects: [Defects]

1. For each defect: severity (critical, major, minor, trivial) based on business impact, priority (P1–P4), type (functional, data, UI, performance, security, integration), likely area, and whether it could be a requirement gap rather than a bug.
2. Spot patterns: clusters in one area, repeated root causes.
3. Propose a fix order and which defects block go-live.
4. Write clearer titles for defects that are vague.

Output: a triage table, Patterns, Fix order, Go-live blockers.`,
    output: 'A triage table (severity, priority, type, area, requirement gap?), patterns, a fix order and the go-live blockers.',
    next: ['P-G08', 'P-G09'], tags: ['defects', 'triage', 'severity', 'priority'],
    tr: {
      vi: ['Phân loại và xử lý lỗi (triage)', 'Phân loại danh sách lỗi theo mức nghiêm trọng, độ ưu tiên, loại và khu vực, tìm quy luật và đề xuất thứ tự sửa.', 'Hằng ngày trong SIT hay UAT; khi danh sách lỗi cứ tăng; trước buổi quyết định go / no-go.'],
      ko: ['결함 분류 및 트리아지하기', '결함을 심각도, 우선순위, 유형, 영역으로 분류하고 패턴을 찾아 수정 순서를 제안합니다.', 'SIT나 UAT 기간 매일; 결함 목록이 계속 늘 때; go / no-go 논의 전.'],
      fr: ['Trier et classer les défauts', 'Classe les défauts par sévérité, priorité, type et zone, repère les tendances et propose l’ordre de correction.', 'Chaque jour pendant l’intégration ou la recette ; quand la liste des défauts grossit ; avant une décision go / no-go.'],
    },
  },
  {
    id: 'P-G07', phase: 'release', step: 3, cat: 'G', sub: 'Requirement-to-test traceability', roles: ['BA'],
    title: 'Check requirement-to-test coverage',
    desc: 'Maps requirements to test cases and results, shows untested or failing requirements, and summarises readiness by feature.',
    when: ['Before UAT sign-off', 'An auditor asks for evidence', 'Scope changed late'],
    prepare: 'Requirement IDs and test case IDs with their latest results',
    ph: [['Requirements', 'Requirement IDs', 'FR-01…FR-12, NFR-01…NFR-05'],
      ['Test Results', 'Test cases, linked requirements and results', 'TC-30 FR-01 pass; TC-31 FR-01 pass; TC-40 FR-03 fail (D-101); TC-50 NFR-02 not run']],
    body: `Act as a QA analyst preparing coverage evidence.

Requirements: [Requirements]
Test cases and results: [Test Results]

1. Build a matrix: requirement → test cases → latest result → open defects.
2. Mark each requirement as covered and passed, covered with failures, not run, or not covered.
3. Summarise readiness by feature and by priority (Must requirements first).
4. List the actions needed to close the gaps before sign-off.

Output: the matrix table, a summary table, then Actions.`,
    output: 'A requirement → test → result → defect matrix, coverage status per requirement, readiness by feature and priority, and actions before sign-off.',
    next: ['P-G09', 'P-H01'], tags: ['traceability', 'coverage', 'test evidence'],
    tr: {
      vi: ['Kiểm tra độ bao phủ từ yêu cầu đến test', 'Liên kết yêu cầu với test case và kết quả, chỉ ra yêu cầu chưa test hoặc đang lỗi, tổng hợp mức sẵn sàng theo tính năng.', 'Trước khi ký duyệt UAT; khi kiểm toán yêu cầu bằng chứng; khi phạm vi thay đổi muộn.'],
      ko: ['요구사항–테스트 커버리지 점검하기', '요구사항을 테스트 케이스와 결과에 매핑해 미시험·실패 요구사항을 보여주고 기능별 준비도를 요약합니다.', 'UAT 승인 전; 감사인이 증거를 요청할 때; 범위가 늦게 바뀌었을 때.'],
      fr: ['Vérifier la couverture exigences–tests', 'Relie exigences, cas de test et résultats, montre les exigences non testées ou en échec, et résume l’état par fonctionnalité.', 'Avant la validation de recette ; quand un auditeur demande des preuves ; quand le périmètre a changé tard.'],
    },
  },
  {
    id: 'P-G08', phase: 'release', step: 4, cat: 'G', sub: 'Regression testing scope identification', roles: ['BA', 'PM'],
    title: 'Define the regression testing scope',
    desc: 'Decides what to re-test after a change, based on impact and risk, so regression is thorough but not endless.',
    when: ['Before every release', 'After a hotfix', 'When full regression takes too long'],
    prepare: 'What changed, the areas and integrations affected, the existing regression suite',
    ph: [['Changes', 'What changed in this release', 'New save-draft feature; fix to interest calculation; upgraded document library'],
      ['Regression Suite', 'Existing suite (optional)', '220 manual cases, 80 automated; full run takes 4 days']],
    body: `Act as a test lead planning regression.

Changes: [Changes]
Existing regression suite: [Regression Suite]

1. For each change, list the directly and indirectly affected areas (shared components, data, integrations, reports).
2. Rate each area's regression risk (high / medium / low) by impact and likelihood.
3. Propose the regression scope: must-run, should-run, skip — with a reason.
4. Recommend which cases to automate next to save time in future releases.
5. Estimate the effort for the proposed scope.

Output: an impact table, a risk-rated scope table, automation candidates and the effort estimate.`,
    output: 'An impact table per change, a risk-rated regression scope (must / should / skip), automation candidates and an effort estimate.',
    next: ['P-G09', 'P-H01'], tags: ['regression', 'impact', 'risk-based testing', 'automation'],
    tr: {
      vi: ['Xác định phạm vi kiểm thử hồi quy', 'Quyết định cần test lại gì sau thay đổi dựa trên tác động và rủi ro, để hồi quy kỹ mà không kéo dài vô tận.', 'Trước mỗi đợt phát hành; sau hotfix; khi hồi quy toàn bộ mất quá nhiều thời gian.'],
      ko: ['회귀 테스트 범위 정하기', '영향과 위험을 바탕으로 변경 후 다시 테스트할 범위를 정해 회귀 테스트를 충분하지만 끝없지 않게 합니다.', '매 릴리스 전; 핫픽스 후; 전체 회귀가 너무 오래 걸릴 때.'],
      fr: ['Définir le périmètre des tests de non-régression', 'Décide quoi retester après un changement selon l’impact et le risque, pour une non-régression complète sans être interminable.', 'Avant chaque release ; après un correctif urgent ; quand la non-régression complète prend trop de temps.'],
    },
  },
  {
    id: 'P-G09', phase: 'release', step: 5, cat: 'G', sub: 'Test result reporting', roles: ['BA', 'PM'],
    title: 'Write a test summary report',
    desc: 'Summarises test results for decision makers: what was tested, what passed, open defects, risks and a go / no-go recommendation.',
    when: ['End of SIT or UAT', 'Before the go / no-go meeting', 'Weekly during long test phases'],
    prepare: 'Test execution numbers, open defects by severity, coverage, known risks',
    ph: [['Results', 'Execution numbers', '182 cases run: 171 passed, 8 failed, 3 blocked; 12 not run'],
      ['Open Defects', 'Open defects by severity', '0 critical, 2 major (D-101, D-120), 6 minor'],
      ['Exit Criteria', 'Agreed exit criteria', 'No open critical; at most 3 major with workarounds; 95% Must scenarios passed']],
    body: `Act as a test manager reporting to the steering group.

Execution results: [Results]
Open defects: [Open Defects]
Exit criteria: [Exit Criteria]

Write a one-page test summary:
1. Overall verdict against each exit criterion (met / not met) with numbers.
2. Execution summary as a small table and pass rate.
3. Open defects that matter, with business impact and workaround.
4. Untested or partially tested areas and the risk they leave.
5. Recommendation: go, go with conditions (list them), or no-go.

Rules: business language; no blame; show the maths for percentages.`,
    output: 'A one-page test summary: verdict per exit criterion, execution table and pass rate, important open defects with workarounds, residual risks, and a go / conditional go / no-go recommendation.',
    next: ['P-H01', 'P-H02'], tags: ['test report', 'test summary', 'exit criteria', 'go no-go'],
    tr: {
      vi: ['Viết báo cáo tổng kết kiểm thử', 'Tóm tắt kết quả test cho người ra quyết định: đã test gì, đạt gì, lỗi còn mở, rủi ro và đề xuất go / no-go.', 'Cuối SIT hay UAT; trước buổi họp go / no-go; hằng tuần trong giai đoạn test dài.'],
      ko: ['테스트 요약 보고서 작성하기', '무엇을 테스트했고 무엇이 통과했는지, 미해결 결함, 위험, go / no-go 권고를 의사결정자에게 요약합니다.', 'SIT나 UAT 종료 시; go / no-go 회의 전; 긴 테스트 기간 중 매주.'],
      fr: ['Rédiger un rapport de synthèse des tests', 'Résume les résultats pour les décideurs : ce qui a été testé, ce qui passe, les défauts ouverts, les risques et une recommandation go / no-go.', 'En fin d’intégration ou de recette ; avant la réunion go / no-go ; chaque semaine pendant de longues phases de test.'],
    },
  },
];
