/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from "@jest/globals";
import { NVColorTables } from "../src/nvcolor-tables";

describe("nvcolor-tables", () => {
  test("Color tables imported", () => {
    const colorTable = new NVColorTables();
    expect(colorTable._colorLookupTableNames.length).toEqual(57);
  });
});
