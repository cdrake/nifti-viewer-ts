import { DATA_BUFFER_TYPE, NiftiDataBuffer, NVIMAGE_TYPE } from "../nifti/nifti-image-data";
import * as nifti from "nifti-reader-js";

export type NVVoxelDataItem = {
  name: string;
  colorMap: string;
  opacity: number;
  frame4D: number;
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
  hdr: nifti.NIFTI1 | nifti.NIFTI2;
  dataType: DATA_BUFFER_TYPE;
  dataBuffer: NiftiDataBuffer;
  imageType: NVIMAGE_TYPE;
};
