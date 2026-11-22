import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:4173/adilabad-daytrip/' },
  webServer: { command: 'npm run preview -- --host 127.0.0.1 --base /adilabad-daytrip/ --strictPort', url: 'http://127.0.0.1:4173/adilabad-daytrip/' },
});
