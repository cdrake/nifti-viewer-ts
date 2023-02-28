#include functions;

#version 300 es
#line 14
precision highp int;
precision highp float;
uniform vec3 rayDir;
uniform vec3 texVox;
uniform int backgroundMasksOverlays;
uniform vec3 volScale;
uniform vec4 clipPlane;
uniform highp sampler3D volume, overlay;
uniform float overlays;
uniform float backOpacity;
uniform mat4 mvpMtx;
uniform mat4 matRAS;
uniform vec4 clipPlaneColor;
uniform float drawOpacity;
uniform highp sampler3D drawing;
uniform highp sampler2D colormap;
in vec3 vColor;
out vec4 fColor;

void main() {
	if (fColor.x > 2.0) {
		fColor = vec4(1.0, 0.0, 0.0, 0.5);
		return;
	}
	fColor = vec4(0.0,0.0,0.0,0.0);
	vec4 clipPlaneColorX = clipPlaneColor;
	//if (clipPlaneColor.a < 0.0)
	//	clipPlaneColorX.a = - 1.0;
	bool isColorPlaneInVolume = false;
	if (clipPlaneColorX.a < 0.0) {
		isColorPlaneInVolume = true;
		clipPlaneColorX.a = 0.0;
	}
	//fColor = vec4(vColor.rgb, 1.0); return;
	vec3 start = vColor;
	gl_FragDepth = 0.0;
	vec3 backPosition = GetBackPosition(start);
	// fColor = vec4(backPosition, 1.0); return;
	vec3 dir = backPosition - start;
	float len = length(dir);
	float lenVox = length((texVox * start) - (texVox * backPosition));
	if ((lenVox < 0.5) || (len > 3.0)) { //length limit for parallel rays
		return;
	}
	float sliceSize = len / lenVox; //e.g. if ray length is 1.0 and traverses 50 voxels, each voxel is 0.02 in unit cube
	float stepSize = sliceSize; //quality: larger step is faster traversal, but fewer samples
	float opacityCorrection = stepSize/sliceSize;
	dir = normalize(dir);
	vec4 deltaDir = vec4(dir.xyz * stepSize, stepSize);
	vec4 samplePos = vec4(start.xyz, 0.0); //ray position
	float lenNoClip = len;
	bool isClip = false;
	vec4 clipPos = applyClip(dir, samplePos, len, isClip);
	//if ((clipPos.a != samplePos.a) && (len < 3.0)) {
	//start: OPTIONAL fast pass: rapid traversal until first hit
	float stepSizeFast = sliceSize * 1.9;
	vec4 deltaDirFast = vec4(dir.xyz * stepSizeFast, stepSizeFast);
	while (samplePos.a <= len) {
		float val = texture(volume, samplePos.xyz).a;
		if (val > 0.01)
			break;
		samplePos += deltaDirFast; //advance ray position
	}
	if ((samplePos.a >= len) && (((overlays < 1.0) && (drawOpacity <= 0.0) ) || (backgroundMasksOverlays > 0)))  {
		if (isClip)
			fColor += clipPlaneColorX;
		return;
	}
	fColor = vec4(1.0, 1.0, 1.0, 1.0);
	//gl_FragDepth = frac2ndc(samplePos.xyz); //crude due to fast pass resolution
	samplePos -= deltaDirFast;
	if (samplePos.a < 0.0)
		vec4 samplePos = vec4(start.xyz, 0.0); //ray position
	//end: fast pass
	vec4 colAcc = vec4(0.0,0.0,0.0,0.0);
	vec4 firstHit = vec4(0.0,0.0,0.0,2.0 * lenNoClip);
	const float earlyTermination = 0.95;
	float backNearest = len; //assume no hit
	float ran = fract(sin(gl_FragCoord.x * 12.9898 + gl_FragCoord.y * 78.233) * 43758.5453);
	samplePos += deltaDir * ran; //jitter ray
	while (samplePos.a <= len) {
		vec4 colorSample = texture(volume, samplePos.xyz);
		samplePos += deltaDir; //advance ray position
		if (colorSample.a >= 0.01) {
			if (firstHit.a > lenNoClip)
				firstHit = samplePos;
			backNearest = min(backNearest, samplePos.a);
			colorSample.a = 1.0-pow((1.0 - colorSample.a), opacityCorrection);
			colorSample.rgb *= colorSample.a;
			colAcc= (1.0 - colAcc.a) * colorSample + colAcc;
			if ( colAcc.a > earlyTermination )
				break;
		}
	}
	if (firstHit.a < len)
		gl_FragDepth = frac2ndc(firstHit.xyz);
	colAcc.a = (colAcc.a / earlyTermination) * backOpacity;
	fColor = colAcc;
	//if (isClip) //CR
	if ((isColorPlaneInVolume) && (clipPos.a != samplePos.a) && (abs(firstHit.a - clipPos.a) < deltaDir.a))
		fColor.rgb = mix(fColor.rgb, clipPlaneColorX.rgb, abs(clipPlaneColor.a));
		//fColor.rgb = mix(fColor.rgb, clipPlaneColorX.rgb, clipPlaneColorX.a * 0.65);
	if ((overlays < 1.0) && (drawOpacity <= 0.0))
		return;
	//overlay pass
	len = lenNoClip;
	samplePos = vec4(start.xyz, 0.0); //ray position
	//start: OPTIONAL fast pass: rapid traversal until first hit
	stepSizeFast = sliceSize * 1.0;
	deltaDirFast = vec4(dir.xyz * stepSizeFast, stepSizeFast);
	while (samplePos.a <= len) {
		float val = texture(overlay, samplePos.xyz).a;
		if (drawOpacity > 0.0)
			val = max(val, texture(drawing, samplePos.xyz).r);
		if (val > 0.001)
			break;
		samplePos += deltaDirFast; //advance ray position
	}
	if (samplePos.a >= len) {
		if (isClip && (fColor.a == 0.0))
				fColor += clipPlaneColorX;
			return;
	}
	samplePos -= deltaDirFast;
	if (samplePos.a < 0.0)
		vec4 samplePos = vec4(start.xyz, 0.0); //ray position
	//end: fast pass
	float overFarthest = len;
	colAcc = vec4(0.0, 0.0, 0.0, 0.0);
	samplePos += deltaDir * ran; //jitter ray
	vec4 overFirstHit = vec4(0.0,0.0,0.0,2.0 * len);
	if (backgroundMasksOverlays > 0)
		samplePos = firstHit;
	while (samplePos.a <= len) {
		vec4 colorSample = texture(overlay, samplePos.xyz);
		if ((colorSample.a < 0.01) && (drawOpacity > 0.0)) {
			float val = texture(drawing, samplePos.xyz).r;
			colorSample = drawColor(val);
		}
		samplePos += deltaDir; //advance ray position
		if (colorSample.a >= 0.01) {
			if (overFirstHit.a > len)
				overFirstHit = samplePos;
			colorSample.a = 1.0-pow((1.0 - colorSample.a), opacityCorrection);
			colorSample.rgb *= colorSample.a;
			colAcc= (1.0 - colAcc.a) * colorSample + colAcc;
			overFarthest = samplePos.a;
			if ( colAcc.a > earlyTermination )
				break;
		}
	}
	//if (samplePos.a >= len) {
	if (colAcc.a <= 0.0) {
		if (isClip && (fColor.a == 0.0))
			fColor += clipPlaneColorX;
		return;
	}
	//if (overFirstHit.a < len)
	gl_FragDepth = frac2ndc(overFirstHit.xyz);
	float overMix = colAcc.a;
	float overlayDepth = 0.3;
	if (fColor.a <= 0.0)
		overMix = 1.0;
	else if (((overFarthest) > backNearest)) {
		float dx = (overFarthest - backNearest)/1.73;
		dx = fColor.a * pow(dx, overlayDepth);
		overMix *= 1.0 - dx;
	}
	fColor.rgb = mix(fColor.rgb, colAcc.rgb, overMix);
	fColor.a = max(fColor.a, colAcc.a);
}