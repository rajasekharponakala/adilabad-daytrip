import { newExhibits } from './geo-lab-expansion.js';

// Small deterministic triangle meshes. Coordinates are east, north, up;
// heights and colours are exaggerated for legibility, not survey measurements.
const tau = 2 * Math.PI;
const noise = n => { const a = Math.sin(n * 78.233 + 1.31) * 43758.54; return a - Math.floor(a); };
const hex = s => [0, 2, 4].map(i => parseInt(s.slice(i,i+2), 16));

function sculpture() {
  const faces = [];
  function triangle(a,b,c,colour,tone=1) {
    const u = b.map((v,i) => v-a[i]), v = c.map((n,i) => n-a[i]);
    const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
    const k = Math.hypot(...n) || 1;
    const light = .77 + .32 * (-.53*n[0]+.31*n[1]+.78*n[2])/k;
    faces.push({p:[a,b,c], rgb:hex(colour).map(v=>v*light*tone)});
  }
  function band(a,b,col,variation=.035) {
    for(let i=0;i<a.length;i++) {
      const j=(i+1)%a.length, t=1+(noise(i+faces.length)-.5)*variation;
      triangle(a[i],a[j],b[j],col,t); triangle(a[i],b[j],b[i],col,t);
    }
  }
  function lid(r,c,col) {r.forEach((p,i)=>triangle(c,p,r[(i+1)%r.length],col));}
  return {faces,triangle,band,lid};
}

function lonar(stage) {
  const m=sculpture(), count=72;
  function ring(radius,z,jitter=0) {
    return Array.from({length:count},(_,i)=>{
      const a=tau*i/count, edge=1+.047*Math.sin(3*a)+.029*Math.cos(5*a)+.019*noise(i);
      return [radius*edge*Math.cos(a),radius*edge*Math.sin(a),z+jitter*(noise(i+8)-.4)];
    });
  }
  // Exposed outer edge of the sample: pre-existing flood-basalt flows.
  const levels=[[-.64,'484e4c'],[-.53,'a67b5d'],[-.50,'626b63'],[-.36,'976950'],[-.32,'5b6764'],[-.18,'ad8562'],[-.14,'727969'],[0,'737764']];
  let edge=ring(1.41,levels[0][0]);
  for(const [height,col] of levels.slice(1)) {const r=ring(1.41,height,.027);m.band(edge,r,col);edge=r;}
  const belts=stage===0 ? [[1.08,.018,'a8a06e'],[.78,.012,'a59b70'],[.36,.025,'9a986a']] : stage===1 ? [[1.18,.06,'c4a173'],[.98,.14,'caa16b'],[.84,.36,'b58b68'],[.71,.16,'ad7a55'],[.53,-.11,'9e7156'],[.32,-.39,'976e52'],[.15,-.53,'866650']] : [[1.21,.05,'929664'],[1.03,.14,'9da26b'],[.89,.26,'9a9a60'],[.81,.22,'ada16a'],[.73,.1,'849056'],[.62,-.09,'788355'],[.51,-.24,'9c956a'],[.48,-.268,'b8a673'],[.447,-.268,'66aea0'],[.35,-.268,'589e92'],[.21,-.268,'4b9388']];
  for(const [radius,z,col] of belts) {
    const r=ring(radius,z,stage===2 && radius<=.48 ? 0 : .055);
    m.band(edge,r,col,.09);edge=r;
  }
  m.lid(edge,[0,0,belts.at(-1)[1]], ['a39a6c','82604a','4b9388'][stage]);
  return m.faces;
}

function deccan(stage) {
  const m=sculpture(), count=56;
  function rim(r,z,level) {return Array.from({length:count},(_,i)=>{
    const a=tau*i/count;
    const undulation=1+.10*Math.cos(3*a+.2)+.09*Math.sin(2*a)+.04*Math.cos(6*a)+.03*noise(i);
    return [r*undulation*Math.cos(a)+level*.025,r*.86*undulation*Math.sin(a),z+.025*Math.sin(2*a)+.022*noise(i)];
  });}
  let r=rim(1.43,-.64,0);
  let next=rim(1.43,-.48,0);m.band(r,next,'9b886a');r=next;
  const n=[1,5,5][stage];
  for(let i=0;i<n;i++) {
    const top=-.48+(i+1)*.235, radius=1.42-i*(stage===2?.166:.048);
    next=rim(radius,top-.235,i);m.band(r,next,'929060');r=next;
    for(const [dz,colour] of [[-.205,'ad805b'],[-.15,'737b74'],[-.048,'626e68'],[0,'96916d']]) {
      next=rim(radius+(dz===-.15?.012:0),top+dz,i);m.band(r,next,colour,.12);r=next;
    }
  }
  const lava=stage<2;
  for(const [factor,col] of [[.89,lava?'985b42':'afb378'],[.79,lava?'d8804c':'a4a96a'],[.67,lava?'eea05e':'b0af79'],[.52,lava?'d77746':'9fa56f'],[.41,lava?'e99151':'a5ac76']]) {
    next=rim(factor*(1.42-(n-1)*(stage===2?.166:.048)),-.48+n*.235+.008,n-1);m.band(r,next,col,.06);r=next;
  }
  m.lid(r,[(n-1)*.025,0,-.48+n*.235+.024],lava?'d77845':'aeb47e');return m.faces;
}

function columns(stage) {
  const m=sculpture(), size=.238;
  for(let q=-3;q<=3;q++) for(let r=-3;r<=3;r++) {
    if(Math.abs(q+r)>3 || ((q===-3||q===3)&&r===0)) continue;
    const x=size*Math.sqrt(3)*(q+r/2), y=size*1.5*r;
    const dist=Math.hypot(x,y), j=noise(27+q*9+r);
    const z=stage===0?.64:stage===2?.96-.55*dist+.29*j+.16*y:.64-.04*dist+.013*j;
    const width=[1,.956,.93][stage];
    function rim(height,w) {return Array.from({length:6},(_,k)=>{
      const a=tau*(k+.5)/6;return [x+size*w*Math.cos(a),y+size*w*Math.sin(a),height];
    });}
    let base=rim(-.59,1);
    if(stage===0) {const b=rim(z,1);m.band(base,b,'b87a5d',0);m.lid(b,[x,y,z],'cb8b67');continue;}
    for(const [h,w,col] of [[-.39,1,'716d62'],[stage===0?z-.085:stage===1?z-.3:-.23,1,stage===2?'8b8174':'c18967'],[z-.08,width,stage===0?'bc795d':'959489'],[z-.017,width,'a3a095'],[z,width*.975,stage===0?'b88060':'b9b2a0']]) {
      const b=rim(h,w);m.band(base,b,col,.095);base=b;
    }
    m.lid(base,[x,y,z+.003],stage===0?'cb8b67':j>.48?'c0bca8':'b4b1a1');
  }return m.faces;
}

export const exhibits = {
  lonar:{name:'Lonar Crater',place:'Maharashtra',process:'Meteorite impact',mesh:lonar,
    stages:[['Before impact','A nearly level basalt plain stretches across the sample. The bands along its edge are older lava flows, already solid before the meteorite arrived.'],['Excavation','The impact drove a shock through the basalt and threw rock outwards. Follow the raised rim around the deep, empty bowl.'],['Crater lake','Water collected in the depression. Tilt the model towards the horizon: the green-blue lake sits below the rim, not on top of a volcanic cone.']]},
  deccan:{name:'Deccan Traps',place:'Western India',process:'Flood-basalt eruptions',mesh:deccan,
    stages:[['First flow','A sheet of lava spreads over the older ground. Orange marks the hot surface; beneath it, the cooling flow becomes a solid basalt layer.'],['Flow upon flow','Later eruptions cover the cooled rock with fresh lava. View the edge to count five flow units in this sample; the real province contains many more.'],['Eroded steps','As rock wears away, harder basalt forms ledges above gentler slopes. Compare this outline with the broad stack in stage two: erosion reveals the steps.']]},
  'st-marys':{name:'St Mary’s Islands',place:'Karnataka',process:'Cooling and contraction',mesh:columns,
    stages:[['Hot rock','Start with a continuous mass of hot volcanic rock. Its broad upper surface marks where heat can escape to the surroundings.'],['Cooling cracks','Cooling rock contracts. Cracks meet to form polygons at the surface and grow inwards as the cooling front advances. Look down to see the network.'],['Exposed columns','Erosion exposes the sides of the polygonal columns and removes pieces of different heights. Look sideways to trace vertical joints; from above, those same joints bound each polygon.']]},
  ...newExhibits,
};
