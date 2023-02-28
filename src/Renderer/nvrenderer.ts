/// <reference types="vite-plugin-glsl/ext" />
import renderVert from "./shaders/render.vert";
/**
 * Responsible for rendering to a canvas webgl2 context
 */
export class NVRenderer {
  _gl: WebGL2RenderingContext;
  _shaderSources = new Map<string, string>();
  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl;
    this._shaderSources.set("render.vert", renderVert);
  }
}
