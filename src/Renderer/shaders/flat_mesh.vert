#version 300 es
layout(location=0) in vec3 pos;
layout(location=1) in vec4 norm;
layout(location=2) in vec4 clr;
uniform mat4 mvpMtx;
//uniform mat4 modelMtx;
uniform mat4 normMtx;
out vec4 vClr;
flat out vec3 vN;
void main(void) {
	gl_Position = mvpMtx * vec4(pos, 1.0);
	vN = normalize((normMtx * vec4(norm.xyz,1.0)).xyz);
	//vV = -vec3(modelMtx*vec4(pos,1.0));
	vClr = clr;
}