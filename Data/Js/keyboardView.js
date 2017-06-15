	//--------------------------------------------------------
function keyboardView()
{
	//--------------------------------------------------------

	this.container = null;
	this.valEffacer = "effacer";
	this.nbCharsMax = 5;

	//--------------------------------------------------------
	this.keys =
	[
		["1","2","3","4","5","6","7","8","9","0"],
		["A","Z","E","R","T","Y","U","I","O","P"],
		["Q","S","D","F","G","H","J","K","L","M"],
		["W","X","C","V","B","N","#",this.valEffacer]
	];
	
	//--------------------------------------------------------
	this.init = function(containerId)
	{
	
		var pThis = this;
	
		this.container = $(containerId);
		this.keys.forEach( function(element)
		{
			var nbKeys = element.length;
			var ligne = "<div class=\"ligne\">";
			for (var i = 0; i<nbKeys; i++){
				ligne+="<div class=\"key\" id=\""+element[i]+"\">"+element[i]+"</div>"
			}
			ligne+="</div>";
			pThis.container.append(ligne);
		});

		this.container.find(".key")
		.css("cursor", "pointer")
		.click(function()
		{
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
			}
		
		});


	}
}


//--------------------------------------------------------
var keyboardView = new keyboardView();
