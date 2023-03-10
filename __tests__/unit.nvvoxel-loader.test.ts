import { describe, expect, test } from "@jest/globals";

import {
  NVVoxelLoaderOptions,
  NVVoxelLoader,
} from "../src/ResourceLoader/nvvoxel-loader";
import { NVIMAGE_TYPE } from "../src/nifti/nifit-image-data";
// import * as base64 from "./base64.txt";

function _base64ToArrayBuffer(base64Text) {
  const binary_string = window.atob(base64Text);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

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

  // test("Images is fetched", async () => {
  //   const array = _base64ToArrayBuffer(base64);
  //   global.fetch = jest.fn(() =>
  //     Promise.resolve({
  //       arrayBuffer: () => Promise.resolve(array),
  //     })
  //   ) as jest.Mock;

  //   const url = "http://localhost:5173";
  //   const dataItem = await NVVoxelLoader.load(
  //     new NVVoxelLoaderOptions({ url, imageType: NVIMAGE_TYPE.NII })
  //   );
  //   expect(dataItem.hdr).toBeDefined();
  // });
});
