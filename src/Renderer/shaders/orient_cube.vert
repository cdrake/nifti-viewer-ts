#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
layout(location=0)  in vec3 a_position;
layout(location=1)  in vec3 a_color;
// A matrix to transform the positions by
uniform mat4 u_matrix;
out vec3 vColor;
// all shaders have a main function
void main() {
	// Multiply the position by the matrix.
	vec4 pos = vec4(a_position, 1.0);
	gl_Position = u_matrix * vec4(pos);
	vColor = a_color;
}