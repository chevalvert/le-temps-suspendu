uniform float w;
uniform float h;
uniform float x;
uniform float y;
void main()
{
	float d = 1.0-distance( gl_FragCoord.xy, vec2(x*w,y*h) ) / (0.5*w);
	gl_FragColor = vec4(d,d,d,1.0);
}
