import { NVShader } from "./nvshader";

/**
 * Generates and caches shader source text for a given permutation
 */
export class NVShaderCache {
    _gl: WebGL2RenderingContext;
    _shaderMap = new Map<string, NVShader>();

    constructor(gl: WebGL2RenderingContext) {
        this._gl = gl;
    }

    addShader(name: string, vertSource: string, fragSource: string) {
        const program = new NVShader(vertSource, fragSource, this._gl);
        this._shaderMap.set(name, program);
    }

    getShader(name: string): NVShader {
        if(!this._shaderMap.has(name)) {
            throw new Error(`Shader ${name} not found`);
        }
        return this._shaderMap.get(name)!;
    }

    deleteShader(name: string) {
        if (this._shaderMap.has(name)) {
            const shader = this._shaderMap.get(name)!;
            shader.destroy();
            this._shaderMap.delete(name);
        }
    }

}
