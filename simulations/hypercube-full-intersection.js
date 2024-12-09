import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById("hypercube-full-intersection");
const sliderW = document.getElementById("hypercube-full-intersection-w");

const sliderXY = document.getElementById("hypercube-full-intersection-xy");
const sliderXZ = document.getElementById("hypercube-full-intersection-xz");
const sliderXW = document.getElementById("hypercube-full-intersection-xw");
const sliderYZ = document.getElementById("hypercube-full-intersection-yz");
const sliderYW = document.getElementById("hypercube-full-intersection-yw");
const sliderZW = document.getElementById("hypercube-full-intersection-zw");


const scene = new THREE.Scene();
scene.background = new THREE.Color().setRGB(1, 1, 0.5)

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const controls = new OrbitControls(camera, canvas);


const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);
const material = new THREE.MeshStandardMaterial({ color: 0x9797FF, flatShading: true });


const maxLight = new THREE.PointLight(0xfffff, 100, 0, 2)
const minLight = new THREE.PointLight(0xfffff, 100, 0, 2)
maxLight.position.set(3, 3, 3);
minLight.position.set(-3, -3, -3);


scene.add(maxLight)
scene.add(minLight)


camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;

function recomputePlanes(theta_zw, theta_yw, theta_yz, theta_xw, theta_xz, theta_xy, k) {
  // ax + by + cz <= d
  // [a, b, c, d]
  return [
    [
      -Math.cos(theta_xw) * Math.cos(theta_xz) * Math.cos(theta_xy),
      Math.cos(theta_xw) * Math.cos(theta_xz) * Math.sin(theta_xy),
      Math.cos(theta_xw) * Math.sin(theta_xz),
       
       0.5
    ],
    [
      Math.cos(theta_xw) * Math.cos(theta_xz) * Math.cos(theta_xy),
      -Math.cos(theta_xw) * Math.cos(theta_xz) * Math.sin(theta_xy),
      -Math.cos(theta_xw) * Math.sin(theta_xz),
      
      0.5
    ],
    [
      Math.cos(theta_xz) * Math.cos(theta_xy) * Math.sin(theta_yw) * Math.sin(theta_xw) +
      Math.cos(theta_yw) * Math.cos(theta_xy) * Math.sin(theta_yz) * Math.sin(theta_xz) - 
      Math.cos(theta_yw) * Math.cos(theta_yz) * Math.sin(theta_xy),

      -Math.cos(theta_yw) * Math.cos(theta_yz) * Math.cos(theta_xy) -
      Math.cos(theta_xz) * Math.sin(theta_yw) * Math.sin(theta_xw) * Math.sin(theta_xy) -
      Math.cos(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy),

      Math.cos(theta_yw) * Math.cos(theta_xz) * Math.sin(theta_yz) -
      Math.sin(theta_yw) * Math.sin(theta_xw) * Math.sin(theta_xz),
      0.5
    ],
    [
      -Math.cos(theta_xz) * Math.cos(theta_xy) * Math.sin(theta_yw) * Math.sin(theta_xw) -
      Math.cos(theta_yw) * Math.cos(theta_xy) * Math.sin(theta_yz) * Math.sin(theta_xz) +
      Math.cos(theta_yw) * Math.cos(theta_yz) * Math.sin(theta_xy),

      Math.cos(theta_yw) * Math.cos(theta_yz) * Math.cos(theta_xy) +
      Math.cos(theta_xz) * Math.sin(theta_yw) * Math.sin(theta_xw) * Math.sin(theta_xy) +
      Math.cos(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy),

      -Math.cos(theta_yw) * Math.cos(theta_xz) * Math.sin(theta_yz) +
      Math.sin(theta_yw) * Math.sin(theta_xw) * Math.sin(theta_xz),
      0.5
    ],
    [
      Math.cos(theta_yw) * Math.cos(theta_xz) * Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_xw) -
      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_xz) -
      Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) +
      Math.cos(theta_yz) * Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_xy) -
      Math.cos(theta_zw) * Math.sin(theta_yz) * Math.sin(theta_xy),

      Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_yw) -
      Math.cos(theta_zw) * Math.cos(theta_xy) * Math.sin(theta_yz) -
      Math.cos(theta_yw) * Math.cos(theta_xz) * Math.sin(theta_zw) * Math.sin(theta_xw) * Math.sin(theta_xy) +
      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy) +
      Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy),

      -Math.cos(theta_zw) * Math.cos(theta_yz) * Math.cos(theta_xz) -
      Math.cos(theta_xz) * Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) -
      Math.cos(theta_yw) * Math.sin(theta_zw) * Math.sin(theta_xw) * Math.sin(theta_xz),

      0.5
    ],
    [
      -Math.cos(theta_yw) * Math.cos(theta_xz) * Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_xw) +
      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_xz) +
      Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) -
      Math.cos(theta_yz) * Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_xy) +
      Math.cos(theta_zw) * Math.sin(theta_yz) * Math.sin(theta_xy),

      -Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_yw) +
      Math.cos(theta_zw) * Math.cos(theta_xy) * Math.sin(theta_yz) +
      Math.cos(theta_yw) * Math.cos(theta_xz) * Math.sin(theta_zw) * Math.sin(theta_xw) * Math.sin(theta_xy) -
      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy) -
      Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy),

      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.cos(theta_xz) +
      Math.cos(theta_xz) * Math.sin(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) +
      Math.cos(theta_yw) * Math.sin(theta_zw) * Math.sin(theta_xw) * Math.sin(theta_xz),

      0.5
    ],
    [
      -Math.cos(theta_zw) * Math.cos(theta_yw) * Math.cos(theta_xz) * Math.cos(theta_xy) * Math.sin(theta_xw) -
      Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_xz) +
      Math.cos(theta_zw) * Math.cos(theta_xy) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) -
      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.sin(theta_yw) * Math.sin(theta_xy) -
      Math.sin(theta_zw) * Math.sin(theta_yz) * Math.sin(theta_xy),

      -Math.cos(theta_zw) * Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_yw) -
      Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_yz) +
      Math.cos(theta_zw) * Math.cos(theta_yw) * Math.cos(theta_xz) * Math.sin(theta_xw) * Math.sin(theta_xy) +
      Math.cos(theta_yz) * Math.sin(theta_zw) * Math.sin(theta_xz) * Math.sin(theta_xy) -
      Math.cos(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy),

      -Math.cos(theta_yz) * Math.cos(theta_xz) * Math.sin(theta_zw) +
      Math.cos(theta_zw) * Math.cos(theta_xz) * Math.sin(theta_yw) * Math.sin(theta_yz) +
      Math.cos(theta_zw) * Math.cos(theta_yw) * Math.sin(theta_xw) * Math.sin(theta_xz),

      0.5 - k
    ],
    [
      Math.cos(theta_zw) * Math.cos(theta_yw) * Math.cos(theta_xz) * Math.cos(theta_xy) * Math.sin(theta_xw) +
      Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_xz) -
      Math.cos(theta_zw) * Math.cos(theta_xy) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) +
      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.sin(theta_yw) * Math.sin(theta_xy) +
      Math.sin(theta_zw) * Math.sin(theta_yz) * Math.sin(theta_xy),

      Math.cos(theta_zw) * Math.cos(theta_yz) * Math.cos(theta_xy) * Math.sin(theta_yw) +
      Math.cos(theta_xy) * Math.sin(theta_zw) * Math.sin(theta_yz) -
      Math.cos(theta_zw) * Math.cos(theta_yw) * Math.cos(theta_xz) * Math.sin(theta_xw) * Math.sin(theta_xy) -
      Math.cos(theta_yz) * Math.sin(theta_zw) * Math.sin(theta_xz) * Math.sin(theta_xy) +
      Math.cos(theta_zw) * Math.sin(theta_yw) * Math.sin(theta_yz) * Math.sin(theta_xz) * Math.sin(theta_xy),

      Math.cos(theta_yz) * Math.cos(theta_xz) * Math.sin(theta_zw) -
      Math.cos(theta_zw) * Math.cos(theta_xz) * Math.sin(theta_yw) * Math.sin(theta_yz) -
      Math.cos(theta_zw) * Math.cos(theta_yw) * Math.sin(theta_xw) * Math.sin(theta_xz),

      0.5 + k
    ]
  ]
}


var prevW = -10;
var prevXY = 0;
var prevXZ = 0;
var prevXW = 0;
var prevYZ = 0;
var prevYW = 0;
var prevZW = 0;

function deg(rad) {
  return rad * (Math.PI / 180);
}

function animate() {
  if (sliderW.value != prevW || sliderXY.value != prevXY || sliderXZ.value != prevXZ || sliderXW.value != prevXW || sliderYZ.value != prevYZ || sliderYW.value != prevYW || sliderZW.value != prevZW) {

    prevW = sliderW.value;
    prevXY = sliderXY.value;
    prevXZ = sliderXZ.value;
    prevXW = sliderXW.value;
    prevYZ = sliderYZ.value;
    prevYW = sliderYW.value;
    prevZW = sliderZW.value;

    const prevObj = scene.getObjectByName("intersection");
    if (prevObj != undefined) {
      scene.remove(prevObj);
    }
    // const planes = recomputePlanes(deg(45), deg(45), deg(45), deg(45), deg(45), deg(45), Number.parseFloat(prevW))
    const planes = recomputePlanes(deg(Number.parseFloat(prevZW)), deg(Number.parseFloat(prevYW)), deg(Number.parseFloat(prevYZ)), deg(Number.parseFloat(prevXW)), deg(Number.parseFloat(prevXZ)), deg(Number.parseFloat(prevXY)), Number.parseFloat(prevW))
    // const planes = recomputePlanes(0, 0, 0, deg(45), 0, 0, Number.parseFloat(prevW))
    // console.log(planes)
    const intersections = [];
    for (let i = 0; i < planes.length - 2; i++) {
      for (let j = i + 1; j < planes.length - 1; j++) {
        for (let k = j + 1; k < planes.length; k++) {
          let a1 = planes[i][0];
          let b1 = planes[i][1];
          let c1 = planes[i][2];
          let d1 = planes[i][3];

          let a2 = planes[j][0];
          let b2 = planes[j][1];
          let c2 = planes[j][2];
          let d2 = planes[j][3];

          let a3 = planes[k][0];
          let b3 = planes[k][1];
          let c3 = planes[k][2];
          let d3 = planes[k][3];

          // from https://www.ambrbit.com/TrigoCalc/Plan3D/3PlanesIntersection/3PlanesIntersection_.htm

          let det = new THREE.Matrix3().set(
              a1, b1, c1,
              a2, b2, c2,
              a3, b3, c3
            ).determinant();
          if(det == 0) continue;

          let x = new THREE.Matrix3().set(
            d1, b1, c1,
            d2, b2, c2,
            d3, b3, c3
          ).determinant() / det;

          let y = new THREE.Matrix3().set(
            a1, d1, c1,
            a2, d2, c2,
            a3, d3, c3
          ).determinant() / det;

          let z = new THREE.Matrix3().set(
            a1, b1, d1,
            a2, b2, d2,
            a3, b3, d3
          ).determinant() / det;

          let point = new THREE.Vector3(x, y, z);

          if(!(Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z))) continue;
          
          let failed = false;
          for (let l = 0; l < planes.length; l++) {
            if (l == i || l == j || l == k) continue;
            if (point.x * planes[l][0] + point.y * planes[l][1] + point.z * planes[l][2] > planes[l][3]) {
              // console.log(point.x * planes[l][0] + point.y * planes[l][1] + point.z * planes[l][2])
              //console.log(planes[l][3])
              failed = true;
              break;
            }
          }
          if (!failed) intersections.push(point);
          // if (!failed) console.log("ABCDEFG")
        }
      }
    }

    const intersectionGeometry = new THREE.BufferGeometry();


    intersectionGeometry.setFromPoints(intersections);
    
    //console.log(intersections)

    var indices = []
    // horrible code but its fine
    for (let i = 0; i < intersections.length; i++) {
      for (let j = 0; j < intersections.length; j++) {
        for (let k = 0; k < intersections.length; k++) {
          indices.push(i)
          indices.push(j)
          indices.push(k)
        }
      }
    }
    intersectionGeometry.setIndex(indices)

    intersectionGeometry.computeVertexNormals()

    const intersectionMesh = new THREE.Mesh(intersectionGeometry, material);
    intersectionMesh.name = "intersection";
    scene.add(intersectionMesh);
  }
  controls.update()

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);