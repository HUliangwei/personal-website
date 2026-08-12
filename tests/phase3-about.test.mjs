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
    'A personal technical direction, still in progress.',
    'My journey',
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

  for (const stage of ['Electronics / Hardware', 'SPAD / IC', 'Robotics', 'Embodied AI']) {
    assert.match(about, new RegExp(`<h3[^>]*>${stage}</h3>`));
  }

  assert.match(about, /TODO: Add verified dates, institutions, and programme details before publishing\./);
  assert.match(about, /TODO: Place quantum work here only after its real learning or project context is confirmed\./);
  assert.match(about, /class="journey-sticky"/);
  assert.match(about, /class="journey-stage"/);
  assert.doesNotMatch(about, /Welcome to my personal website\.|Graduate Student|University/);
});
