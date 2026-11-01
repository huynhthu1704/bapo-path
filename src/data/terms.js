// Glossary content. Each term: category, sub-category, level (1 Beginner, 2 Intermediate, 3 Advanced),
// term, full name, plain-English definition, workplace example, Vietnamese hint.
import { ROWS_SE_QA } from './terms_se_qa.js';
import { ROWS_BABOK_PMBOK } from './terms_babok_pmbok.js';

export const CATEGORIES = [
  { id: 'it', type: 'moved', movedTo: 'learn-it-vocab', name: 'IT Industry Glossary', short: 'IT glossary', icon: 'Globe', color: 'primary',
    desc: 'SDLC, architecture, data, testing, DevOps and security terms.' },
  { id: 'team', type: 'general', name: 'Team Collaboration', short: 'Team', icon: 'Users', color: 'po',
    desc: 'Scrum roles, events, artefacts and how work moves across a team.' },
  { id: 'corp', type: 'general', name: 'Corporate Language', short: 'Corporate language', icon: 'MessageSquare', color: 'accent',
    desc: 'Phrases for meetings, emails, status updates and polite disagreement.' },
  { id: 'se', type: 'general', name: 'Software Engineering', short: 'Software engineering', icon: 'Cpu', color: 'advanced',
    desc: 'Process models, requirements engineering, UML use case and activity diagrams, design and configuration management.', refs: ['sommerville', 'tdc-se', 'acm-ethics'] },
  { id: 'qa', type: 'general', name: 'Software Testing (ISTQB)', short: 'Testing', icon: 'Bug', color: 'success',
    desc: 'Testing principles, test levels and types, reviews, test design techniques and test management.', refs: ['istqb', 'tdc-qa'] },
  { id: 'babok', type: 'framework', name: 'BABOK® Guide v3', short: 'BABOK', icon: 'Compass', color: 'po',
    desc: 'IIBA’s body of knowledge for business analysis: core concepts, requirement types, knowledge areas and techniques.', refs: ['babok'] },
  { id: 'pmbok', type: 'framework', name: 'PMBOK® Guide 7th ed.', short: 'PMBOK', icon: 'ListChecks', color: 'accent',
    desc: 'PMI’s guide to project management: principles, performance domains, development approaches and tools.', refs: ['pmbok'] },
  { id: 'banking', type: 'domain', name: 'Banking & Fintech', short: 'Banking', icon: 'Landmark', color: 'primary' },
  { id: 'ecommerce', type: 'domain', name: 'E-commerce & Retail', short: 'E-commerce', icon: 'ShoppingCart', color: 'po' },
  { id: 'healthcare', type: 'domain', name: 'Healthcare', short: 'Healthcare', icon: 'HeartPulse', color: 'danger' },
  { id: 'insurance', type: 'domain', name: 'Insurance', short: 'Insurance', icon: 'Shield', color: 'success' },
  { id: 'logistics', type: 'domain', name: 'Logistics & Supply Chain', short: 'Logistics', icon: 'Truck', color: 'accent' },
  { id: 'education', type: 'domain', name: 'Education (EdTech)', short: 'Education', icon: 'GraduationCap', color: 'primary' },
  { id: 'telecom', type: 'domain', name: 'Telecom', short: 'Telecom', icon: 'Smartphone', color: 'po' },
  { id: 'hr', type: 'domain', name: 'HR & Payroll', short: 'HR', icon: 'Users', color: 'accent' },
];

const raw = [
  // ---------- IT INDUSTRY ----------
  ['it', 'SDLC', 1, 'SDLC', 'Software Development Life Cycle', 'The stages a software product goes through: plan, analyse, design, build, test, release and maintain.', 'Our SDLC is Agile, so we go through every stage in each two-week sprint.', 'Vòng đời phát triển phần mềm'],
  ['it', 'SDLC', 1, 'Requirement', '', 'A need or condition the system must meet to solve a business problem.', 'Can we write this requirement so the testers can check it?', 'Yêu cầu'],
  ['it', 'SDLC', 1, 'Functional requirement', '', 'What the system must do — a feature or behaviour.', 'Sending an order confirmation email is a functional requirement.', 'Yêu cầu chức năng'],
  ['it', 'SDLC', 1, 'Non-functional requirement', 'NFR', 'How well the system must work — speed, security, availability or ease of use.', 'The page must load in under 2 seconds — that is a non-functional requirement.', 'Yêu cầu phi chức năng'],
  ['it', 'SDLC', 1, 'MVP', 'Minimum Viable Product', 'The smallest version of a product that can test an idea with real users.', 'Let’s launch an MVP with card payments only and add wallets later.', 'Sản phẩm khả dụng tối thiểu'],
  ['it', 'SDLC', 2, 'Scope creep', '', 'When new requirements keep being added after the scope was agreed, without changing time or budget.', 'Adding three new reports in the middle of the sprint is scope creep.', 'Phình phạm vi'],
  ['it', 'SDLC', 2, 'Technical debt', '', 'Extra future work caused by choosing a quick solution now instead of a better one that takes longer.', 'If we skip the refactoring to hit the deadline, we are adding technical debt.', 'Nợ kỹ thuật'],
  ['it', 'SDLC', 2, 'Change request', 'CR', 'A formal request to change something already agreed — scope, design or timeline.', 'Please raise a change request so we can estimate the impact.', 'Yêu cầu thay đổi'],
  ['it', 'Architecture', 1, 'API', 'Application Programming Interface', 'A set of rules that lets two software systems talk to each other.', 'The mobile app gets prices from the server through an API.', 'Giao diện lập trình ứng dụng'],
  ['it', 'Architecture', 1, 'Frontend', '', 'The part of the system that users see and click — screens, buttons and forms.', 'The bug is in the frontend; the data from the server is correct.', 'Giao diện phía người dùng'],
  ['it', 'Architecture', 1, 'Backend', '', 'The server side that stores data and runs business logic users don’t see.', 'The discount is calculated in the backend.', 'Phía máy chủ'],
  ['it', 'Architecture', 2, 'Integration', '', 'Connecting two systems so they can share data or trigger actions.', 'We need an integration with the shipping partner to get tracking numbers.', 'Tích hợp hệ thống'],
  ['it', 'Architecture', 3, 'Microservices', '', 'An architecture where the system is split into small, independent services.', 'Payments is its own microservice, so it can be released separately.', 'Kiến trúc vi dịch vụ'],
  ['it', 'Data', 1, 'Database', '', 'An organised store of data that the system reads and writes.', 'Customer addresses are saved in the database.', 'Cơ sở dữ liệu'],
  ['it', 'Data', 2, 'SQL', 'Structured Query Language', 'A language for reading and changing data in a relational database.', 'I wrote a quick SQL query to count orders per day.', 'Ngôn ngữ truy vấn dữ liệu'],
  ['it', 'Data', 2, 'Data migration', '', 'Moving data from an old system to a new one.', 'Data migration is planned for the weekend before go-live.', 'Chuyển đổi dữ liệu'],
  ['it', 'Data', 1, 'Dashboard', '', 'A screen that shows key numbers and charts in one place.', 'The sales dashboard updates every hour.', 'Bảng tổng hợp số liệu'],
  ['it', 'Testing', 1, 'UAT', 'User Acceptance Testing', 'The last stage of testing, where real business users check that the system does what they need before it goes live.', 'UAT starts on Monday — please book two hours with the finance team.', 'Kiểm thử chấp nhận người dùng'],
  ['it', 'Testing', 1, 'Bug', 'Defect', 'A problem that makes the system behave differently from what was expected.', 'I logged a bug: the total does not include tax.', 'Lỗi phần mềm'],
  ['it', 'Testing', 1, 'Test case', '', 'Step-by-step instructions and the expected result for checking one behaviour.', 'Each acceptance criterion should have at least one test case.', 'Ca kiểm thử'],
  ['it', 'Testing', 2, 'Regression testing', '', 'Re-testing existing features to make sure a new change did not break them.', 'Run regression testing on checkout before the release.', 'Kiểm thử hồi quy'],
  ['it', 'Testing', 2, 'SIT', 'System Integration Testing', 'Testing that connected systems work correctly together. Done by the tech/QA team before UAT.', 'SIT found that the payment gateway returns the wrong status.', 'Kiểm thử tích hợp hệ thống'],
  ['it', 'DevOps', 1, 'Environment', 'Dev · Test · Staging · Production', 'A separate copy of the system used for one purpose, such as testing or live use.', 'It works on staging but not in production.', 'Môi trường'],
  ['it', 'DevOps', 1, 'Deployment', '', 'Putting a new version of the software onto an environment.', 'Deployment to production is at 10 pm to avoid peak traffic.', 'Triển khai'],
  ['it', 'DevOps', 2, 'CI/CD', 'Continuous Integration / Continuous Delivery', 'Automatically building, testing and releasing code in small, frequent steps.', 'With CI/CD we can release several times a day.', 'Tích hợp và triển khai liên tục'],
  ['it', 'DevOps', 1, 'Go-live', '', 'The moment a new system or feature becomes available to real users.', 'Go-live is planned for 1 December.', 'Thời điểm vận hành chính thức'],
  ['it', 'DevOps', 2, 'Rollback', '', 'Returning to the previous version after a failed release.', 'The release broke login, so we did a rollback.', 'Hoàn tác phiên bản'],
  ['it', 'Security', 2, 'Authentication', '', 'Checking who a user is, for example with a password or a one-time code.', 'We use OTP for authentication on new devices.', 'Xác thực'],
  ['it', 'Security', 2, 'Authorization', '', 'Checking what a logged-in user is allowed to do.', 'Only managers have authorization to approve refunds.', 'Phân quyền'],

  // ---------- TEAM COLLABORATION ----------
  ['team', 'Framework', 1, 'Scrum', '', 'A way of building products in short cycles called sprints, with set roles, events and artefacts.', 'We follow Scrum with two-week sprints.', 'Khung làm việc Scrum'],
  ['team', 'Framework', 1, 'Agile', '', 'A way of working that delivers in small steps, gets feedback early and adapts to change.', 'In an Agile team, we release a little every sprint instead of everything at the end.', 'Phương pháp linh hoạt (Agile)'],
  ['team', 'Roles', 1, 'Product Owner', 'PO', 'The person accountable for the value of the product and for ordering the backlog.', 'Ask the PO whether this goes into the next sprint.', 'Chủ sở hữu sản phẩm'],
  ['team', 'Roles', 1, 'Scrum Master', '', 'The person who helps the team follow Scrum and removes blockers.', 'The Scrum Master will run the retrospective.', 'Người điều phối Scrum'],
  ['team', 'Roles', 1, 'Stakeholder', '', 'Anyone affected by or interested in the project — users, managers, clients or regulators.', 'We need sign-off from all key stakeholders.', 'Bên liên quan'],
  ['team', 'Artefacts', 1, 'Backlog', 'Product Backlog', 'An ordered list of everything the team might work on.', 'I added the new report to the backlog.', 'Danh sách công việc (backlog)'],
  ['team', 'Artefacts', 1, 'User story', '', 'A short description of a feature from the user’s point of view: As a…, I want…, so that….', 'Let’s split this user story — it is too big for one sprint.', 'Câu chuyện người dùng'],
  ['team', 'Artefacts', 1, 'Epic', '', 'A large piece of work that is split into many user stories.', 'Online payments is an epic with eight stories.', 'Nhóm công việc lớn (epic)'],
  ['team', 'Artefacts', 1, 'Acceptance criteria', '', 'The conditions a user story must meet to be accepted by the Product Owner or client.', 'Let’s agree on the acceptance criteria before the developers start estimating.', 'Tiêu chí chấp nhận'],
  ['team', 'Artefacts', 2, 'Definition of Done', 'DoD', 'A shared checklist every item must meet to count as finished.', 'It is not done yet — code review is part of our Definition of Done.', 'Định nghĩa hoàn thành'],
  ['team', 'Artefacts', 2, 'Increment', '', 'The usable, finished output of a sprint.', 'This sprint’s increment includes guest checkout.', 'Phần sản phẩm hoàn thành'],
  ['team', 'Events', 1, 'Sprint', '', 'A fixed time-box, usually 1–4 weeks, in which the team builds a usable increment.', 'This sprint we are focusing on checkout.', 'Chu kỳ phát triển (sprint)'],
  ['team', 'Events', 1, 'Daily stand-up', 'Daily Scrum', 'A 15-minute daily meeting to share progress, plans and blockers.', 'Let’s discuss that after the stand-up.', 'Họp nhanh hằng ngày'],
  ['team', 'Events', 1, 'Sprint planning', '', 'A meeting at the start of a sprint to decide what to build and how.', 'Bring your estimates to sprint planning.', 'Họp lập kế hoạch sprint'],
  ['team', 'Events', 1, 'Sprint review', '', 'A meeting at the end of a sprint where the team shows what they built and gets feedback.', 'The client will join the sprint review on Friday.', 'Họp đánh giá sprint'],
  ['team', 'Events', 1, 'Retrospective', 'Retro', 'A meeting at the end of a sprint to improve how the team works.', 'In the retro we agreed to start stand-up on time.', 'Họp cải tiến (retro)'],
  ['team', 'Events', 2, 'Backlog refinement', 'Grooming', 'Regular work to clarify, split and estimate upcoming backlog items.', 'Let’s take this story to refinement on Wednesday.', 'Tinh chỉnh backlog'],
  ['team', 'Ways of working', 2, 'Velocity', '', 'The amount of work a team usually finishes in a sprint, often counted in story points.', 'Our velocity is about 30 points.', 'Tốc độ hoàn thành của nhóm'],
  ['team', 'Ways of working', 2, 'Story points', '', 'A relative estimate of the effort and complexity of a backlog item.', 'Is this a 3 or a 5?', 'Điểm ước lượng'],
  ['team', 'Ways of working', 1, 'Blocker', '', 'Something that stops you from continuing your work.', 'My blocker is that I don’t have access to the test environment.', 'Trở ngại'],
  ['team', 'Ways of working', 2, 'Timebox', '', 'A fixed maximum amount of time for an activity.', 'Let’s timebox this discussion to 10 minutes.', 'Giới hạn thời gian'],
  ['team', 'Ways of working', 3, 'Product Goal', '', 'The long-term objective the Scrum team works toward.', 'Our Product Goal is to make reordering take under 30 seconds.', 'Mục tiêu sản phẩm'],

  // ---------- CORPORATE LANGUAGE ----------
  ['corp', 'Meetings', 1, 'Circle back', '', 'To return to a topic later.', 'Let’s circle back on pricing next week.', 'Quay lại bàn sau'],
  ['corp', 'Meetings', 1, 'Take this offline', '', 'To continue a discussion after the meeting, with only the people involved.', 'This is getting detailed — let’s take it offline.', 'Bàn riêng sau cuộc họp'],
  ['corp', 'Meetings', 1, 'Action item', '', 'A task someone agreed to do after a meeting, with an owner and a date.', 'Action item: Christine to send the updated flow by Thursday.', 'Đầu việc cần làm'],
  ['corp', 'Meetings', 1, 'Let me get back to you', '', 'A polite way to say you need time to check before answering.', 'Good question — let me get back to you by tomorrow.', 'Để tôi kiểm tra rồi phản hồi'],
  ['corp', 'Meetings', 2, 'Sign-off', '', 'Formal approval that something is accepted.', 'We need the client’s sign-off before go-live.', 'Phê duyệt chính thức'],
  ['corp', 'Meetings', 2, 'Low-hanging fruit', '', 'A quick, easy win.', 'Fixing the button label is low-hanging fruit.', 'Việc dễ, hiệu quả nhanh'],
  ['corp', 'Email', 1, 'FYI', 'For Your Information', 'Shared just so you know — no action needed.', 'FYI — the release has moved to Thursday.', 'Để bạn nắm thông tin'],
  ['corp', 'Email', 1, 'EOD', 'End of Day', 'By the end of today’s working day.', 'I’ll send the notes by EOD.', 'Cuối ngày làm việc'],
  ['corp', 'Email', 1, 'Heads-up', '', 'An early warning so someone can prepare.', 'Just a heads-up: the client may ask about the delay.', 'Báo trước'],
  ['corp', 'Email', 1, 'Loop in', '', 'To add someone to a conversation or email thread.', 'I’ll loop in the tech lead.', 'Thêm ai đó vào trao đổi'],
  ['corp', 'Status updates', 1, 'Bandwidth', '', 'Your available time or capacity to take on work.', 'I don’t have the bandwidth for this until next sprint.', 'Khả năng nhận thêm việc'],
  ['corp', 'Status updates', 1, 'ETA', 'Estimated Time of Arrival', 'When something is expected to be ready.', 'What’s the ETA for the fix?', 'Thời gian dự kiến xong'],
  ['corp', 'Status updates', 1, 'On track', '', 'Progressing as planned.', 'UAT is on track for Friday.', 'Đúng tiến độ'],
  ['corp', 'Status updates', 2, 'Escalate', '', 'To raise an issue to a more senior person so it gets solved.', 'If the vendor doesn’t reply today, I’ll escalate.', 'Báo cáo lên cấp trên'],
  ['corp', 'Polite disagreement', 2, 'I see your point, but…', '', 'A polite way to disagree while showing you listened.', 'I see your point, but the data shows most users are on mobile.', 'Tôi hiểu ý bạn, nhưng…'],
  ['corp', 'Polite disagreement', 2, 'Could we consider…?', '', 'A soft way to suggest an alternative.', 'Could we consider releasing it in two phases?', 'Chúng ta có thể cân nhắc…?'],

  // ---------- BANKING ----------
  ['banking', 'Compliance', 1, 'KYC', 'Know Your Customer', 'Checking who a customer really is before opening an account.', 'The new app does KYC with an ID scan and a selfie.', 'Định danh khách hàng'],
  ['banking', 'Compliance', 2, 'AML', 'Anti-Money Laundering', 'Rules and checks that stop criminals hiding illegal money through the bank.', 'Large transfers are flagged for AML review.', 'Phòng chống rửa tiền'],
  ['banking', 'Systems', 2, 'Core banking', '', 'The central system that keeps accounts, balances and transactions.', 'Any change to interest rates must go through core banking.', 'Hệ thống ngân hàng lõi'],
  ['banking', 'Accounting', 2, 'Ledger', '', 'The record of all money movements for an account.', 'The ledger shows the refund was posted yesterday.', 'Sổ cái'],
  ['banking', 'Payments', 2, 'Settlement', '', 'The moment money actually moves between banks after a payment.', 'Card payments usually reach settlement the next working day.', 'Quyết toán / tất toán giao dịch'],
  ['banking', 'Cards', 2, 'Chargeback', '', 'Reversing a card payment after a customer disputes it.', 'The customer never received the goods, so we raised a chargeback.', 'Hoàn tiền do khiếu nại thẻ'],
  ['banking', 'Lending', 1, 'Credit scoring', '', 'Rating how likely a borrower is to repay a loan.', 'Her credit scoring result was high, so the loan was approved quickly.', 'Chấm điểm tín dụng'],
  ['banking', 'Security', 1, 'OTP', 'One-Time Password', 'A short code, valid once, used to confirm a login or payment.', 'Enter the OTP we sent to your phone to confirm the transfer.', 'Mật khẩu dùng một lần'],
  ['banking', 'Payments', 3, 'Open banking', '', 'Letting approved third-party apps access bank data or start payments through APIs, with the customer’s consent.', 'With open banking, the budgeting app can read your transactions.', 'Ngân hàng mở'],

  // ---------- E-COMMERCE ----------
  ['ecommerce', 'Catalogue', 1, 'SKU', 'Stock Keeping Unit', 'A unique code for one specific product variant, such as a size and colour.', 'The red T-shirt in size M has its own SKU.', 'Mã hàng hoá'],
  ['ecommerce', 'Checkout', 1, 'Checkout', '', 'The steps a customer takes to pay for what is in their cart.', 'We cut checkout from five steps to three.', 'Quy trình thanh toán'],
  ['ecommerce', 'Checkout', 1, 'Cart abandonment', '', 'When shoppers add items to the cart but leave without buying.', 'Cart abandonment drops when shipping costs are shown early.', 'Bỏ giỏ hàng'],
  ['ecommerce', 'Metrics', 1, 'Conversion rate', '', 'The percentage of visitors who complete a purchase.', 'Our conversion rate went from 2% to 2.6% after the redesign.', 'Tỷ lệ chuyển đổi'],
  ['ecommerce', 'Orders', 2, 'Fulfilment', '', 'Everything that happens after an order is placed: picking, packing and shipping.', 'Fulfilment is handled by our warehouse partner.', 'Xử lý & giao đơn hàng'],
  ['ecommerce', 'Orders', 1, 'Return', 'RMA — Return Merchandise Authorisation', 'The process of a customer sending goods back for a refund or exchange.', 'Returns must be requested within 30 days.', 'Đổi trả hàng'],
  ['ecommerce', 'Marketing', 1, 'Promo code', '', 'A code customers enter at checkout to get a discount.', 'The promo code WELCOME10 gives 10% off the first order.', 'Mã giảm giá'],
  ['ecommerce', 'Business model', 2, 'Marketplace', '', 'A platform where many independent sellers list and sell products.', 'Shopee is a marketplace; our shop is a single brand.', 'Sàn thương mại điện tử'],

  // ---------- HEALTHCARE ----------
  ['healthcare', 'Systems', 1, 'EHR', 'Electronic Health Record', 'A digital record of a patient’s medical history, shared across care providers.', 'The doctor checked the allergy list in the EHR.', 'Hồ sơ sức khoẻ điện tử'],
  ['healthcare', 'Process', 1, 'Triage', '', 'Sorting patients by how urgently they need care.', 'Triage puts chest pain ahead of a sprained ankle.', 'Phân loại cấp cứu'],
  ['healthcare', 'Process', 1, 'Appointment scheduling', '', 'Booking, changing and cancelling patient visits.', 'Online appointment scheduling cut phone calls by half.', 'Đặt lịch khám'],
  ['healthcare', 'Data', 2, 'ICD code', 'International Classification of Diseases', 'A standard code for each diagnosis, used for records and insurance claims.', 'Every visit needs an ICD code before billing.', 'Mã bệnh quốc tế'],
  ['healthcare', 'Compliance', 2, 'Patient consent', '', 'The patient’s permission before their data is shared or a treatment is given.', 'We must record patient consent before sending data to the lab.', 'Sự đồng ý của bệnh nhân'],

  // ---------- INSURANCE ----------
  ['insurance', 'Basics', 1, 'Policy', '', 'The contract between the insurer and the customer.', 'Your policy covers fire and flood.', 'Hợp đồng bảo hiểm'],
  ['insurance', 'Basics', 1, 'Premium', '', 'The amount the customer pays for insurance cover.', 'The yearly premium is 4 million VND.', 'Phí bảo hiểm'],
  ['insurance', 'Process', 2, 'Underwriting', '', 'Assessing risk to decide whether to insure someone and at what price.', 'Underwriting asked for a health check before approving the policy.', 'Thẩm định rủi ro'],
  ['insurance', 'Process', 1, 'Claim', '', 'A request from the customer to be paid for a covered loss.', 'She submitted a claim with photos of the car damage.', 'Yêu cầu bồi thường'],
  ['insurance', 'Basics', 2, 'Deductible', '', 'The part of a loss the customer pays before the insurer pays the rest.', 'With a 2 million deductible, the insurer pays the amount above that.', 'Mức khấu trừ'],

  // ---------- LOGISTICS ----------
  ['logistics', 'Warehouse', 2, 'WMS', 'Warehouse Management System', 'Software that tracks stock, locations and picking inside a warehouse.', 'The WMS tells pickers which shelf to go to.', 'Hệ thống quản lý kho'],
  ['logistics', 'Delivery', 1, 'Last-mile delivery', '', 'The final step of delivery, from the local hub to the customer’s door.', 'Last-mile delivery is the most expensive part of shipping.', 'Giao hàng chặng cuối'],
  ['logistics', 'Delivery', 1, 'Tracking number', '', 'A code that lets customers follow their shipment.', 'Send the tracking number in the shipping email.', 'Mã vận đơn'],
  ['logistics', 'Delivery', 1, 'Proof of delivery', 'POD', 'Evidence that the parcel was delivered, such as a photo or signature.', 'The driver uploads a photo as proof of delivery.', 'Bằng chứng giao hàng'],
  ['logistics', 'Warehouse', 1, 'Inventory', '', 'The stock of goods a business holds.', 'Inventory is low for size S — reorder this week.', 'Hàng tồn kho'],

  // ---------- EDUCATION ----------
  ['education', 'Systems', 1, 'LMS', 'Learning Management System', 'A platform for running courses: content, assignments, grades and progress.', 'All lessons are uploaded to the LMS.', 'Hệ thống quản lý học tập'],
  ['education', 'Process', 1, 'Enrolment', '', 'Registering a learner on a course or programme.', 'Enrolment closes on 15 January.', 'Ghi danh'],
  ['education', 'Learning', 2, 'Learning outcome', '', 'What a learner should be able to do after the course.', 'Each lesson maps to one learning outcome.', 'Chuẩn đầu ra'],
  ['education', 'Systems', 1, 'Gradebook', '', 'Where teachers record and calculate learners’ scores.', 'Quiz scores go straight into the gradebook.', 'Sổ điểm'],

  // ---------- TELECOM ----------
  ['telecom', 'Products', 1, 'Prepaid', '', 'A plan where the customer pays before using the service.', 'Most students choose a prepaid SIM.', 'Thuê bao trả trước'],
  ['telecom', 'Products', 1, 'Postpaid', '', 'A plan where the customer is billed after using the service.', 'Postpaid customers get a bill on the 5th of each month.', 'Thuê bao trả sau'],
  ['telecom', 'Process', 1, 'SIM activation', '', 'Turning on a new SIM so it can connect to the network.', 'SIM activation now needs a face check.', 'Kích hoạt SIM'],
  ['telecom', 'Billing', 2, 'Billing cycle', '', 'The period of usage covered by one bill.', 'Your billing cycle runs from the 1st to the 30th.', 'Chu kỳ cước'],

  // ---------- HR & PAYROLL ----------
  ['hr', 'Process', 1, 'Onboarding', '', 'Everything that helps a new employee get started: accounts, training and introductions.', 'Onboarding takes two weeks for new BAs.', 'Hội nhập nhân viên mới'],
  ['hr', 'Payroll', 1, 'Payroll', '', 'Calculating and paying employees’ salaries, taxes and deductions.', 'Payroll runs on the 25th.', 'Tính & trả lương'],
  ['hr', 'Process', 1, 'Leave balance', '', 'How many days off an employee still has.', 'Check your leave balance before booking the holiday.', 'Số ngày phép còn lại'],
  ['hr', 'Performance', 2, 'Performance review', '', 'A regular meeting to assess an employee’s work and set goals.', 'Performance reviews happen every six months.', 'Đánh giá hiệu suất'],
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const extra = [...ROWS_SE_QA, ...ROWS_BABOK_PMBOK];

export const TERMS = [
  ...raw.map(([cat, sub, level, term, full, def, example, vi]) => ({ id: `${cat}-${slug(term)}`, cat, sub, level, term, full, def, example, vi })),
  ...extra.map(([cat, sub, level, term, full, def, example, tr]) => ({ id: `${cat}-${slug(term)}`, cat, sub, level, term, full, def, example, vi: tr.vi[0] })),
];

// Translations bundled with the newer glossary sets, keyed by term id: { vi: [term, def, example], ko, fr }.
export const EXTRA_TR = Object.fromEntries(extra.map(([cat, , , term, , , , tr]) => [`${cat}-${slug(term)}`, tr]));

export const TERM_BY_ID = Object.fromEntries(TERMS.map((t) => [t.id, t]));
export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
export const termsIn = (cat) => TERMS.filter((t) => t.cat === cat);
export const findTerm = (word) => TERMS.find((t) => t.term.toLowerCase() === word.toLowerCase());
export const LEVEL_NAMES = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };
export const RARITY = { 1: 'Common', 2: 'Rare', 3: 'Epic' };
