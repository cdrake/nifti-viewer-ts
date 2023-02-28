#version 300 es
precision highp int;
precision highp float;
in vec4 vClr;
out vec4 color;
uniform float opacity;
void main() {
	//color = vClr;
	color = vec4(vClr.rgb, opacity);
}