#version 300 es
#line 262
precision highp int;
precision highp float;
uniform highp sampler2D fontTexture;
uniform vec4 fontColor;
uniform float screenPxRange;
in vec2 vUV;
out vec4 color;
float median(float r, float g, float b) {
	return max(min(r, g), min(max(r, g), b));
}
void main() {
	vec3 msd = texture(fontTexture, vUV).rgb;
	float sd = median(msd.r, msd.g, msd.b);
	float screenPxDistance = screenPxRange*(sd - 0.5);
	float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);
	color = vec4(fontColor.rgb , fontColor.a * opacity);
}