#version 300 es

precision highp float;

uniform vec2 u_resolution;

uniform vec2 u_droplets[1000];
uniform int u_activeCount;

out vec4 outColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    outColor = vec4(0.0, 0.0, 0.0, 0.0);

    float density = 0.0;
    float radius = 0.08;
    float aspect = u_resolution.x / u_resolution.y;

    int count = clamp(u_activeCount, 0, 1000);

    for (int i = 0; i < 1000; i++) {
        if (i >= count) break;
        vec2 dropletPos = u_droplets[i];


        float yDiff = abs(uv.y - dropletPos.y);
        if (yDiff < radius) {
            float xDiff = abs(uv.x - dropletPos.x) * aspect;
            if (xDiff < radius) {
                float dist = length(vec2(xDiff, yDiff));
                if (dist < radius) {
                    float t = 1.0 - (dist / radius);
                    density += t * t;
                }
            }
        }
    }

    float solid = smoothstep(0.25, 0.75, density);

    float liquid = smoothstep(0.9, 0.99, solid);

    if (liquid > 0.0) {
        outColor = vec4((191.0/255.0), (5.0/255.0), (3.0/255.0), 1.);
    } else {
        outColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}