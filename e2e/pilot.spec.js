import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('production assets work under the GitHub Pages project path', async ({page}) => {
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('./');
  await expect(page.locator('#catalog article')).toHaveCount(6);
  await expect(page.locator('#atlas-count')).toContainText('of 48 places');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#output')).toContainText('2 stops');
  await expect(page.getByRole('img',{name:/Schematic/})).toBeVisible();
  await page.getByRole('button',{name:'Alternative'}).click();
  await expect(page.locator('#output')).toContainText('1 stop');
  await page.getByRole('button',{name:'Recommended'}).click();
  await page.getByRole('button',{name:'Skip stop & replan: Jainath Temple'}).click();
  await expect(page.locator('#output')).not.toContainText('Jainath Temple');
  await page.getByRole('button',{name:'Restore skipped stops'}).click();
  await expect(page.locator('#output')).toContainText('Jainath Temple');
  expect(errors).toEqual([]);
});

test('mobile: indoor confirmation is date-bound and changed inputs invalidate output', async ({page}) => {
  await page.setViewportSize({width:360,height:800});
  await page.goto('./');
  await page.getByLabel('Setting').selectOption('indoor');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#status')).toContainText('No matching round trip');
  await page.getByText('Add a locally confirmed stop').click();
  await page.getByLabel('Confirmed from (IST)').fill('10:00');
  await page.getByLabel('Confirmed until (IST)').fill('13:00');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#output')).toContainText('10:00–11:00');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  const date = page.getByLabel('Trip date');
  const next = new Date(`${await date.inputValue()}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate()+1);
  await date.fill(next.toISOString().slice(0,10));
  await expect(page.locator('#status')).toContainText('details changed');
  await expect(page.getByLabel('Confirmed from (IST)')).toHaveValue('');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#status')).toContainText('No matching round trip');
});

test('atlas filters combine and saved places persist, without scheduling discovery sites', async ({page}) => {
  await page.goto('./');
  await page.getByRole('button',{name:'Show more places'}).click();
  await expect(page.locator('#catalog article')).toHaveCount(12);
  await page.getByLabel('State or union territory').selectOption('Odisha');
  await page.getByRole('group',{name:'Atlas themes'}).getByRole('button',{name:'Birding & wildlife'}).click();
  const card = page.locator('#place-chilika');
  await expect(card).toContainText('Discovery only');
  await expect(card.getByRole('link',{name:'Open planner'})).toHaveCount(0);
  await card.getByRole('button',{name:'Save place: Chilika Lagoon'}).click();
  await page.reload();
  await page.getByRole('button',{name:'Saved places (1)'}).click();
  await expect(card).toBeVisible();
  await page.getByRole('link',{name:'Explore Lonar Crater in the atlas'}).click();
  await expect(page.locator('#place-lonar')).toBeFocused();
});

test('Bengaluru supports an indoor, easy-going three-hour trip', async ({page})=>{
  await page.goto('./');
  await page.getByLabel('Planning hub').selectOption('bengaluru');
  await page.getByRole('button',{name:'3 hours'}).click();
  await expect(page.getByLabel('Return by (IST)')).toHaveValue('13:00');
  await page.getByLabel('Getting around').selectOption('foot');
  await page.getByLabel('Setting').selectOption('indoor');
  await page.getByLabel('Pace',{exact:true}).selectOption('easy');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#output')).toContainText('Visvesvaraya Science Museum');
  await expect(page.getByRole('button',{name:'Print or save as PDF'})).toBeVisible();
});

test('keyboard navigation and automated WCAG checks pass on mobile with a result', async ({page})=>{
  await page.setViewportSize({width:320,height:800});
  await page.goto('./');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to main content'})).toBeFocused();
  await expect(page.locator('.hero-media img')).toHaveJSProperty('complete',true);
  expect(await page.locator('.hero-media img').evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#results')).toBeFocused();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const {violations} = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
});

test('atlas imagery is local, lazy-loaded, and credited on the Pages subpath', async ({page})=>{
  await page.goto('./');
  const card = page.locator('#place-lonar');
  const image = card.locator('img');
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute('loading','lazy');
  await expect(image).toHaveAttribute('src',/\/adilabad-daytrip\/place-media\//);
  await expect.poll(()=>image.evaluate(el=>el.naturalWidth)).toBeGreaterThan(0);
  await card.getByText('Sources and visit notes').click();
  await expect(card.locator('.photo-credit a')).toHaveCount(2);
});

test('3D lab is loaded on demand and an atlas card opens its matching exhibit',async ({page})=>{
  const errors = [];
  page.on('pageerror', e=>errors.push(e.message));
  await page.setViewportSize({width:360,height:800});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  await expect(page.locator('#lab-mount')).toBeEmpty();
  await page.locator('#place-st-marys').getByRole('link',{name:/Explore in 3D/}).click();
  await expect(page.locator('#lab-status')).toHaveText('3D lab ready.');
  await expect(page.locator('#load-lab')).toBeHidden();
  await expect(page.locator('#lab-title')).toBeFocused();
  await expect(page.locator('[data-geo-model="st-marys"]')).toHaveAttribute('aria-pressed','true');
  const canvas = page.locator('#lab-mount canvas');
  const pixels = () => canvas.evaluate(el=>el.toDataURL());
  for (const model of ['st-marys','deccan','lonar']) {
    await page.locator(`[data-geo-model="${model}"]`).click();
    const frames = new Set();
    for (const stage of [1,2,3]) {
      const prior = await pixels();
      const control = page.locator(`[data-geo-stage="${stage}"]`);
      await control.click();
      await expect(control).toHaveAttribute('aria-pressed','true');
      await expect.poll(async()=>await pixels() !== prior).toBe(true);
      frames.add(await pixels());
    }
    expect(frames.size).toBe(3);
  }
  const initial = await pixels();
  await canvas.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(async()=>await pixels() !== initial).toBe(true);
  await page.keyboard.press('Home');
  await expect.poll(async()=>await pixels() === initial).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  const {violations} = await new AxeBuilder({page}).include('#geo-lab').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  expect(violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))).toEqual([]);
  expect(errors).toEqual([]);
});
