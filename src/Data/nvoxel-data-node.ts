import { DATA_BUFFER_TYPE, NVIMAGE_TYPE } from "../nifti/nifit-image-data";
import { NVVoxelDataItem } from "./nvvoxel-data-item";
import { v4 as uuidv4 } from "uuid";
import * as nifti from "nifti-reader-js";
import { mat3, mat4, vec3, vec4 } from "gl-matrix";
/**
 * Callback for property change
 */
export type NVPropertyChangeCallback = (
  nodeId: string,
  propertyName: string
) => void;

export class NVVoxelDataNode {
  id: string;
  _name: string;
  _colorMap: string;
  _opacity: number;
  _calMin: number;
  _calMax: number;
  _calMinMaxTrusted: boolean;
  _percentileFrac: number;
  _visible: boolean;
  _useQFormNotSForm: boolean;
  _alphaThresholdUsed: boolean;
  _colorMapNegative: string;
  _calMinNeg: number;
  _calMaxNeg: number;
  _colorbarVisible: boolean;
  _ignoreZeroVoxels: boolean;
  _dataType: DATA_BUFFER_TYPE;
  _dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
  _imageType: NVIMAGE_TYPE;
  _frame4D: number;
  _hdr: nifti.NIFTI1 | nifti.NIFTI2;
  dimsRAS?: number[];
  matRAS?: mat4;
  permRAS?: number[];
  pixDimsRAS?: number[];

  toRAS?: mat4;
  toRASvox?: mat4;

  onPropertyChange: NVPropertyChangeCallback | undefined;
  obliqueRAS?: mat4;
  maxShearDeg?: number;
  frac2mm?: mat4;
  frac2mmOrtho?: mat4;
  extentsMinOrtho?: number[];
  extentsMaxOrtho?: number[];
  mm2ortho?: mat4;
  oblique_angle?: number;
  mm000?: vec3;
  mm100?: vec3;
  mm010?: vec3;
  mm001?: vec3;

  constructor(data: NVVoxelDataItem) {
    // multiple objects could be defined from the same options. id is used to differentiate
    this.id = new uuidv4();
    this._alphaThresholdUsed = data.alphaThresholdUsed;
    this._colorMap = data.colorMap;
    this._opacity = data.opacity;
    this._calMax = data.calMax;
    this._calMaxNeg = data.calMaxNeg;
    this._calMin = data.calMin;
    this._calMinMaxTrusted = data.calMinMaxTrusted;
    this._calMinNeg = data.calMinNeg;
    this._colorMap = data.colorMap;
    this._colorMapNegative = data.colorMapNegative;
    this._colorbarVisible = data.colorbarVisible;
    this._dataBuffer = Object.assign([], data.dataBuffer);
    this._dataType = data.dataType;
    this._frame4D = data.frame4D;
    this._hdr = data.hdr;
    this._ignoreZeroVoxels = data.ignoreZeroVoxels;
    this._imageType = data.imageType;
    this._name = data.name;
    this._opacity = data.opacity;
    this._percentileFrac = data.percentileFrac;
    this._useQFormNotSForm = data.useQFormNotSForm;
    this._visible = data.visible;
  }

  get name() {
    return this.name;
  }
  set name(value: string) {
    this.name = value;
  }

  get colorMap() {
    return this._colorMap;
  }
  set colorMap(value) {
    this._colorMap = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "colorMap");
    }
  }

  get hdr() {
    return this._hdr;
  }

  get opactiy() {
    return this.opacity;
  }
  set opacity(value: number) {
    this.opacity = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "opacity");
    }
  }

  get percentileFrac() {
    return this.percentileFrac;
  }
  set percentileFrac(value) {
    this.percentileFrac = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "percentileFrac");
    }
  }

  get ignoreZeroVoxels() {
    return this.ignoreZeroVoxels;
  }
  set ignoreZeroVoxels(value) {
    this.ignoreZeroVoxels = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "ignoreZeroVoxels");
    }
  }

  get visible() {
    return this.visible;
  }
  set visible(value) {
    this.visible = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "visible");
    }
  }

  get frame4D() {
    return this._frame4D;
  }
  set frame4D(value) {
    this._frame4D = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "frame4D");
    }
  }

  get useQFormNotSForm() {
    return this.useQFormNotSForm;
  }
  set useQFormNotSForm(value) {
    this.useQFormNotSForm = value;
  }

  get alphaThresholdUsed() {
    return this.alphaThresholdUsed;
  }
  set alphaThresholdUsed(value) {
    this.alphaThresholdUsed = value;
  }

  get colorMapNegative() {
    return this.colorMapNegative;
  }
  set colorMapNegative(value) {
    this.colorMapNegative = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "colorMapNegative");
    }
  }

  get calMin() {
    return this.calMin;
  }
  set calMin(value) {
    this.calMin = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "calMin");
    }
  }

  get calMax() {
    return this.calMax;
  }
  set calMax(value) {
    this.calMax = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "calMax");
    }
  }

  get calMinNeg() {
    return this.calMinNeg;
  }
  set calMinNeg(value) {
    this.calMinNeg = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "calMinNeg");
    }
  }

  get calMinMaxTrusted() {
    return this.calMinMaxTrusted;
  }
  set calMinMaxTrusted(value) {
    this.calMinMaxTrusted = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "calMinMaxTrusted");
    }
  }

  get calMaxNeg() {
    return this.calMaxNeg;
  }
  set calMaxNeg(value) {
    this.calMaxNeg = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "calMaxNeg");
    }
  }

  get colorbarVisible() {
    return this.colorbarVisible;
  }
  set colorbarVisible(value) {
    this.colorbarVisible = value;
    if (this.onPropertyChange) {
      this.onPropertyChange(this.id, "colorbarVisible");
    }
  }

  get dataType() {
    return this.dataType;
  }

  get imageType() {
    return this.imageType;
  }

  calculateRAS(): void {
    // port of Matlab reorient() https://github.com/xiangruili/dicm2nii/blob/master/nii_viewer.m
    // not elegant, as JavaScript arrays are always 1D
    const a = this.hdr.affine;
    const header = this.hdr;
    const absR = mat3.fromValues(
      Math.abs(a[0][0]),
      Math.abs(a[0][1]),
      Math.abs(a[0][2]),
      Math.abs(a[1][0]),
      Math.abs(a[1][1]),
      Math.abs(a[1][2]),
      Math.abs(a[2][0]),
      Math.abs(a[2][1]),
      Math.abs(a[2][2])
    );
    //1st column = x
    const ixyz = [1, 1, 1];
    if (absR[3] > absR[0]) {
      ixyz[0] = 2; //(absR[1][0] > absR[0][0]) ixyz[0] = 2;
    }
    if (absR[6] > absR[0] && absR[6] > absR[3]) {
      ixyz[0] = 3; //((absR[2][0] > absR[0][0]) && (absR[2][0]> absR[1][0])) ixyz[0] = 3;
    } //2nd column = y
    ixyz[1] = 1;
    if (ixyz[0] === 1) {
      if (absR[4] > absR[7]) {
        //(absR[1][1] > absR[2][1])
        ixyz[1] = 2;
      } else {
        ixyz[1] = 3;
      }
    } else if (ixyz[0] === 2) {
      if (absR[1] > absR[7]) {
        //(absR[0][1] > absR[2][1])
        ixyz[1] = 1;
      } else {
        ixyz[1] = 3;
      }
    } else {
      if (absR[1] > absR[4]) {
        //(absR[0][1] > absR[1][1])
        ixyz[1] = 1;
      } else {
        ixyz[1] = 2;
      }
    }
    //3rd column = z: constrained as x+y+z = 1+2+3 = 6
    ixyz[2] = 6 - ixyz[1] - ixyz[0];
    const perm = [1, 2, 3];
    perm[ixyz[0] - 1] = 1;
    perm[ixyz[1] - 1] = 2;
    perm[ixyz[2] - 1] = 3;
    let rotM = mat4.fromValues(
      a[0][0],
      a[0][1],
      a[0][2],
      a[0][3],
      a[1][0],
      a[1][1],
      a[1][2],
      a[1][3],
      a[2][0],
      a[2][1],
      a[2][2],
      a[2][3],
      0,
      0,
      0,
      1
    );
    //n.b. 0.5 in these values to account for voxel centers, e.g. a 3-pixel wide bitmap in unit space has voxel centers at 0.25, 0.5 and 0.75
    this.mm000 = this.vox2mm([-0.5, -0.5, -0.5], rotM);
    this.mm100 = this.vox2mm([header.dims[1] - 0.5, -0.5, -0.5], rotM);
    this.mm010 = this.vox2mm([-0.5, header.dims[2] - 0.5, -0.5], rotM);
    this.mm001 = this.vox2mm([-0.5, -0.5, header.dims[3] - 0.5], rotM);
    const R = mat4.create();
    mat4.copy(R, rotM);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        R[i * 4 + j] = rotM[i * 4 + perm[j] - 1]; //rotM[i+(4*(perm[j]-1))];//rotM[i],[perm[j]-1];
      }
    }
    const flip = [0, 0, 0];
    if (R[0] < 0) flip[0] = 1; //R[0][0]
    if (R[5] < 0) flip[1] = 1; //R[1][1]
    if (R[10] < 0) flip[2] = 1; //R[2][2]
    this.dimsRAS = [
      header.dims[0],
      header.dims[perm[0]],
      header.dims[perm[1]],
      header.dims[perm[2]],
    ];
    this.pixDimsRAS = [
      header.pixDims[0],
      header.pixDims[perm[0]],
      header.pixDims[perm[1]],
      header.pixDims[perm[2]],
    ];
    this.permRAS = perm.slice();
    for (let i = 0; i < 3; i++)
      if (flip[i] === 1) this.permRAS[i] = -this.permRAS[i];
    if (
      this.arrayEquals(perm, [1, 2, 3]) &&
      this.arrayEquals(flip, [0, 0, 0])
    ) {
      this.toRAS = mat4.create(); //aka fromValues(1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1);
      this.matRAS = mat4.clone(rotM);
      this.calculateOblique();
      return; //no rotation required!
    }
    mat4.identity(rotM);
    rotM[0 + 0 * 4] = 1 - flip[0] * 2;
    rotM[1 + 1 * 4] = 1 - flip[1] * 2;
    rotM[2 + 2 * 4] = 1 - flip[2] * 2;
    rotM[3 + 0 * 4] = (header.dims[perm[0]] - 1) * flip[0];
    rotM[3 + 1 * 4] = (header.dims[perm[1]] - 1) * flip[1];
    rotM[3 + 2 * 4] = (header.dims[perm[2]] - 1) * flip[2];
    const residualR = mat4.create();
    mat4.invert(residualR, rotM);
    mat4.multiply(residualR, residualR, R);
    this.matRAS = mat4.clone(residualR);
    rotM = mat4.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1);
    rotM[perm[0] - 1 + 0 * 4] = -flip[0] * 2 + 1;
    rotM[perm[1] - 1 + 1 * 4] = -flip[1] * 2 + 1;
    rotM[perm[2] - 1 + 2 * 4] = -flip[2] * 2 + 1;
    rotM[3 + 0 * 4] = flip[0];
    rotM[3 + 1 * 4] = flip[1];
    rotM[3 + 2 * 4] = flip[2];
    this.toRAS = mat4.clone(rotM); //webGL unit textures
    //voxel based column-major,
    rotM[3] = 0;
    rotM[7] = 0;
    rotM[11] = 0;
    rotM[12] = 0;
    if (
      this.permRAS[0] === -1 ||
      this.permRAS[1] === -1 ||
      this.permRAS[2] === -1
    )
      rotM[12] = header.dims[1] - 1;
    rotM[13] = 0;
    if (
      this.permRAS[0] === -2 ||
      this.permRAS[1] === -2 ||
      this.permRAS[2] === -2
    )
      rotM[13] = header.dims[2] - 1;
    rotM[14] = 0;
    if (
      this.permRAS[0] === -3 ||
      this.permRAS[1] === -3 ||
      this.permRAS[2] === -3
    )
      rotM[14] = header.dims[3] - 1;
    this.toRASvox = mat4.clone(rotM);
    this.calculateOblique();
  }

  computeObliqueAngle(mtx44: mat4): number {
    const mtx = mat4.clone(mtx44);
    mat4.transpose(mtx, mtx44);
    const dxtmp = Math.sqrt(
      mtx[0] * mtx[0] + mtx[1] * mtx[1] + mtx[2] * mtx[2]
    );
    const xmax =
      Math.max(Math.max(Math.abs(mtx[0]), Math.abs(mtx[1])), Math.abs(mtx[2])) /
      dxtmp;
    const dytmp = Math.sqrt(
      mtx[4] * mtx[4] + mtx[5] * mtx[5] + mtx[6] * mtx[6]
    );
    const ymax =
      Math.max(Math.max(Math.abs(mtx[4]), Math.abs(mtx[5])), Math.abs(mtx[6])) /
      dytmp;
    const dztmp = Math.sqrt(
      mtx[8] * mtx[8] + mtx[9] * mtx[9] + mtx[10] * mtx[10]
    );
    const zmax =
      Math.max(
        Math.max(Math.abs(mtx[8]), Math.abs(mtx[9])),
        Math.abs(mtx[10])
      ) / dztmp;
    const fig_merit = Math.min(Math.min(xmax, ymax), zmax);
    let oblique_angle = Math.abs((Math.acos(fig_merit) * 180.0) / 3.141592653);
    if (oblique_angle > 0.01)
      console.log(
        "Warning voxels not aligned with world space: " +
          oblique_angle +
          " degrees from plumb.\n"
      );
    else oblique_angle = 0.0;
    return oblique_angle;
  }

  calculateOblique(): void {
    if (!this.matRAS || !this.pixDimsRAS || !this.dimsRAS || !this.permRAS) {
      return;
    }
    this.oblique_angle = this.computeObliqueAngle(this.matRAS);
    const LPI = this.vox2mm([0.0, 0.0, 0.0], this.matRAS);
    const X1mm = this.vox2mm([1.0 / this.pixDimsRAS[1], 0.0, 0.0], this.matRAS);
    const Y1mm = this.vox2mm([0.0, 1.0 / this.pixDimsRAS[2], 0.0], this.matRAS);
    const Z1mm = this.vox2mm([0.0, 0.0, 1.0 / this.pixDimsRAS[3]], this.matRAS);
    vec3.subtract(X1mm, X1mm, LPI);
    vec3.subtract(Y1mm, Y1mm, LPI);
    vec3.subtract(Z1mm, Z1mm, LPI);
    const oblique = mat4.fromValues(
      X1mm[0],
      X1mm[1],
      X1mm[2],
      0,
      Y1mm[0],
      Y1mm[1],
      Y1mm[2],
      0,
      Z1mm[0],
      Z1mm[1],
      Z1mm[2],
      0,
      0,
      0,
      0,
      1
    );
    this.obliqueRAS = mat4.clone(oblique);
    const XY = Math.abs(90 - vec3.angle(X1mm, Y1mm) * (180 / Math.PI));
    const XZ = Math.abs(90 - vec3.angle(X1mm, Z1mm) * (180 / Math.PI));
    const YZ = Math.abs(90 - vec3.angle(Y1mm, Z1mm) * (180 / Math.PI));
    this.maxShearDeg = Math.max(Math.max(XY, XZ), YZ);
    if (this.maxShearDeg > 0.1)
      console.log(
        "Warning: voxels are rhomboidal, maximum shear is %f degrees.",
        this.maxShearDeg
      );
    //compute a matrix to transform vectors from factional space to mm:
    const dim = vec4.fromValues(
      this.dimsRAS[1],
      this.dimsRAS[2],
      this.dimsRAS[3],
      1
    );
    const sform = mat4.clone(this.matRAS);
    mat4.transpose(sform, sform);
    const shim = vec3.fromValues(-0.5, -0.5, -0.5); //bitmap with 5 voxels scaled 0..1, voxel centers are 0.1,0.3,0.5,0.7,0.9
    mat4.translate(sform, sform, shim);
    //mat.mat4.scale(sform, sform, dim);
    sform[0] *= dim[0];
    sform[1] *= dim[0];
    sform[2] *= dim[0];
    sform[4] *= dim[1];
    sform[5] *= dim[1];
    sform[6] *= dim[1];
    sform[8] *= dim[2];
    sform[9] *= dim[2];
    sform[10] *= dim[2];
    this.frac2mm = mat4.clone(sform);
    const pixdimX = this.pixDimsRAS[1]; //vec3.length(X1mm);
    const pixdimY = this.pixDimsRAS[2]; //vec3.length(Y1mm);
    const pixdimZ = this.pixDimsRAS[3]; //vec3.length(Z1mm);
    //console.log("pixdim", pixdimX, pixdimY, pixdimZ);
    //orthographic view
    const oform = mat4.clone(sform);
    oform[0] = pixdimX * dim[0];
    oform[1] = 0;
    oform[2] = 0;
    oform[4] = 0;
    oform[5] = pixdimY * dim[1];
    oform[6] = 0;
    oform[8] = 0;
    oform[9] = 0;
    oform[10] = pixdimZ * dim[2];
    const originVoxel = this.mm2vox([0, 0, 0], true);
    //set matrix translation for distance from origin
    oform[12] = (-originVoxel[0] - 0.5) * pixdimX;
    oform[13] = (-originVoxel[1] - 0.5) * pixdimY;
    oform[14] = (-originVoxel[2] - 0.5) * pixdimZ;
    this.frac2mmOrtho = mat4.clone(oform);
    this.extentsMinOrtho = [oform[12], oform[13], oform[14]];
    this.extentsMaxOrtho = [
      oform[0] + oform[12],
      oform[5] + oform[13],
      oform[10] + oform[14],
    ];
    this.mm2ortho = mat4.create();
    mat4.invert(this.mm2ortho, oblique);
  }

  arrayEquals(a: number[], b: number[]) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  }

  vox2mm(XYZ: number[], mtx: mat4): vec3 {
    const sform = mat4.clone(mtx);
    mat4.transpose(sform, sform);
    const pos = vec4.fromValues(XYZ[0], XYZ[1], XYZ[2], 1);
    vec4.transformMat4(pos, pos, sform);
    const pos3 = vec3.fromValues(pos[0], pos[1], pos[2]);
    return pos3;
  }

  mm2vox(mm: number[], frac = false): vec3 {
    if (!this.matRAS) {
      throw Error("matRAS undefined");
    }
    const sform = mat4.clone(this.matRAS);
    const out = mat4.clone(sform);
    mat4.transpose(out, sform);
    mat4.invert(out, out);
    const pos = vec4.fromValues(mm[0], mm[1], mm[2], 1);
    vec4.transformMat4(pos, pos, out);
    const pos3 = vec3.fromValues(pos[0], pos[1], pos[2]);
    if (frac) return pos3;
    return vec3.fromValues(
      Math.round(pos3[0]),
      Math.round(pos3[1]),
      Math.round(pos3[2])
    );
  }
}
