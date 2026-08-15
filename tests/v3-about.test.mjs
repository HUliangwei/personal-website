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

function section(html, marker) {
  const match = html.match(new RegExp(`<section[^>]*data-about-section="${marker}"[^>]*>[\\s\\S]*?<\\/section>`));
  assert.ok(match, `About renders the ${marker} section`);
  return match[0];
}

function outputFiles(extension) {
  return readdirSync(dist, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(entry.parentPath, entry.name));
}

test('About explains Liangwei Hu through the complete V3 section order', () => {
  build();

  for (const html of [page('/about'), page('/en/about')]) {
    let cursor = 0;
    for (const marker of ['about-me', 'education', 'technical-journey', 'how-i-work', 'now', 'side-quests']) {
      const position = html.indexOf(`data-about-section="${marker}"`);
      assert.ok(position > cursor, `${marker} follows the preceding About section`);
      cursor = position;
    }
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  }

  assert.match(page('/about'), /<h1[^>]*>关于我<\/h1>/);
  assert.match(page('/en/about'), /<h1[^>]*>About Me<\/h1>/);
});

test('Education Journey uses the five schools in order with the user-provided early-school periods', () => {
  const cases = [
    ['/about', ['宣城市第三小学', '宣城市第十二中学', '宣城中学', '武汉大学', '中国科学技术大学']],
    ['/en/about', ['Xuancheng No. 3 Primary School', 'Xuancheng No. 12 Middle School', 'Xuancheng High School', 'Wuhan University', 'University of Science and Technology of China']],
  ];

  for (const [route, schools] of cases) {
    const education = section(page(route), 'education');
    assert.match(education, /<ol[^>]*class="[^"]*education-journey/);
    assert.equal((education.match(/<li[^>]*data-school-id=/g) ?? []).length, 5);
    let cursor = 0;
    for (const school of schools) {
      const position = education.indexOf(school, cursor);
      assert.ok(position > cursor, `${school} follows the preceding school`);
      cursor = position;
    }
    const earlyPeriods = route === '/about'
      ? {
          'primary-school': '2008.09 - 2014.06',
          'middle-school': '2014.09 - 2017.06',
          'high-school': '2017.09 - 2020.07',
        }
      : {
          'primary-school': 'Sep 2008 - Jun 2014',
          'middle-school': 'Sep 2014 - Jun 2017',
          'high-school': 'Sep 2017 - Jul 2020',
        };
    for (const [id, period] of Object.entries(earlyPeriods)) {
      const item = education.match(new RegExp(`<li[^>]*data-school-id="${id}"[^>]*>[\\s\\S]*?<\\/li>`))?.[0];
      assert.ok(item, `${id} is rendered`);
      assert.match(item, /<time\b/);
      assert.match(item, new RegExp(period.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      assert.doesNotMatch(item, /data-period-source="verified-resume"/);
    }
    for (const id of ['undergraduate', 'graduate']) {
      const item = education.match(new RegExp(`<li[^>]*data-school-id="${id}"[^>]*>[\\s\\S]*?<\\/li>`))?.[0];
      assert.match(item, /<time[^>]*data-period-source="verified-resume"/);
    }
  }
});

test('Technical Journey renders two independent ordered tracks with evidence-bounded identities', () => {
  const zh = section(page('/about'), 'technical-journey');
  const en = section(page('/en/about'), 'technical-journey');

  for (const html of [zh, en]) {
    assert.equal((html.match(/<ol[^>]*data-journey-track=/g) ?? []).length, 2);
    assert.equal((html.match(/<li[^>]*data-journey-stage/g) ?? []).length, 10);
    const visuals = Array.from(html.matchAll(/<svg[^>]*class="[^"]*journey-stage-visual[^"]*"[^>]*>[\s\S]*?<\/svg>/g), ([visual]) => visual);
    assert.equal(visuals.length, 10);
    for (const visual of visuals) {
      assert.match(visual, /role="img"/);
      assert.match(visual, /aria-labelledby="([^"]+) ([^"]+)"/);
      assert.match(visual, /<title id="[^"]+">[^<]*(?:概念|conceptual)[^<]*<\/title>/i);
      assert.match(visual, /<desc id="[^"]+">[^<]+<\/desc>/);
    }
  }

  assert.match(zh, /工程主线[\s\S]*智能小车[\s\S]*SPAD 芯片设计[\s\S]*具身智能学习/);
  assert.match(en, /Engineering Track[\s\S]*Mobile Robot[\s\S]*SPAD IC Design[\s\S]*Embodied AI Learning/);
  assert.match(zh, /物理与量子主线[\s\S]*物理学基础[\s\S]*超导量子比特[\s\S]*量子科学与技术[\s\S]*量子计算与量子通信/);
  assert.match(en, /Physics \/ Quantum Track[\s\S]*Physics Foundations[\s\S]*Superconducting Qubits[\s\S]*Quantum Science &amp; Technology[\s\S]*Quantum Computing &amp; Communication/);
  assert.match(zh, /data-stage-id="superconducting-quantum"[\s\S]*<h3[^>]*>超导量子比特<\/h3>[\s\S]*HFSS[\s\S]*参数扫描[\s\S]*场分布分析/);
  assert.match(en, /data-stage-id="superconducting-quantum"[\s\S]*<h3[^>]*>Superconducting Qubits<\/h3>[\s\S]*HFSS[\s\S]*parameter sweeps[\s\S]*field analysis/i);
  assert.doesNotMatch(zh, /<h3[^>]*>HFSS[^<]*<\/h3>/i);
  assert.doesNotMatch(en, /<h3[^>]*>HFSS[^<]*<\/h3>/i);
  assert.doesNotMatch(zh, />[^<]*ROS2[^<]*</i);
  assert.doesNotMatch(en, />[^<]*ROS2[^<]*</i);
});

test('How I Work shows verified end-to-end workflows instead of self-rating claims', () => {
  const zh = section(page('/about'), 'how-i-work');
  const en = section(page('/en/about'), 'how-i-work');

  assert.match(zh, /系统架构[\s\S]*电路[\s\S]*仿真[\s\S]*版图[\s\S]*DRC \/ LVS[\s\S]*PEX/);
  assert.match(en, /System Architecture[\s\S]*Circuit[\s\S]*Simulation[\s\S]*Layout[\s\S]*DRC \/ LVS[\s\S]*PEX/);
  assert.match(zh, /物理模型[\s\S]*微波结构[\s\S]*HFSS[\s\S]*参数扫描[\s\S]*场分布分析/);
  assert.match(en, /Physical Model[\s\S]*Microwave Structure[\s\S]*HFSS[\s\S]*Parameter Sweep[\s\S]*Field Analysis/);
  assert.doesNotMatch(zh, /我学习能力很强|我有全局视角/);
  assert.doesNotMatch(en, /I am a fast learner|I have a global perspective/i);
});

test('Now stays on the SPAD work while Side Quests contains only the three technical explorations', () => {
  const zhNow = section(page('/about'), 'now');
  const enNow = section(page('/en/about'), 'now');
  assert.match(zhNow, /SPAD 单光子探测器读出芯片[\s\S]*芯片设计[\s\S]*版图[\s\S]*验证[\s\S]*PEX[\s\S]*版图后仿真[\s\S]*流片准备/);
  assert.match(enNow, /SPAD Single-Photon Detector Readout IC[\s\S]*IC Design[\s\S]*Layout[\s\S]*Verification[\s\S]*PEX[\s\S]*Post-layout Simulation[\s\S]*Tape-out Preparation/);
  assert.doesNotMatch(zhNow, /具身智能|量子计算|机器人/);
  assert.doesNotMatch(enNow, /Embodied AI|Quantum Computing|Robotics/);

  const zhSide = section(page('/about'), 'side-quests');
  const enSide = section(page('/en/about'), 'side-quests');
  for (const value of ['量子计算', '具身智能', '嵌入式系统']) assert.match(zhSide, new RegExp(value));
  for (const value of ['Quantum Computing', 'Embodied AI', 'Embedded Systems']) assert.match(enSide, new RegExp(value));
  assert.doesNotMatch(zhSide, /足球|篮球|羽毛球|KTV|麻将|骑马与砍杀|维多利亚|无畏契约/);
  assert.doesNotMatch(enSide, /Football|Basketball|Badminton|Karaoke|Mahjong|Mount &amp; Blade|Victoria|VALORANT/);
});

test('About removes public development markers and the abstract V2 template framing', () => {
  for (const html of [page('/about'), page('/en/about')]) {
    assert.doesNotMatch(html, /TODO|Placeholder|Need verification|Add verified|待核实/i);
  }
  assert.doesNotMatch(page('/about'), /值得持续追问的问题|一个连贯视角|跨层实践|没有公开日期|证据边界|待核实|不表述为|不是已流片|仅限仿真/);
  assert.doesNotMatch(page('/en/about'), /Questions worth returning to|One connected view|Working across layers|No dates are published|evidence boundary|TODO verification|not presented as|does not claim|simulation only/i);
});

test('About owns one route-scoped enhancement bundle with BFCache restoration hooks', () => {
  const aboutAssets = outputFiles('.js').filter((file) => readFileSync(file, 'utf8').includes('[data-about-journey]'));
  assert.equal(aboutAssets.length, 1);
  const assetName = aboutAssets[0].split(/[\\/]/).at(-1);
  const asset = readFileSync(aboutAssets[0], 'utf8');

  assert.match(asset, /pagehide/);
  assert.match(asset, /pageshow/);
  assert.match(asset, /persisted/);
  assert.match(page('/about'), new RegExp(assetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(page('/en/about'), new RegExp(assetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const route of ['/', '/projects', '/cv', '/en', '/en/projects', '/en/cv']) {
    assert.doesNotMatch(page(route), new RegExp(assetName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('DualTrackJourney wires the production bootstrap to desktop, reduced-motion, abort, and controller inputs', () => {
  const component = readFileSync(join(root, 'src/components/about/DualTrackJourney.astro'), 'utf8');

  assert.match(component, /createAboutJourneyBootstrap/);
  assert.match(component, /createJourneyMotionController/);
  assert.match(component, /matchMedia\(['"]\(min-width:\s*48\.001rem\)['"]\)/);
  assert.match(component, /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/);
  assert.match(component, /new AbortController\(\)/);
  assert.match(component, /await import\(['"]\.\.\/\.\.\/scripts\/about-journey['"]\)/);
});

test('About bootstrap prevents a stale pagehide initializer from clearing the active BFCache generation', async () => {
  const motion = await import(`${pathToFileURL(join(root, 'src/scripts/journey-motion.ts')).href}?bootstrap=${Date.now()}`);
  assert.equal(typeof motion.createAboutJourneyBootstrap, 'function');
  if (typeof motion.createAboutJourneyBootstrap !== 'function') return;

  class FakeMediaQuery {
    listeners = new Set();
    constructor(matches) { this.matches = matches; }
    addEventListener(type, listener) { if (type === 'change') this.listeners.add(listener); }
    removeEventListener(type, listener) { if (type === 'change') this.listeners.delete(listener); }
    set(matches) {
      this.matches = matches;
      for (const listener of this.listeners) listener({ matches });
    }
  }

  const deferred = () => {
    let resolve;
    const promise = new Promise((next) => { resolve = next; });
    return { promise, resolve };
  };
  const firstLoad = deferred();
  const secondLoad = deferred();
  const loads = [firstLoad, secondLoad];
  let loadIndex = 0;
  const rootElement = { owner: 'plain' };
  const desktop = new FakeMediaQuery(true);
  const reduced = new FakeMediaQuery(false);
  const lifecycle = motion.createAboutJourneyBootstrap({
    roots: [rootElement],
    desktop,
    reduced,
    createController: motion.createJourneyMotionController,
    createAbortController: () => new AbortController(),
    loadJourney: () => loads[loadIndex++].promise,
  });
  const settle = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  };

  lifecycle.mount();
  assert.equal(loadIndex, 1);
  lifecycle.teardown();
  lifecycle.handlePageShow({ persisted: true });
  assert.equal(loadIndex, 2);

  secondLoad.resolve((root, { signal }) => {
    assert.equal(signal.aborted, false);
    root.owner = 'new-active';
    return () => { root.owner = 'new-disposed'; };
  });
  await settle();
  assert.equal(rootElement.owner, 'new-active');

  firstLoad.resolve((root) => {
    root.owner = 'old-active';
    return () => { root.owner = 'old-disposed'; };
  });
  await settle();
  assert.equal(rootElement.owner, 'new-active');

  desktop.set(false);
  await settle();
  assert.equal(rootElement.owner, 'new-disposed');
  assert.equal(desktop.listeners.size, 1, 'only the current BFCache generation owns a desktop listener');
  lifecycle.teardown();
  assert.equal(desktop.listeners.size, 0);
  assert.equal(reduced.listeners.size, 0);
});

test('journey motion follows viewport and reduced-motion state without duplicate instances', async () => {
  const { createJourneyMotionController } = await import(`${pathToFileURL(join(root, 'src/scripts/journey-motion.ts')).href}?test=${Date.now()}`);

  class FakeMediaQuery {
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
  assert.deepEqual([initialized, disposed], [1, 0]);
  reduced.set(true);
  await settle();
  assert.deepEqual([initialized, disposed], [1, 1]);
  reduced.set(false);
  await settle();
  assert.deepEqual([initialized, disposed], [2, 1]);
  controller.dispose();
  assert.equal(desktop.listeners.size, 0);
  assert.equal(reduced.listeners.size, 0);
  assert.equal(disposed, 2);
});

test('journey enhancement marks active stages and fully cleans up its lifecycle', async () => {
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
  const stages = Array.from({ length: 10 }, makeElement);
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
    getBoundingClientRect() { return { top: -120, height: 1600 }; },
  };

  globalThis.window = { innerHeight: 800, addEventListener() {}, removeEventListener() {} };
  globalThis.IntersectionObserver = class { observe() {} disconnect() {} };
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  try {
    const { initAboutJourney } = await import(`${pathToFileURL(join(root, 'src/scripts/about-journey.ts')).href}?test=${Date.now()}`);
    const dispose = initAboutJourney(rootElement);
    assert.equal(rootElement.attributes.has('data-journey-enhanced'), true);
    assert.equal(stages[0].attributes.get('aria-current'), 'step');
    assert.equal(status.textContent, '01 / 10');
    assert.equal(styles.has('--journey-progress'), true);
    dispose();
    assert.equal(rootElement.attributes.has('data-journey-enhanced'), false);
    assert.equal(styles.has('--journey-progress'), false);
    for (const stage of stages) {
      assert.equal(stage.hasAttribute('data-active'), false);
      assert.equal(stage.hasAttribute('aria-current'), false);
    }
  } finally {
    globalThis.window = originalWindow;
    globalThis.IntersectionObserver = originalObserver;
    globalThis.requestAnimationFrame = originalRaf;
    globalThis.cancelAnimationFrame = originalCancel;
  }
});
