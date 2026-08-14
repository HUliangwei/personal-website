import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

test('Home keeps complete bilingual semantic content beside a non-interactive 3D enhancement', () => {
  build();

  for (const [route, title, primaryAction] of [
    ['/', '胡良玮', '浏览项目'],
    ['/en', 'Liangwei Hu', 'Explore projects'],
  ]) {
    const html = page(route);
    assert.match(html, new RegExp(`<section[^>]*class="[^"]*hero[^"]*"[^>]*aria-labelledby="hero-title"`));
    assert.match(html, new RegExp(`<h1 id="hero-title">${title}</h1>`));
    assert.match(html, new RegExp(`<a[^>]+href="${route === '/' ? '/projects' : '/en/projects'}"[^>]*>${primaryAction}`));
    assert.match(html, /<canvas[^>]*data-home-scene-canvas[^>]*aria-hidden="true"[^>]*tabindex="-1"/);
    assert.match(html, /<div[^>]*class="[^"]*home-scene-fallback[^"]*"[^>]*>[\s\S]*?<svg[^>]*role="img"/);
    assert.ok((html.match(/data-scene-focus=/g) ?? []).length >= 5, `${route} exposes scroll focus stages`);
  }
});

test('a missing verified model never emits a GLB URL or request target', async () => {
  assert.equal(existsSync(join(root, 'public/models/hlw.glb')), false, 'fixture intentionally has no verified model');
  const model = await import(`${pathToFileURL(join(root, 'src/utils/model.ts')).href}?test=${Date.now()}`);
  assert.equal(model.getVerifiedModelUrl(), undefined);

  const published = outputFiles('.html').concat(outputFiles('.js'))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
  assert.doesNotMatch(published, /\/models\/hlw\.glb/);
});

test('Three.js is isolated to a dynamically imported Home scene bundle', () => {
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const lockfile = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  assert.match(packageJson.dependencies?.three ?? '', /^\^?0\.185\.1$/);
  assert.equal(lockfile.packages?.['']?.dependencies?.three, packageJson.dependencies.three);

  const sceneBundles = outputFiles('.js').filter((file) => readFileSync(file, 'utf8').includes('hlw-procedural-research-scene'));
  assert.equal(sceneBundles.length, 1, 'one Home-only scene bundle is emitted');
  const sceneAsset = sceneBundles[0].slice(dist.length).replaceAll('\\', '/');
  const bootstrapBundles = outputFiles('.js').filter((file) => {
    const source = readFileSync(file, 'utf8');
    return source.includes('[data-home-scene]') && source.includes('IntersectionObserver');
  });
  assert.equal(bootstrapBundles.length, 1, 'one lightweight Home bootstrap is emitted');
  const bootstrapSource = readFileSync(bootstrapBundles[0], 'utf8');
  assert.match(bootstrapSource, new RegExp(sceneAsset.split('/').at(-1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  const bootstrapAsset = bootstrapBundles[0].slice(dist.length).replaceAll('\\', '/');

  assert.match(page('/'), new RegExp(bootstrapAsset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(page('/en'), new RegExp(bootstrapAsset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const route of ['/about', '/projects', '/cv', '/en/about', '/en/projects', '/en/cv']) {
    assert.doesNotMatch(page(route), new RegExp(bootstrapAsset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${route} does not bootstrap Three.js`);
  }
});

test('scene bootstrap and controller enforce capability, motion, performance, and cleanup boundaries', () => {
  const component = readFileSync(join(root, 'src/components/home/HomeScene.astro'), 'utf8');
  const controller = readFileSync(join(root, 'src/scripts/home-scene.ts'), 'utf8');
  const motionController = readFileSync(join(root, 'src/scripts/home-scene-motion.ts'), 'utf8');

  assert.match(component, /matchMedia\(['"]\(prefers-reduced-motion:\s*reduce\)['"]\)/);
  assert.match(component, /IntersectionObserver/);
  assert.match(component, /getContext\(['"]webgl2?['"]/);
  assert.match(component, /WEBGL_lose_context/);
  assert.match(component, /createHomeSceneMotionController/);
  assert.match(motionController, /new AbortController\(\)/);
  assert.match(motionController, /activeAbort\?\.abort\(\)/);
  assert.match(component, /await import\(['"]\.\.\/\.\.\/scripts\/home-scene['"]\)/);
  assert.match(component, /pagehide/);
  assert.match(component, /pageshow/);
  assert.match(controller, /signal\?:\s*AbortSignal/);
  assert.match(controller, /fetch\([^;]+signal/);
  assert.match(controller, /signal\?\.addEventListener\(['"]abort['"],\s*dispose/);
  assert.match(controller, /value instanceof THREE\.Texture[\s\S]*?value\.dispose\(\)/);
  assert.match(controller, /object instanceof THREE\.SkinnedMesh[\s\S]*?object\.skeleton\.dispose\(\)/);
  assert.match(controller, /Math\.min\([^,]+,\s*1\.5\)/);
  assert.match(controller, /matchMedia\(['"]\(pointer:\s*fine\)['"]\)/);
  assert.match(controller, /querySelectorAll<HTMLElement>\(['"]\[data-scene-focus\]['"]\)/);
  assert.match(controller, /ResizeObserver/);
  assert.match(controller, /IntersectionObserver/);
  assert.match(controller, /cancelAnimationFrame/);
  assert.match(controller, /removeEventListener/);
  assert.match(controller, /new THREE\.Timer\(\)/);
  assert.match(controller, /timer\.update\(\);/);
  assert.doesNotMatch(controller, /timer\.update\(timestamp\)/);
  assert.match(controller, /timer\.getElapsed\(\)/);
  assert.match(controller, /timer\.reset\(\)/);
  assert.match(controller, /timer\.dispose\(\)/);
  assert.doesNotMatch(controller, /new THREE\.Clock\(\)/);
  assert.match(controller, /grid\.geometry\.dispose\(\)/);
  assert.match(controller, /\.dispose\(\)/);
  assert.match(controller, /forceContextLoss/);
  assert.doesNotMatch(controller, /EffectComposer|postprocessing|\.hdr|three\/examples\/jsm\/postprocessing/i);
});

test('Home scene motion controller disposes immediately when reduced motion changes and safely restarts once', async () => {
  const { createHomeSceneMotionController } = await import(`${pathToFileURL(join(root, 'src/scripts/home-scene-motion.ts')).href}?test=${Date.now()}`);

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

  const reduced = new FakeMediaQuery(false);
  const starts = [];
  const disposals = [];
  const controller = createHomeSceneMotionController({
    reduced,
    initialize: async (signal) => {
      const index = starts.length;
      starts.push(signal);
      return () => disposals.push(index);
    },
  });
  const settle = async () => { await Promise.resolve(); await Promise.resolve(); };

  await settle();
  assert.equal(starts.length, 1);
  reduced.set(true);
  await settle();
  assert.equal(starts[0].aborted, true, 'the active scene generation is aborted immediately');
  assert.deepEqual(disposals, [0], 'the active scene is disposed so the SVG fallback is complete');
  reduced.set(false);
  await settle();
  assert.equal(starts.length, 2, 'returning to standard motion safely initializes one fresh scene');
  reduced.set(false);
  await settle();
  assert.equal(starts.length, 2, 'an unchanged state never creates a duplicate scene');
  controller.dispose();
  assert.equal(starts[1].aborted, true);
  assert.deepEqual(disposals, [0, 1]);
  assert.equal(reduced.listeners.size, 0, 'the media-query listener is removed');
  reduced.set(false);
  await settle();
  assert.equal(starts.length, 2, 'a disposed controller cannot restart');

  const deferredReduced = new FakeMediaQuery(false);
  const deferredStarts = [];
  const deferredDisposals = [];
  let resolveInitialization;
  const deferredController = createHomeSceneMotionController({
    reduced: deferredReduced,
    initialize: (signal) => {
      deferredStarts.push(signal);
      return new Promise((resolve) => { resolveInitialization = resolve; });
    },
  });
  assert.equal(deferredStarts.length, 1);
  deferredReduced.set(true);
  deferredReduced.set(false);
  resolveInitialization(() => deferredDisposals.push('stale'));
  await settle();
  assert.deepEqual(deferredDisposals, ['stale'], 'a scene resolving after an abort is disposed rather than installed');
  assert.equal(deferredStarts.length, 2, 'the allowed state resumes with one new initialization after the stale generation settles');
  deferredController.dispose();
});
