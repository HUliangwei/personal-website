import type { Dictionary } from './types';

const en = {
  localeName: 'English', alternateLocaleName: '中文', htmlLang: 'en', ogLocale: 'en_US', siteName: 'Liangwei Hu',
  siteDescription: 'Liangwei Hu’s research and engineering portfolio across intelligent hardware, integrated circuits, robotics, and embodied AI.',
  skipLink: 'Skip to main content',
  navigation: {
    label: 'Primary navigation', open: 'Open navigation menu', close: 'Close navigation menu', toggle: 'Toggle navigation', languageSwitch: 'Switch to 中文',
    items: [{ path: '/', label: 'Home' }, { path: '/about', label: 'About' }, { path: '/projects', label: 'Projects' }, { path: '/cv', label: 'CV' }],
  },
  footer: { label: 'Footer navigation', cv: 'CV', emailPending: '3036064607@qq.com' },
  meta: {
    home: { title: 'Liangwei Hu | Personal Technical Portfolio', description: 'Meet Liangwei Hu, a USTC graduate student working on SPAD readout IC design and exploring embodied AI, quantum computing, and embedded systems.' },
    about: { title: 'About | Liangwei Hu', description: 'A technical path from physical systems and intelligent hardware toward robotics and embodied AI.' },
    projects: { title: 'Projects | Liangwei Hu', description: 'Research and engineering case studies across integrated circuits, robotics, and embodied AI.' },
    cv: { title: 'CV | Liangwei Hu', description: 'CVs for integrated circuits and embodied AI, with a Quantum Computing track pending verification.' },
  },
  home: {
    hero: {
      eyebrow: 'Hello — I am', title: 'Liangwei Hu', education: "Master's student in Quantum Science and Technology at the University of Science and Technology of China",
      summary: 'My main graduate work is SPAD single-photon detector readout IC design. I also keep exploring embodied AI, quantum computing, and embedded systems beyond that research track.',
      curiosity: 'I enjoy learning, tinkering with technology, and trying unfamiliar things—while making time for sport, music, games, and friends.',
      projectsAction: 'Explore projects', cvAction: 'View CV',
      diagramTitle: 'Device to intelligent system diagram',
      diagramDescription: 'A conceptual flow from device and sensor inputs through signal and integrated circuit compute stages to an intelligent system or robot.',
      diagramLabels: ['Device / Sensor', 'Signal', 'IC / Compute', 'Intelligent System / Robot'],
    },
    focus: {
      eyebrow: '01 / Current Focus', title: 'Current Focus', description: 'One graduate research thread, with three broader directions I continue to explore.',
      areas: [
        { title: 'SPAD IC Design', state: 'Graduate Research', description: 'A 1×16-channel mixed-signal readout IC, now in post-layout simulation and pre-tapeout work.' },
        { title: 'Embodied AI', state: 'Learning & Exploration', description: 'Building a grounded map of robot-learning ideas without presenting the learning path as finished project experience.' },
        { title: 'Quantum Computing', state: 'Academic Interest', description: 'Following superconducting quantum computing from a physics background and simulation experience.' },
        { title: 'Embedded Systems', state: 'Engineering Interest', description: 'Interested in the interfaces that connect sensing, communication, control, and physical action.' },
      ],
    },
    projects: {
      eyebrow: '02 / Selected Projects', title: 'Selected Projects', all: 'All projects',
      entries: {
        spad: { title: 'SPAD IC Design', summary: 'A 1×16-channel mixed-signal SPAD readout IC at post-layout simulation and pre-tapeout stage.', date: '2024.09–Present', status: 'Graduate Research / In Progress', technologies: ['Cadence Virtuoso', 'Spectre', 'Calibre', 'FPGA'] },
        'mobile-robot': { title: 'Mobile Robot', summary: 'An undergraduate system connecting Python / YOLO vision, ROS task logic, MCU control, and motor actuation.', date: 'Undergraduate project', status: 'Completed', technologies: ['Python', 'YOLO', 'ROS', 'MCU'] },
        'quantum-hfss': { title: 'Superconducting Quantum Computing', summary: 'HFSS 3D electromagnetic simulation and geometry analysis of microwave structures related to superconducting quantum chips.', date: '2023.09–2023.12', status: 'Completed / Simulation Only', technologies: ['Ansys HFSS', '3D EM Simulation', 'Parameter Sweep'] },
        lerobot: { title: 'Embodied AI Learning', summary: 'An in-progress learning map for robot learning; it does not claim an unsupported end-to-end implementation.', date: 'Ongoing learning', status: 'Learning Project / In Progress', technologies: [] },
      },
    },
    toolkit: {
      eyebrow: '03 / Technical Toolkit', title: 'Technical Toolkit', description: 'Tools and methods drawn from the work shown here; learning directions remain visibly separate from completed experience.',
      groups: [
        { title: 'IC Design', items: ['Cadence Virtuoso', 'Spectre / ADE', 'Calibre', 'DRC / LVS / PEX', 'Layout', 'Analog / Mixed-Signal Design'], learning: false, note: '' },
        { title: 'Digital / HDL', items: ['FPGA', 'Digital Logic', 'Digital Control'], learning: false, note: '' },
        { title: 'Robotics & Embedded', items: ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control', 'Hardware Communication'], learning: false, note: '' },
        { title: 'Quantum / Simulation', items: ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep', 'Field Analysis'], learning: false, note: '' },
        { title: 'Development Tools', items: ['Git', 'GitHub', 'Astro', 'TypeScript'], learning: false, note: '' },
        { title: 'Robot Learning (Learning)', items: [], learning: true, note: 'Learning map — named tools and milestones are added only when supported by project artifacts.' },
      ],
    },
    interests: { eyebrow: '04 / Life & Interests', title: 'Life & Interests', description: 'Off the clock, I like a mix of sport, music, tabletop games, and long sessions in a few favourite game worlds.', activitiesLabel: 'Off the Clock', gamesLabel: 'Games I Return To' },
    contact: { eyebrow: '05 / Contact', title: "Let's Connect", description: 'For a project conversation, research exchange, or a simple hello, these are the best ways to reach me.', cvAction: 'View CV' },
  },
  about: {
    hero: { eyebrow: 'About', title: 'A technical path from physical signals to intelligent action.', summary: 'I began with physics and hardware, then followed signals through circuits and systems toward robotics and embodied learning—keeping the chronology and evidence boundary of each stage visible.', visualLabel: 'A conceptual path from hardware to embodied systems', visualSteps: ['Hardware', 'Signal', 'System', 'Action'] },
    statement: { eyebrow: 'A way of working', title: 'I like following a question across its layers.', body: 'That can mean starting with an electronic or sensing problem, then asking how its signals are processed, how a system makes use of them, and what changes when the system must operate in the physical world. This is a direction rather than a finished biography: the details belong to future, verified project writing.' },
    journey: {
      eyebrow: 'A developing path', title: 'My technical journey', intro: 'This is not a second CV. It is a chronology of questions: understanding physical constraints, making signals usable, and then building systems that can perceive, decide, and act.', statusLabel: '01 / 06',
    },
    education: { eyebrow: 'Context', title: 'Education', body: 'This is a concise map of the educational context behind the journey. GPA, coursework, and source classifications belong to the CV page.', focusLabel: 'Research focus' },
    interests: { eyebrow: 'Questions worth returning to', title: 'Research interests', items: [['Intelligent hardware', 'The relationship between sensing, signals, circuits, and computation.'], ['Robotics', 'Systems that make perception and action work together in a physical setting.'], ['Embodied AI', 'Learning and control that must account for a robot, its environment, and feedback.']] },
    connection: { eyebrow: 'One connected view', title: 'How the interests connect', visualLabel: 'Physical systems lead to sensing and signals, which lead to computation, which lead to embodied action.', steps: ['Physical systems', 'Sensing & signals', 'Computation', 'Embodied action'], body: 'The areas are distinct, but they meet at the same practical question: how can a technical system perceive, decide, and act with care for the constraints underneath it?' },
    profile: { eyebrow: 'Working across layers', title: 'Technical profile', items: [['Hardware & signals', 'Thinking from device and signal behaviour toward an implementable system.'], ['System building', 'Connecting components across interfaces instead of treating them as isolated tools.'], ['Research practice', 'Using experiments, iteration, and clear documentation to make questions testable.']] },
    focus: { eyebrow: 'Now', title: 'Current focus', body: 'I am continuing to connect work across integrated circuits, robotics, and embodied AI—while keeping the next concrete questions open until they can be described with evidence.', pending: 'TODO: Replace with a verified description of current research priorities.' },
    outside: { eyebrow: 'Perspective', title: 'Outside research', body: 'Good engineering benefits from curiosity beyond any one tool or discipline. This space is intentionally small until personal interests can be expressed in the author’s own, verified words.', pending: 'TODO: Add a personal note if and when it feels useful.' },
  },
  projects: {
    intro: { eyebrow: 'Engineering & Research', title: 'Projects', description: 'Project details remain explicitly marked TODO until verified.' },
    filterLabel: 'Filter projects by category', emptyState: 'No projects in this category yet.', allCategory: 'All', viewProject: 'View project', technologies: 'Technologies', coverPending: 'TODO: Add project cover image', coverAltSuffix: 'cover',
    categories: { 'Integrated Circuits': 'Integrated Circuits', Robotics: 'Robotics', 'Embodied AI': 'Embodied AI', Quantum: 'Quantum', Software: 'Software' },
    entries: {
      spad: { title: '1×16-Channel SPAD Readout IC', summary: 'A 1×16-channel mixed-signal readout IC for SPAD single-photon detection, now at post-layout simulation and pre-tapeout stage.' },
      lerobot: { title: 'LeRobot / ACT Learning Project', summary: 'An in-progress robot-learning project whose unsupported stages remain explicitly pending verification.' },
      'mobile-robot': { title: 'ROS-Based Mobile Robot', summary: 'An undergraduate mobile-robot project connecting Python / YOLO vision, ROS, MCU motor control, and a task loop.' },
      'quantum-hfss': { title: 'HFSS Electromagnetic Simulation for Quantum-Chip Structures', summary: 'HFSS 3D electromagnetic simulation and geometry optimization for superconducting-quantum-chip-related microwave structures during a Baidu internship.' },
    },
    detail: { back: 'All projects', date: 'Date', status: 'Status', role: 'Role', technologies: 'Technologies', links: 'Links', linksPending: 'TODO: Add verified project links.', coverPending: 'Project cover pending', descriptionPending: 'Project case-study details remain pending verification.', descriptionSuffix: 'Unverified details are not published as fact.' },
  },
  cv: {
    eyebrow: 'CV', title: 'CVs for different technical directions.', intro: 'Select a track to preview, open, or download its PDF.',
    tracks: [
      { title: 'Integrated Circuits', description: 'A CV tailored to integrated-circuit design and related engineering work.', pdf: '/cv/liangwei-hu-ic-design.pdf', available: true },
      { title: 'Embodied AI', description: 'A CV tailored to robotics, embodied intelligence, and AI systems work.', pdf: '/cv/liangwei-hu-embodied-ai.pdf', available: true },
      { title: 'Quantum Computing', description: 'A dedicated Quantum Computing CV will be published after its contents are verified.', pdf: '', available: false },
    ],
    actions: { groupSuffix: 'PDF actions', preview: 'Preview PDF', hidePreview: 'Hide preview', open: 'Open PDF', download: 'Download PDF', fallbackPrefix: 'Your browser cannot display this PDF inline.', fallbackLink: 'Open PDF', comingSoon: 'Coming soon — TODO: add the verified Quantum Computing CV PDF when it is available.' },
  },
} as const satisfies Dictionary;

export default en;
