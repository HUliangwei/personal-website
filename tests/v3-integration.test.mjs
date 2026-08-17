import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const siteUrl = 'https://personal-website.huliangwei020311.workers.dev';
const routePairs = [
  ['/', '/en'],
  ['/about', '/en/about'],
  ['/projects', '/en/projects'],
  ['/cv', '/en/cv'],
  ['/projects/programming/personal-website', '/en/projects/programming/personal-website'],
  ['/projects/programming/robot', '/en/projects/programming/robot'],
  ['/projects/programming/videoto3d', '/en/projects/programming/videoto3d'],
];
const routes = routePairs.flat();
const maximumPublicationBytes = 10 * 1024 * 1024;
const authorizedCvSuffixes = [
  '/cv/liangwei-hu-embodied-ai.pdf',
  '/cv/liangwei-hu-ic-design.pdf',
];

function publicationSecurityViolations({ path, size, text }) {
  const normalizedPath = `/${path.replaceAll('\\', '/')}`.replace(/\/+/g, '/');
  const lowerPath = normalizedPath.toLowerCase();
  const basename = lowerPath.slice(lowerPath.lastIndexOf('/') + 1);
  const extension = extname(basename);
  const authorizedCv = authorizedCvSuffixes.some((suffix) => lowerPath.endsWith(suffix));
  const violations = [];

  if (/^\.env(?:$|[._-])|^\.envrc$/i.test(basename)) violations.push('environment configuration filename');
  if (new Set(['.gds', '.gds2', '.gdsii', '.oas', '.oasis', '.sp', '.spi', '.spice', '.cir', '.cdl', '.ckt', '.subckt', '.scs', '.dspf', '.pex', '.net', '.netlist']).has(extension)) {
    violations.push('chip-confidential file extension');
  }
  if (/(?:^|[._-])(?:pdk|netlist|nda|confidential|foundry)(?:$|[._-])/i.test(basename)) {
    violations.push('chip-confidential filename');
  }
  if (/(?:^|\/)(?:me\.glb|sen\.blend)(?:$|\/)|sen-3d-resume/i.test(lowerPath)) violations.push('reference asset filename');
  if (extension === '.pdf' && !authorizedCv) violations.push('unauthorized PDF');
  if (/(?:transcript|cet-?6|成绩单)/i.test(basename) && !new Set(['.ts', '.astro', '.mjs', '.md']).has(extension)) {
    violations.push('private academic filename');
  }
  if (size > maximumPublicationBytes && !authorizedCv) violations.push('oversized publication file');

  if (typeof text === 'string') {
    const identifier = ['264', '584', '62'].join('');
    const completeLocalPath = /[A-Z]:\\(?:Users|Desktop)\\/i;
    const secretKeys = [
      'api[_-]?key',
      'api[_-]?token',
      'access[_-]?token',
      'auth[_-]?token',
      'cloudflare[_-]?api[_-]?token',
      'client[_-]?secret',
      'private[_-]?key',
      'secret[_-]?key',
      'secret',
      'token',
    ].join('|');
    const secretAssignment = new RegExp(
      `(?:^|[^\\w])_*(?:${secretKeys})["']?\\s*[:=]\\s*(?:"[^"\\r\\n]{8,}"|'[^'\\r\\n]{8,}'|[A-Za-z0-9_./+=-]{8,})`,
      'im',
    );
    if (text.includes(identifier)) violations.push('transcript identifier');
    if (completeLocalPath.test(text)) violations.push('complete local path');
    if (secretAssignment.test(text)) violations.push('secret assignment');
  }

  return violations;
}

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function outputFor(href) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (extname(pathname)) return join(dist, pathname.slice(1));
  return join(dist, pathname.slice(1), 'index.html');
}

function page(route) {
  return readFileSync(outputFor(route), 'utf8');
}

function visibleText(html) {
  return html
    .replace(/<(?:script|style|template)[^>]*>[\s\S]*?<\/(?:script|style|template)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:amp|#38);/gi, '&')
    .replace(/&(?:nbsp|#160);/gi, ' ')
    .replace(/&(?:rarr|#x2192);/gi, '→')
    .replace(/\s+/g, ' ')
    .trim();
}

function publicCopy(html) {
  const metadata = [...html.matchAll(/<(?:meta|title)\b[^>]*(?:content="([^"]*)"[^>]*>|>([^<]*)<\/title>)/gi)]
    .flatMap((match) => [match[1], match[2]])
    .filter(Boolean);
  return [visibleText(html), ...metadata].join(' ');
}

function routeForIndex(file) {
  const path = relative(dist, file).split(sep).join('/').replace(/(?:^|\/)index\.html$/, '');
  return path ? `/${path}` : '/';
}

function publicationEntry(file) {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const bytes = readFileSync(file);
  let text;
  if (!bytes.subarray(0, 8192).includes(0)) {
    try {
      text = decoder.decode(bytes);
    } catch {
      text = undefined;
    }
  }
  return {
    path: relative(root, file).split(sep).join('/'),
    size: bytes.length,
    text,
  };
}

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

test('V4/V5 publishes the bilingual route set with valid links and page landmarks', () => {
  const generatedRoutes = filesUnder(dist)
    .filter((file) => file.endsWith(`${sep}index.html`) || file === join(dist, 'index.html'))
    .map(routeForIndex)
    .sort();
  assert.deepEqual(generatedRoutes, [...routes].sort());

  for (const route of routes) {
    const html = page(route);
    assert.equal((html.match(/<main\b/g) ?? []).length, 1, `${route} has one main landmark`);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${route} has one primary heading`);
    assert.match(html, /<header\b[^>]*class="site-header"/);
    assert.match(html, /<nav\b[^>]*aria-label="[^"]+"/);
    assert.match(html, /<footer\b[^>]*class="site-footer"/);
    assert.match(html, /<a class="skip-link" href="#main-content">/);

    for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
      assert.ok(existsSync(outputFor(match[1])), `${route} link ${match[1]} resolves`);
    }
  }
});

test('V4 locale pairs preserve routes and emit complete localized SEO metadata', () => {
  for (const [zhRoute, enRoute] of routePairs) {
    for (const [route, language, ogLocale] of [
      [zhRoute, 'zh-CN', 'zh_CN'],
      [enRoute, 'en', 'en_US'],
    ]) {
      const html = page(route);
      const canonical = `${siteUrl}${route === '/' ? '/' : route}`;
      assert.match(html, new RegExp(`<html lang="${language}">`));
      assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}"`));
      assert.match(html, new RegExp(`<meta property="og:url" content="${canonical}"`));
      assert.match(html, new RegExp(`<meta property="og:locale" content="${ogLocale}"`));
      assert.match(html, /<meta property="og:title" content="[^"\n]+"/);
      assert.match(html, /<meta property="og:description" content="[^"\n]{30,}"/);
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="zh-CN" href="${siteUrl}${zhRoute === '/' ? '/' : zhRoute}"`));
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="en" href="${siteUrl}${enRoute}"`));
      assert.match(html, new RegExp(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${zhRoute === '/' ? '/' : zhRoute}"`));
    }

    assert.match(page(zhRoute), new RegExp(`href="${enRoute}"[^>]*data-language-switch`));
    assert.match(page(enRoute), new RegExp(`href="${zhRoute === '/' ? '/' : zhRoute}"[^>]*data-language-switch`));
  }
});

test('V4 generated copy has no development markers or generic portfolio template phrases', () => {
  const publicText = routes.map((route) => publicCopy(page(route))).join('\n');
  const forbidden = [
    /TODO/i,
    /Placeholder/i,
    /Need verification/i,
    /Add verified/i,
    /pending verification/i,
    /尚待核实/,
    /Research\s*&\s*Engineering/i,
    /at the intersection of/i,
    /passionate about/i,
    /bridging\s+[^.!?。！？]{1,50}\s+and\s+[^.!?。！？]{1,50}/i,
    /连贯视角/,
    /持续追问/,
    /跨层实践/,
    /证据边界/,
    /项目产物支撑/,
    /不把[^。！？]{0,50}写成/,
    /evidence[- ]bounded/i,
    /project artifacts/i,
    /without presenting[^.!?]{0,80}as/i,
    /visibly separate from completed experience/i,
  ];
  for (const pattern of forbidden) assert.doesNotMatch(publicText, pattern, `generated visible text excludes ${pattern}`);

  assert.match(visibleText(page('/cv')), /准备中/);
  assert.match(visibleText(page('/en/cv')), /Preparing/);
  assert.match(visibleText(page('/projects')), /学习主题/);
  assert.match(visibleText(page('/en/projects')), /Learning Topics/);
});

test('V4 publishes only the two authorized contact channels', () => {
  const allHtml = routes.map(page).join('\n');
  const contactLinks = new Set([...allHtml.matchAll(/href="((?:mailto|tel):[^"]+)"/g)].map((match) => match[1]));
  assert.deepEqual([...contactLinks].sort(), ['mailto:3036064607@qq.com', 'tel:+8618792293249']);
  assert.match(page('/'), />3036064607@qq\.com</);
  assert.match(page('/'), />\+86 187 9229 3249</);
  assert.match(page('/en'), />3036064607@qq\.com</);
  assert.match(page('/en'), />\+86 187 9229 3249</);
});

test('publication security classification rejects runtime mutation samples without reading binary contents', () => {
  const runtimePath = (...parts) => parts.join('');
  const samples = [
    { path: runtimePath('public/', '.', 'en', 'v.', 'SAMPLE', '.local'), size: 32, text: undefined },
    { path: runtimePath('public/chip.', 'gd', 's'), size: 32, text: `\0SAMPLE` },
    { path: runtimePath('public/chip.', 'gds', '2'), size: 32, text: undefined },
    { path: runtimePath('public/chip.', 'gds', 'ii'), size: 32, text: undefined },
    { path: runtimePath('public/chip.', 'oa', 'sis'), size: 32, text: undefined },
    { path: runtimePath('public/foundry-', 'p', 'dk.zip'), size: 32, text: undefined },
    { path: runtimePath('dist/layout.', 'spi', 'ce'), size: 32, text: undefined },
    { path: runtimePath('dist/layout.', 'sc', 's'), size: 32, text: undefined },
    { path: runtimePath('dist/extracted.', 'dsp', 'f'), size: 32, text: undefined },
    { path: runtimePath('dist/extracted.', 'net', 'list'), size: 32, text: undefined },
    { path: runtimePath('public/customer-', 'n', 'da.docx'), size: 32, text: undefined },
    { path: runtimePath('public/foundry-', 'confidential.tar'), size: 32, text: undefined },
    { path: 'public/assets/SAMPLE.bin', size: maximumPublicationBytes + 1, text: undefined },
  ];

  for (const sample of samples) {
    assert.notEqual(publicationSecurityViolations(sample).length, 0, `${sample.path} is rejected from publication`);
  }
});

test('publication security classification catches quoted and unquoted runtime secret assignments without flagging policy prose', () => {
  const runtimeName = (...parts) => parts.join('');
  const runtimeValue = runtimeName('SAMPLE', '_', 'VALUE', '_', '123456789');
  const samples = [
    `${runtimeName('API', '_KEY')}="${runtimeValue}"`,
    `${runtimeName('ACCESS', '_TOKEN')}=${runtimeValue}`,
    `${runtimeName('SECRET', '_KEY')}: '${runtimeValue}'`,
    `${runtimeName('SE', 'CRET')}=${runtimeValue}`,
    `${runtimeName('_AUTH', 'TOKEN')}=${runtimeValue}`,
    `${runtimeName('CLIENT', '_SECRET')}="${runtimeValue}"`,
    `${runtimeName('PRIVATE', '_KEY')}=${runtimeValue}`,
    `${runtimeName('CLOUDFLARE', '_API', '_TOKEN')}: ${runtimeValue}`,
  ];

  for (const text of samples) {
    assert.notEqual(publicationSecurityViolations({ path: 'src/sample.ts', size: text.length, text }).length, 0);
  }

  const policy = 'Repository policy forbids PDK, GDS/GDSII, OASIS, SPICE netlists, NDA material, and foundry-confidential assets.';
  assert.deepEqual(publicationSecurityViolations({ path: 'README.md', size: policy.length, text: policy }), []);
  assert.deepEqual(publicationSecurityViolations({ path: 'src/components/Sample.astro', size: 2048, text: '<p>Normal source</p>' }), []);
  assert.deepEqual(publicationSecurityViolations({ path: 'public/cv/liangwei-hu-ic-design.pdf', size: 319440, text: undefined }), []);
  assert.deepEqual(publicationSecurityViolations({ path: 'public/cv/liangwei-hu-embodied-ai.pdf', size: 264803, text: undefined }), []);
});

test('V4 publication excludes transcript identifiers, local paths, reference assets, and secrets', () => {
  const publicFiles = filesUnder(join(root, 'public'));
  const distFiles = filesUnder(dist);
  const publicPdfs = publicFiles
    .filter((file) => extname(file).toLowerCase() === '.pdf')
    .map((file) => relative(join(root, 'public'), file).split(sep).join('/'))
    .sort();
  assert.deepEqual(publicPdfs, ['cv/liangwei-hu-embodied-ai.pdf', 'cv/liangwei-hu-ic-design.pdf']);

  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
    .map((file) => join(root, file));
  const allFiles = [...new Set([...tracked, ...publicFiles, ...distFiles])];

  for (const file of allFiles) {
    const metadata = {
      path: relative(root, file).split(sep).join('/'),
      size: statSync(file).size,
      text: undefined,
    };
    assert.deepEqual(publicationSecurityViolations(metadata), [], `${metadata.path} filename and size are publication-safe`);
  }
  for (const file of allFiles) {
    const entry = publicationEntry(file);
    assert.deepEqual(publicationSecurityViolations(entry), [], `${entry.path} content is publication-safe`);
  }

  const plyModelExists = existsSync(join(root, 'public', 'models', 'hlw.ply'));
  const glbModelExists = existsSync(join(root, 'public', 'models', 'hlw.glb'));
  const homeHtml = `${page('/')}\n${page('/en')}`;
  assert.equal(
    homeHtml.includes('/models/hlw.ply'),
    plyModelExists,
    'the preferred PLY model URL is emitted exactly when the verified PLY exists',
  );
  assert.equal(
    homeHtml.includes('/models/hlw.glb'),
    !plyModelExists && glbModelExists,
    'the GLB model URL is emitted only when it is the selected fallback model',
  );
});

test('V4 CSS exposes static prerequisites for browser viewport QA', () => {
  const css = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');
  assert.match(css, /body\s*{[^}]*min-width:\s*min\(20rem,\s*100%\);[^}]*overflow-x:\s*hidden;/s);
  assert.match(css, /\.cv-intro h1\s*{[^}]*text-wrap:\s*balance;/s);
  assert.match(css, /@media \(max-width:\s*25rem\)/, 'compact query ends at 400 CSS pixels');
  assert.match(css, /@media \(max-width:\s*44rem\)/, 'mobile query ends at 704 CSS pixels');
  assert.match(css, /@media \(max-width:\s*63\.9375rem\)/, 'intermediate query ends below 1024 CSS pixels');
  assert.match(css, /\.primary-nav a,\s*\.nav-toggle,\s*\.button\s*{[^}]*min-height:\s*2\.75rem;/s);
  assert.match(css, /:focus-visible\s*{[^}]*outline:\s*3px solid/s);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media \(forced-colors:\s*active\)/);
});

test('V3 CSS defines every custom property it consumes', () => {
  const css = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');
  const used = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/gi)].map((match) => match[1]));
  const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]));
  assert.deepEqual([...used].filter((property) => !defined.has(property)).sort(), []);
});

test('V4 keeps the static Cloudflare deployment contract and documents the release architecture', () => {
  const astro = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const wrangler = readFileSync(join(root, 'wrangler.jsonc'), 'utf8');
  assert.match(astro, /output:\s*'static'/);
  assert.doesNotMatch(astro, /adapter|output:\s*['"]server/);
  assert.match(wrangler, /"name":\s*"personal-website"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
  assert.doesNotMatch(wrangler, /"main"|compatibility_flags/);

  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  for (const heading of ['V4 information architecture', 'Internationalization', 'Projects', 'Academic data', 'Transcript privacy workflow', '3D model', 'Linux / Cloudflare verification', 'Cloudflare deployment']) {
    assert.match(readme, new RegExp(`^## ${heading}$`, 'mi'), `README documents ${heading}`);
  }
  for (const identity of ['SPAD IC Design', 'Mobile Robot', 'Superconducting Quantum Computing', 'Embodied AI Learning']) {
    assert.match(readme, new RegExp(identity), `README documents ${identity}`);
  }
  assert.match(readme, /exactly eight public routes/i);
  assert.match(readme, /Project cards are non-interactive overview articles/i);
  assert.match(readme, /does not publish transcript cards, transcript URLs, transcript previews, or transcript downloads/i);
  assert.match(readme, /Preparing/);
  assert.match(readme, /\/models\/hlw\.glb/);
  assert.match(readme, /actual browser viewport QA[^.]*320[^.]*375[^.]*768[^.]*1024[^.]*1440/i);
  assert.match(readme, /Node 24 and npm 10\.x/i);
  assert.doesNotMatch(readme, /\/projects\/<slug>|ProjectLayout|ProjectFilter|TranscriptCard|transcript states/i);
  assert.match(readme, /GitHub\s*->\s*Cloudflare Build\s*->\s*npm ci\s*->\s*npm run build\s*->\s*dist\/\s*->\s*npx wrangler deploy/);
});
