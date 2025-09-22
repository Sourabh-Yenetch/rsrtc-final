import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        plugins: [react()],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }, 
        server: {
            // 👇 ADD THIS HMR CONFIGURATION BLOCK
            hmr: {
                // Ensure the HMR connection uses the port the browser is viewing (5174)
                // and the correct host.
                protocol: 'ws',
                host: 'localhost',
                port: 5174, 
            },
            // 👆 END OF HMR CONFIGURATION BLOCK
            proxy: {
                '/api/rsrtc': {
                    target: 'http://mis.rajasthanroadways.com:8081', 
                    changeOrigin: true,
                    secure: false, 
                    rewrite: (path) => path.replace(/^\/api\/rsrtc/, ''),
                },
            },
        },
    };
});