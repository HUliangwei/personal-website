import type { Dictionary } from './types';

const en = {
  localeName: 'English', alternateLocaleName: '中文', htmlLang: 'en', ogLocale: 'en_US', siteName: 'Liangwei Hu',
  siteDescription: 'Liangwei Hu’s research and engineering portfolio across intelligent hardware, integrated circuits, robotics, and embodied AI.',
  skipLink: 'Skip to main content',
  navigation: {
    label: 'Primary navigation', open: 'Open navigation menu', close: 'Close navigation menu', toggle: 'Toggle navigation', languageSwitch: 'Switch to 中文',
    items: [{ path: '/', label: 'Home' }, { path: '/about', label: 'About' }, { path: '/projects', label: 'Projects' }, { path: '/cv', label: 'CV' }],
  },
  footer: { label: 'Footer navigation', cv: 'CV', emailPending: 'Email: TODO' },
  meta: {
    home: { title: 'Liangwei Hu | Research & Engineering', description: 'A research and engineering portfolio spanning intelligent hardware, compute, and autonomous systems.' },
    about: { title: 'About | Liangwei Hu', description: 'A technical path from physical systems and intelligent hardware toward robotics and embodied AI.' },
    projects: { title: 'Projects | Liangwei Hu', description: 'Research and engineering case studies across integrated circuits, robotics, and embodied AI.' },
    cv: { title: 'CV | Liangwei Hu', description: 'CVs for integrated circuits and embodied AI, with a Quantum Computing track pending verification.' },
  },
  home: {
    hero: {
      eyebrow: 'Liangwei Hu', title: 'Research & Engineering', summary: 'A portfolio spanning intelligent hardware, compute, and autonomous systems.',
      disciplines: ['Integrated Circuits', 'Robotics', 'Embodied AI'], projectsAction: 'Explore projects', cvAction: 'View CV',
      diagramTitle: 'Device to intelligent system diagram',
      diagramDescription: 'A conceptual flow from device and sensor inputs through signal and integrated circuit compute stages to an intelligent system or robot.',
      diagramLabels: ['Device / Sensor', 'Signal', 'IC / Compute', 'Intelligent System / Robot'],
    },
    focus: { eyebrow: '01 / Direction', title: 'Current focus', description: 'Research directions to develop and document.', areas: ['Integrated Circuit Design', 'Robotics & Embodied AI', 'Intelligent Hardware', 'Quantum / Emerging Computing'] },
    projects: { eyebrow: '02 / Work', title: 'Selected projects', all: 'All projects' },
    capabilities: {
      eyebrow: '03 / Practice', title: 'Capabilities', description: 'A working map of technical areas; supporting details will be added from verified experience.',
      items: [['Hardware & circuits', 'TODO: Add verified methods and tools.'], ['Sensing & signals', 'TODO: Add verified methods and tools.'], ['Systems & robotics', 'TODO: Add verified methods and tools.'], ['Research practice', 'TODO: Add verified methods and tools.']],
    },
    timeline: { eyebrow: '04 / Path', title: 'Technical trajectory', stages: [['Foundations', 'Devices, signals, and integrated circuits.'], ['Systems', 'Sensing, compute, and autonomous systems.'], ['Next directions', 'TODO: Add verified milestones and dates.']] },
    contact: { eyebrow: '05 / Contact', title: 'Continue the conversation', description: 'Contact details are being prepared. TODO: Add a verified preferred contact method.', action: 'View CV' },
  },
  about: {
    hero: { eyebrow: 'About', title: 'A personal technical direction, still in progress.', summary: 'I am interested in how ideas move between physical systems, computation, and the ways machines sense and act in the world.', visualLabel: 'A conceptual path from hardware to embodied systems', visualSteps: ['Hardware', 'Signal', 'System', 'Action'] },
    statement: { eyebrow: 'A way of working', title: 'I like following a question across its layers.', body: 'That can mean starting with an electronic or sensing problem, then asking how its signals are processed, how a system makes use of them, and what changes when the system must operate in the physical world. This is a direction rather than a finished biography: the details belong to future, verified project writing.' },
    journey: {
      eyebrow: 'A developing path', title: 'My journey', intro: 'Not a list of roles—just the questions that have gradually led from one layer of technology to another.',
      stages: [['Electronics / Hardware', 'A foundation for thinking about physical constraints, signals, and the building blocks of technical systems.'], ['SPAD / IC', 'An interest in sensing and integrated-circuit questions: where a physical event becomes a usable signal.'], ['Robotics', 'A shift toward systems that combine sensing, computation, and interaction with an environment.'], ['Embodied AI', 'A continuing interest in learning and control when intelligence has to meet the constraints of a robot.']],
      pendingTitle: 'Quantum / emerging computing', pendingBody: 'TODO: Place quantum work here only after its real learning or project context is confirmed.',
    },
    education: { eyebrow: 'Context', title: 'Education', body: 'Formal education provides the context for this developing path, but it is not used here as a résumé entry.', pending: 'TODO: Add verified dates, institutions, and programme details before publishing.' },
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
