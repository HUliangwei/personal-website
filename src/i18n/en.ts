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
    projects: { title: 'Projects | Liangwei Hu', description: 'Four evidence-bounded projects: SPAD IC Design, Mobile Robot, Superconducting Quantum Computing, and Embodied AI Learning.' },
    cv: { title: 'CV | Liangwei Hu', description: 'Published CVs for integrated circuits and embodied AI, official course grades, and a Quantum Computing CV in preparation.' },
  },
  home: {
    hero: {
      eyebrow: 'Hello — I am',
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
    },
    toolkit: {
      eyebrow: '03 / Technical Toolkit', title: 'Technical Toolkit', description: 'Tools and methods drawn from the work shown here; learning directions remain visibly separate from completed experience.',
      groups: [
        { title: 'IC Design', items: ['Cadence Virtuoso', 'Spectre / ADE', 'Calibre', 'DRC / LVS / PEX', 'Layout', 'Analog / Mixed-Signal Design'], learning: false, note: '' },
        { title: 'Digital / HDL', items: ['FPGA', 'Digital Logic', 'Digital Control'], learning: false, note: '' },
        { title: 'Robotics & Embedded', items: ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control', 'Hardware Communication'], learning: false, note: '' },
        { title: 'Quantum / Simulation', items: ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep', 'Field Analysis'], learning: false, note: '' },
        { title: 'Development Tools', items: ['Git', 'GitHub'], learning: false, note: '' },
        { title: 'Robot Learning (Learning)', items: [], learning: true, note: 'Learning map — named tools and milestones are added only when supported by project artifacts.' },
      ],
    },
    interests: { eyebrow: '04 / Life & Interests', title: 'Life & Interests', description: 'Off the clock, I like a mix of sport, music, tabletop games, and long sessions in a few favourite game worlds.', activitiesLabel: 'Off the Clock', gamesLabel: 'Games I Return To' },
    contact: { eyebrow: '05 / Contact', title: "Let's Connect", description: 'For a project conversation, research exchange, or a simple hello, these are the best ways to reach me.', cvAction: 'View CV' },
  },
  about: {
    education: { eyebrow: '01 / Education', title: 'Education Journey', intro: 'From primary, middle, and high school in Xuancheng to Wuhan University and USTC. No dates are published for the first three schools because none were provided.' },
    technicalJourney: { eyebrow: '02 / Technical Journey', title: 'Two technical tracks', intro: 'Engineering work and physics / quantum study influence each other without being forced into one timeline. Every stage stays within the evidence available from coursework, resumes, or project materials.' },
    howIWork: { eyebrow: '03 / How I Work', title: 'Run the full path, then go deeper' },
    now: { eyebrow: '04 / Now', title: 'Now' },
    sideQuests: { eyebrow: '05 / Side Quests', title: 'Side Quests', interestsLabel: 'Life & Interests', gamesLabel: 'Games I Play' },
  },
  projects: {
    intro: { eyebrow: 'Projects', title: 'Four Core Projects', description: 'Four bodies of work at different stages: IC design, mobile robotics, electromagnetic simulation, and embodied AI learning. Completed, in-progress, and planned work stay visibly distinct.' },
    date: 'Date', status: 'Status', highlights: 'Highlights', completedTools: 'Completed Tools', learningTopics: 'Learning Topics', coverPending: 'Conceptual diagram used', coverAltSuffix: 'cover',
    categories: { 'Integrated Circuits': 'IC Design', Robotics: 'Robotics / Embedded', 'Embodied AI': 'Embodied AI', Quantum: 'Quantum Computing', Software: 'Software' },
  },
  cv: {
    eyebrow: 'CV', title: 'CVs for different technical directions.', intro: 'Review my academic background, course grades, and three technical tracks; published CVs can be previewed, opened, or downloaded on demand.',
    sections: {
      versionsEyebrow: 'CV Versions',
      versionsTitle: 'Three technical tracks',
      transcriptsEyebrow: 'Public transcripts',
      transcriptsTitle: 'Academic transcripts',
      transcriptsIntro: 'The originals contain identity and verification details, so they are never published directly; both public redacted copies are currently being prepared.',
    },
    tracks: [
      { title: 'Integrated Circuits', description: 'A CV tailored to integrated-circuit design and related engineering work.', pdf: '/cv/liangwei-hu-ic-design.pdf', available: true },
      { title: 'Embodied AI', description: 'A CV tailored to robotics, embodied intelligence, and AI systems work.', pdf: '/cv/liangwei-hu-embodied-ai.pdf', available: true },
      { title: 'Quantum Computing', description: 'The Quantum Computing CV is being prepared; no PDF is available yet.', pdf: '', available: false },
    ],
    actions: { groupSuffix: 'PDF actions', preview: 'Preview PDF', hidePreview: 'Hide preview', open: 'Open PDF', download: 'Download PDF', fallbackPrefix: 'Your browser cannot display this PDF inline.', fallbackLink: 'Open PDF', comingSoon: 'Preparing — Coming soon; the Quantum Computing CV is not published yet.' },
  },
} as const satisfies Dictionary;

export default en;
