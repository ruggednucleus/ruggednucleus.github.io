precision highp float;

uniform vec2 viewportDimensions;
uniform float minI;
uniform float maxI;
uniform float minR;
uniform float maxR;

void main()
{
    vec2 c = vec2(
        gl_FragCoord.x * (maxR - minR) / viewportDimensions.x + minR,
        gl_FragCoord.y * (maxI - minI) / viewportDimensions.y + minI
    );

    vec2 z = c;
    float iterations = 0.0;
    float maxIterations = 2000.0;
    const int maxit = 2000;
    float color = 0.0;

    for(int i = 0; i < maxit; i++) {
        float t = 2.0 * z.x * z.y + c.y;
        z.x = z.x * z.x - z.y * z.y + c.x;
        z.y = t;

        if(z.x * z.x + z.y * z.y > 4.0) {
            break;
        }

        iterations += 1.0;
    }

    if(iterations < maxIterations) {
        color = (iterations / maxIterations);
        gl_FragColor = vec4(color, color, color, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}