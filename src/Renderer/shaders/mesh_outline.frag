#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
in vec4 vClr;
in vec3 vN;
out vec4 color;
void main() {
	vec3 r = vec3(0.0, 0.0, 1.0); //rayDir: for orthographic projections moving in Z direction (no need for normal matrix)
	float ambient = 0.3;
	float diffuse = 0.6;
	float specular = 0.25;
	float shininess = 10.0;
	float PenWidth = 0.6;
	vec3 n = normalize(vN);
	vec3 lightPosition = vec3(0.0, 10.0, -5.0);
	vec3 l = normalize(lightPosition);
	float lightNormDot = dot(n, l);
	float view = abs(dot(n,r)); //with respect to viewer
	if (PenWidth < view) discard;
	vec3 a = vClr.rgb * ambient;
	vec3 d = max(lightNormDot, 0.0) * vClr.rgb * diffuse;
	float s = specular * pow(max(dot(reflect(l, n), r), 0.0), shininess);
	color.rgb = a + d + s;
	color.a = opacity;
}