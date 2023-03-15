type NVUniformInfo = {
    loc: WebGLUniformLocation;
    type: number;
}

// based on github user Twinklebear's: https://github.com/Twinklebear/webgl-util and 
// https://github.com/KhronosGroup/glTF-Sample-Viewer/blob/main/source/Renderer/shader.js
export class NVShader {
    _program: WebGLProgram;
    _gl: WebGL2RenderingContext;
    _uniforms = new Map<string, NVUniformInfo>();
    _attributes = new Map<string, number>();

    constructor(vertSource: string, fragSource: string, gl: WebGL2RenderingContext) {
        this._gl = gl;

        const vs = gl.createShader(this._gl.VERTEX_SHADER)!;        
        gl.shaderSource(vs, vertSource)
        gl.compileShader(vs);
        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(vs));
            throw new Error("Vertex shader failed to compile, see console for log");
        }

        const fs = gl.createShader(gl.FRAGMENT_SHADER)!;        
        gl.shaderSource(fs, fragSource);
        gl.compileShader(fs);
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(fs));
            throw new Error("Fragment shader failed to compile, see console for log");
        }


        this._program = gl.createProgram()!;
        gl.attachShader(this._program, vs);
        gl.attachShader(this._program, fs);
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(this._program));
            throw new Error("Shader failed to link, see console for log");            
        }


        const uniformCount = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; ++i) {
            const info = this._gl.getActiveUniform(this._program, i);
            if (!info) {
                throw new Error("Info not found for uniform");
            }
            const loc = this._gl.getUniformLocation(this._program, info.name);
            if (!loc) {
                throw new Error("Location not found for uniform");
            }
            this._uniforms.set(info.name, { loc, type: info.type });
        }

        const attribCount = this._gl.getProgramParameter(this._program, this._gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attribCount; ++i) {
            const info = this._gl.getActiveAttrib(this._program, i);
            if (!info) {
                throw new Error("Info not found for uniform");
            }
            const loc = this._gl.getAttribLocation(this._program, info.name);
            if (!loc) {
                throw new Error("Location not found for uniform");
            }
            this._attributes.set(info.name, loc);
        }
    }

    use() {
        this._gl.useProgram(this._program);
    }

    getAttributeLocation(name: string) {
        if (!this._attributes.has(name)) {
            throw new Error(`Attribute ${name} not found`);
        }
        return this._attributes.get(name);
    }

    getUniformLocation(name: string) {
        if (!this._uniforms.has(name)) {
            throw new Error(`Uniform ${name} not found`);
        }
        return this._uniforms.get(name)?.loc;
    }

    getGLExtension(ext: string): boolean {
        return this._gl.getExtension(ext);
    }

    // upload the values of a uniform with the given name using type resolve to get correct function call
    updateUniformValue(uniformName: string, value: any, log: boolean)
    {
        const GL = this._gl;
        const uniform = this._uniforms.get(uniformName);

        if(uniform !== undefined)
        {
            switch (uniform.type) {
            case GL.FLOAT:
            {
                if(Array.isArray(value) || value instanceof Float32Array)
                {
                    this._gl.uniform1fv(uniform.loc, value);
                }else{
                    this._gl.uniform1f(uniform.loc, value);
                }
                break;
            }
            case GL.FLOAT_VEC2: this._gl.uniform2fv(uniform.loc, value); break;
            case GL.FLOAT_VEC3: this._gl.uniform3fv(uniform.loc, value); break;
            case GL.FLOAT_VEC4: this._gl.uniform4fv(uniform.loc, value); break;

            case GL.INT:
            {
                if(Array.isArray(value) || value instanceof Uint32Array || value instanceof Int32Array)
                {
                    this._gl.uniform1iv(uniform.loc, value);
                }else{
                    this._gl.uniform1i(uniform.loc, value);
                }
                break;
            }
            case GL.INT_VEC2: this._gl.uniform2iv(uniform.loc, value); break;
            case GL.INT_VEC3: this._gl.uniform3iv(uniform.loc, value); break;
            case GL.INT_VEC4: this._gl.uniform4iv(uniform.loc, value); break;

            case GL.FLOAT_MAT2: this._gl.uniformMatrix2fv(uniform.loc, false, value); break;
            case GL.FLOAT_MAT3: this._gl.uniformMatrix3fv(uniform.loc, false, value); break;
            case GL.FLOAT_MAT4: this._gl.uniformMatrix4fv(uniform.loc, false, value); break;
            }
        }
        else if(log)
        {
            console.warn("Unkown uniform: " + uniformName);
        }
    }

    destroy() {
        this._gl.deleteProgram(this._program);
    }
}
