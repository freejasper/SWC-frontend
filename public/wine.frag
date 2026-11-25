#version 300 es

precision highp float;

uniform vec2 u_resolution;

uniform vec2 u_droplets[500];

out vec4 outColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    outColor = vec4(1.0, 0.0, 0.0, 1.0);

    for (int i = 0; i < 500; i++) {
        vec2 dropletPos = u_droplets[i] / u_resolution;
        float dist = distance(uv, dropletPos);
        float radius = 0.02; // Adjust the radius as needed

        if (dist < radius) {
            outColor = vec4(0.5, 0.0, 0.0, 1.0); // Dark red color for droplets
            return;
        }
    }

}