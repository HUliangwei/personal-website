import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test('V4 builds a collection-backed four-card overview without filters or case studies', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });
  const list = readFileSync(join(root, 'dist/en/projects/index.html'), 'utf8');

  for (const slug of ['spad', 'lerobot', 'mobile-robot', 'quantum-hfss']) {
    assert.match(list, new RegExp(`data-project-slug="${slug}"`));
    assert.equal(existsSync(join(root, `dist/en/projects/${slug}/index.html`)), false, `${slug} has no detail route`);
  }
  assert.match(list, /Conceptual project diagram/);
  assert.match(list, /<ul class="project-highlights"/);
  assert.doesNotMatch(list, /data-project-filter|View project|href="\/en\/projects\/(?!programming\/)/);
  assert.doesNotMatch(list, /TODO: Add project cover image/);
  assert.doesNotMatch(list, /<img[^>]*src="TODO"/);

  const home = readFileSync(join(root, 'dist/en/index.html'), 'utf8');
  assert.match(home, /href="\/en\/projects"/);
  assert.doesNotMatch(home, /href="\/en\/projects\//);
});

test('ProjectCard renders a lazy accessible image when a verified cover is supplied', () => {
  const card = readFileSync(join(root, 'src/components/projects/ProjectCard.astro'), 'utf8');
  assert.match(card, /project\.data\.cover \?/);
  assert.match(card, /<img[^>]*src=\{project\.data\.cover\}[^>]*alt=\{`\$\{project\.data\.title\} \$\{content\.coverAltSuffix\}`\}[^>]*loading="lazy"/s);
  assert.match(card, /<ProjectVisual[^>]*slug=\{project\.data\.slug\}[^>]*locale=\{locale\}[^>]*compact/);
});

test('V4 schema keeps project metadata typed', () => {
  const config = readFileSync(join(root, 'src/content.config.ts'), 'utf8');
  assert.match(config, /loader:\s*glob\(/);
  assert.match(config, /from 'astro\/zod'/);
  assert.match(config, /featured:\s*z\.boolean\(\)/);
  assert.match(config, /technologies:\s*z\.array\(z\.string\(\)\)/);
  assert.match(config, /highlights:\s*z\.array\(z\.string\(\)\)\.min\(2\)\.max\(3\)/);
  assert.match(config, /learningTopics:\s*z\.array\(z\.string\(\)\)\.max\(6\)/);
  assert.match(config, /links:\s*z\.array\([\s\S]*?\)\.optional\(\)/);
  assert.doesNotMatch(config, /z\.any\(|z\.unknown\(/);

  const categories = readFileSync(join(root, 'src/config/projects.ts'), 'utf8');
  for (const category of ['Integrated Circuits', 'Robotics', 'Embodied AI', 'Quantum', 'Software']) {
    assert.match(categories, new RegExp(`'${category}'`));
  }
});
