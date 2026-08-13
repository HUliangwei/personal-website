import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
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

function outputFiles(extension) {
  return readdirSync(dist, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(entry.parentPath, entry.name));
}

test('About renders an evidence-bounded bilingual technical journey in chronological order', () => {
  build();

  const zh = page('/about');
  const en = page('/en/about');

  assert.match(zh, /<h1[^>]*>[^<]*技术路径/);
  assert.match(en, /<h1[^>]*>[^<]*technical (?:path|journey)/i);
  assert.match(zh, /<h2[^>]*>我的技术旅程<\/h2>/);
  assert.match(en, /<h2[^>]*>My technical journey<\/h2>/i);

  const expected = [
    ['2020.09 - 2024.06', 'Sep 2020 - Jun 2024', '物理与硬件基础', 'Physics &amp; hardware foundations'],
    ['本科阶段', 'Undergraduate period', '智能小车', 'mobile robot'],
    ['2023.09 - 2023.12', 'Sep - Dec 2023', 'HFSS', 'HFSS'],
    ['2024.09 - 至今', 'Sep 2024 - present', 'SPAD', 'SPAD'],
    ['学习中 / 进行中', 'Learning / In progress', 'LeRobot', 'LeRobot'],
    ['当前', 'Current', '当前关注', 'Current focus'],
  ];

  let zhCursor = 0;
  let enCursor = 0;
  for (const [zhDate, enDate, zhLabel, enLabel] of expected) {
    const zhPosition = zh.indexOf(zhLabel, zhCursor);
    const enPosition = en.toLowerCase().indexOf(enLabel.toLowerCase(), enCursor);
    assert.ok(zhPosition > zhCursor, `${zhLabel} follows the preceding Chinese stage`);
    assert.ok(enPosition > enCursor, `${enLabel} follows the preceding English stage`);
    zhCursor = zhPosition;
    enCursor = enPosition;
    assert.ok(zh.slice(Math.max(0, zhPosition - 500), zhPosition + 500).includes(zhDate));
    assert.ok(en.slice(Math.max(0, enPosition - 500), enPosition + 500).includes(enDate));
  }

  assert.match(zh, /data-stage-id="embodied-learning"[\s\S]{0,1600}(?:学习中|进行中)[\s\S]{0,1600}LeRobot[\s\S]{0,1600}(?:待核实|TODO)/i);
  assert.match(en, /data-stage-id="embodied-learning"[\s\S]{0,1600}Learning[\s\S]{0,300}In progress[\s\S]{0,1600}LeRobot[\s\S]{0,1600}(?:verification|TODO)/i);
  assert.match(zh, /HFSS[\s\S]{0,800}(?:百度|实习)/);
  assert.match(en, /HFSS[\s\S]{0,800}Baidu[\s\S]{0,300}internship/i);
  assert.doesNotMatch(zh, /(?:T1|T2|相干时间|Q[- ]?factor|量子比特频率)/i);
  assert.doesNotMatch(en, /(?:coherence time|Q[- ]?factor|qubit frequency|fabrication result)/i);
  assert.doesNotMatch(zh, />[^<]*ROS2[^<]*</i);
  assert.doesNotMatch(en, />[^<]*ROS2[^<]*</i);
});

test('About keeps a complete semantic ordered journey without JavaScript', () => {
  const zh = page('/about');
  const en = page('/en/about');

  for (const html of [zh, en]) {
    assert.match(html, /<section[^>]*data-about-journey/);
    assert.match(html, /<ol[^>]*class="[^"]*journey-timeline/);
    assert.equal((html.match(/<li[^>]*data-journey-stage/g) ?? []).length, 6);
    assert.equal((html.match(/<article[^>]*class="[^"]*journey-stage-card/g) ?? []).length, 6);
    assert.match(html, /<svg[^>]*class="[^"]*journey-stage-visual/);
    assert.match(html, /aria-label="[^"]*(?:概念|conceptual)[^"]*"/i);
    assert.match(html, /data-journey-progress/);
    assert.match(html, /data-journey-status/);
  }

  assert.match(zh, /中国科学技术大学/);
  assert.match(zh, /武汉大学/);
  assert.match(en, /University of Science and Technology of China/);
  assert.match(en, /Wuhan University/);
  assert.match(zh, /<h2[^>]*>研究之外<\/h2>[\s\S]*待核实/);
  assert.match(en, /<h2[^>]*>Outside research<\/h2>[\s\S]*TODO/);
});

test('About motion is progressive, reduced-motion safe, and lifecycle-clean', () => {
  const component = readFileSync(join(root, 'src/components/about/JourneyTimeline.astro'), 'utf8');
  const controller = readFileSync(join(root, 'src/scripts/about-journey.ts'), 'utf8');
  const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');

  assert.match(component, /await import\(['"]\.\.\/\.\.\/scripts\/about-journey['"]\)/);
  assert.match(component, /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/);
  assert.match(component, /matchMedia\(['"]\(min-width:\s*44\.0625rem\)['"]\)/);
  assert.match(component, /new AbortController\(\)/);
  assert.match(component, /abortController\.abort\(\)/);
  assert.match(controller, /IntersectionObserver/);
  assert.match(controller, /requestAnimationFrame/);
  assert.match(controller, /cancelAnimationFrame/);
  assert.match(controller, /signal\?\.addEventListener\(['"]abort['"],\s*dispose/);
  assert.match(controller, /removeEventListener/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.journey-stage-card[\s\S]*?opacity:\s*1/);
  assert.match(css, /@media\s*\(max-width:\s*44rem\)[\s\S]*?\.journey-sticky[\s\S]*?position:\s*static/);

  const aboutAssets = outputFiles('.js').filter((file) => readFileSync(file, 'utf8').includes('[data-about-journey]'));
  assert.equal(aboutAssets.length, 1, 'one About-only progressive enhancement bundle is emitted');
  const aboutAsset = aboutAssets[0].slice(dist.length).replaceAll('\\', '/');
  assert.match(page('/about'), new RegExp(aboutAsset.split('/').at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(page('/en/about'), new RegExp(aboutAsset.split('/').at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const route of ['/', '/projects', '/cv', '/en', '/en/projects', '/en/cv']) {
    assert.doesNotMatch(page(route), new RegExp(aboutAsset.split('/').at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
