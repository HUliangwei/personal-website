import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publishedPdfs = {
  'liangwei-hu-ic-design.pdf': {
    bytes: 319440,
    sha256: 'f7c4a31296ff8d4aaae566c5fdf33f732b5b95cca025b84a211c2f1794c38290',
  },
  'liangwei-hu-embodied-ai.pdf': {
    bytes: 264803,
    sha256: '6ed4a86bd51dab4c5c71b8ab0527ba5830b1c10eb67b909cd038fc200b1a95ae',
  },
};

function hash(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

test('Phase 5 publishes accessible multi-track CV downloads without inventing a quantum PDF', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });

  const cv = readFileSync(join(root, 'dist/cv/index.html'), 'utf8');
  const home = readFileSync(join(root, 'dist/index.html'), 'utf8');

  assert.ok(existsSync(join(root, 'dist/cv/index.html')), 'the /cv route is generated');
  assert.match(home, /href="\/cv"/);
  for (const track of ['Integrated Circuits', 'Embodied AI', 'Quantum Computing']) {
    assert.match(cv, new RegExp(`<h2[^>]*>${track}</h2>`));
  }
  for (const filename of ['liangwei-hu-ic-design.pdf', 'liangwei-hu-embodied-ai.pdf']) {
    assert.match(cv, new RegExp(`href="/cv/${filename}"`));
  }
  assert.match(cv, /<button[^>]*data-pdf-preview[^>]*aria-expanded="false"[^>]*>Preview PDF<\/button>/);
  assert.doesNotMatch(cv, /<object[^>]*data="\/cv\//);
  assert.match(cv, /Open PDF/);
  assert.match(cv, /Download PDF/);
  assert.match(cv, /Quantum Computing[^]*?Coming soon/);
  assert.doesNotMatch(cv, /quantum[^"']*\.pdf/i);
  for (const [filename, expected] of Object.entries(publishedPdfs)) {
    const output = join(root, `dist/cv/${filename}`);
    assert.ok(existsSync(output), `${filename} is published`);
    assert.equal(statSync(output).size, expected.bytes, `${filename} keeps its expected byte length`);
    assert.equal(hash(output), expected.sha256, `${filename} keeps its expected SHA-256`);
  }
  assert.ok(!existsSync(join(root, 'dist/cv/liangwei-hu-quantum-computing.pdf')), 'no quantum PDF is published');
});
