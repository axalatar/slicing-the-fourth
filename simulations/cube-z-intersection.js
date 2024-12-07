import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const canvas = document.getElementById("cube-z-intersection");
const slider = document.getElementById("cube-z-intersection-z");

const scene = new THREE.Scene();
scene.background = new THREE.Color().setRGB( 1, 1, 0.5 )

const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
const controls = new OrbitControls( camera, canvas );


const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize( canvas.width, canvas.height );
const material = new THREE.MeshStandardMaterial({color: 0x9797FF});


const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(boxGeometry, material);
scene.add(cube);

const planeGrid = new THREE.GridHelper(100, 1000)
planeGrid.rotateX(Math.PI/2);
scene.add(planeGrid)

const maxLight = new THREE.PointLight(0xfffff, 100, 0, 2)
const minLight = new THREE.PointLight(0xfffff, 100, 0, 2)
maxLight.position.set(3, 3, 3);
minLight.position.set(-3, -3, -3);


scene.add(maxLight)
scene.add(minLight)


camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;
function animate() {
  cube.position.z = slider.value;
  controls.update()

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );