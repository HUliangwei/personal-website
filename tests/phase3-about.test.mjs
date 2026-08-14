import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

test('Phase 3 About remains a readable, evidence-bounded foundation after the V3 narrative upgrade', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const about = readFileSync(join(projectRoot, 'dist', 'en', 'about', 'index.html'), 'utf8');
  for (const heading of ['About Me', 'Education Journey', 'Two technical tracks', 'Run the full path, then go deeper', 'Now', 'Side Quests']) {
    assert.match(about, new RegExp(`<h[1-2][^>]*>${heading}</h[1-2]>`));
  }
  assert.match(about, /Engineering Track/);
  assert.match(about, /Physics \/ Quantum Track/);
  assert.match(about, /SPAD Single-Photon Detector Readout IC/);
  assert.match(about, /University of Science and Technology of China/);
  assert.match(about, /Wuhan University/);
  assert.doesNotMatch(about, /TODO|Placeholder|Need verification|Add verified/i);
  assert.doesNotMatch(about, /Welcome to my personal website\.|Graduate Student/);
});
