import { DATA_BUFFER_TYPE, NVIMAGE_TYPE } from "../nifti/nifit-image-data";

export type NVVoxelDataNode = {
  id: string;
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
  dataBuffer:
    | Uint8Array
    | Uint16Array
    | Uint16Array
    | BigUint64Array
    | Float32Array;
  imageType: NVIMAGE_TYPE;
};
