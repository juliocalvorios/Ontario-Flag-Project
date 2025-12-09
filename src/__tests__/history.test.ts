/**
 * TESTS PARA: src/data/history.ts
 *
 * Este es tu primer archivo de tests. Te explico la estructura:
 *
 * - describe(): Agrupa tests relacionados. Piensa en él como una "carpeta"
 * - it() o test(): Define un test individual. Son sinónimos.
 * - expect(): Hace una "afirmación". Si la afirmación falla, el test falla.
 */

import { ERAS, KEY_YEARS, FLAG_CONFIGS, COLOR_PALETTES, HISTORICAL_EVENTS } from '@/data/history'

// =============================================================================
// describe() agrupa tests relacionados
// El primer argumento es el nombre del grupo
// El segundo es una función con los tests
// =============================================================================

describe('ERAS', () => {
  // it() define un test individual
  // El nombre debe describir QUÉ estamos verificando

  it('should have 8 historical eras', () => {
    // expect() hace una afirmación
    // toBe() verifica igualdad exacta (===)
    expect(ERAS.length).toBe(8)
  })

  it('should start with pre-1791 era', () => {
    // Accedemos al primer elemento y verificamos su id
    expect(ERAS[0].id).toBe('pre-1791')
    expect(ERAS[0].year).toBe(1763)
  })

  it('should end with current era (1965-present)', () => {
    // at(-1) es una forma moderna de obtener el último elemento
    const lastEra = ERAS.at(-1)
    expect(lastEra?.id).toBe('1965-present')
  })

  it('should have all required properties for each era', () => {
    // forEach itera sobre cada era
    // Verificamos que cada era tenga todas las propiedades necesarias
    ERAS.forEach((era) => {
      expect(era).toHaveProperty('id')
      expect(era).toHaveProperty('year')
      expect(era).toHaveProperty('name')
      expect(era).toHaveProperty('description')
      expect(era).toHaveProperty('historicalContext')
    })
  })

  it('should have eras in chronological order', () => {
    // Verificamos que cada año sea >= al anterior
    for (let i = 1; i < ERAS.length; i++) {
      const currentYear = ERAS[i].year
      const previousYear = ERAS[i - 1].year
      expect(currentYear).toBeGreaterThanOrEqual(previousYear)
    }
  })
})

// =============================================================================
// Otro grupo de tests para KEY_YEARS
// =============================================================================

describe('KEY_YEARS', () => {
  it('should have 9 key years', () => {
    expect(KEY_YEARS.length).toBe(9)
  })

  it('should start with 1763 (Treaty of Paris)', () => {
    expect(KEY_YEARS[0]).toBe(1763)
  })

  it('should end with 2025 (present)', () => {
    expect(KEY_YEARS.at(-1)).toBe(2025)
  })

  it('should be in chronological order', () => {
    // Creamos una copia ordenada y comparamos
    const sorted = [...KEY_YEARS].sort((a, b) => a - b)
    // toEqual() compara el contenido de arrays/objetos
    // toBe() compararía la referencia (misma posición en memoria)
    expect(KEY_YEARS).toEqual(sorted)
  })

  it('should include the Ontario flag adoption year (1965)', () => {
    // toContain() verifica que un array contenga un valor
    expect(KEY_YEARS).toContain(1965)
  })
})

// =============================================================================
// Tests para FLAG_CONFIGS
// =============================================================================

describe('FLAG_CONFIGS', () => {
  it('should have 4 flag configurations', () => {
    const configKeys = Object.keys(FLAG_CONFIGS)
    expect(configKeys.length).toBe(4)
  })

  it('should have correct era keys', () => {
    const expectedKeys = ['pre-1965', '1965', '1965-present', 'proposals']
    expect(Object.keys(FLAG_CONFIGS)).toEqual(expect.arrayContaining(expectedKeys))
  })

  it('should have Union Jack visible for official Ontario flags', () => {
    // Las banderas oficiales (no propuestas) deben tener Union Jack visible
    expect(FLAG_CONFIGS['pre-1965'].unionJack.visible).toBe(true)
    expect(FLAG_CONFIGS['1965'].unionJack.visible).toBe(true)
    expect(FLAG_CONFIGS['1965-present'].unionJack.visible).toBe(true)
  })

  it('should have Union Jack hidden for proposals', () => {
    // Las propuestas de rediseño ocultan el Union Jack
    expect(FLAG_CONFIGS['proposals'].unionJack.visible).toBe(false)
  })

  it('should have shield with 3 maple leaves for all configs', () => {
    Object.values(FLAG_CONFIGS).forEach((config) => {
      expect(config.shield.mapleLeaves.count).toBe(3)
    })
  })
})

// =============================================================================
// Tests para COLOR_PALETTES
// =============================================================================

describe('COLOR_PALETTES', () => {
  it('should have 4 color palettes', () => {
    expect(COLOR_PALETTES.length).toBe(4)
  })

  it('should include official palette', () => {
    // find() busca un elemento que cumpla la condición
    const official = COLOR_PALETTES.find(p => p.id === 'official')
    // toBeDefined() verifica que no sea undefined
    expect(official).toBeDefined()
  })

  it('should have valid hex colors in official palette', () => {
    const official = COLOR_PALETTES.find(p => p.id === 'official')
    // Regex para validar formato de color hex (#RRGGBB)
    const hexRegex = /^#[0-9A-F]{6}$/i

    expect(official?.colors.red).toMatch(hexRegex)
    expect(official?.colors.blue).toMatch(hexRegex)
    expect(official?.colors.white).toMatch(hexRegex)
    expect(official?.colors.green).toMatch(hexRegex)
    expect(official?.colors.gold).toMatch(hexRegex)
  })

  it('should have all 5 colors in each palette', () => {
    const requiredColors = ['red', 'blue', 'white', 'green', 'gold']

    COLOR_PALETTES.forEach((palette) => {
      requiredColors.forEach((color) => {
        // toHaveProperty() verifica que el objeto tenga esa propiedad
        expect(palette.colors).toHaveProperty(color)
      })
    })
  })
})

// =============================================================================
// Tests para HISTORICAL_EVENTS
// =============================================================================

describe('HISTORICAL_EVENTS', () => {
  it('should have 9 historical events', () => {
    expect(HISTORICAL_EVENTS.length).toBe(9)
  })

  it('should have all required properties for each event', () => {
    HISTORICAL_EVENTS.forEach((event) => {
      expect(event).toHaveProperty('year')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('description')
      expect(event).toHaveProperty('flagImpact')
    })
  })

  it('should include Confederation (1867)', () => {
    const confederation = HISTORICAL_EVENTS.find(e => e.year === 1867)
    expect(confederation).toBeDefined()
    // toContain() también funciona con strings (busca substring)
    expect(confederation?.title).toContain('Confederation')
  })

  it('should include Ontario Flag adoption (1965)', () => {
    const flagAdoption = HISTORICAL_EVENTS.find(e => e.year === 1965)
    expect(flagAdoption).toBeDefined()
    expect(flagAdoption?.title).toContain('Ontario Flag')
  })
})
