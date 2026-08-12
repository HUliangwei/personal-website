import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const slugs = ['spad', 'lerobot', 'mobile-robot', 'quantum-hfss'];

function page(route) {
  return readFileSync(join(dist, route.replace(/^\//, ''), 'index.html'), 'utf8');
}

function textContent(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&rarr;|&#x2192;/gi, '→').replace(/\s+/g, ' ').trim();
}

test('V2 project lists and details render four localized accessible conceptual figures', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  for (const [locale, prefix, caption] of [
    ['zh', '', '项目概念示意图'],
    ['en', '/en', 'Conceptual project diagram'],
  ]) {
    const list = page(`${prefix}/projects`);
    assert.equal((list.match(/data-project-visual=/g) ?? []).length, 4, `${locale} list has one visual per project`);
    assert.equal((list.match(new RegExp(caption, 'g')) ?? []).length, 4, `${locale} cards label diagrams honestly`);
    assert.doesNotMatch(list, /TODO: Add project cover image|待补充项目封面图/);

    for (const slug of slugs) {
      const detail = page(`${prefix}/projects/${slug}`);
      assert.match(detail, new RegExp(`data-project-visual="${slug}"`));
      assert.match(detail, new RegExp(`<figure[^>]*data-figure-type="conceptual"[\\s\\S]*?<figcaption[\\s\\S]*?${caption}`));
      assert.match(detail, /<svg[^>]*role="img"[^>]*aria-labelledby="[^"]+"[^>]*viewBox="0 0 [^"]+"/);
      assert.match(detail, /<title id="[^"]+">[^<]+<\/title>[\s\S]*?<desc id="[^"]+">[^<]+<\/desc>/);
    }
  }
});

test('conceptual diagrams disclose only verified architecture and pending learning workflows', () => {
  const spad = textContent(page('/en/projects/spad'));
  for (const label of ['SPAD Array', 'AFE', 'Discriminator', 'HV/LV Isolation', 'Digital Control', 'IO/FPGA', 'External HV', 'Quench/Reset', 'SPAD']) {
    assert.match(spad, new RegExp(label.replace('/', '\\/')));
  }

  const lerobot = textContent(page('/en/projects/lerobot'));
  for (const label of ['LeRobot Dataset', 'PushT', 'ACT Transformer', 'Checkpoint', 'Inference', 'MuJoCo / Robot Action']) {
    assert.match(lerobot, new RegExp(label.replace('/', '\\/')));
  }
  assert.match(lerobot, /Conceptual learning pipeline · not a completed-result claim/i);
  assert.doesNotMatch(lerobot, /trained checkpoint|successful inference|completed pipeline/i);

  const mobile = textContent(page('/en/projects/mobile-robot'));
  for (const label of ['Camera', 'YOLO Perception', 'ROS', 'Decision', 'Hardware Communication', 'MCU', 'Motor', 'Robot']) {
    assert.match(mobile, new RegExp(label));
  }
  assert.doesNotMatch(mobile, /ROS2|UAV|LiDAR|depth camera/i);

  const quantum = textContent(page('/en/projects/quantum-hfss'));
  for (const label of ['Geometry', 'HFSS Model', 'Material / Boundary / Port', 'Mesh', 'Sweep', 'EM Field', 'Optimization']) {
    assert.match(quantum, new RegExp(label.replaceAll('/', '\\/')));
  }
  assert.match(quantum, /Conceptual simulation workflow · not HFSS result imagery/i);
  assert.doesNotMatch(quantum, /S-parameter|GHz|measured field|validated result/i);
});

test('cards expose category, date, status, title, summary, technologies, and keyboard-operable filters', () => {
  const html = page('/en/projects');
  for (const slug of slugs) {
    const card = [...html.matchAll(/<article class="project-card"[\s\S]*?<\/article>/g)]
      .map((match) => match[0])
      .find((candidate) => candidate.includes(`/en/projects/${slug}`));
    assert.ok(card, `${slug} card exists`);
    assert.match(card, /class="project-category"/);
    assert.match(card, /class="project-date"/);
    assert.match(card, /class="project-status"/);
    assert.match(card, /<h2>/);
    assert.match(card, /class="project-summary"/);
    assert.match(card, /class="technology-list"/);
  }
  assert.match(html, /class="project-filter-controls"[^>]*role="toolbar"[^>]*aria-label="Filter projects by category"/);
  assert.match(html, /data-project-filter-empty[^>]*hidden/);
});

test('compact cards use readable semantic flows instead of scaling 960-unit SVG labels', () => {
  const html = page('/en/projects');
  assert.equal((html.match(/class="project-visual-flow"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /<article class="project-card"[\s\S]*?<svg[^>]*viewBox="0 0 960 360"/);
  for (const labels of [
    ['SPAD', 'AFE', 'Control', 'FPGA'],
    ['Dataset', 'ACT', 'Inference', 'Action'],
    ['Camera', 'YOLO', 'ROS', 'Robot'],
    ['Geometry', 'HFSS', 'Sweep', 'Optimize'],
  ]) {
    for (const label of labels) assert.match(html, new RegExp(`class="project-visual-flow"[\\s\\S]*?${label}`));
  }

  const source = readFileSync(join(root, 'src/components/projects/ProjectVisual.astro'), 'utf8');
  assert.match(source, /compact\s*\?\s*\(/);
  assert.match(source, /class="project-visual-flow"/);
  assert.match(source, /<Diagram[^>]*locale=\{locale\}/);

  const styles = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  assert.match(styles, /\.project-visual-flow\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /@media\s*\(max-width:\s*44rem\)[\s\S]*?\.project-detail\s+\.project-figure-canvas/);
});

test('figure interface distinguishes conceptual, real, simulation, and measured evidence without embedded raster data', () => {
  const component = readFileSync(join(root, 'src/components/projects/ProjectFigure.astro'), 'utf8');
  assert.match(component, /'real'\s*\|\s*'conceptual'\s*\|\s*'simulation'\s*\|\s*'measured'/);
  assert.match(component, /data-figure-type=\{type\}/);
  assert.match(component, /figureLabels\[locale\]\[type\]/);
  assert.doesNotMatch(component, /data:image\/(?:png|jpeg|webp);base64/i);

  const styles = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  assert.match(styles, /\.project-visual-svg\s*\{[\s\S]*?max-width:\s*100%/);
  assert.match(styles, /\.project-filter-controls\s*\{[\s\S]*?overflow-x:\s*auto/);
  assert.match(styles, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.project-card/);
  assert.match(styles, /@media\s*\(forced-colors:\s*active\)[\s\S]*?\.project-figure/);
});
