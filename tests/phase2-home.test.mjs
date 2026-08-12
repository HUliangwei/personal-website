import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

function buildSite() {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

test('Phase 2 home renders a research portfolio overview without scaffold copy', () => {
  buildSite();

  const home = readFileSync(join(projectRoot, 'dist', 'en', 'index.html'), 'utf8');

  for (const heading of [
    'Research &amp; Engineering',
    'Current focus',
    'Selected projects',
    'Capabilities',
    'Technical trajectory',
    'Continue the conversation',
  ]) {
    assert.match(home, new RegExp(`<h[1-2][^>]*>${heading}</h[1-2]>`));
  }

  for (const href of ['/en/projects', '/en/cv', '/en/projects/spad', '/en/projects/lerobot', '/en/projects/mobile-robot', '/en/projects/quantum-hfss']) {
    assert.match(home, new RegExp(`<a[^>]*href="${href}"`));
  }

  assert.match(home, /<svg[^>]*role="img"[^>]*aria-labelledby="system-diagram-title system-diagram-description"/);
  assert.match(home, /<title id="system-diagram-title">Device to intelligent system diagram<\/title>/);
  assert.match(home, /<desc id="system-diagram-description">A conceptual flow from device and sensor inputs through signal and integrated circuit compute stages to an intelligent system or robot.<\/desc>/);
  assert.match(home, /<text[^>]*>Device \/ Sensor<\/text>/);
  assert.match(home, /<text[^>]*>Intelligent System \/ Robot<\/text>/);
  assert.doesNotMatch(home, /Hello, I(?:'|&#x27;)m|Graduate Student|Cloudflare deployment test/);
});
