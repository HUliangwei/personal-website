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

test('Academic CV renders the verified bilingual education record with HR-facing evidence context', () => {
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
  assert.match(zh, /官方成绩单快照[^]*?2023-12-12/);
  assert.doesNotMatch(zh, /来源：|学习时间来源|简历自述|官方排名/);
  assert.match(zh, /半导体单光子探测器及读出电路/);
  assert.match(zh, /半导体器件原理/);
  assert.match(zh, /数字逻辑电路实验/);

  assert.match(en, /University of Science and Technology of China/);
  assert.match(en, /Quantum Science and Technology/);
  assert.match(en, /Sep 2024\s*-\s*Jun 2027 \(expected\)/);
  assert.match(en, /Wuhan University/);
  assert.match(en, /BSc in Physics/);
  assert.match(en, /Official transcript snapshot[^]*?2023-12-12/);
  assert.doesNotMatch(en, /Source:\s|owner-authored resume|self-reported|Editorial translation|official rank/i);
  assert.match(en, /Quantum Optics/);
  assert.match(en, /Circuit Analysis/);
});

test('Academic CV publishes locale-specific owner-authorized PDF snapshots and a non-link Quantum placeholder', () => {
  const zh = read('dist', 'cv', 'index.html');
  const en = read('dist', 'en', 'cv', 'index.html');
  const expected = {
    zh: ['liangwei-hu-embodied-ai-zh.pdf', 'liangwei-hu-ic-design-zh.pdf'],
    en: ['liangwei-hu-embodied-ai-en.pdf', 'liangwei-hu-ic-design-en.pdf'],
  };
  const allExpected = [...expected.zh, ...expected.en].sort();

  assert.deepEqual(readdirSync(join(root, 'public', 'cv')).sort(), allExpected);
  for (const [locale, html] of [['zh', zh], ['en', en]]) {
    assert.equal((html.match(/data-cv-track/g) ?? []).length, 3);
    for (const filename of expected[locale]) {
      assert.match(html, new RegExp(`href="/cv/${filename}"`));
    }
    for (const filename of expected[locale === 'zh' ? 'en' : 'zh']) {
      assert.doesNotMatch(html, new RegExp(`href="/cv/${filename}"`));
    }
    assert.doesNotMatch(html, /quantum[^"']*\.pdf/i);
    assert.doesNotMatch(html, /<object[^>]+application\/pdf/i);
  }

  assert.match(zh, /量子计算[^]*?准备中/);
  assert.match(en, /Quantum Computing[^]*?Preparing/);
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

  const transcriptIdentifier = ['264', '584', '62'].join('');
  const privateFilePattern = new RegExp(`成绩单|transcript|${transcriptIdentifier}|cet-?6`, 'i');
  const privateOutputPattern = new RegExp(`${transcriptIdentifier}|${['student', '\\s*(?:number|id)'].join('')}|${['学', '号'].join('')}|出生日期|birth\\s*date`, 'i');
  assert.doesNotMatch(publicFiles, privateFilePattern);
  assert.doesNotMatch(output, privateOutputPattern);
  assert.doesNotMatch(output, /成绩单[^<]*(?:href|download)|transcript[^<]*(?:href|download)/i);
});
