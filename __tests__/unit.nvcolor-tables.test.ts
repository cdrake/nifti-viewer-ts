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

  test("Color tables throws error for non-existant color table name", () => {
    const colorTable = new NVColorTables();

    // You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
    // https://jestjs.io/docs/expect#tothrowerror
    expect(() => {
      colorTable.getColormap("not-existant-colortable");
    }).toThrowError("Color Lookup Table missing");
  });
});
