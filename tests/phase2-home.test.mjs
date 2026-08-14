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

test('Home renders the personal V3 overview without scaffold copy', () => {
  buildSite();

  const home = readFileSync(join(projectRoot, 'dist', 'en', 'index.html'), 'utf8');

  for (const heading of [
    'Liangwei Hu',
    'Current Focus',
    'Selected Projects',
    'Technical Toolkit',
    'Life &amp; Interests',
    'Let&#39;s Connect',
  ]) {
    assert.match(home, new RegExp(`<h[1-2][^>]*>${heading}</h[1-2]>`));
  }

  for (const href of ['/en/projects', '/en/cv']) {
    assert.match(home, new RegExp(`<a[^>]*href="${href}"`));
  }

  assert.match(home, /<svg[^>]*role="img"[^>]*aria-labelledby="system-diagram-title system-diagram-description"/);
  assert.match(home, /<title id="system-diagram-title">Device to intelligent system diagram<\/title>/);
  assert.match(home, /<desc id="system-diagram-description">A conceptual flow from device and sensor inputs through signal and integrated circuit compute stages to an intelligent system or robot.<\/desc>/);
  assert.match(home, /<text[^>]*>Device \/ Sensor<\/text>/);
  assert.match(home, /<text[^>]*>Intelligent System \/ Robot<\/text>/);
  assert.doesNotMatch(home, /Cloudflare deployment test|Research &amp; Engineering|Technical trajectory/);
});
