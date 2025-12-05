'use client'

import { FlagConfig, ColorPalette, Year } from '@/types'

interface OntarioFlagProps {
  config: FlagConfig
  palette: ColorPalette
  className?: string
  year: Year
}

/**
 * Flag information with historical context
 */
export interface FlagInfo {
  src: string
  alt: string
  era: string
  description: string
  isPreOntario?: boolean
  redColor: string // The exact red color used in this flag's SVG
}

/**
 * Map years to the appropriate flag SVG
 * 
 * HISTORICAL TIMELINE:
 * - Before 1791: French/British colonial period (not covered)
 * - 1791-1867: Upper Canada - British colony, used Union Jack
 * - 1867: Confederation - Ontario becomes a province
 * - 1868-1921: Canadian Red Ensign with 4-province shield
 * - 1922-1957: Canadian Red Ensign with 1921 coat of arms (green maple leaves)
 * - 1957-1965: Canadian Red Ensign with modified arms (red maple leaves)
 * - 1965-present: Ontario provincial flag
 */
export function getFlagForYear(year: Year): FlagInfo {
  // Easter egg: Before Upper Canada existed
  if (year < 1791) {
    return {
      src: '/flags/union-jack.svg',
      alt: 'Union Jack',
      era: 'Pre-1791',
      description: "You've gone too far back! Neither Ontario nor Upper Canada existed yet. This territory was part of the Province of Quebec (1763-1791) under British rule.",
      isPreOntario: true,
      redColor: '#C8102E' // Union Jack uses #C8102E
    }
  }

  // Upper Canada period (1791-1867)
  if (year < 1867) {
    return {
      src: '/flags/union-jack.svg',
      alt: 'Union Jack (Upper Canada)',
      era: '1791–1867',
      description: "Ontario didn't exist yet. This was Upper Canada, a British colony. The Union Jack was the official flag.",
      isPreOntario: true,
      redColor: '#C8102E' // Union Jack uses #C8102E
    }
  }

  // Brief period right after Confederation before Red Ensign standardized
  if (year < 1868) {
    return {
      src: '/flags/union-jack.svg',
      alt: 'Union Jack',
      era: '1867',
      description: "Ontario was just created through Confederation! The Union Jack remained the official flag while the Red Ensign was being developed.",
      isPreOntario: false,
      redColor: '#C8102E' // Union Jack uses #C8102E
    }
  }

  // First Canadian Red Ensign (1868-1921)
  if (year < 1922) {
    return {
      src: '/flags/canada-1868-1921.svg',
      alt: 'Canadian Red Ensign (1868-1921)',
      era: '1868–1921',
      description: "The Canadian Red Ensign with the combined arms of the four founding provinces. Used as Canada's de facto national flag.",
      isPreOntario: false,
      redColor: '#CE1126' // This SVG uses #CE1126
    }
  }

  // Second Canadian Red Ensign (1922-1957)
  if (year < 1957) {
    return {
      src: '/flags/canada-1921-1957.svg',
      alt: 'Canadian Red Ensign (1922-1957)',
      era: '1922–1957',
      description: "Updated Red Ensign with Canada's new coat of arms (1921). The maple leaves on the shield were green during this period.",
      isPreOntario: false,
      redColor: '#CE1126' // This SVG uses #CE1126
    }
  }

  // Third Canadian Red Ensign (1957-1965)
  if (year < 1965) {
    return {
      src: '/flags/canada-1921-1957.svg',
      alt: 'Canadian Red Ensign (1957-1965)',
      era: '1957–1965',
      description: "The final Red Ensign. In 1957, the maple leaves on the coat of arms were changed from green to red. This flew until the Maple Leaf flag replaced it.",
      isPreOntario: false,
      redColor: '#CE1126' // This SVG uses #CE1126
    }
  }

  // Ontario Provincial Flag (1965-present)
  return {
    src: '/flags/ontario.svg',
    alt: 'Flag of Ontario',
    era: '1965–present',
    description: "Ontario's provincial flag, adopted May 21, 1965. It preserves the Red Ensign design with the Ontario shield, adopted the same year Canada got the Maple Leaf flag.",
    isPreOntario: false,
    redColor: '#C8102E' // Ontario SVG uses #C8102E
  }
}

/**
 * Ontario Flag component using real SVG files from Wikimedia
 */
export function OntarioFlag({ config, palette, className = '', year }: OntarioFlagProps) {
  const { field, unionJack, shield } = config
  const flag = getFlagForYear(year)

  // Determine palette filter based on selected palette
  const getPaletteFilter = (): string => {
    switch (palette.id) {
      case 'heritage':
        // Darker, more muted historical look
        return 'saturate(0.75) brightness(0.9) contrast(1.05)'
      case 'autumn':
        // Warm autumn tones
        return 'sepia(0.15) saturate(0.9) hue-rotate(-5deg) brightness(0.95)'
      case 'winter':
        // Cool, desaturated winter look
        return 'saturate(0.6) brightness(0.85) contrast(1.1) hue-rotate(10deg)'
      case 'official':
      default:
        return 'none'
    }
  }

  // Determine texture filter
  const getTextureFilter = (): string => {
    switch (field.texture) {
      case 'aged':
        return 'sepia(0.35) saturate(0.7) brightness(0.88) contrast(1.1)'
      case 'solid':
      default:
        return 'none'
    }
  }

  // Combine palette and texture filters
  const getCombinedFilter = (): string => {
    const paletteFilter = getPaletteFilter()
    const textureFilter = getTextureFilter()

    if (paletteFilter === 'none' && textureFilter === 'none') {
      return 'none'
    }
    if (paletteFilter === 'none') return textureFilter
    if (textureFilter === 'none') return paletteFilter
    return `${paletteFilter} ${textureFilter}`
  }

  // Switches work for Red Ensign era (1868+) and Ontario flag
  const canToggleElements = year >= 1868

  // Use the exact red color from the SVG for the overlays
  const overlayColor = flag.redColor
  const combinedFilter = getCombinedFilter()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main flag image with combined palette and texture filter */}
      <img
        src={flag.src}
        alt={flag.alt}
        className="w-full h-auto transition-all duration-300"
        style={{
          display: 'block',
          filter: combinedFilter
        }}
      />

      {/* Overlay to hide Union Jack (works from 1868+) */}
      {canToggleElements && !unionJack.visible && (
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2 transition-opacity duration-300"
          style={{
            backgroundColor: overlayColor,
            filter: combinedFilter
          }}
        />
      )}

      {/* Overlay to hide Shield (works from 1868+) */}
      {canToggleElements && !shield.visible && (
        <div
          className="absolute transition-opacity duration-300"
          style={{
            backgroundColor: overlayColor,
            filter: combinedFilter,
            top: '12%',
            right: '8%',
            width: '30%',
            height: '76%'
          }}
        />
      )}

      {/* Aged texture pattern overlay */}
      {field.texture === 'aged' && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`
          }}
        />
      )}

      {/* Aged vignette overlay */}
      {field.texture === 'aged' && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(139, 119, 101, 0.15) 100%)'
          }}
        />
      )}

      {/* Pre-Ontario warning banner */}
      {flag.isPreOntario && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="max-w-md mx-4 p-6 bg-gradient-to-b from-[#2a2520] to-[#1a1510] border border-[#c9a86c]/30 rounded-sm shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl text-[#c9a86c] font-serif font-bold">!</span>
              <h3 className="text-[#c9a86c] font-serif text-lg">Time Paradox!</h3>
            </div>
            <p className="text-[#a09080] text-sm leading-relaxed">
              {flag.description}
            </p>
            <div className="mt-4 pt-3 border-t border-[#3a3530]">
              <p className="text-xs tracking-[0.1em] text-[#b5a5a0] font-mono font-medium">
                Move the lever to 1868 or later to see the flag history
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Flag era badge (only when not showing warning) */}
      {!flag.isPreOntario && (
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded text-[10px] text-white/80 font-mono tracking-wider">
          {flag.era}
        </div>
      )}
    </div>
  )
}
