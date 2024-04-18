precision highp float;

uniform sampler2D uFlowmap;

varying vec2 vUv;

void main()	{
  vec4 tFlowmap = texture2D(uFlowmap,vUv);

  gl_FragColor = tFlowmap;
}
