import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById("hypercube-rotated-intersection");
const slider = document.getElementById("hypercube-rotated-intersection-w");

const scene = new THREE.Scene();
scene.background = new THREE.Color().setRGB(1, 1, 0.5)

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
const controls = new OrbitControls(camera, canvas);


const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);
const material = new THREE.MeshStandardMaterial({ color: 0x9797FF });



const maxLight = new THREE.PointLight(0xfffff, 100, 0, 2)
const minLight = new THREE.PointLight(0xfffff, 100, 0, 2)
maxLight.position.set(3, 3, 3);
minLight.position.set(-3, -3, -3);


scene.add(maxLight)
scene.add(minLight)


camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;

function recomputePlanes(theta1, theta2, theta3, theta4, theta5, theta6, k) {
  // ax + by + cz <= d
  // [a, b, c, d]
  return [
    [
      Math.cos(theta4) * Math.cos(theta5) * Math.cos(theta6),
      -Math.cos(theta4) * Math.cos(theta5) * Math.sin(theta6),
      -Math.cos(theta4) * Math.sin(theta5),
       
       -0.5
    ],
    [
      -Math.cos(theta4) * Math.cos(theta5) * Math.cos(theta6),
      Math.cos(theta4) * Math.cos(theta5) * Math.sin(theta6),
      Math.cos(theta4) * Math.sin(theta5),
      
      -0.5
    ],
    [
      -Math.cos(theta5) * Math.cos(theta6) * Math.sin(theta2) * Math.sin(theta4) - Math.cos(theta2) * Math.cos(theta6) * Math.sin(theta3) * Math.sin(theta5) + Math.cos(theta2) * Math.cos(theta3) * Math.sin(theta6),
      Math.cos(theta2) * Math.cos(theta3) * Math.cos(theta6) + Math.cos(theta5) * Math.sin(theta2) * Math.sin(theta4) * Math.sin(theta6) + Math.cos(theta2) * Math.sin(theta3) * Math.sin(theta5) * Math.sin(theta6),
      -Math.cos(theta2) * Math.cos(theta5) * Math.sin(theta3) + Math.sin(theta2) * Math.sin(theta4) * Math.sin(theta5),
      -0.5
    ],
    [
      Math.cos(theta5) * Math.cos(theta6) * Math.sin(theta2) * Math.sin(theta4) + Math.cos(theta2) * Math.cos(theta6) * Math.sin(theta3) * Math.sin(theta5) - Math.cos(theta2) * Math.cos(theta3) * Math.sin(theta6),
      -Math.cos(theta2) * Math.cos(theta3) * Math.cos(theta6) - Math.cos(theta5) * Math.sin(theta2) * Math.sin(theta4) * Math.sin(theta6) - Math.cos(theta2) * Math.sin(theta3) * Math.sin(theta5) * Math.sin(theta6),
      Math.cos(theta2) * Math.cos(theta5) * Math.sin(theta3) - Math.sin(theta2) * Math.sin(theta4) * Math.sin(theta5),
      -0.5
    ],
    [
      -Math.cos(theta2) * Math.cos(theta5) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta4) +
      Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta5) +
      Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) -
      Math.cos(theta3) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta6) +
      Math.cos(theta1) * Math.sin(theta3) * Math.sin(theta6),

      -Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) +
      Math.cos(theta1) * Math.cos(theta6) * Math.sin(theta3) +
      Math.cos(theta2) * Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta6) -
      Math.cos(theta1) * Math.cos(theta3) * Math.sin(theta5) * Math.sin(theta6) -
      Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) * Math.sin(theta6),

      Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta5) +
      Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) +
      Math.cos(theta2) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta5),

      -0.5
    ],
    [
      Math.cos(theta2) * Math.cos(theta5) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta4) -
      Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta5) -
      Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) +
      Math.cos(theta3) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta6) -
      Math.cos(theta1) * Math.sin(theta3) * Math.sin(theta6),

      Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) -
      Math.cos(theta1) * Math.cos(theta6) * Math.sin(theta3) -
      Math.cos(theta2) * Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta6) +
      Math.cos(theta1) * Math.cos(theta3) * Math.sin(theta5) * Math.sin(theta6) +
      Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) * Math.sin(theta6),

      -Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta5) -
      Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) -
      Math.cos(theta2) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta5),

      -0.5
    ],
    [
      -Math.cos(theta2) * Math.cos(theta5) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta4) +
      Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta5) +
      Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) -
      Math.cos(theta3) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta6) +
      Math.cos(theta1) * Math.sin(theta3) * Math.sin(theta6),

      -Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) +
      Math.cos(theta1) * Math.cos(theta6) * Math.sin(theta3) +
      Math.cos(theta2) * Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta6) -
      Math.cos(theta1) * Math.cos(theta3) * Math.sin(theta5) * Math.sin(theta6) -
      Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) * Math.sin(theta6),

      Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta5) +
      Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) +
      Math.cos(theta2) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta5),

      -0.5 + k
    ],
    [
      Math.cos(theta2) * Math.cos(theta5) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta4) -
      Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta5) -
      Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) +
      Math.cos(theta3) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta6) -
      Math.cos(theta1) * Math.sin(theta3) * Math.sin(theta6),

      Math.cos(theta3) * Math.cos(theta6) * Math.sin(theta1) * Math.sin(theta2) -
      Math.cos(theta1) * Math.cos(theta6) * Math.sin(theta3) -
      Math.cos(theta2) * Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta6) +
      Math.cos(theta1) * Math.cos(theta3) * Math.sin(theta5) * Math.sin(theta6) +
      Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) * Math.sin(theta5) * Math.sin(theta6),

      -Math.cos(theta1) * Math.cos(theta3) * Math.cos(theta5) -
      Math.cos(theta5) * Math.sin(theta1) * Math.sin(theta2) * Math.sin(theta3) -
      Math.cos(theta2) * Math.sin(theta1) * Math.sin(theta4) * Math.sin(theta5),

      -0.5 - k
    ]
  ]
}

function findPoint(a, b, c, d) {
  if(a != 0) {
    return new THREE.Vector3(d/a, 0, 0)
  }
  if(b != 0) {
    return new THREE.Vector3(0, d/b, 0)
  }
  if(c != 0) {
    return new THREE.Vector3(0, 0, d/c)
  }
  return new THREE.Vector3(Infinity, Infinity, Infinity)
}

function vertIntersectPlanes(p1, p2, p3) // borrowed code, will remove
{
  let n1 = p1.normal, n2 = p2.normal, n3 = p3.normal;
  let x1 = p1.coplanarPoint(new THREE.Vector3());
  let x2 = p2.coplanarPoint(new THREE.Vector3());
  let x3 = p3.coplanarPoint(new THREE.Vector3());
  let f1 = new THREE.Vector3().crossVectors(n2, n3).multiplyScalar(x1.dot(n1));
  let f2 = new THREE.Vector3().crossVectors(n3, n1).multiplyScalar(x2.dot(n2));
  let f3 = new THREE.Vector3().crossVectors(n1, n2).multiplyScalar(x3.dot(n3));
  let det = new THREE.Matrix3().set(n1.x, n1.y, n1.z, n2.x, n2.y, n2.z, n3.x, n3.y, n3.z).determinant();
  let vectorSum = new THREE.Vector3().add(f1).add(f2).add(f3);
  let planeIntersection = new THREE.Vector3(vectorSum.x / det, vectorSum.y / det, vectorSum.z / det);
  return planeIntersection;
}
var prevW = -10;

function animate() {
  if (slider.value != prevW) {

    prevW = slider.value;

    const prevObj = scene.getObjectByName("intersection");
    if (prevObj != undefined) {
      scene.remove(prevObj);
    }
    const planes = recomputePlanes(0, 0, 0, 0, 0, 0, Number.parseFloat(prevW))
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

          // from https://mathworld.wolfram.com/Plane-PlaneIntersection.html

          let n1 = new THREE.Vector3(a1, b1, c1);
          let n2 = new THREE.Vector3(a2, b2, c2);
          let n3 = new THREE.Vector3(a3, b3, c3);


          let x1 = findPoint(a1, b1, c1, d1);
          let x2 = findPoint(a2, b2, c2, d2);
          let x3 = findPoint(a3, b3, c3, d3);

          let det = new THREE.Matrix3().set(
            a1, b1, c1,
            a2, b2, c2,
            a3, b3, c3
          ).determinant()
          // console.log(x3)
          // console.log(n3)
          // if(det == 0) continue;

          // let point = (((n2.cross(n3)).multiplyScalar(x1.dot(n1))).add((n3.cross(n1)).multiplyScalar(x2.dot(n2))).add((n1.cross(n2)).multiplyScalar(x3.dot(n3)))).divideScalar(det);
          let point = vertIntersectPlanes(new THREE.Plane(n1.normalize(), d1), new THREE.Plane(n2.normalize(), d2), new THREE.Plane(n3.normalize(), d3))

          if(!(Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z))) continue;
          
          var failed = false;
          for (let l = 0; l < planes.length; l++) {
            if (l == i || l == j || l == k) continue;
            if (point.x * planes[l][0] + point.y * planes[l][1] + point.z * planes[l][2] > planes[l][3]) {
              console.log(point.x * planes[l][0] + point.y * planes[l][1] + point.z * planes[l][2])
              console.log(planes[l][3])
              failed = true;
              break;
            }
          }

          if (!failed) intersections.push(point);
          if (!failed) console.log("ABCDEFG")
          //if (!failed) console.log((n2.cross(n3)).multiplyScalar(x1.dot(n1)).add((n3.cross(n1)).multiplyScalar(x2.dot(n2))))
        }
      }
    }

    const intersectionGeometry = new THREE.BufferGeometry();


    intersectionGeometry.setFromPoints(intersections);

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

    const intersectionMesh = new THREE.Mesh(intersectionGeometry, material);
    intersectionMesh.name = "intersection";
    scene.add(intersectionMesh);
  }
  controls.update()

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);