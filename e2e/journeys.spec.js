import { test, expect } from '@playwright/test';

for (const {theme,search,hub,id,name,origin} of [
  {theme:'History & archaeology',search:'Prakrit inscription',hub:'adilabad',id:'jainath',name:'Jainath Temple',origin:'Adilabad railway station'},
  {theme:'Rocks & landscapes',search:'Peninsular Gneiss',hub:'bengaluru',id:'lalbagh',name:'Lalbagh Rock & Botanical Garden',origin:'Cubbon Park metro'},
]) {
  test(`${hub}: find an interest, read the guide and return with the requested stop`,async ({page})=>{
    await page.goto('./');
    await page.getByRole('group',{name:'Atlas themes'}).getByRole('button',{name:theme}).click();
    await page.locator('#atlas-query').fill(search);
    await page.getByRole('link',{name:`Read field guide: ${name}`,exact:true}).click();
    await expect(page.getByRole('heading',{level:1,name,exact:true})).toBeVisible();
    await page.getByRole('link',{name:/Open the day planner/}).click();
    await expect(page).toHaveURL(new RegExp(`\\?hub=${hub}&stop=${id}#planner$`));
    await expect(page.getByRole('group',{name:'Requested stop'})).toContainText(name);
    await page.getByRole('button',{name:'Build my itinerary'}).click();
    const timeline=page.locator('#output .timeline');
    await expect(timeline.getByRole('heading',{name:new RegExp(name)})).toBeVisible();
    const back=await timeline.locator('li').last().innerText();
    expect(back).toContain(`Return to ${origin}`);
    expect(back.slice(0,5) <= await page.getByLabel('Return by (IST)').inputValue()).toBe(true);
  });
}

test('a short day keeps the request until the visitor explicitly removes it', async ({page})=>{
  await page.goto('./?hub=bengaluru&stop=lalbagh#planner');
  await page.getByLabel('Return by (IST)').fill('11:15');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#status')).toContainText("Lalbagh Rock & Botanical Garden doesn't fit");
  await expect(page.locator('.timeline')).toHaveCount(0);
  await page.getByRole('button',{name:'Remove priority'}).click();
  await expect(page).not.toHaveURL(/stop=/);
  await expect(page.getByRole('group',{name:'Requested stop'})).toHaveCount(0);
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('.timeline')).toContainText('Return to Cubbon Park metro');
  await page.reload();
  await expect(page.getByRole('group',{name:'Requested stop'})).toHaveCount(0);
});

test('a host-confirmed stop is scheduled only inside the confirmed window',async ({page})=>{
  await page.goto('./places/kala/');
  await page.getByRole('link',{name:/Open the day planner/}).click();
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#status')).toContainText('Kala Ashram needs local confirmation');
  await expect(page.locator('.timeline')).toHaveCount(0);
  await page.getByLabel('Confirmed from (IST)').fill('11:00');
  await page.getByLabel('Confirmed until (IST)').fill('12:00');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('.timeline li').filter({hasText:'Kala Ashram'})).toContainText('11:00–12:00');
});
