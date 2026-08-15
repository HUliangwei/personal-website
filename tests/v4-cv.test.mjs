import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const expectedCoursework = {
  zh: {
    undergraduate: [
      ['mathematical-methods-for-physics', '数学物理方法', '96'],
      ['computational-physics', '计算物理', '96'],
      ['c-programming', 'C语言程序设计', '95'],
      ['quantum-mechanics', '量子力学', '95'],
      ['calculus', '微积分（上、下）', '94 / 84'],
      ['linear-algebra', '线性代数B', '94'],
      ['electrodynamics', '电动力学', '94'],
      ['digital-logic-circuits', '数字逻辑电路', '92'],
      ['digital-logic-lab', '数字逻辑电路实验', '91'],
      ['probability-and-statistics', '概率论与数理统计B', '92'],
      ['circuit-analysis', '电路分析', '90'],
    ],
    graduate: [
      ['physical-electronics-logic-lab', '物理电子学逻辑设计与仿真实验', '95'],
      ['computational-physics', '计算物理', '92'],
      ['quantum-materials-and-devices', '量子材料与器件', '88'],
      ['quantum-optics', '量子光学', '88'],
      ['digital-signal-processing-ii', '数字信号处理 II', '83'],
      ['semiconductor-device-physics', '半导体器件原理', '80'],
    ],
  },
  en: {
    undergraduate: [
      ['mathematical-methods-for-physics', 'Mathematical Methods for Physics', '96'],
      ['computational-physics', 'Computational Physics', '96'],
      ['c-programming', 'C Programming', '95'],
      ['quantum-mechanics', 'Quantum Mechanics', '95'],
      ['calculus', 'Calculus I and II', '94 / 84'],
      ['linear-algebra', 'Linear Algebra B', '94'],
      ['electrodynamics', 'Electrodynamics', '94'],
      ['digital-logic-circuits', 'Digital Logic Circuits', '92'],
      ['digital-logic-lab', 'Digital Logic Circuits Laboratory', '91'],
      ['probability-and-statistics', 'Probability and Mathematical Statistics B', '92'],
      ['circuit-analysis', 'Circuit Analysis', '90'],
    ],
    graduate: [
      ['physical-electronics-logic-lab', 'Physical Electronics Logic Design and Simulation Laboratory', '95'],
      ['computational-physics', 'Computational Physics', '92'],
      ['quantum-materials-and-devices', 'Quantum Materials and Devices', '88'],
      ['quantum-optics', 'Quantum Optics', '88'],
      ['digital-signal-processing-ii', 'Digital Signal Processing II', '83'],
      ['semiconductor-device-physics', 'Principles of Semiconductor Devices', '80'],
    ],
  },
};

const publishedPdfs = {
  'liangwei-hu-ic-design.pdf': { bytes: 319440, sha256: 'f7c4a31296ff8d4aaae566c5fdf33f732b5b95cca025b84a211c2f1794c38290' },
  'liangwei-hu-embodied-ai.pdf': { bytes: 264803, sha256: '6ed4a86bd51dab4c5c71b8ab0527ba5830b1c10eb67b909cd038fc200b1a95ae' },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function elementWithData(html, tag, attribute, value) {
  const opening = new RegExp(`<${tag}[^>]*${attribute}="${escapeRegex(value)}"[^>]*>`).exec(html);
  assert.ok(opening, `${tag}[${attribute}="${value}"] must exist`);
  const end = html.indexOf(`</${tag}>`, opening.index);
  assert.notEqual(end, -1, `${tag}[${attribute}="${value}"] must close`);
  return html.slice(opening.index, end + tag.length + 3);
}

function table(route, educationId) {
  return elementWithData(html(route), 'table', 'data-coursework-table', educationId);
}

function transcriptControls(markup) {
  return [...markup.matchAll(/data-transcript|transcript-card|<object\b[^>]*pdf|(?:href|download)="[^"]*(?:transcript|academic[-_ ]?record|成绩单)[^"]*"/gi)];
}

function html(route) {
  return readFileSync(join(root, 'dist', route === '/cv' ? 'cv/index.html' : 'en/cv/index.html'), 'utf8');
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

let pages;

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, stdio: 'pipe' });
  pages = { zh: html('/cv'), en: html('/en/cv') };
});

test('CV emits the selected official coursework as always-readable semantic tables', () => {
  assert.equal((table('/cv', 'undergraduate').match(/<tr\b/g) ?? []).length - 1, 11);
  assert.equal((table('/cv', 'graduate').match(/<tr\b/g) ?? []).length - 1, 6);

  for (const [locale, route] of [['zh', '/cv'], ['en', '/en/cv']]) {
    for (const educationId of ['undergraduate', 'graduate']) {
      const rendered = table(route, educationId);
      assert.match(rendered, /<caption\b|aria-labelledby=/);
      assert.match(rendered, /<thead>[\s\S]*?<th[^>]*>[^<]+<\/th>[\s\S]*?<th[^>]*>[^<]+<\/th>[\s\S]*?<\/thead>/);
      assert.equal((rendered.match(/data-course-id=/g) ?? []).length, expectedCoursework[locale][educationId].length);
      for (const [courseId, label, grade] of expectedCoursework[locale][educationId]) {
        const row = elementWithData(rendered, 'tr', 'data-course-id', courseId);
        assert.match(row, new RegExp(`>${escapeRegex(label)}<`));
        assert.match(row, new RegExp(`>${escapeRegex(grade)}<`));
      }
    }
  }

  for (const source of Object.values(pages)) {
    assert.doesNotMatch(source, /data-coursework-list|coursework-item|data-course-grade|tabindex="0"[^>]*data-course-id|aria-describedby="course-grade-/);
  }
});

test('core-course selection returns the exact official records and rejects missing or duplicate IDs', async () => {
  const { educationByLocale } = await import('../src/data/education.ts');
  const { selectCoreCoursework } = await import('../src/data/cv.ts');
  const undergraduate = educationByLocale.en.find(({ id }) => id === 'undergraduate');
  const selected = selectCoreCoursework(undergraduate);

  assert.deepEqual(selected.map(({ id, label, grade }) => [id, label, grade]), expectedCoursework.en.undergraduate);
  assert.equal(selected[0], undergraduate.coursework[0]);
  assert.throws(
    () => selectCoreCoursework({ ...undergraduate, coursework: undergraduate.coursework.filter(({ id }) => id !== 'calculus') }),
    /calculus/i,
  );
  assert.throws(
    () => selectCoreCoursework({ ...undergraduate, coursework: [...undergraduate.coursework, undergraduate.coursework[0]] }),
    /mathematical-methods-for-physics/i,
  );
});

test('CV exposes no transcript interface and preserves the two authorized lazy CV PDFs', () => {
  const allHtml = Object.values(pages).join('\n');
  assert.equal(html('/cv').includes('data-transcripts'), false);
  assert.equal(transcriptControls(allHtml).length, 0);
  assert.doesNotMatch(allHtml, /<h[1-6][^>]*>[^<]*(?:transcript|成绩单)/i);

  for (const [filename, expected] of Object.entries(publishedPdfs)) {
    const output = join(root, 'dist', 'cv', filename);
    assert.equal(statSync(output).size, expected.bytes);
    assert.equal(sha256(output), expected.sha256);
  }
  assert.deepEqual(readdirSync(join(root, 'public', 'cv')).sort(), Object.keys(publishedPdfs).sort());
  assert.equal(existsSync(join(root, 'dist', 'cv', 'liangwei-hu-quantum-computing.pdf')), false);
  const quantum = elementWithData(pages.en, 'article', 'data-cv-track', 'quantum-computing');
  assert.match(quantum, /Preparing/);
  assert.doesNotMatch(quantum, /<(?:a|button|object)\b|\.pdf/i);
  assert.match(pages.en, /data-pdf-preview[^>]*aria-expanded="false"/);
  assert.doesNotMatch(pages.en, /<object[^>]+application\/pdf/);
});
