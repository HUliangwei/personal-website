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

function buildSite() {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

test('Phase 6 production output is complete, portable, and internally connected', () => {
  buildSite();

  const routes = ['/', '/about', '/projects', '/cv', '/en', '/en/about', '/en/projects', '/en/cv'];
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
  for (const legacy of ['Welcome to my personal website.', 'Cloudflare deployment test']) {
    assert.doesNotMatch(allHtml, new RegExp(legacy, 'i'), `legacy copy is absent: ${legacy}`);
  }
  assert.match(htmlPages.find(([route]) => route === '/about')[1], /class="about-hero-visual" role="img" aria-label=/);
  const zhCv = htmlPages.find(([route]) => route === '/cv')[1];
  const enCv = htmlPages.find(([route]) => route === '/en/cv')[1];
  assert.match(zhCv, /href="\/cv\/liangwei-hu-ic-design-zh\.pdf"/);
  assert.match(zhCv, /href="\/cv\/liangwei-hu-embodied-ai-zh\.pdf"/);
  assert.match(enCv, /href="\/cv\/liangwei-hu-ic-design-en\.pdf"/);
  assert.match(enCv, /href="\/cv\/liangwei-hu-embodied-ai-en\.pdf"/);
  assert.doesNotMatch(allHtml, /href="[^"]*quantum[^"]*\.pdf"/i);

  const astroConfig = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  const wrangler = readFileSync(join(root, 'wrangler.jsonc'), 'utf8');
  assert.match(astroConfig, /output:\s*'static'/);
  assert.match(wrangler, /"name":\s*"personal-website"/);
  assert.match(wrangler, /"directory":\s*"\.\/dist"/);
  assert.doesNotMatch(wrangler, /main|compatibility_flags/);
});

test('project cards remain non-interactive overview articles', () => {
  const component = readFileSync(join(root, 'src/components/projects/ProjectCard.astro'), 'utf8');
  const styles = readFileSync(join(root, 'src/styles/global.css'), 'utf8');

  assert.match(component, /<article class="project-card"/);
  assert.match(component, /<ul class="project-highlights"/);
  assert.doesNotMatch(component, /localizedPath|projectHref|project-card-link|<a /);
  assert.doesNotMatch(styles, /\.project-filter|\.project-card:hover/);
});

test('final content semantics and truthful fallbacks are present', () => {
  buildSite();

  const home = readFileSync(join(root, 'dist', 'en', 'index.html'), 'utf8');
  const projects = readFileSync(join(root, 'dist', 'en', 'projects', 'index.html'), 'utf8');

  assert.match(projects, /<h2[^>]*>Vision-Guided Mobile Robot<\/h2>/);
  assert.match(home, /<h3[^>]*>Vision-Guided Mobile Robot<\/h3>/);
  assert.match(projects, /Learning Topics[\s\S]*?<li>LIBERO<\/li>/);
  assert.doesNotMatch(projects, /href="\/en\/projects\/(?!programming\/)/);
  assert.match(home, /href="\/en\/cv"[^>]*>CV<\/a>/);
  assert.match(home, /href="mailto:3036064607@qq\.com"/);

  assert.equal(existsSync(join(root, 'src/layouts/ProjectLayout.astro')), false);
});
