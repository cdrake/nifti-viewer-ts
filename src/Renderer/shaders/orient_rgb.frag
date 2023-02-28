#line 309
precision highp int;
precision highp float;
in vec2 TexCoord;
out vec4 FragColor;
uniform float coordZ;
uniform float layer;
uniform float scl_slope;
uniform float scl_inter;
uniform float cal_max;
uniform float cal_min;
uniform highp sampler2D colormap;
uniform lowp sampler3D blend3D;
uniform float opacity;
uniform mat4 mtx;
uniform bool hasAlpha;
uniform int modulation;
uniform highp sampler3D modulationVol;
void main(void) {
	vec4 vx = vec4(TexCoord.xy, coordZ, 1.0) * mtx;
	uvec4 aColor = texture(intensityVol, vx.xyz);
	FragColor = vec4(float(aColor.r) / 255.0, float(aColor.g) / 255.0, float(aColor.b) / 255.0, float(aColor.a) / 255.0);
	if (modulation == 1)
		FragColor.rgb *= texture(modulationVol, vx.xyz).r;
	if (!hasAlpha) {
		FragColor.a = (FragColor.r * 0.21 + FragColor.g * 0.72 + FragColor.b * 0.07);
		//next line: we could binarize alpha, but see rendering of visible human
		//FragColor.a = step(0.01, FragColor.a);
	}
	if (modulation == 2)
		FragColor.a = texture(modulationVol, vx.xyz).r;
	FragColor.a *= opacity;
}