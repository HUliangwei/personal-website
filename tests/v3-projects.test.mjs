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
        lerobot: '学习地图 · 规划中',
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
        lerobot: 'Learning Map · Planned',
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
      const card = textContent(projectCard(list, slug));
      assert.match(card, new RegExp(locale.titles[slug]));
      assert.match(card, new RegExp(locale.categories[slug].replace('/', '\\/')));
      assert.match(card, new RegExp(locale.states[slug].replace('/', '\\/')));
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

test('V3 project bodies preserve measured, simulation, platform, and learning-state evidence boundaries', () => {
  const spad = `${textContent(page('/projects/spad'))}\n${textContent(page('/en/projects/spad'))}`;
  assert.match(spad, /实测（板级）|Measured \(board-level\)/);
  assert.match(spad, /版图前仿真|Pre-layout simulation/);
  assert.match(spad, /版图后状态|Post-layout status/);
  assert.match(spad, /1 W[\s\S]*0\.1 W/);
  assert.match(spad, /2 mW[\s\S]*200 mW/);
  assert.match(spad, /不得解读为已经流片|must not be read as completed tapeout/i);

  const mobile = `${textContent(page('/projects/mobile-robot'))}\n${textContent(page('/en/projects/mobile-robot'))}`;
  for (const supported of ['Python', 'YOLO', 'ROS', 'MCU', 'Motor Control']) {
    assert.match(mobile, new RegExp(supported, 'i'));
  }
  assert.doesNotMatch(mobile, /ROS2|UAV|LiDAR|depth camera|Raspberry Pi|树莓派|无人机|激光雷达|深度相机/i);

  const quantum = `${textContent(page('/projects/quantum-hfss'))}\n${textContent(page('/en/projects/quantum-hfss'))}`;
  assert.match(quantum, /仅限仿真|simulation only/i);
  assert.match(quantum, /HFSS/);
  assert.doesNotMatch(quantum, /\bT1\b|\bT2\b|\bQ[- ]?factor\b|qubit frequency|量子比特频率|coherence|相干时间/i);
  assert.doesNotMatch(quantum, /(?:fabricated|taped out|manufactured|measured)[^.<]{0,50}(?:result|value|performance)|(?:制备完成|流片完成|实测结果)/i);

  const learning = `${textContent(page('/projects/lerobot'))}\n${textContent(page('/en/projects/lerobot'))}`;
  for (const state of ['Learned', 'Practicing', 'Planned', 'Next', '已明确', '正在练习', '规划中', '下一步']) {
    assert.match(learning, new RegExp(state, 'i'));
  }
  for (const unverified of ['ROS2', 'Gazebo', 'MuJoCo', 'LeRobot', 'ACT', 'VLA', 'VLM', 'VCT']) {
    assert.match(learning, new RegExp(`${unverified}[^.。]{0,80}(?:not yet verified|尚未核实)`, 'i'));
  }
  assert.doesNotMatch(learning, /training succeeded|successful inference|completed pipeline|训练成功|推理成功/i);
  assert.doesNotMatch(learning, /已完成.{0,16}(?:LeRobot|ACT|VLA|VLM|VCT)/);
});

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
