#version 300 es
precision highp int;
precision highp float;
uniform float opacity;
in vec4 vClr;
in vec3 vN;
out vec4 color;
float stepmix(float edge0, float edge1, float E, float x){
	float T = clamp(0.5 * (x - edge0 + E) / E, 0.0, 1.0);
	return mix(edge0, edge1, T);
}
void main() {
	vec3 r = vec3(0.0, 0.0, 1.0);
	float ambient = 0.3;
	float diffuse = 0.6;
	float specular = 0.5;
	float shininess = 50.0;
	vec3 n = normalize(vN);
	vec3 lightPosition = vec3(0.0, 10.0, -5.0);
	vec3 l = normalize(lightPosition);
	float df = max(0.0, dot(n, l));
	float sf = pow(max(dot(reflect(l, n), r), 0.0), shininess);
	const float A = 0.1;
	const float B = 0.3;
	const float C = 0.6;
	const float D = 1.0;
	float E = fwidth(df);
	if (df > A - E && df < A + E) df = stepmix(A, B, E, df);
	else if (df > B - E && df < B + E) df = stepmix(B, C, E, df);
	else if (df > C - E && df < C + E) df = stepmix(C, D, E, df);
	else if (df < A) df = 0.0;
	else if (df < B) df = B;
	else if (df < C) df = C;
	else df = D;
	E = fwidth(sf);
	if (sf > 0.5 - E && sf < 0.5 + E)
		sf = smoothstep(0.5 - E, 0.5 + E, sf);
	else
		sf = step(0.5, sf);
	vec3 a = vClr.rgb * ambient;
	vec3 d = max(df, 0.0) * vClr.rgb * diffuse;
	color.rgb = a + d + (specular * sf);
	color.a = opacity;
}