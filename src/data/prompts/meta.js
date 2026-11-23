// Prompt Workbench taxonomy: workflow phases, categories A–I and workflow collections.
// Roles, phases and categories are data, so new ones need no code change (NFR-10).

export const ROLES = ['BA', 'PO', 'PM'];

export const PHASES = [
  { id: 'discover', name: 'Discover', color: '#7C3AED', soft: '#EDE9FE', sub: 'Understand the business, the problem and the opportunity' },
  { id: 'define', name: 'Define', color: '#2563EB', soft: '#DBEAFE', sub: 'Elicit, analyse and agree the requirements' },
  { id: 'design', name: 'Design', color: '#DB2777', soft: '#FCE7F3', sub: 'Shape the solution: journeys, flows, rules and screens' },
  { id: 'build', name: 'Build', color: '#EA580C', soft: '#FFEDD5', sub: 'Plan delivery, write stories and design tests' },
  { id: 'release', name: 'Release', color: '#16A34A', soft: '#DCFCE7', sub: 'Run UAT, fix defects and go live safely' },
  { id: 'monitor', name: 'Monitor', color: '#0891B2', soft: '#CFFAFE', sub: 'Measure results and decide what to improve' },
  { id: 'every', name: 'Every phase', color: '#475569', soft: '#F1F5F9', sub: 'Meetings, communication and AI productivity — useful at any time' },
];
export const PHASE_BY_ID = Object.fromEntries(PHASES.map((p) => [p.id, p]));

export const CATEGORIES = [
  { id: 'A', name: 'Business and Product Discovery' },
  { id: 'B', name: 'Project and Product Planning' },
  { id: 'C', name: 'Application and Solution Design' },
  { id: 'D', name: 'Business Analysis and Requirement Engineering' },
  { id: 'E', name: 'User Story and Backlog Management' },
  { id: 'F', name: 'Project and Team Management' },
  { id: 'G', name: 'Quality Assurance and Testing' },
  { id: 'H', name: 'Product Delivery and Continuous Improvement' },
  { id: 'I', name: 'AI Productivity and Professional Development' },
];
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Launch date of the library. Prompts added after it count as "New" for 30 days (REQ-004).
export const LAUNCH_DATE = '2026-11-23';

export const COLLECTIONS = [
  { id: 'new-product-discovery', name: 'New Product Discovery', roles: ['PO', 'PM'],
    desc: 'From a raw idea to an approved business case and product vision.',
    steps: ['P-A01', 'P-A02', 'P-A03', 'P-A04', 'P-A05', 'P-A06', 'P-A07', 'P-B02'] },
  { id: 'feature-development', name: 'Feature Development', roles: ['BA'],
    desc: 'The BA path end to end: problem → requirements → journey → stories → tests → UAT → go-live.',
    steps: ['P-A05', 'P-D01', 'P-D02', 'P-C04', 'P-E01', 'P-E05', 'P-G02', 'P-G05', 'P-H02'] },
  { id: 'sprint-management', name: 'Sprint Management', roles: ['PO'],
    desc: 'Plan, run and review a sprint: backlog, sprint goal, stand-ups, status and retro.',
    steps: ['P-E07', 'P-E09', 'P-F02', 'P-E08', 'P-F01', 'P-F07', 'P-F03'] },
  { id: 'uat-and-release', name: 'UAT and Release', roles: ['BA', 'PM'],
    desc: 'Prepare UAT, triage defects, agree the regression scope and decide go / no-go.',
    steps: ['P-G05', 'P-G02', 'P-G06', 'P-G08', 'P-G09', 'P-H01', 'P-H02'] },
  { id: 'project-kickoff', name: 'Project Kickoff', roles: ['PM'],
    desc: 'Charter, stakeholders, scope, WBS, RAID log, milestones and the first status report.',
    steps: ['P-B01', 'P-A04', 'P-B03', 'P-B05', 'P-B07', 'P-B08', 'P-F07'] },
  { id: 'post-launch-review', name: 'Post-launch Review', roles: ['PO', 'PM'],
    desc: 'Check adoption and KPIs, analyse feedback and decide what to improve next.',
    steps: ['P-H06', 'P-H07', 'P-H04', 'P-H05', 'P-H09', 'P-H10'] },
];
export const COLLECTION_BY_ID = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));
