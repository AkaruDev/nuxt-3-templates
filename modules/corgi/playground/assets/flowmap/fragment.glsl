precision highp float;

uniform sampler2D uFlowmap;

varying vec2 vUv;

void main()	{
  vec4 tFlowmap = texture2D(uFlowmap,vUv);

  vec3 color = vec3(0.1,0.4,0.4);

  color = mix(color * 0.8,color * 1.1,smoothstep(0.0,1.0,tFlowmap.r));
  color = mix(color,vec3(0.1,0.8,0.5),smoothstep(0.0,1.0,tFlowmap.g));
  color = mix(color,vec3(0.1,0.3,0.5),smoothstep(0.0,1.0,tFlowmap.b));

  gl_FragColor = vec4(color,1.0);
}
