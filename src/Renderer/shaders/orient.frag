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
uniform float cal_maxNeg;
uniform float cal_minNeg;
uniform bool isAlphaThreshold;
uniform highp sampler2D colormap;
uniform lowp sampler3D blend3D;
uniform int modulation;
uniform highp sampler3D modulationVol;
uniform float opacity;
uniform mat4 mtx;
void main(void) {
	vec4 vx = vec4(TexCoord.xy, coordZ, 1.0) * mtx;
	if ((vx.x < 0.0) || (vx.x > 1.0) || (vx.y < 0.0) || (vx.y > 1.0) || (vx.z < 0.0) || (vx.z > 1.0)) {
		//set transparent if out of range
		//https://webglfundamentals.org/webgl/webgl-3d-textures-repeat-clamp.html
		FragColor = texture(blend3D, vec3(TexCoord.xy, coordZ));
		return;
	}
	float f = (scl_slope * float(texture(intensityVol, vx.xyz).r)) + scl_inter;
	float mn = cal_min;
	float mx = cal_max;
	if (isAlphaThreshold)
		mn = 0.0;
	float r = max(0.00001, abs(mx - mn));
	mn = min(mn, mx);
	float txl = mix(0.0, 1.0, (f - mn) / r);
	//https://stackoverflow.com/questions/5879403/opengl-texture-coordinates-in-pixel-space
	float nlayer = float(textureSize(colormap, 0).y);
	float y = (layer + 0.5)/nlayer;
	//if (!isnan(cal_minNeg)) //Radeon drivers have issues NaN
	if (cal_minNeg < cal_maxNeg)
		y = (layer + 1.5)/nlayer;
	FragColor = texture(colormap, vec2(txl, y)).rgba;
	//negative colors
	mn = cal_minNeg;
	mx = cal_maxNeg;
	if (isAlphaThreshold)
		mx = 0.0;
	//if ((!isnan(cal_minNeg)) && ( f < mx)) {
	if ((cal_minNeg < cal_maxNeg) && ( f < mx)) {
		r = max(0.00001, abs(mx - mn));
		mn = min(mn, mx);
		txl = 1.0 - mix(0.0, 1.0, (f - mn) / r);
		y = (layer + 0.5)/nlayer;
		FragColor = texture(colormap, vec2(txl, y));
	}
	if (layer > 0.7)
		FragColor.a = step(0.00001, FragColor.a);
	//if (modulation > 10)
	//	FragColor.a *= texture(modulationVol, vx.xyz).r;
	//	FragColor.rgb *= texture(modulationVol, vx.xyz).r;
	if (isAlphaThreshold) {
		if ((cal_minNeg != cal_maxNeg) && ( f < 0.0) && (f > cal_maxNeg))
			FragColor.a = pow(-f / -cal_maxNeg, 2.0);
		else if ((f > 0.0) && (cal_min > 0.0))
			FragColor.a *= pow(f / cal_min, 2.0); //issue435:  A = (V/X)**2
		//FragColor.g = 0.0;
	}
	if (modulation == 1) {
		FragColor.rgb *= texture(modulationVol, vx.xyz).r;
	} else if (modulation == 2) {
		FragColor.a = texture(modulationVol, vx.xyz).r;
	}
	FragColor.a *= opacity;
	if (layer < 1.0) return;
	vec4 prevColor = texture(blend3D, vec3(TexCoord.xy, coordZ));
	// https://en.wikipedia.org/wiki/Alpha_compositing
	float aout = FragColor.a + (1.0 - FragColor.a) * prevColor.a;
	if (aout <= 0.0) return;
	FragColor.rgb = ((FragColor.rgb * FragColor.a) + (prevColor.rgb * prevColor.a * (1.0 - FragColor.a))) / aout;
	FragColor.a = aout;
}