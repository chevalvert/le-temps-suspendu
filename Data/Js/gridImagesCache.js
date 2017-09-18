function gridImagesCache(id,x,y,w,h, sub)
{
	this.id = id;
	this.loader = new THREE.TextureLoader();

	this.geometry = new THREE.PlaneGeometry(w/sub,h/sub,1,1);
	this.materials = new Array(sub*sub);
	this.textures = new Array(sub*sub);
	this.meshes = new Array(sub*sub);
	
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.sub = sub;

	
	this.bLoading = false;
	this.bMarkUnloadTexture = false;
	this.bMarkLoadTexture = false;
	
	this.state_loading 				= {id : 0};
	this.state_loaded 				= {id : 1};
	this.state_prepare_unload 		= {id : 2, timeoutUnload : 2.0};
	this.state_unloaded 			= {id : 3};
	
	this.state 						= this.state_unloaded;
	this.stateTime					= 0;
	
	this.indexTextureToLoad			= 0;
	this.folderImages				= ""
	
	//--------------------------------------------------------
	this.setFolderImages = function(pathRel)
	{
		this.folderImages = pathRel;
	}

	//--------------------------------------------------------
	this.update = function(dt)
	{
		if (this.state === this.state_unloaded)
		{
			if (this.bMarkLoadTexture)
			{
				this.bMarkLoadTexture = false;
				this.state = this.state_loading;
			}
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
				for (var i=0 ; i<this.sub * this.sub ; i++)
				{
					
					// https://github.com/mrdoob/three.js/issues/1162
					// see last comment
					if (this.materials[i].map)
						this.materials[i].map.dispose();
					this.materials[i].map = null;
					this.materials[i].wireframe = true;
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
		
		for (var j=0;j<this.sub;j++)
		{
			for (var i=0;i<this.sub;i++)
			{
				offset = i+this.sub*j;
				this.materials[offset] = new THREE.MeshBasicMaterial({color:0xffffff, wireframe:true/*, map:this.texture*/});
				this.meshes[offset] = new THREE.Mesh( this.geometry, this.materials[offset] );
				this.meshes[offset].position.x = this.x + (i+0.5)*wsub;
				this.meshes[offset].position.y = this.y + (j+0.5)*hsub;
				
				scene.add( this.meshes[offset] );
			}
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
	this.getPathImage = function(index)
	{
		var i = index % this.sub;
		var j = sub-parseInt(index / this.sub)-1;
	
		return this.folderImages+this.getName()+"_"+i+"_"+j+".jpg";
	}
	
	
}
