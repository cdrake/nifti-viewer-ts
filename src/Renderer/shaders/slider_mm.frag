#include functions;

#version 300 es
#line 228
precision highp int;
precision highp float;
uniform highp sampler3D volume, overlay;
uniform int backgroundMasksOverlays;
uniform float overlayOutlineWidth;
uniform int axCorSag;
uniform float overlays;
uniform float opacity;
uniform float drawOpacity;
uniform bool isAlphaClipDark;
uniform highp sampler3D drawing;
uniform highp sampler2D colormap;
in vec3 texPos;
out vec4 color;

void main() {
	//color = vec4(1.0, 0.0, 1.0, 1.0);return;
	vec4 background = texture(volume, texPos);
	color = vec4(background.rgb, opacity);
	if ((isAlphaClipDark) && (background.a == 0.0)) color.a = 0.0; //FSLeyes clipping range
	vec4 ocolor = vec4(0.0);
	if (overlays > 0.0) {
		ocolor = texture(overlay, texPos);
		//dFdx for "boxing" issue 435 has aliasing on some implementations (coarse vs fine)
		//however, this only identifies 50% of the edges due to aliasing effects
		// http://www.aclockworkberry.com/shader-derivative-functions/
		// https://bgolus.medium.com/distinctive-derivative-differences-cce38d36797b
		//if ((ocolor.a >= 1.0) && ((dFdx(ocolor.a) != 0.0) || (dFdy(ocolor.a) != 0.0)  ))
		//	ocolor.rbg = vec3(0.0, 0.0, 0.0);
		if ((overlayOutlineWidth > 0.0) && (ocolor.a >= 1.0)) { //check voxel neighbors for edge
			vec3 vx = (overlayOutlineWidth ) / vec3(textureSize(overlay, 0));
			vec3 vxR = vec3(texPos.x+vx.x, texPos.y, texPos.z);
			vec3 vxL = vec3(texPos.x-vx.x, texPos.y, texPos.z);
			vec3 vxA = vec3(texPos.x, texPos.y+vx.y, texPos.z);
			vec3 vxP = vec3(texPos.x, texPos.y-vx.y, texPos.z);
			vec3 vxS = vec3(texPos.x, texPos.y, texPos.z+vx.z);
			vec3 vxI = vec3(texPos.x, texPos.y, texPos.z-vx.z);
			float a = 1.0;
			if (axCorSag != 2) {
				a = min(a, texture(overlay, vxR).a);
				a = min(a, texture(overlay, vxL).a);
			}
			if (axCorSag != 1) {
				a = min(a, texture(overlay, vxA).a);
				a = min(a, texture(overlay, vxP).a);
			}
			if (axCorSag != 0) {
				a = min(a, texture(overlay, vxS).a);
				a = min(a, texture(overlay, vxI).a);
			}
			if (a < 1.0)
				ocolor.rbg = vec3(0.0, 0.0, 0.0);
		}
	}
	vec4 dcolor = drawColor(texture(drawing, texPos).r);
	if (dcolor.a > 0.0) {
		color.rgb = mix(color.rgb, dcolor.rgb, dcolor.a);
		color.a = max(drawOpacity, color.a);
	}
	if ((backgroundMasksOverlays > 0) && (background.a == 0.0))
		return;
	float a = color.a + ocolor.a * (1.0 - color.a); // premultiplied alpha
	if (a == 0.0) return;
	color.rgb = mix(color.rgb, ocolor.rgb, ocolor.a / a);
	color.a = a;
}