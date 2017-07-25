uniform float w;
uniform float h;
uniform float x;
uniform float y;
uniform float distFactor;
void main()
{
	float d = 1.0-distance( gl_FragCoord.xy, vec2(x*w,y*h) ) / (distFactor*w);
	gl_FragColor = vec4(d,d,d,1.0);
}
