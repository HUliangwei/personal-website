import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

function build() {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

function page(route) {
  return readFileSync(join(dist, route.replace(/^\//, ''), 'index.html'), 'utf8');
}

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

test('Home introduces Liangwei Hu through the shared V4 information architecture', () => {
  build();

  const contracts = [
    {
      route: '/',
      headings: ['胡良玮', '当前方向', '核心项目', '技术栈', '兴趣与生活', '联系方式'],
      eyebrows: ['01 / 当前方向', '02 / 核心项目', '03 / 技术栈', '04 / 兴趣与生活', '05 / 联系'],
      identity: ['中国科学技术大学量子科学与技术硕士研究生', 'SPAD 单光子探测芯片设计', '喜欢学习、折腾技术，也愿意尝试新事物'],
    },
    {
      route: '/en',
      headings: ['Liangwei Hu', 'Current Focus', 'Selected Projects', 'Technical Toolkit', 'Life & Interests', "Let's Connect"],
      eyebrows: ['01 / Current Focus', '02 / Selected Projects', '03 / Technical Toolkit', '04 / Life & Interests', '05 / Contact'],
      identity: ['University of Science and Technology of China', "Master's student in Quantum Science and Technology", 'SPAD single-photon detector readout IC design', 'I enjoy learning, tinkering with technology, and trying unfamiliar things'],
    },
  ];

  for (const { route, headings, eyebrows, identity } of contracts) {
    const html = page(route);
    const text = visibleText(html);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route} has one personal-identity h1`);
    for (const heading of headings) assert.match(text, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    for (const eyebrow of eyebrows) assert.match(text, new RegExp(eyebrow.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    for (const fact of identity) assert.match(text, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.equal((html.match(/<section\b/g) ?? []).length, 10, `${route} renders six page sections plus four card topic groups`);
    assert.equal((html.match(/data-scene-focus=/g) ?? []).length, 6, `${route} exposes one scene anchor per Home section`);
  }
});

test('Current Focus qualifies four interests without presenting all of them as graduate research', () => {
  const expectations = [
    ['/', [
      ['SPAD 芯片设计', '研究生科研'],
      ['具身智能', '学习与探索'],
      ['量子计算', '学术兴趣'],
      ['嵌入式系统', '工程兴趣'],
    ]],
    ['/en', [
      ['SPAD IC Design', 'Graduate Research'],
      ['Embodied AI', 'Learning & Exploration'],
      ['Quantum Computing', 'Academic Interest'],
      ['Embedded Systems', 'Engineering Interest'],
    ]],
  ];

  for (const [route, focusItems] of expectations) {
    const html = page(route);
    assert.equal((html.match(/class="focus-item"/g) ?? []).length, 4);
    for (const [name, state] of focusItems) {
      const encodedState = state.replace(/&/g, '&amp;');
      assert.match(html, new RegExp(`<h3>${name}</h3>[\\s\\S]*?<p[^>]*>${encodedState}</p>`));
    }
  }
});

test('Selected Projects renders the four concrete V4 identities from the collection', () => {
  const projects = [
    ['/', ['SPAD 芯片设计', '视觉引导智能小车', '超导量子计算', '具身智能学习']],
    ['/en', ['SPAD IC Design', 'Vision-Guided Mobile Robot', 'Superconducting Quantum Computing', 'Embodied AI Learning']],
  ];

  for (const [route, titles] of projects) {
    const html = page(route);
    const projectGrid = html.match(/<div class="project-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/)?.[1] ?? '';
    assert.equal((projectGrid.match(/data-project-card/g) ?? []).length, 4, `${route} has four selected projects`);
    for (const title of titles) assert.match(projectGrid, new RegExp(`<h3[^>]*>${title}</h3>`));
  }
});

test('Home project selection rejects future featured entries outside the four-item collection', async () => {
  const { selectHomeProjects } = await import('../src/utils/home-projects.ts');
  const candidates = [
    { id: 'extra', data: { slug: 'future-featured', featured: true } },
    { id: 'mobile', data: { slug: 'mobile-robot', featured: true } },
    { id: 'hidden-spad', data: { slug: 'spad', featured: false } },
    { id: 'embodied', data: { slug: 'lerobot', featured: true } },
    { id: 'spad', data: { slug: 'spad', featured: true } },
    { id: 'quantum', data: { slug: 'quantum-hfss', featured: true } },
  ];

  assert.deepEqual(
    selectHomeProjects(candidates).map(({ id }) => id),
    ['spad', 'mobile', 'quantum', 'embodied'],
  );
});

test('Technical Toolkit publishes only evidence-backed completed tools and an honest learning state', () => {
  const expectations = [
    ['/', ['集成电路设计', '数字与硬件描述', '机器人与嵌入式', '量子与仿真', '开发工具', '机器人学习（学习中）']],
    ['/en', ['IC Design', 'Digital / HDL', 'Robotics & Embedded', 'Quantum / Simulation', 'Development Tools', 'Robot Learning (Learning)']],
  ];

  for (const [route, categories] of expectations) {
    const html = page(route);
    const toolkit = html.match(/<section class="section section-surface"[^>]*aria-labelledby="toolkit-title">([\s\S]*?)<\/section>/)?.[1] ?? '';
    for (const category of categories) {
      const encodedCategory = category.replace(/&/g, '&amp;').replace(/[()]/g, '\\$&');
      assert.match(toolkit, new RegExp(`<h3>${encodedCategory}</h3>`));
    }
    assert.match(toolkit, /Cadence Virtuoso/);
    assert.match(toolkit, /Spectre/);
    assert.match(toolkit, /Calibre/);
    assert.match(toolkit, /Python/);
    assert.match(toolkit, /YOLO/);
    assert.match(toolkit, />ROS</);
    assert.match(toolkit, /Ansys HFSS/);
    assert.match(toolkit, /Learning map|学习路线/);
    assert.doesNotMatch(toolkit, /<li>(?:ROS2|Gazebo|MuJoCo|LeRobot|ACT)<\/li>/);
    assert.doesNotMatch(toolkit, /<li>(?:Astro|TypeScript)<\/li>/, 'site implementation tools are not personal toolkit claims');
  }
});

test('Life and Contact use the exact authorized profile data and useful links', () => {
  const expectations = [
    ['/', ['足球', '篮球', '羽毛球', 'KTV', '麻将', '游戏', '骑马与砍杀', '维多利亚', '无畏契约']],
    ['/en', ['Football', 'Basketball', 'Badminton', 'Karaoke', 'Mahjong', 'Gaming', 'Mount & Blade', 'Victoria', 'VALORANT']],
  ];

  for (const [route, interests] of expectations) {
    const html = page(route);
    const text = visibleText(html);
    for (const interest of interests) assert.match(text, new RegExp(interest.replace(/[&]/g, '&(?:amp;)?')));
    assert.match(html, /href="mailto:3036064607@qq\.com"/);
    assert.match(html, /href="tel:\+8618792293249"/);
    assert.match(html, /href="https:\/\/github\.com\/HUliangwei\/personal-website"/);
    assert.match(html, new RegExp(`href="${route === '/' ? '/cv' : '/en/cv'}"`));
  }
});

test('Home removes the old abstractions and all public development or template copy', () => {
  for (const route of ['/', '/en']) {
    const html = page(route);
    const text = visibleText(html);
    assert.doesNotMatch(text, /Research & Engineering|研究与工程|Technical trajectory|技术轨迹|Capabilities|能力版图/);
    assert.doesNotMatch(text, /TODO|Placeholder|Need verification|Add verified|待核实|待补充/i);
    assert.doesNotMatch(html, /TODO|Placeholder|Need verification|Add verified|待核实|待补充/i);
    assert.doesNotMatch(text, /I am passionate about|at the intersection of|bridging\s+\w+\s+and\s+\w+/i);
  }
});
