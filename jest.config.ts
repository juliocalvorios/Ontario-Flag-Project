import type { Config } from 'jest'
import nextJest from 'next/jest'

// createJestConfig se encarga de configurar Jest para Next.js
// Esto maneja automáticamente cosas como transformar TypeScript y JSX
const createJestConfig = nextJest({
  // La ruta a tu app Next.js (donde está next.config.js)
  dir: './',
})

const config: Config = {
  // El "environment" es el entorno donde corren los tests
  // jsdom simula un navegador (DOM, window, document, etc.)
  // Sin esto, no podríamos renderizar componentes React
  testEnvironment: 'jsdom',

  // setupFilesAfterEnv son archivos que se ejecutan ANTES de cada test
  // Aquí importamos los matchers extra de @testing-library/jest-dom
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // moduleNameMapper traduce los imports con @ a rutas reales
  // Cuando escribes @/components/..., Jest sabe que es src/components/...
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // testMatch define qué archivos son tests
  // Busca archivos .test.ts, .test.tsx, .spec.ts, .spec.tsx
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
}

export default createJestConfig(config)
