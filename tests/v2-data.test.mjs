import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

async function loadEducation() {
  try {
    return await import('../src/data/education.ts');
  } catch (error) {
    assert.fail(`education data model must be importable: ${error.message}`);
  }
}

async function publicFiles(directory = new URL('../public/', import.meta.url)) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      return entry.isDirectory() ? publicFiles(url) : [url];
    }),
  );

  return nested.flat();
}

const allowedCourses = {
  undergraduate: [
    ['mathematical-methods-for-physics', '数学物理方法'],
    ['computational-physics', '计算物理'],
    ['c-programming', 'C语言程序设计'],
    ['quantum-mechanics', '量子力学'],
    ['calculus', '微积分（上、下）'],
    ['linear-algebra', '线性代数B'],
    ['electrodynamics', '电动力学'],
    ['digital-logic-circuits', '数字逻辑电路'],
    ['digital-logic-lab', '数字逻辑电路实验'],
    ['probability-and-statistics', '概率论与数理统计B'],
    ['circuit-analysis', '电路分析'],
  ],
  graduate: [
    ['programmable-logic-devices', '可编程逻辑器件原理及应用'],
    ['physical-electronics-logic-lab', '物理电子学逻辑设计与仿真实验'],
    ['computational-physics', '计算物理'],
    ['digital-signal-processing-ii', '数字信号处理 II'],
    ['semiconductor-device-physics', '半导体器件原理'],
    ['quantum-materials-and-devices', '量子材料与器件'],
    ['quantum-optics', '量子光学'],
  ],
};

test('publishes transcript-supported GPA values with an official source classification', async () => {
  const { educationByLocale } = await loadEducation();
  const undergraduate = educationByLocale.en.find((record) => record.id === 'undergraduate');
  const graduate = educationByLocale.en.find((record) => record.id === 'graduate');

  assert.deepEqual(
    { value: undergraduate.gpa.value, scale: undergraduate.gpa.scale, source: undergraduate.gpa.source },
    { value: '3.86', scale: '4.00', source: 'Official' },
  );
  assert.match(undergraduate.gpa.context, /2023-12-12/);
  assert.match(undergraduate.gpa.context, /not.*final graduation GPA/i);
  assert.deepEqual(
    { value: graduate.gpa.value, scale: graduate.gpa.scale, source: graduate.gpa.source },
    { value: '3.55', scale: '4.30', source: 'Official' },
  );
});

test('keeps the resume-only undergraduate rank explicitly non-official', async () => {
  const { educationByLocale } = await loadEducation();

  for (const records of Object.values(educationByLocale)) {
    const rank = records.find((record) => record.id === 'undergraduate').rank;
    assert.deepEqual(
      { value: rank.value, state: rank.state, source: rank.source },
      { value: 4, state: 'self-reported', source: 'Verified Resume' },
    );
    assert.equal(rank.official, false);
  }
});

test('separates official course evidence from localized label provenance', async () => {
  const { educationByLocale } = await loadEducation();

  for (const id of ['undergraduate', 'graduate']) {
    const zh = educationByLocale.zh.find((record) => record.id === id);
    const en = educationByLocale.en.find((record) => record.id === id);
    assert.deepEqual(
      zh.coursework.map((course) => course.id),
      en.coursework.map((course) => course.id),
    );
    assert.ok(zh.coursework.every((course) => course.evidenceSource === 'Official' && course.labelSource === 'Official Chinese'));
    assert.ok(en.coursework.every((course) => course.evidenceSource === 'Official' && course.labelSource === 'Editorial Translation'));
  }
});

test('publishes exactly the audited course ids and official Chinese labels', async () => {
  const { educationByLocale } = await loadEducation();

  for (const [id, expected] of Object.entries(allowedCourses)) {
    const zh = educationByLocale.zh.find((record) => record.id === id);
    const en = educationByLocale.en.find((record) => record.id === id);
    assert.deepEqual(zh.coursework.map(({ id: courseId, label }) => [courseId, label]), expected);
    assert.deepEqual(en.coursework.map((course) => course.id), expected.map(([courseId]) => courseId));
  }
});

test('keeps transcript and identity fingerprints out of public assets and publication data', async () => {
  const files = await publicFiles();
  const sensitiveFingerprint = /transcript|cet[-_ ]?6|成绩单|六级|2020302021136|SA24234107|2002-03-11/i;
  const publicMatches = [];

  for (const file of files) {
    const content = await readFile(file);
    const displayPath = decodeURIComponent(file.pathname);
    if (sensitiveFingerprint.test(displayPath) || sensitiveFingerprint.test(content.toString('utf8'))) {
      publicMatches.push(displayPath);
    }
  }

  const educationSource = await readFile(new URL('../src/data/education.ts', import.meta.url), 'utf8');

  assert.deepEqual(publicMatches, []);
  assert.doesNotMatch(educationSource, /D:\\Desktop|2020302021136|SA24234107|2002-03-11/i);
});
