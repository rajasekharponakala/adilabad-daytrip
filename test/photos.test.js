import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { atlas } from '../src/atlas.js';
import photos from '../src/place-photos.json' with { type: 'json' };

test('every atlas place has local WebP imagery, useful alt text and licensing credits', () => {
  assert.deepEqual(new Set(Object.keys(photos)),new Set(atlas.map(p=>p.id)));
  for (const [id,p] of Object.entries(photos)) {
    assert.match(p.file,/^[\w-]+\.webp$/,id);
    assert.ok(p.alt?.trim().length >= 12 && p.author?.trim() && p.license?.trim(),id);
    assert.equal(new URL(p.source).protocol,'https:',id);
    assert.equal(new URL(p.licenseUrl).protocol,'https:',id);
    const bytes = readFileSync(new URL(`../public/place-media/${p.file}`,import.meta.url));
    assert.equal(bytes.toString('ascii',8,12),'WEBP',id);
    assert.ok(bytes.length <= 200_000,`${id}: ${bytes.length} bytes`);
  }
});
