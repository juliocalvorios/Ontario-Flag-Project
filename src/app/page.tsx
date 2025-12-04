'use client'

import { useState, useEffect, useCallback } from 'react'
import { VintageSwitch, YearLever, OntarioFlag, DownloadButton, getFlagForYear } from '@/components'
import { Year, toYear, FlagConfig } from '@/types'
import { FLAG_CONFIGS, COLOR_PALETTES, ERAS, KEY_YEARS } from '@/data/history'

export default function Home() {
  // State
  const [currentYear, setCurrentYear] = useState<Year>(toYear(1965))
  const [showUnionJack, setShowUnionJack] = useState(true)
  const [showShield, setShowShield] = useState(true)
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [textureIndex, setTextureIndex] = useState(0)

  const textures: Array<'aged' | 'solid'> = ['solid', 'aged']
  const currentPalette = COLOR_PALETTES[paletteIndex]

  // Determine era based on year
  const getEraForYear = (year: Year): FlagConfig => {
    if (year < 1965) return FLAG_CONFIGS['pre-1965']
    if (year === 1965) return FLAG_CONFIGS['1965']
    return FLAG_CONFIGS['1965-present']
  }

  // Build current flag config
  const flagConfig: FlagConfig = {
    ...getEraForYear(currentYear),
    year: currentYear,
    field: {
      ...getEraForYear(currentYear).field,
      texture: textures[textureIndex]
    },
    unionJack: {
      ...getEraForYear(currentYear).unionJack,
      visible: showUnionJack
    },
    shield: {
      ...getEraForYear(currentYear).shield,
      visible: showShield
    }
  }

  // Get current era info based on year
  const getCurrentEra = () => {
    if (currentYear < 1791) return ERAS.find(e => e.id === 'pre-1791')
    if (currentYear < 1867) return ERAS.find(e => e.id === 'upper-canada')
    if (currentYear < 1868) return ERAS.find(e => e.id === 'confederation')
    if (currentYear < 1922) return ERAS.find(e => e.id === 'red-ensign-1868')
    if (currentYear < 1957) return ERAS.find(e => e.id === 'red-ensign-1922')
    if (currentYear < 1965) return ERAS.find(e => e.id === 'red-ensign-1957')
    if (currentYear === 1965) return ERAS.find(e => e.id === '1965')
    return ERAS.find(e => e.id === '1965-present')
  }

  const currentEra = getCurrentEra()

  // Get flag plate label based on year
  const getFlagPlateLabel = () => {
    if (currentYear < 1791) return 'British Colonial Period'
    if (currentYear < 1867) return `Upper Canada · ${currentYear}`
    if (currentYear < 1868) return `Confederation · ${currentYear}`
    if (currentYear < 1922) return `Canadian Red Ensign · ${currentYear}`
    if (currentYear < 1965) return `Canadian Red Ensign · ${currentYear}`
    return `Ontario Provincial Flag · ${currentYear}`
  }

  // Cycle through palettes
  const cyclePalette = () => {
    setPaletteIndex((prev) => (prev + 1) % COLOR_PALETTES.length)
  }

  // Cycle through textures
  const cycleTexture = () => {
    setTextureIndex((prev) => (prev + 1) % textures.length)
  }

  // Determine if switches should be disabled (work from 1868+ when Red Ensign starts)
  const switchesDisabled = currentYear < 1868

  // State for showing keyboard hints
  const [showKeyboardHints, setShowKeyboardHints] = useState(false)

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    const minYear = 1763
    const maxYear = 2025

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        setCurrentYear(prev => toYear(Math.max(minYear, prev - (e.shiftKey ? 10 : 1))))
        break
      case 'ArrowRight':
        e.preventDefault()
        setCurrentYear(prev => toYear(Math.min(maxYear, prev + (e.shiftKey ? 10 : 1))))
        break
      case 'ArrowUp':
        e.preventDefault()
        // Jump to next key year
        const nextKeyYear = KEY_YEARS.find(y => y > currentYear)
        if (nextKeyYear) setCurrentYear(nextKeyYear)
        break
      case 'ArrowDown':
        e.preventDefault()
        // Jump to previous key year
        const prevKeyYear = [...KEY_YEARS].reverse().find(y => y < currentYear)
        if (prevKeyYear) setCurrentYear(prevKeyYear)
        break
      case 'Home':
        e.preventDefault()
        setCurrentYear(toYear(minYear))
        break
      case 'End':
        e.preventDefault()
        setCurrentYear(toYear(maxYear))
        break
      case 'u':
      case 'U':
        if (!switchesDisabled) setShowUnionJack(prev => !prev)
        break
      case 's':
      case 'S':
        if (!switchesDisabled) setShowShield(prev => !prev)
        break
      case 'p':
      case 'P':
        cyclePalette()
        break
      case 't':
      case 'T':
        cycleTexture()
        break
      case '?':
        setShowKeyboardHints(prev => !prev)
        break
    }
  }, [currentYear, switchesDisabled])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <main className="min-h-screen flex flex-col bg-[#0a0a08]">
      {/* Header */}
      <header className="border-b border-[#2a2520] px-4 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-3xl font-light tracking-tight">
              <span className="text-[#c9a86c]">Ontario Flag</span>
              <span className="text-[#6b6560]"> Time Machine</span>
            </h1>
            <p className="text-[9px] md:text-[10px] tracking-[0.3em] text-[#8b8580] mt-1 font-mono uppercase">
              by Julio Calvo
            </p>
          </div>
          
          {/* Era indicator */}
          <div className="text-right hidden md:block">
            <p className="text-[10px] tracking-[0.2em] text-[#b5a5a0] font-mono">CURRENT ERA</p>
            <p className="text-lg text-[#c9a86c]">{currentEra?.name}</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col xl:flex-row">

        {/* Flag display area */}
        <div className="flex-1 flex justify-center p-6 md:p-8">
          <div className="w-full max-w-3xl">

            {/* Historical context - cinematic style above flag */}
            <div className="mb-6 md:mb-8 text-center h-24 md:h-28 flex flex-col justify-end">
              <p className="text-[10px] md:text-xs tracking-[0.2em] text-[#9b9590] font-mono uppercase mb-2">
                {currentEra?.name} · {currentEra?.description}
              </p>
              <p className="text-sm md:text-base text-[#b5a595] leading-relaxed font-serif max-w-2xl mx-auto italic line-clamp-3">
                {currentEra?.historicalContext}
              </p>
            </div>

            {/* Flag frame - wrapper with padding for the frame */}
            <div className="p-4 md:p-6">
              <div className="relative">
                {/* Outer frame - wood effect */}
                <div
                  className="absolute bg-gradient-to-b from-[#5d3a1a] via-[#8b4513] to-[#5d3a1a] rounded-sm"
                  style={{
                    top: '-16px',
                    left: '-16px',
                    right: '-16px',
                    bottom: '-16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.1)'
                  }}
                />

                {/* Inner frame - brass */}
                <div
                  className="absolute bg-gradient-to-b from-[#d4b896] via-[#c9a86c] to-[#8b7355] rounded-sm"
                  style={{
                    top: '-8px',
                    left: '-8px',
                    right: '-8px',
                    bottom: '-8px',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                />

                {/* Flag container */}
                <div className="relative bg-[#1a1510] p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                  <OntarioFlag
                    config={flagConfig}
                    palette={currentPalette}
                    year={currentYear}
                    className="w-full transition-all duration-500"
                  />
                </div>

                {/* Corner screws - positioned relative to the frame edges */}
                <div className="brass-screw" style={{ position: 'absolute', top: '-12px', left: '-12px' }} />
                <div className="brass-screw" style={{ position: 'absolute', top: '-12px', right: '-12px' }} />
                <div className="brass-screw" style={{ position: 'absolute', bottom: '-12px', left: '-12px' }} />
                <div className="brass-screw" style={{ position: 'absolute', bottom: '-12px', right: '-12px' }} />
              </div>
            </div>

            {/* Flag info plate and keyboard hint button */}
            <div className="mt-8 md:mt-12 flex items-center justify-center gap-4">
              <div className="inline-block plate-label">
                {getFlagPlateLabel()}
              </div>
              {/* Keyboard shortcuts hint button */}
              <button
                onClick={() => setShowKeyboardHints(true)}
                className="
                  hidden md:flex items-center justify-center
                  w-8 h-8 rounded-full
                  bg-gradient-to-b from-[#2a2520] to-[#1a1510]
                  border border-[#3a3530]
                  text-[#6b6560] text-sm font-mono
                  hover:border-[#4a4540] hover:text-[#c9a86c]
                  transition-all
                "
                title="Keyboard shortcuts"
              >
                ?
              </button>
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="xl:w-96 border-t xl:border-t-0 xl:border-l border-[#2a2520] bg-[#0d0d0a]">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Year lever section */}
            <section>
              <div className="plate-label inline-block mb-6">
                Temporal Control
              </div>
              <YearLever
                currentYear={currentYear}
                onYearChange={setCurrentYear}
                design="dial"
              />
            </section>

            {/* Switches section */}
            <section className="border-t border-[#2a2520] pt-8">
              <div className="plate-label inline-block mb-4">
                Element Controls
              </div>
              
              {switchesDisabled && (
                <p className="text-[10px] text-[#b5a5a0] mb-4 italic">
                  Controls available from 1868 (Red Ensign era)
                </p>
              )}
              
              <div className={`flex justify-center gap-8 md:gap-12 ${switchesDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <VintageSwitch
                  label="Union Jack"
                  description="British canton"
                  isOn={showUnionJack}
                  onToggle={setShowUnionJack}
                  design="classic"
                />
                <VintageSwitch
                  label="Shield"
                  description="Provincial arms"
                  isOn={showShield}
                  onToggle={setShowShield}
                  design="classic"
                />
              </div>
            </section>

            {/* Style controls */}
            <section className="border-t border-[#2a2520] pt-8">
              <div className="plate-label inline-block mb-6">
                Appearance
              </div>
              
              <div className="space-y-4">
                {/* Palette selector */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.15em] text-[#b5a5a0] font-mono uppercase">
                    Palette
                  </span>
                  <button
                    onClick={cyclePalette}
                    className="
                      px-4 py-2
                      bg-gradient-to-b from-[#2a2520] to-[#1a1510]
                      border border-[#3a3530]
                      text-[11px] tracking-[0.1em] text-[#c9a86c]
                      font-mono uppercase
                      hover:border-[#4a4540]
                      active:bg-[#151210]
                      transition-all
                    "
                  >
                    {currentPalette.name}
                  </button>
                </div>

                {/* Texture selector */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] tracking-[0.15em] text-[#b5a5a0] font-mono uppercase">
                    Texture
                  </span>
                  <button
                    onClick={cycleTexture}
                    className="
                      px-4 py-2
                      bg-gradient-to-b from-[#2a2520] to-[#1a1510]
                      border border-[#3a3530]
                      text-[11px] tracking-[0.1em] text-[#c9a86c]
                      font-mono uppercase
                      hover:border-[#4a4540]
                      active:bg-[#151210]
                      transition-all
                    "
                  >
                    {textures[textureIndex]}
                  </button>
                </div>
              </div>
            </section>

            {/* Download section */}
            <section className="border-t border-[#2a2520] pt-8">
              <div className="plate-label inline-block mb-6">
                Export
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.15em] text-[#b5a5a0] font-mono uppercase">
                  Save Flag
                </span>
                <DownloadButton
                  flagSrc={getFlagForYear(currentYear).src}
                  year={currentYear}
                  era={getFlagForYear(currentYear).era}
                />
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2520] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[9px] tracking-[0.2em] text-[#9a9590] font-mono">
            TYPESCRIPT · NEXT.JS · CANADIAN HISTORY
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/juliocalvorios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6560] hover:text-[#c9a86c] transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/juliocalvorios"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6560] hover:text-[#c9a86c] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <p className="text-[9px] tracking-[0.2em] text-[#9a9590] font-mono">
              BUILT BY JULIO CALVO · TORONTO · {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      {/* Keyboard shortcuts modal */}
      {showKeyboardHints && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeyboardHints(false)}
        >
          <div
            className="bg-gradient-to-b from-[#1a1510] to-[#0d0d0a] border border-[#2a2520] rounded-sm p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#c9a86c] font-serif text-lg">Keyboard Shortcuts</h2>
              <button
                onClick={() => setShowKeyboardHints(false)}
                className="text-[#6b6560] hover:text-[#c9a86c] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b border-[#2a2520] pb-3">
                <p className="text-[10px] text-[#6b6560] font-mono uppercase tracking-wider mb-2">Navigation</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">←</kbd>
                    <span className="text-[#b5a5a0]">-1 year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">→</kbd>
                    <span className="text-[#b5a5a0]">+1 year</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">Shift+←</kbd>
                    <span className="text-[#b5a5a0]">-10 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">Shift+→</kbd>
                    <span className="text-[#b5a5a0]">+10 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">↑</kbd>
                    <span className="text-[#b5a5a0]">Next era</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">↓</kbd>
                    <span className="text-[#b5a5a0]">Prev era</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">Home</kbd>
                    <span className="text-[#b5a5a0]">1763</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">End</kbd>
                    <span className="text-[#b5a5a0]">2025</span>
                  </div>
                </div>
              </div>

              <div className="border-b border-[#2a2520] pb-3">
                <p className="text-[10px] text-[#6b6560] font-mono uppercase tracking-wider mb-2">Toggles</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">U</kbd>
                    <span className="text-[#b5a5a0]">Union Jack</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">S</kbd>
                    <span className="text-[#b5a5a0]">Shield</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">P</kbd>
                    <span className="text-[#b5a5a0]">Palette</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">T</kbd>
                    <span className="text-[#b5a5a0]">Texture</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-[#6b6560] font-mono uppercase tracking-wider mb-2">Other</p>
                <div className="flex items-center gap-2 text-sm">
                  <kbd className="px-2 py-1 bg-[#2a2520] text-[#c9a86c] rounded text-xs font-mono">?</kbd>
                  <span className="text-[#b5a5a0]">Toggle this help</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
