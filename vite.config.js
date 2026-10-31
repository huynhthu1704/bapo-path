import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on GitHub Pages (/bapo-path/) or any other host.
export default defineConfig({ plugins: [react()], base: './' });
