// BABOK® Guide v3 and PMBOK® Guide 7th ed. at a glance.
// Section names follow the guides' structure; every summary is our own short study note.
// `term` links to a glossary entry when one exists.

export const FRAMEWORKS = {
  babok: {
    id: 'babok', name: 'BABOK® Guide v3', owner: 'IIBA', icon: 'Compass', color: 'po', ref: 'babok', glossary: 'babok',
    intro: 'The global standard for business analysis. It describes what a BA does — not a step-by-step method — so you can apply it to agile, waterfall or anything in between.',
    core: {
      title: 'Business Analysis Core Concept Model (BACCM)', term: 'babok-baccm',
      items: [
        ['Change', 'The act of transforming in response to a need.'],
        ['Need', 'A problem or opportunity to be addressed.', 'babok-need'],
        ['Solution', 'A specific way of satisfying one or more needs in a context.', 'babok-solution'],
        ['Stakeholder', 'A person or group with a relationship to the change, the need or the solution.'],
        ['Value', 'The worth or usefulness of something to a stakeholder in a context.', 'babok-value'],
        ['Context', 'The circumstances that influence, and are influenced by, the change.', 'babok-context'],
      ],
    },
    requirementTypes: [
      ['Business requirements', 'Why the change: goals, objectives and outcomes for the organisation.', 'babok-business-requirement'],
      ['Stakeholder requirements', 'What particular stakeholders need from the solution.', 'babok-stakeholder-requirement'],
      ['Solution requirements', 'Functional and non-functional capabilities and qualities.', 'babok-solution-requirement'],
      ['Transition requirements', 'Temporary needs to move from the current to the future state, such as data migration or training.', 'babok-transition-requirement'],
    ],
    areas: [
      { n: 3, name: 'Business Analysis Planning and Monitoring', term: 'babok-business-analysis-planning-and-monitoring', sum: 'Organise the BA work itself: approach, stakeholders, governance, information and how to improve.',
        tasks: ['Plan Business Analysis Approach', 'Plan Stakeholder Engagement', 'Plan Business Analysis Governance', 'Plan Business Analysis Information Management', 'Identify Business Analysis Performance Improvements'] },
      { n: 4, name: 'Elicitation and Collaboration', term: 'babok-elicitation-and-collaboration', sum: 'Draw out information from stakeholders, confirm it, share it and keep people working together.',
        tasks: ['Prepare for Elicitation', 'Conduct Elicitation', 'Confirm Elicitation Results', 'Communicate Business Analysis Information', 'Manage Stakeholder Collaboration'] },
      { n: 5, name: 'Requirements Life Cycle Management', term: 'babok-requirements-life-cycle-management', sum: 'Look after requirements and designs from first idea to retirement: trace, maintain, prioritise, assess change, approve.',
        tasks: ['Trace Requirements', 'Maintain Requirements', 'Prioritize Requirements', 'Assess Requirements Changes', 'Approve Requirements'] },
      { n: 6, name: 'Strategy Analysis', term: 'babok-strategy-analysis', sum: 'Understand where the business is, where it wants to be, the risks in between and the strategy to get there.',
        tasks: ['Analyze Current State', 'Define Future State', 'Assess Risks', 'Define Change Strategy'] },
      { n: 7, name: 'Requirements Analysis and Design Definition', term: 'babok-requirements-analysis-and-design-definition', sum: 'Turn elicited information into specified, verified and validated requirements, then shape and recommend design options.',
        tasks: ['Specify and Model Requirements', 'Verify Requirements', 'Validate Requirements', 'Define Requirements Architecture', 'Define Design Options', 'Analyze Potential Value and Recommend Solution'] },
      { n: 8, name: 'Solution Evaluation', term: 'babok-solution-evaluation', sum: 'Check whether a solution in use actually delivers value, find what limits it and recommend actions.',
        tasks: ['Measure Solution Performance', 'Analyze Performance Measures', 'Assess Solution Limitations', 'Assess Enterprise Limitations', 'Recommend Actions to Increase Solution Value'] },
    ],
    competencies: {
      term: 'babok-underlying-competencies',
      items: [
        ['Analytical Thinking and Problem Solving', 'Creative, systems and conceptual thinking; learning; decision making.'],
        ['Behavioural Characteristics', 'Ethics, accountability, trustworthiness, organisation and adaptability.'],
        ['Business Knowledge', 'Business acumen plus industry, organisation, solution and methodology knowledge.'],
        ['Communication Skills', 'Verbal, non-verbal, written communication and listening.'],
        ['Interaction Skills', 'Facilitation, leadership, teamwork, negotiation and teaching.'],
        ['Tools and Technology', 'Office, BA-specific and communication tools.'],
      ],
    },
    techniques: [
      ['Acceptance and Evaluation Criteria'], ['Backlog Management'], ['Balanced Scorecard'], ['Benchmarking and Market Analysis'], ['Brainstorming'],
      ['Business Capability Analysis'], ['Business Cases', 'babok-business-case'], ['Business Model Canvas'], ['Business Rules Analysis'], ['Collaborative Games'],
      ['Concept Modelling'], ['Data Dictionary'], ['Data Flow Diagrams'], ['Data Mining'], ['Data Modelling'],
      ['Decision Analysis'], ['Decision Modelling'], ['Document Analysis'], ['Estimation'], ['Financial Analysis'],
      ['Focus Groups'], ['Functional Decomposition'], ['Glossary'], ['Interface Analysis'], ['Interviews'],
      ['Item Tracking'], ['Lessons Learned'], ['Metrics and KPIs'], ['Mind Mapping'], ['Non-Functional Requirements Analysis'],
      ['Observation'], ['Organizational Modelling'], ['Prioritization', 'babok-moscow-prioritisation'], ['Process Analysis'], ['Process Modelling', 'babok-process-modelling'],
      ['Prototyping'], ['Reviews'], ['Risk Analysis and Management'], ['Roles and Permissions Matrix'], ['Root Cause Analysis', 'babok-root-cause-analysis'],
      ['Scope Modelling'], ['Sequence Diagrams'], ['Stakeholder List, Map, or Personas'], ['State Modelling'], ['Survey or Questionnaire'],
      ['SWOT Analysis', 'babok-swot-analysis'], ['Use Cases and Scenarios'], ['User Stories'], ['Vendor Assessment'], ['Workshops'],
    ],
    perspectives: {
      term: 'babok-ba-perspectives',
      items: [
        ['Agile', 'BA work inside short, iterative delivery with continuous feedback.'],
        ['Business Intelligence', 'Turning data into insight for decisions.'],
        ['Information Technology', 'Changes centred on software and IT systems.'],
        ['Business Architecture', 'The enterprise-wide view of capabilities, value streams and strategy.'],
        ['Business Process Management', 'Designing, measuring and improving end-to-end processes.'],
      ],
    },
  },

  pmbok: {
    id: 'pmbok', name: 'PMBOK® Guide 7th ed.', owner: 'PMI', icon: 'ListChecks', color: 'accent', ref: 'pmbok', glossary: 'pmbok',
    intro: 'The 7th edition moved from processes to principles and outcomes. It covers predictive, adaptive and hybrid work, and asks you to tailor how you deliver value.',
    system: {
      title: 'The value delivery system', term: 'pmbok-value-delivery-system',
      text: 'Portfolios, programmes, projects, products and operations work together so an organisation turns strategy into outcomes and value. Projects are one part of that system.',
    },
    principles: [
      ['Stewardship', 'Be a diligent, respectful and caring steward.'],
      ['Team', 'Create a collaborative project team environment.'],
      ['Stakeholders', 'Effectively engage with stakeholders.', 'pmbok-stakeholder-engagement'],
      ['Value', 'Focus on value.'],
      ['Systems thinking', 'Recognise, evaluate and respond to system interactions.'],
      ['Leadership', 'Demonstrate leadership behaviours.', 'pmbok-servant-leadership'],
      ['Tailoring', 'Tailor based on context.', 'pmbok-tailoring'],
      ['Quality', 'Build quality into processes and deliverables.'],
      ['Complexity', 'Navigate complexity.'],
      ['Risk', 'Optimise risk responses.', 'pmbok-risk-register'],
      ['Adaptability and resilience', 'Embrace adaptability and resiliency.'],
      ['Change', 'Enable change to achieve the envisioned future state.'],
    ],
    principlesTerm: 'pmbok-project-management-principles',
    domains: [
      ['Stakeholders', 'Build good working relationships with stakeholders and keep them engaged and in agreement.', 'pmbok-stakeholder-engagement'],
      ['Team', 'Grow a high-performing team with shared ownership and good leadership.', 'pmbok-servant-leadership'],
      ['Development Approach and Life Cycle', 'Pick the delivery cadence, approach and phases that fit the product and context.', 'pmbok-hybrid-approach'],
      ['Planning', 'Organise and coordinate enough up-front and ongoing planning to deliver outcomes.', 'pmbok-wbs'],
      ['Project Work', 'Run the processes, people, resources and procurement that keep work flowing.'],
      ['Delivery', 'Deliver the scope and quality the project set out to achieve, and the value behind it.', 'pmbok-deliverable'],
      ['Measurement', 'Track performance and act on it so the project stays on course.', 'pmbok-measurement-performance-domain'],
      ['Uncertainty', 'Handle risk, ambiguity, complexity and volatility.', 'pmbok-uncertainty-performance-domain'],
    ],
    domainsTerm: 'pmbok-performance-domain',
    approaches: [
      ['Predictive', 'Scope, time and cost are fixed early; work moves through planned phases.', 'pmbok-predictive-approach'],
      ['Adaptive', 'Iterative or incremental; requirements evolve with frequent feedback.', 'pmbok-adaptive-approach'],
      ['Hybrid', 'A mix of predictive and adaptive elements chosen to suit the work.', 'pmbok-hybrid-approach'],
    ],
    tools: [
      ['Work breakdown structure', 'pmbok-wbs'], ['Critical path method', 'pmbok-critical-path'], ['Earned value analysis', 'pmbok-earned-value'],
      ['Burndown chart', 'pmbok-burndown-chart'], ['RACI matrix', 'pmbok-raci-matrix'], ['Risk register', 'pmbok-risk-register'], ['Phase gate', 'pmbok-phase-gate'],
    ],
  },
};
