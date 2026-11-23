// F. Project and Team Management — useful in every phase
export default [
  {
    id: 'P-F01', phase: 'every', step: 1, cat: 'F', sub: 'Daily meeting preparation', roles: ['PO', 'PM', 'BA'],
    title: 'Prepare for the daily stand-up',
    desc: 'Turns your notes into a clear 60-second stand-up update focused on the sprint goal and blockers.',
    when: ['Every morning before the stand-up', 'When your updates run long', 'Speaking in a second language'],
    prepare: 'What you did yesterday, what you plan today, anything blocking you, the sprint goal',
    ph: [['Sprint Goal', 'Current sprint goal', 'Customers can save and resume a loan application'],
      ['My Notes', 'Your rough notes', 'finished AC for save draft, met Risk about expiry rule, waiting for API spec from core team, today refinement + UAT data']],
    body: `Act as a scrum master coaching me for the daily stand-up.

Sprint goal: [Sprint Goal]
My notes: [My Notes]

Turn my notes into a stand-up update I can say in under 60 seconds:
1. Progress toward the sprint goal (not a list of activities).
2. What I will do today.
3. Blockers or help needed — who I need and by when.

Also suggest one follow-up conversation to take offline after the stand-up.
Output: the spoken update as 3 short lines in simple English, then the offline follow-up.`,
    output: 'A 3-line spoken stand-up update tied to the sprint goal, with blockers and owners, plus one item to take offline.',
    next: ['P-F06', 'P-F07'], tags: ['stand-up', 'daily scrum', 'communication'],
    tr: {
      vi: ['Chuẩn bị cho daily stand-up', 'Biến ghi chú thành bản cập nhật stand-up 60 giây rõ ràng, tập trung vào mục tiêu sprint và trở ngại.', 'Mỗi sáng trước stand-up; khi phần cập nhật quá dài; khi nói bằng ngôn ngữ thứ hai.'],
      ko: ['데일리 스탠드업 준비하기', '메모를 스프린트 목표와 장애물에 집중한 60초 스탠드업 업데이트로 바꿉니다.', '매일 아침 스탠드업 전; 업데이트가 너무 길 때; 외국어로 말할 때.'],
      fr: ['Préparer le daily stand-up', 'Transforme vos notes en un point de 60 secondes centré sur l’objectif de sprint et les blocages.', 'Chaque matin avant le stand-up ; quand vos points sont trop longs ; quand vous parlez dans une langue étrangère.'],
    },
  },
  {
    id: 'P-F02', phase: 'every', step: 2, cat: 'F', sub: 'Sprint planning facilitation', roles: ['PO', 'PM'],
    title: 'Facilitate sprint planning',
    desc: 'Builds a sprint planning agenda with time boxes, questions to ask and a way to reach a sprint goal the team commits to.',
    when: ['Before sprint planning', 'When planning runs over time', 'New Scrum team'],
    prepare: 'Sprint length, proposed sprint goal and backlog, team size, known availability',
    ph: [['Sprint Info', 'Length, team and capacity', '2-week sprint, 6 people, about 20 points'],
      ['Proposed Goal', 'Draft sprint goal and top items', 'Customers can save and resume an application; items US-21, US-22, US-25']],
    body: `Act as an experienced scrum master.

Sprint info: [Sprint Info]
Proposed goal and items: [Proposed Goal]

Design the sprint planning session:
1. An agenda with time boxes (Why: the goal; What: selecting items; How: tasks and risks).
2. Questions to ask at each stage to surface risks and assumptions.
3. A quick confidence vote and what to do if confidence is low.
4. The outputs to record at the end.
5. Tips to keep it on time.

Output: the agenda as a table Time | Part | Purpose | Facilitator questions, then Outputs and Tips.`,
    output: 'A time-boxed sprint planning agenda with facilitator questions, a confidence check, outputs to record and tips to keep time.',
    next: ['P-F01', 'P-E11'], tags: ['sprint planning', 'facilitation', 'Scrum'],
    tr: {
      vi: ['Điều phối buổi sprint planning', 'Xây dựng agenda sprint planning có khung giờ, câu hỏi cần đặt và cách đi đến mục tiêu sprint được cả nhóm cam kết.', 'Trước sprint planning; khi buổi planning thường quá giờ; với nhóm Scrum mới.'],
      ko: ['스프린트 계획 회의 진행하기', '시간 배분, 질문, 팀이 약속하는 스프린트 목표 합의 방법이 담긴 스프린트 계획 아젠다를 만듭니다.', '스프린트 계획 전; 계획 회의가 시간을 넘길 때; 새 스크럼 팀.'],
      fr: ['Animer le sprint planning', 'Construit un ordre du jour minuté avec les questions à poser et une façon d’aboutir à un objectif de sprint auquel l’équipe s’engage.', 'Avant le sprint planning ; quand la séance déborde ; pour une nouvelle équipe Scrum.'],
    },
  },
  {
    id: 'P-F03', phase: 'every', step: 3, cat: 'F', sub: 'Retrospective facilitation', roles: ['PO', 'PM'],
    title: 'Facilitate a retrospective',
    desc: 'Designs a retrospective that fits the sprint\'s mood and ends with 1–3 concrete, owned improvement actions.',
    when: ['End of every sprint', 'Retros feel repetitive', 'After a difficult release or conflict'],
    prepare: 'What happened in the sprint, team mood, last retro\'s actions and whether they were done',
    ph: [['Sprint Summary', 'What happened', 'Goal partly met; two urgent production bugs; new developer joined; release delayed 2 days'],
      ['Team Mood', 'How the team feels', 'Tired, some frustration with late requirement changes'],
      ['Previous Actions', 'Last retro actions and status', 'Refine stories 2 days earlier — not done']],
    body: `Act as a scrum master designing a retrospective.

Sprint summary: [Sprint Summary]
Team mood: [Team Mood]
Previous actions: [Previous Actions]

1. Choose a retro format that suits the mood (e.g. Sailboat, Start-Stop-Continue, 4Ls, Mad-Sad-Glad) and say why.
2. Plan 60 minutes: set the stage, gather data, generate insights, decide what to do, close — with timings and prompts for each part.
3. Include a check on the previous actions.
4. Give guidance to keep it safe and blame-free.
5. Show how to turn insights into 1–3 SMART actions with owners.

Output: format and reason, the agenda table, facilitation tips, and an action template.`,
    output: 'A chosen retro format with reasons, a 60-minute agenda with prompts, safety tips and a template for 1–3 owned SMART actions.',
    next: ['P-H09', 'P-F06'], tags: ['retrospective', 'continuous improvement', 'facilitation'],
    tr: {
      vi: ['Điều phối buổi retrospective', 'Thiết kế buổi retro phù hợp tâm trạng của sprint và kết thúc bằng 1–3 hành động cải tiến cụ thể có người phụ trách.', 'Cuối mỗi sprint; khi retro lặp lại nhàm chán; sau một đợt phát hành khó khăn hay xung đột.'],
      ko: ['회고 진행하기', '스프린트 분위기에 맞는 회고를 설계하고 담당자가 있는 구체적인 개선 행동 1~3개로 마무리합니다.', '매 스프린트 종료 시; 회고가 반복적으로 느껴질 때; 힘든 릴리스나 갈등 후.'],
      fr: ['Animer une rétrospective', 'Conçoit une rétrospective adaptée à l’ambiance du sprint qui se termine par 1 à 3 actions d’amélioration concrètes et attribuées.', 'À la fin de chaque sprint ; quand les rétros deviennent répétitives ; après une release difficile ou un conflit.'],
    },
  },
  {
    id: 'P-F04', phase: 'every', step: 4, cat: 'F', sub: 'Meeting agenda and minutes generation', roles: ['BA', 'PO', 'PM'],
    title: 'Create a meeting agenda and minutes',
    desc: 'Writes a focused agenda before a meeting, or clean minutes with decisions and actions from your notes after it.',
    when: ['Before any meeting you organise', 'Right after a meeting, from rough notes', 'Meetings end without clear decisions'],
    prepare: 'Purpose, attendees, duration; or your rough notes after the meeting',
    ph: [['Meeting Purpose', 'Why the meeting exists', 'Agree the scope of release 1 with Lending and Risk'],
      ['Attendees And Time', 'Who and how long', 'Head of Lending, Risk manager, PO, BA, Tech lead — 60 minutes'],
      ['Notes', 'Rough notes after the meeting (optional)', 'e-sign out of R1, Risk ok if audit log in, Minh checks vendor date, next review 12 Dec']],
    body: `Act as an organised business analyst.

Purpose: [Meeting Purpose]
Attendees and time: [Attendees And Time]
Notes (if the meeting already happened): [Notes]

If there are no notes yet, write the agenda: objective, desired outcomes, topics with time boxes and owners, pre-reading, and decisions needed.
If there are notes, write the minutes: attendees, summary in 3 lines, decisions, action items (action, owner, due date), open issues, next meeting.

Rules: decisions and actions must be specific; do not invent decisions that are not in the notes; mark unclear items "to confirm".
Output: a clean document ready to send.`,
    output: 'A time-boxed agenda with desired outcomes and decisions needed, or minutes with summary, decisions, owned actions and open issues.',
    next: ['P-F06', 'P-I04'], tags: ['agenda', 'minutes', 'meetings', 'action items'],
    tr: {
      vi: ['Soạn agenda và biên bản cuộc họp', 'Viết agenda tập trung trước cuộc họp, hoặc biên bản rõ ràng với quyết định và hành động từ ghi chú sau cuộc họp.', 'Trước mọi cuộc họp bạn tổ chức; ngay sau cuộc họp, từ ghi chú thô; khi cuộc họp kết thúc mà không có quyết định rõ.'],
      ko: ['회의 아젠다와 회의록 만들기', '회의 전에는 집중된 아젠다를, 회의 후에는 메모에서 결정과 실행 항목이 담긴 회의록을 작성합니다.', '직접 여는 모든 회의 전; 회의 직후 메모로; 회의가 결정 없이 끝날 때.'],
      fr: ['Créer un ordre du jour et un compte rendu', 'Rédige un ordre du jour ciblé avant la réunion, ou un compte rendu propre avec décisions et actions à partir de vos notes.', 'Avant toute réunion que vous organisez ; juste après une réunion, à partir de notes brutes ; quand les réunions se terminent sans décision claire.'],
    },
  },
  {
    id: 'P-F05', phase: 'every', step: 5, cat: 'F', sub: 'Stakeholder communication', roles: ['BA', 'PO', 'PM'],
    title: 'Plan stakeholder communication',
    desc: 'Builds a communication plan: what each stakeholder group needs to know, how often, through which channel and from whom.',
    when: ['After stakeholder mapping', 'Stakeholders feel surprised or left out', 'Before a big change or release'],
    prepare: 'Stakeholder map, project milestones, channels your company uses',
    ph: [['Stakeholders', 'Groups and their interest', 'Sponsor (high power), branch staff (affected), Risk (approver), customers (users)'],
      ['Milestones', 'Key dates', 'Design sign-off Dec; UAT Jan; go-live Feb'],
      ['Channels', 'Channels available', 'Email, Teams, monthly steering, intranet']],
    body: `Act as a project manager planning stakeholder communication.

Stakeholders: [Stakeholders]
Milestones: [Milestones]
Channels: [Channels]

1. For each stakeholder group: what they need to know, what we need from them, format, channel, frequency, sender.
2. Plan extra communication around each milestone.
3. Write key messages for the next milestone, tailored to 2–3 groups.
4. Define how to collect feedback and handle concerns.

Output: a communication matrix table, a milestone calendar, the key messages, and the feedback loop.`,
    output: 'A communication matrix (needs, asks, channel, frequency, sender), a milestone calendar, tailored key messages and a feedback loop.',
    next: ['P-F07', 'P-I04'], tags: ['communication plan', 'stakeholders', 'change management'],
    tr: {
      vi: ['Lập kế hoạch truyền thông với các bên liên quan', 'Xây dựng kế hoạch truyền thông: mỗi nhóm cần biết gì, tần suất, kênh nào và ai gửi.', 'Sau khi lập bản đồ các bên; khi các bên thấy bất ngờ hay bị bỏ rơi; trước thay đổi lớn hay đợt phát hành.'],
      ko: ['이해관계자 커뮤니케이션 계획하기', '그룹별로 알아야 할 내용, 빈도, 채널, 발신자를 담은 커뮤니케이션 계획을 만듭니다.', '이해관계자 매핑 후; 이해관계자가 놀라거나 소외감을 느낄 때; 큰 변화나 릴리스 전.'],
      fr: ['Planifier la communication avec les parties prenantes', 'Construit un plan de communication : ce que chaque groupe doit savoir, à quelle fréquence, par quel canal et par qui.', 'Après la cartographie des parties prenantes ; quand elles se sentent surprises ou oubliées ; avant un grand changement ou une release.'],
    },
  },
  {
    id: 'P-F06', phase: 'every', step: 6, cat: 'F', sub: 'Action item tracking', roles: ['PM', 'BA'],
    title: 'Track action items',
    desc: 'Consolidates action items from meetings and chats into one tracked list with owners, due dates, status and follow-up messages.',
    when: ['Actions are scattered across meetings and chats', 'Weekly before the status meeting', 'Things keep getting forgotten'],
    prepare: 'Actions from recent meetings, emails or chats',
    ph: [['Actions', 'Paste actions from anywhere', 'Minh: vendor date (from 5 Dec mtg); Lan: update AC for US-21; Hoa: UAT data — done; Risk: confirm expiry rule?'],
      ['Today', "Today's date", '12 December 2026']],
    body: `Act as a project coordinator.

Actions collected: [Actions]
Today's date: [Today]

1. Merge duplicates and rewrite each action as "Verb + object + outcome".
2. Build a tracker: ID, action, owner, source, due date, status (open / done / overdue / blocked), next step.
3. Flag actions with no owner or no due date.
4. Draft short, polite follow-up messages for overdue or unowned actions.

Output: the tracker table, flagged items, then the follow-up messages.`,
    output: 'A deduplicated action tracker with owners, dates and status, flagged gaps, and ready-to-send follow-up messages.',
    next: ['P-F07', 'P-F04'], tags: ['action items', 'follow-up', 'tracking'],
    tr: {
      vi: ['Theo dõi các đầu việc', 'Gom đầu việc từ các cuộc họp và tin nhắn vào một danh sách có người phụ trách, hạn, trạng thái và tin nhắn nhắc việc.', 'Khi việc nằm rải rác ở nhiều cuộc họp và chat; hằng tuần trước họp cập nhật; khi việc cứ bị quên.'],
      ko: ['실행 항목 추적하기', '회의와 채팅의 실행 항목을 담당자, 기한, 상태, 후속 메시지가 있는 하나의 목록으로 정리합니다.', '실행 항목이 여기저기 흩어져 있을 때; 매주 상태 회의 전; 일이 자꾸 잊힐 때.'],
      fr: ['Suivre les actions', 'Regroupe les actions issues des réunions et discussions dans une liste suivie avec responsables, échéances, statut et messages de relance.', 'Quand les actions sont éparpillées ; chaque semaine avant la réunion de suivi ; quand des choses sont oubliées.'],
    },
  },
  {
    id: 'P-F07', phase: 'every', step: 7, cat: 'F', sub: 'Project status reporting', roles: ['PO', 'PM'],
    title: 'Write a weekly status report',
    desc: 'Turns progress, risks and decisions into a one-page update for stakeholders, with a clear RAG status and asks.',
    when: ['Every week or sprint', 'Before a steering committee', 'When stakeholders keep asking "where are we?"'],
    prepare: 'Progress against milestones, metrics, risks and issues, decisions needed',
    ph: [['Period', 'Reporting period', 'Week of 7–11 Dec 2026'],
      ['Progress', 'What was done and what is next', 'Save draft done; e-KYC integration 60%; UAT plan drafted; next: contract screen'],
      ['Risks And Decisions', 'Risks, issues, decisions needed', 'Vendor API 1 week late; need decision on e-signature scope by 18 Dec']],
    body: `Act as a project manager writing a status report for busy executives.

Period: [Period]
Progress: [Progress]
Risks and decisions: [Risks And Decisions]

Write a one-page report:
1. Overall status as Green / Amber / Red with a one-sentence reason, plus scope, schedule, budget each with its own RAG.
2. Highlights (3 bullets max).
3. Next period (3 bullets max).
4. Risks and issues: top 3 with impact and mitigation.
5. Decisions or help needed: what, from whom, by when.

Rules: lead with what executives need to act on; no jargon; no colour without a reason.
Output: the report ready to paste into email or chat.`,
    output: 'A one-page status report: overall and per-dimension RAG with reasons, highlights, next steps, top risks and the decisions needed.',
    next: ['P-F08', 'P-F05'], tags: ['status report', 'RAG', 'progress', 'delivery tracking'],
    tr: {
      vi: ['Viết báo cáo tình trạng hằng tuần', 'Biến tiến độ, rủi ro và quyết định thành bản cập nhật một trang cho các bên, có trạng thái RAG rõ ràng và đề nghị cụ thể.', 'Mỗi tuần hoặc mỗi sprint; trước họp ban chỉ đạo; khi các bên liên tục hỏi "đang tới đâu rồi?".'],
      ko: ['주간 상태 보고서 작성하기', '진척, 위험, 결정을 명확한 RAG 상태와 요청이 담긴 1페이지 이해관계자 업데이트로 만듭니다.', '매주나 매 스프린트; 운영위원회 전; 이해관계자가 계속 "어디까지 왔나?"를 물을 때.'],
      fr: ['Rédiger un rapport d’avancement hebdomadaire', 'Transforme avancement, risques et décisions en une page claire pour les parties prenantes, avec statut RAG et demandes précises.', 'Chaque semaine ou sprint ; avant un comité de pilotage ; quand on vous demande sans cesse « où en est-on ? ».'],
    },
  },
  {
    id: 'P-F08', phase: 'every', step: 8, cat: 'F', sub: 'Risk escalation', roles: ['PM'],
    title: 'Draft a risk escalation email',
    desc: 'Writes a short, calm escalation email that states the risk, its impact, the options and the decision needed.',
    when: ['A risk is now likely and above your authority', 'A dependency is blocked for more than 2 days', 'A deadline will be missed without a decision'],
    prepare: 'Risk summary, impact on scope / time / cost, options considered, decision deadline',
    ph: [['Risk Summary', 'The risk in one line', 'The e-signature vendor will deliver their API 3 weeks late'],
      ['Impact', 'Impact in numbers', 'Go-live moves from 10 Feb to 3 Mar, or e-signature is removed from release 1'],
      ['Options', 'Options with trade-offs', 'A) delay go-live; B) launch without e-signature, add in R2; C) switch vendor'],
      ['Deadline', 'When the decision is needed', 'Friday 18 Dec'],
      ['Recipient', 'Who you are escalating to', 'Head of Retail Lending (project sponsor)']],
    body: `Act as an experienced project manager.

Risk: [Risk Summary]
Impact: [Impact]
Options considered: [Options]
Decision needed by: [Deadline]

Write an escalation email to [Recipient] that states the risk in one sentence, the impact in numbers, 2–3 options with trade-offs, your recommendation and the decision you need. Keep it under 200 words and neutral in tone.
Add a clear subject line that includes "Decision needed" and the date.`,
    output: 'An email with a subject line, 4 short paragraphs (risk, impact, options with recommendation, decision and date) and a clear ask.',
    next: ['P-F07', 'P-B07'], tags: ['escalation', 'risk', 'email', 'decision'],
    tr: {
      vi: ['Soạn email báo cáo rủi ro lên cấp trên', 'Viết email báo cáo ngắn, điềm tĩnh nêu rủi ro, tác động, các phương án và quyết định cần có.', 'Khi rủi ro đã rất có khả năng xảy ra và vượt thẩm quyền; khi phụ thuộc bị chặn quá 2 ngày; khi sẽ trễ hạn nếu không có quyết định.'],
      ko: ['위험 에스컬레이션 이메일 작성하기', '위험, 영향, 대안, 필요한 결정을 담은 짧고 침착한 에스컬레이션 이메일을 작성합니다.', '위험이 높아졌고 권한 밖일 때; 의존성이 2일 넘게 막혔을 때; 결정 없이는 마감을 놓칠 때.'],
      fr: ['Rédiger un e-mail d’escalade de risque', 'Rédige un e-mail d’escalade court et posé qui expose le risque, son impact, les options et la décision attendue.', 'Quand un risque devient probable et dépasse votre autorité ; quand une dépendance est bloquée depuis plus de 2 jours ; quand une échéance sera manquée sans décision.'],
    },
  },
  {
    id: 'P-F09', phase: 'every', step: 9, cat: 'F', sub: 'Conflict resolution', roles: ['PO', 'PM', 'BA'],
    title: 'Prepare to resolve a conflict',
    desc: 'Helps you understand both sides of a conflict, find shared interests and plan a calm conversation with a proposed way forward.',
    when: ['Two stakeholders want opposite things', 'Tension inside the team', 'Before a difficult meeting'],
    prepare: 'Who is involved, what each side wants and why, what is at stake',
    ph: [['Situation', 'What the conflict is about', 'Sales wants a feature for a big client this sprint; the tech lead refuses because of technical debt'],
      ['Positions', 'What each side says', 'Sales: "We lose the deal without it." Tech lead: "We will break production again."'],
      ['My Role', 'Your role in it', 'Product owner deciding sprint scope']],
    body: `Act as a coach in conflict resolution for product and project people.

Situation: [Situation]
Positions: [Positions]
My role: [My Role]

1. Separate each side's position (what they ask for) from their interests (why they want it).
2. Find shared interests and the real constraint.
3. Generate 3–4 options that serve both interests, and objective criteria to choose between them.
4. Plan the conversation: opening sentence, questions to ask, how to stay neutral, how to close with an agreement.
5. Suggest what to do if no agreement is reached (escalation path).

Output: Interests table, Options, Conversation plan, Fallback.`,
    output: 'Positions vs interests for each side, shared interests, options with criteria, a conversation plan and a fallback.',
    next: ['P-F04', 'P-I07'], tags: ['conflict', 'negotiation', 'interests', 'soft skills'],
    tr: {
      vi: ['Chuẩn bị giải quyết xung đột', 'Giúp hiểu hai phía của xung đột, tìm lợi ích chung và lên kế hoạch cuộc trao đổi điềm tĩnh với hướng đi đề xuất.', 'Khi hai bên muốn điều trái ngược; khi trong nhóm có căng thẳng; trước một cuộc họp khó.'],
      ko: ['갈등 해결 준비하기', '갈등의 양측을 이해하고 공통 관심사를 찾아 제안을 담은 차분한 대화를 계획합니다.', '두 이해관계자가 상반된 것을 원할 때; 팀 내 긴장이 있을 때; 어려운 회의 전.'],
      fr: ['Préparer la résolution d’un conflit', 'Aide à comprendre les deux parties, trouver les intérêts communs et préparer une discussion sereine avec une proposition.', 'Quand deux parties prenantes veulent l’inverse ; en cas de tension dans l’équipe ; avant une réunion difficile.'],
    },
  },
  {
    id: 'P-F10', phase: 'every', step: 10, cat: 'F', sub: 'Cross-team coordination', roles: ['PM', 'PO'],
    title: 'Coordinate work across teams',
    desc: 'Sets up a lightweight coordination plan across teams: shared milestones, interfaces, owners, sync rituals and escalation.',
    when: ['Several teams deliver one feature', 'Hand-offs between teams keep failing', 'A vendor team joins the project'],
    prepare: 'Teams involved, what each delivers, shared deadlines, known friction',
    ph: [['Teams', 'Teams and what each delivers', 'Mobile team (app), Core team (account APIs), Vendor (e-signature), Ops (release)'],
      ['Shared Goal', 'Shared milestone', 'End-to-end loan contract signing live by 3 March'],
      ['Friction', 'What goes wrong now (optional)', 'API changes announced late; different sprint calendars']],
    body: `Act as a delivery manager coordinating several teams.

Teams: [Teams]
Shared goal: [Shared Goal]
Current friction: [Friction]

1. Map who delivers what to whom (interfaces and hand-offs) with need-by dates.
2. Define shared milestones and integration points.
3. Propose sync rituals: frequency, attendees, 15-minute agenda (e.g. a scrum of scrums).
4. Set rules: interface change notice, definition of done for hand-offs, shared board.
5. Define an escalation path and response times.

Output: an interface table, a milestone list, the sync ritual, working agreements and the escalation path.`,
    output: 'An interface and hand-off table with dates, shared milestones, a sync ritual, working agreements and an escalation path.',
    next: ['P-E10', 'P-F07'], tags: ['coordination', 'cross-team', 'scrum of scrums', 'interfaces'],
    tr: {
      vi: ['Phối hợp công việc giữa các nhóm', 'Thiết lập kế hoạch phối hợp gọn nhẹ giữa các nhóm: mốc chung, giao diện, người phụ trách, nghi thức đồng bộ và leo thang.', 'Khi nhiều nhóm cùng làm một tính năng; khi bàn giao giữa các nhóm liên tục lỗi; khi nhóm nhà cung cấp tham gia.'],
      ko: ['팀 간 업무 조율하기', '공동 마일스톤, 인터페이스, 담당자, 동기화 의식, 에스컬레이션을 담은 가벼운 팀 간 조율 계획을 세웁니다.', '여러 팀이 한 기능을 만들 때; 팀 간 인계가 계속 실패할 때; 공급업체 팀이 합류할 때.'],
      fr: ['Coordonner le travail entre équipes', 'Met en place une coordination légère entre équipes : jalons communs, interfaces, responsables, rituels de synchronisation et escalade.', 'Quand plusieurs équipes livrent une même fonctionnalité ; quand les passations échouent ; quand une équipe fournisseur rejoint le projet.'],
    },
  },
  {
    id: 'P-F11', phase: 'every', step: 11, cat: 'F', sub: 'Resource and workload management', roles: ['PM'],
    title: 'Balance team workload',
    desc: 'Reviews who is working on what, spots overload and single points of failure, and suggests a fairer, safer allocation.',
    when: ['Someone is burning out', 'One person blocks many tasks', 'Before taking on new work'],
    prepare: 'Team members and their current assignments, skills, upcoming leave',
    ph: [['Assignments', 'Who works on what', 'Lan: 3 stories + UAT prep + vendor calls; Minh: 1 story; Hoa: testing for 2 teams'],
      ['Skills', 'Who can do what', 'Only Lan knows the credit rules; Minh can test; Hoa knows automation']],
    body: `Act as a people-aware project manager.

Current assignments: [Assignments]
Skills: [Skills]

1. Estimate the load per person (light / balanced / overloaded) and explain why.
2. Identify single points of failure (knowledge only one person has).
3. Suggest a rebalanced allocation that respects skills and keeps flow.
4. Propose knowledge-sharing actions (pairing, documentation, shadowing) for each single point of failure.
5. Suggest how to talk with an overloaded team member supportively.

Output: a load table, single points of failure, the new allocation, knowledge-sharing actions and talking points.`,
    output: 'A workload table, single points of failure, a rebalanced allocation, knowledge-sharing actions and supportive talking points.',
    next: ['P-B06', 'P-F07'], tags: ['workload', 'burnout', 'allocation', 'bus factor'],
    tr: {
      vi: ['Cân bằng khối lượng công việc của nhóm', 'Xem ai đang làm gì, phát hiện quá tải và điểm phụ thuộc vào một người, gợi ý phân bổ công bằng và an toàn hơn.', 'Khi có người kiệt sức; khi một người chặn nhiều việc; trước khi nhận thêm việc mới.'],
      ko: ['팀 업무량 균형 맞추기', '누가 무엇을 하는지 검토해 과부하와 단일 장애점을 찾고 더 공정하고 안전한 배분을 제안합니다.', '누군가 번아웃될 때; 한 사람이 여러 일을 막을 때; 새 일을 맡기 전.'],
      fr: ['Équilibrer la charge de l’équipe', 'Examine qui travaille sur quoi, repère surcharges et points de défaillance uniques, et propose une répartition plus juste et plus sûre.', 'Quand quelqu’un s’épuise ; quand une personne bloque beaucoup de tâches ; avant d’accepter du nouveau travail.'],
    },
  },
];
