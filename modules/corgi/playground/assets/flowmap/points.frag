precision highp float;

uniform float uTime;
uniform vec3 uColor;

#include ../utils/circle.glsl;

void main()	{
  vec2 uv = gl_PointCoord;
  float distanceToCenter = length(uv - 0.5);
  float alpha = circle(uv, 0.5);

  gl_FragColor = vec4(uColor, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
