/**
 * TESTS PARA: src/components/VintageSwitch.tsx
 *
 * CONCEPTOS NUEVOS:
 * - fireEvent: Simula eventos del usuario (click, mousedown, etc.)
 * - jest.fn(): Crea una función "mock" que podemos espiar
 * - toHaveBeenCalled(): Verifica que una función fue llamada
 * - toHaveBeenCalledWith(): Verifica con qué argumentos fue llamada
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { VintageSwitch, SwitchDesign } from '@/components/VintageSwitch'

describe('VintageSwitch', () => {
  // =====================================================
  // jest.fn() crea una función "mock" (falsa)
  // Podemos ver si fue llamada, cuántas veces, con qué argumentos, etc.
  // =====================================================

  // Propiedades por defecto para los tests
  const defaultProps = {
    label: 'Test Switch',
    isOn: false,
    onToggle: jest.fn() // Mock function!
  }

  // beforeEach se ejecuta ANTES de cada test
  // Limpiamos los mocks para que cada test empiece fresco
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // =====================================================
  // Tests básicos de renderizado
  // =====================================================

  describe('rendering', () => {
    it('should render the label', () => {
      render(<VintageSwitch {...defaultProps} />)

      // El label debe estar visible
      expect(screen.getByText('Test Switch')).toBeInTheDocument()
    })

    it('should render the description when provided', () => {
      render(<VintageSwitch {...defaultProps} description="A test description" />)

      expect(screen.getByText('A test description')).toBeInTheDocument()
    })

    it('should not render description when not provided', () => {
      render(<VintageSwitch {...defaultProps} />)

      expect(screen.queryByText('A test description')).not.toBeInTheDocument()
    })

    it('should show ON indicator when isOn is true', () => {
      render(<VintageSwitch {...defaultProps} isOn={true} />)

      // El texto "ON" debe estar destacado (no verificamos el color exacto,
      // pero verificamos que exista)
      expect(screen.getByText('ON')).toBeInTheDocument()
    })

    it('should show OFF indicator when isOn is false', () => {
      render(<VintageSwitch {...defaultProps} isOn={false} />)

      expect(screen.getByText('OFF')).toBeInTheDocument()
    })
  })

  // =====================================================
  // Tests de interacción
  // =====================================================

  describe('interactions', () => {
    it('should call onToggle when clicked', () => {
      // container nos da acceso directo al DOM renderizado
      const { container } = render(<VintageSwitch {...defaultProps} />)

      // Buscamos el elemento con cursor-pointer (el clickeable)
      const switchHousing = container.querySelector('.cursor-pointer')

      // fireEvent.click() simula un click del usuario
      if (switchHousing) {
        fireEvent.click(switchHousing)
      }

      // toHaveBeenCalled() verifica que la función mock fue llamada
      expect(defaultProps.onToggle).toHaveBeenCalled()
    })

    it('should toggle to true when currently off', () => {
      const { container } = render(<VintageSwitch {...defaultProps} isOn={false} />)

      const switchHousing = container.querySelector('.cursor-pointer')

      if (switchHousing) {
        fireEvent.click(switchHousing)
      }

      // toHaveBeenCalledWith() verifica los argumentos
      // Cuando está OFF y hacemos click, debe llamar con TRUE
      expect(defaultProps.onToggle).toHaveBeenCalledWith(true)
    })

    it('should toggle to false when currently on', () => {
      const onToggle = jest.fn()
      const { container } = render(<VintageSwitch {...defaultProps} isOn={true} onToggle={onToggle} />)

      const switchHousing = container.querySelector('.cursor-pointer')

      if (switchHousing) {
        fireEvent.click(switchHousing)
      }

      // Cuando está ON y hacemos click, debe llamar con FALSE
      expect(onToggle).toHaveBeenCalledWith(false)
    })

    it('should NOT call onToggle when disabled', () => {
      const { container } = render(<VintageSwitch {...defaultProps} disabled={true} />)

      // Cuando está disabled, no tiene cursor-pointer
      // Pero sí tiene opacity-50
      const disabledElement = container.querySelector('.opacity-50')

      if (disabledElement) {
        fireEvent.click(disabledElement)
      }

      // La función NO debe haber sido llamada
      expect(defaultProps.onToggle).not.toHaveBeenCalled()
    })
  })

  // =====================================================
  // Tests para diferentes diseños de switch
  // =====================================================

  describe('switch designs', () => {
    // Todos los diseños disponibles
    const designs: SwitchDesign[] = ['classic', 'lever', 'rocker', 'rotary', 'pushbutton', 'knife']

    // it.each() ejecuta el mismo test con diferentes valores
    // Esto evita repetir código
    it.each(designs)('should render %s design without crashing', (design) => {
      render(<VintageSwitch {...defaultProps} design={design} />)

      // Si llegamos aquí sin error, el diseño se renderizó correctamente
      expect(screen.getByText('Test Switch')).toBeInTheDocument()
    })

    it('should default to classic design when not specified', () => {
      render(<VintageSwitch {...defaultProps} />)

      // El switch clásico debe renderizarse
      // Verificamos que existe el componente
      expect(screen.getByText('ON')).toBeInTheDocument()
      expect(screen.getByText('OFF')).toBeInTheDocument()
    })
  })

  // =====================================================
  // Tests de estado visual (disabled)
  // =====================================================

  describe('disabled state', () => {
    it('should apply opacity when disabled', () => {
      const { container } = render(<VintageSwitch {...defaultProps} disabled={true} />)

      // container.querySelector nos da acceso directo al DOM
      // Buscamos un elemento con la clase opacity-50
      const disabledElement = container.querySelector('.opacity-50')
      expect(disabledElement).toBeInTheDocument()
    })

    it('should have cursor-pointer when enabled', () => {
      const { container } = render(<VintageSwitch {...defaultProps} disabled={false} />)

      const clickableElement = container.querySelector('.cursor-pointer')
      expect(clickableElement).toBeInTheDocument()
    })

    it('should NOT have cursor-pointer when disabled', () => {
      const { container } = render(<VintageSwitch {...defaultProps} disabled={true} />)

      // Verificamos que NO hay cursor-pointer
      const clickableElement = container.querySelector('.cursor-pointer')
      expect(clickableElement).not.toBeInTheDocument()
    })
  })

  // =====================================================
  // Tests de eventos de mouse (press state)
  // =====================================================

  describe('press state', () => {
    it('should handle mousedown and mouseup events', () => {
      const { container } = render(<VintageSwitch {...defaultProps} />)

      const switchHousing = container.querySelector('.cursor-pointer')

      if (switchHousing) {
        // Simulamos presionar el mouse
        fireEvent.mouseDown(switchHousing)

        // Soltamos el mouse
        fireEvent.mouseUp(switchHousing)

        // No podemos verificar el estado visual directamente,
        // pero verificamos que no hay errores
        expect(screen.getByText('Test Switch')).toBeInTheDocument()
      }
    })

    it('should handle mouseLeave event', () => {
      const { container } = render(<VintageSwitch {...defaultProps} />)

      const switchHousing = container.querySelector('.cursor-pointer')

      if (switchHousing) {
        fireEvent.mouseDown(switchHousing)
        fireEvent.mouseLeave(switchHousing)

        // Verificamos que el componente sigue funcionando
        expect(screen.getByText('Test Switch')).toBeInTheDocument()
      }
    })
  })
})
