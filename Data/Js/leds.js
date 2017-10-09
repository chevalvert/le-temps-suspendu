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
	this.values 				= new Array(512); 	// between 0.0 and 255.0
	this.valueAppliedMin 		= 0.0;				// éclairage minimum ceil
	this.valueAppliedMax 		= 255.0;			// éclairage maximum ceil
	
	this.valueAppliedMinFloor 	= 0.0;				// éclairage minimum floor
	this.valueAppliedMaxFloor 	= 255.0;			// éclairage maximum floor

	this.valuesNbCeil			= 18*12;
	this.syncAnimRAF 			= configuration.artnet.syncAnimRAF;

	//--------------------------------------------------------
	this.apply = function()
	{
		this.artnet.set(this.values);
	}

	//--------------------------------------------------------
	this.mapValue = function(v,min,max)
	{
		// OK
		if (min >= max)
			return v;
		return v * (max - min) + min;
	}

	//--------------------------------------------------------
	// v is normalized
	this.setValueAppliedMin 		= function(v){ this.valueAppliedMin = 255.0*v; }
	this.setValueAppliedMax 		= function(v){ this.valueAppliedMax = 255.0*v; }
	this.setValueAppliedMinFloor 	= function(v){ this.valueAppliedMinFloor = 255.0*v; }
	this.setValueAppliedMaxFloor 	= function(v){ this.valueAppliedMaxFloor = 255.0*v; }

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
		for(var i=0; i<valuesCeil.length;i++)
			this.values[ this.map[i] ] = this.mapValue( 255 * valuesCeil[i], this.valueAppliedMin, this.valueAppliedMax);
		if (!this.syncAnimRAF)
		{
			this.apply();
		}
	}

	//--------------------------------------------------------
	this.updateFloor = function(valuesFloor)
	{
		var offset = this.valuesNbCeil;
		for(var i=0; i<valuesFloor.length;i++)
			this.values[ this.map[offset+i] ] = this.mapValue( 255 * valuesFloor[i], this.valueAppliedMinFloor, this.valueAppliedMaxFloor ) ;

		if (!this.syncAnimRAF)
		{
			this.apply();
		}
	}

	//--------------------------------------------------------
	this.update = function()
	{
		if (this.syncAnimRAF)
		{
			this.apply();
		}
	}
	

	
	//--------------------------------------------------------
	this.close = function()
	{
		this.artnet.close();
	}

	// Generated with Tools / sketch_map_dmx.pde
	this.map = new Array(300);
	this.map[0]=12
	this.map[1]=24
	this.map[2]=36
	this.map[3]=48
	this.map[4]=60
	this.map[5]=72
	this.map[6]=84
	this.map[7]=96
	this.map[8]=108
	this.map[9]=120
	this.map[10]=132
	this.map[11]=144
	this.map[12]=156
	this.map[13]=168
	this.map[14]=180
	this.map[15]=192
	this.map[16]=204
	this.map[17]=216
	this.map[18]=1
	this.map[19]=13
	this.map[20]=25
	this.map[21]=37
	this.map[22]=49
	this.map[23]=61
	this.map[24]=73
	this.map[25]=85
	this.map[26]=97
	this.map[27]=109
	this.map[28]=121
	this.map[29]=133
	this.map[30]=145
	this.map[31]=157
	this.map[32]=169
	this.map[33]=181
	this.map[34]=193
	this.map[35]=205
	this.map[36]=2
	this.map[37]=14
	this.map[38]=26
	this.map[39]=38
	this.map[40]=50
	this.map[41]=62
	this.map[42]=74
	this.map[43]=86
	this.map[44]=98
	this.map[45]=110
	this.map[46]=122
	this.map[47]=134
	this.map[48]=146
	this.map[49]=158
	this.map[50]=170
	this.map[51]=182
	this.map[52]=194
	this.map[53]=206
	this.map[54]=3
	this.map[55]=15
	this.map[56]=27
	this.map[57]=39
	this.map[58]=51
	this.map[59]=63
	this.map[60]=75
	this.map[61]=87
	this.map[62]=99
	this.map[63]=111
	this.map[64]=123
	this.map[65]=135
	this.map[66]=147
	this.map[67]=159
	this.map[68]=171
	this.map[69]=183
	this.map[70]=195
	this.map[71]=207
	this.map[72]=4
	this.map[73]=16
	this.map[74]=28
	this.map[75]=40
	this.map[76]=52
	this.map[77]=64
	this.map[78]=76
	this.map[79]=88
	this.map[80]=100
	this.map[81]=112
	this.map[82]=124
	this.map[83]=136
	this.map[84]=148
	this.map[85]=160
	this.map[86]=172
	this.map[87]=184
	this.map[88]=196
	this.map[89]=208
	this.map[90]=5
	this.map[91]=17
	this.map[92]=29
	this.map[93]=41
	this.map[94]=53
	this.map[95]=65
	this.map[96]=77
	this.map[97]=89
	this.map[98]=101
	this.map[99]=113
	this.map[100]=125
	this.map[101]=137
	this.map[102]=149
	this.map[103]=161
	this.map[104]=173
	this.map[105]=185
	this.map[106]=197
	this.map[107]=209
	this.map[108]=6
	this.map[109]=18
	this.map[110]=30
	this.map[111]=42
	this.map[112]=54
	this.map[113]=66
	this.map[114]=78
	this.map[115]=90
	this.map[116]=102
	this.map[117]=114
	this.map[118]=126
	this.map[119]=138
	this.map[120]=150
	this.map[121]=162
	this.map[122]=174
	this.map[123]=186
	this.map[124]=198
	this.map[125]=210
	this.map[126]=7
	this.map[127]=19
	this.map[128]=31
	this.map[129]=43
	this.map[130]=55
	this.map[131]=67
	this.map[132]=79
	this.map[133]=91
	this.map[134]=103
	this.map[135]=115
	this.map[136]=127
	this.map[137]=139
	this.map[138]=151
	this.map[139]=163
	this.map[140]=175
	this.map[141]=187
	this.map[142]=199
	this.map[143]=211
	this.map[144]=8
	this.map[145]=20
	this.map[146]=32
	this.map[147]=44
	this.map[148]=56
	this.map[149]=68
	this.map[150]=80
	this.map[151]=92
	this.map[152]=104
	this.map[153]=116
	this.map[154]=128
	this.map[155]=140
	this.map[156]=152
	this.map[157]=164
	this.map[158]=176
	this.map[159]=188
	this.map[160]=200
	this.map[161]=212
	this.map[162]=9
	this.map[163]=21
	this.map[164]=33
	this.map[165]=45
	this.map[166]=57
	this.map[167]=69
	this.map[168]=81
	this.map[169]=93
	this.map[170]=105
	this.map[171]=117
	this.map[172]=129
	this.map[173]=141
	this.map[174]=153
	this.map[175]=165
	this.map[176]=177
	this.map[177]=189
	this.map[178]=201
	this.map[179]=213
	this.map[180]=10
	this.map[181]=22
	this.map[182]=34
	this.map[183]=46
	this.map[184]=58
	this.map[185]=70
	this.map[186]=82
	this.map[187]=94
	this.map[188]=106
	this.map[189]=118
	this.map[190]=130
	this.map[191]=142
	this.map[192]=154
	this.map[193]=166
	this.map[194]=178
	this.map[195]=190
	this.map[196]=202
	this.map[197]=214
	this.map[198]=11
	this.map[199]=23
	this.map[200]=35
	this.map[201]=47
	this.map[202]=59
	this.map[203]=71
	this.map[204]=83
	this.map[205]=95
	this.map[206]=107
	this.map[207]=119
	this.map[208]=131
	this.map[209]=143
	this.map[210]=155
	this.map[211]=167
	this.map[212]=179
	this.map[213]=191
	this.map[214]=203
	this.map[215]=215

	this.map[216]=228
	this.map[217]=240
	this.map[218]=252
	this.map[219]=264
	this.map[220]=276
	this.map[221]=288
	this.map[222]=300
	this.map[223]=217
	this.map[224]=229
	this.map[225]=241
	this.map[226]=253
	this.map[227]=265
	this.map[228]=277
	this.map[229]=289
	this.map[230]=218
	this.map[231]=230
	this.map[232]=242
	this.map[233]=254
	this.map[234]=266
	this.map[235]=278
	this.map[236]=290
	this.map[237]=219
	this.map[238]=231
	this.map[239]=243
	this.map[240]=255
	this.map[241]=267
	this.map[242]=279
	this.map[243]=291
	this.map[244]=220
	this.map[245]=232
	this.map[246]=244
	this.map[247]=256
	this.map[248]=268
	this.map[249]=280
	this.map[250]=292
	this.map[251]=221
	this.map[252]=233
	this.map[253]=245
	this.map[254]=257
	this.map[255]=269
	this.map[256]=281
	this.map[257]=293
	this.map[258]=222
	this.map[259]=234
	this.map[260]=246
	this.map[261]=258
	this.map[262]=270
	this.map[263]=282
	this.map[264]=294
	this.map[265]=223
	this.map[266]=235
	this.map[267]=247
	this.map[268]=259
	this.map[269]=271
	this.map[270]=283
	this.map[271]=295
	this.map[272]=224
	this.map[273]=236
	this.map[274]=248
	this.map[275]=260
	this.map[276]=272
	this.map[277]=284
	this.map[278]=296
	this.map[279]=225
	this.map[280]=237
	this.map[281]=249
	this.map[282]=261
	this.map[283]=273
	this.map[284]=285
	this.map[285]=297
	this.map[286]=226
	this.map[287]=238
	this.map[288]=250
	this.map[289]=262
	this.map[290]=274
	this.map[291]=286
	this.map[292]=298
	this.map[293]=227
	this.map[294]=239
	this.map[295]=251
	this.map[296]=263
	this.map[297]=275
	this.map[298]=287
	this.map[299]=299

	return this;
}

//--------------------------------------------------------
module.exports = new leds();
