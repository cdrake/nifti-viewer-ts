#version 300 es
#line 262
precision highp int;
precision highp float;
uniform highp sampler2D bmpTexture;
in vec2 vUV;
out vec4 color;
void main() {
	color = texture(bmpTexture, vUV);
}