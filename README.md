# Ontario Flag Time Machine

An interactive exploration of Ontario's flag history through a vintage time machine interface.

## Features

- **Temporal Navigation**: Travel through key moments in Ontario flag history (1867-2025)
- **Interactive Elements**: Toggle Union Jack and Provincial Shield visibility
- **Multiple Palettes**: Official, Heritage, Autumn, and Winter color schemes
- **Texture Options**: Aged, Fabric, and Solid flag appearances
- **Historical Context**: Learn about each era's significance

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Strict typing with branded types
- **Tailwind CSS** - Utility-first styling

## TypeScript Highlights

This project demonstrates several TypeScript patterns:

### Branded Types
```typescript
type Year = number & { readonly __brand: 'Year' }
type Percentage = number & { readonly __brand: 'Percentage' }
```
Prevents mixing up values that are technically the same type but represent different concepts.

### Discriminated Unions
```typescript
type Era = 'pre-1965' | '1965' | '1965-present' | 'proposals'
```
Ensures only valid eras can be used throughout the application.

### Strict Configuration Types
```typescript
interface FlagConfig {
  era: Era
  year: Year
  field: FieldConfig
  unionJack: UnionJackConfig
  shield: ShieldConfig
}
```
Makes it impossible to create invalid flag configurations.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the time machine.

## Historical Notes

- **1867**: Ontario becomes a province (Confederation)
- **1868**: Queen Victoria grants Ontario its coat of arms
- **1965**: Ontario adopts its own flag after Canada changes to the Maple Leaf
- **May 21**: Ontario Flag Day

## Author

Julio Calvo - Frontend Developer, Toronto

## License

MIT
