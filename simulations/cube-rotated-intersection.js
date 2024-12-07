import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById("cube-rotated-intersection");
const slider = document.getElementById("cube-rotated-intersection-z");
const checkbox = document.getElementById("hide-rotated-cube");

const scene = new THREE.Scene();
scene.background = new THREE.Color().setRGB( 1, 1, 0.5 )

const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
const controls = new OrbitControls( camera, canvas );


const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize( canvas.width, canvas.height );
const material = new THREE.MeshStandardMaterial({color: 0x9797FF});


const boxGeometry = new THREE.BoxGeometry(1, 1, 1);



const cube = new THREE.Mesh(boxGeometry, material);
cube.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -Math.PI/4)
cube.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI/4)
cube.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -Math.PI/4)


scene.add(cube);

const planeGrid = new THREE.GridHelper(100, 100)
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

// ax + by <= c + dk
// [a, b, c, d]
const lines = [
  [-0.5, 0.5, 0.5, -Math.SQRT2/2],
  [0.5, -0.5, 0.5, Math.SQRT2/2],
  [-(2+Math.SQRT2)/4, (Math.SQRT2-2)/4, 0.5, 0.5],
  [(2+Math.SQRT2)/4, -(Math.SQRT2-2)/4, 0.5, -0.5],
  [(Math.SQRT2-2)/4, -(2+Math.SQRT2)/4, 0.5, -0.5],
  [-(Math.SQRT2-2)/4, (2+Math.SQRT2)/4, 0.5, 0.5]
]

var prevZ = -10;

function animate() {
  cube.visible = true;
  if(checkbox.checked) {
    cube.visible = false;

  }
  cube.position.z = slider.value;
  if(slider.value != prevZ) {

    prevZ = slider.value;

    const prevObj = scene.getObjectByName("intersection");
    if(prevObj != undefined) {      
      scene.remove(prevObj);
    }

      const intersections = [];
      for(let i = 0; i < lines.length-1; i++) {
        for(let j = i+1; j < lines.length; j++) {
          let a1 = lines[i][0];
          let b1 = lines[i][1];
          let c1 = (lines[i][2] + (lines[i][3] * prevZ));

          let a2 = lines[j][0];
          let b2 = lines[j][1];
          let c2 = (lines[j][2] + (lines[j][3] * prevZ));
          
          let x = ((b1*-c2) - (b2*-c1)) / ((a1*b2) - (a2*b1));
          let y = ((-c1*a2) - (-c2*a1)) / ((a1*b2) - (a2*b1));
          console.log
          if(!Number.isFinite(x) || !Number.isFinite(y)) {
            continue;
          }
          var point = new THREE.Vector3(x, y, 0);
          var failed = false;
          for(let k = 0; k < lines.length; k++) {
            if(k == i || k == j) continue;
            if(point.x*lines[k][0] + point.y*lines[k][1] > (lines[k][2] + (lines[k][3] * prevZ))) {
              failed = true;
              break;
            }
          }

          if(!failed) intersections.push(point);
        }
      }

      const intersectionGeometry = new THREE.BufferGeometry();


      intersectionGeometry.setFromPoints(intersections);

      var indices = []
      // horrible code but its fine
      for(let i = 0; i < intersections.length; i++) {
        for(let j = 0; j < intersections.length; j++) {
          for(let k = 0; k < intersections.length; k++) {
            indices.push(i)
            indices.push(j)
            indices.push(k)
          }
        }
      }
      intersectionGeometry.setIndex(indices)

      const intersectionMesh = new THREE.Mesh(intersectionGeometry, material);
      intersectionMesh.name = "intersection";
      scene.add(intersectionMesh);
    }
  controls.update()

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );