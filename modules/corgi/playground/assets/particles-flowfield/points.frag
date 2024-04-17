precision highp float;

uniform float uTime;
uniform vec3 uColor;

#include ../utils/circle.glsl;

varying vec4 vParticle;

void main()	{
  vec2 uv = gl_PointCoord;
  // float alpha = 1.0 - (gradientCircle(uv, vec2(0.5), 1.0) + 0.5);
  float alpha = circle(uv, 1.0);
  vec3 position = smoothstep(0.0, 1.0, (vParticle.xyz * 2.0) + 1.0);

  gl_FragColor = vec4(position, alpha * vParticle.a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
