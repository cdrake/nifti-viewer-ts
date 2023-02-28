#version 300 es
precision highp float;
uniform vec4 u_color;
in vec3 vColor;
out vec4 outColor;
void main() {
	outColor = vec4(vColor, 1.0);
}