import { defineConfig, devices } from '@playwright/test'

/**
 * CONFIGURACIÓN DE PLAYWRIGHT
 *
 * Playwright es diferente de Jest:
 * - Jest: Ejecuta tests en Node.js, simula el DOM con jsdom
 * - Playwright: Abre navegadores REALES y ejecuta tests en ellos
 *
 * Esto significa que Playwright puede:
 * - Tomar screenshots
 * - Grabar videos
 * - Probar en múltiples navegadores (Chrome, Firefox, Safari)
 * - Detectar bugs que solo ocurren en navegadores reales
 */

export default defineConfig({
  // Carpeta donde están los tests E2E
  testDir: './e2e',

  // Ejecutar tests en paralelo (más rápido)
  fullyParallel: true,

  // No permitir test.only en CI (evita olvidar tests focalizados)
  forbidOnly: !!process.env.CI,

  // Reintentos: 0 en local, 2 en CI
  retries: process.env.CI ? 2 : 0,

  // Workers (procesos paralelos)
  workers: process.env.CI ? 1 : undefined,

  // Reportero de resultados
  reporter: 'html',

  // Configuración compartida por todos los tests
  use: {
    // URL base de la aplicación
    // Usamos puerto 3001 para evitar conflictos con otros proyectos
    baseURL: 'http://localhost:3001',

    // Tomar screenshot cuando falla un test
    screenshot: 'only-on-failure',

    // Grabar video cuando falla un test (útil para debugging)
    video: 'retain-on-failure',

    // Guardar "trace" para debugging (timeline de acciones)
    trace: 'on-first-retry',
  },

  // En qué navegadores ejecutar los tests
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Puedes descomentar estos para probar en más navegadores:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Iniciar el servidor de desarrollo automáticamente antes de los tests
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutos para iniciar
  },
})
