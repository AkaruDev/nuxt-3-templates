precision highp float;

uniform float uTime;
uniform float uSize;

varying vec3 vPosition;

void main()	{
  vPosition = position;

  vec3 p = position;
  p += sin(uTime * 10.0 * p) * 0.01;

  gl_PointSize = uSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}
