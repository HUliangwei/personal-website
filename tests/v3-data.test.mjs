import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

async function loadData(moduleName) {
  try {
    return await import(`../src/data/${moduleName}.ts`);
  } catch (error) {
    assert.fail(`${moduleName} data model must be importable: ${error.message}`);
  }
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
      return entry.isDirectory() ? filesBelow(url) : [url];
    }),
  );

  return nested.flat();
}

const expectedGrades = {
  undergraduate: [
    ['mathematical-methods-for-physics', '96'],
    ['computational-physics', '96'],
    ['c-programming', '95'],
    ['quantum-mechanics', '95'],
    ['calculus', '94 / 84'],
    ['linear-algebra', '94'],
    ['electrodynamics', '94'],
    ['digital-logic-circuits', '92'],
    ['digital-logic-lab', '91'],
    ['probability-and-statistics', '92'],
    ['circuit-analysis', '90'],
  ],
  graduate: [
    ['programmable-logic-devices', '79'],
    ['physical-electronics-logic-lab', '95'],
    ['computational-physics', '92'],
    ['digital-signal-processing-ii', '83'],
    ['semiconductor-device-physics', '80'],
    ['quantum-materials-and-devices', '88'],
    ['quantum-optics', '88'],
  ],
};

test('publishes the audited transcript grades without changing course evidence semantics', async () => {
  const { educationByLocale } = await loadData('education');

  for (const [educationId, grades] of Object.entries(expectedGrades)) {
    for (const locale of ['zh', 'en']) {
      const education = educationByLocale[locale].find(({ id }) => id === educationId);
      assert.deepEqual(
        education.coursework.map(({ id, grade }) => [id, grade]),
        grades,
      );
      assert.ok(education.coursework.every(({ evidenceSource }) => evidenceSource === 'Official'));
      assert.ok(
        education.coursework.every(({ labelSource }) =>
          locale === 'zh'
            ? labelSource === 'Official Chinese'
            : labelSource === 'Editorial Translation',
        ),
      );
    }
  }
});

test('centralizes only the authorized contacts and user-provided personal profile facts', async () => {
  const { profileByLocale } = await loadData('profile');

  assert.deepEqual(
    { zh: profileByLocale.zh.name, en: profileByLocale.en.name },
    { zh: '胡良玮', en: 'Liangwei Hu' },
  );
  assert.doesNotMatch(JSON.stringify(profileByLocale), /胡良伟|胡亮伟/);
  assert.deepEqual(
    profileByLocale.en.contacts.map(({ id, value, href }) => [id, value, href]),
    [
      ['email', '3036064607@qq.com', 'mailto:3036064607@qq.com'],
      ['phone', '+86 187 9229 3249', 'tel:+8618792293249'],
    ],
  );
  assert.deepEqual(
    profileByLocale.zh.schoolJourney.map(({ name }) => name),
    ['宣城市第三小学', '宣城市第十二中学', '宣城中学', '武汉大学', '中国科学技术大学'],
  );
  assert.deepEqual(
    profileByLocale.en.schoolJourney.map(({ name }) => name),
    [
      'Xuancheng No. 3 Primary School',
      'Xuancheng No. 12 Middle School',
      'Xuancheng High School',
      'Wuhan University',
      'University of Science and Technology of China',
    ],
  );
  assert.deepEqual(profileByLocale.zh.interests, ['足球', '篮球', '羽毛球', 'KTV', '麻将', '游戏']);
  assert.deepEqual(profileByLocale.en.interests, ['Football', 'Basketball', 'Badminton', 'Karaoke', 'Mahjong', 'Gaming']);
  assert.deepEqual(profileByLocale.zh.games, ['骑马与砍杀', '维多利亚', '无畏契约']);
  assert.deepEqual(profileByLocale.en.games, ['Mount & Blade', 'Victoria', 'VALORANT']);
  assert.ok(
    Object.values(profileByLocale).every((profile) =>
      profile.schoolJourney.every(({ source }) => source === 'User-provided'),
    ),
  );
});

test('keeps every transcript private behind a natural preparing state', async () => {
  const { transcriptsByLocale } = await loadData('transcripts');

  for (const locale of ['zh', 'en']) {
    assert.deepEqual(transcriptsByLocale[locale].map(({ id }) => id), ['undergraduate', 'graduate']);
    assert.ok(
      transcriptsByLocale[locale].every(
        ({ available, pdf, status }) => available === false && pdf === null && status === 'preparing',
      ),
    );
  }

  assert.ok(transcriptsByLocale.zh.every(({ statusLabel }) => statusLabel === '准备中'));
  assert.ok(transcriptsByLocale.en.every(({ statusLabel }) => statusLabel === 'Preparing'));
});

test('does not track academic PDFs, transcript identifiers, or complete local provenance paths', async () => {
  const publicFiles = await filesBelow(new URL('../public/', import.meta.url));
  const academicPdf = /(?:transcript|academic[-_ ]?record|成绩单).*\.pdf$/i;
  assert.deepEqual(
    publicFiles
      .map((file) => decodeURIComponent(file.pathname))
      .filter((pathname) => academicPdf.test(pathname)),
    [],
  );

  const { stdout } = await execFileAsync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
  const trackedFiles = stdout.split('\0').filter(Boolean);
  const textExtensions = new Set(['.astro', '.css', '.js', '.json', '.md', '.mjs', '.toml', '.ts', '.txt', '.yml', '.yaml']);
  const privateIdentifiers = [
    ['2020', '3020', '21136'].join(''),
    ['SA24', '2341', '07'].join(''),
    ['2002', '-03', '-11'].join(''),
  ];
  const forbidden = new RegExp(
    String.raw`[A-Za-z]:[\\/](?:Users|Desktop)[\\/]|${privateIdentifiers.join('|')}`,
    'i',
  );
  const matches = [];

  for (const file of trackedFiles) {
    const extension = file.slice(file.lastIndexOf('.'));
    if (!textExtensions.has(extension)) continue;
    const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    if (forbidden.test(content)) matches.push(file);
  }

  assert.deepEqual(matches, []);
});
