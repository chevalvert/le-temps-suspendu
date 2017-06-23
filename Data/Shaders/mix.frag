uniform float time;
uniform float w;
uniform float h;
uniform float blendFactor;
uniform sampler2D tex0;
uniform sampler2D tex1;

varying vec2 vUv;


void main()
{
	gl_FragColor = mix( texture2D(tex0, vUv), texture2D(tex1, vUv), blendFactor) ;

}
