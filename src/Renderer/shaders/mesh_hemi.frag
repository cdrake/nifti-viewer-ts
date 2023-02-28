#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
in vec4 vClr;
in vec3 vN;
out vec4 color;
void main() {
	vec3 r = vec3(0.0, 0.0, 1.0); //rayDir: for orthographic projections moving in Z direction (no need for normal matrix)
	float ambient = 0.35;
	float diffuse = 0.5;
	float specular = 0.2;
	float shininess = 10.0;
	vec3 n = normalize(vN);
	vec3 lightPosition = vec3(0.0, 10.0, -5.0);
	vec3 l = normalize(lightPosition);
	float lightNormDot = dot(n, l);
	vec3 up = vec3(0.0, 1.0, 0.0);
	float ax = dot(n, up) * 0.5 + 0.5;  //Shreiner et al. (2013) OpenGL Programming Guide, 8th Ed., p 388. ISBN-10: 0321773039
	vec3 upClr = vec3(1.0, 1.0, 0.95);
	vec3 downClr = vec3(0.4, 0.4, 0.6);
	vec3 a = vClr.rgb * ambient;
	a *= mix(downClr, upClr, ax);
	vec3 d = max(lightNormDot, 0.0) * vClr.rgb * diffuse;
	float s = specular * pow(max(dot(reflect(l, n), r), 0.0), shininess);
	color = vec4(a + d + s, opacity);
}