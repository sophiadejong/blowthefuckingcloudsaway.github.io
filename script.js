function gotStream(stream) {
    // Create an AudioNode from the stream.
    mediaStreamSource = audioContext.createMediaStreamSource(stream);

    // Create a new volume meter and connect it.
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);

    // kick off the visual updating
    //update();
}
/*

function update() {
   
	var outxt = "MIC volume is " + (meter.volume * 100);

	if (meter.checkClipping()) {
		outxt += "\nLOUD";
	}
	else {
		outxt += "\nNORMAL";		
	}
	
	output(outxt);
	
    // set up the next visual callback
    rafID = window.requestAnimationFrame( update );    
}

function output( txt ) {

	$( ".output" ).text( txt );		

}
*/



	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container;
	var camera, scene, renderer;
	var mesh, geometry, material;

	var mouseX = 0, mouseY = 0;
	var start_time = Date.now();

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	init();

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		// Bg gradient

		var canvas = document.createElement( 'canvas' );
		canvas.width = 32;
		canvas.height = window.innerHeight;

		var context = canvas.getContext( '2d' );

		var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
		gradient.addColorStop(0, "#000000");
		gradient.addColorStop(0.5, "#474747");

		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);

		container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
		container.style.backgroundSize = '32px 100%';

		//

		camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
		camera.position.z = 6000;

		scene = new THREE.Scene();

		geometry = new THREE.Geometry();

		var texture = THREE.ImageUtils.loadTexture( 'cloud10.png', null, animate );
		texture.magFilter = THREE.LinearMipMapLinearFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;

		var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

		material = new THREE.ShaderMaterial( {

			uniforms: {

				"map": { type: "t", value: texture },
				"fogColor" : { type: "c", value: fog.color },
				"fogNear" : { type: "f", value: fog.near },
				"fogFar" : { type: "f", value: fog.far },

			},
			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			depthWrite: false,
			depthTest: false,
			transparent: true

		} );

		var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

		for ( var i = 0; i < 8000; i++ ) {

			plane.position.x = Math.random() * 1000 - 500;
			plane.position.y = - Math.random() * Math.random() * 200 - 15;
			plane.position.z = i;
			plane.rotation.z = Math.random() * Math.PI;
			plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

			THREE.GeometryUtils.merge( geometry, plane );

		}

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		mesh = new THREE.Mesh( geometry, material );
		mesh.position.z = - 8000;
		scene.add( mesh );

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) * 0.25;
		mouseY = ( event.clientY - windowHalfY ) * 0.15;

	}

	function onWindowResize( event ) {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	var basespeed = 800;

	var v = basespeed;

	function animate() {

		requestAnimationFrame( animate );

		position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;

		camera.position.x += ( mouseX - camera.position.x ) * 0.01;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
			
		var volume;	
		if (meter) {
			volume = meter.volume * 100000;
			if (volume > v) {
				v = volume;
			}
			else {
				v -= 10;
				
				if (v < basespeed) {
					v = basespeed;
				}
			}
		}
		
		console.log(v)
		
		camera.position.z =  position - v;
		
		renderer.render( scene, camera );

	}