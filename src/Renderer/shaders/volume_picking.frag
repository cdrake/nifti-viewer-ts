#include functions;

#version 300 es
#line 506
//precision highp int;
precision highp float;
uniform vec3 rayDir;
uniform vec3 volScale;
uniform vec3 texVox;
uniform vec4 clipPlane;
uniform highp sampler3D volume, overlay;
uniform float overlays;
uniform mat4 matRAS;
uniform mat4 mvpMtx;
uniform float drawOpacity;
uniform highp sampler3D drawing;
uniform highp sampler2D colormap;
uniform int backgroundMasksOverlays;
in vec3 vColor;
out vec4 fColor;

void main() {
	int id = 254;
	vec3 start = vColor;
	gl_FragDepth = 0.0;
	fColor = vec4(0.0, 0.0, 0.0, 0.0); //assume no hit: ID = 0
	float fid = float(id & 255)/ 255.0;
	vec3 backPosition = GetBackPosition(start);
	vec3 dir = backPosition - start;
	float len = length(dir);
	float lenVox = length((texVox * start) - (texVox * backPosition));
	if ((lenVox < 0.5) || (len > 3.0)) return;//discard; //length limit for parallel rays
	float sliceSize = len / lenVox; //e.g. if ray length is 1.0 and traverses 50 voxels, each voxel is 0.02 in unit cube
	float stepSize = sliceSize; //quality: larger step is faster traversal, but fewer samples
	float opacityCorrection = stepSize/sliceSize;
	dir = normalize(dir);
	vec4 samplePos = vec4(start.xyz, 0.0); //ray position
	float lenNoClip = len;
	bool isClip = false;
	vec4 clipPos = applyClip(dir, samplePos, len, isClip);
	if (isClip) fColor = vec4(samplePos.xyz, 253.0 / 255.0); //assume no hit: ID = 0
	//start: OPTIONAL fast pass: rapid traversal until first hit
	float stepSizeFast = sliceSize * 1.9;
	vec4 deltaDirFast = vec4(dir.xyz * stepSizeFast, stepSizeFast);
	while (samplePos.a <= len) {
		float val = texture(volume, samplePos.xyz).a;
		if (val > 0.01) {
			fColor = vec4(samplePos.rgb, fid);
			gl_FragDepth = frac2ndc(samplePos.xyz);
			break;
		}
		samplePos += deltaDirFast; //advance ray position
	}
	//end: fast pass
	if ((overlays < 1.0) || (backgroundMasksOverlays > 0)) {
		return; //background hit, no overlays
	}
	//overlay pass
	len = min(lenNoClip, samplePos.a); //only find overlay closer than background
	samplePos = vec4(start.xyz, 0.0); //ray position
	while (samplePos.a <= len) {
		float val = texture(overlay, samplePos.xyz).a;
		if (val > 0.01) {
			fColor = vec4(samplePos.rgb, fid);
			gl_FragDepth = frac2ndc(samplePos.xyz);
			return;
		}
		samplePos += deltaDirFast; //advance ray position
	}
	//if (fColor.a == 0.0) discard; //no hit in either background or overlays
	//you only get here if there is a hit with the background that is closer than any overlay
}