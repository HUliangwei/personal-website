import type { Locale } from '../i18n/types';

export type JourneyMotif = 'physics' | 'robot' | 'hfss' | 'spad' | 'learning' | 'focus';
export type JourneyEvidence = 'Official' | 'Verified Resume' | 'TODO';

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
      detail: '这段经历没有被改写成精确但无依据的日期；它保留在真实的本科时间范围内，也成为理解感知—决策—行动闭环的早期入口。',
      motif: 'robot',
      evidence: 'Verified Resume',
    },
    {
      id: 'quantum-hfss',
      date: '2023.09 - 2023.12',
      title: 'HFSS 电磁仿真',
      summary: '在百度实习中，围绕超导量子芯片相关微波结构开展 Ansys HFSS 三维电磁仿真与几何分析。',
      detail: '这是一段有明确时间与来源的仿真工作，不被扩展成未经证实的量子计算实验、制备或测量故事。',
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
      detail: '待核实：LeRobot、ACT、数据集、训练、checkpoint、推理与评估环节仍需项目材料支持，不把计划中的流程写成已经完成的结果。',
      motif: 'learning',
      evidence: 'TODO',
      state: 'Learning / In Progress',
    },
    {
      id: 'current-focus',
      date: '当前',
      title: '当前关注',
      summary: '以 SPAD 读出电路研究为当前锚点，同时持续学习机器人与具身智能。',
      detail: '这不是把多个方向包装成同等成熟的经历，而是保留它们各自的证据边界，继续探索从物理信号到智能行动的连接。',
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
      detail: 'The evidence does not support a more precise date, so the work stays within its verified undergraduate period. It became an early route into thinking about the perception–decision–action loop.',
      motif: 'robot',
      evidence: 'Verified Resume',
    },
    {
      id: 'quantum-hfss',
      date: 'Sep - Dec 2023',
      title: 'HFSS electromagnetic simulation',
      summary: 'During a Baidu internship, I worked on Ansys HFSS 3D electromagnetic simulation and geometry analysis for microwave structures related to superconducting quantum chips.',
      detail: 'This is a simulation experience with a verified time and source—not a claim about quantum-computing experiments, fabrication, or measurement.',
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
      detail: 'TODO verification: LeRobot, ACT, datasets, training, checkpoints, inference, and evaluation still need supporting project artifacts. Planned pipeline stages are not presented as completed results.',
      motif: 'learning',
      evidence: 'TODO',
      state: 'Learning / In Progress',
    },
    {
      id: 'current-focus',
      date: 'Current',
      title: 'Current focus',
      summary: 'SPAD readout-circuit research is the present anchor, alongside continued learning in robotics and embodied AI.',
      detail: 'The goal is not to present every direction as equally mature, but to preserve their different evidence boundaries while exploring the path from physical signals to intelligent action.',
      motif: 'focus',
      evidence: 'Verified Resume',
    },
  ],
};
