import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@supabase'))   return 'supabase';
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('react-icons')) return 'icons';
          if (id.includes('react-dom') || id.includes('react/')) return 'react';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },

  optimizeDeps: {
    include: [
      '@supabase/supabase-js',
      'framer-motion',
      'react-icons/hi',
      'react-icons/fi',
    ],
  },
});
