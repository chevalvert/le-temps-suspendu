function tool3D()
{
	this.id = "tool3D";

	this.camera = null;
	this.scene = null;
	this.objPoudriere = null;

	this.container = null;
	this.renderer = null;

	this.mouseX = 0;
	this.mouseY = 0;

  	this.objModelNames = ["Data/3D/poudriere-structure.obj", "Data/3D/poudriere-leds.obj"];

	this.objLeds = [];

	this.m_timer = new timer();
	this.timeSwitchLeds = 0;
	this.indexSwitchLeds = 0;

	this.init = function(containerId)
	{
		this.container = $(containerId);

		this.camera = new THREE.PerspectiveCamera( 45, this.container.width()/ this.container.height(), 1, 2000 );
		this.camera.position.z = 10;


		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color( 0x222222 );
		this.scene.add( new THREE.AxisHelper( 5 ) );


		var manager = new THREE.LoadingManager();
		manager.onProgress = function ( item, loaded, total )
		{
			console.log( item, loaded, total );
		};

		var onProgress = function ( xhr )
		{
			if ( xhr.lengthComputable )
			{
				var percentComplete = xhr.loaded / xhr.total * 100;
				console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
		};

		var onError = function ( xhr )
		{
		};

		var loader = new THREE.OBJLoader( manager );

      loader.load( this.objModelNames[1], this.onLedsLoaded.bind(this), this.onProgress, this.onError);
      loader.load( this.objModelNames[0], this.onArchitectureLoaded.bind(this), this.onProgress, this.onError);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( this.container.width(), this.container.height() );

		this.container.append( this.renderer.domElement );


		this.container.mousemove(function(event){
			tool3D.mouseX = event.pageX;
			tool3D.mouseY = event.pageY;


		});
		
		this.container.click(function(event){
			
			tool3D.incSwitchLeds();

		});

	}

	this.resize = function()
	{
		if (this.container)
		{
			this.camera.aspect = this.container.width() / this.container.height();
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( this.container.width(), this.container.height() );
		}
	}

	this.animate = function()
	{
		this.m_timer.update();
		this.render();
/*
		this.timeSwitchLeds += this.m_timer.dt;
		if (this.timeSwitchLeds > 0.05)
		{
			this.timeSwitchLeds = 0;
			this.indexSwitchLeds = (this.indexSwitchLeds+1)%this.objLeds.length;
			this.objLeds[this.indexSwitchLeds].material.color.set(0xFF0000);
		
		}
*/
			$("#debug").html( this.indexSwitchLeds-1 );
 

		window.requestAnimationFrame( this.animate.bind(this) );
	}
	
	this.incSwitchLeds = function()
	{
		this.objLeds[this.indexSwitchLeds].material.color.set(0xFF0000);
		this.indexSwitchLeds = (this.indexSwitchLeds+1)%this.objLeds.length;
	}

	this.render = function()
	{
	    this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 10;

		this.camera.position.x = -0.5*(this.mouseY-this.container.height())*0.1;
		this.camera.position.z = 1.0;

		this.camera.lookAt( new THREE.Vector3(0,0,0.0) );
		this.renderer.render( this.scene, this.camera );
	}

	this.onLedsLoaded = function( object )
	{
		var pThis = this;
		var index = 0;

		object.traverse(function(obj)
		{
			var id = parseInt( obj.name.split("_")[1] );
			if (id <= 2 || id>=507)
			{
				var grey = Math.random();
				obj.material = new THREE.MeshBasicMaterial({color: new THREE.Color(grey,grey,grey)});
				obj.rotation.x = THREE.Math.degToRad( -90 ) ;

				pThis.objLeds[index++] = obj ;
			}
		});
		
		for (var i=0; i<this.objLeds.length; i++)
			this.scene.add( this.objLeds[i] );


		this.animate();
	}
	
	this.onArchitectureLoaded = function( object )
	{
		object.rotation.x = THREE.Math.degToRad( -90 );
		//this.scene.add( object );

		var geo = new THREE.WireframeGeometry( object.geometry ); // or WireframeGeometry
//  		var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    	var wireframe = new THREE.LineSegments( geo );

wireframe.material.depthTest = false;
wireframe.material.opacity = 0.25;
wireframe.material.transparent = true;
		this.scene.add(wireframe);


	}


	this.ledToObj =
[
	 0 /*0*/,
	 1 /*1*/,
	 2 /*2*/,
	 3 /*3*/,
	 4 /*4*/,
	 5 /*5*/,
	 6 /*6*/,
	 7 /*7*/,
	 8 /*8*/,
	 9 /*9*/,
	 10 /*10*/,
	 11 /*11*/,
	 12 /*12*/,
	 13 /*13*/,
	 14 /*14*/,
	 15 /*15*/,
	 16 /*16*/,
	 17 /*17*/,

	 0 /*18*/,
	 1 /*19*/,
	 2 /*20*/,
	 3 /*21*/,
	 4 /*22*/,
	 5 /*23*/,
	 6 /*24*/,
	 7 /*25*/,
	 8 /*26*/,
	 9 /*27*/,
	 10 /*28*/,
	 11 /*29*/,
	 12 /*30*/,
	 13 /*31*/,
	 14 /*32*/,
	 15 /*33*/,
	 16 /*34*/,
	 17 /*35*/,

	 0 /*36*/,
	 1 /*37*/,
	 2 /*38*/,
	 3 /*39*/,
	 4 /*40*/,
	 5 /*41*/,
	 6 /*42*/,
	 7 /*43*/,
	 8 /*44*/,
	 9 /*45*/,
	 10 /*46*/,
	 11 /*47*/,
	 12 /*48*/,
	 13 /*49*/,
	 14 /*50*/,
	 15 /*51*/,
	 16 /*52*/,
	 17 /*53*/,

	 0 /*54*/,
	 1 /*55*/,
	 2 /*56*/,
	 3 /*57*/,
	 4 /*58*/,
	 5 /*59*/,
	 6 /*60*/,
	 7 /*61*/,
	 8 /*62*/,
	 9 /*63*/,
	 10 /*64*/,
	 11 /*65*/,
	 12 /*66*/,
	 13 /*67*/,
	 14 /*68*/,
	 15 /*69*/,
	 16 /*70*/,
	 17 /*71*/,

	 0 /*72*/,
	 1 /*73*/,
	 2 /*74*/,
	 3 /*75*/,
	 4 /*76*/,
	 5 /*77*/,
	 6 /*78*/,
	 7 /*79*/,
	 8 /*80*/,
	 9 /*81*/,
	 10 /*82*/,
	 11 /*83*/,
	 12 /*84*/,
	 13 /*85*/,
	 14 /*86*/,
	 15 /*87*/,
	 16 /*88*/,
	 17 /*89*/,

	 0 /*90*/,
	 1 /*91*/,
	 2 /*92*/,
	 3 /*93*/,
	 4 /*94*/,
	 5 /*95*/,
	 6 /*96*/,
	 7 /*97*/,
	 8 /*98*/,
	 9 /*99*/,
	 10 /*100*/,
	 11 /*101*/,
	 12 /*102*/,
	 13 /*103*/,
	 14 /*104*/,
	 15 /*105*/,
	 16 /*106*/,
	 17 /*107*/,

	 0 /*108*/,
	 1 /*109*/,
	 2 /*110*/,
	 3 /*111*/,
	 4 /*112*/,
	 5 /*113*/,
	 6 /*114*/,
	 7 /*115*/,
	 8 /*116*/,
	 9 /*117*/,
	 10 /*118*/,
	 11 /*119*/,
	 12 /*120*/,
	 13 /*121*/,
	 14 /*122*/,
	 15 /*123*/,
	 16 /*124*/,
	 17 /*125*/,

	 0 /*126*/,
	 1 /*127*/,
	 2 /*128*/,
	 3 /*129*/,
	 4 /*130*/,
	 5 /*131*/,
	 6 /*132*/,
	 7 /*133*/,
	 8 /*134*/,
	 9 /*135*/,
	 10 /*136*/,
	 11 /*137*/,
	 12 /*138*/,
	 13 /*139*/,
	 14 /*140*/,
	 15 /*141*/,
	 16 /*142*/,
	 17 /*143*/,

	 0 /*144*/,
	 1 /*145*/,
	 2 /*146*/,
	 3 /*147*/,
	 4 /*148*/,
	 5 /*149*/,
	 6 /*150*/,
	 7 /*151*/,
	 8 /*152*/,
	 9 /*153*/,
	 10 /*154*/,
	 11 /*155*/,
	 12 /*156*/,
	 13 /*157*/,
	 14 /*158*/,
	 15 /*159*/,
	 16 /*160*/,
	 17 /*161*/,

	 0 /*162*/,
	 1 /*163*/,
	 2 /*164*/,
	 3 /*165*/,
	 4 /*166*/,
	 5 /*167*/,
	 6 /*168*/,
	 7 /*169*/,
	 8 /*170*/,
	 9 /*171*/,
	 10 /*172*/,
	 11 /*173*/,
	 12 /*174*/,
	 13 /*175*/,
	 14 /*176*/,
	 15 /*177*/,
	 16 /*178*/,
	 17 /*179*/,

	 0 /*180*/,
	 1 /*181*/,
	 2 /*182*/,
	 3 /*183*/,
	 4 /*184*/,
	 5 /*185*/,
	 6 /*186*/,
	 7 /*187*/,
	 8 /*188*/,
	 9 /*189*/,
	 10 /*190*/,
	 11 /*191*/,
	 12 /*192*/,
	 13 /*193*/,
	 14 /*194*/,
	 15 /*195*/,
	 16 /*196*/,
	 17 /*197*/,

	 0 /*198*/,
	 1 /*199*/,
	 2 /*200*/,
	 3 /*201*/,
	 4 /*202*/,
	 5 /*203*/,
	 6 /*204*/,
	 7 /*205*/,
	 8 /*206*/,
	 9 /*207*/,
	 10 /*208*/,
	 11 /*209*/,
	 12 /*210*/,
	 13 /*211*/,
	 14 /*212*/,
	 15 /*213*/,
	 16 /*214*/,
	 17 /*215*/,

]







}

tool3D.prototype = Object.create(tool.prototype);
var tool3D 	= new tool3D();


/*

		//console.log(typeof object);
	    // wireframe - new way
		//var geo = new THREE.EdgesGeometry( object.geometry ); // or WireframeGeometry
  		//var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    	//var wireframe = new THREE.LineSegments( geo, mat );
		//object.add(wireframe);

//		tool3D.scene.add( object );
//		tool3D.objPoudriere = object;



*/
