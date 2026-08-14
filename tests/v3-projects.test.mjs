import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const slugs = ['spad', 'mobile-robot', 'quantum-hfss', 'lerobot'];

function output(route) {
  return join(dist, route.replace(/^\//, ''), 'index.html');
}

function page(route) {
  return readFileSync(output(route), 'utf8');
}

function textContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:rarr|#x2192);/gi, '→')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function projectCard(html, slug) {
  return [...html.matchAll(/<article class="project-card"[\s\S]*?<\/article>/g)]
    .map((match) => match[0])
    .find((card) => card.includes(`/projects/${slug}`)) ?? '';
}

function projectCardField(card, field) {
  const element = card.match(new RegExp(`<([a-z][\\w-]*)[^>]*data-project-field="${field}"[^>]*>([\\s\\S]*?)<\\/\\1>`, 'i'));
  return textContent(element?.[2] ?? '');
}

test.before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

test('V3 keeps four stable project routes and gives every card a concrete localized identity', () => {
  const locales = [
    {
      prefix: '',
      titles: {
        spad: 'SPAD 芯片设计',
        'mobile-robot': '智能小车',
        'quantum-hfss': '超导量子计算',
        lerobot: '具身智能学习',
      },
      categories: {
        spad: '集成电路设计',
        'mobile-robot': '机器人 / 嵌入式',
        'quantum-hfss': '量子计算',
        lerobot: '具身智能',
      },
      states: {
        spad: '进行中 · 版图后仿真 / 流片前',
        'mobile-robot': '已完成 · 简历材料支持',
        'quantum-hfss': '已完成 · 仅限仿真',
        lerobot: '学习项目 · 进行中',
      },
    },
    {
      prefix: '/en',
      titles: {
        spad: 'SPAD IC Design',
        'mobile-robot': 'Mobile Robot',
        'quantum-hfss': 'Superconducting Quantum Computing',
        lerobot: 'Embodied AI Learning',
      },
      categories: {
        spad: 'IC Design',
        'mobile-robot': 'Robotics / Embedded',
        'quantum-hfss': 'Quantum Computing',
        lerobot: 'Embodied AI',
      },
      states: {
        spad: 'In Progress · Post-layout Simulation / Pre-tapeout',
        'mobile-robot': 'Completed · Resume-Sourced',
        'quantum-hfss': 'Completed · Simulation Only',
        lerobot: 'Learning Project · In Progress',
      },
    },
  ];

  for (const locale of locales) {
    const list = page(`${locale.prefix}/projects`);
    const routePrefix = locale.prefix || '';
    const cardOrder = [...list.matchAll(new RegExp(`href="${routePrefix}/projects/([^"/#?]+)"`, 'g'))]
      .map((match) => match[1]);
    assert.deepEqual(cardOrder, slugs, 'project cards follow the V3 identity order');
    for (const slug of slugs) {
      const detailRoute = `${locale.prefix}/projects/${slug}`;
      assert.ok(existsSync(output(detailRoute)), `${detailRoute} is generated`);
      const card = projectCard(list, slug);
      assert.equal(projectCardField(card, 'title'), locale.titles[slug], `${detailRoute} card title is exact`);
      assert.equal(projectCardField(card, 'category'), locale.categories[slug], `${detailRoute} card category is exact`);
      assert.equal(projectCardField(card, 'status'), locale.states[slug], `${detailRoute} card status is exact`);
      assert.match(page(detailRoute), new RegExp(`<h1>${locale.titles[slug]}</h1>`));
    }
  }
});

test('V3 project diagrams retain accessible captions and describe the project identity honestly', () => {
  for (const slug of slugs) {
    const zh = page(`/projects/${slug}`);
    const en = page(`/en/projects/${slug}`);
    assert.match(zh, /<figure[^>]*aria-label="[^"]+"[^>]*>[\s\S]*?项目概念示意图/);
    assert.match(en, /<figure[^>]*aria-label="[^"]+"[^>]*>[\s\S]*?Conceptual project diagram/);
    assert.match(zh, /<svg[^>]*role="img"[^>]*aria-labelledby="[^"]+"/);
    assert.match(en, /<title id="[^"]+">[^<]+<\/title><desc id="[^"]+">[^<]+<\/desc>/);
  }

  assert.match(textContent(page('/projects/quantum-hfss')), /超导量子计算.*仿真方法/);
  assert.match(textContent(page('/en/projects/quantum-hfss')), /Superconducting Quantum Computing.*simulation method/i);
  assert.match(textContent(page('/projects/lerobot')), /具身智能学习地图.*未表示技术已完成/);
  assert.match(textContent(page('/en/projects/lerobot')), /Embodied AI learning map.*does not mark technologies as completed/i);
});

for (const locale of [
  {
    label: 'Chinese',
    prefix: '',
    spad: {
      measured: /实测（板级）/,
      preLayout: /版图前仿真/,
      postLayout: /版图后状态/,
      tapeoutBoundary: /不得解读为已经流片/,
    },
    mobile: {
      supported: ['Python', 'YOLO', 'ROS', '上下位机通信', 'MCU', '电机控制'],
      forbidden: /ROS2|UAV|LiDAR|depth camera|Raspberry Pi|树莓派|无人机|激光雷达|深度相机/i,
    },
    quantum: {
      simulationOnly: /仅限仿真/,
      methodOnly: /HFSS 在这里是研究超导量子计算相关结构的工具与方法/,
      forbidden: /\bT1\b|\bT2\b|\bQ[- ]?factor\b|量子比特频率|coherence|相干时间|制备完成|流片完成|实测结果/i,
    },
    learning: {
      overallState: /学习项目 · 进行中/,
      states: ['已明确', '正在练习', '规划中', '下一步'],
      notVerified: '尚未核实',
      falseCompletion: /训练成功|推理成功|已完成.{0,16}(?:LeRobot|ACT|VLA|VLM|VCT)/,
    },
  },
  {
    label: 'English',
    prefix: '/en',
    spad: {
      measured: /Measured \(board-level\)/,
      preLayout: /Pre-layout simulation/,
      postLayout: /Post-layout status/,
      tapeoutBoundary: /must not be read as completed tapeout/i,
    },
    mobile: {
      supported: ['Python', 'YOLO', 'ROS', 'upper/lower-controller communication', 'MCU', 'motor control'],
      forbidden: /ROS2|UAV|LiDAR|depth camera|Raspberry Pi/i,
    },
    quantum: {
      simulationOnly: /simulation only/i,
      methodOnly: /HFSS is the simulation method used to study structures related to superconducting quantum computing/i,
      forbidden: /\bT1\b|\bT2\b|\bQ[- ]?factor\b|qubit frequency|coherence|fabricated result|taped out|manufactured result|measured result/i,
    },
    learning: {
      overallState: /Learning Project · In Progress/,
      states: ['Learned', 'Practicing', 'Planned', 'Next'],
      notVerified: 'not yet verified',
      falseCompletion: /training succeeded|successful inference|completed pipeline/i,
    },
  },
]) {
  test(`${locale.label} project bodies independently preserve every evidence boundary`, () => {
    const spad = textContent(page(`${locale.prefix}/projects/spad`));
    assert.match(spad, locale.spad.measured);
    assert.match(spad, locale.spad.preLayout);
    assert.match(spad, locale.spad.postLayout);
    assert.match(spad, /1 W[\s\S]*0\.1 W/);
    assert.match(spad, /2 mW[\s\S]*200 mW/);
    assert.match(spad, locale.spad.tapeoutBoundary);

    const mobile = textContent(page(`${locale.prefix}/projects/mobile-robot`));
    for (const supported of locale.mobile.supported) assert.match(mobile, new RegExp(supported, 'i'));
    assert.doesNotMatch(mobile, locale.mobile.forbidden);

    const quantum = textContent(page(`${locale.prefix}/projects/quantum-hfss`));
    assert.match(quantum, locale.quantum.simulationOnly);
    assert.match(quantum, locale.quantum.methodOnly);
    assert.doesNotMatch(quantum, locale.quantum.forbidden);

    const learning = textContent(page(`${locale.prefix}/projects/lerobot`));
    assert.match(learning, locale.learning.overallState);
    for (const state of locale.learning.states) assert.match(learning, new RegExp(state));
    for (const topic of ['ROS2', 'Gazebo', 'MuJoCo', 'LeRobot', 'ACT', 'VLA', 'VLM', 'VCT']) {
      assert.match(learning, new RegExp(`${topic}[^.。]{0,80}${locale.learning.notVerified}`, 'i'));
    }
    assert.doesNotMatch(learning, locale.learning.falseCompletion);
  });
}

test('V3 project pages use natural public states instead of development placeholders', () => {
  const publicText = ['', '/en'].flatMap((prefix) => [
    textContent(page(`${prefix}/projects`)),
    ...slugs.map((slug) => textContent(page(`${prefix}/projects/${slug}`))),
  ]).join('\n');

  assert.doesNotMatch(publicText, /TODO|Placeholder|Need verification|Add verified/i);
});

test('Embodied AI cards and metadata expose a state message instead of an empty or completed technology list', () => {
  for (const [listRoute, detailRoute, stateMessage] of [
    ['/projects', '/projects/lerobot', '规划主题尚未核实，不列为已完成技术。'],
    ['/en/projects', '/en/projects/lerobot', 'Planned topics are not yet verified and are not listed as completed technologies.'],
  ]) {
    const card = projectCard(page(listRoute), 'lerobot');
    assert.doesNotMatch(card, /<ul class="technology-list"/);
    assert.match(card, new RegExp(`<p class="project-technology-state">${stateMessage}</p>`));

    const metadata = page(detailRoute).match(/<dl class="project-meta"[^>]*>[\s\S]*?<\/dl>/)?.[0] ?? '';
    assert.match(metadata, new RegExp(stateMessage));
    assert.doesNotMatch(metadata, /LeRobot|ACT|ROS2|Gazebo|MuJoCo|VLA|VLM|VCT/);
  }
});

test('Embodied AI keeps one exact overall state across Home, Projects, and detail metadata', () => {
  for (const [prefix, expected] of [
    ['', '学习项目 · 进行中'],
    ['/en', 'Learning Project · In Progress'],
  ]) {
    const homeCard = projectCard(page(prefix || '/'), 'lerobot');
    const projectsCard = projectCard(page(`${prefix}/projects`), 'lerobot');
    const detail = page(`${prefix}/projects/lerobot`);
    const detailState = detail.match(/<dl class="project-meta"[^>]*data-project-state="([^"]+)"/)?.[1] ?? '';

    assert.equal(projectCardField(homeCard, 'status'), expected, `${prefix || '/'} Home state is exact`);
    assert.equal(projectCardField(projectsCard, 'status'), expected, `${prefix || '/'} Projects state is exact`);
    assert.equal(detailState, expected, `${prefix || '/'} detail state is exact`);
  }
});
