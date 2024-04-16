#include ../colors.glsl;

uniform float uTime;

void main()	{
  csm_DiffuseColor = mix(csm_DiffuseColor,blue,(cos(uTime) * 0.5) + 0.5);
}
