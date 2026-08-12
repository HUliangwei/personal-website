import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

function outputFor(href) {
  const pathname = href.split(/[?#]/, 1)[0];
  if (extname(pathname)) return join(dist, pathname.slice(1));
  return join(dist, pathname.slice(1), 'index.html');
}

test('Phase 6 production output is complete, portable, and internally connected', () => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });

  const routes = ['/', '/about', '/projects', '/projects/spad', '/projects/ros2-robot', '/projects/lerobot', '/cv'];
  const htmlPages = routes.map((route) => [route, readFileSync(outputFor(route), 'utf8')]);

  assert.ok(existsSync(join(dist, 'robots.txt')), 'robots.txt is published');
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), /User-agent:\s*\*[^]*Allow:\s*\//);

  for (const [route, html] of htmlPages) {
    assert.match(html, /<meta name="description" content="[^"\n]{30,}"/, `${route} has a useful description`);
    assert.match(html, /<link rel="canonical" href="https:\/\/personal-website\.huliangwei020311\.workers\.dev\//, `${route} has a canonical URL`);
    assert.match(html, /<meta property="og:description" content="[^"\n]{30,}"/, `${route} has an Open Graph description`);

    for (const href of html.matchAll(/href="(\/[^"#?]*)/g)) {
      assert.ok(existsSync(outputFor(href[1])), `${route} link ${href[1]} resolves in dist`);
    }
  }

  const allHtml = htmlPages.map(([, html]) => html).join('\n');
  for (const legacy of ['Welcome to my personal website.', 'Graduate Student', 'Cloudflare deployment test']) {
    assert.doesNotMatch(allHtml, new RegExp(legacy, 'i'), `legacy copy is absent: ${legacy}`);
  }
  assert.match(htmlPages.find(([route]) => route === '/about')[1], /class="about-hero-visual" role="img" aria-label=/);
  assert.match(htmlPages.find(([route]) => route === '/cv')[1], /href="\/cv\/liangwei-hu-ic-design\.pdf"/);
  assert.match(htmlPages.find(([route]) => route === '/cv')[1], /href="\/cv\/liangwei-hu-embodied-ai\.pdf"/);
  assert.doesNotMatch(allHtml, /href="[^"]*quantum[^"]*\.pdf"/i);

  const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const wrangler = readFileSync(join(root, 'wrangler.jsonc'), 'utf8');
  assert.match(astroConfig, /output:\s*'static'/);
  assert.match(wrangler, /"name":\s*"personal-website"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
  assert.doesNotMatch(wrangler, /main|compatibility_flags/);
});
