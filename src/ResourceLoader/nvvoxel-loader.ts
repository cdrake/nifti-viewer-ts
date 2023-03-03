import { v4 as uuidv4 } from "uuid";
import { mat3, mat4, vec3, vec4 } from "gl-matrix";
import nifti from "nifti-reader-js";

import { NV3dNode } from "../nv3d-node";

// Convert enum to string https://stackoverflow.com/questions/17380845/how-do-i-convert-a-string-to-enum-in-typescript
export enum NVIMAGE_TYPE {
  UNKNOWN = 0,
  NII = 1,
  DCM = 2,
  DCM_MANIFEST = 3,
  MIH = 4,
  MIF = 5,
  NHDR = 6,
  NRRD = 7,
  MHD = 8,
  MHA = 9,
  MGH = 10,
  MGZ = 11,
  V = 12,
  V16 = 13,
  VMR = 14,
  HEAD = 15,
  DCM_FOLDER = 16,
}

// https://nifti.nimh.nih.gov/pub/dist/src/niftilib/nifti1.h
export enum DATA_BUFFER_TYPE {
  // the original ANALYZE 7.5 type codes
  DT_NONE = 0,
  DT_UNKNOWN = 0,
  DT_BINARY = 1,
  DT_UNSIGNED_CHAR = 2,
  DT_SIGNED_SHORT = 4,
  DT_SIGNED_INT = 8,
  DT_FLOAT = 16,
  DT_COMPLEX = 32,
  DT_DOUBLE = 64,
  DT_RGB = 128,
  DT_ALL = 255,
  // another set of names for the same
  DT_UINT8 = 2,
  DT_INT16 = 4,
  DT_INT32 = 8,
  DT_FLOAT32 = 16,
  DT_COMPLEX64 = 32,
  DT_FLOAT64 = 64,
  DT_RGB24 = 128,
  // new codes for NIFTI
  DT_INT8 = 256,
  DT_UINT16 = 512,
  DT_UINT32 = 768,
  DT_INT64 = 1024,
  DT_UINT64 = 1280,
  DT_FLOAT128 = 1536,
  DT_COMPLEX128 = 1792,
  DT_COMPLEX256 = 2048,
  DT_RGBA32 = 2304,
}

/**
 * Options that can be supplied to constructor of {@link NVVoxelLoaderOptions}
 */
interface NVVoxelConfigOptions {
  name?: string;
  colorMap?: string;
  opacity?: number;
  calMin?: number;
  calMax?: number;
  calMinMaxTrusted?: boolean;
  percentileFrac?: number;
  visible?: boolean;
  useQFormNotSForm?: boolean;
  alphaThresholdUsed?: boolean;
  colorMapNegative?: string;
  calMinNeg?: number;
  calMaxNeg?: number;
  colorbarVisible?: boolean;
  ignoreZeroVoxels?: boolean;
  dataType?: DATA_BUFFER_TYPE;
  imageType?: NVIMAGE_TYPE;
}

interface NVVoxelBaseConfigData {
  name: string;
  colorMap: string;
  opacity: number;
  calMin: number;
  calMax: number;
  calMinMaxTrusted: boolean;
  percentileFrac: number;
  visible: boolean;
  useQFormNotSForm: boolean;
  alphaThresholdUsed: boolean;
  colorMapNegative: string;
  calMinNeg: number;
  calMaxNeg: number;
  colorbarVisible: boolean;
  ignoreZeroVoxels: boolean;
  dataType: DATA_BUFFER_TYPE;
  imageType: NVIMAGE_TYPE;
}

interface NVVoxelFromUrlConfig extends NVVoxelConfigOptions {
  url: string;
}

interface NVVoxelFromDataBufferConfig extends NVVoxelConfigOptions {
  dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
}
interface NVVoxelFromPairedDataConfig extends NVVoxelConfigOptions {
  pairedData: string;
  dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
}

type NVVoxelPartialConfigData =
  | NVVoxelFromUrlConfig
  | NVVoxelFromDataBufferConfig
  | NVVoxelFromPairedDataConfig;

type NVVoxelConfigData = NVVoxelPartialConfigData & NVVoxelBaseConfigData;

/**
 * Super set of all loader configuration options. This will initialize default values for all of the base options.
 */
export class NVVoxelLoaderOptions {
  url = "";
  urlImgData = "";
  name = "";
  colorMap = "gray";
  opacity = 1.0;
  calMin = NaN;
  calMax = NaN;
  calMinMaxTrusted = true;
  percentileFrac = 0.02;
  visible = true;
  useQFormNotSForm = false;
  alphaThresholdUsed = false;
  colorMapNegative = "";
  calMinNeg = NaN;
  calMaxNeg = NaN;
  colorbarVisible = true;
  ignoreZeroVoxels = false;
  pairedData = "";
  dataBuffer = undefined;
  dataType = DATA_BUFFER_TYPE.DT_UNKNOWN;
  imageType = NVIMAGE_TYPE.UNKNOWN;

  constructor(options: NVVoxelPartialConfigData) {
    Object.assign(this, options);
  }
}

/**
 * Callback for colormap change
 */
type ColorMapChangeCallback = (c: string) => void;

/**
 * Callback for opacity change
 */
type OpacityChangeCallback = (o: number) => void;

/**
 * Class to load voxel images
 */
export class NVVoxelLoader {
  hdr: nifti.NIFTI1 | nifti.NIFTI2 | null = null;
  dimsRAS: number[] | null = null;
  matRAS: mat4 | null = null;
  options: NVVoxelConfigData;
  id: string;
  frame4D: number;
  imgRaw:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
  onColorMapChange: ColorMapChangeCallback | undefined;
  onOpacityChange: OpacityChangeCallback | undefined;

  constructor(options: NVVoxelConfigData) {
    // copy the options
    this.options = { ...options };

    // multiple objects could be defined from the same options. id is used to differentiate
    this.id = uuidv4();

    // initialize default data members for rendering
    this.frame4D = 0;
    this.imgRaw = new Uint8Array();
  }

  get name() {
    return this.options.name;
  }
  set name(value: string) {
    this.options.name = value;
  }

  get colorMap() {
    return this.options.colorMap;
  }
  set colorMap(value) {
    this.options.colorMap = value;
    if (this.onColorMapChange) {
      this.onColorMapChange(value);
    }
  }

  get opactiy() {
    return this.options.opacity;
  }
  set opacity(value: number) {
    this.options.opacity = value;
    if (this.onOpacityChange) {
      this.onOpacityChange(value);
    }
  }

  get percentileFrac() {
    return this.options.percentileFrac;
  }
  set percentileFrac(value) {
    this.options.percentileFrac = value;
  }

  get ignoreZeroVoxels() {
    return this.options.ignoreZeroVoxels;
  }
  set ignoreZeroVoxels(value) {
    this.options.ignoreZeroVoxels = value;
  }

  get visible() {
    return this.options.visible;
  }
  set visible(value) {
    this.options.visible = value;
  }

  get useQFormNotSForm() {
    return this.options.useQFormNotSForm;
  }
  set useQFormNotSForm(value) {
    this.options.useQFormNotSForm = value;
  }

  get alphaThresholdUsed() {
    return this.options.alphaThresholdUsed;
  }
  set alphaThresholdUsed(value) {
    this.options.alphaThresholdUsed = value;
  }

  get colorMapNegative() {
    return this.options.colorMapNegative;
  }
  set colorMapNegative(value) {
    this.options.colorMapNegative = value;
  }

  get calMinNeg() {
    return this.options.calMinNeg;
  }
  set calMinNeg(value) {
    this.options.calMinNeg = value;
  }

  get colorbarVisible() {
    return this.options.colorbarVisible;
  }
  set colorbarVisible(value) {
    this.options.colorbarVisible = value;
  }

  get dataType() {
    return this.options.dataType;
  }
  set dataType(value) {
    this.options.dataType = value;
  }

  get imageType() {
    return this.options.imageType;
  }
  set imageType(value) {
    this.options.imageType = value;
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

  // static loadFromUrl(url: string, options = new NVVoxelLoaderOptions()) {}

  public to3dNode(gl: WebGL2RenderingContext): NV3dNode | null {
    if (!this.dimsRAS || !this.matRAS) {
      return null;
    }
    // TODO(cdrake): create slices here ( updateGLVolume and refreshLayers and refreshColormaps)

    //cube has 8 vertices: left/right, posterior/anterior, inferior/superior
    //n.b. voxel coordinates are from VOXEL centers
    // add/subtract 0.5 to get full image field of view
    const L = -0.5;
    const P = -0.5;
    const I = -0.5;
    const R = this.dimsRAS[1] - 1 + 0.5;
    const A = this.dimsRAS[2] - 1 + 0.5;
    const S = this.dimsRAS[3] - 1 + 0.5;

    const LPI = this.vox2mm([L, P, I], this.matRAS);
    const LAI = this.vox2mm([L, A, I], this.matRAS);
    const LPS = this.vox2mm([L, P, S], this.matRAS);
    const LAS = this.vox2mm([L, A, S], this.matRAS);
    const RPI = this.vox2mm([R, P, I], this.matRAS);
    const RAI = this.vox2mm([R, A, I], this.matRAS);
    const RPS = this.vox2mm([R, P, S], this.matRAS);
    const RAS = this.vox2mm([R, A, S], this.matRAS);
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
      const node = new NV3dNode(
        posTexBuffer,
        gl.TRIANGLES,
        indices.length,
        indexBuffer,
        vao
      );
      return node;
    }
    return null;
  }
}
