import {
  NVVoxelLoaderOptions,
  NVVoxelLoader,
} from "ResourceLoader/nvvoxel-loader";
import { NVVoxelDataItem } from "Data/nvvoxel-data-item";
import { NVVoxelDataNode } from "Data/nvoxel-data-node";
import { DATA_BUFFER_TYPE, NiftiDataBuffer } from "../nifti/nifti-image-data";
import { NV3dVoxelNode } from "Scene/nv3d-voxel-node";
import { mat4, vec3, vec4 } from "gl-matrix";
import { NVVoxelViewDataNode } from "Data/nvvoxel-view-data-node";
import { NVColorTables } from "./nvcolor-tables";

import { NVShaderCache } from "Renderer/nvshader-cache";
import { NVShader } from "Renderer/nvshader";
import orientFFrag from "./shaders/orient_f.frag";
import orientIFrag from "./shaders/orient_i.frag";
import orientRGBFrag from "./shaders/orient_rgb.frag";
import orientUFrag from "./shaders/orient_u.frag";
import orientFrag from "./shaders/orient.frag";
import orientVert from "./shaers/orient.vert";

type NVTextureFormat = {
  internalFormat: number;
  format: number;
  type: number;
}

/**
 * Responsible for updating scene graph and data graph
 */
export class NVController {
  _colorTables = new NVColorTables();
  _shaderCache: NVShaderCache;
  _gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this._gl = gl;
    this._shaderCache = new NVShaderCache(gl);
  }

  /**
   * Loads a nifti image from url
   * @param {string} url
   * @returns {NVVoxelDataNode}
   */
  public async loadImageFromUrl(url: string): Promise<NVVoxelDataNode> {
    const options = new NVVoxelLoaderOptions({ url });
    const dataItem: NVVoxelDataItem = await NVVoxelLoader.load(options);
    return new NVVoxelDataNode(dataItem);
  }

  /**
   * Converts voxel space into millimetric space
   * @param {number[]} xyz - Voxel position (row, colum, slice)
   * @param {mat4} mtx  - RAS coordinates transformation matrix
   * @returns {vec3} - Millimetric world space coodinates
   */
  vox2mm(xyz: number[], mtx: mat4): vec3 {
    const sform = mat4.clone(mtx);
    mat4.transpose(sform, sform);
    const pos = vec4.fromValues(xyz[0], xyz[1], xyz[2], 1);
    vec4.transformMat4(pos, pos, sform);
    const pos3 = vec3.fromValues(pos[0], pos[1], pos[2]);
    return pos3;
  }

  /**
   * Gets params for texStorage3D and texSubImage3D from data buffer type
   * @param {DATA_BUFFER_TYPE} dataType 
   * @returns {NVTextureFormat}
   */
  getTextureFormatFromDataType(dataType: DATA_BUFFER_TYPE): NVTextureFormat {
    let textureFormat: NVTextureFormat;
    switch (dataType) {
      case DATA_BUFFER_TYPE.DT_UINT8:
        textureFormat = { internalFormat: this._gl.R8UI, format: this._gl.RED_INTEGER, type: this._gl.UNSIGNED_BYTE };
        break;
      case DATA_BUFFER_TYPE.DT_INT16:
        textureFormat = { internalFormat: this._gl.R16I, format: this._gl.RED_INTEGER, type: this._gl.SHORT };
        break;
      case DATA_BUFFER_TYPE.DT_FLOAT32:
        textureFormat = { internalFormat: this._gl.R32F, format: this._gl.RED, type: this._gl.FLOAT };
        break;
      case DATA_BUFFER_TYPE.DT_FLOAT64:
        textureFormat = { internalFormat: this._gl.R32F, format: this._gl.RED, type: this._gl.FLOAT };
        break;
      case DATA_BUFFER_TYPE.DT_RGB24:
        textureFormat = { internalFormat: this._gl.RGB8UI, format: this._gl.RGB_INTEGER, type: this._gl.UNSIGNED_BYTE };
        break;
      case DATA_BUFFER_TYPE.DT_UINT16:
        textureFormat = { internalFormat: this._gl.R16UI, format: this._gl.RED_INTEGER, type: this._gl.UNSIGNED_SHORT };
        break;
      case DATA_BUFFER_TYPE.DT_RGBA32:
        textureFormat = { internalFormat: this._gl.RGBA8UI, format: this._gl.RGBA_INTEGER, type: this._gl.UNSIGNED_BYTE };
        break;
      default:
        throw new Error("Data format not supported");
    }

    return textureFormat;
  }

  /**
   * Gets orient shader from data buffer type
   * @param {DATA_BUFFER_TYPE} dataType 
   * @returns {NVShader}
   */
  getOrientShaderFromDataType(dataType: DATA_BUFFER_TYPE): NVShader {
    let orientShader: NVShader;
    let shaderName: string;

    switch (dataType) {
      case DATA_BUFFER_TYPE.DT_UINT8:
      case DATA_BUFFER_TYPE.DT_UINT16:
        shaderName = "orientShaderU";
        if (this._shaderCache.hasShader(shaderName)) {
          orientShader = this._shaderCache.getShader(shaderName)
        }
        else {
          orientShader = new NVShader(orientVert, `${orientUFrag}\n${orientFrag}`, this._gl);
          this._shaderCache.addShader(shaderName, orientShader);
        }
        break;
      case DATA_BUFFER_TYPE.DT_INT16:
        shaderName = "orientShaderI";
        if (this._shaderCache.hasShader(shaderName)) {
          orientShader = this._shaderCache.getShader(shaderName)
        }
        else {
          orientShader = new NVShader(orientVert, `${orientIFrag}\n${orientFrag}`, this._gl);
          this._shaderCache.addShader(shaderName, orientShader);
        }
        break;
      case DATA_BUFFER_TYPE.DT_FLOAT32:
      case DATA_BUFFER_TYPE.DT_FLOAT64:
        shaderName = "orientShaderF";
        if (this._shaderCache.hasShader(shaderName)) {
          orientShader = this._shaderCache.getShader(shaderName)
        }
        else {
          orientShader = new NVShader(orientVert, `${orientIFrag}\n${orientFrag}`, this._gl);
          this._shaderCache.addShader(shaderName, orientShader);
        }
        break;
      case DATA_BUFFER_TYPE.DT_RGB24:
      case DATA_BUFFER_TYPE.DT_RGBA32:
        shaderName = "orientShaderRGBU";
        if (this._shaderCache.hasShader(shaderName)) {
          orientShader = this._shaderCache.getShader(shaderName)
        }
        else {
          orientShader = new NVShader(orientVert, `${orientRGBFrag}\n${orientFrag}`, this._gl);
          this._shaderCache.addShader(shaderName, orientShader);
        }
        break;
      default:
        throw new Error("Data type not supported");
    }

    return orientShader;
  }

  public generateTextureFromVoxelViewDataNode(gl: WebGL2RenderingContext,
    overlayItem: NVVoxelViewDataNode): WebGLTexture | null {

    const dims = overlayItem.dimsRAS;
    if (!dims) {
      throw new Error("Dimensions undefined for volume")
    }

    // Create color texture to combine with voxel intesity values
    let colorMap = this._colorTables.getColormap(overlayItem.colorMap);
    if (!colorMap) {
      throw new Error("Color map not found");
    }
    let colorMapTexture = gl.createTexture();
    if (!colorMapTexture) {
      throw new Error("Could not create texture");
    }
    gl.bindTexture(gl.TEXTURE_2D, colorMapTexture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 256, 1);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MAG_FILTER,
      gl.LINEAR
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_R,
      gl.LINEAR
    );
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_WRAP_S,
      gl.LINEAR
    );
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(colorMap.buffer));


    let fb = this._gl.createFramebuffer();
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, fb);
    this._gl.disable(this._gl.CULL_FACE);
    this._gl.viewport(0, 0, overlayItem.baseVolumeDims[1], overlayItem.baseVolumeDims[2]); //output in background dimensions
    this._gl.disable(this._gl.BLEND)
    let tempTex3D = this._gl.createTexture();
    this._gl.activeTexture(this._gl.TEXTURE6); //Temporary 3D Texture
    this._gl.bindTexture(this._gl.TEXTURE_3D, tempTex3D);
    this._gl.texParameteri(
      this._gl.TEXTURE_3D,
      this._gl.TEXTURE_MIN_FILTER,
      this._gl.NEAREST
    );
    this._gl.texParameteri(
      this._gl.TEXTURE_3D,
      this._gl.TEXTURE_MAG_FILTER,
      this._gl.NEAREST
    );
    this._gl.texParameteri(
      this._gl.TEXTURE_3D,
      this._gl.TEXTURE_WRAP_R,
      this._gl.CLAMP_TO_EDGE
    );
    this._gl.texParameteri(
      this._gl.TEXTURE_3D,
      this._gl.TEXTURE_WRAP_S,
      this._gl.CLAMP_TO_EDGE
    );
    this._gl.texParameteri(
      this._gl.TEXTURE_3D,
      this._gl.TEXTURE_WRAP_T,
      this._gl.CLAMP_TO_EDGE
    );
    this._gl.pixelStorei(this._gl.UNPACK_ALIGNMENT, 1);

    const hdr = overlayItem.hdr;
    const orientShader: NVShader = this.getOrientShaderFromDataType(hdr.datatype);
    const textureFormat: NVTextureFormat = this.getTextureFormatFromDataType(hdr.dataType);
    let img: NiftiDataBuffer = overlayItem.dataBuffer;
    if (hdr.dataType === DATA_BUFFER_TYPE.DT_FLOAT64) {
      img = Float32Array.from(img);
    }

    orientShader.use();
    if (hdr.dataType === DATA_BUFFER_TYPE.DT_RGBA32) {
      orientShader.updateUniformValue("hasAlpha", true);
    }
    orientShader.updateUniformValue("isAlphaThreshold", overlayItem.alphaThresholdUsed);
    orientShader.updateUniformValue("cal_min", overlayItem.calMin);
    orientShader.updateUniformValue("cal_max", overlayItem.calMin);

    //if unused colorMapNegative https://github.com/niivue/niivue/issues/490
    let mnNeg = Number.POSITIVE_INFINITY;
    let mxNeg = Number.NEGATIVE_INFINITY;
    if (overlayItem.colorMapNegative.length > 0) {
      //assume symmetrical
      mnNeg = Math.min(-overlayItem.calMin, -overlayItem.calMax);
      mxNeg = Math.max(-overlayItem.calMin, -overlayItem.calMax);
      if (isFinite(overlayItem.calMinNeg) && isFinite(overlayItem.calMaxNeg)) {
        //explicit range for negative colormap: allows asymmetric maps
        mnNeg = Math.min(overlayItem.calMinNeg, overlayItem.calMaxNeg);
        mxNeg = Math.max(overlayItem.calMinNeg, overlayItem.calMaxNeg);
      }
    }
    orientShader.updateUniformValue("cal_minNeg", mnNeg);
    orientShader.updateUniformValue("cal_maxNeg", mxNeg);
    this._gl.bindTexture(this._gl.TEXTURE_3D, tempTex3D);
    orientShader.updateUniformValue("intensityVol", 6);
    orientShader.updateUniformValue("blend3D", 5);
    orientShader.updateUniformValue("colormap", 1);
    orientShader.updateUniformValue("layer", 0);
    orientShader.updateUniformValue("scl_inter", hdr.scl_inter);
    orientShader.updateUniformValue("scl_slope", hdr.scl_slope);
    orientShader.updateUniformValue("opacity", overlayItem.opacity);
    orientShader.updateUniformValue("modulationVol", 7);
    orientShader.updateUniformValue("modulation", 0);
    const mtx = mat4.clone(overlayItem.toRAS!);
    orientShader.updateUniformValue("mtx", mtx);
    // TODO(cdrake): write texture to frame buffer
    /*
    for (let i = 0; i < this.back.dims[3]; i++) {
    //output slices
    let coordZ = (1 / this.back.dims[3]) * (i + 0.5);
    this.gl.uniform1f(orientShader.uniforms["coordZ"], coordZ);
    this.gl.framebufferTextureLayer(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      outTexture,
      0,
      i
    );
    //this.gl.clear(this.gl.DEPTH_BUFFER_BIT); //exhaustive, so not required
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  this.gl.bindVertexArray(this.unusedVAO);
  this.gl.deleteTexture(tempTex3D);
  this.gl.deleteTexture(modulateTexture);
  this.gl.deleteTexture(blendTexture);
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

  this.gl.deleteFramebuffer(fb);
  */

    this._gl.texStorage3D(
      this._gl.TEXTURE_3D,
      1,
      textureFormat.internalFormat,
      hdr.dims[1],
      hdr.dims[2],
      hdr.dims[3]
    );
    this._gl.texSubImage3D(
      this._gl.TEXTURE_3D,
      0,
      0,
      0,
      0,
      hdr.dims[1],
      hdr.dims[2],
      hdr.dims[3],
      textureFormat.format,
      textureFormat.type,
      img
    );

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    let img8 = new Uint8Array(dims[1] * dims[2] * dims[3] * 4);
    gl.texStorage3D(gl.TEXTURE_3D, 1, gl.RGBA8, dims[1], dims[2], dims[3]);
    // gl.texSubImage3D(
    //   gl.TEXTURE_3D, 
    //   0, 
    //   0, 
    //   0, 
    //   0, 
    //   dims[1],
    //   dims[2],
    //   dims[3], 
    //   gl.RGBA, 
    //   gl.UNSIGNED_BYTE, 
    //   img8);
    return texture;
  }

  /**
   * Creates a 3d Voxel Node from a {@link NVVoxelViewDataNode}
   * @param { WebGLRenderingContext } gl 
   * @param { NVVoxelViewDataNode } dataNode 
   * @returns { NV3dVoxelNode }
   */
  public to3dVoxelNode(
    gl: WebGL2RenderingContext,
    dataNode: NVVoxelViewDataNode
  ): NV3dVoxelNode | null {
    //cube has 8 vertices: left/right, posterior/anterior, inferior/superior
    //n.b. voxel coordinates are from VOXEL centers
    // add/subtract 0.5 to get full image field of view
    const L = -0.5;
    const P = -0.5;
    const I = -0.5;

    if (!dataNode.dimsRAS) {
      throw new Error("dimRAS not defined");
    }

    const R = dataNode.dimsRAS[1] - 1 + 0.5;
    const A = dataNode.dimsRAS[2] - 1 + 0.5;
    const S = dataNode.dimsRAS[3] - 1 + 0.5;

    if (!dataNode.matRAS) {
      throw new Error("matRAS not defined");
    }

    const LPI = this.vox2mm([L, P, I], dataNode.matRAS);
    const LAI = this.vox2mm([L, A, I], dataNode.matRAS);
    const LPS = this.vox2mm([L, P, S], dataNode.matRAS);
    const LAS = this.vox2mm([L, A, S], dataNode.matRAS);
    const RPI = this.vox2mm([R, P, I], dataNode.matRAS);
    const RAI = this.vox2mm([R, A, I], dataNode.matRAS);
    const RPS = this.vox2mm([R, P, S], dataNode.matRAS);
    const RAS = this.vox2mm([R, A, S], dataNode.matRAS);
    const posTex = [
      //spatial position (XYZ), texture coordinates UVW
      // Superior face
      ...LPS,
      ...[0.0, 0.0, 1.0],
      ...RPS,
      ...[1.0, 0.0, 1.0],
      ...RAS,
      ...[1.0, 1.0, 1.0],
      ...LAS,
      ...[0.0, 1.0, 1.0],

      // Inferior face
      ...LPI,
      ...[0.0, 0.0, 0.0],
      ...LAI,
      ...[0.0, 1.0, 0.0],
      ...RAI,
      ...[1.0, 1.0, 0.0],
      ...RPI,
      ...[1.0, 0.0, 0.0],
    ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
      //six faces of cube: each has 2 triangles (6 indices)
      0,
      3,
      2,
      2,
      1,
      0, // Top
      4,
      7,
      6,
      6,
      5,
      4, // Bottom
      5,
      6,
      2,
      2,
      3,
      5, // Front
      4,
      0,
      1,
      1,
      7,
      4, // Back
      7,
      1,
      2,
      2,
      6,
      7, // Right
      4,
      5,
      3,
      3,
      0,
      4, // Left
    ];
    // Now send the element array to GL

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    const posTexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posTexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posTex), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, posTexBuffer);
    //vertex spatial position: 3 floats X,Y,Z
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    //UVW texCoord: (also three floats)
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.bindVertexArray(null);

    if (posTexBuffer && indexBuffer && vao) {
      const node = new NV3dVoxelNode(
        posTexBuffer,
        gl.TRIANGLES,
        indices.length,
        indexBuffer,
        vao,
        dataNode.clipPlaneDepthAziElev,
        dataNode.scale,
        dataNode.baseVolumeDims
      );
      // add textures

      return node;
    }
    return null;
  }
}
