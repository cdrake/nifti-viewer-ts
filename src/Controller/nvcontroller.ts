import {
  NVVoxelLoaderOptions,
  NVVoxelLoader,
} from "ResourceLoader/nvvoxel-loader";
import { NVVoxelDataItem } from "Data/nvvoxel-data-item";
import { NVVoxelDataNode } from "Data/nvoxel-data-node";

import { NV3dNode } from "Scene/nv3d-node";
import { mat4, vec3, vec4 } from "gl-matrix";

/**
 * Responsible for updating scene graph and data graph
 */
export class NVController {
  /**
   * Loads a nifti image from url
   * @param {string} url
   * @returns {NVVoxelDataNode}
   */
  public async loadImageFromUrl(url: string): Promise<NVVoxelDataNode> {
    const options = new NVVoxelLoaderOptions({ url });
    const dataItem: NVVoxelDataItem = await NVVoxelLoader.load(options);
    return new NVVoxelDataNode(dataItem);
  }

  /**
   * Converts voxel space into millimetric space
   * @param {number[]} xyz - Voxel position (row, colum, slice)
   * @param {mat4} mtx  - RAS coordinates transformation matrix
   * @returns {vec3} - Millimetric world space coodinates
   */
  vox2mm(xyz: number[], mtx: mat4): vec3 {
    const sform = mat4.clone(mtx);
    mat4.transpose(sform, sform);
    const pos = vec4.fromValues(xyz[0], xyz[1], xyz[2], 1);
    vec4.transformMat4(pos, pos, sform);
    const pos3 = vec3.fromValues(pos[0], pos[1], pos[2]);
    return pos3;
  }

  public to3dNode(
    gl: WebGL2RenderingContext,
    dataNode: NVVoxelDataNode
  ): NV3dNode | null {
    //cube has 8 vertices: left/right, posterior/anterior, inferior/superior
    //n.b. voxel coordinates are from VOXEL centers
    // add/subtract 0.5 to get full image field of view
    const L = -0.5;
    const P = -0.5;
    const I = -0.5;

    if (!dataNode.dimsRAS) {
      throw new Error("dimRAS not defined");
    }

    const R = dataNode.dimsRAS[1] - 1 + 0.5;
    const A = dataNode.dimsRAS[2] - 1 + 0.5;
    const S = dataNode.dimsRAS[3] - 1 + 0.5;

    if (!dataNode.matRAS) {
      throw new Error("matRAS not defined");
    }

    const LPI = this.vox2mm([L, P, I], dataNode.matRAS);
    const LAI = this.vox2mm([L, A, I], dataNode.matRAS);
    const LPS = this.vox2mm([L, P, S], dataNode.matRAS);
    const LAS = this.vox2mm([L, A, S], dataNode.matRAS);
    const RPI = this.vox2mm([R, P, I], dataNode.matRAS);
    const RAI = this.vox2mm([R, A, I], dataNode.matRAS);
    const RPS = this.vox2mm([R, P, S], dataNode.matRAS);
    const RAS = this.vox2mm([R, A, S], dataNode.matRAS);
    const posTex = [
      //spatial position (XYZ), texture coordinates UVW
      // Superior face
      ...LPS,
      ...[0.0, 0.0, 1.0],
      ...RPS,
      ...[1.0, 0.0, 1.0],
      ...RAS,
      ...[1.0, 1.0, 1.0],
      ...LAS,
      ...[0.0, 1.0, 1.0],

      // Inferior face
      ...LPI,
      ...[0.0, 0.0, 0.0],
      ...LAI,
      ...[0.0, 1.0, 0.0],
      ...RAI,
      ...[1.0, 1.0, 0.0],
      ...RPI,
      ...[1.0, 0.0, 0.0],
    ];

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.

    const indices = [
      //six faces of cube: each has 2 triangles (6 indices)
      0,
      3,
      2,
      2,
      1,
      0, // Top
      4,
      7,
      6,
      6,
      5,
      4, // Bottom
      5,
      6,
      2,
      2,
      3,
      5, // Front
      4,
      0,
      1,
      1,
      7,
      4, // Back
      7,
      1,
      2,
      2,
      6,
      7, // Right
      4,
      5,
      3,
      3,
      0,
      4, // Left
    ];
    // Now send the element array to GL

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    const posTexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posTexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posTex), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, posTexBuffer);
    //vertex spatial position: 3 floats X,Y,Z
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
    //UVW texCoord: (also three floats)
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
    gl.bindVertexArray(null);

    if (posTexBuffer && indexBuffer && vao) {
      const node = new NV3dNode(
        posTexBuffer,
        gl.TRIANGLES,
        indices.length,
        indexBuffer,
        vao
      );
      return node;
    }
    return null;
  }
}
