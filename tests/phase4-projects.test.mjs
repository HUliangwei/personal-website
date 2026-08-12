import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test('Phase 4 builds collection-backed project list, filters, and case studies', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });
  const list = readFileSync(join(root, 'dist/projects/index.html'), 'utf8');
  const detail = readFileSync(join(root, 'dist/projects/spad/index.html'), 'utf8');

  for (const category of ['All', 'Integrated Circuits', 'Robotics', 'Embodied AI', 'Quantum', 'Software']) {
    assert.match(list, new RegExp(`<button[^>]*data-category="${category}"`));
  }
  for (const slug of ['spad', 'ros2-robot', 'lerobot']) {
    assert.ok(existsSync(join(root, `dist/projects/${slug}/index.html`)), `${slug} route exists`);
    assert.match(list, new RegExp(`href="/projects/${slug}"`));
  }
  for (const heading of ['Overview', 'Problem / Motivation', 'My Role', 'Architecture', 'Design / Method', 'Implementation', 'Verification / Experiments', 'Results', 'Challenges &amp; Decisions', 'What I Learned', 'Links']) {
    assert.match(detail, new RegExp(`<h2[^>]*>${heading}</h2>`));
  }
  assert.match(detail, /<a[^>]*href="\/projects"[^>]*aria-current="page"/);
  assert.match(list, /data-project-filter/);
  assert.match(list, /aria-pressed="true"/);

  const home = readFileSync(join(root, 'dist/index.html'), 'utf8');
  for (const match of home.matchAll(/href="(\/(?:projects)[^"#?]*)"/g)) {
    const target = match[1] === '/projects' ? 'dist/projects/index.html' : `dist${match[1]}/index.html`;
    assert.ok(existsSync(join(root, target)), `internal link ${match[1]} resolves`);
  }
});

test('Phase 4 schema keeps booleans and arrays typed while accepting TODO strings only where intended', () => {
  const config = readFileSync(join(root, 'src/content.config.ts'), 'utf8');
  assert.match(config, /loader:\s*glob\(/);
  assert.match(config, /from 'astro\/zod'/);
  assert.match(config, /featured:\s*z\.boolean\(\)/);
  assert.match(config, /technologies:\s*z\.array\(z\.string\(\)\)/);
  assert.match(config, /links:\s*z\.array\(/);
  assert.doesNotMatch(config, /z\.any\(|z\.unknown\(/);

  const categories = readFileSync(join(root, 'src/config/projects.ts'), 'utf8');
  for (const category of ['Integrated Circuits', 'Robotics', 'Embodied AI', 'Quantum', 'Software']) {
    assert.match(categories, new RegExp(`'${category}'`));
  }
});
