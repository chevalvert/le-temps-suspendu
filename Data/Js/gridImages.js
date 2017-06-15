function gridImages(wImage, hImage)
{
	this.wImage = wImage;
	this.hImage = hImage;

	//--------------------------------------------------------
	this.loader = new THREE.ImageLoader();
	this.promiseArray = [];
	this.geometry = new THREE.PlaneGeometry( 768, 1024 ); // TEMP, pass dimensions as arguments
	this.texture = null;
	this.mesh = null;

	//--------------------------------------------------------
	this.loadFromDb = function(connection, query, callback)
	{
//		console.log(query);
	
		var pThis = this;
		var pathImages = [];
		connection.query(query, function (error, results, fields)
		{
			results.forEach(function(obj)
			{
				pathImages.push( "./Data/Db/files/figure-thumbs/" + obj.filename );
			});

			pThis.load( pathImages, callback);
			
		});
	}

	//--------------------------------------------------------
	this.load = function(pathImages, callback)
	{
		var pThis = this;
	
		pathImages.forEach( function(pathImage)
		{
			pThis.promiseArray.push(
			
			   new Promise( function(resolve, reject)
			   {
				   pThis.loader.load(pathImage,
				   
				   function(image)
				   {
					   resolve( image );
				   },
				   function ( xhr )
				   {
					   console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				   },
				   function ( xhr )
				   {
					   reject( new Error ( xhr + 'An error occurred loading while loading' /*+ fileOBJ.url*/ ) )
				   }
				   
				   );
			   })
			)
		});


		Promise.all( this.promiseArray ).then
		(
			function ( images )
			{
				var drawingCanvas = document.getElementById( 'drawing-canvas' );
				var drawingContext = drawingCanvas.getContext( '2d' );
		 
				// clear canvas
				drawingContext.fillStyle = "#000000";
				drawingContext.fillRect( 0, 0, drawingCanvas.width, drawingCanvas.height );

		 
				// fill canvas
				var x = 0;
				var y = 0;
				var w = pThis.wImage;
				var h = pThis.hImage;
				var nbImages = images.length;
//				console.log("------------------");

				images.forEach(function(img)
				{
					drawingContext.drawImage(img,x,y,w,h);
		 			x+=w;
					if (x >= drawingCanvas.width){
						x = 0;
						y += h;
					}
//					console.log(x+";"+y);
				});

				drawingContext.map =  new THREE.Texture( drawingCanvas );
				drawingContext.map.needsUpdate = true;
				drawingCanvas.style.display = "none";

			 	pThis.texture = drawingContext.map;
				pThis.material = new THREE.MeshBasicMaterial({map:pThis.texture});
				pThis.mesh = new THREE.Mesh( pThis.geometry, pThis.material );


				if (callback && typeof callback === "function")
					callback();

	      	},
			function ( error )
			{
				console.log(error);
			}
	   )

	}
}
