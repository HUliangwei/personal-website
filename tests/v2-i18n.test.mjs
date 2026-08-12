import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const siteUrl = 'https://personal-website.huliangwei020311.workers.dev';

function outputFor(href) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (extname(pathname)) return join(dist, pathname.slice(1));
  return join(dist, pathname.slice(1), 'index.html');
}

function page(route) {
  return readFileSync(outputFor(route), 'utf8');
}

test('V2 publishes localized routes, route-preserving navigation, and complete locale SEO', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const routePairs = [
    ['/', '/en'],
    ['/about', '/en/about'],
    ['/projects', '/en/projects'],
    ['/cv', '/en/cv'],
    ['/projects/spad', '/en/projects/spad'],
    ['/projects/lerobot', '/en/projects/lerobot'],
    ['/projects/mobile-robot', '/en/projects/mobile-robot'],
    ['/projects/quantum-hfss', '/en/projects/quantum-hfss'],
  ];

  for (const [zhRoute, enRoute] of routePairs) {
    assert.ok(existsSync(outputFor(zhRoute)), `${zhRoute} is generated`);
    assert.ok(existsSync(outputFor(enRoute)), `${enRoute} is generated`);

    const zh = page(zhRoute);
    const en = page(enRoute);
    assert.match(zh, /<html lang="zh-CN">/);
    assert.match(en, /<html lang="en">/);
    assert.match(zh, new RegExp(`<link rel="canonical" href="${siteUrl}${zhRoute === '/' ? '/' : zhRoute}"`));
    assert.match(en, new RegExp(`<link rel="canonical" href="${siteUrl}${enRoute}"`));
    assert.match(zh, new RegExp(`<link rel="alternate" hreflang="zh-CN" href="${siteUrl}${zhRoute === '/' ? '/' : zhRoute}"`));
    assert.match(zh, new RegExp(`<link rel="alternate" hreflang="en" href="${siteUrl}${enRoute}"`));
    assert.match(zh, new RegExp(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${zhRoute === '/' ? '/' : zhRoute}"`));
    assert.match(en, /<meta property="og:locale" content="en_US">/);
    assert.match(zh, /<meta property="og:locale" content="zh_CN">/);
    assert.match(zh, new RegExp(`href="${enRoute}"[^>]*data-language-switch`));
    assert.match(en, new RegExp(`href="${zhRoute === '/' ? '/' : zhRoute}"[^>]*data-language-switch`));
  }

  const zhHome = page('/');
  const enHome = page('/en');
  assert.match(zhHome, /跳至主要内容/);
  assert.match(enHome, /Skip to main content/);
  assert.match(zhHome, /打开导航菜单/);
  assert.match(enHome, /Open navigation menu/);
  assert.match(zhHome, /href="\/about"[^>]*>关于</);
  assert.match(enHome, /href="\/en\/about"[^>]*>About</);
  assert.match(zhHome, /href="https:\/\/github\.com\/HUliangwei\/personal-website"/);
  assert.match(enHome, /href="https:\/\/github\.com\/HUliangwei\/personal-website"/);
  assert.match(zhHome, /胡良玮/);
  assert.doesNotMatch(zhHome, /胡亮伟/);

  assert.match(page('/about'), /<h1[^>]*>[^<]*技术/);
  assert.match(page('/en/about'), /<h1[^>]*>[^<]*technical/i);
  assert.match(page('/projects'), /<h1[^>]*>[^<]*项目/);
  assert.match(page('/en/projects'), /<h1[^>]*>[^<]*Projects/i);
  assert.match(page('/cv'), /<h1[^>]*>[^<]*简历/);
  assert.match(page('/en/cv'), /<h1[^>]*>[^<]*CV/i);
  assert.doesNotMatch(page('/en/projects'), />[^<]*ROS2[^<]*</);

  for (const route of ['/en/projects/spad']) {
    const detail = page(route);
    assert.match(detail, /<div class="project-prose"><h2[^>]*>Overview<\/h2>/, `${route} renders the collection MDX body`);
    assert.match(detail, /<h2[^>]*>What I Learned<\/h2>/, `${route} preserves the full MDX case-study structure`);
  }

  for (const route of routePairs.flat()) {
    const html = page(route);
    for (const href of html.matchAll(/href="(\/[^"#?]*)/g)) {
      assert.ok(existsSync(outputFor(href[1])), `${route} link ${href[1]} resolves in dist`);
    }
  }
});
