#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
in vec4 vClr;
in vec3 vN;
uniform sampler2D matCap;
out vec4 color;
void main() {
	vec3 n = normalize(vN);
	vec2 uv = n.xy * 0.5 + 0.5;
	uv.y = 1.0 - uv.y;
	vec3 clr = texture(matCap,uv.xy).rgb * vClr.rgb;
	color = vec4(clr, opacity);
}