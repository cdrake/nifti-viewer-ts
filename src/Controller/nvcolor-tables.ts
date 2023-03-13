import * as cmaps from "../cmaps";

export class NVColorTables {
  version = 0.1;
  gamma = 1.0;

  _colorLookupTableCache = new Map<string, Uint8ClampedArray>();
  _colorLookupTableNames: Array<string>;

  constructor() {
    this._colorLookupTableNames = Object.entries(cmaps)
      .filter((e) => !e[0].startsWith("_")) //ignore drawing maps
      .map((e) => e[0].toLowerCase());
  }

  /**
   * Returns a list of loaded color maps
   * @param {boolean} sorted Whether to sort the array alphabetically
   * @returns {string[]}
   */
  listColorMaps(sorted = true): string[] {
    return sorted
      ? [...this._colorLookupTableNames].sort()
      : [...this._colorLookupTableNames];
  }

  /**
   * Returns a color lookup table
   * @param {string} lutName Lookup table name
   * @returns {Uint8ClampedArray}
   */
  getColormap(lutName = "gray") {
    if (this._colorLookupTableCache.has(lutName)) {
      return this._colorLookupTableCache.get(lutName);
    }

    let lut: Uint8ClampedArray;
    const lutNameLower = lutName.toLowerCase();
    if (lutNameLower in this._colorLookupTableNames) {
      lut = this.makeLut(
        cmaps[lutNameLower].R,
        cmaps[lutNameLower].G,
        cmaps[lutNameLower].B,
        cmaps[lutNameLower].A,
        cmaps[lutNameLower].I
      );
    } else {
      throw new Error("Color Lookup Table missing");
    }
    this._colorLookupTableCache.set(lutNameLower, lut);
    return lut;
  }

  /**
   * create color lookup table provided arrays of reds, greens, blues, alphas and intensity indices
   * intensity indices should be in increasing order with the first value 0 and the last 255.
   * this.makeLut([0, 255], [0, 0], [0,0], [0,128],[0,255]);
   * @param { number[] } Rs reds
   * @param { number[] } Gs greens
   * @param { number[] } Bs blues
   * @param { number[] } As alphas
   * @param { number[] } Is intensities
   */
  makeLut(
    Rs: number[],
    Gs: number[],
    Bs: number[],
    As: number[],
    Is: number[]
  ): Uint8ClampedArray {
    const lut = new Uint8ClampedArray(256 * 4);
    for (let i = 0; i < Is.length - 1; i++) {
      const idxLo = Is[i];
      const idxHi = Is[i + 1];
      const idxRng = idxHi - idxLo;
      let k = idxLo * 4;
      for (let j = idxLo; j <= idxHi; j++) {
        const f = (j - idxLo) / idxRng;
        lut[k++] = Rs[i] + f * (Rs[i + 1] - Rs[i]); //Red
        lut[k++] = Gs[i] + f * (Gs[i + 1] - Gs[i]); //Green
        lut[k++] = Bs[i] + f * (Bs[i + 1] - Bs[i]); //Blue
        lut[k++] = As[i] + f * (As[i + 1] - As[i]); //Alpha
      }
    }
    if (this.gamma === 1.0) return lut;
    for (let i = 0; i < 255 * 4; i++) {
      if (i % 4 === 3) continue; //gamma changes RGB, not Alpha
      lut[i] = Math.pow(lut[i] / 255, 1 / this.gamma) * 255;
    }
    return lut;
  }
}
