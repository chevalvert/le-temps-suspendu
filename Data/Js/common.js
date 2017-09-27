// --------------------------------------------
Math.dist=function(x1,y1,x2,y2)
{
  if(!x2) x2=0; 
  if(!y2) y2=0;

  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

// --------------------------------------------
Utils = {};
Utils.extractAnimParams = function(k, params)
{
	// Params
	var id = "";
	var data = null;

	if (typeof params === "object")
	{
		id = params.id;
		data = params.data;
	}
	else
	if (typeof params === "string")
	{
		id = params;
	}

	if (k == "id") 		return id;
	if (k == "data") 	return data;

	return null;
}

// --------------------------------------------
// Utils.drawEllipse
