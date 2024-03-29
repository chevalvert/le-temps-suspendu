//--------------------------------------------------------
var radiusInfluence = 100;
var radiusHeight = 150;
var ledGreyOut = 100;
//var bTouchControl = false;

//--------------------------------------------------------
function LED(sketch,id,w,h)
{
   this.sketch = sketch;
   this.id = ""+id;
   this.x = 0;
   this.y = 0;
   this.w = w;
   this.h = h;
   this.value = 0.5;
   this.valueTarget = this.value;
   this.greyLevel = 255;

   this.setPosition = function(x,y)
   {
	   this.x = x - this.w/2;
	   this.y = y - this.h/2;
	   this.xCenter = x;
	   this.yCenter = y;
   }

   this.draw = function()
   {
		this.value += (this.valueTarget - this.value) * 0.05; // TODO : time-dependent

		this.greyLevel = this.value * (sketch.ledValueMax-sketch.ledValueMin) + sketch.ledValueMin;
	
		sketch.fill(this.greyLevel,this.greyLevel,this.greyLevel,255.0);
		sketch.rect(this.x,this.y,this.w,this.h);
   }

   this.drawDebug = function()
   {
		sketch.fill(255,0,0,255);
		sketch.text(""+this.id, this.x-sketch.textWidth(id)/2,this.y+this.h/2);
   }

}

//--------------------------------------------------------
function sketchInteragir( sketch )
{
  sketch.parentId = "view-p5";
  sketch.theCanvas = null;
  sketch.w = $("#"+sketch.parentId).width();
  sketch.h = $("#"+sketch.parentId).height();
 
  sketch.nbColumns = 18;
  sketch.nbRows = 12;
  sketch.wLed = 5;
  sketch.hLed = 37;
  sketch.gapLed = 19;
  sketch.xMin = 60 + sketch.wLed;
  sketch.bTouchControl = false;
  sketch.bDebug = false;
  sketch.bMouseMoveFirst = false;

  sketch.leds 		= [];
  // sketch.ledValues 	= []; // to be sent to artnet
  sketch.ledValueMin = 30;
  sketch.ledValueMax = 255;

  sketch.mousePositionNormalized = {x:0.0, y:0.0}
  sketch.mousePositionNormalizedPrev = {x:0.0, y:0.0}


  //--------------------------------------------------------
  sketch.setDebug = function(is)
  {
	sketch.bDebug = is;
  }

  //--------------------------------------------------------
  sketch.setTouchControl = function(is)
  {
	sketch.bTouchControl = is;
	
//	console.log( sketch.theCanvas );

	sketch.theCanvas.mouseMoved(is ? sketch.onMouseMoved : function(){});
	sketch.theCanvas.mouseOut(is ? sketch.onMouseOut : function(){});
	
  }
 
 
  //--------------------------------------------------------
  sketch.showLabel = function()
  {
	sketch.bMouseMoveFirst = false;
  	$("#view-interagir #view-label").show();
  }

  //--------------------------------------------------------
  sketch.createLeds = function()
  {
	  var xMax = sketch.width-sketch.xMin;
	  var dx = xMax - sketch.xMin;

	  var x = sketch.xMin;
	  for (var i=0;i<sketch.nbColumns;i++)
	  {
	  	  var a = Math.acos( sketch.map(i,0,sketch.nbColumns-1,-1,1) );
		  var y = sketch.height - sketch.hLed + 10 - radiusHeight * Math.sin (a);
		  var offset = 0;
		  for (var j=0;j<12;j++)
		  {
			offset = i+j*sketch.nbColumns;
	  		sketch.leds[offset] = new LED(sketch, offset, sketch.wLed, sketch.hLed);
			sketch.leds[offset].setPosition(x,y);

//			sketch.ledValues[offset] = 0;
			
			y -= (sketch.hLed + sketch.gapLed);
	  	 }
		 
		 x += dx/(sketch.nbColumns-1);
	  }
  }


  //--------------------------------------------------------
  sketch.setup = function()
  {
  
    sketch.theCanvas = sketch.createCanvas(sketch.w,sketch.h, "WEBGL");
	sketch.theCanvas.parent(sketch.parentId);

	if (rqcv.configuration.production == false)
	{
	  $(document).keydown(function(event)
	  {
		  var c = String.fromCharCode(event.which);
		  if (c == 'S')
		  {
			  changeState(state_stand_by)
		  }
	  });
	}

	sketch.createLeds();
  };

  //--------------------------------------------------------
  sketch.setLedValues = function(values)
  {
  	if (sketch.leds.length == 0) return;
  
  
	  var nb = sketch.nbColumns * sketch.nbRows;
	  for (var i=0;i<nb;i++)
		sketch.leds[i].valueTarget = values[i];
  }

  //--------------------------------------------------------
  sketch.setLedValueMin = function(v)
  {
	sketch.ledValueMin = 255.0*v;
  }

  //--------------------------------------------------------
  sketch.setLedValueMax = function(v)
  {
	sketch.ledValueMax = 255.0*v;
  }

  //--------------------------------------------------------
  sketch.setRadiusInfluenceFactor = function(f)
  {
	radiusInfluence = f * sketch.width;
  }
 
  //--------------------------------------------------------
  sketch.draw = function()
  {
    sketch.background(0,0,0);
	
	sketch.noStroke();
	sketch.fill(255);
	for (var i=0; i<sketch.leds.length; i++)
		sketch.leds[i].draw();

	sketch.mousePositionNormalizedPrev.x = sketch.mousePositionNormalized.x;
	sketch.mousePositionNormalizedPrev.y = sketch.mousePositionNormalized.y;
	
	if (sketch.bDebug)
	{
		for (var i=0; i<sketch.leds.length; i++)
			sketch.leds[i].drawDebug();


		if (sketch.bTouchControl)
		{
			sketch.stroke(255,0,0);
			sketch.noFill();
			sketch.ellipse(sketch.mouseX, sketch.mouseY, 2*this.radiusInfluence,2*this.radiusInfluence);
  		}
	}
	
  };
 
  //--------------------------------------------------------
  sketch.onMouseMoved = function()
  {
  	var d = 0;
	var led = null;

	// Hide label
	if (sketch.bMouseMoveFirst == false)
	{
		sketch.bMouseMoveFirst = true;
		$("#view-interagir #view-label").fadeOut("fast");
	
	}


	sketch.mousePositionNormalized.x = sketch.mouseX / sketch.width;
	sketch.mousePositionNormalized.y = sketch.mouseY / sketch.height;

	
	// State activity
	activity();
  }
 
  //--------------------------------------------------------
  sketch.onMouseOut = function()
  {
	for (var i=0; i<sketch.leds.length; i++)
	 sketch.leds[i].valueTarget = 0;
  }
};
