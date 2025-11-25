import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
        css: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            // 👇 Agrega esto para ignorar archivos estáticos y de configuración
            exclude: [
                'src/assets/**',
                'src/main.jsx',
                'src/services/**', // Opcional: si no vas a testear servicios aún
                '**/*.config.js',
                '**/*.cjs'
            ]
        },
    },
})