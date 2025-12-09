/**
 * TESTS PARA: src/components/OntarioFlag.tsx
 *
 * Aquí testeamos:
 * 1. La función pura getFlagForYear() - fácil de testear
 * 2. El componente OntarioFlag - necesita React Testing Library
 *
 * CONCEPTOS NUEVOS:
 * - render(): Renderiza un componente React en un DOM virtual
 * - screen: Objeto que nos permite buscar elementos en el DOM
 * - getByRole(), getByAltText(), etc.: Queries para encontrar elementos
 */

import { render, screen } from '@testing-library/react'
import { OntarioFlag, getFlagForYear } from '@/components/OntarioFlag'
import { FLAG_CONFIGS, COLOR_PALETTES } from '@/data/history'
import { toYear } from '@/types'

// =============================================================================
// tests for getFlagForYear function
// pure function - same input always gives same output
// pure functions are easy to test
// =============================================================================

describe('getFlagForYear', () => {
  // test each historical period

  describe('Pre-1791 (Before Upper Canada)', () => {
    it('should return Union Jack for year 1763', () => {
      const result = getFlagForYear(toYear(1763))

      expect(result.src).toBe('/flags/union-jack.svg')
      expect(result.isPreOntario).toBe(true)
      expect(result.era).toBe('Pre-1791')
    })

    it('should return Union Jack for year 1790', () => {
      const result = getFlagForYear(toYear(1790))

      expect(result.isPreOntario).toBe(true)
      expect(result.description).toContain("You've gone too far back")
    })
  })

  describe('Upper Canada period (1791-1867)', () => {
    it('should return Union Jack for year 1791', () => {
      const result = getFlagForYear(toYear(1791))

      expect(result.src).toBe('/flags/union-jack.svg')
      expect(result.alt).toContain('Upper Canada')
      expect(result.era).toBe('1791–1867')
      expect(result.isPreOntario).toBe(true)
    })

    it('should return Union Jack for year 1866', () => {
      const result = getFlagForYear(toYear(1866))

      expect(result.isPreOntario).toBe(true)
      expect(result.description).toContain("Ontario didn't exist yet")
    })
  })

  describe('Confederation year (1867)', () => {
    it('should return Union Jack for year 1867', () => {
      const result = getFlagForYear(toYear(1867))

      expect(result.src).toBe('/flags/union-jack.svg')
      expect(result.era).toBe('1867')
      expect(result.isPreOntario).toBe(false) // Ontario exists now!
      expect(result.description).toContain('Confederation')
    })
  })

  describe('First Red Ensign (1868-1921)', () => {
    it('should return first Red Ensign for year 1868', () => {
      const result = getFlagForYear(toYear(1868))

      expect(result.src).toBe('/flags/canada-1868-1921.svg')
      expect(result.era).toBe('1868–1921')
      expect(result.isPreOntario).toBe(false)
    })

    it('should return first Red Ensign for year 1900', () => {
      const result = getFlagForYear(toYear(1900))

      expect(result.src).toBe('/flags/canada-1868-1921.svg')
      expect(result.description).toContain('four founding provinces')
    })
  })

  describe('Second Red Ensign (1922-1957)', () => {
    it('should return second Red Ensign for year 1922', () => {
      const result = getFlagForYear(toYear(1922))

      expect(result.src).toBe('/flags/canada-1921-1957.svg')
      expect(result.era).toBe('1922–1957')
    })

    it('should return second Red Ensign for year 1950', () => {
      const result = getFlagForYear(toYear(1950))

      expect(result.src).toBe('/flags/canada-1921-1957.svg')
      expect(result.description).toContain('green')
    })
  })

  describe('Third Red Ensign (1957-1965)', () => {
    it('should return third Red Ensign for year 1957', () => {
      const result = getFlagForYear(toYear(1957))

      expect(result.src).toBe('/flags/canada-1921-1957.svg')
      expect(result.era).toBe('1957–1965')
    })

    it('should return third Red Ensign for year 1964', () => {
      const result = getFlagForYear(toYear(1964))

      expect(result.src).toBe('/flags/canada-1921-1957.svg')
      expect(result.description).toContain('Maple Leaf flag')
    })
  })

  describe('Ontario Provincial Flag (1965-present)', () => {
    it('should return Ontario flag for year 1965', () => {
      const result = getFlagForYear(toYear(1965))

      expect(result.src).toBe('/flags/ontario.svg')
      expect(result.alt).toBe('Flag of Ontario')
      expect(result.era).toBe('1965–present')
      expect(result.isPreOntario).toBe(false)
    })

    it('should return Ontario flag for year 2025', () => {
      const result = getFlagForYear(toYear(2025))

      expect(result.src).toBe('/flags/ontario.svg')
      expect(result.description).toContain('May 21, 1965')
    })

    it('should return Ontario flag for far future year', () => {
      const result = getFlagForYear(toYear(2100))

      expect(result.src).toBe('/flags/ontario.svg')
    })
  })

  // boundary tests
  // Los bugs suelen ocurrir en los límites entre períodos
  describe('boundary years (edge cases)', () => {
    it('should handle year 1790 → 1791 transition', () => {
      const before = getFlagForYear(toYear(1790))
      const after = getFlagForYear(toYear(1791))

      expect(before.era).toBe('Pre-1791')
      expect(after.era).toBe('1791–1867')
    })

    it('should handle year 1866 → 1867 transition', () => {
      const before = getFlagForYear(toYear(1866))
      const after = getFlagForYear(toYear(1867))

      expect(before.isPreOntario).toBe(true)
      expect(after.isPreOntario).toBe(false)
    })

    it('should handle year 1867 → 1868 transition', () => {
      const before = getFlagForYear(toYear(1867))
      const after = getFlagForYear(toYear(1868))

      expect(before.src).toBe('/flags/union-jack.svg')
      expect(after.src).toBe('/flags/canada-1868-1921.svg')
    })

    it('should handle year 1964 → 1965 transition', () => {
      const before = getFlagForYear(toYear(1964))
      const after = getFlagForYear(toYear(1965))

      expect(before.src).toContain('canada')
      expect(after.src).toBe('/flags/ontario.svg')
    })
  })

  // Test para verificar que todos los colores son hexadecimales válidos
  describe('color values', () => {
    it('should return valid hex color for redColor', () => {
      const years = [1763, 1800, 1867, 1900, 1950, 1960, 1965, 2000]
      const hexRegex = /^#[0-9A-F]{6}$/i

      years.forEach((year) => {
        const result = getFlagForYear(toYear(year))
        expect(result.redColor).toMatch(hexRegex)
      })
    })
  })
})

// =============================================================================
// Tests para el componente OntarioFlag
// Aquí usamos React Testing Library para renderizar el componente
// =============================================================================

describe('OntarioFlag Component', () => {
  // Datos de prueba que reutilizamos en varios tests
  const defaultProps = {
    config: FLAG_CONFIGS['1965-present'],
    palette: COLOR_PALETTES[0], // Official palette
    year: toYear(1965)
  }

  // Test básico: ¿el componente se renderiza sin explotar?
  it('should render without crashing', () => {
    // render() monta el componente en un DOM virtual
    render(<OntarioFlag {...defaultProps} />)

    // Si llegamos aquí sin errores, el test pasa
    // screen.getByRole busca elementos por su rol de accesibilidad
    // Una imagen tiene role="img"
    const flag = screen.getByRole('img')
    expect(flag).toBeInTheDocument()
  })

  it('should render correct flag image for 1965', () => {
    render(<OntarioFlag {...defaultProps} />)

    // getByAltText busca elementos por su atributo alt
    const flag = screen.getByAltText('Flag of Ontario')
    expect(flag).toBeInTheDocument()

    // getAttribute nos da el valor de cualquier atributo HTML
    expect(flag.getAttribute('src')).toBe('/flags/ontario.svg')
  })

  it('should show era badge for Ontario flag', () => {
    render(<OntarioFlag {...defaultProps} />)

    // getByText busca elementos que contengan ese texto
    expect(screen.getByText('1965–present')).toBeInTheDocument()
  })

  it('should show warning banner for pre-Ontario years', () => {
    render(<OntarioFlag {...defaultProps} year={toYear(1800)} />)

    // Verificamos que aparece el mensaje de advertencia
    expect(screen.getByText('Time Paradox!')).toBeInTheDocument()
  })

  it('should not show era badge when showing warning banner', () => {
    render(<OntarioFlag {...defaultProps} year={toYear(1800)} />)

    // queryByText devuelve null si no encuentra el elemento
    // (getByText lanzaría un error)
    expect(screen.queryByText('1965–present')).not.toBeInTheDocument()
  })

  it('should render Union Jack for years before 1868', () => {
    render(<OntarioFlag {...defaultProps} year={toYear(1850)} />)

    const flag = screen.getByRole('img')
    expect(flag.getAttribute('src')).toBe('/flags/union-jack.svg')
  })

  it('should render Red Ensign for years 1868-1964', () => {
    render(<OntarioFlag {...defaultProps} year={toYear(1900)} />)

    const flag = screen.getByRole('img')
    expect(flag.getAttribute('src')).toContain('canada')
  })

  // Test con diferentes paletas
  describe('color palettes', () => {
    it('should apply filter for heritage palette', () => {
      const heritageProps = {
        ...defaultProps,
        palette: COLOR_PALETTES.find(p => p.id === 'heritage')!
      }

      render(<OntarioFlag {...heritageProps} />)

      const flag = screen.getByRole('img')
      // Verificamos que tiene algún filtro aplicado
      expect(flag.style.filter).not.toBe('none')
    })

    it('should not apply filter for official palette', () => {
      render(<OntarioFlag {...defaultProps} />)

      const flag = screen.getByRole('img')
      expect(flag.style.filter).toBe('none')
    })
  })

  // Test con diferentes texturas
  describe('textures', () => {
    it('should apply aged texture filter', () => {
      const agedConfig = {
        ...FLAG_CONFIGS['1965-present'],
        field: { ...FLAG_CONFIGS['1965-present'].field, texture: 'aged' as const }
      }

      render(<OntarioFlag {...defaultProps} config={agedConfig} />)

      const flag = screen.getByRole('img')
      expect(flag.style.filter).toContain('sepia')
    })
  })
})
