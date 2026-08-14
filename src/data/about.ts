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
    interests: string[];
    games: string[];
  };
}

const zhProfile = profileByLocale.zh;
const enProfile = profileByLocale.en;

export const aboutByLocale: Record<Locale, AboutContent> = {
  zh: {
    intro: {
      eyebrow: '关于',
      title: '关于我',
      summary: '我是胡良玮，本科在武汉大学学习物理学，目前在中国科学技术大学攻读量子科学与技术硕士。我的研究生主线是 SPAD 单光子探测器读出芯片设计；技术兴趣也从电子信息与机器人系统，延伸到超导量子计算和具身智能学习。',
      visualLabel: '从电子信息与物理基础走向 SPAD 芯片设计和量子技术的双轨路径',
      visualSteps: ['电子信息', '物理学', 'SPAD 芯片', '量子技术'],
    },
    schools: zhProfile.schoolJourney,
    schoolNotes: {
      'primary-school': '最早的学习起点，保持为一条简洁的个人教育记录。',
      'middle-school': '在宣城继续完成中学阶段学习。',
      'high-school': '高中阶段为之后的物理学习打下基础。',
      undergraduate: '物理学本科训练建立了经典物理、量子力学、计算、电路与数字逻辑基础，也通过智能小车把软硬件模块连接成系统。',
      graduate: '量子科学与技术硕士阶段，当前围绕半导体单光子探测器及读出电路开展 SPAD 芯片设计。',
    },
    engineeringTrack: {
      id: 'engineering',
      label: '工程主线',
      route: '电子信息 → SPAD 芯片设计',
      summary: '从系统实现逐渐深入到底层芯片，再把完整链路的视角延伸到机器人学习。',
      stages: [
        { id: 'electronic-information', title: '电子信息', detail: '电路、数字逻辑、计算与信号课程构成工程入口。', motif: 'electronics' },
        { id: 'mobile-robot', title: '智能小车', detail: '本科项目把 Python / YOLO 视觉、ROS、上下位机通信、MCU 和电机控制连接成任务闭环。', motif: 'robot' },
        { id: 'embedded-hardware', title: '嵌入式与硬件', detail: '从单个模块继续理解接口、控制与物理执行之间的关系。', motif: 'hardware' },
        { id: 'board-level-systems', title: '板级系统', detail: '通过板级控制、数据链路与 FPGA 联调理解读出系统如何落地。', motif: 'hardware' },
        { id: 'spad-ic-design', title: 'SPAD 芯片设计', detail: '当前工作深入到模拟前端、数字控制、物理实现与版图后验证。', motif: 'spad' },
        { id: 'embodied-ai-learning', title: '具身智能学习', detail: '把对感知—决策—行动闭环的兴趣延伸到机器人学习；这是持续学习方向，不表述为已完成研究成果。', motif: 'learning', state: '学习中' },
      ],
    },
    physicsQuantumTrack: {
      id: 'physics-quantum',
      label: '物理与量子主线',
      route: '量子科学与技术 → 超导量子计算',
      summary: '从本科物理基础进入量子力学，再在研究生专业与实习中继续理解量子器件和微波结构。',
      stages: [
        { id: 'physics-foundation', title: '物理学基础', detail: '本科阶段建立经典物理、数学建模与计算基础。', motif: 'physics' },
        { id: 'quantum-mechanics', title: '量子力学', detail: '本科课程提供量子理论基础；这里不延伸为实验或研究成果。', motif: 'quantum' },
        { id: 'quantum-science-technology', title: '量子科学与技术', detail: '研究生专业学习继续连接量子材料、器件、光学与计算兴趣。', motif: 'quantum' },
        { id: 'superconducting-quantum', title: '超导量子计算', detail: '2023 年百度实习围绕超导量子芯片相关微波结构，使用 Ansys HFSS 开展三维电磁仿真、参数扫描与场分布分析；范围仅限仿真。', motif: 'quantum' },
      ],
    },
    workflowIntro: '我习惯先建立知识地图并跑通完整链路，再逐层深入；下面用已核实的项目流程展示这种工作方式。',
    workflows: [
      { id: 'ic', title: '集成电路', context: 'SPAD 芯片设计与验证流程', steps: ['系统架构', '电路', '仿真', '版图', 'DRC / LVS', 'PEX'] },
      { id: 'robotics', title: '机器人系统', context: '本科智能小车的公开技术链路', steps: ['视觉感知', 'ROS 任务逻辑', '上下位机通信', 'MCU', '电机控制'] },
      { id: 'quantum', title: '量子器件仿真', context: '超导量子相关微波结构的仿真方法', steps: ['物理模型', '微波结构', 'HFSS', '参数扫描', '场分布分析'] },
    ],
    now: {
      title: 'SPAD 单光子探测器读出芯片',
      summary: '当前研究生主线是一款 1×16 通道 SPAD 读出芯片，处于版图后仿真与流片前准备阶段；这不是已流片或硅后实测的声明。',
      stages: ['芯片设计', '版图', '验证', 'PEX', '版图后仿真', '流片准备'],
    },
    sideQuests: {
      intro: '这些是持续探索的兴趣，不与当前 SPAD 研究主线混为一谈。离开技术路线图后，我也会运动、唱歌、打麻将和玩游戏。',
      explorations: [
        { title: '量子计算', description: '继续理解量子器件、计算与通信之间的联系。', state: '持续探索' },
        { title: '具身智能', description: '围绕机器人学习建立知识地图，当前保持学习项目定位。', state: '个人兴趣' },
        { title: '嵌入式系统', description: '持续关注传感、控制、通信与执行如何组成完整系统。', state: '个人兴趣' },
      ],
      interests: zhProfile.interests,
      games: zhProfile.games,
    },
  },
  en: {
    intro: {
      eyebrow: 'About',
      title: 'About Me',
      summary: "I'm Liangwei Hu. I studied Physics at Wuhan University and am now pursuing a master's in Quantum Science and Technology at the University of Science and Technology of China. My graduate focus is SPAD single-photon detector readout IC design, while my wider technical interests extend from electronic information and robotic systems to superconducting quantum computing and embodied AI learning.",
      visualLabel: 'Two paths from electronic information and physics foundations toward SPAD IC design and quantum technology',
      visualSteps: ['Electronic Information', 'Physics', 'SPAD IC', 'Quantum Technology'],
    },
    schools: enProfile.schoolJourney,
    schoolNotes: {
      'primary-school': 'The earliest point in my education journey, kept as a concise personal record.',
      'middle-school': 'I continued my secondary education in Xuancheng.',
      'high-school': 'This stage laid the foundation for studying physics next.',
      undergraduate: 'Physics training built foundations in classical physics, quantum mechanics, computation, circuits, and digital logic; a mobile-robot project also connected software and hardware modules into a system.',
      graduate: 'In the Quantum Science and Technology master’s program, my current work centers on SPAD devices and readout IC design.',
    },
    engineeringTrack: {
      id: 'engineering',
      label: 'Engineering Track',
      route: 'Electronic Information → SPAD IC Design',
      summary: 'I moved from system implementation toward the underlying IC, then extended that end-to-end perspective toward robot learning.',
      stages: [
        { id: 'electronic-information', title: 'Electronic Information', detail: 'Coursework in circuits, digital logic, computation, and signals provided an engineering entry point.', motif: 'electronics' },
        { id: 'mobile-robot', title: 'Mobile Robot', detail: 'An undergraduate project connected Python / YOLO vision, ROS, controller communication, an MCU, and motor control into a task loop.', motif: 'robot' },
        { id: 'embedded-hardware', title: 'Embedded / Hardware', detail: 'The next layer was understanding how interfaces, control, and physical execution meet.', motif: 'hardware' },
        { id: 'board-level-systems', title: 'Board-level Systems', detail: 'Board control, data paths, and FPGA integration showed how a readout system becomes usable.', motif: 'hardware' },
        { id: 'spad-ic-design', title: 'SPAD IC Design', detail: 'My current work goes deeper into the analog front end, digital control, physical implementation, and post-layout verification.', motif: 'spad' },
        { id: 'embodied-ai-learning', title: 'Embodied AI Learning', detail: 'I am extending my interest in perception–decision–action loops toward robot learning. This remains a learning direction, not a completed research result.', motif: 'learning', state: 'Learning' },
      ],
    },
    physicsQuantumTrack: {
      id: 'physics-quantum',
      label: 'Physics / Quantum Track',
      route: 'Quantum Science & Technology → Superconducting Quantum Computing',
      summary: 'Physics foundations led into quantum mechanics, followed by graduate study and simulation work on quantum-device microwave structures.',
      stages: [
        { id: 'physics-foundation', title: 'Physics Foundations', detail: 'Undergraduate study established foundations in classical physics, mathematical modeling, and computation.', motif: 'physics' },
        { id: 'quantum-mechanics', title: 'Quantum Mechanics', detail: 'Undergraduate coursework provided a theoretical foundation; it is not presented as an experiment or research result.', motif: 'quantum' },
        { id: 'quantum-science-technology', title: 'Quantum Science & Technology', detail: 'Graduate study continues to connect interests in quantum materials, devices, optics, and computing.', motif: 'quantum' },
        { id: 'superconducting-quantum', title: 'Superconducting Quantum Computing', detail: 'During a 2023 Baidu internship, I used Ansys HFSS for 3D electromagnetic simulation, parameter sweeps, and field analysis of microwave structures related to superconducting quantum chips. The evidence boundary is simulation only.', motif: 'quantum' },
      ],
    },
    workflowIntro: 'I usually map a new domain and get the complete path working before going deeper layer by layer. These verified project flows show that practice instead of rating it.',
    workflows: [
      { id: 'ic', title: 'Integrated Circuits', context: 'SPAD IC design and verification flow', steps: ['System Architecture', 'Circuit', 'Simulation', 'Layout', 'DRC / LVS', 'PEX'] },
      { id: 'robotics', title: 'Robotic Systems', context: 'The public technical chain of the undergraduate mobile robot', steps: ['Visual Perception', 'ROS Task Logic', 'Controller Communication', 'MCU', 'Motor Control'] },
      { id: 'quantum', title: 'Quantum-device Simulation', context: 'Simulation method for superconducting-quantum microwave structures', steps: ['Physical Model', 'Microwave Structure', 'HFSS', 'Parameter Sweep', 'Field Analysis'] },
    ],
    now: {
      title: 'SPAD Single-Photon Detector Readout IC',
      summary: 'My current graduate work is a 1×16-channel SPAD readout IC at the post-layout simulation and tape-out-preparation stage. This does not claim completed tape-out or silicon measurement.',
      stages: ['IC Design', 'Layout', 'Verification', 'PEX', 'Post-layout Simulation', 'Tape-out Preparation'],
    },
    sideQuests: {
      intro: 'These are ongoing explorations, not parallel claims about my current SPAD research. Away from the technical map, I also make time for sports, karaoke, mahjong, and games.',
      explorations: [
        { title: 'Quantum Computing', description: 'Continuing to understand the links among quantum devices, computing, and communication.', state: 'Ongoing exploration' },
        { title: 'Embodied AI', description: 'Building a robot-learning knowledge map while keeping the work explicitly at a learning-project stage.', state: 'Personal interest' },
        { title: 'Embedded Systems', description: 'Following how sensing, control, communication, and actuation become a complete system.', state: 'Personal interest' },
      ],
      interests: enProfile.interests,
      games: enProfile.games,
    },
  },
};
