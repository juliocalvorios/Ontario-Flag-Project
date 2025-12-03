'use client'

import { useState } from 'react'
import { VintageSwitch, YearLever, OntarioFlag } from '@/components'
import { Year, toYear, FlagConfig } from '@/types'
import { FLAG_CONFIGS, COLOR_PALETTES, ERAS } from '@/data/history'

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
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-3xl">

            {/* Historical context - cinematic style above flag */}
            {/* Fixed height container to prevent layout shift when text changes */}
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

            {/* Flag info plate */}
            <div className="mt-8 md:mt-12 text-center">
              <div className="inline-block plate-label">
                {getFlagPlateLabel()}
              </div>
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

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2a2520] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[9px] tracking-[0.2em] text-[#9a9590] font-mono">
            TYPESCRIPT · NEXT.JS · CANADIAN HISTORY
          </p>
          <p className="text-[9px] tracking-[0.2em] text-[#9a9590] font-mono">
            BUILT BY JULIO CALVO · TORONTO · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  )
}
