function keyboardView()
{
	//--------------------------------------------------------

	this.container = null;
	this.valEffacer = "effacer";
	this.valDefault = "RECHERCHER";
	this.nbCharsMax = 5;
	this.bUserKey = false;
	this.bDoShake = false;
	this.timeShake = false;
	this.position = null;

	this.cbCodeEntered = null;

	//--------------------------------------------------------
	this.keys =
	[
		["1","2","3","4","5","6","7","8","9","0"],
		["A","Z","E","R","T","Y","U","I","O","P"],
		["Q","S","D","F","G","H","J","K","L","M"],
		["W","X","C","V","B","N","#",this.valEffacer]
	];

	//--------------------------------------------------------
	this.reset = function()
	{
		$("#code").val( this.valDefault );
		this.bUserKey = false;
	}

	//--------------------------------------------------------
	this.shake = function()
	{
		this.bDoShake = true;
		this.timeShake = 0.0;
		this.position = $("#view-recherche").offset();
	}
	
	//--------------------------------------------------------
	this.init = function(containerId)
	{
	
		var pThis = this;
	
		this.container = $(containerId);
		var keysIndex = 0;
		this.keys.forEach( function(element)
		{
			var nbKeys = element.length;
			var ligne = "<div class=\"ligne\">";
			for (var i = 0; i<nbKeys; i++){
				ligne+="<div class=\"key\" id=\""+element[i]+"\"><div class=\"key-inner\">"+element[i]+"</div></div>"
			}
			ligne+="</div>";
			if (keysIndex < pThis.keys.length-1)
				ligne+="<div class=\"ligne-separator\"></div>";
			pThis.container.append(ligne);
		
			keysIndex++;
		});
		
		$("#code").focus( function()
		{
			if ( $(this).val() == pThis.valDefault)
				$(this).val("");
		});

		this.container.find(".key")
		.css("cursor", "pointer")
		.click(function()
		{
			if ( $("#code").val() == pThis.valDefault)
				$("#code").val("");
				
			pThis.bUserKey = true;
		
			var k = $(this).attr("id");
			var code = $("#code").val();
			if (k == pThis.valEffacer)
			{
				if (code.length > 0)
					$("#code").val( code.substring(0, code.length-1)  )
			}
			else
			{
				if(code.length < pThis.nbCharsMax)
					$("#code").val( code + k  )

				if ($("#code").val().length == pThis.nbCharsMax)
				{
					if (typeof pThis.cbCodeEntered === "function")
						pThis.cbCodeEntered( $("#code").val() );
				}
			}

			activity();
		
		});
		
		if (rqcv.configuration.pupitre.keyboard.transition)
		{
		   this.container.find(".key-inner")
		   .mouseover(function(){
			   $(this).addClass("mouse-down")
			   $(this).removeClass("mouse-up")
		   })
		   .mouseout(function(){
			   $(this).addClass("mouse-up")
			   $(this).removeClass("mouse-down")
		   })
		   .mousedown(function(){
			   $(this).addClass("mouse-down")
			   $(this).removeClass("mouse-up")
		   })
		   .mouseup(function(){
			   $(this).addClass("mouse-up")
			   $(this).removeClass("mouse-down")
		   })
		}
		
		
		
		this.reset();

	}
	
	//--------------------------------------------------------
	this.update = function(dt)
	{
		if (this.bDoShake)
		{
			this.timeShake += dt;
			if (this.timeShake >= 0.5){
				this.bDoShake = false;
			}
			var top = this.position.top + Math.random()*20;
			var left = this.position.left + Math.random()*20;
			
			$("#view-recherche").offset({top : top, left : left});
		}
	}
}


//--------------------------------------------------------
var keyboardView = new keyboardView();
