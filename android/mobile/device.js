// Only included in the packaged Android edition. One destination per viewport.
function renderDeviceScreen() {
  const hash=location.hash.slice(1);
  const screen=hash==='saved'?'saved':hash==='geo-lab'?'lab':hash==='planner'?'plan':hash==='places'||hash.startsWith('place-')?'atlas':'discover';
  document.documentElement.dataset.screen=screen;
  const saved=document.querySelector('#saved-only');
  if(saved && ['saved','atlas'].includes(screen) && (saved.getAttribute('aria-pressed')==='true') !== (screen==='saved')) saved.click();
  const heading=document.querySelector('#places-title');
  if(heading) heading.textContent=screen==='saved'?'Your field notebook':'Explore by curiosity';
  if(screen==='saved' && saved) {
    for(const [id,event] of [['atlas-query','input'],['atlas-state','change']]) {
      const field=document.getElementById(id); if(field.value){field.value='';field.dispatchEvent(new Event(event));}
    }
    document.querySelector('#atlas-themes button:not([aria-pressed="true"]):first-child')?.click();
  }
  if(screen==='lab' && !document.querySelector('#lab-mount canvas')) document.querySelector('#load-lab')?.click();
  if(!hash.startsWith('place-')) window.scrollTo(0,0);
}
renderDeviceScreen();
addEventListener('DOMContentLoaded',()=>{
  renderDeviceScreen();
  const hero=document.querySelector('.hero-actions');
  const saved=document.createElement('a');saved.className='secondary';saved.href='#saved';saved.textContent='Open field notebook';hero.append(saved);
});
addEventListener('hashchange',renderDeviceScreen);
// Delegate printing of the currently visible itinerary to Android's print UI.
window.print=()=>{location.href='https://appassets.androidplatform.net/native/print';};
