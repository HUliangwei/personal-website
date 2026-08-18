import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publishedPdfs = {
  'liangwei-hu-ic-design-zh.pdf': {
    bytes: 319441,
    sha256: 'd7e2ca46b2ed294359526217b5d693a615e6bb4922a2ae1f5237fcd992d0f48e',
  },
  'liangwei-hu-ic-design-en.pdf': {
    bytes: 100282,
    sha256: '0bee38339056b5c937487bc53a598266abe0efefc7b1d0e665be94f13824e5de',
  },
  'liangwei-hu-embodied-ai-zh.pdf': {
    bytes: 277282,
    sha256: '32e6d16a9e769097da2c4d4ed86711cac98a9a7d395c76f4269111c68f2bb9a0',
  },
  'liangwei-hu-embodied-ai-en.pdf': {
    bytes: 75560,
    sha256: 'ea9554a30495ea8505b5b4298d1181cdb47306561bf85980cb57c2b195193879',
  },
};

function hash(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

test('Phase 5 publishes accessible multi-track CV downloads without inventing a quantum PDF', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });

  const cv = readFileSync(join(root, 'dist/en/cv/index.html'), 'utf8');
  const home = readFileSync(join(root, 'dist/en/index.html'), 'utf8');

  assert.ok(existsSync(join(root, 'dist/cv/index.html')), 'the /cv route is generated');
  assert.match(home, /href="\/en\/cv"/);
  for (const track of ['Integrated Circuits', 'Embodied AI', 'Quantum Computing']) {
    assert.match(cv, new RegExp(`<h3[^>]*>${track}</h3>`));
  }
  for (const filename of ['liangwei-hu-ic-design-en.pdf', 'liangwei-hu-embodied-ai-en.pdf']) {
    assert.match(cv, new RegExp(`href="/cv/${filename}"`));
  }
  assert.match(cv, /<button[^>]*data-pdf-preview[^>]*aria-expanded="false"[^>]*>Preview PDF<\/button>/);
  assert.doesNotMatch(cv, /<object[^>]*data="\/cv\//);
  assert.match(cv, /Open PDF/);
  assert.match(cv, /Download PDF/);
  assert.match(cv, /Quantum Computing[^]*?Preparing/);
  assert.doesNotMatch(cv, /quantum[^"']*\.pdf/i);
  for (const [filename, expected] of Object.entries(publishedPdfs)) {
    const output = join(root, `dist/cv/${filename}`);
    assert.ok(existsSync(output), `${filename} is published`);
    assert.equal(statSync(output).size, expected.bytes, `${filename} keeps its expected byte length`);
    assert.equal(hash(output), expected.sha256, `${filename} keeps its expected SHA-256`);
  }
  assert.ok(!existsSync(join(root, 'dist/cv/liangwei-hu-quantum-computing.pdf')), 'no quantum PDF is published');
});
