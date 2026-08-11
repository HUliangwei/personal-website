import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
function buildSite() {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

test('Phase 1 foundation renders accessible global layout contracts', () => {
  buildSite();

  const home = readFileSync(join(projectRoot, 'dist', 'index.html'), 'utf8');
  const about = readFileSync(join(projectRoot, 'dist', 'about', 'index.html'), 'utf8');

  assert.match(home, /<a[^>]*class="skip-link"[^>]*href="#main-content"/);
  assert.match(home, /<main[^>]*id="main-content"/);
  assert.match(home, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(home, /<meta name="description" content="[^"]+"/);
  assert.match(home, /<link rel="canonical" href="https:\/\/personal-website\.huliangwei020311\.workers\.dev\/?"/);
  assert.match(home, /<meta property="og:title" content="[^"]+"/);
  assert.match(home, /<link rel="icon" href="\/favicon\.svg"/);
  assert.match(home, /<nav[^>]*aria-label="Primary navigation"/);
  assert.match(home, /<button[^>]*aria-controls="primary-navigation"[^>]*aria-expanded="false"/);
  assert.match(home, /<a[^>]*href="\/"[^>]*aria-current="page"/);
  assert.match(home, /href="https:\/\/github\.com\/HUliangwei\/personal-website"/);
  assert.match(about, /<a[^>]*href="\/about"[^>]*aria-current="page"/);
});
