import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (...parts) => readFileSync(join(root, ...parts), 'utf8');

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

const coursework = {
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
      ['programmable-logic-devices', '可编程逻辑器件原理及应用', '79'],
      ['physical-electronics-logic-lab', '物理电子学逻辑设计与仿真实验', '95'],
      ['computational-physics', '计算物理', '92'],
      ['digital-signal-processing-ii', '数字信号处理 II', '83'],
      ['semiconductor-device-physics', '半导体器件原理', '80'],
      ['quantum-materials-and-devices', '量子材料与器件', '88'],
      ['quantum-optics', '量子光学', '88'],
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
      ['programmable-logic-devices', 'Principles and Applications of Programmable Logic Devices', '79'],
      ['physical-electronics-logic-lab', 'Physical Electronics Logic Design and Simulation Laboratory', '95'],
      ['computational-physics', 'Computational Physics', '92'],
      ['digital-signal-processing-ii', 'Digital Signal Processing II', '83'],
      ['semiconductor-device-physics', 'Principles of Semiconductor Devices', '80'],
      ['quantum-materials-and-devices', 'Quantum Materials and Devices', '88'],
      ['quantum-optics', 'Quantum Optics', '88'],
    ],
  },
};

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function elementWithData(html, tag, attribute, value) {
  const opening = new RegExp(`<${tag}[^>]*${attribute}="${escapeRegex(value)}"[^>]*>`).exec(html);
  assert.ok(opening, `${tag}[${attribute}="${value}"] must exist`);
  const start = opening.index;
  const end = html.indexOf(`</${tag}>`, start);
  assert.notEqual(end, -1, `${tag}[${attribute}="${value}"] must close`);
  return html.slice(start, end + tag.length + 3);
}

function cssBlock(source, marker) {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, `compiled CSS must contain ${marker}`);
  const open = source.indexOf('{', markerIndex);
  assert.notEqual(open, -1, `${marker} must open a CSS block`);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }
  assert.fail(`${marker} must close its CSS block`);
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

function filesBelow(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

let pages;
let compiledCss;

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    stdio: 'pipe',
  });
  pages = {
    zh: read('dist', 'cv', 'index.html'),
    en: read('dist', 'en', 'cv', 'index.html'),
  };
  const cssFiles = filesBelow(join(root, 'dist', '_astro')).filter((file) => extname(file) === '.css');
  assert.ok(cssFiles.length > 0, 'the build must emit CSS');
  compiledCss = cssFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
});

test('renders every audited grade in the correct locale and education card', () => {
  for (const locale of ['zh', 'en']) {
    const html = pages[locale];
    for (const educationId of ['undergraduate', 'graduate']) {
      const card = elementWithData(html, 'article', 'data-education-id', educationId);
      const expected = coursework[locale][educationId];
      assert.equal((card.match(/data-course-id=/g) ?? []).length, expected.length);
      for (const [courseId, label, grade] of expected) {
        const item = elementWithData(card, 'li', 'data-course-id', courseId);
        assert.match(item, new RegExp(`>${escapeRegex(label)}<`));
        assert.match(item, new RegExp(`data-grade="${escapeRegex(grade)}"`));
        assert.match(item, new RegExp(`>${escapeRegex(grade)}(?:\\s*\\/\\s*100)?<`));
      }
    }
  }
});

test('keeps coursework grades readable without JavaScript and keyboard focus reveals them on fine pointers', () => {
  for (const html of Object.values(pages)) {
    assert.equal((html.match(/data-course-id=/g) ?? []).length, 18);
    assert.equal((html.match(/data-course-grade(?:\s|>)/g) ?? []).length, 18);
    assert.equal((html.match(/data-course-id="[^"]+"[^>]*tabindex="0"/g) ?? []).length, 18);
    assert.equal((html.match(/data-course-id="[^"]+"[^>]*aria-describedby="course-grade-[^"]+"/g) ?? []).length, 18);
    assert.doesNotMatch(html, /data-coursework-(?:toggle|button)|aria-expanded="(?:true|false)"[^>]*data-course/i);
  }

  const baseGrade = cssBlock(compiledCss, '.coursework-grade');
  assert.match(baseGrade, /opacity:1/);

  const finePointer = cssBlock(compiledCss, '@media (hover:hover) and (pointer:fine)');
  assert.match(cssBlock(finePointer, '.coursework-grade'), /opacity:0/);
  const hoverReveal = cssBlock(finePointer, '.coursework-item:hover .coursework-grade');
  assert.match(hoverReveal, /opacity:1/);
  const focusReveal = cssBlock(finePointer, '.coursework-item:focus .coursework-grade');
  assert.match(focusReveal, /opacity:1/);

  const coarsePointer = cssBlock(compiledCss, '@media (hover:none),(pointer:coarse)');
  assert.match(cssBlock(coarsePointer, '.coursework-grade'), /opacity:1/);

  const mobile = cssBlock(compiledCss, '@media (width<=44rem)');
  const mobileGrade = cssBlock(mobile, '.coursework-grade');
  assert.match(mobileGrade, /max-width:none/);
  assert.match(mobileGrade, /opacity:1/);

  const reducedMotion = cssBlock(compiledCss, '@media (prefers-reduced-motion:reduce)');
  assert.match(cssBlock(reducedMotion, '.coursework-grade'), /transition-duration:/);
  const forcedColors = cssBlock(compiledCss, '@media (forced-colors:active)');
  assert.match(forcedColors, /\.coursework-item/);
});

test('renders three CV tracks while preserving the two authorized PDFs and a non-link Quantum Preparing state', () => {
  const expectedTracks = {
    zh: ['集成电路', '具身智能', '量子计算'],
    en: ['Integrated Circuits', 'Embodied AI', 'Quantum Computing'],
  };

  for (const locale of ['zh', 'en']) {
    const html = pages[locale];
    assert.equal((html.match(/data-cv-track=/g) ?? []).length, 3);
    for (const [index, id] of ['integrated-circuits', 'embodied-ai', 'quantum-computing'].entries()) {
      const card = elementWithData(html, 'article', 'data-cv-track', id);
      assert.match(card, new RegExp(`<h3[^>]*>${expectedTracks[locale][index]}</h3>`));
    }
    const quantum = elementWithData(html, 'article', 'data-cv-track', 'quantum-computing');
    assert.match(quantum, locale === 'zh' ? /准备中/ : /Preparing/);
    assert.doesNotMatch(quantum, /<(?:a|button|object)\b|\.pdf/i);
  }

  for (const [filename, expected] of Object.entries(publishedPdfs)) {
    for (const html of Object.values(pages)) {
      assert.equal((html.match(new RegExp(`href="/cv/${escapeRegex(filename)}"`, 'g')) ?? []).length, 2);
    }
    const output = join(root, 'dist', 'cv', filename);
    assert.equal(statSync(output).size, expected.bytes);
    assert.equal(sha256(output), expected.sha256);
  }
  assert.equal(existsSync(join(root, 'dist', 'cv', 'liangwei-hu-quantum-computing.pdf')), false);
});

test('renders two localized Preparing transcript cards without links, PDF controls, or objects', () => {
  const titles = {
    zh: { undergraduate: '本科成绩单', graduate: '研究生成绩单', status: '准备中' },
    en: { undergraduate: 'Undergraduate transcript', graduate: 'Graduate transcript', status: 'Preparing' },
  };

  for (const locale of ['zh', 'en']) {
    const section = elementWithData(pages[locale], 'section', 'data-transcripts', 'academic');
    assert.equal((section.match(/data-transcript-id=/g) ?? []).length, 2);
    for (const id of ['undergraduate', 'graduate']) {
      const card = elementWithData(section, 'article', 'data-transcript-id', id);
      assert.match(card, new RegExp(`<h3[^>]*>${titles[locale][id]}</h3>`));
      assert.match(card, new RegExp(`<p[^>]*role="status"[^>]*>${titles[locale].status}</p>`));
      assert.doesNotMatch(card, /<(?:a|button|object)\b|href=|download|\.pdf/i);
    }
  }
});

test('keeps transcript PDFs and private academic identifiers out of public and built artifacts', () => {
  const files = [...filesBelow(join(root, 'public')), ...filesBelow(join(root, 'dist'))];
  const academicPdfName = /(?:transcript|academic[-_ ]?record|成绩单).*\.pdf$/i;
  assert.deepEqual(files.filter((file) => academicPdfName.test(file)), []);

  const privateTranscriptToken = ['264', '584', '62'].join('');
  const privateValue = new RegExp(`${privateTranscriptToken}|(?:student\\s*(?:id|number)|学号)\\s*(?::|：|=)\\s*[a-z0-9][a-z0-9_-]{3,}`, 'i');
  const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);
  const leaked = files.filter((file) => textExtensions.has(extname(file).toLowerCase()) && privateValue.test(readFileSync(file, 'utf8')));
  assert.deepEqual(leaked, []);
});

test('keeps the CV document outline ordered from Academic Profile through CV Versions to transcripts', () => {
  const headings = {
    zh: ['教育与学术基础', '面向三个技术方向', '学业成绩单'],
    en: ['Education and academic foundation', 'Three technical tracks', 'Academic transcripts'],
  };

  for (const locale of ['zh', 'en']) {
    const html = pages[locale];
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    let previous = html.indexOf('<h1');
    for (const heading of headings[locale]) {
      const current = html.indexOf(`>${heading}</h2>`);
      assert.ok(current > previous, `${heading} must be an h2 after the preceding page heading`);
      previous = current;
    }
    assert.doesNotMatch(html, /TODO|Placeholder|Need verification|Add verified/i);
  }
});
