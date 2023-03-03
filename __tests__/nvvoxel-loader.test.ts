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
});
