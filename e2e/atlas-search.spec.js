import { test, expect } from '@playwright/test';

test('save a cultural reference and read its exact entry on the Pages subpath',async ({page})=>{
  await page.goto('./');
  await page.getByLabel('Search the atlas').fill('ugadi');
  const card = page.locator('#catalog article').filter({has:page.getByRole('heading',{name:'Ugadi almanac reading'})});
  await expect(card).toContainText('Cultural reference');
  await expect(card.getByRole('link',{name:/Open planner/})).toHaveCount(0);
  await card.getByRole('button',{name:/Save note/}).click();
  await page.reload();
  await page.getByRole('button',{name:'Saved items (1)'}).click();
  await expect(page.locator('#catalog article')).toHaveCount(1);
  await card.getByRole('link',{name:/Read heritage note/}).click();
  await expect(page).toHaveURL(/\/adilabad-daytrip\/layers\/astrology\/#calendar-ugadi-reading$/);
  await expect(page.locator(':target h2')).toHaveText('Ugadi almanac reading');
});

test('search distinguishes a routed guide, a discovery note for the same site, and a confirmation-only stop',async ({page})=>{
  await page.goto('./');
  const search = page.getByLabel('Search the atlas');
  await search.fill('Jainath');
  await expect(page.locator('#place-jainath')).toContainText('Planner candidate');
  await expect(page.locator('#place-jainath').getByRole('link',{name:/Open planner/})).toHaveAttribute('href','?hub=adilabad&stop=jainath#planner');
  const note = page.locator('#catalog article').filter({has:page.getByRole('link',{name:/Read heritage note/})});
  await expect(note).toContainText('Discovery only');
  await expect(note.getByRole('link',{name:/Open planner/})).toHaveCount(0);
  await search.fill('Kala Ashram');
  const kala = page.locator('#place-kala');
  await expect(kala).toContainText('Locally confirmed window required');
  await kala.getByRole('link',{name:/Open planner/}).click();
  await expect(page).toHaveURL(/\?hub=adilabad&stop=kala#planner$/);
});

test('paging through heritage search results moves focus and a narrower query resets the page',async ({page})=>{
  await page.goto('./');
  const search = page.getByLabel('Search the atlas');
  const cards = page.locator('#catalog article');
  await search.fill('heritage note');
  await expect(cards).toHaveCount(6);
  const more = page.getByRole('button',{name:'Show more results'});
  await more.click();
  await expect(cards).toHaveCount(12);
  await expect(cards.nth(6)).toBeFocused();
  await search.fill('heritage note geology');
  await expect(cards).toHaveCount(6);
  await expect(more).toBeVisible();
  await search.fill('no-such-atlas-entry');
  await expect(page.locator('#atlas-count')).toHaveText('Showing 0 of 0 results');
  await expect(more).toHaveCount(0);
});
