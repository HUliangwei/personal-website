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

test('About preserves the established no-JS, motion, and accessible-visual contracts in V3', () => {
  build();

  for (const html of [page('/about'), page('/en/about')]) {
    assert.match(html, /<section[^>]*data-about-journey/);
    assert.equal((html.match(/<ol[^>]*data-journey-track=/g) ?? []).length, 2);
    assert.equal((html.match(/<li[^>]*data-journey-stage/g) ?? []).length, 10);
    assert.equal((html.match(/<article[^>]*class="[^"]*journey-stage-card/g) ?? []).length, 10);
    const visuals = Array.from(html.matchAll(/<svg[^>]*class="[^"]*journey-stage-visual[^"]*"[^>]*>[\s\S]*?<\/svg>/g), ([visual]) => visual);
    assert.equal(visuals.length, 10);
    for (const visual of visuals) {
      assert.match(visual, /role="img"/);
      assert.match(visual, /aria-labelledby="([^"]+) ([^"]+)"/);
      assert.match(visual, /<title id="[^"]+">[^<]*(?:概念|conceptual)[^<]*<\/title>/i);
      assert.match(visual, /<desc id="[^"]+">[^<]+<\/desc>/);
    }
    assert.match(html, /data-journey-progress/);
    assert.match(html, /data-journey-status/);
  }

  const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.journey-stage-card[\s\S]*?opacity:\s*1/);
  assert.match(css, /@media\s*\(max-width:\s*44rem\)[\s\S]*?\.journey-sticky[\s\S]*?position:\s*static/);

  const aboutAssets = readdirSync(dist, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((file) => readFileSync(file, 'utf8').includes('[data-about-journey]'));
  assert.equal(aboutAssets.length, 1);
  const asset = readFileSync(aboutAssets[0], 'utf8');
  assert.match(asset, /pagehide/);
  assert.match(asset, /pageshow/);
  assert.match(asset, /persisted/);
});
