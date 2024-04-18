precision highp float;

varying vec2 vUv;
uniform sampler2D uFlowmap;

void main()	{
  vUv = uv;
  vec4 tFlowmap = texture2D(uFlowmap,vUv);

  vec3 p = position;
  p.z += tFlowmap.r;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0 );
}
