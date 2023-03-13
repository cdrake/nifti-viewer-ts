/**
 * @jest-environment jsdom
 */
import { describe, expect, test } from "@jest/globals";
import { NVColorTables } from "../src/Controller/nvcolor-tables";

describe("nvcolor-tables", () => {
  test("Color tables imported with no undescrore names", () => {
    const colorTable = new NVColorTables();
    expect(colorTable._colorLookupTableNames.length).toEqual(57);
    const startsWithUndescoreCount = colorTable._colorLookupTableNames.filter(
      (n) => n.startsWith("_")
    );
    expect(startsWithUndescoreCount).toEqual(0);
  });

  test("Color tables throws error for non-existent color table name", () => {
    const colorTable = new NVColorTables();

    // You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
    // https://jestjs.io/docs/expect#tothrowerror
    expect(() => {
      colorTable.getColormap("not-existent-colortable");
    }).toThrowError("Color Lookup Table missing");
  });
});
