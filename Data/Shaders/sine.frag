uniform float time;
uniform float w;
uniform float h;
uniform float freqSin;
void main()
{
		float d = 0.5+0.5*sin( -time + freqSin*distance(gl_FragCoord.xy, vec2(0.5*w,0.5*h))/(0.5*w) );
	gl_FragColor = vec4(d,d,d,1.0);
}
