import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const slugs = ['spad', 'lerobot', 'mobile-robot', 'quantum-hfss'];

function output(route) {
  return join(dist, route.replace(/^\//, ''), 'index.html');
}

function page(route) {
  return readFileSync(output(route), 'utf8');
}

function projectLinks(html, prefix) {
  return [...html.matchAll(new RegExp(`href="${prefix}/projects/([^"/#?]+)"`, 'g'))]
    .map((match) => match[1]);
}

test('V2 publishes exactly four locale-specific case studies without the obsolete route', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const expectedFiles = slugs.flatMap((slug) => [`${slug}.mdx`, `${slug}.en.mdx`]).sort();
  const actualFiles = readdirSync(join(root, 'src/content/projects')).filter((name) => name.endsWith('.mdx')).sort();
  assert.deepEqual(actualFiles, expectedFiles, 'collection IDs remain stable and distinguish locale');

  for (const slug of slugs) {
    assert.ok(existsSync(output(`/projects/${slug}`)), `Chinese ${slug} route is generated`);
    assert.ok(existsSync(output(`/en/projects/${slug}`)), `English ${slug} route is generated`);
  }

  assert.deepEqual(projectLinks(page('/projects'), ''), slugs, 'Chinese list contains exactly four ordered projects');
  assert.deepEqual(projectLinks(page('/en/projects'), '/en'), slugs, 'English list contains exactly four ordered projects');
  assert.equal(existsSync(output('/projects/ros2-robot')), false);
  assert.equal(existsSync(output('/en/projects/ros2-robot')), false);
});

test('project schema localizes entries and accepts deliberately absent covers and links', () => {
  const config = readFileSync(join(root, 'src/content.config.ts'), 'utf8');
  assert.match(config, /locale:\s*z\.enum\(\[['"]zh['"],\s*['"]en['"]\]\)/);
  assert.match(config, /cover:\s*z\.string\(\)\.optional\(\)/);
  assert.match(config, /links:\s*z\.array\([\s\S]*?\)\.optional\(\)/);
  assert.doesNotMatch(config, /z\.any\(|z\.unknown\(/);
});

test('all project pages retain a complete localized engineering case-study structure', () => {
  const headingSets = {
    zh: ['项目概览', '问题 / 动机', '我的角色', '系统架构', '设计 / 方法', '实现', '验证 / 实验', '结果', '挑战与决策', '收获与反思', '链接'],
    en: ['Overview', 'Problem / Motivation', 'My Role', 'Architecture', 'Design / Method', 'Implementation', 'Verification / Experiments', 'Results', 'Challenges &amp; Decisions', 'What I Learned', 'Links'],
  };

  for (const locale of ['zh', 'en']) {
    for (const slug of slugs) {
      const route = locale === 'zh' ? `/projects/${slug}` : `/en/projects/${slug}`;
      const html = page(route);
      for (const heading of headingSets[locale]) {
        assert.match(html, new RegExp(`<h2[^>]*>${heading.replace('/', '\\/')}</h2>`), `${route} includes ${heading}`);
      }
    }
  }
});

test('published project claims preserve evidence and measurement boundaries', () => {
  const zhSpad = page('/projects/spad');
  const enSpad = page('/en/projects/spad');
  for (const [html, measured, preLayout, postLayout] of [
    [zhSpad, /实测（板级）/, /版图前仿真/, /版图后状态/],
    [enSpad, /Measured \(board-level\)/, /Pre-layout simulation/, /Post-layout status/],
  ]) {
    assert.match(html, measured);
    assert.match(html, preLayout);
    assert.match(html, postLayout);
    assert.match(html, /(?:1\s*W[\s\S]*0\.1\s*W|1 W[\s\S]*0\.1 W)/i);
    assert.match(html, /(?:2\s*mW[\s\S]*200\s*mW|2 mW[\s\S]*200 mW)/i);
    assert.match(html, /不得解读为已经流片|must not be read as completed tapeout/i);
    const postLayoutItem = html.match(/<li>[^<]*(?:版图后状态|Post-layout status)[\s\S]*?<\/li>/i)?.[0] ?? '';
    assert.doesNotMatch(postLayoutItem, /\d+(?:\.\d+)?\s*(?:mW|W)\b/i);
  }

  const mobile = `${page('/projects/mobile-robot')}\n${page('/en/projects/mobile-robot')}`;
  for (const supported of ['Python', 'YOLO', 'ROS', 'MCU']) assert.match(mobile, new RegExp(supported));
  assert.doesNotMatch(mobile, /ROS2|UAV|LiDAR|depth camera|Raspberry Pi|树莓派|无人机|激光雷达|深度相机/i);
  assert.match(mobile, /简历自述|resume-sourced claim/i);

  const quantum = `${page('/projects/quantum-hfss')}\n${page('/en/projects/quantum-hfss')}`;
  for (const supported of ['HFSS', 'mesh', 'sweep']) assert.match(quantum, new RegExp(supported, 'i'));
  assert.match(quantum, /仅限仿真|simulation only/i);
  assert.doesNotMatch(quantum, /\bT1\b|\bT2\b|\bQ[- ]?factor\b|\bcoherence\b|\bfabricat(?:ed|ion)\b|\bmeasured result\b|实测结果|制备完成/i);

  const lerobot = `${page('/projects/lerobot')}\n${page('/en/projects/lerobot')}`;
  for (const pendingSection of ['Dataset', 'ACT', 'Training', 'Checkpoint', 'Inference', 'MuJoCo', 'PushT', 'Evaluation']) {
    assert.match(lerobot, new RegExp(pendingSection, 'i'));
  }
  assert.match(lerobot, /待核实|TODO: Verification required/i);
  assert.doesNotMatch(lerobot, /training succeeded|successful inference|achieved accuracy|训练成功|推理成功|达到.{0,8}(?:准确率|成功率)/i);
});
