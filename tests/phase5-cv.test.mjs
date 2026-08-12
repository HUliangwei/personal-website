import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceCvDirectory = 'D:\\Desktop\\CV';

function hash(filePath) {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

test('Phase 5 publishes accessible multi-track CV downloads without inventing a quantum PDF', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });

  const cv = readFileSync(join(root, 'dist/cv/index.html'), 'utf8');
  const home = readFileSync(join(root, 'dist/index.html'), 'utf8');
  const icSource = join(sourceCvDirectory, '胡良玮集成电路简历260718.pdf');
  const embodiedSource = join(sourceCvDirectory, '胡良玮_具身智能版简历.pdf');
  const icOutput = join(root, 'dist/cv/liangwei-hu-ic-design.pdf');
  const embodiedOutput = join(root, 'dist/cv/liangwei-hu-embodied-ai.pdf');

  assert.ok(existsSync(join(root, 'dist/cv/index.html')), 'the /cv route is generated');
  assert.match(home, /href="\/cv"/);
  for (const track of ['Integrated Circuits', 'Embodied AI', 'Quantum Computing']) {
    assert.match(cv, new RegExp(`<h2[^>]*>${track}</h2>`));
  }
  for (const filename of ['liangwei-hu-ic-design.pdf', 'liangwei-hu-embodied-ai.pdf']) {
    assert.match(cv, new RegExp(`href="/cv/${filename}"`));
  }
  assert.match(cv, /<object[^>]*data="\/cv\/liangwei-hu-ic-design\.pdf"[^>]*type="application\/pdf"/);
  assert.match(cv, /<object[^>]*data="\/cv\/liangwei-hu-embodied-ai\.pdf"[^>]*type="application\/pdf"/);
  assert.match(cv, /Open PDF/);
  assert.match(cv, /Download PDF/);
  assert.match(cv, /Quantum Computing[^]*?Coming soon/);
  assert.doesNotMatch(cv, /quantum[^"']*\.pdf/i);
  assert.ok(existsSync(icOutput), 'IC design PDF is published');
  assert.ok(existsSync(embodiedOutput), 'Embodied AI PDF is published');
  assert.equal(hash(icOutput), hash(icSource), 'IC design PDF is byte-for-byte preserved');
  assert.equal(hash(embodiedOutput), hash(embodiedSource), 'Embodied AI PDF is byte-for-byte preserved');
  assert.ok(!existsSync(join(root, 'dist/cv/liangwei-hu-quantum-computing.pdf')), 'no quantum PDF is published');
});
