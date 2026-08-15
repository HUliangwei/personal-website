import type { Locale } from '../i18n/types';

export type JourneyMotif = 'physics' | 'robot' | 'hfss' | 'spad' | 'learning' | 'focus';
export type JourneyEvidence = 'Official' | 'Verified Resume' | 'User-provided';

export interface JourneyStage {
  id: string;
  date: string;
  title: string;
  summary: string;
  detail: string;
  motif: JourneyMotif;
  evidence: JourneyEvidence;
  state?: string;
}

export const journeyByLocale: Record<Locale, JourneyStage[]> = {
  zh: [
    {
      id: 'physics-foundation',
      date: '2020.09 - 2024.06',
      title: '物理与硬件基础',
      summary: '武汉大学物理学本科阶段，让器件、信号与计算逐渐进入同一个问题框架。',
      detail: '物理训练提供了理解约束和建模的方法；电路、数字逻辑与计算课程把这种理解推向可实现的硬件系统。本科量子力学课程也构成了量子学习基础；这里只说明课程背景，不代表实验或研究成果。',
      motif: 'physics',
      evidence: 'Official',
    },
    {
      id: 'mobile-robot',
      date: '本科阶段',
      title: '智能小车：从模块走向系统',
      summary: '本科智能小车实践把视觉感知、ROS 任务逻辑、硬件通信、MCU 与电机控制连接起来。',
      detail: '这段实践成为我理解感知—决策—行动闭环以及软硬件系统集成的早期入口。',
      motif: 'robot',
      evidence: 'Verified Resume',
    },
    {
      id: 'quantum-hfss',
      date: '2023.09 - 2023.12',
      title: '超导量子比特与 HFSS',
      summary: '在百度实习中，围绕超导量子芯片相关微波结构开展 Ansys HFSS 三维电磁仿真与几何分析。',
      detail: '这段实习让我从超导量子比特相关电路与微波结构出发，实际使用 HFSS 完成三维电磁建模、参数扫描与场分布分析。',
      motif: 'hfss',
      evidence: 'Verified Resume',
    },
    {
      id: 'spad-ic',
      date: '2024.09 - 至今',
      title: 'SPAD 与集成电路',
      summary: '研究生阶段的关注点转向半导体单光子探测器及读出电路。',
      detail: '从探测事件、模拟前端到数字控制与物理实现，问题的尺度发生了变化，但主线仍是让物理信号成为可验证、可使用的系统信息。',
      motif: 'spad',
      evidence: 'Verified Resume',
    },
    {
      id: 'embodied-learning',
      date: '学习中 / 进行中',
      title: 'LeRobot 与具身学习',
      summary: '把对完整机器人系统的兴趣继续延伸到模仿学习与动作生成；当前定位为学习项目。',
      detail: '当前从机器人系统经验继续向仿真、模仿学习与动作生成等方向学习。',
      motif: 'learning',
      evidence: 'User-provided',
      state: 'Learning / In Progress',
    },
    {
      id: 'current-focus',
      date: '当前',
      title: '当前关注',
      summary: '以 SPAD 读出电路研究为当前锚点，同时持续学习机器人与具身智能。',
      detail: '当前以 SPAD 芯片设计为科研主线，同时继续向量子计算、机器人学习和嵌入式系统拓展知识边界。',
      motif: 'focus',
      evidence: 'Verified Resume',
    },
  ],
  en: [
    {
      id: 'physics-foundation',
      date: 'Sep 2020 - Jun 2024',
      title: 'Physics & hardware foundations',
      summary: 'Studying physics at Wuhan University brought devices, signals, and computation into one frame of inquiry.',
      detail: 'Physics developed a way to reason from constraints and models; coursework in circuits, digital logic, and computation connected that reasoning to implementable hardware systems. Undergraduate Quantum Mechanics also provided a quantum-learning foundation—coursework, not an experimental or research result.',
      motif: 'physics',
      evidence: 'Official',
    },
    {
      id: 'mobile-robot',
      date: 'Undergraduate period',
      title: 'A mobile robot: from modules to a system',
      summary: 'An undergraduate mobile-robot project connected visual perception, ROS task logic, hardware communication, an MCU, and motor control.',
      detail: 'This project became an early route into understanding both the perception–decision–action loop and full software–hardware system integration.',
      motif: 'robot',
      evidence: 'Verified Resume',
    },
    {
      id: 'quantum-hfss',
      date: 'Sep - Dec 2023',
      title: 'Superconducting qubits & HFSS',
      summary: 'During a Baidu internship, I worked on Ansys HFSS 3D electromagnetic simulation and geometry analysis for microwave structures related to superconducting quantum chips.',
      detail: 'The internship connected superconducting-qubit-related circuits and microwave structures with hands-on HFSS modeling, parameter sweeps, and field analysis.',
      motif: 'hfss',
      evidence: 'Verified Resume',
    },
    {
      id: 'spad-ic',
      date: 'Sep 2024 - present',
      title: 'SPAD and integrated circuits',
      summary: 'My graduate research focus shifted toward semiconductor single-photon detectors and readout circuits.',
      detail: 'The scale moved from a detection event and analog front end to digital control and physical implementation, while the central question stayed the same: making a physical signal usable and verifiable at system level.',
      motif: 'spad',
      evidence: 'Verified Resume',
    },
    {
      id: 'embodied-learning',
      date: 'Learning / In progress',
      title: 'LeRobot and embodied learning',
      summary: 'I am extending my interest in complete robotic systems toward imitation learning and action generation; this remains a learning project.',
      detail: 'I am extending my robotics background toward simulation, imitation learning, and action-generation methods.',
      motif: 'learning',
      evidence: 'User-provided',
      state: 'Learning / In Progress',
    },
    {
      id: 'current-focus',
      date: 'Current',
      title: 'Current focus',
      summary: 'SPAD readout-circuit research is the present anchor, alongside continued learning in robotics and embodied AI.',
      detail: 'SPAD IC design remains my research anchor while I continue expanding into quantum computing, robot learning, and embedded systems.',
      motif: 'focus',
      evidence: 'Verified Resume',
    },
  ],
};
