float circle(vec2 uv, float radius){
  vec2 dist = uv - vec2(0.5);
	return 1.0 - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0);
}

float gradientCircle(vec2 uv,vec2 position) {
  return distance(uv,position);
}
