/**
 * Input System
 * Manages keyboard input for player controls
 * Tracks WASD keys for movement and cleans up event listeners properly
 */
class InputSystem {
  constructor() {
    // Track key states
    this.keys = {
      w: false, // Forward
      a: false, // Left
      s: false, // Back
      d: false, // Right
    }

    // Bind event handlers to maintain proper context
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)

    // Start listening for keyboard events
    this.init()
  }

  /**
   * Initialize event listeners
   */
  init() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  /**
   * Handle keydown events
   */
  handleKeyDown(event) {
    const key = event.key.toLowerCase()
    if (key in this.keys) {
      this.keys[key] = true
      event.preventDefault() // Prevent default browser behavior
    }
  }

  /**
   * Handle keyup events
   */
  handleKeyUp(event) {
    const key = event.key.toLowerCase()
    if (key in this.keys) {
      this.keys[key] = false
      event.preventDefault()
    }
  }

  /**
   * Get current input state
   * @returns {Object} Current state of all tracked keys
   */
  getInputState() {
    return {
      forward: this.keys.w,
      left: this.keys.a,
      backward: this.keys.s,
      right: this.keys.d,
    }
  }

  /**
   * Clean up event listeners when component unmounts
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
}

// Create singleton instance
let inputSystemInstance = null

/**
 * Get or create InputSystem instance
 * @returns {InputSystem} Singleton instance
 */
export const getInputSystem = () => {
  if (!inputSystemInstance) {
    inputSystemInstance = new InputSystem()
  }
  return inputSystemInstance
}

/**
 * Destroy InputSystem instance
 */
export const destroyInputSystem = () => {
  if (inputSystemInstance) {
    inputSystemInstance.destroy()
    inputSystemInstance = null
  }
}

export default InputSystem
