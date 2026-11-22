import { atlas, regions } from '../src/atlas.js';
import { hubs, interests } from '../src/catalog.js';
import { fieldNotes } from '../src/field-notes.js';
import { guideUrl, labModels, labUrl } from '../src/guide-links.js';
import photos from '../src/place-photos.json' with { type: 'json' };

const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const byId = new Map(atlas.map(p=>[p.id,p]));
const anchor = (url,label) => `<a href="${escape(url)}">${escape(label)}</a>`;
const labels = {candidate:'In the planner · check access',appointment:'Local confirmation required',discovery:'Discovery only'};
const layout = ({root,title,description,inner}) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f8f4e9">
<title>${escape(title)} · Fieldday India</title><meta name="description" content="${escape(description)}"><link rel="stylesheet" href="${root}guide.css"></head>
<body><a class="skip" href="#main">Skip to main content</a><header class="bar"><nav class="wrap" aria-label="Main">
${anchor(root,'◈ Fieldday India')}${anchor(`${root}places/`,'Field guides')}${anchor(`${root}#geo-lab`,'3D Lab')}</nav></header>
<main id="main" class="wrap">${inner}</main><footer><div class="wrap">Fieldday India · Always confirm current access before setting out.</div></footer></body></html>`;

export function renderPlace(id) {
  const p = byId.get(id);
  if (!p) return null;
  const [story,look,check] = fieldNotes[id] ?? [];
  const photo = photos[id];
  if (!story || !look || !check || !photo) throw Error(`Field guide is incomplete: ${id}`);
  const root = '../../';
  const related = atlas.filter(x=>x.id!==id).map((x,i)=>[x, (x.state===p.state?5:0)+(x.tags[0]===p.tags[0]?3:0)+x.tags.filter(tag=>p.tags.includes(tag)).length,i])
    .filter(([,score])=>score>0).sort((a,b)=>b[1]-a[1]||a[2]-b[2]).slice(0,3);
  return layout({root,title:p.name,description:story,inner:`
    <nav class="crumb" aria-label="Breadcrumb">${anchor('../','All field guides')} <span aria-hidden="true">/</span> ${escape(p.state)}</nav>
    <header class="lead"><div class="lead-copy"><p class="kicker">${escape(p.area)} · ${escape(p.state)}</p><h1>${escape(p.name)}</h1>${p.te?`<p lang="te">${escape(p.te)}</p>`:''}
    <p class="intro">${escape(p.note)}</p><p class="status">${escape(labels[p.access])}</p>
    <ul class="tags" aria-label="Themes">${p.tags.map(t=>`<li>${escape(interests[t])}</li>`).join('')}</ul></div>
    <figure><img src="${root}place-media/${escape(photo.file)}" alt="${escape(photo.alt)}" width="640" height="400" fetchpriority="high">
    <figcaption>${photo.context?'Context image, not the exact site. ':''}${anchor(photo.source,photo.author)} · ${anchor(photo.licenseUrl,photo.license)} · resized and cropped in display.</figcaption></figure></header>
    <div class="notes"><section><h2>Why it matters</h2><p>${escape(story)}</p></section><section><h2>What to look for</h2><p>${escape(look)}</p></section><section><h2>Before you go</h2><p>${escape(check)}</p></section></div>
    ${labModels.has(id)?`<aside class="callout" aria-label="3D exhibit"><h2>Try the 3D model</h2><p>Rotate the landscape and compare three stages. The model is a simplified teaching aid, not measured terrain.</p>${anchor(root+labUrl(id),'Open this 3D exhibit ↗')}</aside>`:''}
    ${p.hub && p.access!=='discovery'?`<aside class="callout" aria-label="Day planner"><h2>Plan time to visit</h2><p>This stop can be considered in the ${escape(hubs[p.hub])} planner, subject to the limits above.</p>${anchor(`${root}?hub=${encodeURIComponent(p.hub)}#planner`,'Open the day planner ↗')}</aside>`:''}
    <section class="sources"><h2>Sources and further reading</h2><ul>${p.sources.map(([label,url])=>`<li>${anchor(url,label)}</li>`).join('')}</ul></section>
    ${related.length?`<section class="related"><h2>Keep exploring</h2><ul>${related.map(([q])=>`<li>${anchor(`../${encodeURIComponent(q.id)}/`,q.name)}<span>${escape(q.state)}</span></li>`).join('')}</ul></section>`:''}`});
}

export function renderGuideIndex() {
  return layout({root:'../',title:'Heritage field guides',description:'Discover India’s sites with illustrated notes on geology, history and visits.',inner:`
    <nav class="crumb" aria-label="Breadcrumb">${anchor('../#places','India atlas')} <span aria-hidden="true">/</span> Field guides</nav>
    <h1>Heritage field guides</h1><p class="intro">${atlas.length} illustrated guides across ${regions.length} states and union territories. Find out why each place matters, what to look for, and what to check before you visit.</p>
    <p>${anchor('../#places','Search and filter the atlas ↗')}</p>
    <div class="directory">${regions.map(region=>`<section><h2>${escape(region)}</h2><ul>${atlas.filter(p=>p.state===region).map(p=>`<li>${anchor(`../${guideUrl(p.id)}`,p.name)}</li>`).join('')}</ul></section>`).join('')}</div>`});
}

export function fieldGuidePlugin() {
  return {
    name:'fieldday-guides',
    configureServer(server) {
      server.middlewares.use((req,res,next)=>{
        const pathname=new URL(req.url,'http://localhost').pathname;
        const match=/^\/places(?:\/([a-z0-9-]+))?\/?$/.exec(pathname);
        if (!match) return next();
        const html=match[1]?renderPlace(match[1]):renderGuideIndex();
        if (!html) {res.statusCode=404;return res.end('Field guide not found');}
        if(!pathname.endsWith('/')) {res.statusCode=301;res.setHeader('Location',pathname+'/');return res.end();}
        res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);
      });
    },
    generateBundle() {
      this.emitFile({type:'asset',fileName:'places/index.html',source:renderGuideIndex()});
      for(const p of atlas)this.emitFile({type:'asset',fileName:`${guideUrl(p.id)}index.html`,source:renderPlace(p.id)});
      this.info(`Generated ${atlas.length} place guides and 1 guide directory`);
    },
  };
}
