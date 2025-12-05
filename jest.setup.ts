// Este archivo se ejecuta ANTES de cada archivo de test
// Aquí configuramos las herramientas que necesitamos

// Importamos los "matchers" de testing-library
// Los matchers son funciones como .toBeInTheDocument(), .toHaveClass(), etc.
// Sin esta línea, Jest no conocería estos matchers
import '@testing-library/jest-dom'
