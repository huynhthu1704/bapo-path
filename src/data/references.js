// Sources behind the platform's content. Glossary entries and framework summaries are written
// in our own words as study notes; they do not reproduce text from these works.

export const REFERENCES = [
  { id: 'babok', group: 'Business analysis', title: 'A Guide to the Business Analysis Body of Knowledge (BABOK® Guide), v3', author: 'International Institute of Business Analysis (IIBA)', year: 2015, publisher: 'IIBA, Toronto', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', used: 'BABOK glossary and framework overview: core concept model, requirement types, the six knowledge areas and their tasks, techniques, competencies and perspectives.' },
  { id: 'pmbok', group: 'Project management', title: 'A Guide to the Project Management Body of Knowledge (PMBOK® Guide), 7th ed., and The Standard for Project Management', author: 'Project Management Institute (PMI)', year: 2021, publisher: 'PMI, Newtown Square, PA', url: 'https://www.pmi.org/standards/pmbok', used: 'PMBOK glossary and framework overview: the value delivery system, 12 principles, 8 performance domains, development approaches and tailoring.' },
  { id: 'scrum', group: 'Agile', title: 'The Scrum Guide', author: 'Ken Schwaber & Jeff Sutherland', year: 2020, publisher: 'scrumguides.org', url: 'https://scrumguides.org/scrum-guide.html', used: 'Team collaboration glossary: Scrum roles, events and artefacts; PO skills on the roadmap.' },
  { id: 'agile-manifesto', group: 'Agile', title: 'Manifesto for Agile Software Development', author: 'Beck, K. et al.', year: 2001, publisher: 'agilemanifesto.org', url: 'https://agilemanifesto.org/', used: 'Agile values behind the team glossary and the BABOK agile perspective.' },
  { id: 'sommerville', group: 'Software engineering', title: 'Software Engineering, 10th ed.', author: 'Ian Sommerville', year: 2015, publisher: 'Pearson', url: 'https://software-engineering-book.com/', used: 'Software Engineering glossary: process models, requirements engineering, system modelling, design and configuration management.' },
  { id: 'tdc-se', group: 'Software engineering', title: 'Nhập môn Công nghệ Phần mềm – Lý thuyết (Introduction to Software Engineering, lecture slides)', author: 'Nguyễn Huy Hoàng & Phan Gia Phước', year: 2021, publisher: 'Course slides, adapted from Sommerville 10th ed.', url: '', used: 'Weeks 1–15: introduction, requirements for software engineers, software process, requirements engineering, use case and activity diagrams, software design, configuration management.' },
  { id: 'acm-ethics', group: 'Software engineering', title: 'Software Engineering Code of Ethics and Professional Practice', author: 'ACM / IEEE-CS Joint Task Force', year: 1999, publisher: 'ACM', url: 'https://ethics.acm.org/code-of-ethics/software-engineering-code/', used: 'Professional responsibility terms in the Software Engineering glossary.' },
  { id: 'istqb', group: 'Software testing', title: 'ISTQB® Certified Tester Foundation Level Syllabus (2011 edition, which the course follows; current edition v4.0, 2023)', author: 'International Software Testing Qualifications Board', year: 2011, publisher: 'ISTQB', url: 'https://www.istqb.org/certifications/certified-tester-foundation-level', used: 'Software Testing glossary: fundamentals, testing through the life cycle, static testing, test techniques and test management.' },
  { id: 'tdc-qa', group: 'Software testing', title: 'Lý thuyết Kiểm thử Phần mềm (Software Testing Theory, lecture slides) – ISTQB Foundation chapters 1–5 and Chương 5: Quản lý kiểm thử', author: 'Vũ Nguyễn (ISTQB chapters) and course team', year: 2010, publisher: 'Course slides', url: '', used: 'Testing principles, test process, test levels and types, reviews, black-box and white-box techniques, test organisation, planning, monitoring, configuration and incident management.' },
];

export const REF_BY_ID = Object.fromEntries(REFERENCES.map((r) => [r.id, r]));

// Which sources each glossary category draws on (shown on glossary and term pages).
export const CATEGORY_REFS = {
  it: ['sommerville'], team: ['scrum', 'agile-manifesto'], corp: [],
  se: ['sommerville', 'tdc-se', 'acm-ethics'], qa: ['istqb', 'tdc-qa'], babok: ['babok'], pmbok: ['pmbok'],
};

export const cite = (r) => `${r.author} (${r.year}). ${r.title}. ${r.publisher}.`;
