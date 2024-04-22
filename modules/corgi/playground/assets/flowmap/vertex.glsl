precision highp float;

varying vec2 vUv;
uniform sampler2D uFlowmap;

// R and G values are velocity in the x and y direction
// B value is the velocity length

void main()	{
  vUv = uv;
  vec4 tFlowmap = texture2D(uFlowmap,vUv);

  vec3 p = position;
  p.z += (tFlowmap.b) ;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0 );
}
