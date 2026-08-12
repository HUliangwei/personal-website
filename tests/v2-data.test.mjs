import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
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
      return entry.isDirectory() ? publicFiles(url) : [decodeURIComponent(url.pathname)];
    }),
  );

  return nested.flat();
}

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

test('provides matching bilingual labels only for transcript-supported courses', async () => {
  const { educationByLocale } = await loadEducation();

  for (const id of ['undergraduate', 'graduate']) {
    const zh = educationByLocale.zh.find((record) => record.id === id);
    const en = educationByLocale.en.find((record) => record.id === id);
    assert.deepEqual(
      zh.coursework.map((course) => course.id),
      en.coursework.map((course) => course.id),
    );
    assert.ok(zh.coursework.every((course) => course.source === 'Official' && /[\u3400-\u9fff]/u.test(course.label)));
    assert.ok(en.coursework.every((course) => course.source === 'Official' && /^[\x20-\x7e]+$/u.test(course.label)));
  }

  assert.equal(
    educationByLocale.zh.find((record) => record.id === 'graduate').coursework.find((course) => course.id === 'digital-signal-processing-ii').label,
    '数字信号处理 II',
  );
  assert.equal(
    educationByLocale.en.find((record) => record.id === 'graduate').coursework.find((course) => course.id === 'digital-signal-processing-ii').label,
    'Digital Signal Processing II',
  );
});

test('never places transcripts or CET6 records in public assets', async () => {
  const files = await publicFiles();
  const sensitiveName = /transcript|cet[-_ ]?6|成绩单|六级/i;

  assert.deepEqual(files.filter((file) => sensitiveName.test(file)), []);
});
