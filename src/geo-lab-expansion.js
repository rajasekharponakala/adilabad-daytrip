// Teaching models, not surveys: x and y are horizontal and z is height.
function model() {
  const faces = [];
  function tri(a,b,c,color) {
    const u=b.map((x,i)=>x-a[i]), v=c.map((x,i)=>x-a[i]);
    const normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const length=Math.hypot(...normal);
    if(length<1e-9) return;
    const light=.79+.21*(-.4*normal[0]+.45*normal[1]+.80*normal[2])/length;
    faces.push({p:[a,b,c],rgb:[0,2,4].map(i=>Math.round(parseInt(color.slice(i,i+2),16)*light))});
  }
  const quad=(a,b,c,d,color)=>{tri(a,b,c,color);tri(a,c,d,color);};
  function box(x0,x1,y0,y1,z0,z1,color) {
    const a=[x0,y0,z0],b=[x1,y0,z0],c=[x1,y1,z0],d=[x0,y1,z0];
    const A=[x0,y0,z1],B=[x1,y0,z1],C=[x1,y1,z1],D=[x0,y1,z1];
    quad(A,B,C,D,color); quad(a,b,B,A,color); quad(b,c,C,B,color); quad(c,d,D,C,color); quad(d,a,A,D,color);
  }
  return {faces,tri,quad,box};
}

function coast(stage) {
  const m=model(), levels=[[-.67,'8a6a4e'],[-.39,'dcb784'],[-.13,'665149'],[.04,'c79a6e'],[.28,'e4bb91'],[.47,'a55436'],[.62,'a96546']];
  const sea=stage===0?-.57:-.43;
  function cliff(y,k) {
    const base=.38+.10*Math.sin(y*4)+.055*Math.sin(y*11);
    if(stage===0) return base+.24-.05*k;
    if(stage===1) return base-(k===1||k===2?.26:0);
    return base-.33+.08*Math.sin(7*y+k*.25)+.05*(4-k);
  }
  m.box(-1.47,1.55,-1.12,1.12,-.72,sea,'62a9a4');
  for(let j=0;j<32;j++) {
    const y=j/16-1,y1=(j+1)/16-1;
    const p=(k,t)=>[cliff(t,k),t,levels[k][0]];
    for(let k=0;k<levels.length-1;k++) {
      const z=levels[k][0], Z=levels[k+1][0], col=levels[k+1][1];
      m.quad(p(k,y),p(k,y1),p(k+1,y1),p(k+1,y),col);
      if(j===0) m.quad([-1.34,y,z],p(k,y),p(k+1,y),[-1.34,y,Z],col);
      if(j===31) m.quad(p(k,y1),[-1.34,y1,z],[-1.34,y1,Z],p(k+1,y1),col);
      m.quad([-1.34,y1,z],[-1.34,y,z],[-1.34,y,Z],[-1.34,y1,Z],col);
    }
    const k=levels.length-1;
    m.quad([-1.34,y,levels[k][0]],p(k,y),p(k,y1),[-1.34,y1,levels[k][0]],'87934f');
    if(stage===2 && j%3===0) {const x=cliff(y,2)+.20; m.box(x,x+.16,y,y+.09,sea,sea+.08,'ad7954');}
    if(j%4===0) {const x=.77+.13*Math.sin(y*4);m.quad([x,y,sea+.002],[x+.026,y,sea+.002],[x+.05,y1,sea+.002],[x+.02,y1,sea+.002],'c9e0cc');}
  }
  return m.faces;
}

function caves(stage) {
  const m=model(), strata=[[-.65,-.36,'a1997c'],[-.36,-.12,'c8b999'],[-.12,.14,'b2a381'],[.14,.38,'ded0ad'],[.38,.62,'b6a381']];
  // Leave the near face open. Mesh rings connect an arched chamber to the outside cutaway.
  const angle=i=>Math.PI*2*i/48;
  const tunnel=(a,y)=>{
    const width=[.045,.47,.72][stage]*(.94+.10*Math.cos(y*3)), height=[.18,.37,.46][stage];
    return [Math.cos(a)*width+.04*Math.sin(y*4),y,-.16+Math.sin(a)*height];
  };
  function stone(z) {return (strata.find(([,hi])=>z<=hi)??strata.at(-1))[2];}
  for(let k=0;k<48;k++) {
    const a=angle(k), b=angle(k+1);
    function rim(t,y) {const c=Math.cos(t),s=Math.sin(t), d=Math.min(1.27/Math.max(Math.abs(c),.0001),(s>0?.78:.49)/Math.max(Math.abs(s),.0001));return [c*d,y,-.16+s*d];}
    const p=tunnel(a,-1.06),q=tunnel(b,-1.06);
    m.quad(rim(a,-1.06),rim(b,-1.06),q,p,stone((p[2]+q[2]+rim(a,-1.06)[2]+rim(b,-1.06)[2])/4));
    for(let i=0;i<14;i++) {
      const y=-1.06+i*.154,y1=y+.154;
      m.quad(tunnel(b,y),tunnel(a,y),tunnel(a,y1),tunnel(b,y1),'9a8769');
    }
    m.tri(tunnel(a,1.096),tunnel(b,1.096),[0,1.096,-.16],'8b795c');
  }
  for(const [lo,hi,color] of strata) {
    m.quad([-1.27,1.096,lo],[-1.27,-1.06,lo],[-1.27,-1.06,hi],[-1.27,1.096,hi],color);
    m.quad([1.27,-1.06,lo],[1.27,1.096,lo],[1.27,1.096,hi],[1.27,-1.06,hi],color);
  }
  m.quad([-1.27,-1.06,.62],[1.27,-1.06,.62],[1.27,1.096,.62],[-1.27,1.096,.62],'889369');
  m.quad([-.035,-1.07,.60],[.035,-1.07,.60],[.022,-1.07,tunnel(Math.PI/2,-1.06)[2]],[-.021,-1.07,tunnel(Math.PI/2,-1.06)[2]],'69b2ab');
  if(stage===2) for(const [x,y,r,size] of [[-.27,-.7,.069,.28],[.23,-.34,.10,.43],[.04,.12,.109,.36],[-.31,.32,.071,.33]]) {
    const top=-.16+.45*Math.sqrt(1-(x/.68)**2),floor=-.16-.45*Math.sqrt(1-(x/.68)**2);
    for(let i=0;i<10;i++) for(const [z,d] of [[top,-size],[floor,size*.62]]) {
      const a=2*Math.PI*i/10,b=a+2*Math.PI/10;
      m.tri([x+r*Math.cos(a),y+r*Math.sin(a),z],[x+r*Math.cos(b),y+r*Math.sin(b),z],[x,y,z+d],'f2dfae');
    }
  }
  return m.faces;
}

function river(stage) {
  const m=model();
  m.box(-1.56,1.56,-1.16,1.16,-.49,-.13,'6ba6ab');
  const bar=(x,y,rx,ry,h,green,seed)=>{
    const n=48, ring=(i,s,z)=>{const a=i*2*Math.PI/n,d=1+.12*Math.sin(3*a+seed)+.045*Math.sin(11*a);return [x+rx*s*d*Math.cos(a),y+ry*s*d*Math.sin(a),z];};
    for(let i=0;i<n;i++) {
      m.quad(ring(i,1.03,-.138),ring(i+1,1.03,-.138),ring(i+1,.78,h),ring(i,.78,h),'d6b686');
      m.tri(ring(i,.78,h),ring(i+1,.78,h),[x,y,h+.045],green?'84975c':'e3c793');
    }
  };
  bar(-.22,.02,[.43,.99,.82][stage],[.19,.40,.33][stage],stage===0?-.099:.035,stage>0,2);
  bar(.42,stage===2?.59:.56,stage===2?.63:.36,.125,-.099,false,3);
  bar(-.87,-.78,.63,.16,.037,true,4);
  if(stage===2) bar(.70,-.42,.55,.148,-.078,false,1);
  for(let i=0;i<12;i++) {
    const x=-1.41+i*.24, y=-.41+.11*Math.cos(x*2);
    m.quad([x,y,-.128],[x+.14,y+.014,-.128],[x+.15,y+.034,-.128],[x,y+.02,-.128],'a2ccbf');
  }
  return m.faces;
}

function reservoirs(stage) {
  const m=model();
  m.box(-1.48,1.48,-1.11,1.11,-.55,-.25,'ad8463');
  m.box(-1.40,-.91,-1.06,1.06,-.25,.32,'b89573');
  m.box(-.91,-.41,-1.06,1.06,-.25,.21,'c9a77f');
  m.box(-.41,.22,-1.06,1.06,-.25,.09,'dab98b');
  for(let i=0;i<4;i++) for(let j=0;j<3;j++) m.box(-1.36+i*.20,-1.23+i*.20,.18+j*.23,.30+j*.23,.24,.41+(i%2)*.07,'cabc9f');
  if(stage===0) {
    m.box(.22,1.42,-1.04,1.04,-.25,.02,'d4ae7a');
    for(let i=0;i<4;i++) m.box(-1.30+i*.52,-.95+i*.52,-.51-i*.087,-.44-i*.087,.326-i*.107,.329-i*.107,'6ca9ae');
  } else {
    m.box(.22,1.43,-1.03,-.80,-.25,.13,'c4a381');m.box(.22,1.43,.89,1.02,-.25,.13,'c4a381');
    m.box(1.27,1.43,-.82,.91,-.25,.13,'c4a381'); m.box(.22,.34,-.82,.91,-.25,.13,'c4a381');
    m.box(.23,1.43,-.11,.05,-.25,.15,'c4a381');
    for(let i=0;i<4;i++) m.box(.35+i*.062,.43+i*.062,.079,.85,-.25,.10-i*.058,'d5b895');
    if(stage===2) {
      m.box(.34,1.26,-.79,-.12,-.25,-.027,'5caba8');m.box(.48,1.27,.055,.887,-.25,-.055,'69b5af');
      m.box(-.81,.25,-.64,-.54,.218,.232,'6ca9ae');
      m.box(.213,.35,-.64,-.54,.137,.15,'6ca9ae');
    }
  }
  return m.faces;
}

export const newExhibits = {
  varkala: {name:'Varkala Cliffs',place:'Kerala',process:'Coastal erosion',mesh:coast,
    stages:[['Layered shore','Compare the coloured beds and the hardened upper layer. These represent different materials, not exact strata thicknesses.'],['Wave attack','Waves can remove material at the foot of a cliff. Rotate the scene to see the notch develop below the upper beds. Rain and groundwater can also contribute to instability.'],['Cliff retreats','When unsupported material fails, the edge shifts inland and blocks can collect at the base. The model does not predict when or where a real cliff will fail.']]},
  meghalayan: {name:'Meghalayan Age Caves',place:'Meghalaya',process:'Limestone dissolution and mineral deposition',mesh:caves,
    stages:[['Water enters cracks','Rainwater picks up carbon dioxide and can slowly dissolve limestone as it moves through cracks. Look at the narrow opening in this cutaway.'],['Passage enlarges','Over time, where flow is concentrated, openings can join and expand into passages. This simplified chamber represents one way cavities develop.'],['Mineral deposits grow','Where dripping water loses carbon dioxide, calcite can be deposited. Compare stalactites growing down with stalagmites growing up; some deposits preserve climate clues.']]},
  majuli: {name:'Majuli',place:'Assam',process:'River erosion and deposition',mesh:river,
    stages:[['Sandbar forms','Where the river loses enough energy, it drops sediment. The small tan bar in the channel represents newly deposited material.'],['Island builds','More sediment can build bars higher. Vegetation may establish when a surface remains stable for long enough.'],['Channels shift','One bank can erode while bars grow elsewhere. Compare the inlet and bars with stage two: this illustrates a process, not a timeline or forecast for Majuli.']]},
  dholavira: {name:'Dholavira',place:'Gujarat',process:'Water capture in the Harappan city',mesh:reservoirs,
    stages:[['Seasonal runoff','Short periods of rainfall can send water rapidly downslope. Follow the small blue patches in this idealised landscape.'],['Build storage','Reservoir walls retain water; steps provide access as levels change. This is an explanatory layout, not a reconstruction of the archaeological site.'],['Catch and store','Collected runoff fills the reservoirs. Compare compact storage with the scattered runoff in stage one. The water colour marks what the system retains.']]},
};
