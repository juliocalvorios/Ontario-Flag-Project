'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Year, toYear } from '@/types'
import { KEY_YEARS, HISTORICAL_EVENTS } from '@/data/history'

export type LeverDesign = 'classic' | 'dial' | 'railway' | 'telegraph' | 'filmreel' | 'clockwork'

interface YearLeverProps {
  currentYear: Year
  onYearChange: (year: Year) => void
  minYear?: Year
  maxYear?: Year
  design?: LeverDesign
}

/**
 * A vintage industrial lever for selecting years
 * Clicks into notches at key historical moments
 */
export function YearLever({
  currentYear,
  onYearChange,
  minYear = toYear(1763),
  maxYear = toYear(2025),
  design = 'classic'
}: YearLeverProps) {
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Convert year to percentage position
  const yearToPercent = (year: Year): number => {
    return ((year - minYear) / (maxYear - minYear)) * 100
  }

  // Convert percentage to year, snapping to notches
  const percentToYear = useCallback((percent: number): Year => {
    const rawYear = minYear + (percent / 100) * (maxYear - minYear)

    // Find closest notch
    let closestYear = KEY_YEARS[0]
    let minDiff = Math.abs(rawYear - KEY_YEARS[0])

    for (const notchYear of KEY_YEARS) {
      const diff = Math.abs(rawYear - notchYear)
      if (diff < minDiff) {
        minDiff = diff
        closestYear = notchYear
      }
    }

    // Snap if within 8 years of a notch for smoother snapping
    if (minDiff <= 8) {
      return closestYear
    }

    return toYear(Math.round(rawYear))
  }, [minYear, maxYear])

  // Get current event if on a key year
  const currentEvent = HISTORICAL_EVENTS.find(e => e.year === currentYear)

  const handleMove = useCallback((clientX: number) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const newYear = percentToYear(percent)

    if (newYear !== currentYear) {
      onYearChange(newYear)
    }
  }, [percentToYear, currentYear, onYearChange])

  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true)
    handleMove(clientX)
  }, [handleMove])

  const handleEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX)
  }

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return
    const touch = e.touches[0]
    handleMove(touch.clientX)
  }, [isDragging, handleMove])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }, [isDragging, handleMove])

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      // Touch events
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', handleEnd)
      window.addEventListener('touchcancel', handleEnd)

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleEnd)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleEnd)
        window.removeEventListener('touchcancel', handleEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleEnd])

  // Render appropriate lever design
  const renderLever = () => {
    const commonProps = {
      trackRef,
      currentYear,
      yearToPercent,
      isDragging,
      handleMouseDown,
      handleTouchStart,
      onYearChange
    }

    switch (design) {
      case 'dial':
        return <DialLever {...commonProps} />
      case 'railway':
        return <RailwayLever {...commonProps} />
      case 'telegraph':
        return <TelegraphLever {...commonProps} />
      case 'filmreel':
        return <FilmreelLever {...commonProps} />
      case 'clockwork':
        return <ClockworkLever {...commonProps} />
      case 'classic':
      default:
        return <ClassicLever {...commonProps} />
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Year display - vintage nixie tube style */}
      <div className="flex justify-center mb-6">
        <div className="
          relative px-8 py-4
          bg-gradient-to-b from-[#0a0805] to-[#151210]
          border-2 border-[#3a3025]
          rounded-sm
          shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),0_4px_8px_rgba(0,0,0,0.4)]
        ">
          {/* Nixie tube glass effect */}
          <div className="absolute inset-2 bg-gradient-to-b from-[#1a1510]/50 to-transparent rounded-sm" />

          {/* Year digits */}
          <div className="relative flex items-baseline gap-1">
            {String(currentYear).split('').map((digit, i) => (
              <span
                key={i}
                className="
                  text-5xl font-mono font-bold
                  text-[#ff6b35]
                  drop-shadow-[0_0_10px_rgba(255,107,53,0.8)]
                  transition-all duration-150
                "
                style={{
                  textShadow: '0 0 20px rgba(255,107,53,0.6), 0 0 40px rgba(255,107,53,0.4)'
                }}
              >
                {digit}
              </span>
            ))}
          </div>

          {/* Label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="text-[10px] tracking-[0.3em] text-[#b5a5a0] font-mono">
              TEMPORAL POSITION
            </span>
          </div>
        </div>
      </div>

      {/* Event display */}
      <div className="h-16 flex items-center justify-center mb-4">
        {currentEvent ? (
          <div className="text-center animate-fade-in">
            <p className="text-sm text-[#c9a86c] font-serif">{currentEvent.title}</p>
            <p className="text-xs text-[#b5a5a0] mt-1">{currentEvent.flagImpact}</p>
          </div>
        ) : (
          <p className="text-xs text-[#a5a0a0] italic">Move lever to a key year...</p>
        )}
      </div>

      {/* Lever mechanism - render based on design */}
      {renderLever()}

      {/* Year labels - show only key years with good spacing */}
      <div className="relative h-8 mt-2 px-4">
        {KEY_YEARS.filter((year) => {
          const importantYears = [1763, 1867, 1922, 1965, 2025]
          return importantYears.includes(year)
        }).map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`
              absolute -translate-x-1/2
              text-[10px] font-mono
              transition-all duration-300
              hover:text-[#c9a86c]
              ${year === currentYear
                ? 'text-[#c9a86c] scale-110'
                : 'text-[#b5a5a0]'
              }
            `}
            style={{ left: `calc(${yearToPercent(year)}% + 16px)` }}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  )
}

// Common props for lever designs
interface LeverDesignProps {
  trackRef: React.RefObject<HTMLDivElement>
  currentYear: Year
  yearToPercent: (year: Year) => number
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent) => void
  handleTouchStart: (e: React.TouchEvent) => void
  onYearChange: (year: Year) => void
}

// ============================================
// Design 1: Classic - Original brass lever
// ============================================
function ClassicLever({ trackRef, currentYear, yearToPercent, isDragging, handleMouseDown, handleTouchStart }: LeverDesignProps) {
  return (
    <div className="relative px-4">
      <div className="
        relative h-4
        bg-gradient-to-b from-[#2a2520] via-[#1a1510] to-[#2a2520]
        border-y-2 border-[#3a3025]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]
      ">
        <div
          ref={trackRef}
          className="
            absolute top-1/2 -translate-y-1/2 left-4 right-4
            h-2
            bg-gradient-to-b from-[#0a0805] to-[#151210]
            rounded-full
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]
            cursor-pointer
          "
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {KEY_YEARS.map(year => (
            <div
              key={year}
              className={`
                absolute top-1/2 -translate-y-1/2 w-1 h-4
                ${year === currentYear ? 'bg-[#c9a86c]' : 'bg-[#3a3530]'}
                transition-colors duration-300
              `}
              style={{ left: `${yearToPercent(year)}%` }}
            />
          ))}

          <div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              w-8 h-12
              ${isDragging ? 'scale-105' : 'scale-100'}
            `}
            style={{
              left: `${yearToPercent(currentYear)}%`,
              transition: isDragging ? 'transform 0.1s ease-out' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out'
            }}
          >
            <div className="
              absolute bottom-0 left-1/2 -translate-x-1/2
              w-6 h-4
              bg-gradient-to-b from-[#4a4035] to-[#2a2520]
              rounded-b-sm
              border-x border-b border-[#5a5045]
            " />

            <div className="
              absolute bottom-2 left-1/2 -translate-x-1/2
              w-4 h-10
              bg-gradient-to-b from-[#d4b896] via-[#c9a86c] to-[#8b7355]
              rounded-t-full rounded-b-sm
              border border-[#a08050]
              shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
              cursor-grab
              active:cursor-grabbing
            ">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-2 h-px bg-[#8b7355]" />
                ))}
              </div>

              <div className="
                absolute -top-1 left-1/2 -translate-x-1/2
                w-2 h-2 rounded-full
                bg-[#ff6b35]
                shadow-[0_0_8px_rgba(255,107,53,0.8)]
              " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Design 2: Dial - Rotary phone style
// ============================================
function DialLever({ trackRef, currentYear, yearToPercent, isDragging, handleMouseDown, handleTouchStart }: LeverDesignProps) {
  return (
    <div className="relative px-4">
      <div className="
        relative h-6
        bg-gradient-to-b from-[#1a1510] to-[#252015]
        border-2 border-[#3a3025]
        rounded-full
        shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]
      ">
        <div
          ref={trackRef}
          className="
            absolute top-1/2 -translate-y-1/2 left-4 right-4
            h-4
            bg-gradient-to-b from-[#0a0805] to-[#151210]
            rounded-full
            shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]
            cursor-pointer
          "
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Dial holes/notches */}
          {KEY_YEARS.map(year => (
            <div
              key={year}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-3 h-3 rounded-full
                ${year === currentYear
                  ? 'bg-[#c9a86c] shadow-[0_0_6px_rgba(201,168,108,0.6)]'
                  : 'bg-[#2a2520] border border-[#3a3530]'}
                transition-all duration-300
              `}
              style={{ left: `${yearToPercent(year)}%` }}
            />
          ))}

          {/* Dial finger wheel */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              w-10 h-10
              ${isDragging ? 'scale-110' : 'scale-100'}
            `}
            style={{
              left: `${yearToPercent(currentYear)}%`,
              transition: isDragging ? 'transform 0.1s ease-out' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out'
            }}
          >
            <div className="
              w-full h-full rounded-full
              bg-gradient-to-br from-[#d4b896] via-[#c9a86c] to-[#8b7355]
              border-2 border-[#a08050]
              shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.3)]
              cursor-grab active:cursor-grabbing
            ">
              {/* Center hole */}
              <div className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-4 h-4 rounded-full
                bg-gradient-to-b from-[#0a0805] to-[#1a1510]
                border border-[#3a3025]
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]
              " />
              {/* Finger stop */}
              <div className="
                absolute top-1 left-1/2 -translate-x-1/2
                w-2 h-2 rounded-full
                bg-[#ff6b35]
                shadow-[0_0_6px_rgba(255,107,53,0.8)]
              " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Design 3: Railway - Train switch lever
// ============================================
function RailwayLever({ trackRef, currentYear, yearToPercent, isDragging, handleMouseDown, handleTouchStart }: LeverDesignProps) {
  return (
    <div className="relative px-4">
      {/* Railway track ties */}
      <div className="
        relative h-8
        bg-gradient-to-b from-[#3a3025] via-[#2a2015] to-[#3a3025]
        border-2 border-[#4a4035]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]
      ">
        {/* Wooden ties */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-[#5d3a1a] via-[#8b4513] to-[#5d3a1a]"
            style={{ left: `${i * 5.26}%` }}
          />
        ))}

        {/* Metal rails */}
        <div className="absolute top-2 left-4 right-4 h-1 bg-gradient-to-b from-[#8a8a8a] via-[#c0c0c0] to-[#6a6a6a] rounded-full" />
        <div className="absolute bottom-2 left-4 right-4 h-1 bg-gradient-to-b from-[#8a8a8a] via-[#c0c0c0] to-[#6a6a6a] rounded-full" />

        <div
          ref={trackRef}
          className="absolute inset-0 cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Switch points */}
          {KEY_YEARS.map(year => (
            <div
              key={year}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-2 h-6
                ${year === currentYear
                  ? 'bg-[#c9a86c]'
                  : 'bg-[#6a6a6a]'}
                transition-colors duration-300
                rounded-sm
              `}
              style={{ left: `${yearToPercent(year)}%` }}
            />
          ))}

          {/* Railway switch lever */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              ${isDragging ? 'scale-105' : 'scale-100'}
            `}
            style={{
              left: `${yearToPercent(currentYear)}%`,
              transition: isDragging ? 'transform 0.1s ease-out' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out'
            }}
          >
            {/* Lever base */}
            <div className="
              w-8 h-8 rounded-full
              bg-gradient-to-br from-[#4a4540] to-[#2a2520]
              border-2 border-[#5a5550]
              shadow-[0_4px_8px_rgba(0,0,0,0.5)]
            " />
            {/* Lever arm */}
            <div className="
              absolute -top-8 left-1/2 -translate-x-1/2
              w-3 h-10
              bg-gradient-to-r from-[#8a8a8a] via-[#b0b0b0] to-[#8a8a8a]
              rounded-t-full
              border border-[#6a6a6a]
              shadow-[0_2px_4px_rgba(0,0,0,0.4)]
            ">
              {/* Ball grip */}
              <div className="
                absolute -top-2 left-1/2 -translate-x-1/2
                w-5 h-5 rounded-full
                bg-gradient-to-br from-[#ff4444] to-[#aa0000]
                border border-[#880000]
                shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.3)]
              " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Design 4: Telegraph - Morse key style
// ============================================
function TelegraphLever({ trackRef, currentYear, yearToPercent, isDragging, handleMouseDown, handleTouchStart }: LeverDesignProps) {
  return (
    <div className="relative px-4">
      <div className="
        relative h-5
        bg-gradient-to-b from-[#1a1510] to-[#0a0805]
        border-2 border-[#3a3025]
        rounded-sm
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]
      ">
        {/* Wire/connection line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-0.5 bg-[#c9a86c]" />

        <div
          ref={trackRef}
          className="absolute inset-0 left-4 right-4 cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Contact points */}
          {KEY_YEARS.map(year => (
            <div
              key={year}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-2 h-2 rounded-full
                ${year === currentYear
                  ? 'bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.8)]'
                  : 'bg-[#c9a86c]'}
                transition-all duration-300
              `}
              style={{ left: `${yearToPercent(year)}%` }}
            />
          ))}

          {/* Telegraph key */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              ${isDragging ? 'scale-105' : 'scale-100'}
            `}
            style={{
              left: `${yearToPercent(currentYear)}%`,
              transition: isDragging ? 'transform 0.1s ease-out' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out'
            }}
          >
            {/* Key base */}
            <div className="
              w-14 h-6
              bg-gradient-to-b from-[#5d3a1a] via-[#8b4513] to-[#5d3a1a]
              rounded-sm
              border border-[#4a3015]
              shadow-[0_4px_8px_rgba(0,0,0,0.5)]
            ">
              {/* Brass contacts */}
              <div className="absolute top-1 left-1 w-2 h-1 bg-gradient-to-b from-[#d4b896] to-[#8b7355] rounded-sm" />
              <div className="absolute top-1 right-1 w-2 h-1 bg-gradient-to-b from-[#d4b896] to-[#8b7355] rounded-sm" />
            </div>
            {/* Key paddle */}
            <div className="
              absolute -top-3 left-1/2 -translate-x-1/2
              w-10 h-4
              bg-gradient-to-b from-[#d4b896] via-[#c9a86c] to-[#8b7355]
              rounded-full
              border border-[#a08050]
              shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
              cursor-grab active:cursor-grabbing
            ">
              {/* Knob */}
              <div className="
                absolute -top-2 left-1/2 -translate-x-1/2
                w-4 h-4 rounded-full
                bg-gradient-to-br from-[#1a1510] to-[#0a0805]
                border border-[#3a3025]
              " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Design 5: Film Reel - Cinema projector style
// ============================================
function FilmreelLever({ trackRef, currentYear, yearToPercent, isDragging, handleMouseDown, handleTouchStart }: LeverDesignProps) {
  return (
    <div className="relative px-4">
      {/* Film strip track */}
      <div className="
        relative h-8
        bg-gradient-to-b from-[#1a1510] to-[#0a0805]
        border-2 border-[#3a3025]
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]
      ">
        {/* Sprocket holes top */}
        <div className="absolute top-1 left-4 right-4 flex justify-between">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-[#3a3025] rounded-sm" />
          ))}
        </div>
        {/* Sprocket holes bottom */}
        <div className="absolute bottom-1 left-4 right-4 flex justify-between">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-[#3a3025] rounded-sm" />
          ))}
        </div>

        <div
          ref={trackRef}
          className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-3 cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Frame markers */}
          {KEY_YEARS.map(year => (
            <div
              key={year}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-4 h-3
                ${year === currentYear
                  ? 'bg-[#c9a86c] border-[#d4b896]'
                  : 'bg-[#2a2520] border-[#3a3530]'}
                border
                transition-all duration-300
              `}
              style={{ left: `${yearToPercent(year)}%` }}
            />
          ))}

          {/* Projector head */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              ${isDragging ? 'scale-105' : 'scale-100'}
            `}
            style={{
              left: `${yearToPercent(currentYear)}%`,
              transition: isDragging ? 'transform 0.1s ease-out' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out'
            }}
          >
            {/* Reel wheel */}
            <div className="
              w-12 h-12 rounded-full
              bg-gradient-to-br from-[#4a4540] to-[#2a2520]
              border-2 border-[#5a5550]
              shadow-[0_4px_12px_rgba(0,0,0,0.6)]
              cursor-grab active:cursor-grabbing
            ">
              {/* Spokes */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-full h-0.5 bg-[#3a3530]"
                  style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg)` }}
                />
              ))}
              {/* Center hub */}
              <div className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-4 h-4 rounded-full
                bg-gradient-to-br from-[#c9a86c] to-[#8b7355]
                border border-[#a08050]
              " />
              {/* Light indicator */}
              <div className="
                absolute -top-1 left-1/2 -translate-x-1/2
                w-2 h-2 rounded-full
                bg-[#ff6b35]
                shadow-[0_0_8px_rgba(255,107,53,0.8)]
              " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Design 6: Clockwork - Gear mechanism style
// ============================================
function ClockworkLever({ trackRef, currentYear, yearToPercent, isDragging, handleMouseDown, handleTouchStart }: LeverDesignProps) {
  return (
    <div className="relative px-4">
      <div className="
        relative h-6
        bg-gradient-to-b from-[#1a1510] to-[#0a0805]
        border-2 border-[#3a3025]
        rounded-sm
        shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]
        overflow-hidden
      ">
        {/* Gear teeth pattern */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="flex-1 mx-px bg-gradient-to-b from-[#c9a86c] to-[#8b7355]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="flex-1 mx-px bg-gradient-to-t from-[#c9a86c] to-[#8b7355]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
          ))}
        </div>

        <div
          ref={trackRef}
          className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-3 cursor-pointer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Pivot points */}
          {KEY_YEARS.map(year => (
            <div
              key={year}
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                w-2 h-2 rounded-full
                ${year === currentYear
                  ? 'bg-[#ff6b35] shadow-[0_0_6px_rgba(255,107,53,0.8)]'
                  : 'bg-[#c9a86c]'}
                transition-all duration-300
              `}
              style={{ left: `${yearToPercent(year)}%` }}
            />
          ))}

          {/* Main gear */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              ${isDragging ? 'scale-105' : 'scale-100'}
            `}
            style={{
              left: `${yearToPercent(currentYear)}%`,
              transition: isDragging ? 'transform 0.1s ease-out' : 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease-out'
            }}
          >
            <div
              className="
                w-14 h-14 rounded-full
                bg-gradient-to-br from-[#d4b896] via-[#c9a86c] to-[#8b7355]
                border-2 border-[#a08050]
                shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.2)]
                cursor-grab active:cursor-grabbing
              "
              style={{
                clipPath: 'polygon(50% 0%, 61% 5%, 70% 2%, 79% 10%, 85% 5%, 90% 15%, 98% 15%, 98% 25%, 100% 35%, 95% 40%, 100% 50%, 95% 60%, 100% 65%, 98% 75%, 98% 85%, 90% 85%, 85% 95%, 79% 90%, 70% 98%, 61% 95%, 50% 100%, 39% 95%, 30% 98%, 21% 90%, 15% 95%, 10% 85%, 2% 85%, 2% 75%, 0% 65%, 5% 60%, 0% 50%, 5% 40%, 0% 35%, 2% 25%, 2% 15%, 10% 15%, 15% 5%, 21% 10%, 30% 2%, 39% 5%)'
              }}
            >
              {/* Inner circle */}
              <div className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-8 h-8 rounded-full
                bg-gradient-to-br from-[#2a2520] to-[#1a1510]
                border border-[#3a3025]
              " />
              {/* Center axle */}
              <div className="
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-3 h-3 rounded-full
                bg-gradient-to-br from-[#c9a86c] to-[#8b7355]
                border border-[#a08050]
              " />
              {/* Indicator */}
              <div className="
                absolute top-2 left-1/2 -translate-x-1/2
                w-1 h-2
                bg-[#ff6b35]
                shadow-[0_0_4px_rgba(255,107,53,0.8)]
              " />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// TODO: add mobile touch support
