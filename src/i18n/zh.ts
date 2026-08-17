const zh = {
  localeName: '中文',
  alternateLocaleName: 'English',
  htmlLang: 'zh-CN',
  ogLocale: 'zh_CN',
  siteName: '胡良玮',
  siteDescription: '胡良玮的研究与工程作品集，关注智能硬件、集成电路、机器人与具身智能。',
  skipLink: '跳至主要内容',
  navigation: {
    label: '主导航',
    open: '打开导航菜单',
    close: '关闭导航菜单',
    toggle: '切换导航菜单',
    languageSwitch: '切换至 English',
    items: [
      { path: '/', label: '首页' },
      { path: '/about', label: '关于' },
      { path: '/projects', label: '项目' },
      { path: '/cv', label: '简历' },
    ],
  },
  footer: {
    label: '页脚导航',
    cv: '简历',
    emailPending: '3036064607@qq.com',
  },
  meta: {
    home: {
      title: '胡良玮 | 个人技术主页',
      description: '认识胡良玮：一名在中国科学技术大学攻读量子科学与技术硕士、从事 SPAD 读出芯片设计的研究生。',
    },
    about: {
      title: '关于 | 胡良玮',
      description: '胡良玮从宣城求学、武汉大学物理学本科到中国科学技术大学量子科学与技术硕士的教育经历，以及工程与物理量子双轨技术旅程。',
    },
    projects: {
      title: '项目 | 胡良玮',
      description: 'SPAD 芯片设计、智能小车、超导量子计算与具身智能学习四个核心项目。',
    },
    cv: {
      title: '简历 | 胡良玮',
      description: '集成电路与具身智能方向的可预览简历、官方课程成绩，以及准备中的量子计算方向简历。',
    },
  },
  home: {
    hero: {
      eyebrow: '你好，我是',
      summary: '目前主要从事 SPAD 单光子探测芯片设计，同时持续探索具身智能、量子计算和嵌入式系统。',
      curiosity: '我喜欢学习、折腾技术，也愿意尝试新事物；运动、唱歌、游戏和朋友同样构成了我的日常。',
      projectsAction: '浏览项目',
      cvAction: '查看简历',
      diagramTitle: '个人画像（暂时拿个玩偶替代）',
      diagramDescription: '以个人 3D 画像展示，当前用玩偶模型代替真人形象。',
      diagramLabels: ['器件 / 传感器', '信号', '集成电路 / 计算', '智能系统 / 机器人'],
    },
    focus: {
      eyebrow: '01 / 当前方向', title: '当前方向', description: '以 SPAD 芯片设计为当前科研重点，同时持续关注具身智能、量子计算和嵌入式系统。',
      areas: [
        { title: 'SPAD 芯片设计', state: '研究生科研', description: '围绕 1×16 通道混合信号读出芯片，推进整体版图验证、PEX、版图后仿真与流片前准备。' },
        { title: '具身智能', state: '学习与探索', description: '从智能小车的系统经验出发，继续学习机器人仿真、模仿学习与动作生成。' },
        { title: '量子计算', state: '学术兴趣', description: '从物理与超导量子比特仿真经历出发，持续理解量子计算与量子通信。' },
        { title: '嵌入式系统', state: '工程兴趣', description: '持续关注传感、通信、控制与执行机构如何组成完整硬件系统。' },
      ],
    },
    projects: {
      eyebrow: '02 / 核心项目', title: '核心项目', all: '全部项目',
    },
    toolkit: {
      eyebrow: '03 / 技术栈', title: '技术栈', description: '覆盖集成电路、数字硬件、机器人、量子仿真与日常开发。',
      groups: [
        { title: '集成电路设计', items: ['Cadence Virtuoso', 'Spectre / ADE', 'Calibre', 'DRC / LVS / PEX', 'Layout', 'Analog / Mixed-Signal Design'], learning: false, note: '' },
        { title: '数字与硬件描述', items: ['FPGA', 'Digital Logic', 'Digital Control'], learning: false, note: '' },
        { title: '机器人与嵌入式', items: ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control', 'Hardware Communication'], learning: false, note: '' },
        { title: '量子与仿真', items: ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep', 'Field Analysis'], learning: false, note: '' },
        { title: '开发工具', items: ['Git', 'GitHub'], learning: false, note: '' },
        { title: '机器人学习（学习中）', items: ['机器人仿真', '模仿学习', '动作生成'], learning: true, note: '' },
      ],
    },
    interests: { eyebrow: '04 / 兴趣与生活', title: '兴趣与生活', description: '离开屏幕和实验室后，我喜欢运动、唱歌、和朋友打牌，也会沉浸在几个喜欢的游戏世界里。', activitiesLabel: '日常爱好', gamesLabel: '常玩的游戏' },
    contact: { eyebrow: '05 / 联系', title: '联系方式', description: '无论是聊项目、交流研究，还是简单打个招呼，都可以通过下面的方式联系我。', cvAction: '查看简历' },
  },
  about: {
    education: {
      eyebrow: '01 / 教育经历',
      title: '教育旅程',
      intro: '从宣城出发，经小学、初中和高中，再到武汉大学物理学与中国科学技术大学量子科学与技术。',
    },
    technicalJourney: {
      eyebrow: '02 / 技术旅程',
      title: '两条并行的技术路线',
      intro: '一条工程线从完整系统逐步深入板级硬件与专用芯片，再向智能算法延伸；另一条从物理基础进入超导量子比特与量子计算。',
    },
    howIWork: {
      eyebrow: '03 / 工作方式',
      title: '先跑通链路，再深入每一层',
    },
    now: {
      eyebrow: '04 / 现在',
      title: '现在',
    },
    sideQuests: {
      eyebrow: '05 / 插曲',
      title: '插曲',
      interestsLabel: '生活兴趣',
      gamesLabel: '常玩的游戏',
    },
  },
  projects: {
    intro: {
      eyebrow: '项目',
      title: '四个核心项目',
      description: '四段来自不同阶段的技术实践：SPAD 芯片设计、视觉引导智能小车、超导量子计算与具身智能学习。',
    },
    date: '日期',
    status: '状态',
    highlights: '项目亮点',
    completedTools: '已完成工具',
    learningTopics: '学习主题',
    coverPending: '项目概念示意图',
    coverAltSuffix: '封面',
    categories: {
      'Integrated Circuits': '集成电路设计',
      Robotics: '机器人 / 嵌入式',
      'Embodied AI': '具身智能',
      Quantum: '量子计算',
      Software: '软件',
    },
  },
  cv: {
    eyebrow: '简历',
    title: '面向不同技术方向的简历。',
    intro: '查看学业背景、课程成绩与三个技术方向；已发布的简历可按需预览、打开或下载。',
    sections: {
      versionsEyebrow: '简历版本',
      versionsTitle: '面向三个技术方向',
    },
    tracks: [
      {
        title: '集成电路',
        description: '面向集成电路设计及相关工程工作的简历。',
        pdf: '/cv/liangwei-hu-ic-design.pdf',
        available: true,
      },
      {
        title: '具身智能',
        description: '面向机器人、具身智能与 AI 系统工作的简历。',
        pdf: '/cv/liangwei-hu-embodied-ai.pdf',
        available: true,
      },
      {
        title: '量子计算',
        description: '量子计算方向简历准备中。',
        pdf: '',
        available: false,
      },
    ],
    actions: {
      groupSuffix: 'PDF 操作',
      preview: '预览 PDF',
      hidePreview: '收起预览',
      open: '打开 PDF',
      download: '下载 PDF',
      fallbackPrefix: '浏览器无法内嵌显示此 PDF。请改为',
      fallbackLink: '打开 PDF',
      comingSoon: '准备中',
    },
  },
} as const;

export default zh;
