import './geo-lab.css';
import { exhibits } from './geo-lab-models.js';

const ids = Object.keys(exhibits), deg = Math.PI/180;
let serial = 0;
const clamp = (v, low, high) => Math.max(low, Math.min(v, high));

// Orthographic projection and a software depth buffer keep the lake behind
// its rim and the rear columns hidden, even at very shallow viewing angles.
function paint(canvas, ctx, faces, yaw, tilt, buffers) {
  const box = canvas.getBoundingClientRect();
  if (!box.width || !box.height || !ctx) return;
  const ratio = Math.min(devicePixelRatio || 1, 1.6, 850 / box.width, 540 / box.height);
  const w = Math.max(1,Math.round(box.width*ratio)), h = Math.max(1,Math.round(box.height*ratio));
  if (!buffers.frame || canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
    buffers.frame = ctx.createImageData(w,h); buffers.depth = new Float32Array(w*h);
  }
  const {frame,depth} = buffers; frame.data.fill(0); depth.fill(-Infinity);
  const sy=Math.sin(yaw*deg), cy=Math.cos(yaw*deg), st=Math.sin(tilt*deg), ct=Math.cos(tilt*deg);
  const scale=Math.min(w/3.82,h/3.5);
  function project([x,y,z]) {
    const along = -sy*x+cy*y;
    return [w*.5+scale*(x*cy+y*sy),h*.51-scale*(along*st+z*ct),-along*ct+z*st];
  }
  for(const {p,rgb} of faces) {
    const [a,b,c]=p.map(project), bx=b[0]-a[0], by=b[1]-a[1], cx=c[0]-a[0], cY=c[1]-a[1];
    const det=bx*cY-by*cx;
    if(Math.abs(det)<.001) continue;
    const left=Math.max(0,Math.ceil(Math.min(a[0],b[0],c[0])-.5)), right=Math.min(w-1,Math.floor(Math.max(a[0],b[0],c[0])-.5));
    const top=Math.max(0,Math.ceil(Math.min(a[1],b[1],c[1])-.5)), bottom=Math.min(h-1,Math.floor(Math.max(a[1],b[1],c[1])-.5));
    const du=cY/det,dv=-by/det, dz1=b[2]-a[2],dz2=c[2]-a[2];
    for(let y=top;y<=bottom;y++) {
      let u=((left+.5-a[0])*cY-(y+.5-a[1])*cx)/det, v=(bx*(y+.5-a[1])-by*(left+.5-a[0]))/det;
      for(let x=left;x<=right;x++,u+=du,v+=dv) {
        if(u<-.00001 || v<-.00001 || u+v>1.00001) continue;
        const d=a[2]+dz1*u+dz2*v, i=y*w+x;
        if(d<=depth[i]) continue;
        depth[i]=d; const k=i*4, grain=((x*23^y*31^x*y)&7)-3;
        frame.data[k]=rgb[0]+grain; frame.data[k+1]=rgb[1]+grain; frame.data[k+2]=rgb[2]+grain; frame.data[k+3]=255;
      }
    }
  }
  ctx.putImageData(frame,0,0);
}

export function mountGeoLab(container, initialModel='lonar') {
  const base=`fd-geo-${++serial}`, root=document.createElement('div'); root.className='fd-geo';
  root.innerHTML=`<div class="fdg-choices" role="group" aria-label="Choose a geology exhibit">${ids.map((id,i)=>`<button type="button" data-geo-model="${id}"><span aria-hidden="true">0${i+1}</span>${exhibits[id].name}</button>`).join('')}</div>
    <div class="fdg-layout"><div class="fdg-plate"><div class="fdg-frame">
      <div class="fdg-platehead" aria-hidden="true"><span data-part="plate"></span><span>3D STUDY</span></div>
      <canvas tabindex="0" role="img" aria-describedby="${base}-note ${base}-help">The selected stage is described in the field note.</canvas>
      <div class="fdg-platefoot" aria-hidden="true"><span>SCHEMATIC · NOT TO SCALE</span><span data-part="angle"></span></div></div>
      <div class="fdg-controls" role="group" aria-label="Adjust model view">${[['left','←','Rotate left'],['right','→','Rotate right'],['up','↑','Tilt up'],['down','↓','Tilt down'],['reset','↺','Reset view']].map(([id,s,label])=>`<button type="button" data-geo-view="${id}" aria-label="${label}" title="${label}"><span aria-hidden="true">${s}</span>${id==='reset'?' Reset':''}</button>`).join('')}</div>
      <p class="fdg-help" id="${base}-help">Drag to turn, or focus the model and use the arrow keys. Home resets the view.</p></div>
      <div class="fdg-notes"><p class="fdg-tag" data-part="place"></p><h3 data-part="name"></h3><p class="fdg-process" data-part="process"></p>
      <p class="fdg-label">Explore the formation</p><div class="fdg-stages" role="group" aria-label="Formation stage">${[0,1,2].map(i=>`<button type="button" data-geo-stage="${i+1}"><span aria-hidden="true">0${i+1}</span><b></b></button>`).join('')}</div>
      <div class="fdg-note" aria-live="polite" aria-atomic="true"><strong data-part="stage"></strong><p id="${base}-note" data-part="note"></p></div></div></div>`;
  container.replaceChildren(root);
  const part=name=>root.querySelector(`[data-part="${name}"]`), canvas=root.querySelector('canvas'), ctx=canvas.getContext('2d');
  const buffers={}, stages=Array.from(root.querySelectorAll('[data-geo-stage]'));
  let model, stage, mesh, yaw, tilt, raf=0, pointer=null, dead=false;
  function render() {
    if(dead) return;
    part('angle').textContent=`TILT ${Math.round(tilt)}°`;
    if(!raf) raf=requestAnimationFrame(()=>{raf=0;paint(canvas,ctx,mesh,yaw,tilt,buffers);});
  }
  function changeStage(i) {
    stage=i; const item=exhibits[model], [title,description]=item.stages[i];mesh=item.mesh(i);
    stages.forEach((b,j)=>{b.setAttribute('aria-pressed',j===i);b.querySelector('b').textContent=item.stages[j][0];});
    part('stage').textContent=`Stage ${i+1} · ${title}`;part('note').textContent=description;
    canvas.setAttribute('aria-label',`3D model of ${item.name}: ${title}`);render();
  }
  function reset() {
    yaw=({meghalayan:18,varkala:-48,majuli:12,dholavira:-25})[model]??31;
    tilt=({lonar:39,meghalayan:17,majuli:53,dholavira:42})[model]??26;
  }
  function select(id) {
    if(dead) return;
    model=ids.includes(id)?id:'lonar';const item=exhibits[model];reset();
    root.querySelectorAll('[data-geo-model]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.geoModel===model));
    part('plate').textContent=`FIG. 0${ids.indexOf(model)+1} / LANDSCAPE`;part('place').textContent=item.place;
    part('name').textContent=item.name;part('process').textContent=item.process;changeStage(2);
  }
  function move(view) {
    if(view==='reset') reset();
    else {yaw=(yaw+({left:-15,right:15}[view]||0))%360;tilt=clamp(tilt+({up:10,down:-10}[view]||0),6,84);}
    render();
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.geoModel) select(b.dataset.geoModel);
    else if(b.dataset.geoStage) changeStage(Number(b.dataset.geoStage)-1);
    else if(b.dataset.geoView) move(b.dataset.geoView);
  });
  canvas.addEventListener('keydown',e=>{
    const view={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',Home:'reset'}[e.key];
    if(view&&!e.metaKey&&!e.altKey&&!e.ctrlKey){e.preventDefault();move(view);}
  });
  canvas.addEventListener('pointerdown',e=>{
    if(e.button!==0 || pointer) return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove',e=>{
    if(e.pointerId!==pointer?.id) return;
    yaw=(yaw+(e.clientX-pointer.x)*.55)%360;tilt=clamp(tilt+(e.clientY-pointer.y)*.38,6,84);
    pointer.x=e.clientX;pointer.y=e.clientY;render();
  });
  canvas.addEventListener('lostpointercapture',()=>{pointer=null;});
  const observer=new ResizeObserver(render);observer.observe(canvas);select(initialModel);
  return {select,destroy(){dead=true;observer.disconnect();cancelAnimationFrame(raf);root.remove();}};
}
