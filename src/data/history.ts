import { 
  EraInfo, 
  FlagConfig, 
  ColorPalette, 
  Year, 
  toYear, 
  toPercentage,
  HexColor 
} from '@/types'

// =============================================================================
// HISTORICAL ERAS
// =============================================================================

export const ERAS: EraInfo[] = [
  {
    id: 'pre-1791',
    year: toYear(1763),
    name: 'British Colonial Era',
    description: 'Before Upper Canada existed',
    historicalContext: 'After the Treaty of Paris (1763), this territory was part of the Province of Quebec under British rule. The Union Jack flew over all British North America.'
  },
  {
    id: 'upper-canada',
    year: toYear(1791),
    name: 'Upper Canada',
    description: 'British colony (1791-1867)',
    historicalContext: 'The Constitutional Act of 1791 split Quebec into Upper Canada (present-day Ontario) and Lower Canada (Quebec). Upper Canada was the destination for Loyalists fleeing the American Revolution. The Union Jack was the official flag.'
  },
  {
    id: 'confederation',
    year: toYear(1867),
    name: 'Confederation',
    description: 'Ontario becomes a province',
    historicalContext: 'On July 1, 1867, the British North America Act created the Dominion of Canada, uniting Ontario, Quebec, Nova Scotia, and New Brunswick. Ontario emerged from the former Upper Canada.'
  },
  {
    id: 'red-ensign-1868',
    year: toYear(1868),
    name: 'First Red Ensign Era',
    description: 'Canadian Red Ensign (1868-1921)',
    historicalContext: 'The Canadian Red Ensign featured the combined arms of the four founding provinces. Queen Victoria granted Ontario its coat of arms in 1868: St. George\'s Cross over three golden maple leaves on green.'
  },
  {
    id: 'red-ensign-1922',
    year: toYear(1922),
    name: 'Second Red Ensign Era',
    description: 'Updated coat of arms (1922-1957)',
    historicalContext: 'King George V granted Canada a new coat of arms in 1921, which replaced the provincial composite on the Red Ensign. The maple leaves on the shield were green during this period.'
  },
  {
    id: 'red-ensign-1957',
    year: toYear(1957),
    name: 'Final Red Ensign Era',
    description: 'Red maple leaves (1957-1965)',
    historicalContext: 'In 1957, the maple leaves on Canada\'s coat of arms were changed from green to red. This version flew until the Great Flag Debate led to the Maple Leaf flag in 1965.'
  },
  {
    id: '1965',
    year: toYear(1965),
    name: 'Ontario Flag Adopted',
    description: 'May 21, 1965',
    historicalContext: 'When Canada adopted the Maple Leaf flag, Premier John Robarts proposed Ontario keep a Red Ensign design. The Ontario Flag Act passed March 17, 1965. Some saw it as preserving Canadian heritage; others as a protest against the new national flag.'
  },
  {
    id: '1965-present',
    year: toYear(2025),
    name: 'Current Flag',
    description: 'The flag as it flies today',
    historicalContext: 'The Ontario flag remains unchanged since 1965. May 21 is Ontario Flag Day. The flag features the Union Jack in the canton and the Ontario shield (St. George\'s Cross over three golden maple leaves) in the fly.'
  }
]

// =============================================================================
// COLOR PALETTES
// =============================================================================

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'official',
    name: 'Official',
    colors: {
      red: '#C8102E' as HexColor,
      blue: '#012169' as HexColor,
      white: '#FFFFFF' as HexColor,
      green: '#00573F' as HexColor,
      gold: '#FFB81C' as HexColor,
    }
  },
  {
    id: 'heritage',
    name: 'Heritage',
    colors: {
      red: '#9B2335' as HexColor,
      blue: '#1C3A6E' as HexColor,
      white: '#F5F5F0' as HexColor,
      green: '#2D5A45' as HexColor,
      gold: '#C9A227' as HexColor,
    }
  },
  {
    id: 'autumn',
    name: 'Autumn',
    colors: {
      red: '#A63D40' as HexColor,
      blue: '#3D5A80' as HexColor,
      white: '#FAF3E0' as HexColor,
      green: '#5B7553' as HexColor,
      gold: '#E9B44C' as HexColor,
    }
  },
  {
    id: 'winter',
    name: 'Winter',
    colors: {
      red: '#7B2D3E' as HexColor,
      blue: '#2B4570' as HexColor,
      white: '#F0F4F8' as HexColor,
      green: '#3A5448' as HexColor,
      gold: '#B8A04A' as HexColor,
    }
  }
]

// =============================================================================
// FLAG CONFIGURATIONS BY ERA
// =============================================================================

type Era = 'pre-1965' | '1965' | '1965-present' | 'proposals'

export const FLAG_CONFIGS: Record<Era, FlagConfig> = {
  'pre-1965': {
    era: 'pre-1965',
    year: toYear(1867),
    field: {
      color: '#C8102E' as HexColor,
      texture: 'aged'
    },
    unionJack: {
      visible: true,
      variant: 'full',
      opacity: toPercentage(100)
    },
    shield: {
      visible: true,
      stGeorgeCross: {
        visible: true,
        color: '#C8102E' as HexColor,
        backgroundColor: '#FFFFFF' as HexColor
      },
      mapleLeaves: {
        visible: true,
        count: 3,
        color: '#FFB81C' as HexColor,
        backgroundColor: '#00573F' as HexColor
      },
      borderColor: '#FFB81C' as HexColor
    }
  },
  '1965': {
    era: '1965',
    year: toYear(1965),
    field: {
      color: '#C8102E' as HexColor,
      texture: 'fabric'
    },
    unionJack: {
      visible: true,
      variant: 'full',
      opacity: toPercentage(100)
    },
    shield: {
      visible: true,
      stGeorgeCross: {
        visible: true,
        color: '#C8102E' as HexColor,
        backgroundColor: '#FFFFFF' as HexColor
      },
      mapleLeaves: {
        visible: true,
        count: 3,
        color: '#FFB81C' as HexColor,
        backgroundColor: '#00573F' as HexColor
      },
      borderColor: '#FFB81C' as HexColor
    }
  },
  '1965-present': {
    era: '1965-present',
    year: toYear(2025),
    field: {
      color: '#C8102E' as HexColor,
      texture: 'solid'
    },
    unionJack: {
      visible: true,
      variant: 'full',
      opacity: toPercentage(100)
    },
    shield: {
      visible: true,
      stGeorgeCross: {
        visible: true,
        color: '#C8102E' as HexColor,
        backgroundColor: '#FFFFFF' as HexColor
      },
      mapleLeaves: {
        visible: true,
        count: 3,
        color: '#FFB81C' as HexColor,
        backgroundColor: '#00573F' as HexColor
      },
      borderColor: '#FFB81C' as HexColor
    }
  },
  'proposals': {
    era: 'proposals',
    year: toYear(2021),
    field: {
      color: '#00573F' as HexColor,
      texture: 'solid'
    },
    unionJack: {
      visible: false,
      variant: 'simplified',
      opacity: toPercentage(0)
    },
    shield: {
      visible: true,
      stGeorgeCross: {
        visible: true,
        color: '#C8102E' as HexColor,
        backgroundColor: '#FFFFFF' as HexColor
      },
      mapleLeaves: {
        visible: true,
        count: 3,
        color: '#FFB81C' as HexColor,
        backgroundColor: '#00573F' as HexColor
      },
      borderColor: '#FFB81C' as HexColor
    }
  }
}

// =============================================================================
// KEY YEARS FOR THE TIME MACHINE NOTCHES
// =============================================================================

export const KEY_YEARS: Year[] = [
  toYear(1763),  // Treaty of Paris - British control
  toYear(1791),  // Constitutional Act - Upper Canada created
  toYear(1841),  // Act of Union - Province of Canada
  toYear(1867),  // Confederation - Ontario created
  toYear(1868),  // Ontario coat of arms granted
  toYear(1922),  // New Canadian coat of arms on Red Ensign
  toYear(1957),  // Maple leaves changed to red
  toYear(1965),  // Ontario flag adopted
  toYear(2025),  // Present
]

// =============================================================================
// HISTORICAL EVENTS FOR TIMELINE
// =============================================================================

export interface HistoricalEvent {
  year: Year
  title: string
  description: string
  flagImpact: string
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    year: toYear(1763),
    title: 'Treaty of Paris',
    description: 'France cedes New France to Britain',
    flagImpact: 'Union Jack becomes the flag of British North America'
  },
  {
    year: toYear(1791),
    title: 'Upper Canada Created',
    description: 'Constitutional Act splits Quebec',
    flagImpact: 'Upper Canada (future Ontario) established as British colony'
  },
  {
    year: toYear(1841),
    title: 'Act of Union',
    description: 'Upper and Lower Canada reunited',
    flagImpact: 'Province of Canada formed; Union Jack remains official'
  },
  {
    year: toYear(1867),
    title: 'Confederation',
    description: 'Dominion of Canada created',
    flagImpact: 'Ontario becomes a province; Red Ensign emerges'
  },
  {
    year: toYear(1868),
    title: 'Arms Granted',
    description: 'Queen Victoria grants Ontario coat of arms',
    flagImpact: 'Shield design: St. George\'s Cross + three golden maple leaves'
  },
  {
    year: toYear(1922),
    title: 'New Coat of Arms',
    description: 'Canada receives new royal arms',
    flagImpact: 'Red Ensign updated with new shield (green maple leaves)'
  },
  {
    year: toYear(1957),
    title: 'Leaves Turn Red',
    description: 'Canadian arms maple leaves change color',
    flagImpact: 'Red Ensign updated; Ontario keeps gold leaves on green'
  },
  {
    year: toYear(1965),
    title: 'Ontario Flag Adopted',
    description: 'Ontario Flag Act passes',
    flagImpact: 'Current flag raised May 21, 1965'
  },
  {
    year: toYear(2015),
    title: 'Flag Day Act',
    description: 'May 21 declared Ontario Flag Day',
    flagImpact: 'Flag\'s significance formally recognized'
  }
]
