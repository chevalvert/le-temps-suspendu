function keyboardView()
{
	//--------------------------------------------------------

	this.container = null;
	this.valEffacer = "effacer";
	this.valDefault = "RECHERCHER";
	this.nbCharsMax = 5;
	this.bUserKey = false;

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
				ligne+="<div class=\"key\" id=\""+element[i]+"\">"+element[i]+"</div>"
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
		
		
		this.reset();

	}
}


//--------------------------------------------------------
var keyboardView = new keyboardView();
