#version 300 es
#line 742
	precision highp float;
	precision highp int;
	precision highp isampler3D;
	layout(location = 0) out int label;
	layout(location = 1) out int strength;
	in vec2 TexCoord;
	uniform int finalPass;
	uniform float coordZ;
	uniform lowp sampler3D in3D;
	uniform highp isampler3D inputTexture0; // background
	uniform highp isampler3D inputTexture1; // label
	uniform highp isampler3D inputTexture2; // strength
void main(void) {
	vec3 interpolatedTextureCoordinate = vec3(TexCoord.xy, coordZ);
	ivec3 size = textureSize(inputTexture0, 0);
	ivec3 texelIndex = ivec3(floor(interpolatedTextureCoordinate * vec3(size)));
	int background = texelFetch(inputTexture0, texelIndex, 0).r;
	label = texelFetch(inputTexture1, texelIndex, 0).r;
	strength = texelFetch(inputTexture2, texelIndex, 0).r;
	for (int k = -1; k <= 1; k++) {
		for (int j = -1; j <= 1; j++) {
			for (int i = -1; i <= 1; i++) {
				if (i != 0 && j != 0 && k != 0) {
					ivec3 neighborIndex = texelIndex + ivec3(i,j,k);
					int neighborBackground = texelFetch(inputTexture0, neighborIndex, 0).r;
					int neighborStrength = texelFetch(inputTexture2, neighborIndex, 0).r;
					int strengthCost = abs(neighborBackground - background);
					int takeoverStrength = neighborStrength - strengthCost;
					if (takeoverStrength > strength) {
						strength = takeoverStrength;
						label = texelFetch(inputTexture1, neighborIndex, 0).r;
					}
				}
			}
		}
	}
	if (finalPass < 1)
		return;
	int ok = 1;
	ivec4 labelCount = ivec4(0,0,0,0);
	for (int k = -1; k <= 1; k++)
		for (int j = -1; j <= 1; j++)
			for (int i = -1; i <= 1; i++) {
				ivec3 neighborIndex = texelIndex + ivec3(i,j,k);
				int ilabel = texelFetch(inputTexture1, neighborIndex, 0).r;
				if ((ilabel < 0) || (ilabel > 3))
					ok = 0;
				else
					labelCount[ilabel]++;
			}
	if (ok != 1) {
		return;
	}
	int maxIdx = 0;
	for (int i = 1; i < 4; i++) {
		if (labelCount[i] > labelCount[maxIdx])
			maxIdx = i;
	}
	label = maxIdx;
}