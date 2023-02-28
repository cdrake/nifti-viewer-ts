#version 300 es
#line 4
layout(location=0) in vec3 pos;
uniform int axCorSag;
uniform mat4 mvpMtx;
uniform mat4 frac2mm;
uniform float slice;
out vec3 texPos;
void main(void) {
	texPos = vec3(pos.x, pos.y, slice);
	if (axCorSag > 1)
		texPos = vec3(slice, pos.x, pos.y);
	else if (axCorSag > 0)
		texPos = vec3(pos.x, slice, pos.y);
	vec4 mm = frac2mm * vec4(texPos, 1.0);
	gl_Position = mvpMtx * mm;
}