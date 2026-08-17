import { existsSync } from 'node:fs';

const verifiedPlyModel = new URL('../../public/models/hlw.ply', import.meta.url);
const verifiedGlbModel = new URL('../../public/models/hlw.glb', import.meta.url);

export function getVerifiedModelUrl(): string | undefined {
  if (existsSync(verifiedPlyModel)) return '/models/hlw.ply';
  if (existsSync(verifiedGlbModel)) return '/models/hlw.glb';
  return undefined;
}
