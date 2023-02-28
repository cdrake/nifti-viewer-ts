#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
in vec4 vClr;
in vec3 vN;
out vec4 color;
//Spherical harmonics constants
const float C1 = 0.429043;
const float C2 = 0.511664;
const float C3 = 0.743125;
const float C4 = 0.886227;
const float C5 = 0.247708;
//Spherical harmonics coefficients
// Ramamoorthi, R., and P. Hanrahan. 2001b. "An Efficient Representation for Irradiance Environment Maps." In Proceedings of SIGGRAPH 2001, pp. 497–500.
// https://github.com/eskimoblood/processingSketches/blob/master/data/shader/shinyvert.glsl
// https://github.com/eskimoblood/processingSketches/blob/master/data/shader/shinyvert.glsl
// Constants for Eucalyptus Grove lighting
const vec3 L00  = vec3( 0.3783264,  0.4260425,  0.4504587);
const vec3 L1m1 = vec3( 0.2887813,  0.3586803,  0.4147053);
const vec3 L10  = vec3( 0.0379030,  0.0295216,  0.0098567);
const vec3 L11  = vec3(-0.1033028, -0.1031690, -0.0884924);
const vec3 L2m2 = vec3(-0.0621750, -0.0554432, -0.0396779);
const vec3 L2m1 = vec3( 0.0077820, -0.0148312, -0.0471301);
const vec3 L20  = vec3(-0.0935561, -0.1254260, -0.1525629);
const vec3 L21  = vec3(-0.0572703, -0.0502192, -0.0363410);
const vec3 L22  = vec3( 0.0203348, -0.0044201, -0.0452180);
vec3 SH(vec3 vNormal) {
	vNormal = vec3(vNormal.x,vNormal.z,vNormal.y);
	vec3 diffuseColor = C1 * L22 * (vNormal.x * vNormal.x - vNormal.y * vNormal.y) +
	C3 * L20 * vNormal.z * vNormal.z +
	C4 * L00 -
	C5 * L20 +
	2.0 * C1 * L2m2 * vNormal.x * vNormal.y +
	2.0 * C1 * L21  * vNormal.x * vNormal.z +
	2.0 * C1 * L2m1 * vNormal.y * vNormal.z +
	2.0 * C2 * L11  * vNormal.x +
	2.0 * C2 * L1m1 * vNormal.y +
	2.0 * C2 * L10  * vNormal.z;
	return diffuseColor;
}
void main() {
	vec3 r = vec3(0.0, 0.0, 1.0); //rayDir: for orthographic projections moving in Z direction (no need for normal matrix)
	float ambient = 0.3;
	float diffuse = 0.6;
	float specular = 0.1;
	float shininess = 10.0;
	vec3 n = normalize(vN);
	vec3 lightPosition = vec3(0.0, 10.0, -5.0);
	vec3 l = normalize(lightPosition);
	float s = specular * pow(max(dot(reflect(l, n), r), 0.0), shininess);
	vec3 a = vClr.rgb * ambient;
	vec3 d = vClr.rgb * diffuse * SH(-reflect(n, vec3(l.x, l.y, -l.z)) );
	color = vec4(a + d + s, opacity);
}