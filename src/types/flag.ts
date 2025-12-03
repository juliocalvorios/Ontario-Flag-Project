/**
 * Ontario Flag Time Machine - Type Definitions
 * 
 * These types model the historical evolution of the Ontario flag
 * using TypeScript's type system to ensure historical accuracy.
 */

// =============================================================================
// BRANDED TYPES
// =============================================================================
// These prevent mixing up values that are technically the same type (number/string)
// but represent different concepts

/** Year type - ensures we're working with valid historical years */
export type Year = number & { readonly __brand: 'Year' }

/** Percentage for opacity/intensity values (0-100) */
export type Percentage = number & { readonly __brand: 'Percentage' }

/** Hex color code */
export type HexColor = `#${string}`

// Helper functions to create branded types
export const toYear = (n: number): Year => n as Year
export const toPercentage = (n: number): Percentage => Math.max(0, Math.min(100, n)) as Percentage

// =============================================================================
// HISTORICAL ERAS
// =============================================================================

/** 
 * The key historical moments in Ontario flag history
 * Each era represents a significant change or proposal
 */
export type Era = 
  | 'pre-1791'        // Before Upper Canada existed
  | 'upper-canada'    // Upper Canada (1791-1867)
  | 'confederation'   // Confederation year (1867)
  | 'red-ensign-1868' // First Red Ensign (1868-1921)
  | 'red-ensign-1922' // Second Red Ensign (1922-1957)
  | 'red-ensign-1957' // Third Red Ensign (1957-1965)
  | 'pre-1965'        // Generic pre-flag era (for config)
  | '1965'            // Flag adopted
  | '1965-present'    // Current flag
  | 'proposals'       // Never-adopted redesign proposals

/**
 * Detailed era information for the time machine
 */
export interface EraInfo {
  id: string  // More flexible to allow all era IDs
  year: Year
  name: string
  description: string
  historicalContext: string
}

// =============================================================================
// FLAG ELEMENTS
// =============================================================================

/**
 * The Union Jack (appears in the canton/top-left)
 */
export interface UnionJackConfig {
  visible: boolean
  variant: 'full' | 'simplified'
  opacity: Percentage
}

/**
 * St. George's Cross (red cross on white, top of shield)
 */
export interface StGeorgeCrossConfig {
  visible: boolean
  color: HexColor
  backgroundColor: HexColor
}

/**
 * The maple leaves (bottom of shield)
 * Note: In 1957, Canadian arms changed leaves from green to red,
 * but Ontario kept gold leaves on green background
 */
export interface MapleLeavesConfig {
  visible: boolean
  count: 1 | 3  // Single leaf or traditional 3 on stem
  color: HexColor
  backgroundColor: HexColor
}

/**
 * The Ontario shield combines St. George's Cross and maple leaves
 */
export interface ShieldConfig {
  visible: boolean
  stGeorgeCross: StGeorgeCrossConfig
  mapleLeaves: MapleLeavesConfig
  borderColor: HexColor
}

/**
 * The background/field of the flag
 */
export interface FieldConfig {
  color: HexColor  // Traditionally red (ensign), but proposals included green
  texture: 'solid' | 'fabric' | 'aged'
}

// =============================================================================
// COMPLETE FLAG CONFIGURATION
// =============================================================================

/**
 * Complete configuration for rendering the Ontario flag
 * This is the main state object for the time machine
 */
export interface FlagConfig {
  era: Era
  year: Year
  field: FieldConfig
  unionJack: UnionJackConfig
  shield: ShieldConfig
}

// =============================================================================
// COLOR PALETTES
// =============================================================================

/**
 * Official colors have varied slightly over the years
 * These palettes represent different historical/stylistic interpretations
 */
export interface ColorPalette {
  id: string
  name: string
  colors: {
    red: HexColor
    blue: HexColor
    white: HexColor
    green: HexColor
    gold: HexColor
  }
}

// =============================================================================
// TIME MACHINE STATE
// =============================================================================

/**
 * The main state of the time machine interface
 */
export interface TimeMachineState {
  currentYear: Year
  isAnimating: boolean
  flagConfig: FlagConfig
  selectedPalette: ColorPalette
}

/**
 * Actions that can be performed on the time machine
 */
export type TimeMachineAction =
  | { type: 'SET_YEAR'; payload: Year }
  | { type: 'TOGGLE_ELEMENT'; payload: keyof FlagConfig }
  | { type: 'SET_PALETTE'; payload: ColorPalette }
  | { type: 'ANIMATE_TO_YEAR'; payload: Year }
  | { type: 'RESET' }

// =============================================================================
// SWITCH CONFIGURATION
// =============================================================================

/**
 * Physical vintage switch representation
 */
export interface VintageSwitchConfig {
  id: string
  label: string
  description: string
  position: 'left' | 'center' | 'right'
  positions: {
    left: { label: string; value: unknown }
    center?: { label: string; value: unknown }
    right: { label: string; value: unknown }
  }
}

/**
 * Lever/slider for the year selector
 */
export interface YearLeverConfig {
  minYear: Year
  maxYear: Year
  currentYear: Year
  notches: Year[]  // Key years to "click" into
}
