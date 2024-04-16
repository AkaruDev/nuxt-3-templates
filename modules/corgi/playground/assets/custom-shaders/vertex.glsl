uniform float uTime;

#include ../noises/noise2D.glsl;

void main()	{

  vec2 p = csm_Position.xy;

  float noise = snoise(p * (0.5 + (cos(uTime) * 0.5)));

  csm_Position.z += noise;// (cos(noise) * 0.1) + 0.9;
}
