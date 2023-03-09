import { describe, expect, test } from "@jest/globals";
import { NVVoxelLoaderOptions } from "../src/ResourceLoader/nvvoxel-loader";

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
});
