import { existsSync } from 'node:fs';

const verifiedModel = new URL('../../public/models/hlw.glb', import.meta.url);

export function getVerifiedModelUrl(): string | undefined {
  return existsSync(verifiedModel) ? '/models/hlw.glb' : undefined;
}
