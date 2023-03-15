import { NV3dNode } from "./nv3d-node";

export class NV3dVoxelNode extends NV3dNode {
    _clipPlaneDepthAziElev: [number, number, number];
    _scale: number;
    _baseVolumeDims: [number, number, number];

    constructor(
        vertexBuffer: WebGLVertexArrayObject,
        mode: number,
        indexCount: number,
        indexBuffer: WebGLVertexArrayObject,
        textureCoordinateBuffer: WebGLVertexArrayObject,
        clipPlaneDepthAziElev: [number, number, number],
        scale: number,
        baseVolumeDims: [number, number, number]
      ){
        super(vertexBuffer, mode, indexCount, indexBuffer, textureCoordinateBuffer);

        
        this._clipPlaneDepthAziElev = clipPlaneDepthAziElev;
        this._scale = scale;
        this._baseVolumeDims = baseVolumeDims;
      }
}