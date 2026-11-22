import { defineConfig } from 'vite';
import { fieldGuidePlugin } from './scripts/render-guides.js';

export default defineConfig({ plugins:[fieldGuidePlugin()] });
