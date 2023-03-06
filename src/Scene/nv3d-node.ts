export class NV3dNode {
  _vertexBuffer: WebGLVertexArrayObject;
  _indexBuffer: WebGLVertexArrayObject;
  _mode: number;
  _indexCount: number;
  _textureCoordinateBuffer: WebGLVertexArrayObject;

  constructor(
    vertexBuffer: WebGLVertexArrayObject,
    mode: number,
    indexCount: number,
    indexBuffer: WebGLVertexArrayObject,
    textureCoordinateBuffer: WebGLVertexArrayObject
  ) {
    this._vertexBuffer = vertexBuffer;
    this._mode = mode;
    this._indexBuffer = indexBuffer;
    this._indexCount = indexCount;
    this._indexBuffer = indexBuffer;
    this._textureCoordinateBuffer = textureCoordinateBuffer;
  }

  public get vertexBuffer() {
    return this._vertexBuffer;
  }
}
