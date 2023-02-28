#version 300 es
#line 283
precision highp int;
precision highp float;
in vec3 vPos;
out vec2 TexCoord;
void main() {
	TexCoord = vPos.xy;
	gl_Position = vec4((vPos.x - 0.5) * 2.0, (vPos.y - 0.5) * 2.0, 0.0, 1.0);
}