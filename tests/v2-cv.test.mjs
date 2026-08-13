import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('Academic CV renders the verified bilingual education record with qualified evidence', () => {
  const zh = read('dist', 'cv', 'index.html');
  const en = read('dist', 'en', 'cv', 'index.html');

  for (const html of [zh, en]) {
    assert.match(html, /data-academic-profile/);
    assert.equal((html.match(/data-education-card/g) ?? []).length, 2);
    assert.match(html, /3\.55\s*\/\s*4\.30/);
    assert.match(html, /3\.86\s*\/\s*4\.00/);
  }

  assert.match(zh, /中国科学技术大学/);
  assert.match(zh, /量子科学与技术/);
  assert.match(zh, /2024\.09\s*-\s*2027\.06（预计）/);
  assert.match(zh, /武汉大学/);
  assert.match(zh, /物理学/);
  assert.match(zh, /2020\.09\s*-\s*2024\.06/);
  assert.match(zh, /2023-12-12/);
  assert.match(zh, /打印时点/);
  assert.match(zh, /简历自述/);
  assert.doesNotMatch(zh, /官方排名/);
  assert.match(zh, /半导体单光子探测器及读出电路/);
  assert.match(zh, /半导体器件原理/);
  assert.match(zh, /数字逻辑电路实验/);

  assert.match(en, /University of Science and Technology of China/);
  assert.match(en, /Quantum Science and Technology/);
  assert.match(en, /Sep 2024\s*-\s*Jun 2027 \(expected\)/);
  assert.match(en, /Wuhan University/);
  assert.match(en, /BSc in Physics/);
  assert.match(en, /not necessarily the final graduation GPA/);
  assert.match(en, /self-reported[^<]*resume/i);
  assert.doesNotMatch(en, /official rank/i);
  assert.match(en, /Editorial translation/);
  assert.match(en, /Quantum Optics/);
  assert.match(en, /Circuit Analysis/);
});

test('Academic CV keeps exactly two verified PDFs and a non-link Quantum placeholder', () => {
  const zh = read('dist', 'cv', 'index.html');
  const en = read('dist', 'en', 'cv', 'index.html');
  const expected = [
    'liangwei-hu-embodied-ai.pdf',
    'liangwei-hu-ic-design.pdf',
  ];

  assert.deepEqual(readdirSync(join(root, 'public', 'cv')).sort(), expected);
  for (const html of [zh, en]) {
    assert.equal((html.match(/data-cv-track/g) ?? []).length, 3);
    for (const filename of expected) {
      assert.match(html, new RegExp(`href="/cv/${filename}"`));
    }
    assert.doesNotMatch(html, /quantum[^"']*\.pdf/i);
    assert.doesNotMatch(html, /<object[^>]+application\/pdf/i);
  }

  assert.match(zh, /量子计算[^]*?即将提供/);
  assert.match(en, /Quantum Computing[^]*?Coming soon/);
  assert.ok(!existsSync(join(root, 'public', 'cv', 'liangwei-hu-quantum-computing.pdf')));
});

test('PDF preview stays user-triggered and preserves open/download mobile fallbacks', () => {
  const component = read('src', 'components', 'cv', 'PDFPreview.astro');
  const card = read('src', 'components', 'cv', 'CVCard.astro');
  const css = read('src', 'styles', 'global.css');

  assert.match(component, /<button[^>]*data-pdf-preview/);
  assert.match(component, /document\.createElement\('object'\)/);
  assert.match(component, /preview\.type = 'application\/pdf'/);
  assert.match(component, /target="_blank"/);
  assert.match(card, /download/);
  assert.match(css, /@media \(max-width: 44rem\)[^]*?\.pdf-preview-frame/);
});

test('CV publication boundary excludes transcripts and sensitive academic identifiers', () => {
  const publicFiles = readdirSync(join(root, 'public'), { recursive: true })
    .map(String)
    .join('\n');
  const output = `${read('dist', 'cv', 'index.html')}\n${read('dist', 'en', 'cv', 'index.html')}`;

  assert.doesNotMatch(publicFiles, /成绩单|transcript|26458462|cet-?6/i);
  assert.doesNotMatch(output, /26458462|student\s*(?:number|id)|学号|出生日期|birth\s*date/i);
  assert.doesNotMatch(output, /成绩单[^<]*(?:href|download)|transcript[^<]*(?:href|download)/i);
});
