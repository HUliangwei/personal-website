import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test('Phase 4 builds collection-backed project list, filters, and case studies', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });
  const list = readFileSync(join(root, 'dist/en/projects/index.html'), 'utf8');
  const detail = readFileSync(join(root, 'dist/en/projects/spad/index.html'), 'utf8');

  for (const category of ['All', 'Integrated Circuits', 'Robotics', 'Embodied AI']) {
    assert.match(list, new RegExp(`<button[^>]*data-category="${category}"`));
  }
  for (const emptyCategory of ['Software']) {
    assert.doesNotMatch(list, new RegExp(`<button[^>]*data-category="${emptyCategory}"`));
  }
  for (const slug of ['spad', 'lerobot', 'mobile-robot', 'quantum-hfss']) {
    assert.ok(existsSync(join(root, `dist/projects/${slug}/index.html`)), `${slug} route exists`);
    assert.match(list, new RegExp(`href="/en/projects/${slug}"`));
  }
  for (const heading of ['Overview', 'Problem / Motivation', 'My Role', 'Architecture', 'Design / Method', 'Implementation', 'Verification / Experiments', 'Results', 'Challenges &amp; Decisions', 'What I Learned', 'Links']) {
    assert.match(detail, new RegExp(`<h2[^>]*>${heading}</h2>`));
  }
  assert.match(detail, /<a[^>]*href="\/en\/projects"[^>]*aria-current="page"/);
  assert.match(list, /<fieldset[^>]*data-project-filter/);
  assert.match(list, /<legend[^>]*>Filter projects by category<\/legend>/);
  assert.match(list, /aria-pressed="true"/);
  assert.match(list, /Conceptual project diagram/);
  assert.doesNotMatch(list, /TODO: Add project cover image/);
  assert.doesNotMatch(list, /<img[^>]*src="TODO"/);

  const home = readFileSync(join(root, 'dist/en/index.html'), 'utf8');
  for (const match of home.matchAll(/href="(\/en\/(?:projects)[^"#?]*)"/g)) {
    const target = match[1] === '/en/projects' ? 'dist/en/projects/index.html' : `dist${match[1]}/index.html`;
    assert.ok(existsSync(join(root, target)), `internal link ${match[1]} resolves`);
  }
});

test('ProjectCard renders a lazy accessible image when a verified cover is supplied', () => {
  const card = readFileSync(join(root, 'src/components/projects/ProjectCard.astro'), 'utf8');
  assert.match(card, /project\.data\.cover \?/);
  assert.match(card, /<img[^>]*src=\{project\.data\.cover\}[^>]*alt=\{`\$\{title\} \$\{content\.coverAltSuffix\}`\}[^>]*loading="lazy"/s);
  assert.match(card, /<ProjectVisual[^>]*slug=\{project\.data\.slug\}[^>]*locale=\{locale\}[^>]*compact/);
});

test('Phase 4 schema keeps booleans and arrays typed while accepting TODO strings only where intended', () => {
  const config = readFileSync(join(root, 'src/content.config.ts'), 'utf8');
  assert.match(config, /loader:\s*glob\(/);
  assert.match(config, /from 'astro\/zod'/);
  assert.match(config, /featured:\s*z\.boolean\(\)/);
  assert.match(config, /technologies:\s*z\.array\(z\.string\(\)\)/);
  assert.match(config, /links:\s*z\.array\([\s\S]*?\)\.optional\(\)/);
  assert.doesNotMatch(config, /z\.any\(|z\.unknown\(/);

  const categories = readFileSync(join(root, 'src/config/projects.ts'), 'utf8');
  for (const category of ['Integrated Circuits', 'Robotics', 'Embodied AI', 'Quantum', 'Software']) {
    assert.match(categories, new RegExp(`'${category}'`));
  }
});
