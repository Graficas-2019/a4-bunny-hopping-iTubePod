/*
    Héctor Mauricio González Coello
    A01328258
*/

var renderer = null, 
scene = null, 
camera = null,
directionalLight = null,
root = null,
group = null,
cube = null,
bunnyGroup = null;
var animator = null,
objLoader = null,
duration = 5, // sec
loopAnimation = true;

var currentTime = Date.now();

function loadModel()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        'Stanford_Bunny_OBJ-JPG/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',

        function(object)
        {
            var texture = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg');
            var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');       
            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            } );
                    
            bunny = object;
            bunny.scale.set(10,10,10);
            bunny.position.z = 0;
            bunny.position.x = 0;
            bunny.position.y = -1.4;
            bunny.rotation.y = 0 ;
            
            bunnyGroup.add(bunny);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}

function run() 
{
    requestAnimationFrame(function() { run(); });

    // Render the scene
    renderer.render( scene, camera );

    // Update the animations
    KF.update();

    // Update the camera controller
    orbitControls.update();
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "images/grass.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;


function createScene(canvas) 
{

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 10, 50);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(.5, 0, 3);
    root.add(directionalLight);

    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);

    // Create a group to hold the objects
    group = new THREE.Object3D;
    bunnyGroup = new THREE.Object3D;
    root.add(group);
    root.add(bunnyGroup);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(20, 20);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1.3;
    
    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Create the objects
    loadModel();

    // Now add the group to our scene
    scene.add( root );
}
function initAnimations() 
{
    animator = new KF.KeyFrameAnimator;
    animator.init({ 
        interps:
            [
                {
                    //infinity position array as follows {infinity width, jumping value position, infinity height}
                    keys:[0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375, 1], 
                    values:[
                        {x : 0, y : 0, z : 0},
                        {x : 4, y : 4, z : 4.58},
                        {x : 8, y : 0, z : 6},
                        {x : 12, y : 4, z : 4.58},
                        {x : 16, y : 0, z : 0},
                        {x : 12, y : 4, z : -4.58},
                        {x : 8, y : 0, z : -6},
                        {x : 4, y : 4, z : -4.58},
                        {x : 0, y : 0, z : 0},
                        {x : -4, y : 4, z : 4.58},
                        {x : -8, y : 0, z : 6},
                        {x : -12, y : 4, z : 4.58},
                        {x : -16, y : 0, z : 0},
                        {x : -12, y : 4, z : -4.58},
                        {x : -8, y : 0, z : -6},
                        {x : -4, y : 4, z : -4.58},
                        {x : 0, y : 0, z : 0},
                    ],
                    target:bunnyGroup.position
                },
                {
                    //rotation animation values to make bunny jump facing where it is going
                    keys:[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1], 
                    values:[
                        {y : 0 },
                        {y : Math.PI/2 },
                        {y : 2*Math.PI/2 },
                        {y : 3*Math.PI/2 },
                        {y : 5*Math.PI/2.5 },
                        {y : 3*Math.PI/2 },                
                        {y : 2*Math.PI/2 },
                        {y : Math.PI/2 },
                        {y : 0 },
                    ],
                    target:bunnyGroup.rotation
                }
            ],
        loop: loopAnimation,
        duration: duration * 1000,
    });
}

function playAnimations()
{
    animator.start();
}