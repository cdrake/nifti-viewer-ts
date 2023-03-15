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

export type NiftiDataBuffer =
  | Uint8Array
  | Uint16Array
  | Uint16Array
  | BigUint64Array
  | Float32Array
