import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  assert.match(zh, /data-stage-id="physics-foundation"[\s\S]{0,1200}(?:量子基础|量子力学)/);
  assert.match(en, /data-stage-id="physics-foundation"[\s\S]{0,1200}(?:quantum foundation|Quantum Mechanics)/i);

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
    const visuals = Array.from(html.matchAll(/<svg[^>]*class="[^"]*journey-stage-visual[^"]*"[^>]*>[\s\S]*?<\/svg>/g), ([visual]) => visual);
    assert.equal(visuals.length, 6);
    for (const visual of visuals) {
      assert.match(visual, /aria-labelledby="([^"]+) ([^"]+)"/);
      assert.match(visual, /<title id="[^"]+">[^<]*(?:概念|conceptual)[^<]*<\/title>/i);
      assert.match(visual, /<desc id="[^"]+">[^<]+<\/desc>/);
    }
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
  assert.match(component, /matchMedia\(['"]\(min-width:\s*48\.001rem\)['"]\)/);
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

test('journey motion controller follows desktop and reduced-motion changes without duplicate instances', async () => {
  const { createJourneyMotionController } = await import(`${pathToFileURL(join(root, 'src/scripts/journey-motion.ts')).href}?test=${Date.now()}`);

  class FakeMediaQuery {
    matches;
    listeners = new Set();
    constructor(matches) { this.matches = matches; }
    addEventListener(type, listener) { if (type === 'change') this.listeners.add(listener); }
    removeEventListener(type, listener) { if (type === 'change') this.listeners.delete(listener); }
    set(matches) {
      this.matches = matches;
      for (const listener of this.listeners) listener({ matches });
    }
  }

  const desktop = new FakeMediaQuery(false);
  const reduced = new FakeMediaQuery(false);
  let initialized = 0;
  let disposed = 0;
  const controller = createJourneyMotionController({
    desktop,
    reduced,
    initialize: async () => {
      initialized += 1;
      let stopped = false;
      return () => { if (!stopped) { stopped = true; disposed += 1; } };
    },
  });
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

  await settle();
  assert.deepEqual([initialized, disposed], [0, 0]);
  desktop.set(true);
  await settle();
  assert.deepEqual([initialized, disposed], [1, 0]);
  desktop.set(true);
  await settle();
  assert.deepEqual([initialized, disposed], [1, 0], 'an unchanged allowed state does not duplicate initialization');
  reduced.set(true);
  await settle();
  assert.deepEqual([initialized, disposed], [1, 1]);
  reduced.set(false);
  await settle();
  assert.deepEqual([initialized, disposed], [2, 1]);
  desktop.set(false);
  await settle();
  assert.deepEqual([initialized, disposed], [2, 2]);
  controller.dispose();
  assert.equal(desktop.listeners.size, 0);
  assert.equal(reduced.listeners.size, 0);
});

test('journey disposer removes active semantics and visual progress from every stage', async () => {
  const originalWindow = globalThis.window;
  const originalObserver = globalThis.IntersectionObserver;
  const originalRaf = globalThis.requestAnimationFrame;
  const originalCancel = globalThis.cancelAnimationFrame;

  const makeElement = () => ({
    attributes: new Map(),
    toggleAttribute(name, force) { if (force) this.attributes.set(name, ''); else this.attributes.delete(name); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    removeAttribute(name) { this.attributes.delete(name); },
    hasAttribute(name) { return this.attributes.has(name); },
    getBoundingClientRect() { return { top: 100 }; },
  });
  const stages = Array.from({ length: 6 }, makeElement);
  const status = { textContent: '' };
  const styles = new Map();
  const rootElement = {
    attributes: new Map(),
    style: {
      setProperty(name, value) { styles.set(name, value); },
      removeProperty(name) { styles.delete(name); },
    },
    querySelectorAll() { return stages; },
    querySelector(selector) { return selector === '[data-journey-status]' ? status : {}; },
    setAttribute(name, value) { this.attributes.set(name, value); },
    removeAttribute(name) { this.attributes.delete(name); },
    getBoundingClientRect() { return { top: -120, height: 1200 }; },
  };

  globalThis.window = { innerHeight: 800, addEventListener() {}, removeEventListener() {} };
  globalThis.IntersectionObserver = class { observe() {} disconnect() {} };
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  try {
    const { initAboutJourney } = await import(`${pathToFileURL(join(root, 'src/scripts/about-journey.ts')).href}?test=${Date.now()}`);
    const dispose = initAboutJourney(rootElement);
    assert.equal(stages[0].hasAttribute('data-active'), true);
    assert.equal(stages[0].attributes.get('aria-current'), 'step');
    assert.equal(styles.has('--journey-progress'), true);
    dispose();
    for (const stage of stages) {
      assert.equal(stage.hasAttribute('data-active'), false);
      assert.equal(stage.hasAttribute('aria-current'), false);
    }
    assert.equal(styles.has('--journey-progress'), false);
  } finally {
    globalThis.window = originalWindow;
    globalThis.IntersectionObserver = originalObserver;
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancel;
  }
});
