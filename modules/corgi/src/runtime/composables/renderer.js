import { WebGLRenderer } from "three"

/**
 * @typedef {Object} UseRenderer
 * @property {function(scene:THREE.Scene,camere:THREE.Camera):void} render - Call the render method for the THREE.WebGLRenderer
 * @property {function(width:Number,height:Number):void} resize - Resize the renderer
 */

/**
 *
 * @param {THREE.WebGLRendererParameters} options
 * @returns {UseRenderer}
 */
export default function useRenderer (options) {

  /**
   * @type {THREE.WebGLRendererParameters}
   */
  const defaultOptions = {
    powerPreference: "high-performance",
    antialias: false,
    stencil: false,
    depth: false
  }

  /**
   * @type {THREE.WebGLRenderer}
   */
  const renderer = new WebGLRenderer(
    { ...defaultOptions, ...options }
  )

  /**
   * Call the render method for the THREE.WebGLRenderer
   * @param {THREE.Scene} scene
   * @param {THREE.Camera} camera
   */
  const render = (scene, camera) => {
    renderer.render(scene, camera)
  }


  /**
   * Resize the renderer
   * @param {Number} width
   * @param {Number} height
   */
  const resize = (width, height) => {
    renderer.setSize(width, height)
  }

  /**
   * Frees the GPU-related resources allocated by this instance. Call this method whenever this instance is no longer used in your app.
   */
  const dispose = () => {
    renderer?.dispose()
  }

  return { renderer, render, resize, dispose }
}
