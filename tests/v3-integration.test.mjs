import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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
  ['/projects/spad', '/en/projects/spad'],
  ['/projects/mobile-robot', '/en/projects/mobile-robot'],
  ['/projects/quantum-hfss', '/en/projects/quantum-hfss'],
  ['/projects/lerobot', '/en/projects/lerobot'],
];
const routes = routePairs.flat();

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

function readableTextFiles(files) {
  const binaryExtensions = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff', '.woff2', '.glb']);
  const decoder = new TextDecoder('utf-8', { fatal: true });
  return files.flatMap((file) => {
    if (binaryExtensions.has(extname(file).toLowerCase())) return [];
    const bytes = readFileSync(file);
    if (bytes.subarray(0, 8192).includes(0)) return [];
    try {
      return [{ file, text: decoder.decode(bytes) }];
    } catch {
      return [];
    }
  });
}

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

test('V3 publishes exactly the sixteen bilingual routes with valid links and page landmarks', () => {
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

test('V3 locale pairs preserve routes and emit complete localized SEO metadata', () => {
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

test('V3 generated copy has no development markers or generic portfolio template phrases', () => {
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
  ];
  for (const pattern of forbidden) assert.doesNotMatch(publicText, pattern, `generated visible text excludes ${pattern}`);

  assert.match(visibleText(page('/cv')), /准备中/);
  assert.match(visibleText(page('/en/cv')), /Preparing/);
  assert.match(visibleText(page('/projects/lerobot')), /尚未核实/);
  assert.match(visibleText(page('/en/projects/lerobot')), /not yet verified/i);
});

test('V3 publishes only the two authorized contact channels', () => {
  const allHtml = routes.map(page).join('\n');
  const contactLinks = new Set([...allHtml.matchAll(/href="((?:mailto|tel):[^"]+)"/g)].map((match) => match[1]));
  assert.deepEqual([...contactLinks].sort(), ['mailto:3036064607@qq.com', 'tel:+8618792293249']);
  assert.match(page('/'), />3036064607@qq\.com</);
  assert.match(page('/'), />\+86 187 9229 3249</);
  assert.match(page('/en'), />3036064607@qq\.com</);
  assert.match(page('/en'), />\+86 187 9229 3249</);
});

test('V3 publication excludes transcript identifiers, local paths, reference assets, and secrets', () => {
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
  const identifier = ['264', '584', '62'].join('');
  const completeLocalPath = /[A-Z]:\\(?:Users|Desktop)\\/i;
  const secretAssignment = /(?:api[_-]?key|cloudflare[_-]?api[_-]?token|secret[_-]?key)\s*[:=]\s*["'][^"']+["']/i;

  for (const { file, text } of readableTextFiles([...tracked, ...publicFiles, ...distFiles])) {
    assert.doesNotMatch(text, new RegExp(identifier), `${file} omits transcript filename identifiers`);
    assert.doesNotMatch(text, completeLocalPath, `${file} omits complete local paths`);
    assert.doesNotMatch(text, secretAssignment, `${file} omits committed secrets`);
  }

  const publishedNames = [...publicFiles, ...distFiles].map((file) => relative(root, file).split(sep).join('/')).join('\n');
  const forbiddenAsset = new RegExp(`(?:${['me', '\\.glb'].join('')}|${['sen', '\\.blend'].join('')}|sen-3d-resume)`, 'i');
  assert.doesNotMatch(publishedNames, forbiddenAsset);

  const modelExists = existsSync(join(root, 'public', 'models', 'hlw.glb'));
  const homeHtml = `${page('/')}\n${page('/en')}`;
  assert.equal(homeHtml.includes('/models/hlw.glb'), modelExists, 'the optional model URL is emitted only when the verified file exists');
});

test('V3 responsive CSS covers small reflow, touch, focus, forced colors, and reduced motion', () => {
  const css = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf8');
  assert.match(css, /body\s*{[^}]*min-width:\s*20rem;[^}]*overflow-x:\s*hidden;/s);
  assert.match(css, /@media \(max-width:\s*25rem\)/, '320px and 375px use the compact layout');
  assert.match(css, /@media \(max-width:\s*44rem\)/, '768px transitions safely from the mobile layout');
  assert.match(css, /@media \(max-width:\s*63\.9375rem\)/, '1024px uses the intermediate grid boundary');
  assert.match(css, /\.primary-nav a,\s*\.nav-toggle,\s*\.button,\s*\.coursework-item,\s*\.project-filter button\s*{[^}]*min-height:\s*2\.75rem;/s);
  assert.match(css, /:focus-visible\s*{[^}]*outline:\s*3px solid/s);
  assert.match(css, /@media \(hover:\s*none\),\s*\(pointer:\s*coarse\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media \(forced-colors:\s*active\)/);
});

test('V3 keeps the static Cloudflare deployment contract and documents the release architecture', () => {
  const astro = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const wrangler = readFileSync(join(root, 'wrangler.jsonc'), 'utf8');
  assert.match(astro, /output:\s*'static'/);
  assert.doesNotMatch(astro, /adapter|output:\s*['"]server/);
  assert.match(wrangler, /"name":\s*"personal-website"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
  assert.doesNotMatch(wrangler, /"main"|compatibility_flags/);

  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  for (const heading of ['V3 information architecture', 'Internationalization', 'Projects', 'Academic data', 'Transcript privacy workflow', '3D model', 'Cloudflare deployment']) {
    assert.match(readme, new RegExp(`^## ${heading}$`, 'mi'), `README documents ${heading}`);
  }
  for (const identity of ['SPAD IC Design', 'Mobile Robot', 'Superconducting Quantum Computing', 'Embodied AI Learning']) {
    assert.match(readme, new RegExp(identity), `README documents ${identity}`);
  }
  assert.match(readme, /shared locale-aware page components/i);
  assert.match(readme, /official transcript grades/i);
  assert.match(readme, /Preparing/);
  assert.match(readme, /\/models\/hlw\.glb/);
  assert.match(readme, /GitHub\s*->\s*Cloudflare Build\s*->\s*npm ci\s*->\s*npm run build\s*->\s*dist\/\s*->\s*npx wrangler deploy/);
});
