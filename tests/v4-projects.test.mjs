import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const expectedRoutes = [
  '/', '/about', '/cv', '/en', '/en/about', '/en/cv', '/en/projects',
  '/en/projects/programming/personal-website', '/en/projects/programming/robot', '/en/projects/programming/videoto3d',
  '/projects', '/projects/programming/personal-website', '/projects/programming/robot', '/projects/programming/videoto3d',
];

const locales = [
  {
    prefix: '',
    caption: '项目概念示意图',
    completedLabel: '已完成工具',
    learningLabel: '学习主题',
    cards: {
      spad: {
        title: 'SPAD 芯片设计', date: '2024.09–至今', status: '进行中 · 版图后仿真 / 流片前',
        summary: '采用 SMIC 180 nm BCD 工艺的 1×16 通道 SPAD 混合信号读出芯片设计，当前处于版图后仿真与流片前阶段。',
        highlights: ['1×16 通道混合信号读出架构', '版图后仿真与流片前验证推进'],
        topics: ['Cadence Virtuoso', 'Spectre', 'Calibre', 'FPGA'],
      },
      'mobile-robot': {
        title: '视觉引导智能小车', date: '本科阶段', status: '已完成',
        summary: '本科阶段完成的移动机器人项目，连接 Python / YOLO 视觉、ROS 任务逻辑、上下位机通信、MCU 与电机控制。',
        highlights: ['构建视觉感知到电机执行的任务闭环', '串联 ROS、上下位机通信与 MCU 控制'],
        topics: ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control'],
      },
      'quantum-hfss': {
        title: '超导量子计算', date: '2023.09–2023.12', status: '已完成 · 仅限仿真',
        summary: '在百度实习期间，使用 HFSS 对超导量子芯片相关微波结构开展三维电磁仿真、参数扫描与几何分析。',
        highlights: ['搭建三维电磁仿真与参数扫描流程', '通过场分布与几何关系开展结构分析'],
        topics: ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep'],
      },
      lerobot: {
        title: '具身智能学习', date: '2026.08–至今', status: '进行中 · PushT 主线完成',
        summary: '以公开的 robot 仓库为载体，完成 LeRobot × MuJoCo 的 PushT 任务复现：从数据集、ACT 训练到双环境闭环推理，并继续向 LIBERO 桌面操作与 VLA 模型进阶。',
        highlights: ['在自建 MuJoCo 环境复现 PushT 官方任务，覆盖率 0.953 复现成功', '打通数据 → ACT 训练 → 双环境（pymunk / MuJoCo）推理的完整工作区'],
        topics: ['LIBERO', 'SmolVLA', 'OpenVLA'],
        learning: true,
      },
    },
  },
  {
    prefix: '/en',
    caption: 'Conceptual project diagram',
    completedLabel: 'Completed Tools',
    learningLabel: 'Learning Topics',
    cards: {
      spad: {
        title: 'SPAD IC Design', date: '2024.09–Present', status: 'In Progress · Post-layout Simulation / Pre-tapeout',
        summary: 'A 1×16-channel mixed-signal SPAD readout IC in SMIC 180 nm BCD at the post-layout simulation and pre-tapeout stage.',
        highlights: ['Designed a 1×16-channel mixed-signal readout architecture', 'Advanced post-layout simulation and pre-tapeout verification'],
        topics: ['Cadence Virtuoso', 'Spectre', 'Calibre', 'FPGA'],
      },
      'mobile-robot': {
        title: 'Vision-Guided Mobile Robot', date: 'Undergraduate Stage', status: 'Completed',
        summary: 'An undergraduate mobile-robot project connecting Python / YOLO vision, ROS task logic, upper/lower-controller communication, MCU control, and motor control.',
        highlights: ['Built a perception-to-actuation task loop', 'Connected ROS task logic, controller communication, and MCU control'],
        topics: ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control'],
      },
      'quantum-hfss': {
        title: 'Superconducting Quantum Computing', date: '2023.09–2023.12', status: 'Completed · Simulation Only',
        summary: 'During a Baidu internship, used HFSS for 3D electromagnetic simulation, parameter sweeps, and geometry analysis of microwave structures related to superconducting quantum chips.',
        highlights: ['Built a 3D electromagnetic simulation and parameter-sweep workflow', 'Used field distributions and geometry relationships for structure analysis'],
        topics: ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep'],
      },
      lerobot: {
        title: 'Embodied AI Learning', date: '2026.08–Present', status: 'In Progress · PushT Main Line Complete',
        summary: 'A public robot workspace that reproduces the LeRobot × MuJoCo PushT task end to end — dataset, ACT training, and dual-environment inference — while moving toward LIBERO and VLA models.',
        highlights: ['Reproduced the official PushT task in a self-built MuJoCo environment with 0.953 coverage', 'A complete workspace from dataset and ACT training to dual-environment inference in pymunk and MuJoCo'],
        topics: ['LIBERO', 'SmolVLA', 'OpenVLA'],
        learning: true,
      },
    },
  },
];

function filesUnder(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function routeSet() {
  return filesUnder(dist)
    .filter((file) => file === join(dist, 'index.html') || file.endsWith(`${sep}index.html`))
    .map((file) => {
      const path = relative(dist, file).split(sep).join('/').replace(/(?:^|\/)index\.html$/, '');
      return path ? `/${path}` : '/';
    })
    .sort();
}

function html(route) {
  return readFileSync(join(dist, route.replace(/^\//, ''), 'index.html'), 'utf8');
}

function visibleText(value) {
  return value
    .replace(/<(?:script|style)[^>]*>[\s\S]*?<\/(?:script|style)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function projectCards(route) {
  return [...html(route).matchAll(/<article class="project-card"[\s\S]*?<\/article>/g)].map((match) => match[0]);
}

function cardFor(route, slug) {
  return projectCards(route).find((card) => card.includes(`data-project-slug="${slug}"`)) ?? '';
}

function cardMetadata(card) {
  return card
    .replace(/<h[23] data-project-field="title">/g, '<h data-project-field="title">')
    .replace(/<\/h[23]>/g, '</h>');
}

function allPublicHtml() {
  return routeSet().map(html).join('\n');
}

function projectDetailLinks(value) {
  return [...value.matchAll(/href="(?:\/en)?\/projects\/(?!programming\/)[^"]+"/g)];
}

function singleProjectCtas(value) {
  return value.match(/(?:查看项目|View project)/gi) ?? [];
}

function frontmatter(locale, slug) {
  const suffix = locale.prefix ? '.en' : '';
  const source = readFileSync(join(root, 'src', 'content', 'projects', `${slug}${suffix}.mdx`), 'utf8');
  return source.match(/^---\r?\n([\s\S]*?)\r?\n---/m)?.[1] ?? '';
}

function frontmatterList(source, key) {
  if (new RegExp(`^${key}: \[\]$`, 'm').test(source)) return [];
  const block = source.match(new RegExp(`^${key}:\r?\n((?:  - .*(?:\r?\n|$))+)`, 'm'))?.[1] ?? '';
  return [...block.matchAll(/^  - (.*)$/gm)].map((match) => match[1]);
}

function listItems(card, className) {
  const list = card.match(new RegExp(`<ul class="${className}"[^>]*>([\\s\\S]*?)<\\/ul>`))?.[1] ?? '';
  return [...list.matchAll(/<li>([^<]+)<\/li>/g)].map((match) => match[1]);
}

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

test('V4/V5 publishes four self-contained research cards plus programming showcase routes', () => {
  assert.deepEqual(routeSet(), expectedRoutes);
  assert.equal(projectCards('/projects').length, 4);
  assert.equal(projectCards('/en/projects').length, 4);
  assert.equal(projectDetailLinks(allPublicHtml()).length, 0);
  const programmingRoutes = new Set(
    [...allPublicHtml().matchAll(/href="(\/(?:en\/)?projects\/programming\/[^"]+)"/g)].map((match) => match[1]),
  );
  assert.deepEqual([...programmingRoutes].sort(), [
    '/en/projects/programming/personal-website',
    '/en/projects/programming/robot',
    '/en/projects/programming/videoto3d',
    '/projects/programming/personal-website',
    '/projects/programming/robot',
    '/projects/programming/videoto3d',
  ]);
  assert.equal(singleProjectCtas(visibleText(allPublicHtml())).length, 0);
});

test('V4 project cards use one localized collection record on Home and Projects', () => {
  for (const locale of locales) {
    const homeRoute = locale.prefix || '/';
    const listRoute = `${locale.prefix}/projects`;
    for (const [slug, expected] of Object.entries(locale.cards)) {
      const home = cardFor(homeRoute, slug);
      const list = cardFor(listRoute, slug);
      assert.ok(home, `${homeRoute} has ${slug}`);
      assert.ok(list, `${listRoute} has ${slug}`);
      assert.match(list, new RegExp(`<h[23][^>]*>${expected.title}</h[23]>`));
      assert.match(list, new RegExp(`<span data-project-field="date">${expected.date}</span>`));
      assert.match(list, new RegExp(`<span data-project-field="status">${expected.status}</span>`));
      assert.match(list, new RegExp(`<p class="project-summary">${expected.summary}</p>`));
      assert.match(list, new RegExp(locale.caption));
      const highlights = [...list.matchAll(/<ul class="project-highlights"[\s\S]*?<\/ul>/g)][0]?.[0] ?? '';
      assert.ok(expected.highlights.length >= 2 && expected.highlights.length <= 3);
      for (const highlight of expected.highlights) assert.match(highlights, new RegExp(`<li>${highlight}</li>`));
      const topics = [...list.matchAll(/<ul class="(?:technology-list|learning-topic-list)"[\s\S]*?<\/ul>/g)].map((match) => match[0]);
      const visibleTopics = topics.flatMap((topic) => [...topic.matchAll(/<li>([^<]+)<\/li>/g)].map((match) => match[1]));
      assert.ok(visibleTopics.length >= 3 && visibleTopics.length <= 8);
      for (const topic of expected.topics) assert.ok(visibleTopics.includes(topic));
      assert.equal(cardMetadata(home), cardMetadata(list), `${slug} card metadata is identical on Home and Projects`);
      assert.match(list, new RegExp(expected.learning ? locale.learningLabel : locale.completedLabel));
    }
  }
});

test('V4 cards keep mobile, quantum, SPAD, and embodied-AI evidence boundaries visible', () => {
  for (const locale of locales) {
    const route = `${locale.prefix}/projects`;
    const mobile = cardFor(route, 'mobile-robot');
    assert.doesNotMatch(mobile, /ROS2|Raspberry Pi|LiDAR|depth camera|树莓派|激光雷达|深度相机/i);
    assert.match(cardFor(route, 'quantum-hfss'), /仅限仿真|Simulation Only/i);
    assert.match(cardFor(route, 'spad'), /流片前|Pre-tapeout/i);
    const embodied = cardFor(route, 'lerobot');
    assert.match(embodied, new RegExp(locale.learningLabel));
    assert.match(embodied, new RegExp(locale.completedLabel));
  }
});

test('V4 source frontmatter and generated cards retain exact completed-tool and learning-topic boundaries', () => {
  const completedTools = {
    spad: ['Cadence Virtuoso', 'Spectre', 'Calibre', 'FPGA'],
    'mobile-robot': ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control'],
    'quantum-hfss': ['Ansys HFSS', '3D Electromagnetic Simulation', 'Parameter Sweep'],
    lerobot: ['Python', 'LeRobot', 'MuJoCo', 'ACT', 'PyTorch'],
  };
  const learningTopics = {
    spad: [],
    'mobile-robot': [],
    'quantum-hfss': [],
    lerobot: ['LIBERO', 'SmolVLA', 'OpenVLA'],
  };

  for (const locale of locales) {
    for (const slug of Object.keys(completedTools)) {
      const source = frontmatter(locale, slug);
      const card = cardFor(`${locale.prefix}/projects`, slug);
      assert.deepEqual(frontmatterList(source, 'technologies'), completedTools[slug], `${locale.prefix || '/'} ${slug} source completed tools are exact`);
      assert.deepEqual(frontmatterList(source, 'learningTopics'), learningTopics[slug], `${locale.prefix || '/'} ${slug} source learning topics are exact`);
      assert.deepEqual(listItems(card, 'technology-list'), completedTools[slug], `${locale.prefix || '/'} ${slug} card completed tools are exact`);
      assert.deepEqual(listItems(card, 'learning-topic-list'), learningTopics[slug], `${locale.prefix || '/'} ${slug} card learning topics are exact`);
    }
  }
});

test('V4 source frontmatter and generated Home and Projects cards retain exact evidence-bounded highlights', () => {
  for (const locale of locales) {
    const homeRoute = locale.prefix || '/';
    const projectsRoute = `${locale.prefix}/projects`;
    for (const [slug, expected] of Object.entries(locale.cards)) {
      assert.ok(expected.highlights.length >= 2 && expected.highlights.length <= 3, `${locale.prefix || '/'} ${slug} has a valid highlight count`);
      assert.deepEqual(frontmatterList(frontmatter(locale, slug), 'highlights'), expected.highlights, `${locale.prefix || '/'} ${slug} source highlights are exact`);
      assert.deepEqual(listItems(cardFor(homeRoute, slug), 'project-highlights'), expected.highlights, `${homeRoute} ${slug} Home highlights are exact`);
      assert.deepEqual(listItems(cardFor(projectsRoute, slug), 'project-highlights'), expected.highlights, `${projectsRoute} ${slug} Projects highlights are exact`);
    }
  }
});

test('V4 source frontmatter and generated cards reject unsupported completed or fabricated project claims', () => {
  for (const locale of locales) {
    const route = `${locale.prefix}/projects`;
    const mobileSource = frontmatter(locale, 'mobile-robot');
    const mobile = cardFor(route, 'mobile-robot');
    assert.doesNotMatch(mobileSource, /ROS2|Raspberry Pi|LiDAR|depth camera|UAV|树莓派|激光雷达|深度相机|无人机/i);
    assert.doesNotMatch(mobile, /ROS2|Raspberry Pi|LiDAR|depth camera|UAV|树莓派|激光雷达|深度相机|无人机/i);

    const quantumSource = frontmatter(locale, 'quantum-hfss');
    const quantum = cardFor(route, 'quantum-hfss');
    assert.match(quantumSource, /仅限仿真|Simulation Only/i);
    assert.match(quantum, /仅限仿真|Simulation Only/i);
    assert.doesNotMatch(quantumSource, /fabricat(?:e|ed|ion)|manufactur(?:e|ed|ing)|measur(?:e|ed|ement)|coherence|\bT1\b|\bT2\b|制备|制造|实测|相干/i);
    assert.doesNotMatch(quantum, /fabricat(?:e|ed|ion)|manufactur(?:e|ed|ing)|measur(?:e|ed|ement)|coherence|\bT1\b|\bT2\b|制备|制造|实测|相干/i);

    const spadSource = frontmatter(locale, 'spad');
    const spad = cardFor(route, 'spad');
    assert.match(spadSource, /流片前|Pre-tapeout/i);
    assert.match(spad, /流片前|Pre-tapeout/i);
    assert.doesNotMatch(spadSource, /silicon|silicon measurement|taped out|fabricated result|硅后|硅片实测|已经流片|流片完成/i);
    assert.doesNotMatch(spad, /silicon|silicon measurement|taped out|fabricated result|硅后|硅片实测|已经流片|流片完成/i);

    const embodiedSource = frontmatter(locale, 'lerobot');
    const embodied = cardFor(route, 'lerobot');
    assert.match(embodiedSource, /进行中|In Progress/i);
    assert.match(embodied, /学习主题|Learning Topics/i);
    assert.match(embodied, /已完成工具|Completed Tools/);
    assert.doesNotMatch(embodiedSource, /training succeeded|successful inference|completed pipeline|训练成功|推理成功|端到端完成/i);
    assert.doesNotMatch(embodied, /training succeeded|successful inference|completed pipeline|训练成功|推理成功|端到端完成/i);
  }
});

test('all project SVG components keep a labeled image contract with meaningful localized text', () => {
  for (const name of ['SpadDiagram', 'MobileRobotDiagram', 'QuantumHfssDiagram', 'LeRobotDiagram']) {
    const source = readFileSync(join(root, 'src', 'components', 'projects', 'figures', `${name}.astro`), 'utf8');
    assert.match(source, /const titleId = `[^`]+-title-\$\{locale\}`;/, `${name} creates a locale-specific title id`);
    assert.match(source, /const descId = `[^`]+-desc-\$\{locale\}`;/, `${name} creates a locale-specific description id`);
    assert.match(source, /const title = locale === 'zh' \? '[^']+' : '[^']+';/, `${name} has meaningful localized title text`);
    assert.match(source, /const description = [\s\S]*locale === 'zh'[\s\S]*\? '[^']+'[\s\S]*: '[^']+';/, `${name} has meaningful localized description text`);
    assert.match(source, /<svg[^>]*role="img"[^>]*aria-labelledby=\{`\$\{titleId\} \$\{descId\}`\}/, `${name} exposes role and linked labels`);
    assert.match(source, /<title id=\{titleId\}>\{title\}<\/title><desc id=\{descId\}>\{description\}<\/desc>/, `${name} renders both linked title and description`);
  }
});

test('V4 removes obsolete project-detail implementation files', () => {
  for (const file of [
    'src/pages/projects/[slug].astro', 'src/pages/en/projects/[slug].astro', 'src/layouts/ProjectLayout.astro',
    'src/components/projects/ProjectHeader.astro', 'src/components/projects/ProjectMeta.astro', 'src/components/projects/ProjectFilter.astro',
  ]) assert.equal(existsSync(join(root, file)), false, `${file} is removed`);
});
