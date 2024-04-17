precision highp float;

uniform float uTime;
uniform float uSize;
uniform vec2 uResolution;
uniform sampler2D uParticles;

attribute vec2 aParticlesUv;

varying vec4 vParticle;

void main()	{
  vec4 particle = texture2D(uParticles, aParticlesUv);
  vec3 p = particle.xyz;

  vParticle = particle;

  // Point size
  float sizeIn = smoothstep(0.0, 0.5, particle.a);
  float sizeOut = 1.0 - smoothstep(0.5, 1.0, particle.a);
  float size = min(sizeIn, sizeOut);

  gl_PointSize = size * uSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}
