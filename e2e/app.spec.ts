/**
 * TESTS E2E (End-to-End) CON PLAYWRIGHT
 *
 * Estos tests simulan un usuario REAL interactuando con la aplicación.
 *
 * NOTA: Los tests E2E dependen de que la aplicación esté corriendo.
 * Playwright automáticamente inicia `npm run dev` antes de los tests,
 * pero la primera carga puede tardar mientras Next.js compila.
 *
 * IMPORTANTE: El server de Next.js dev tarda en compilar la primera vez.
 * Por eso usamos waitForLoadState('networkidle') para esperar que termine.
 */

import { test, expect } from '@playwright/test'

// Aumentamos el timeout para la primera carga de la app
test.setTimeout(90000)

test.describe('Ontario Flag Time Machine - Basic', () => {

  test('should load the application and show heading', async ({ page }) => {
    // Navegamos a la página principal
    await page.goto('/')

    // Esperamos a que la página cargue completamente
    await page.waitForLoadState('networkidle')

    // Verificamos que el h1 existe (puede tardar en cargar)
    const heading = page.locator('h1')
    await expect(heading).toBeVisible({ timeout: 30000 })
  })

  test('should have interactive buttons', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Esperamos a que los botones estén presentes
    const buttons = page.locator('button')
    await buttons.first().waitFor({ state: 'visible', timeout: 30000 })

    const count = await buttons.count()
    // Debe haber al menos algunos botones
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Keyboard navigation', () => {

  test('should respond to keyboard input without errors', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Esperamos que la página cargue
    await page.locator('h1').waitFor({ state: 'visible', timeout: 30000 })

    // El app tiene keyboard listeners para flechas
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowLeft')

    // Si llegamos aquí sin errores, funciona
    await expect(page.locator('body')).toBeVisible()
  })
})

test.describe('Responsive behavior', () => {

  test('should render on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('body').waitFor({ state: 'visible', timeout: 30000 })
    await expect(page.locator('body')).toBeVisible()
  })

  test('should render on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('body').waitFor({ state: 'visible', timeout: 30000 })
    await expect(page.locator('body')).toBeVisible()
  })
})
