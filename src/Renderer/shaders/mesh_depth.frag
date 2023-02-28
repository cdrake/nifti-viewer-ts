#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
out vec4 color;
vec4 packFloatToVec4i(const float value) {
	const vec4 bitSh = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
	const vec4 bitMsk = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
	vec4 res = fract(value * bitSh);
	res -= res.xxyz * bitMsk;
	return res;
}
void main() {
	color = packFloatToVec4i(gl_FragCoord.z);
}