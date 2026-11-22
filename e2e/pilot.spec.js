import { test, expect } from '@playwright/test';

test('production assets work under the GitHub Pages project path', async ({page}) => {
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('./');
  await expect(page.locator('#catalog article')).toHaveCount(7);
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.locator('#output')).toContainText('2 stops');
  await expect(page.getByRole('img',{name:/Schematic/})).toBeVisible();
  await page.getByRole('button',{name:'Alternative'}).click();
  await expect(page.locator('#output')).toContainText('1 stop');
  await page.getByRole('button',{name:'Recommended'}).click();
  await page.getByRole('button',{name:'Skip Jainath Temple and replan'}).click();
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
  await expect(page.getByRole('status')).toContainText('No matching round trip');
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
  await expect(page.getByRole('status')).toContainText('details changed');
  await expect(page.getByLabel('Confirmed from (IST)')).toHaveValue('');
  await page.getByRole('button',{name:'Build my itinerary'}).click();
  await expect(page.getByRole('status')).toContainText('No matching round trip');
});
