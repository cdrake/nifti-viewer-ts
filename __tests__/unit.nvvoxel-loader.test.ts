/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from "@jest/globals";

import {
  NVVoxelLoaderOptions,
  NVVoxelLoader,
} from "../src/ResourceLoader/nvvoxel-loader";
import { NVIMAGE_TYPE } from "../src/nifti/nifit-image-data";
import { sampleNiftiBase64 as base64 } from "./data/sample-nifti-base64";

function _base64ToArrayBuffer(base64Text) {
  const binary_string = window.atob(base64Text);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

const compareArrays = (a, b) => {
  if (a.length !== b.length) return false;
  else {
    // Comparing each element of your array
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
};

describe("nvvoxel-loader", () => {
  test("Options initialized from url", () => {
    const url = "https://localhost:8080/url";
    const name = "test-image";
    const urlLoaderOptions = new NVVoxelLoaderOptions({ url, name });
    expect(urlLoaderOptions.name).toBe(name);
    expect(urlLoaderOptions.url).toBe(url);
  });

  test("Options initialized from data buffer", () => {
    const name = "test-image";
    const dataBuffer = new Uint8Array(15);
    const dataBufferOptions = new NVVoxelLoaderOptions({ dataBuffer, name });
    expect(dataBufferOptions.name).toBe(name);
    expect(dataBufferOptions.dataBuffer).toBeDefined();
    const resultBuffer = dataBufferOptions.dataBuffer as Uint8Array;
    expect(resultBuffer.length).toEqual(15);
  });

  test("Options initialized from paired data", () => {
    const name = "test-image";
    const pairedData = "https://localhost:8080/image-url";
    const dataBuffer = new Uint8Array(15);
    const dataBufferOptions = new NVVoxelLoaderOptions({
      pairedData,
      dataBuffer,
      name,
    });
    expect(dataBufferOptions.name).toBe(name);
    expect(dataBufferOptions.pairedData).toBe(pairedData);
    expect(dataBufferOptions.dataBuffer).toBeDefined();
    const resultBuffer = dataBufferOptions.dataBuffer as Uint8Array;
    expect(resultBuffer.length).toEqual(15);
  });

  // values from https://nifti.nimh.nih.gov/nifti-1/data/avg152T1_LR_nifti_ntool.txt
  test("Images is fetched", async () => {
    const array = _base64ToArrayBuffer(base64);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        arrayBuffer: () => Promise.resolve(array),
      })
    ) as jest.Mock;

    const url = "http://localhost:5173";
    const dataItem = await NVVoxelLoader.load(
      new NVVoxelLoaderOptions({ url, imageType: NVIMAGE_TYPE.NII })
    );
    expect(dataItem.hdr).toBeDefined();
    expect(dataItem.hdr.description).toEqual("FSL3.2beta");
    expect(dataItem.hdr.magic).toEqual("n+1");
    const dims = [3, 91, 109, 91, 1, 1, 1, 1];
    let arraysAreEqual = compareArrays(dims, dataItem.hdr.dims);
    expect(arraysAreEqual).toEqual(true);
    const pixDims = [0.0, 2.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0];
    arraysAreEqual = compareArrays(pixDims, dataItem.hdr.pixDims);
    expect(arraysAreEqual).toEqual(true);
    // expect(dataItem.hdr.cal_max).toEqual(255);
    expect(dataItem.hdr.cal_min).toEqual(0);
  });
});
