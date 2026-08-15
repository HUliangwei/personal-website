import type { Locale } from '../i18n/types';
import { profileByLocale, type SchoolJourneyRecord } from './profile';

export type AboutJourneyMotif = 'electronics' | 'robot' | 'hardware' | 'spad' | 'learning' | 'physics' | 'quantum';

export interface AboutJourneyStage {
  id: string;
  title: string;
  detail: string;
  motif: AboutJourneyMotif;
  state?: string;
}

export interface AboutJourneyTrack {
  id: 'engineering' | 'physics-quantum';
  label: string;
  route: string;
  summary: string;
  stages: AboutJourneyStage[];
}

export interface AboutWorkflow {
  id: 'ic' | 'robotics' | 'quantum';
  title: string;
  context: string;
  steps: string[];
}

export interface AboutSideQuest {
  title: string;
  description: string;
  state: string;
}

export interface AboutContent {
  intro: {
    eyebrow: string;
    title: string;
    summary: string;
    visualLabel: string;
    visualSteps: string[];
  };
  schools: SchoolJourneyRecord[];
  schoolNotes: Record<SchoolJourneyRecord['id'], string>;
  engineeringTrack: AboutJourneyTrack;
  physicsQuantumTrack: AboutJourneyTrack;
  workflows: AboutWorkflow[];
  workflowIntro: string;
  now: {
    title: string;
    summary: string;
    stages: string[];
  };
  sideQuests: {
    intro: string;
    explorations: AboutSideQuest[];
  };
}

const zhProfile = profileByLocale.zh;
const enProfile = profileByLocale.en;

export const aboutByLocale: Record<Locale, AboutContent> = {
  zh: {
    intro: {
      eyebrow: '关于',
      title: '关于我',
      summary: '我是胡良玮。本科物理训练让我从模型和规律理解问题，智能小车让我第一次把视觉、控制和硬件连成完整系统；研究生阶段，我把工程重心进一步下沉到 SPAD 单光子探测器读出芯片，同时继续探索量子计算与具身智能。',
      visualLabel: '从系统工程与物理基础走向芯片设计和智能计算的双轨路径',
      visualSteps: ['系统工程', 'SPAD 芯片', '物理基础', '量子探索'],
    },
    schools: zhProfile.schoolJourney,
    schoolNotes: {
      'primary-school': '在宣城开始求学，完成六年小学阶段学习。',
      'middle-school': '在宣城市第十二中学完成三年初中阶段学习。',
      'high-school': '在宣城中学完成三年高中阶段学习，随后进入武汉大学物理学专业。',
      undergraduate: '武汉大学物理学本科阶段建立了经典物理、量子力学、计算、电路与数字逻辑基础，也通过智能小车第一次把视觉、控制和硬件连成完整系统。',
      graduate: '中国科学技术大学量子科学与技术硕士阶段，当前围绕半导体单光子探测器及读出电路推进 SPAD 芯片设计与验证。',
    },
    engineeringTrack: {
      id: 'engineering',
      label: '工程主线',
      route: '智能小车 → SPAD 芯片 → 具身智能',
      summary: '从本科的系统集成出发，逐步深入板级硬件与专用芯片，再把视野重新延伸到机器人学习与算法。',
      stages: [
        { id: 'mobile-robot', title: '智能小车', detail: '本科项目把 Python / YOLO 视觉、ROS 任务逻辑、上下位机通信、MCU 和电机控制连接成可运行的任务闭环。', motif: 'robot' },
        { id: 'embedded-board', title: '嵌入式与板级设计', detail: '从上位机程序和下位机控制继续深入接口、PCB、FPGA 测试逻辑以及传感与执行链路。', motif: 'hardware' },
        { id: 'spad-board', title: 'SPAD 板级读出', detail: '研究生阶段先完成 SPAD 板级读出、主动淬灭与复位、FPGA 测试板及验证链路，把探测器、板卡和 FPGA 连成完整系统。', motif: 'hardware' },
        { id: 'spad-ic-design', title: 'SPAD 芯片设计', detail: '在板级原型基础上继续推进 1×16 通道专用读出芯片，覆盖模拟前端、数字控制、跨电压域、整体版图以及 PEX 与后仿真。', motif: 'spad' },
        { id: 'embodied-ai-learning', title: '具身智能学习', detail: '在理解完整机器人系统之后，开始向机器人仿真、模仿学习和动作生成等算法层继续学习。', motif: 'learning', state: '学习中' },
      ],
    },
    physicsQuantumTrack: {
      id: 'physics-quantum',
      label: '物理与量子主线',
      route: '物理学 → 超导量子比特 → 量子计算',
      summary: '从本科物理与量子力学出发，通过超导量子比特相关实习和研究生专业学习，继续向量子计算与量子通信拓展。',
      stages: [
        { id: 'physics-foundation', title: '物理学基础', detail: '武汉大学物理学本科阶段建立了经典物理、数学方法、建模与计算基础。', motif: 'physics' },
        { id: 'quantum-mechanics', title: '量子力学', detail: '本科量子力学与量子信息课程让我开始系统理解量子理论与信息处理的基本框架。', motif: 'quantum' },
        { id: 'superconducting-quantum', title: '超导量子比特', detail: '2023 年百度实习接触超导量子比特相关电路与微波结构，并使用 Ansys HFSS 完成三维电磁建模、参数扫描和场分布分析。', motif: 'quantum' },
        { id: 'quantum-science-technology', title: '量子科学与技术', detail: '研究生阶段继续学习量子材料与器件、量子光学等课程，并把器件、电路与量子技术放在同一个知识框架中理解。', motif: 'quantum' },
        { id: 'quantum-computing-exploration', title: '量子计算与量子通信', detail: '在现有物理与器件基础上，持续关注量子计算、量子通信及其工程实现。', motif: 'quantum', state: '持续探索' },
      ],
    },
    workflowIntro: '遇到一个新方向时，我通常先建立整体知识地图，先把完整链路跑通，再逐层深入到底层细节，并通过项目把理解落到实际问题上。',
    workflows: [
      { id: 'ic', title: '集成电路', context: 'SPAD 芯片设计与验证流程', steps: ['系统架构', '电路', '仿真', '版图', 'DRC / LVS', 'PEX'] },
      { id: 'robotics', title: '机器人系统', context: '本科智能小车的公开技术链路', steps: ['视觉感知', 'ROS 任务逻辑', '上下位机通信', 'MCU', '电机控制'] },
      { id: 'quantum', title: '超导量子比特', context: '从微波结构到电磁仿真的分析流程', steps: ['物理模型', '微波结构', 'HFSS', '参数扫描', '场分布分析'] },
    ],
    now: {
      title: 'SPAD 单光子探测器读出芯片',
      summary: '当前研究生工作的核心是一款 1×16 通道 SPAD 读出芯片，目前重点推进整体版图验证、PEX、版图后仿真与流片前系统验证。',
      stages: ['芯片设计', '版图', '验证', 'PEX', '版图后仿真', '流片准备'],
    },
    sideQuests: {
      intro: 'SPAD 芯片之外，我也持续关注量子计算、具身智能和嵌入式系统。它们来自不同阶段的学习与项目经历，也构成了我接下来愿意继续深入的方向。',
      explorations: [
        { title: '量子计算', description: '继续从物理、量子器件与工程实现三个层面理解量子计算与量子通信。', state: '持续探索' },
        { title: '具身智能', description: '沿着机器人系统经验继续学习仿真、模仿学习与动作生成。', state: '学习中' },
        { title: '嵌入式系统', description: '持续关注传感、通信、控制与执行机构如何组成完整硬件系统。', state: '工程兴趣' },
      ],
    },
  },
  en: {
    intro: {
      eyebrow: 'About',
      title: 'About Me',
      summary: "I'm Liangwei Hu. Physics taught me to approach problems through models and constraints, while an undergraduate mobile-robot project was my first experience connecting perception, control, and hardware into a complete system. In graduate study, I moved deeper into SPAD readout IC design while continuing to explore quantum computing and embodied AI.",
      visualLabel: 'Two paths from system engineering and physics foundations toward IC design and intelligent computing',
      visualSteps: ['System Engineering', 'SPAD IC', 'Physics Foundations', 'Quantum Exploration'],
    },
    schools: enProfile.schoolJourney,
    schoolNotes: {
      'primary-school': 'I began school in Xuancheng and completed six years of primary education.',
      'middle-school': 'I completed three years of middle school at Xuancheng No. 12 Middle School.',
      'high-school': 'I completed three years at Xuancheng High School before entering the Physics program at Wuhan University.',
      undergraduate: 'At Wuhan University, Physics built foundations in classical physics, quantum mechanics, computation, circuits, and digital logic; a mobile-robot project was my first complete software-and-hardware system.',
      graduate: 'At USTC, my Quantum Science and Technology master’s work now centers on semiconductor single-photon detectors and SPAD readout IC design and verification.',
    },
    engineeringTrack: {
      id: 'engineering',
      label: 'Engineering Track',
      route: 'Mobile Robot → SPAD IC → Embodied AI',
      summary: 'I started with system integration, moved progressively deeper into board-level hardware and a custom IC, and am now extending that system perspective toward robot learning.',
      stages: [
        { id: 'mobile-robot', title: 'Mobile Robot', detail: 'An undergraduate project connected Python / YOLO vision, ROS task logic, controller communication, an MCU, and motor control into a working task loop.', motif: 'robot' },
        { id: 'embedded-board', title: 'Embedded & Board Design', detail: 'From upper- and lower-controller integration, I moved deeper into interfaces, PCB work, FPGA test logic, and the sensing-to-actuation hardware path.', motif: 'hardware' },
        { id: 'spad-board', title: 'SPAD Board-level Readout', detail: 'Graduate work began with SPAD board-level readout, active quenching and reset, an FPGA test board, and an end-to-end detector–board–FPGA validation path.', motif: 'hardware' },
        { id: 'spad-ic-design', title: 'SPAD IC Design', detail: 'I then advanced the board prototype toward a custom 1×16-channel readout IC covering the analog front end, digital control, voltage-domain interfaces, physical layout, PEX, and post-layout simulation.', motif: 'spad' },
        { id: 'embodied-ai-learning', title: 'Embodied AI Learning', detail: 'After learning how a complete robot system is assembled, I began moving upward again toward simulation, imitation learning, and action-generation methods.', motif: 'learning', state: 'Learning' },
      ],
    },
    physicsQuantumTrack: {
      id: 'physics-quantum',
      label: 'Physics / Quantum Track',
      route: 'Physics → Superconducting Qubits → Quantum Computing',
      summary: 'Physics and quantum-mechanics foundations led into superconducting-qubit-related work, graduate study, and continued exploration of quantum computing and communication.',
      stages: [
        { id: 'physics-foundation', title: 'Physics Foundations', detail: 'The Physics program at Wuhan University established foundations in classical physics, mathematical methods, modeling, and computation.', motif: 'physics' },
        { id: 'quantum-mechanics', title: 'Quantum Mechanics', detail: 'Undergraduate Quantum Mechanics and Quantum Information courses gave me a structured introduction to quantum theory and information processing.', motif: 'quantum' },
        { id: 'superconducting-quantum', title: 'Superconducting Qubits', detail: 'During a 2023 Baidu internship, I worked with superconducting-qubit-related circuits and microwave structures and used Ansys HFSS for 3D electromagnetic modeling, parameter sweeps, and field analysis.', motif: 'quantum' },
        { id: 'quantum-science-technology', title: 'Quantum Science & Technology', detail: 'Graduate coursework in quantum materials and devices, quantum optics, and related subjects continues to connect devices, circuits, and quantum technologies in one framework.', motif: 'quantum' },
        { id: 'quantum-computing-exploration', title: 'Quantum Computing & Communication', detail: 'Building on that physics and device background, I continue to explore quantum computing, quantum communication, and their engineering implementations.', motif: 'quantum', state: 'Ongoing exploration' },
      ],
    },
    workflowIntro: 'When I enter a new area, I usually build a map of the whole problem first, get the complete path working, then go deeper layer by layer and test that understanding through a project.',
    workflows: [
      { id: 'ic', title: 'Integrated Circuits', context: 'SPAD IC design and verification flow', steps: ['System Architecture', 'Circuit', 'Simulation', 'Layout', 'DRC / LVS', 'PEX'] },
      { id: 'robotics', title: 'Robotic Systems', context: 'The public technical chain of the undergraduate mobile robot', steps: ['Visual Perception', 'ROS Task Logic', 'Controller Communication', 'MCU', 'Motor Control'] },
      { id: 'quantum', title: 'Superconducting Qubits', context: 'From microwave structures to electromagnetic analysis', steps: ['Physical Model', 'Microwave Structure', 'HFSS', 'Parameter Sweep', 'Field Analysis'] },
    ],
    now: {
      title: 'SPAD Single-Photon Detector Readout IC',
      summary: 'My current graduate work centers on a 1×16-channel SPAD readout IC, with the present focus on physical verification, PEX, post-layout simulation, and pre-tapeout system validation.',
      stages: ['IC Design', 'Layout', 'Verification', 'PEX', 'Post-layout Simulation', 'Tape-out Preparation'],
    },
    sideQuests: {
      intro: 'Beyond the SPAD IC project, I continue to explore quantum computing, embodied AI, and embedded systems. Each grew out of a different part of my study and project experience, and each is a direction I want to keep developing.',
      explorations: [
        { title: 'Quantum Computing', description: 'Continuing to study quantum computing and communication from the perspectives of physics, devices, and engineering implementation.', state: 'Ongoing exploration' },
        { title: 'Embodied AI', description: 'Extending my robotics background toward simulation, imitation learning, and action generation.', state: 'Learning' },
        { title: 'Embedded Systems', description: 'Continuing to study how sensing, communication, control, and actuation become a complete hardware system.', state: 'Engineering interest' },
      ],
    },
  },
};
