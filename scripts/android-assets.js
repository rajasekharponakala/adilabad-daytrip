import {access,cp,mkdir,readFile,rm,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {atlas} from '../src/atlas.js';
import {entries} from '../src/layer-records.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist'), out=path.join(root,'android/app/build/generated/fielddayAssets');
await access(path.join(dist,'layers/index.html'));
await rm(out,{recursive:true,force:true}); await mkdir(out,{recursive:true}); await cp(dist,out,{recursive:true});
for(const f of ['device.css','device.js']) await copyFile(path.join(root,'android/mobile',f),path.join(out,f));
const inject=(text,addition)=>text.replace('</head>',`${addition}</head>`);
const file=path.join(out,'index.html');
await writeFile(file,inject(await readFile(file,'utf8'),'<link rel="stylesheet" href="device.css"><script src="device.js"></script>'));
for(const p of [...atlas.map(p=>`places/${p.id}/index.html`),'places/index.html','layers/index.html',...new Set(entries.map(e=>`layers/${e.layer}/index.html`))]) {
  const filename=path.join(out,p),prefix='../'.repeat(p.split('/').length-1);
  await writeFile(filename,inject(await readFile(filename,'utf8'),`<link rel="stylesheet" href="${prefix}device.css"><meta name="fieldday-document" content="detail">`));
}
console.log(`Packaged ${atlas.length} guides and ${entries.length} notes in the offline Android bundle.`);
