function gridImagesCache(id,x,y,w,h, sub, useLowRes)
{
	this.id = id;
	this.loader = new THREE.TextureLoader();

	this.geometry = new THREE.PlaneGeometry(w/sub,h/sub,1,1);
	this.materials = new Array(sub*sub);
	this.textures = new Array(sub*sub);
	this.meshes = new Array(sub*sub);

	// Low res stuff
	this.geometryLowRes = null;
	this.textureLowRes = null;
	this.materialLowRes = null;
	this.meshLowRes = null;

	
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.sub = sub;
	this.useLowRes = useLowRes;
	
	this.bLoading = false;
	this.bMarkUnloadTexture = false;
	this.bMarkLoadTexture = false;
	
	this.state_loading 				= {id : 0};
	this.state_loaded 				= {id : 1};
	this.state_prepare_unload 		= {id : 2, timeoutUnload : 2.0};
	this.state_unloaded 			= {id : 3};
	this.state_loading_lowRes 		= {id : 4};
	
	this.state 						= this.state_unloaded;
	this.stateTime					= 0;
	
	this.indexTextureToLoad			= 0;
	this.folderImages				= "";
	this.folderImagesLowRes			= "";
	
	//--------------------------------------------------------
	this.setFolderImages = function(pathRel, pathRelLowRes)
	{
		this.folderImages = pathRel;
		this.folderImagesLowRes = pathRelLowRes;
	}

	//--------------------------------------------------------
	this.update = function(dt)
	{

		if (this.state === this.state_loading_lowRes)
		{
		}
		
		else if (this.state === this.state_unloaded)
		{
			if (this.bMarkLoadTexture)
			{
				this.bMarkLoadTexture = false;
				this.state = this.state_loading;
			}
			if (this.meshLowRes)
				this.meshLowRes.visible = true;
		}
		else if (this.state === this.state_loading)
		{
			if (this.indexTextureToLoad == this.sub * this.sub)
			{
				this.state = this.state_loaded;
			}
			else if (this.bLoading == false)
			{
				this.bLoading = true;
			
				var pThis = this;
				var pathImage = this.getPathImage(this.indexTextureToLoad);

//				if (this.id == 0)
//					console.log(">>> loading ["+this.indexTextureToLoad+"] "+pathImage);

				this.loader.load
				(
						pathImage,
						function(texture)
						{
							var material  = pThis.materials[pThis.indexTextureToLoad];
							material.map = texture;
							material.wireframe = false;
							material.transparent = false;
							material.needsUpdate = true;

							if (pThis.indexTextureToLoad < pThis.sub * pThis.sub)
							{
								pThis.indexTextureToLoad++;
				 				pThis.bLoading = false;
							}
							else
							{
								pThis.state = pThis.state_loaded;
							}
						}
				 );
			}
		
		
		}
		
		else if (this.state === this.state_loaded)
		{
			this.meshLowRes.visible = false;

			if (this.bMarkUnloadTexture)
			{
				this.state = this.state_prepare_unload;
				this.stateTime = 0;
			}
		}

		else if (this.state === this.state_prepare_unload)
		{
			this.stateTime += dt;
			if (this.stateTime >= this.state.timeoutUnload)
			{
				this.meshLowRes.visible = true;
			
				for (var i=0 ; i<this.sub * this.sub ; i++)
				{
					
					// https://github.com/mrdoob/three.js/issues/1162
					// see last comment
					if (this.materials[i].map)
						this.materials[i].map.dispose();
					this.materials[i].map = null;
					this.materials[i].wireframe = false;
					this.materials[i].needsUpdate = true;
					
					
				}
				
			 	this.indexTextureToLoad = 0;
				this.bLoading = false;
			 
			 	this.state = this.state_unloaded;
			}
			else
			{
				if (this.bMarkLoadTexture)
				{
				 	this.state = this.state_unloaded;
					this.bLoading = false;
				}
			}
		}

	}

	//--------------------------------------------------------
	this.markUnloadTexture = function()
	{
		this.bMarkUnloadTexture = true;
		this.bMarkLoadTexture = false;
	}

	
	//--------------------------------------------------------
	this.markLoadTexture = function()
	{
		this.bMarkLoadTexture = true;
		this.bMarkUnloadTexture = false;
	}
	
	//--------------------------------------------------------
	this.create = function(scene)
	{
		var offset = 0;
		var wsub = this.w / this.sub;
		var hsub = this.h / this.sub;
		
		
		if (this.useLowRes)
		{
			this.geometryLowRes = new THREE.PlaneGeometry(this.w,this.h,1,1);
			this.materialLowRes = new THREE.MeshBasicMaterial({color:0x000000, wireframe : false, map:null});
			this.meshLowRes = new THREE.Mesh(this.geometryLowRes, this.materialLowRes);
			this.meshLowRes.position.x = this.x + 0.5*this.w;
			this.meshLowRes.position.y = this.y + 0.5*this.h;

			scene.add( this.meshLowRes );
		}
		
		for (var j=0;j<this.sub;j++)
		{
			for (var i=0;i<this.sub;i++)
			{
				offset = i+this.sub*j;
				this.materials[offset] = new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true/*, map:this.texture*/});
				if (this.useLowRes)
				{
					this.materials[offset].wireframe = false;
					this.materials[offset].transparent= true;
					this.materials[offset].opacity = 0.0;
				
				}
				this.meshes[offset] = new THREE.Mesh( this.geometry, this.materials[offset] );
				this.meshes[offset].position.x = this.x + (i+0.5)*wsub;
				this.meshes[offset].position.y = this.y + (j+0.5)*hsub;
				
				scene.add( this.meshes[offset] );
			}
		}
		
		if (this.useLowRes)
		{
			this.state = this.state_loading_lowRes; // to be sure low res mesh is added before any sub meshes for drawing
		
			 var pThis = this;
			 var pathImageLowRes = this.getPathImageLowRes(this.id);

			var loaderTextureLowRes = new THREE.TextureLoader();
			 loaderTextureLowRes.load
			 (
					 pathImageLowRes,
					 function(texture)
					 {
						pThis.materialLowRes.map = texture;
						pThis.materialLowRes.color = new THREE.Color(0xffffff);
						pThis.materialLowRes.needsUpdate = true;
			  
			  			pThis.state = pThis.state_unloaded;
					 },
			  		 // Progress
					 function(xhr){},
					 // Error
					 function(xhr)
					 {
			  			pThis.state = pThis.state_unloaded;
					 }
			  );
		 


		}
	}
	
	//--------------------------------------------------------
	this.unloadTexture = function()
	{
/*		this.material.map = null;
		this.material.wireframe = true;
		this.material.needsUpdate = true;
		this.bLoading = false;
*/
	}

	//--------------------------------------------------------
	this.getName = function()
	{
		if (this.id < 10) return "00"+this.id;
		if (this.id < 100) return "0"+this.id;
		return this.id;
	}

	//--------------------------------------------------------
	this.getPathImageLowRes = function(index)
	{
		return this.folderImagesLowRes+this.getName()+".jpg";
	}

	//--------------------------------------------------------
	this.getPathImage = function(index)
	{
		var i = index % this.sub;
		var j = sub-parseInt(index / this.sub)-1;
	
		return this.folderImages+this.getName()+"_"+i+"_"+j+".jpg";
	}
	
	
}
