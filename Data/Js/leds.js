var leds = function(){}

//--------------------------------------------------------
leds.prototype.init = function(configuration)
{
	console.log( "leds.init()" );
	console.log( " - host="+configuration.artnet.host );

	//--------------------------------------------------------
	this.artnet = require('artnet')({host: configuration.artnet.host});


	//--------------------------------------------------------
	// Values sent to hardware
	this.values 			= new Array(512); 	// between 0.0 and 255.0
	this.valuesApplied 		= new Array(512);	// between valueAppliedMin and valueAppliedMax
	this.valueAppliedMin 	= 0.0;				// éclairage minimum
	this.valueAppliedMax 	= 255.0;			// éclairage maximum

	//--------------------------------------------------------
	this.apply = function()
	{
		// map values
		for (var i=0;i<this.values.length;i++)
			this.valuesApplied[i] = this.mapValue( this.values[i] );
	
		// send
		this.artnet.set(this.valuesApplied);
	}

	//--------------------------------------------------------
	this.mapValue = function(v)
	{
		// Just in case
		if (this.valueAppliedMin >= this.valueAppliedMax)
			return v * 255.0;
		// Lerp
		return v * (this.valueAppliedMax - this.valueAppliedMin) + this.valueAppliedMin;
	}

	//--------------------------------------------------------
	// v is normalized
	this.setValueAppliedMin = function(v)
	{
		this.valueAppliedMin = 255.0*v;
	}

	//--------------------------------------------------------
	// v is normalized
	this.setValueAppliedMax = function(v)
	{
		this.valueAppliedMax = 255.0*v;
	}

	//--------------------------------------------------------
	this.reset = function()
	{
		for(var i=0; i<this.values.length;i++)
			this.values[i]=0;
		this.apply();
	}

	//--------------------------------------------------------
	this.updateCeil = function(valuesCeil)
	{
		var offset = 0;
		for(var i=0; i<valuesCeil.length;i++)
			this.values[ this.map[offset+i] ] = valuesCeil[i];
		this.apply();
	}

	//--------------------------------------------------------
	this.updateFloor = function(valuesFloor)
	{
		var offset = 18*12;
		for(var i=0; i<valuesFloor.length;i++)
			this.values[ this.map[offset+i] ] = valuesFloor[i];
		this.apply();
	}
	
	//--------------------------------------------------------
	this.close = function()
	{
		this.artnet.close();
	}

	// Generated with Tools / sketch_map_dmx.pde
	this.map = new Array(300);
	this.map[0]=1
	this.map[1]=13
	this.map[2]=25
	this.map[3]=37
	this.map[4]=49
	this.map[5]=61
	this.map[6]=73
	this.map[7]=85
	this.map[8]=97
	this.map[9]=109
	this.map[10]=121
	this.map[11]=133
	this.map[12]=145
	this.map[13]=157
	this.map[14]=169
	this.map[15]=181
	this.map[16]=193
	this.map[17]=205
	this.map[18]=2
	this.map[19]=14
	this.map[20]=26
	this.map[21]=38
	this.map[22]=50
	this.map[23]=62
	this.map[24]=74
	this.map[25]=86
	this.map[26]=98
	this.map[27]=110
	this.map[28]=122
	this.map[29]=134
	this.map[30]=146
	this.map[31]=158
	this.map[32]=170
	this.map[33]=182
	this.map[34]=194
	this.map[35]=206
	this.map[36]=3
	this.map[37]=15
	this.map[38]=27
	this.map[39]=39
	this.map[40]=51
	this.map[41]=63
	this.map[42]=75
	this.map[43]=87
	this.map[44]=99
	this.map[45]=111
	this.map[46]=123
	this.map[47]=135
	this.map[48]=147
	this.map[49]=159
	this.map[50]=171
	this.map[51]=183
	this.map[52]=195
	this.map[53]=207
	this.map[54]=4
	this.map[55]=16
	this.map[56]=28
	this.map[57]=40
	this.map[58]=52
	this.map[59]=64
	this.map[60]=76
	this.map[61]=88
	this.map[62]=100
	this.map[63]=112
	this.map[64]=124
	this.map[65]=136
	this.map[66]=148
	this.map[67]=160
	this.map[68]=172
	this.map[69]=184
	this.map[70]=196
	this.map[71]=208
	this.map[72]=5
	this.map[73]=17
	this.map[74]=29
	this.map[75]=41
	this.map[76]=53
	this.map[77]=65
	this.map[78]=77
	this.map[79]=89
	this.map[80]=101
	this.map[81]=113
	this.map[82]=125
	this.map[83]=137
	this.map[84]=149
	this.map[85]=161
	this.map[86]=173
	this.map[87]=185
	this.map[88]=197
	this.map[89]=209
	this.map[90]=6
	this.map[91]=18
	this.map[92]=30
	this.map[93]=42
	this.map[94]=54
	this.map[95]=66
	this.map[96]=78
	this.map[97]=90
	this.map[98]=102
	this.map[99]=114
	this.map[100]=126
	this.map[101]=138
	this.map[102]=150
	this.map[103]=162
	this.map[104]=174
	this.map[105]=186
	this.map[106]=198
	this.map[107]=210
	this.map[108]=7
	this.map[109]=19
	this.map[110]=31
	this.map[111]=43
	this.map[112]=55
	this.map[113]=67
	this.map[114]=79
	this.map[115]=91
	this.map[116]=103
	this.map[117]=115
	this.map[118]=127
	this.map[119]=139
	this.map[120]=151
	this.map[121]=163
	this.map[122]=175
	this.map[123]=187
	this.map[124]=199
	this.map[125]=211
	this.map[126]=8
	this.map[127]=20
	this.map[128]=32
	this.map[129]=44
	this.map[130]=56
	this.map[131]=68
	this.map[132]=80
	this.map[133]=92
	this.map[134]=104
	this.map[135]=116
	this.map[136]=128
	this.map[137]=140
	this.map[138]=152
	this.map[139]=164
	this.map[140]=176
	this.map[141]=188
	this.map[142]=200
	this.map[143]=212
	this.map[144]=9
	this.map[145]=21
	this.map[146]=33
	this.map[147]=45
	this.map[148]=57
	this.map[149]=69
	this.map[150]=81
	this.map[151]=93
	this.map[152]=105
	this.map[153]=117
	this.map[154]=129
	this.map[155]=141
	this.map[156]=153
	this.map[157]=165
	this.map[158]=177
	this.map[159]=189
	this.map[160]=201
	this.map[161]=213
	this.map[162]=10
	this.map[163]=22
	this.map[164]=34
	this.map[165]=46
	this.map[166]=58
	this.map[167]=70
	this.map[168]=82
	this.map[169]=94
	this.map[170]=106
	this.map[171]=118
	this.map[172]=130
	this.map[173]=142
	this.map[174]=154
	this.map[175]=166
	this.map[176]=178
	this.map[177]=190
	this.map[178]=202
	this.map[179]=214
	this.map[180]=11
	this.map[181]=23
	this.map[182]=35
	this.map[183]=47
	this.map[184]=59
	this.map[185]=71
	this.map[186]=83
	this.map[187]=95
	this.map[188]=107
	this.map[189]=119
	this.map[190]=131
	this.map[191]=143
	this.map[192]=155
	this.map[193]=167
	this.map[194]=179
	this.map[195]=191
	this.map[196]=203
	this.map[197]=215
	this.map[198]=12
	this.map[199]=24
	this.map[200]=36
	this.map[201]=48
	this.map[202]=60
	this.map[203]=72
	this.map[204]=84
	this.map[205]=96
	this.map[206]=108
	this.map[207]=120
	this.map[208]=132
	this.map[209]=144
	this.map[210]=156
	this.map[211]=168
	this.map[212]=180
	this.map[213]=192
	this.map[214]=204
	this.map[215]=216

	this.map[216]=217
	this.map[217]=229
	this.map[218]=241
	this.map[219]=253
	this.map[220]=265
	this.map[221]=277
	this.map[222]=289
	this.map[223]=218
	this.map[224]=230
	this.map[225]=242
	this.map[226]=254
	this.map[227]=266
	this.map[228]=278
	this.map[229]=290
	this.map[230]=219
	this.map[231]=231
	this.map[232]=243
	this.map[233]=255
	this.map[234]=267
	this.map[235]=279
	this.map[236]=291
	this.map[237]=220
	this.map[238]=232
	this.map[239]=244
	this.map[240]=256
	this.map[241]=268
	this.map[242]=280
	this.map[243]=292
	this.map[244]=221
	this.map[245]=233
	this.map[246]=245
	this.map[247]=257
	this.map[248]=269
	this.map[249]=281
	this.map[250]=293
	this.map[251]=222
	this.map[252]=234
	this.map[253]=246
	this.map[254]=258
	this.map[255]=270
	this.map[256]=282
	this.map[257]=294
	this.map[258]=223
	this.map[259]=235
	this.map[260]=247
	this.map[261]=259
	this.map[262]=271
	this.map[263]=283
	this.map[264]=295
	this.map[265]=224
	this.map[266]=236
	this.map[267]=248
	this.map[268]=260
	this.map[269]=272
	this.map[270]=284
	this.map[271]=296
	this.map[272]=225
	this.map[273]=237
	this.map[274]=249
	this.map[275]=261
	this.map[276]=273
	this.map[277]=285
	this.map[278]=297
	this.map[279]=226
	this.map[280]=238
	this.map[281]=250
	this.map[282]=262
	this.map[283]=274
	this.map[284]=286
	this.map[285]=298
	this.map[286]=227
	this.map[287]=239
	this.map[288]=251
	this.map[289]=263
	this.map[290]=275
	this.map[291]=287
	this.map[292]=299
	this.map[293]=228
	this.map[294]=240
	this.map[295]=252
	this.map[296]=264
	this.map[297]=276
	this.map[298]=288
	this.map[299]=300





	return this;
}

//--------------------------------------------------------
module.exports = new leds();
