/// <reference types="vite-plugin-glsl/ext" />
import bmpFrag from "./shaders/bmp.frag";
import bmpVert from "./shaders/bmp.vert";
import colorBarFrag from "./shaders/colorbar.frag";
import colorBarVert from "./shaders/colorbar.vert";
import fiberFrag from "./shaders/fiber.frag";
import fiberVert from "./shaders/fiber.vert";
import flatMeshFrag from "./shaders/flat_mesh.frag";
import flatMeshVert from "./shaders/flat_mesh.vert";
import fontFrag from "./shaders/font.frag";
import fontVert from "./shaders/font.vert";
import growcutFrag from "./shaders/growcut.frag";
import growcutVert from "./shaders/growcut.vert";
import lineVert from "./shaders/line.vert";
import meshDepthFrag from "./shaders/mesh_depth.frag";
import meshEdgeFrag from "./shaders/mesh_edge.frag";
import meshHemiFrag from "./shaders/mesh_hemi.frag";
import meshMatcapFrag from "./shaders/mesh_matcap.frag";
import meshMatteFrag from "./shaders/mesh_matte.frag";
import meshOutlineFrag from "./shaders/mesh_outline.frag";
import meshSHBlueFrag from "./shaders/mesh_shblue.frag";
import meshToonFrag from "./shaders/mesh_toon.frag";
import meshFrag from "./shaders/mesh.frag";
import meshVert from "./shaders/mesh.vert";
import orientCubeFrag from "./shaders/orient_cube.frag";
import orientCubeVert from "./shaders/orient_cube.vert";
import orientFFrag from "./shaders/orient_f.frag";
import orientIFrag from "./shaders/orient_i.frag";
import orientRGBFrag from "./shaders/orient_rgb.frag";
import orientUFrag from "./shaders/orient_u.frag";
import orientFrag from "./shaders/orient.frag";
import orientVert from "./shaers/orient.vert";
import rectFrag from "./shaders/rect.frag";
import rectVert from "./shaders/rect.vert";
import renderFrag from "./shaders/render.frag";
import renderMIPFrag from "./shaders/render_mip.frag";
import renderVert from "./shaders/render.vert";
import sliderMMFrag from "./shaders/slicer_mm.frag";
import sliderMMVert from "./shaders/slicer_mm.vert";
import surfaceFrag from "./shaders/surface.frag";
import surfaceVert from "./shaders/surface.vert";
import volumePickingFrag from "./shaders/volume_picking.frag";

/**
 * Responsible for rendering to a canvas webgl2 context
 */
export class NVRenderer {
  _gl: WebGL2RenderingContext;
  _shaderSources = new Map<string, string>();
  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl;
    this._shaderSources.set("bmp.frag", bmpFrag);
    this._shaderSources.set("bmp.vert", bmpVert);

    this._shaderSources.set("colorbar.frag", colorBarFrag);
    this._shaderSources.set("colorbar.vert", colorBarVert);

    this._shaderSources.set("fiber.frag", fiberFrag);
    this._shaderSources.set("fiber.vert", fiberVert);

    this._shaderSources.set("flat_mesh.frag", flatMeshFrag);
    this._shaderSources.set("flat_mesh.vert", flatMeshVert);

    this._shaderSources.set("font.frag", fontFrag);
    this._shaderSources.set("font.vert", fontVert);

    this._shaderSources.set("growcut.frag", growcutFrag);
    this._shaderSources.set("growcut.vert", growcutVert);

    this._shaderSources.set("line.vert", lineVert);

    this._shaderSources.set("mesh_depth.frag", meshDepthFrag);
    this._shaderSources.set("mesh_edge.frag", meshEdgeFrag);
    this._shaderSources.set("mesh_hemi.frag", meshHemiFrag);
    this._shaderSources.set("mesh_matcap.frag", meshMatcapFrag);
    this._shaderSources.set("mesh_matte.frag", meshMatteFrag);
    this._shaderSources.set("mesh_outline.frag", meshOutlineFrag);
    this._shaderSources.set("mesh_shblue.frag", meshSHBlueFrag);
    this._shaderSources.set("mesh_toon.frag", meshToonFrag);
    this._shaderSources.set("mesh.frag", meshFrag);
    this._shaderSources.set("mesh.vert", meshVert);

    this._shaderSources.set("orient_cube.frag", orientCubeFrag);
    this._shaderSources.set("orient_cube.vert", orientCubeVert);

    this._shaderSources.set("orient_f.frag", orientFFrag);
    this._shaderSources.set("orient_i.frag", orientIFrag);
    this._shaderSources.set("orient_rgb.frag", orientRGBFrag);
    this._shaderSources.set("orient_u.frag", orientUFrag);

    this._shaderSources.set("orient.frag", orientFrag);
    this._shaderSources.set("orient.vert", orientVert);

    this._shaderSources.set("rect.frag", rectFrag);
    this._shaderSources.set("rect.vert", rectVert);

    this._shaderSources.set("render.frag", renderFrag);
    this._shaderSources.set("render.vert", renderVert);
    this._shaderSources.set("render_mip.frag", renderMIPFrag);

    this._shaderSources.set("slider_mm.frag", sliderMMFrag);
    this._shaderSources.set("slider_mm.vert", sliderMMVert);

    this._shaderSources.set("surface.frag", surfaceFrag);
    this._shaderSources.set("surface.vert", surfaceVert);

    this._shaderSources.set("volume_picking.frag", volumePickingFrag);
  }
}
