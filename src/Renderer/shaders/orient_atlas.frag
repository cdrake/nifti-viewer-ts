#line 309
precision highp int;
precision highp float;
in vec2 TexCoord;
out vec4 FragColor;
uniform float coordZ;
uniform float layer;
//uniform float numLayers;
uniform highp sampler2D colormap;
uniform lowp sampler3D blend3D;
uniform float opacity;
uniform vec3 xyzFrac;
uniform mat4 mtx;
void main(void) {
	vec4 vx = vec4(TexCoord.x, TexCoord.y, coordZ, 1.0) * mtx;
	uint idx = texture(intensityVol, vx.xyz).r;
	FragColor = vec4(0.0, 0.0, 0.0, 0.0);
	if (idx == uint(0))
		return;
	if (xyzFrac.x > 0.0) { //outline
		vx = vec4(TexCoord.x+xyzFrac.x, TexCoord.y, coordZ, 1.0) * mtx;
		uint R = texture(intensityVol, vx.xyz).r;
		vx = vec4(TexCoord.x-xyzFrac.x, TexCoord.y, coordZ, 1.0) * mtx;
		uint L = texture(intensityVol, vx.xyz).r;
		vx = vec4(TexCoord.x, TexCoord.y+xyzFrac.y, coordZ, 1.0) * mtx;
		uint A = texture(intensityVol, vx.xyz).r;
		vx = vec4(TexCoord.x, TexCoord.y-xyzFrac.y, coordZ, 1.0) * mtx;
		uint P = texture(intensityVol, vx.xyz).r;
		vx = vec4(TexCoord.x, TexCoord.y, coordZ+xyzFrac.z, 1.0) * mtx;
		uint S = texture(intensityVol, vx.xyz).r;
		vx = vec4(TexCoord.x, TexCoord.y, coordZ-xyzFrac.z, 1.0) * mtx;
		uint I = texture(intensityVol, vx.xyz).r;
		if ((idx == R) && (idx == L) && (idx == A) && (idx == P) && (idx == S) && (idx == I))
			return;
	}
	idx = ((idx - uint(1)) % uint(100))+uint(1);
	float fx = (float(idx)+0.5) / 256.0;
	float nlayer = float(textureSize(colormap, 0).y) * 0.5; //0.5 as both each layer has positive and negative color slot
	float y = (2.0 * layer + 1.0)/(4.0 * nlayer);
	//float y = (2.0 * layer + 1.0)/(4.0 * numLayers);
	FragColor = texture(colormap, vec2(fx, y)).rgba;
	//FragColor.a *= opacity;
	FragColor.a = opacity;
	return;
	if (layer < 2.0) return;
	//vec2 texXY = TexCoord.xy*0.5 +vec2(0.5,0.5);
	//vec4 prevColor = texture(blend3D, vec3(texXY, coordZ));
	vec4 prevColor = texture(blend3D, vec3(TexCoord.xy, coordZ));
	// https://en.wikipedia.org/wiki/Alpha_compositing
	float aout = FragColor.a + (1.0 - FragColor.a) * prevColor.a;
	if (aout <= 0.0) return;
	FragColor.rgb = ((FragColor.rgb * FragColor.a) + (prevColor.rgb * prevColor.a * (1.0 - FragColor.a))) / aout;
	FragColor.a = aout;
}