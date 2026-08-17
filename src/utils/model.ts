import { existsSync } from 'node:fs';
import { join } from 'node:path';

const publicModelPath = (name: string) => join(process.cwd(), 'public', 'models', name);

export function getVerifiedModelUrl(): string | undefined {
  if (existsSync(publicModelPath('hlw.ply'))) return '/models/hlw.ply';
  if (existsSync(publicModelPath('hlw.glb'))) return '/models/hlw.glb';
  return undefined;
}
