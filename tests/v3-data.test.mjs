import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const studentLabel = ['stu', 'dent'].join('');
const identifierLabel = ['i', 'd'].join('');
const numberLabel = ['num', 'ber'].join('');
const chineseStudentLabel = ['学', '号'].join('');
const privateAcademicValuePatterns = [
  new RegExp(
    `(?:${studentLabel}\\s*(?:${identifierLabel}|${numberLabel})|${chineseStudentLabel})\\s*(?::|：|=)\\s*[a-z0-9][a-z0-9_-]{3,}`,
    'i',
  ),
  /(?:birth\s*date|出生日期)\s*(?::|：|=)\s*(?:\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{4}年\d{1,2}月\d{1,2}日)/i,
];

function containsPrivateAcademicValue(content) {
  return privateAcademicValuePatterns.some((pattern) => pattern.test(content));
}

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

test('preserves official GPA context and keeps the resume-only rank explicitly non-official', async () => {
  const { educationByLocale } = await loadData('education');

  for (const locale of ['zh', 'en']) {
    const undergraduate = educationByLocale[locale].find(({ id }) => id === 'undergraduate');
    const graduate = educationByLocale[locale].find(({ id }) => id === 'graduate');

    assert.deepEqual(
      {
        value: undergraduate.gpa.value,
        scale: undergraduate.gpa.scale,
        source: undergraduate.gpa.source,
      },
      { value: '3.86', scale: '4.00', source: 'Official' },
    );
    assert.match(undergraduate.gpa.context, /2023-12-12/);
    assert.match(
      undergraduate.gpa.context,
      locale === 'zh' ? /官方成绩单快照/ : /Official transcript snapshot/i,
    );
    assert.doesNotMatch(
      undergraduate.gpa.context,
      /最终毕业 GPA|final graduation GPA/i,
    );
    assert.deepEqual(
      {
        value: undergraduate.rank.value,
        state: undergraduate.rank.state,
        source: undergraduate.rank.source,
        official: undergraduate.rank.official,
      },
      { value: 4, state: 'self-reported', source: 'Verified Resume', official: false },
    );
    assert.match(
      undergraduate.rank.context,
      locale === 'zh' ? /官方成绩单未列排名/ : /official transcript does not list a rank/i,
    );
    assert.deepEqual(
      { value: graduate.gpa.value, scale: graduate.gpa.scale, source: graduate.gpa.source },
      { value: '3.55', scale: '4.30', source: 'Official' },
    );
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
    profileByLocale.en.contacts.map(({ id, label, value, href }) => [id, label, value, href]),
    [
      ['email', 'Email / QQ', '3036064607@qq.com', 'mailto:3036064607@qq.com'],
      ['phone', 'Phone / WeChat', '+86 187 9229 3249', 'tel:+8618792293249'],
    ],
  );
  assert.deepEqual(
    profileByLocale.zh.contacts.map(({ id, label }) => [id, label]),
    [
      ['email', 'Email / QQ'],
      ['phone', 'Phone / WeChat'],
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
  assert.deepEqual(
    profileByLocale.zh.schoolJourney.slice(0, 3).map(({ period }) => period),
    [
      '2008.09 - 2014.06',
      '2014.09 - 2017.06',
      '2017.09 - 2020.07',
    ],
  );

  assert.deepEqual(
    profileByLocale.en.schoolJourney.slice(0, 3).map(({ period }) => period),
    [
      'Sep 2008 - Jun 2014',
      'Sep 2014 - Jun 2017',
      'Sep 2017 - Jul 2020',
    ],
  );

  for (const profile of Object.values(profileByLocale)) {
    assert.ok(
      profile.schoolJourney
        .slice(0, 3)
        .every(({ periodSource, source }) =>
          periodSource === undefined &&
          source === 'User-provided'
        ),
    );

    assert.ok(
      profile.schoolJourney
        .slice(3)
        .every(({ period, periodSource }) =>
          Boolean(period) &&
          periodSource === 'Verified Resume'
        ),
    );
  }
});

test('keeps transcript data out of the public data model', async () => {
  await assert.rejects(access(new URL('../src/data/transcripts.ts', import.meta.url)), /ENOENT/);
});

test('does not track academic PDFs, labeled private identifiers, or complete local provenance paths', async () => {
  const publicFiles = await filesBelow(new URL('../public/', import.meta.url));
  const academicPdf = /(?:transcript|academic[-_ ]?record|成绩单).*\.pdf$/i;
  assert.deepEqual(
    publicFiles
      .map((file) => decodeURIComponent(file.pathname))
      .filter((pathname) => academicPdf.test(pathname)),
    [],
  );

  const fictionalAcademicIdentifier = [`${studentLabel} ${identifierLabel}`, 'SAMPLE-ID-DO-NOT-PUBLISH'].join(': ');
  const fictionalBirthDate = ['Birth date', ['2099', '12', '31'].join('-')].join(': ');
  assert.equal(containsPrivateAcademicValue(fictionalAcademicIdentifier), true);
  assert.equal(containsPrivateAcademicValue(fictionalBirthDate), true);
  assert.equal(
    containsPrivateAcademicValue('Private academic labels without a value are policy descriptions, not identifier leaks.'),
    false,
  );

  const { stdout } = await execFileAsync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
  const trackedFiles = stdout.split('\0').filter(Boolean);
  const textExtensions = new Set(['.astro', '.css', '.js', '.json', '.md', '.mjs', '.toml', '.ts', '.txt', '.yml', '.yaml']);
  const completeLocalPath = /[A-Za-z]:[\\/](?:Users|Desktop)[\\/]/i;
  const matches = [];

  for (const file of trackedFiles) {
    const extension = file.slice(file.lastIndexOf('.'));
    if (!textExtensions.has(extension)) continue;
    let content;
    try {
      content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (completeLocalPath.test(content) || containsPrivateAcademicValue(content)) matches.push(file);
  }

  assert.deepEqual(matches, []);
});
