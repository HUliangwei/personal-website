import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const routes = [
  '/',
  '/about',
  '/projects',
  '/projects/spad',
  '/projects/lerobot',
  '/projects/mobile-robot',
  '/projects/quantum-hfss',
  '/cv',
  '/en',
  '/en/about',
  '/en/projects',
  '/en/projects/spad',
  '/en/projects/lerobot',
  '/en/projects/mobile-robot',
  '/en/projects/quantum-hfss',
  '/en/cv',
];

function outputFor(href) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (extname(pathname)) return join(dist, pathname.slice(1));
  return join(dist, pathname.slice(1), 'index.html');
}

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function trackedTextFiles() {
  const paths = execFileSync('git', ['ls-files', '-z'], { cwd: root })
    .toString('utf8')
    .split('\0')
    .filter(Boolean);
  const binaryExtensions = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff', '.woff2', '.glb']);
  const decoder = new TextDecoder('utf-8', { fatal: true });

  return paths.flatMap((path) => {
    if (binaryExtensions.has(extname(path).toLowerCase())) return [];
    const bytes = readFileSync(join(root, path));
    if (bytes.subarray(0, 8192).includes(0)) return [];
    try {
      return [{ path, text: decoder.decode(bytes) }];
    } catch {
      return [];
    }
  });
}

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('V2 publishes every bilingual route with landmarks, one primary heading, and valid internal links', () => {
  for (const route of routes) {
    assert.ok(existsSync(outputFor(route)), `${route} is generated`);
    const html = readFileSync(outputFor(route), 'utf8');
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route} has one main landmark`);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route} has one h1`);
    assert.match(html, /<a class="skip-link" href="#main-content">/);

    for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
      assert.ok(existsSync(outputFor(match[1])), `${route} link ${match[1]} resolves`);
    }
  }
});

test('language switches preserve the page and project slug in both directions', () => {
  const pairs = routes.slice(0, 8).map((zh) => [zh, zh === '/' ? '/en' : `/en${zh}`]);
  for (const [zh, en] of pairs) {
    assert.match(readFileSync(outputFor(zh), 'utf8'), new RegExp(`href="${en}"[^>]*data-language-switch`));
    assert.match(readFileSync(outputFor(en), 'utf8'), new RegExp(`href="${zh}"[^>]*data-language-switch`));
  }
});

test('CV Versions keeps a logical heading hierarchy in both locales', () => {
  for (const route of ['/cv', '/en/cv']) {
    const html = readFileSync(outputFor(route), 'utf8');
    const versions = html.match(/<section class="cv-versions"[^>]*>([^]*?)<\/section>/)?.[1] ?? '';
    assert.match(versions, /<h2\b/);
    assert.equal((versions.match(/<h3\b/g) ?? []).length, 3, `${route} has h3 track titles`);
    assert.doesNotMatch(versions.replace(/<h2\b[^>]*>[^]*?<\/h2>/, ''), /<h2\b/, `${route} does not skip the track-title level`);
  }
});

test('publication excludes private academic, reference-project, model, and secret material', () => {
  const published = filesUnder(join(root, 'public')).map((file) => relative(root, file).replaceAll('\\', '/'));
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' });
  const sourceText = filesUnder(join(root, 'src'))
    .filter((file) => /\.(?:astro|css|mdx?|mjs|ts)$/.test(file))
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');

  const privateDocumentPattern = new RegExp(`成绩单|transcript|cet-?6|${['264', '584', '62'].join('')}`, 'i');
  assert.deepEqual(published.filter((file) => privateDocumentPattern.test(file)), []);
  assert.doesNotMatch(tracked, /(?:^|\/)(?:me\.glb|sen\.blend|hlw\.glb)$/im);
  assert.doesNotMatch(tracked, /ref\/sen-3d-resume|web\/public\/models/i);
  assert.doesNotMatch(sourceText, /Sen Zhan|dayinji\/sen-3d-resume/i);
  assert.doesNotMatch(sourceText, /(?:api[_-]?key|cloudflare[_-]?api[_-]?token|secret[_-]?key)\s*[:=]\s*["'][^"']+["']/i);
});

test('every tracked text file omits private academic identifiers and local provenance paths', () => {
  const transcriptIdentifier = ['264', '584', '62'].join('');
  const privateAcademicLabel = new RegExp(['student', '(?:\\s|[-_])*', '(?:number|id)'].join(''), 'i');
  const privateChineseAcademicLabel = new RegExp(['学', '号'].join(''));
  const localPath = /[A-Z]:\\(?:Users|Desktop)\\/i;

  for (const { path, text } of trackedTextFiles()) {
    assert.doesNotMatch(text, new RegExp(transcriptIdentifier), `${path} omits transcript filename identifiers`);
    assert.doesNotMatch(text, privateAcademicLabel, `${path} omits private academic labels`);
    assert.doesNotMatch(text, privateChineseAcademicLabel, `${path} omits private Chinese academic labels`);
    assert.doesNotMatch(text, localPath, `${path} omits complete local provenance paths`);
  }
});

test('static Cloudflare deployment contract and crawler policy remain explicit', () => {
  const astro = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const wrangler = readFileSync(join(root, 'wrangler.jsonc'), 'utf8');
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');

  assert.match(astro, /output:\s*'static'/);
  assert.doesNotMatch(astro, /adapter|output:\s*['"]server/);
  assert.match(wrangler, /"name":\s*"personal-website"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
  assert.doesNotMatch(wrangler, /"main"|compatibility_flags/);
  assert.match(robots, /^User-agent:\s*\*\s*\nAllow:\s*\/$/m);
});

test('documentation defines the V2 architecture and safe hlw.glb replacement contract', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const modelGuidePath = join(root, 'docs', 'HLW_MODEL_GUIDE.md');
  assert.ok(existsSync(modelGuidePath), 'model guide exists');
  const guide = readFileSync(modelGuidePath, 'utf8');

  for (const topic of ['Architecture', 'Internationalization', 'Projects', 'Academic data', 'CV documents', '3D model', 'Reference policy', 'Cloudflare deployment']) {
    assert.match(readme, new RegExp(`^## ${topic}$`, 'm'), `README documents ${topic}`);
  }
  for (const contract of ['/models/hlw.glb', 'Y-up', 'origin', 'camera', 'lighting', 'GLB', 'texture', 'polygon', 'focus-start', 'fallback']) {
    assert.match(guide, new RegExp(contract, 'i'), `model guide documents ${contract}`);
  }
});

test('global polish preserves zoom, overflow, forced-colors, and motion accessibility contracts', () => {
  const css = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');
  assert.match(css, /body\s*{[^}]*overflow-x:\s*hidden/s);
  assert.match(css, /\.container\s*{[^}]*width:\s*min\(100%\s*-\s*2rem/s);
  assert.match(css, /@media \(max-width:\s*25rem\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media \(forced-colors:\s*active\)/);
  assert.match(css, /@media \(forced-colors:\s*active\)[^]*?\.home-scene\[data-scene-ready\] \.home-scene-fallback\s*{[^}]*opacity:\s*1;/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
  const standardMotionCss = css.split('@media (prefers-reduced-motion: reduce)')[0];
  const motionDurations = [...standardMotionCss.matchAll(/(?:transition|animation)(?:-[\w-]+)?\s*:[^;}]*?(\d+)ms/g)].map((match) => Number(match[1]));
  assert.ok(motionDurations.length >= 8, 'interactive motion is explicitly timed');
  assert.ok(motionDurations.every((duration) => duration >= 150 && duration <= 500), 'motion stays within 150–500ms');
});
