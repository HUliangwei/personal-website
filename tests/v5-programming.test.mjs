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

test('V5 keeps Personal Website and Videoto3D inside one expandable programming collection', () => {
  assert.deepEqual(routeSet(), ['/', '/about', '/cv', '/en', '/en/about', '/en/cv', '/en/projects', '/projects']);

  const zh = page('/projects');
  const en = page('/en/projects');

  assert.match(zh, />已完成</);
  assert.match(en, />Completed</);

  for (const html of [zh, en]) {
    assert.match(html, /data-programming-collection/);
    assert.match(html, /data-programming-project="personal-website"/);
    assert.match(html, /data-programming-project="videoto3d"/);
    assert.match(html, /https:\/\/github\.com\/HUliangwei\/personal-website/);
    assert.match(html, /https:\/\/github\.com\/HUliangwei\/Videoto3D/);
    assert.doesNotMatch(html, /href="(?:\/en)?\/projects\/[^"]+"/);
  }
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

  assert.doesNotMatch(scene, /PLYLoader/);
  assert.doesNotMatch(scene, /THREE\.ShaderMaterial/);
  assert.doesNotMatch(scene, /geometry\.rotateX\(Math\.PI\)/);
  assert.doesNotMatch(scene, /model\.scene\.scale\.setScalar\(1\.1\)/);
  assert.doesNotMatch(scene, /model\.scene\.position\.set\(0,\s*-0\.35,\s*0\)/);

  assert.equal(existsSync(join(root, 'src/pages/programming.astro')), false);
  assert.equal(existsSync(join(root, 'src/pages/en/programming.astro')), false);
});
