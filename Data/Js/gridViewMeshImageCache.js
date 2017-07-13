function gridViewMeshImageCache(scene, w,h,wThumb,hThumb)
{

	this.parent = new THREE.Object3D();
	this.material = new THREE.MeshBasicMaterial({color:0x000000 , transparent: true, wireframe:false, opacity : 0.0})
	this.meshes = new Array(4);
	this.opacityTarget = 0.0;


	w *= 2.0;
	h *= 2.0;


	var hRect = (h - hThumb)/2;
	var wRect = (w - wThumb)/2;


	this.meshes[0] = new THREE.Mesh
	(
		new THREE.PlaneGeometry(w,hRect,1,1),
		this.material
	);

	this.meshes[0].geometry.translate(0,0.5*(hThumb+hRect),0);

	this.meshes[1] = new THREE.Mesh
	(
		new THREE.PlaneGeometry(wRect,h-2*hRect,1,1),
		this.material
	);
	this.meshes[1].geometry.translate(0.5*(wThumb+wRect),0,0);


	this.meshes[2] = new THREE.Mesh
	(
		new THREE.PlaneGeometry(w,hRect,1,1),
		this.material
	);
	this.meshes[2].geometry.translate(0,-0.5*(hThumb+hRect),0);

	this.meshes[3] = new THREE.Mesh
	(
		new THREE.PlaneGeometry(wRect,h-2*hRect,1,1),
		this.material
	);
	this.meshes[3].geometry.translate(-0.5*(wThumb+wRect),0,0);
	
	
	this.parent.add ( this.meshes[0] );
	this.parent.add ( this.meshes[1] );
	this.parent.add ( this.meshes[2] );
	this.parent.add ( this.meshes[3] );

	
	scene.add( this.parent );
	
	//--------------------------------------------------------
	this.setOpacity = function(opacity)
	{
		this.opacityTarget = opacity;
	}

	//--------------------------------------------------------
	this.update = function(dt)
	{
		this.material.opacity += ( this.opacityTarget - this.material.opacity) * 0.3;
	}

	//--------------------------------------------------------
	this.setPosition = function(x,y)
	{
		this.parent.position.set(x,y,1);
	}
}

// gridViewMeshImageCache.prototype = Object.create(THREE.Object3D.prototype);


