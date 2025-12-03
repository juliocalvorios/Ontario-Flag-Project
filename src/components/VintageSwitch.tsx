'use client'

import { useState } from 'react'

export type SwitchDesign = 'classic' | 'lever' | 'rocker' | 'rotary' | 'pushbutton' | 'knife'

interface VintageSwitchProps {
  label: string
  description?: string
  isOn: boolean
  onToggle: (value: boolean) => void
  disabled?: boolean
  design?: SwitchDesign
}

/**
 * A vintage-style toggle switch with multiple design options
 * Brass fittings, bakelite base, satisfying click
 */
export function VintageSwitch({
  label,
  description,
  isOn,
  onToggle,
  disabled = false,
  design = 'classic'
}: VintageSwitchProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    if (disabled) return
    onToggle(!isOn)
  }

  // Render the appropriate switch design
  const renderSwitch = () => {
    switch (design) {
      case 'lever':
        return <LeverSwitch isOn={isOn} isPressed={isPressed} />
      case 'rocker':
        return <RockerSwitch isOn={isOn} isPressed={isPressed} />
      case 'rotary':
        return <RotarySwitch isOn={isOn} isPressed={isPressed} />
      case 'pushbutton':
        return <PushbuttonSwitch isOn={isOn} isPressed={isPressed} />
      case 'knife':
        return <KnifeSwitch isOn={isOn} isPressed={isPressed} />
      case 'classic':
      default:
        return <ClassicSwitch isOn={isOn} isPressed={isPressed} />
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Label plate */}
      <div className="relative">
        <div className="
          px-3 py-1
          bg-gradient-to-b from-[#2a2520] to-[#1a1510]
          border border-[#3a3530]
          text-[10px] tracking-[0.2em] text-[#d4c4b0]
          font-mono uppercase
          shadow-inner
        ">
          {label}
        </div>
        {/* Screws */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-[#c9a86c] to-[#8b7355] shadow-sm" />
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gradient-to-br from-[#c9a86c] to-[#8b7355] shadow-sm" />
      </div>

      {/* Switch housing */}
      <div
        className={`
          relative
          ${disabled ? 'opacity-50' : 'cursor-pointer'}
        `}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        {renderSwitch()}
      </div>

      {/* Description */}
      {description && (
        <p className="text-[9px] text-[#b5a5a0] text-center max-w-20 leading-tight">
          {description}
        </p>
      )}
    </div>
  )
}

// ============================================
// Design 1: Classic - Original vertical slider
// ============================================
function ClassicSwitch({ isOn, isPressed }: { isOn: boolean; isPressed: boolean }) {
  return (
    <div className="
      w-16 h-24
      bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1510]
      border-2 border-[#3a3025]
      rounded-sm
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]
    ">
      {/* Status indicator lights */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2">
        <div className={`
          w-2 h-2 rounded-full
          transition-all duration-300
          ${isOn
            ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'
            : 'bg-[#2a2520]'
          }
        `} />
        <div className={`
          w-2 h-2 rounded-full
          transition-all duration-300
          ${!isOn
            ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
            : 'bg-[#2a2520]'
          }
        `} />
      </div>

      {/* Switch track */}
      <div className="
        absolute top-8 left-1/2 -translate-x-1/2
        w-6 h-12
        bg-gradient-to-b from-[#0a0805] to-[#151210]
        rounded-full
        border border-[#3a3025]
        shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]
      ">
        {/* Switch lever */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2
            w-5 h-6
            bg-gradient-to-b from-[#d4b896] via-[#c9a86c] to-[#8b7355]
            rounded-sm
            border border-[#a08050]
            shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]
            transition-all duration-150 ease-out
            ${isOn ? 'top-1' : 'top-5'}
            ${isPressed ? 'scale-95' : 'scale-100'}
          `}
        >
          {/* Grip lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-0.5">
            <div className="w-3 h-px bg-[#8b7355]" />
            <div className="w-3 h-px bg-[#8b7355]" />
            <div className="w-3 h-px bg-[#8b7355]" />
          </div>
        </div>
      </div>

      {/* ON/OFF labels */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className={`text-[8px] font-mono transition-colors ${isOn ? 'text-green-400' : 'text-[#7a7570]'}`}>
          ON
        </span>
        <span className={`text-[8px] font-mono transition-colors ${!isOn ? 'text-red-400' : 'text-[#7a7570]'}`}>
          OFF
        </span>
      </div>
    </div>
  )
}

// ============================================
// Design 2: Lever - Industrial big lever style
// ============================================
function LeverSwitch({ isOn, isPressed }: { isOn: boolean; isPressed: boolean }) {
  return (
    <div className="
      w-20 h-28
      bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1510]
      border-2 border-[#3a3025]
      rounded-sm
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]
      flex flex-col items-center justify-center
    ">
      {/* Pivot point and lever */}
      <div className="relative w-full h-20 flex items-center justify-center">
        {/* Pivot base plate */}
        <div className="
          absolute bottom-4
          w-10 h-6
          bg-gradient-to-b from-[#3a3530] to-[#252015]
          rounded-sm
          border border-[#4a4540]
          shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]
        " />

        {/* Pivot center */}
        <div className="
          absolute bottom-5
          w-4 h-4
          bg-gradient-to-br from-[#c9a86c] to-[#8b7355]
          rounded-full
          border border-[#a08050]
          shadow-[0_1px_2px_rgba(0,0,0,0.4)]
          z-10
        " />

        {/* Lever arm */}
        <div
          className={`
            absolute bottom-6 origin-bottom
            w-3 h-16
            bg-gradient-to-r from-[#4a4540] via-[#5a5550] to-[#4a4540]
            rounded-t-full
            border border-[#3a3530]
            shadow-[0_2px_4px_rgba(0,0,0,0.4)]
            transition-transform duration-200 ease-out
            ${isPressed ? 'scale-95' : ''}
          `}
          style={{
            transform: `rotate(${isOn ? -35 : 35}deg) ${isPressed ? 'scale(0.95)' : ''}`
          }}
        >
          {/* Lever ball grip */}
          <div className="
            absolute -top-3 left-1/2 -translate-x-1/2
            w-6 h-6
            bg-gradient-to-br from-[#d4b896] via-[#c9a86c] to-[#8b7355]
            rounded-full
            border border-[#a08050]
            shadow-[0_2px_6px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.3)]
          " />
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-2 flex gap-6 text-[8px] font-mono">
        <span className={`transition-colors ${!isOn ? 'text-red-400' : 'text-[#5a5550]'}`}>OFF</span>
        <span className={`transition-colors ${isOn ? 'text-green-400' : 'text-[#5a5550]'}`}>ON</span>
      </div>
    </div>
  )
}

// ============================================
// Design 3: Rocker - Light switch style
// ============================================
function RockerSwitch({ isOn, isPressed }: { isOn: boolean; isPressed: boolean }) {
  return (
    <div className="
      w-14 h-24
      bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1510]
      border-2 border-[#3a3025]
      rounded-sm
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]
      flex items-center justify-center
    ">
      {/* Rocker frame */}
      <div className="
        relative w-10 h-16
        bg-gradient-to-b from-[#0a0805] to-[#151210]
        rounded-sm
        border border-[#3a3025]
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]
        overflow-hidden
      ">
        {/* Rocker paddle */}
        <div
          className={`
            absolute inset-1
            bg-gradient-to-b from-[#c9a86c] via-[#b5954c] to-[#8b7355]
            rounded-sm
            border border-[#a08050]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]
            transition-transform duration-150 ease-out
            origin-center
            ${isPressed ? 'scale-95' : ''}
          `}
          style={{
            transform: `perspective(100px) rotateX(${isOn ? 15 : -15}deg) ${isPressed ? 'scale(0.95)' : ''}`
          }}
        >
          {/* Divider line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#7a6545]" />

          {/* ON indicator */}
          <div className={`
            absolute top-2 left-1/2 -translate-x-1/2
            w-1.5 h-1.5 rounded-full
            transition-all duration-200
            ${isOn
              ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]'
              : 'bg-[#5a5045]'
            }
          `} />

          {/* OFF indicator */}
          <div className={`
            absolute bottom-2 left-1/2 -translate-x-1/2
            w-1.5 h-1.5 rounded-full
            transition-all duration-200
            ${!isOn
              ? 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'
              : 'bg-[#5a5045]'
            }
          `} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Design 4: Rotary - Round dial switch
// ============================================
function RotarySwitch({ isOn, isPressed }: { isOn: boolean; isPressed: boolean }) {
  return (
    <div className="
      w-20 h-24
      bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1510]
      border-2 border-[#3a3025]
      rounded-sm
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]
      flex flex-col items-center justify-center gap-1
    ">
      {/* Position labels */}
      <div className="flex justify-between w-14 text-[8px] font-mono">
        <span className={`transition-colors ${!isOn ? 'text-red-400' : 'text-[#5a5550]'}`}>OFF</span>
        <span className={`transition-colors ${isOn ? 'text-green-400' : 'text-[#5a5550]'}`}>ON</span>
      </div>

      {/* Dial housing */}
      <div className="
        relative w-14 h-14
        bg-gradient-to-b from-[#0a0805] to-[#151210]
        rounded-full
        border-2 border-[#3a3025]
        shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]
      ">
        {/* Dial knob */}
        <div
          className={`
            absolute inset-2
            bg-gradient-to-br from-[#d4b896] via-[#c9a86c] to-[#8b7355]
            rounded-full
            border border-[#a08050]
            shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.2)]
            transition-transform duration-200 ease-out
            ${isPressed ? 'scale-95' : ''}
          `}
          style={{
            transform: `rotate(${isOn ? 45 : -45}deg) ${isPressed ? 'scale(0.95)' : ''}`
          }}
        >
          {/* Pointer indicator */}
          <div className="
            absolute top-1 left-1/2 -translate-x-1/2
            w-1 h-3
            bg-[#5a4a35]
            rounded-full
          " />

          {/* Center dot */}
          <div className="
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-2 h-2
            bg-gradient-to-br from-[#8b7355] to-[#6a5340]
            rounded-full
          " />

          {/* Grip texture - radial lines */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-px bg-[#9a8a6c]/30"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 22.5}deg)`
              }}
            />
          ))}
        </div>
      </div>

      {/* Status light */}
      <div className={`
        w-2 h-2 rounded-full
        transition-all duration-200
        ${isOn
          ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]'
          : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]'
        }
      `} />
    </div>
  )
}

// ============================================
// Design 5: Pushbutton - Arcade button style
// ============================================
function PushbuttonSwitch({ isOn, isPressed }: { isOn: boolean; isPressed: boolean }) {
  return (
    <div className="
      w-18 h-24
      bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1510]
      border-2 border-[#3a3025]
      rounded-sm
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]
      flex flex-col items-center justify-center gap-2
      px-3
    ">
      {/* Status text */}
      <span className={`
        text-[10px] font-mono font-bold tracking-wider
        transition-colors duration-200
        ${isOn ? 'text-green-400' : 'text-red-400'}
      `}>
        {isOn ? 'ON' : 'OFF'}
      </span>

      {/* Button housing */}
      <div className="
        relative w-12 h-12
        bg-gradient-to-b from-[#2a2520] to-[#0a0805]
        rounded-full
        border-2 border-[#3a3025]
        shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]
      ">
        {/* Button cap */}
        <div
          className={`
            absolute inset-1
            rounded-full
            border border-[#a08050]
            transition-all duration-100 ease-out
            ${isOn
              ? 'bg-gradient-to-b from-[#6ab04c] via-[#4a9030] to-[#3a7020] shadow-[0_0_12px_rgba(74,222,128,0.4),inset_0_2px_0_rgba(255,255,255,0.3)]'
              : 'bg-gradient-to-b from-[#d4b896] via-[#c9a86c] to-[#8b7355] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_2px_0_rgba(255,255,255,0.3)]'
            }
            ${isPressed ? 'scale-90 translate-y-0.5' : 'scale-100'}
          `}
        >
          {/* Highlight */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/20 rounded-full" />
        </div>
      </div>

      {/* Base ring */}
      <div className="
        w-14 h-2
        bg-gradient-to-b from-[#3a3530] to-[#252015]
        rounded-full
        border border-[#4a4540]
        -mt-1
      " />
    </div>
  )
}

// ============================================
// Design 6: Knife - Frankenstein-style knife switch
// ============================================
function KnifeSwitch({ isOn, isPressed }: { isOn: boolean; isPressed: boolean }) {
  return (
    <div className="
      w-24 h-24
      bg-gradient-to-b from-[#1a1510] via-[#252015] to-[#1a1510]
      border-2 border-[#3a3025]
      rounded-sm
      shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_2px_4px_rgba(0,0,0,0.3)]
      flex items-center justify-center
    ">
      {/* Base plate */}
      <div className="relative w-20 h-16">
        {/* Terminal posts */}
        <div className="absolute left-2 top-1 bottom-1 w-3 flex flex-col justify-between">
          <div className="w-3 h-3 bg-gradient-to-br from-[#c9a86c] to-[#8b7355] rounded-full border border-[#a08050] shadow-md" />
          <div className="w-3 h-3 bg-gradient-to-br from-[#c9a86c] to-[#8b7355] rounded-full border border-[#a08050] shadow-md" />
        </div>
        <div className="absolute right-2 top-1 bottom-1 w-3 flex flex-col justify-between">
          <div className="w-3 h-3 bg-gradient-to-br from-[#c9a86c] to-[#8b7355] rounded-full border border-[#a08050] shadow-md" />
          <div className="w-3 h-3 bg-gradient-to-br from-[#c9a86c] to-[#8b7355] rounded-full border border-[#a08050] shadow-md" />
        </div>

        {/* Pivot base */}
        <div className="
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-4 h-4
          bg-gradient-to-br from-[#c9a86c] to-[#8b7355]
          rounded-full
          border border-[#a08050]
          shadow-md
          z-10
        " />

        {/* Knife blade */}
        <div
          className={`
            absolute bottom-2 left-1/2 origin-bottom
            w-2 h-14
            bg-gradient-to-r from-[#8a8a8a] via-[#c0c0c0] to-[#8a8a8a]
            border border-[#6a6a6a]
            shadow-[0_2px_4px_rgba(0,0,0,0.4)]
            transition-transform duration-200 ease-out
            ${isPressed ? 'scale-95' : ''}
          `}
          style={{
            transform: `translateX(-50%) rotate(${isOn ? -45 : 45}deg) ${isPressed ? 'scale(0.95)' : ''}`
          }}
        >
          {/* Handle */}
          <div className="
            absolute -top-4 left-1/2 -translate-x-1/2
            w-5 h-8
            bg-gradient-to-b from-[#5d3a1a] via-[#8b4513] to-[#5d3a1a]
            rounded-t-sm
            border border-[#4a3015]
            shadow-md
          ">
            {/* Handle texture */}
            <div className="absolute inset-x-1 top-2 bottom-2 flex flex-col justify-between">
              <div className="h-px bg-[#3a2510]" />
              <div className="h-px bg-[#3a2510]" />
              <div className="h-px bg-[#3a2510]" />
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-2 text-[7px] font-mono">
          <span className={`transition-colors ${isOn ? 'text-green-400' : 'text-[#5a5550]'}`}>ON</span>
          <span className={`transition-colors ${!isOn ? 'text-red-400' : 'text-[#5a5550]'}`}>OFF</span>
        </div>
      </div>
    </div>
  )
}
