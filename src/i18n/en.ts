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
    about: { title: 'About | Liangwei Hu', description: "Liangwei Hu's education journey from Xuancheng to Wuhan University and USTC, plus the engineering and physics / quantum tracks behind his current work." },
    projects: { title: 'Projects | Liangwei Hu', description: 'Four core projects: SPAD IC Design, Mobile Robot, Superconducting Quantum Computing, and Embodied AI Learning.' },
    cv: { title: 'CV | Liangwei Hu', description: 'Published CVs for integrated circuits and embodied AI, official course grades, and a Quantum Computing CV in preparation.' },
  },
  home: {
    hero: {
      eyebrow: 'Hello — I am',
      summary: 'My current graduate work centers on SPAD single-photon detector readout IC design, alongside ongoing exploration of embodied AI, quantum computing, and embedded systems.',
      curiosity: 'I enjoy learning, tinkering with technology, and trying unfamiliar things—while making time for sport, music, games, and friends.',
      projectsAction: 'Explore projects', cvAction: 'View CV',
      diagramTitle: 'Personal portrait (temporarily a plush-doll model)',
      diagramDescription: 'A personal 3D portrait, currently represented by a plush-doll model instead of a real likeness.',
      diagramLabels: ['Device / Sensor', 'Signal', 'IC / Compute', 'Intelligent System / Robot'],
    },
    focus: {
      eyebrow: '01 / Current Focus', title: 'Current Focus', description: 'SPAD IC design is my current research focus, alongside continuing interests in embodied AI, quantum computing, and embedded systems.',
      areas: [
        { title: 'SPAD IC Design', state: 'Graduate Research', description: 'A 1×16-channel mixed-signal readout IC, with current work on physical verification, PEX, post-layout simulation, and pre-tapeout preparation.' },
        { title: 'Embodied AI', state: 'Learning & Exploration', description: 'Building on my mobile-robot experience, I am learning robot simulation, imitation learning, and action generation.' },
        { title: 'Quantum Computing', state: 'Academic Interest', description: 'Building on physics and superconducting-qubit simulation experience, I continue exploring quantum computing and communication.' },
        { title: 'Embedded Systems', state: 'Engineering Interest', description: 'I continue to explore how sensing, communication, control, and actuation come together in complete hardware systems.' },
      ],
    },
    projects: {
      eyebrow: '02 / Selected Projects', title: 'Selected Projects', all: 'All projects',
    },
    toolkit: {
      eyebrow: '03 / Technical Toolkit', title: 'Technical Toolkit', description: 'A working toolkit spanning IC design, digital hardware, robotics, quantum simulation, and day-to-day development.',
      groups: [
        { title: 'IC Design', items: ['Cadence Virtuoso', 'Spectre / ADE', 'Calibre', 'DRC / LVS / PEX', 'Layout', 'Analog / Mixed-Signal Design'], learning: false, note: '' },
        { title: 'Digital / HDL', items: ['FPGA', 'Digital Logic', 'Digital Control'], learning: false, note: '' },
        { title: 'Robotics & Embedded', items: ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control', 'Hardware Communication'], learning: false, note: '' },
        { title: 'Quantum / Simulation', items: ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep', 'Field Analysis'], learning: false, note: '' },
        { title: 'Development Tools', items: ['Git', 'GitHub'], learning: false, note: '' },
        { title: 'Robot Learning (Learning)', items: ['Robot Simulation', 'Imitation Learning', 'Action Generation'], learning: true, note: '' },
      ],
    },
    interests: { eyebrow: '04 / Life & Interests', title: 'Life & Interests', description: 'Off the clock, I like a mix of sport, music, tabletop games, and long sessions in a few favourite game worlds.', activitiesLabel: 'Off the Clock', gamesLabel: 'Games I Return To' },
    contact: { eyebrow: '05 / Contact', title: "Let's Connect", description: 'For a project conversation, research exchange, or a simple hello, these are the best ways to reach me.', cvAction: 'View CV' },
  },
  about: {
    education: { eyebrow: '01 / Education', title: 'Education Journey', intro: 'From primary, middle, and high school in Xuancheng to Physics at Wuhan University and Quantum Science and Technology at USTC.' },
    technicalJourney: { eyebrow: '02 / Technical Journey', title: 'Two technical tracks', intro: 'One engineering path moves from complete systems into board-level hardware and a custom IC, then back toward intelligent algorithms; the other moves from physics into superconducting qubits and quantum computing.' },
    howIWork: { eyebrow: '03 / How I Work', title: 'Run the full path, then go deeper' },
    now: { eyebrow: '04 / Now', title: 'Now' },
    sideQuests: { eyebrow: '05 / Side Quests', title: 'Side Quests', interestsLabel: 'Life & Interests', gamesLabel: 'Games I Play' },
  },
  projects: {
    intro: { eyebrow: 'Projects', title: 'Four Core Projects', description: 'Four projects from different stages of my technical journey: SPAD IC design, a vision-guided mobile robot, superconducting quantum computing, and embodied AI learning.' },
    date: 'Date', status: 'Status', highlights: 'Highlights', completedTools: 'Completed Tools', learningTopics: 'Learning Topics', coverPending: 'Conceptual project diagram', coverAltSuffix: 'cover',
    categories: { 'Integrated Circuits': 'IC Design', Robotics: 'Robotics / Embedded', 'Embodied AI': 'Embodied AI', Quantum: 'Quantum Computing', Software: 'Software' },
  },
  cv: {
    eyebrow: 'CV', title: 'CVs for different technical directions.', intro: 'Review my academic background, course grades, and three technical tracks; published CVs can be previewed, opened, or downloaded on demand.',
    sections: {
      versionsEyebrow: 'CV Versions',
      versionsTitle: 'Three technical tracks',
    },
    tracks: [
      { title: 'Integrated Circuits', description: 'A CV tailored to integrated-circuit design and related engineering work.', pdf: '/cv/liangwei-hu-ic-design.pdf', available: true },
      { title: 'Embodied AI', description: 'A CV tailored to robotics, embodied intelligence, and AI systems work.', pdf: '/cv/liangwei-hu-embodied-ai.pdf', available: true },
      { title: 'Quantum Computing', description: 'Quantum Computing CV in preparation.', pdf: '', available: false },
    ],
    actions: { groupSuffix: 'PDF actions', preview: 'Preview PDF', hidePreview: 'Hide preview', open: 'Open PDF', download: 'Download PDF', fallbackPrefix: 'Your browser cannot display this PDF inline.', fallbackLink: 'Open PDF', comingSoon: 'Preparing' },
  },
} as const satisfies Dictionary;

export default en;
