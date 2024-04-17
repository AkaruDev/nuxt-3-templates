precision highp float;

uniform float uTime;
uniform float uSize;
uniform sampler2D uParticles;

attribute vec2 aParticlesUv;

void main()	{
  vec4 particle = texture2D(uParticles, aParticlesUv);
  vec3 p = particle.xyz;

  gl_PointSize = uSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}
