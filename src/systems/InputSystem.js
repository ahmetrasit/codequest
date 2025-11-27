/**
 * Input System
 * Manages keyboard and mouse input for player controls
 * Tracks WASD keys for movement, E for dash, Space for jump, right-click for block
 */
class InputSystem {
  constructor() {
    // Track key states
    this.keys = {
      w: false, // Forward
      a: false, // Left
      s: false, // Back
      d: false, // Right
      e: false, // E - Dash
    }

    // Track action key presses (for single-press actions)
    this.actionPressed = {
      dash: false,
      block: false,
      jump: false,
    }

    // Bind event handlers to maintain proper context
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.handleContextMenu = this.handleContextMenu.bind(this)

    // Start listening for keyboard and mouse events
    this.init()
  }

  /**
   * Initialize event listeners
   */
  init() {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('contextmenu', this.handleContextMenu)
  }

  /**
   * Handle keydown events
   */
  handleKeyDown(event) {
    const key = event.key.toLowerCase()

    // Handle spacebar separately (it's not in this.keys)
    if (key === ' ') {
      this.actionPressed.jump = true
      event.preventDefault()
      return
    }

    if (key in this.keys) {
      // Only trigger action pressed once per key press
      if (!this.keys[key]) {
        if (key === 'e') this.actionPressed.dash = true
      }
      this.keys[key] = true
      event.preventDefault() // Prevent default browser behavior
    }
  }

  /**
   * Handle right-click for block
   */
  handleContextMenu(event) {
    event.preventDefault() // Prevent context menu from appearing
    this.actionPressed.block = true
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
    // Get current state
    const state = {
      forward: this.keys.w,
      left: this.keys.a,
      backward: this.keys.s,
      right: this.keys.d,
      dash: this.actionPressed.dash,
      block: this.actionPressed.block,
      jump: this.actionPressed.jump,
    }

    // Reset action pressed flags (they should only trigger once)
    this.actionPressed.dash = false
    this.actionPressed.block = false
    this.actionPressed.jump = false

    return state
  }

  /**
   * Clean up event listeners when component unmounts
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('contextmenu', this.handleContextMenu)
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
