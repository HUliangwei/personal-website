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
  'liangwei-hu-ic-design-zh.pdf': { bytes: 319441, sha256: 'd7e2ca46b2ed294359526217b5d693a615e6bb4922a2ae1f5237fcd992d0f48e' },
  'liangwei-hu-ic-design-en.pdf': { bytes: 100282, sha256: '0bee38339056b5c937487bc53a598266abe0efefc7b1d0e665be94f13824e5de' },
  'liangwei-hu-embodied-ai-zh.pdf': { bytes: 277282, sha256: '32e6d16a9e769097da2c4d4ed86711cac98a9a7d395c76f4269111c68f2bb9a0' },
  'liangwei-hu-embodied-ai-en.pdf': { bytes: 75560, sha256: 'ea9554a30495ea8505b5b4298d1181cdb47306561bf85980cb57c2b195193879' },
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

test('renders every selected audited grade in the correct locale and education table', () => {
  for (const locale of ['zh', 'en']) {
    const html = pages[locale];
    for (const educationId of ['undergraduate', 'graduate']) {
      const card = elementWithData(html, 'article', 'data-education-id', educationId);
      const expected = coursework[locale][educationId].filter(([courseId]) => courseId !== 'programmable-logic-devices');
      const rendered = elementWithData(card, 'table', 'data-coursework-table', educationId);
      assert.match(rendered, /<thead>[\s\S]*?<th[^>]*>[^<]+<\/th>[\s\S]*?<th[^>]*>[^<]+<\/th>[\s\S]*?<\/thead>/);
      assert.equal((rendered.match(/data-course-id=/g) ?? []).length, expected.length);
      for (const [courseId, label, grade] of expected) {
        const row = elementWithData(rendered, 'tr', 'data-course-id', courseId);
        assert.match(row, new RegExp(`>${escapeRegex(label)}<`));
        assert.match(row, new RegExp(`>${escapeRegex(grade)}<`));
      }
    }
  }
});

test('keeps coursework grades always readable in semantic tables without focus-reveal behavior', () => {
  for (const html of Object.values(pages)) {
    assert.equal((html.match(/data-course-id=/g) ?? []).length, 17);
    assert.equal((html.match(/data-coursework-table=/g) ?? []).length, 2);
    assert.doesNotMatch(html, /coursework-item|data-course-grade|tabindex="0"[^>]*data-course-id|aria-describedby="course-grade-/);
  }

  assert.match(cssBlock(compiledCss, '.coursework-table'), /width:100%/);
  assert.doesNotMatch(compiledCss, /coursework-(?:item|grade)|@media\(hover:hover\)and\(pointer:fine\)/);
  const forcedColors = cssBlock(compiledCss, '@media (forced-colors:active)');
  assert.match(forcedColors, /\.coursework-table(?:\s+th|\s+td)/);
});

test('renders three CV tracks with locale-specific authorized PDFs and a non-link Quantum Preparing state', () => {
  const expectedTracks = {
    zh: ['集成电路', '具身智能', '量子计算'],
    en: ['Integrated Circuits', 'Embodied AI', 'Quantum Computing'],
  };
  const localizedFiles = {
    zh: ['liangwei-hu-ic-design-zh.pdf', 'liangwei-hu-embodied-ai-zh.pdf'],
    en: ['liangwei-hu-ic-design-en.pdf', 'liangwei-hu-embodied-ai-en.pdf'],
  };

  for (const locale of ['zh', 'en']) {
    const html = pages[locale];
    assert.equal((html.match(/data-cv-track=/g) ?? []).length, 3);
    for (const [index, id] of ['integrated-circuits', 'embodied-ai', 'quantum-computing'].entries()) {
      const card = elementWithData(html, 'article', 'data-cv-track', id);
      assert.match(card, new RegExp(`<h3[^>]*>${expectedTracks[locale][index]}</h3>`));
    }
    for (const filename of localizedFiles[locale]) {
      assert.equal((html.match(new RegExp(`href="/cv/${escapeRegex(filename)}"`, 'g')) ?? []).length, 2);
    }
    for (const filename of localizedFiles[locale === 'zh' ? 'en' : 'zh']) {
      assert.equal((html.match(new RegExp(`href="/cv/${escapeRegex(filename)}"`, 'g')) ?? []).length, 0);
    }
    const quantum = elementWithData(html, 'article', 'data-cv-track', 'quantum-computing');
    assert.match(quantum, locale === 'zh' ? /准备中/ : /Preparing/);
    assert.doesNotMatch(quantum, /<(?:a|button|object)\b|\.pdf/i);
  }

  for (const [filename, expected] of Object.entries(publishedPdfs)) {
    const output = join(root, 'dist', 'cv', filename);
    assert.equal(statSync(output).size, expected.bytes);
    assert.equal(sha256(output), expected.sha256);
  }
  assert.equal(existsSync(join(root, 'dist', 'cv', 'liangwei-hu-quantum-computing.pdf')), false);
});

test('renders no transcript interface, link, preview, or status card', () => {
  for (const html of Object.values(pages)) {
    assert.doesNotMatch(html, /data-transcripts|data-transcript-id|transcript-card/);
    assert.doesNotMatch(html, /<h[1-6][^>]*>[^<]*(?:transcript|成绩单)/i);
    assert.doesNotMatch(html, /(?:href|download)="[^"]*(?:transcript|academic[-_ ]?record|成绩单)[^"]*"/i);
  }
});

test('keeps transcript PDFs and private academic identifiers out of public and built artifacts', () => {
  const files = [...filesBelow(join(root, 'public')), ...filesBelow(join(root, 'dist'))];
  const academicPdfName = /(?:transcript|academic[-_ ]?record|成绩单).*\.pdf$/i;
  assert.deepEqual(files.filter((file) => academicPdfName.test(file)), []);

  const privateTranscriptToken = ['264', '584', '62'].join('');
  const privateAcademicLabel = ['学', '号'].join('');
  const privateValue = new RegExp(`${privateTranscriptToken}|(?:student\\s*(?:id|number)|${privateAcademicLabel})\\s*(?::|：|=)\\s*[a-z0-9][a-z0-9_-]{3,}`, 'i');
  const textExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);
  const leaked = files.filter((file) => textExtensions.has(extname(file).toLowerCase()) && privateValue.test(readFileSync(file, 'utf8')));
  assert.deepEqual(leaked, []);
});

test('keeps the CV document outline ordered from Academic Profile through CV Versions', () => {
  const headings = {
    zh: ['教育与学术基础', '面向三个技术方向'],
    en: ['Education and academic foundation', 'Three technical tracks'],
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
