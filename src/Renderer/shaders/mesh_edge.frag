#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
in vec4 vClr;
in vec3 vN;
out vec4 color;
void main() {
	vec3 r = vec3(0.0, 0.0, 1.0); //rayDir: for orthographic projections moving in Z direction (no need for normal matrix)
	float diffuse = 1.0;
	float specular = 0.2;
	float shininess = 10.0;
	vec3 n = normalize(vN);
	vec3 lightPosition = vec3(0.0, 0.0, -5.0);
	vec3 l = normalize(lightPosition);
	float lightNormDot = max(dot(n, l), 0.0);
	vec3 d = lightNormDot * vClr.rgb * diffuse;
	float s = specular * pow(max(dot(reflect(l, n), r), 0.0), shininess);
	color = vec4(d + s, opacity);
}