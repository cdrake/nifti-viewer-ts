import nifti from "nifti-reader-js";

import { DATA_BUFFER_TYPE, NVIMAGE_TYPE } from "../nifti/nifit-image-data";
import { NVVoxelDataItem } from "Data/nvvoxel-data-item";
import { mat4 } from "gl-matrix";

/**
 * Options that can be supplied to constructor of {@link NVVoxelLoaderOptions}
 */
interface NVVoxelLoaderBaseOptions {
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
interface NVVoxelLoaderUrlOptions extends NVVoxelLoaderBaseOptions {
  url: string;
}

interface NVVoxelLoaderDataBufferOptions extends NVVoxelLoaderBaseOptions {
  dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
}
interface NVVoxelLoaderPairedDataOptions extends NVVoxelLoaderBaseOptions {
  pairedData: string;
  dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
}

type NVVoxelLoaderPartialOptions =
  | NVVoxelLoaderUrlOptions
  | NVVoxelLoaderDataBufferOptions
  | NVVoxelLoaderPairedDataOptions;

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
  dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array
    | undefined = undefined;
  dataType = DATA_BUFFER_TYPE.DT_UNKNOWN;
  imageType = NVIMAGE_TYPE.UNKNOWN;

  constructor(options: NVVoxelLoaderPartialOptions) {
    Object.assign(this, options);
  }
}

/**
 * Class to load voxel images
 */
export class NVVoxelLoader {
  hdr: nifti.NIFTI1 | nifti.NIFTI2 | null = null;
  dimsRAS: number[] | null = null;
  matRAS: mat4 | null = null;

  static async load(options: NVVoxelLoaderOptions): Promise<NVVoxelDataItem> {
    // copy the options
    const loaderOptions = { ...options };
    let hdr: nifti.NIFTI1 | nifti.NIFTI2 | undefined = undefined;
    let imgRaw:
      | Uint8Array
      | Uint16Array
      | Uint16Array
      | BigUint64Array
      | Float32Array
      | undefined;

    if (loaderOptions.url.length > 0) {
      const response = await fetch(loaderOptions.url);
      const dataBuffer = await response.arrayBuffer();
      switch (loaderOptions.imageType) {
        case NVIMAGE_TYPE.NII:
          hdr = nifti.readHeader(dataBuffer);
          if (hdr.cal_min === 0 && hdr.cal_max === 255) {
            hdr.cal_max = 0.0;
          }
          imgRaw = nifti.readImage(hdr, dataBuffer);
          break;
        default:
          throw new Error("Image type not supported");
      }
    }

    if (!imgRaw) {
      throw new Error("Image not loaded");
    }

    if (!hdr) {
      hdr = new nifti.NIFTI1();
    }

    const data = {
      name: loaderOptions.name,
      colorMap: loaderOptions.colorMap,
      opacity: loaderOptions.opacity,
      frame4D: 0,
      calMin: loaderOptions.calMin,
      calMax: loaderOptions.calMax,
      calMinMaxTrusted: loaderOptions.calMinMaxTrusted,
      percentileFrac: loaderOptions.percentileFrac,
      visible: loaderOptions.visible,
      useQFormNotSForm: loaderOptions.useQFormNotSForm,
      alphaThresholdUsed: loaderOptions.alphaThresholdUsed,
      colorMapNegative: loaderOptions.colorMapNegative,
      calMinNeg: loaderOptions.calMinNeg,
      calMaxNeg: loaderOptions.calMaxNeg,
      colorbarVisible: loaderOptions.colorbarVisible,
      ignoreZeroVoxels: loaderOptions.ignoreZeroVoxels,
      hdr,
      dataType: loaderOptions.dataType,
      dataBuffer: imgRaw,
      imageType: loaderOptions.imageType,
    };
    return data;
  }
}
