// Story Mode: "Your first job at ShopNow". Each choice has a quality (best / ok / bad) and effects on meters.
export const CHAPTERS = [
  { n: 1, title: 'Welcome to ShopNow', scenes: [
    { speaker: 'Lan · Your manager', avatar: 'L', line: 'Welcome aboard! Our online fashion shop has grown fast, and our processes are messy. Your first task: understand how returns work today.', question: 'How do you start?',
      choices: [
        { text: 'Read the current return policy and ask who handles returns every day.', q: 'best', fb: 'Great start — documents plus the people who do the work give you the real picture.', fx: { trust: 10, clarity: 10, timeline: 0 } },
        { text: 'Design a new returns screen straight away.', q: 'bad', fb: 'Too early — you don’t know the problem yet.', fx: { trust: -5, clarity: -10, timeline: 0 } },
        { text: 'Wait until someone sends you requirements.', q: 'ok', fb: 'BAs are expected to go and find information, not wait for it.', fx: { trust: -5, clarity: 0, timeline: -5 } },
      ] },
    { speaker: 'Huy · Support agent', avatar: 'H', line: 'Returns are a nightmare. I check the order in one system, the warehouse in another, and then email finance for the refund.', question: 'What do you do next?',
      choices: [
        { text: 'Ask Huy to walk you through the last return he handled, step by step.', q: 'best', fb: 'A real example reveals hidden steps and pain points.', fx: { trust: 10, clarity: 15, timeline: 0 } },
        { text: 'Tell Huy a new system will fix everything.', q: 'bad', fb: 'Don’t promise solutions before you understand the problem.', fx: { trust: -10, clarity: 0, timeline: 0 } },
        { text: 'Write down “returns are slow” and move on.', q: 'ok', fb: 'That’s a symptom, not a requirement. Dig deeper.', fx: { trust: 0, clarity: -5, timeline: 0 } },
      ] },
    { speaker: 'Lan · Your manager', avatar: 'L', line: 'Nice work this week. Can you share what you found with the team?', question: 'How do you share it?',
      choices: [
        { text: 'A one-page as-is flow with swimlanes and the top 3 pain points.', q: 'best', fb: 'Clear, visual and focused — the team can act on it.', fx: { trust: 10, clarity: 10, timeline: 5 } },
        { text: 'Forward your raw interview notes.', q: 'ok', fb: 'Useful, but people won’t read 6 pages. Summarise first.', fx: { trust: 0, clarity: -5, timeline: 0 } },
        { text: 'Explain it verbally at the coffee machine.', q: 'bad', fb: 'Nothing written means nothing to come back to.', fx: { trust: -5, clarity: -10, timeline: 0 } },
      ] },
  ] },
  { n: 2, title: 'The stakeholder interview', scenes: [
    { speaker: 'Mai · Head of Sales', avatar: 'M', line: 'Our regular customers keep complaining that buying again takes too long. I want a one-click reorder button. Can you make it happen next sprint?', question: 'What do you say first?',
      choices: [
        { text: '“Sure! I’ll ask the developers to start today.”', q: 'bad', fb: 'You promised for the team and skipped prioritisation.', fx: { trust: 5, clarity: -10, timeline: -15 } },
        { text: '“Who reorders most, and what slows them down today? Can you show me an example order?”', q: 'best', fb: 'Great BA move — you asked about the problem before the solution. Mai shares 3 real orders.', fx: { trust: 10, clarity: 15, timeline: 0 } },
        { text: '“That’s impossible in one sprint.”', q: 'bad', fb: 'Shutting the door damages trust before you know the size of the work.', fx: { trust: -15, clarity: 0, timeline: 0 } },
      ] },
    { speaker: 'Mai · Head of Sales', avatar: 'M', line: 'Look — this customer buys the same jeans every two months. She has to search, choose her size again and re-enter her address.', question: 'What is the real problem?',
      choices: [
        { text: 'Customers must repeat size and address details every time.', q: 'best', fb: 'Exactly. A “reorder” button is one solution — saved sizes and addresses might solve most of it.', fx: { trust: 5, clarity: 15, timeline: 5 } },
        { text: 'The jeans are too expensive.', q: 'bad', fb: 'Nothing in the example points to price.', fx: { trust: -5, clarity: -10, timeline: 0 } },
        { text: 'The search engine is broken.', q: 'ok', fb: 'Search is part of it, but the repeated details are the bigger pain.', fx: { trust: 0, clarity: 0, timeline: 0 } },
      ] },
    { speaker: 'Minh · Product Owner', avatar: 'P', line: 'Thanks for the findings. How should we write this up for the team?', question: 'Which user story is best?',
      choices: [
        { text: 'As a returning customer, I want my last size and address pre-filled, so that I can reorder in under a minute.', q: 'best', fb: 'Clear user, need and measurable value. Ready for acceptance criteria.', fx: { trust: 5, clarity: 15, timeline: 5 } },
        { text: 'Add a reorder button to the order page.', q: 'ok', fb: 'This is a solution without a user or a “so that”.', fx: { trust: 0, clarity: -5, timeline: 0 } },
        { text: 'Make reordering better.', q: 'bad', fb: 'Too vague to estimate or test.', fx: { trust: -5, clarity: -15, timeline: 0 } },
      ] },
    { speaker: 'Mai · Head of Sales', avatar: 'M', line: 'So… will I get my button next sprint?', question: 'How do you close the conversation?',
      choices: [
        { text: '“Minh will prioritise it in refinement on Wednesday. I’ll send you a summary of what we found by EOD.”', q: 'best', fb: 'Honest, clear next step, owner and date. Mai leaves happy.', fx: { trust: 15, clarity: 5, timeline: 5 } },
        { text: '“Yes, definitely.”', q: 'bad', fb: 'You can’t commit for the PO and the team.', fx: { trust: 5, clarity: 0, timeline: -15 } },
        { text: '“I don’t know.”', q: 'ok', fb: 'Honest, but give a next step so she isn’t left waiting.', fx: { trust: -5, clarity: 0, timeline: 0 } },
      ] },
  ] },
  { n: 3, title: 'Writing the backlog', scenes: [] },
  { n: 4, title: 'Sprint review drama', scenes: [] },
  { n: 5, title: 'UAT week', scenes: [] },
  { n: 6, title: 'Go-live day', scenes: [] },
];
