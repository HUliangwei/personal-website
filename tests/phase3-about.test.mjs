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

test('Phase 3 about renders a readable technical journey without invented biography', () => {
  buildSite();

  const about = readFileSync(join(projectRoot, 'dist', 'en', 'about', 'index.html'), 'utf8');

  for (const heading of [
    'A technical path from physical signals to intelligent action.',
    'My technical journey',
    'Education',
    'Research interests',
    'How the interests connect',
    'Technical profile',
    'Current focus',
    'Outside research',
  ]) {
    assert.match(about, new RegExp(`<h[1-2][^>]*>${heading}</h[1-2]>`));
  }

  assert.match(about, /<p class="eyebrow">About<\/p>/);

  for (const stage of ['Physics &amp; hardware foundations', 'SPAD and integrated circuits', 'LeRobot and embodied learning']) {
    assert.match(about, new RegExp(`<h3[^>]*>${stage}</h3>`));
  }

  assert.match(about, /University of Science and Technology of China/);
  assert.match(about, /Wuhan University/);
  assert.match(about, /TODO verification:/);
  assert.match(about, /class="journey-sticky"/);
  assert.match(about, /class="journey-stage"/);
  assert.doesNotMatch(about, /Welcome to my personal website\.|Graduate Student/);
});
