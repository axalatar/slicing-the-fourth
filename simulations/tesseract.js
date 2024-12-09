import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById("tesseract");

const sliderXY = document.getElementById("tesseract-xy");
const sliderXZ = document.getElementById("tesseract-xz");
const sliderXW = document.getElementById("tesseract-xw");
const sliderYZ = document.getElementById("tesseract-yz");
const sliderYW = document.getElementById("tesseract-yw");
const sliderZW = document.getElementById("tesseract-zw");


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


var prevXY = -10;
var prevXZ = 0;
var prevXW = 0;
var prevYZ = 0;
var prevYW = 0;
var prevZW = 0;

function deg(rad) {
  return rad * (Math.PI / 180);
}


function computeEdges(theta_zw, theta_yw, theta_yz, theta_xw, theta_xz, theta_xy) {

    let points = []

    for(let a1 = 0; a1 < 2; a1++) {
        for(let a2 = 0; a2 < 2; a2++) {
            for(let a3 = 0; a3 < 2; a3++) {
                for(let a4 = 0; a4 < 2; a4++) {
                    points.push(new THREE.Vector4(0.5-a1, 0.5-a2, 0.5-a3, 0.5-a4))
                }
            }
        }
    }

    let edges = [];

    for(let i = 0; i < points.length-1; i++) {
        for(let j = i+1; j < points.length; j++) {
            let count = 0;
            for(let k = 0; k < 4; k++) {
                if(Math.sign(points[i].getComponent(k)) != Math.sign(points[j].getComponent(k))) {
                    count += 1;
                }
            }

            if(count <= 1) {
                edges.push([i, j])
            }
        }
    }

    
    let Rzw = new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, Math.cos(theta_zw), -Math.sin(theta_zw),
        0, 0, Math.sin(theta_zw), Math.cos(theta_zw)
    )

    let Ryw = new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, Math.cos(theta_yw), 0, -Math.sin(theta_yw),
        0, 0, 1, 0,
        0, Math.sin(theta_yw), 0, Math.cos(theta_yw)
    )

    let Ryz = new THREE.Matrix4().set(
        1, 0, 0, 0,
        0, Math.cos(theta_yz), -Math.sin(theta_yz), 0,
        0, Math.sin(theta_yz), Math.cos(theta_yz), 0,
        0, 0, 0, 1
    )

    let Rxw = new THREE.Matrix4().set(
        Math.cos(theta_xw), 0, 0, -Math.sin(theta_xw),
        0, 1, 0, 0,
        0, 0, 1, 0,
        Math.sin(theta_xw), 0, 0, Math.cos(theta_xw)
    )

    let Rxz = new THREE.Matrix4().set(
        Math.cos(theta_xz), 0, -Math.sin(theta_xz), 0,
        0, 1, 0, 0,
        Math.sin(theta_xz), 0, Math.cos(theta_xz), 0,
        0, 0, 0, 1
    )

    let Rxy = new THREE.Matrix4().set(
        Math.cos(theta_xy), -Math.sin(theta_xy), 0, 0,
        Math.sin(theta_xy), Math.cos(theta_xy), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    )

    for(let i = 0; i < points.length; i++) {
        points[i].applyMatrix4(Rxy);
        points[i].applyMatrix4(Rxz);
        points[i].applyMatrix4(Rxw);
        points[i].applyMatrix4(Ryz);
        points[i].applyMatrix4(Ryw);
        points[i].applyMatrix4(Rzw);
    }

    let lines = [];
    for(let i = 0; i < edges.length; i++) {
        let p1 = points[edges[i][0]];
        let p2 = points[edges[i][1]];



        let geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p1.x,p1.y,p1.z), new THREE.Vector3(p2.x,p2.y,p2.z)])
        lines.push(new THREE.Line(geometry, material));
    }
    return lines;
  }


function animate() {
  if (sliderXY.value != prevXY || sliderXZ.value != prevXZ || sliderXW.value != prevXW || sliderYZ.value != prevYZ || sliderYW.value != prevYW || sliderZW.value != prevZW) {

    prevXY = sliderXY.value;
    prevXZ = sliderXZ.value;
    prevXW = sliderXW.value;
    prevYZ = sliderYZ.value;
    prevYW = sliderYW.value;
    prevZW = sliderZW.value;

    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    const lines = computeEdges(deg(Number.parseFloat(prevZW)), deg(Number.parseFloat(prevYW)), deg(Number.parseFloat(prevYZ)), deg(Number.parseFloat(prevXW)), deg(Number.parseFloat(prevXZ)), deg(Number.parseFloat(prevXY)))

    lines.forEach((line) => scene.add(line))
    
    // scene.add(intersectionMesh);
  }
  controls.update()

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);