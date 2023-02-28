#version 300 es
layout(location=0) in vec3 pos;
uniform mat4 mvpMtx;
void main(void) {
	gl_Position = mvpMtx * vec4(pos, 1.0);
}