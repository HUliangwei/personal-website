import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import test, { before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');

function filesUnder(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

function routeSet() {
  return filesUnder(dist)
    .filter((file) => file === join(dist, 'index.html') || file.endsWith(`${sep}index.html`))
    .map((file) => {
      const path = relative(dist, file).split(sep).join('/').replace(/(?:^|\/)index\.html$/, '');
      return path ? `/${path}` : '/';
    })
    .sort();
}

function page(route) {
  return readFileSync(join(dist, route.replace(/^\//, ''), 'index.html'), 'utf8');
}

before(() => {
  execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
  });
});

test('V5 programming collection generates cards and detail pages from showcase markdown', () => {
  assert.deepEqual(routeSet(), [
    '/',
    '/about',
    '/cv',
    '/en',
    '/en/about',
    '/en/cv',
    '/en/projects',
    '/en/projects/programming/personal-website',
    '/en/projects/programming/robot',
    '/en/projects/programming/videoto3d',
    '/projects',
    '/projects/programming/personal-website',
    '/projects/programming/robot',
    '/projects/programming/videoto3d',
  ]);

  const zh = page('/projects');
  const en = page('/en/projects');

  for (const html of [zh, en]) {
    assert.match(html, /data-programming-collection/);
    assert.match(html, /data-programming-project="personal-website"/);
    assert.match(html, /data-programming-project="robot"/);
    assert.match(html, /data-programming-project="videoto3d"/);
    assert.match(html, /https:\/\/github\.com\/HUliangwei\/personal-website/);
    assert.match(html, /https:\/\/github\.com\/HUliangwei\/Videoto3D/);
    assert.match(html, /https:\/\/github\.com\/HUliangwei\/robot/);
  }

  assert.match(zh, /href="\/projects\/programming\/personal-website"/);
  assert.match(zh, /href="\/projects\/programming\/robot"/);
  assert.match(zh, /href="\/projects\/programming\/videoto3d"/);
  assert.match(en, /href="\/en\/projects\/programming\/personal-website"/);
  assert.match(en, /href="\/en\/projects\/programming\/robot"/);
  assert.match(en, /href="\/en\/projects\/programming\/videoto3d"/);
  assert.match(zh, />已完成</);
  assert.match(en, />Completed</);
});

test('V5 programming detail pages render frontmatter and markdown body', () => {
  const zhVideoto3d = page('/projects/programming/videoto3d');
  const enVideoto3d = page('/en/projects/programming/videoto3d');
  const zhWebsite = page('/projects/programming/personal-website');

  assert.match(zhVideoto3d, /<h1[^>]*>Videoto3D<\/h1>/);
  assert.match(zhVideoto3d, /<h2[^>]*>项目简介<\/h2>/);
  assert.match(zhVideoto3d, /https:\/\/github\.com\/HUliangwei\/Videoto3D/);
  assert.match(zhVideoto3d, />已完成</);
  assert.match(zhVideoto3d, /href="\/projects"/);

  assert.match(enVideoto3d, /<h1[^>]*>Videoto3D<\/h1>/);
  assert.match(enVideoto3d, /<h2[^>]*>Overview<\/h2>/);
  assert.match(enVideoto3d, />Completed</);
  assert.match(enVideoto3d, /href="\/en\/projects"/);

  assert.match(zhWebsite, /<h1[^>]*>个人网站<\/h1>/);
  assert.match(zhWebsite, /<h2[^>]*>项目简介<\/h2>/);
  assert.match(zhWebsite, /https:\/\/github\.com\/HUliangwei\/personal-website/);

  const zhRobot = page('/projects/programming/robot');
  const enRobot = page('/en/projects/programming/robot');
  assert.match(zhRobot, /<h1[^>]*>Robot · 具身智能学习<\/h1>/);
  assert.match(zhRobot, /<h2[^>]*>项目简介<\/h2>/);
  assert.match(zhRobot, /https:\/\/github\.com\/HUliangwei\/robot/);
  assert.match(zhRobot, />持续迭代</);
  assert.match(zhRobot, /href="\/projects"/);
  assert.match(enRobot, /<h1[^>]*>Robot · Embodied AI Learning<\/h1>/);
  assert.match(enRobot, /<h2[^>]*>Overview<\/h2>/);
  assert.match(enRobot, />Actively Iterated</);
  assert.match(enRobot, /href="\/en\/projects"/);
});

test('V5 Home uses Spark for PLY and bounds-based GLB framing', () => {
  const gate = readFileSync(join(root, 'src/utils/model.ts'), 'utf8');
  const scene = readFileSync(join(root, 'src/scripts/home-scene.ts'), 'utf8');
  const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const lockfile = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));

  assert.match(gate, /hlw\.ply/);
  assert.match(gate, /hlw\.glb/);
  assert.ok(gate.indexOf('hlw.ply') < gate.indexOf('hlw.glb'));

  assert.equal(packageJson.dependencies?.['@sparkjsdev/spark'], '2.1.0');
  assert.equal(lockfile.packages?.['']?.dependencies?.['@sparkjsdev/spark'], '2.1.0');

  assert.match(scene, /import\('@sparkjsdev\/spark'\)/);
  assert.match(scene, /new SparkRenderer\(\{\s*renderer\s*\}\)/);
  assert.match(scene, /new SplatMesh\(\{/);
  assert.match(scene, /getBoundingBox\(true\)/);

  assert.match(scene, /GLTFLoader/);
  assert.match(scene, /new THREE\.Box3\(\)\.setFromObject\(model\.scene\)/);
  assert.match(scene, /viewDirection:\s*new THREE\.Vector3\(0,\s*0,\s*1\)/);
  assert.match(scene, /viewDirection:\s*new THREE\.Vector3\(0\.8,\s*0\.5,\s*1\)/);

  // Owner-requested PLY orientation: 180° up-down and 180° left-right,
  // applied before the bounds-based camera framing.
  assert.match(scene, /loadedMesh\.rotation\.x = Math\.PI/);
  assert.match(scene, /loadedMesh\.rotation\.y = Math\.PI/);
  assert.match(scene, /applyMatrix4\(loadedMesh\.matrixWorld\)/);

  assert.doesNotMatch(scene, /PLYLoader/);
  assert.doesNotMatch(scene, /THREE\.ShaderMaterial/);
  assert.doesNotMatch(scene, /geometry\.rotateX\(Math\.PI\)/);
  assert.doesNotMatch(scene, /model\.scene\.scale\.setScalar\(1\.1\)/);
  assert.doesNotMatch(scene, /model\.scene\.position\.set\(0,\s*-0\.35,\s*0\)/);

  assert.equal(existsSync(join(root, 'src/pages/programming.astro')), false);
  assert.equal(existsSync(join(root, 'src/pages/en/programming.astro')), false);
});
