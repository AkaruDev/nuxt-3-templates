uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBase;

#include ../noises/noise4D.glsl;
#include ../utils/circle.glsl;

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture2D(uParticles,uv);
    vec4 base = texture(uBase, uv);

    // Dead
    if(particle.a >= 1.0)
    {
        particle.a = mod(particle.a,1.0);
        particle.xyz = base.xyz;
    }

    vec3 flowField = vec3(
      snoise(vec4(particle.xyz, uTime)),
      snoise(vec4(particle.xyz + 1.0, uTime)),
      snoise(vec4(particle.xyz + 2.0, uTime))
    );
    flowField = normalize(flowField);

    float circle = gradientCircle(uv, vec2(0.5));

    particle.xyz += flowField * uDeltaTime * 0.2;
    // Decay
    particle.a += uDeltaTime * 0.03;

    gl_FragColor = particle;
}
