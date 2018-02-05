const THREE = require('three')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const light = new THREE.PointLight(0xffffff, 1, 0);
light.position.set(0, 200, 0);
scene.add(light);

const world = new THREE.Object3D();
scene.add(world)

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

renderer.setClearColor(0x222222);
camera.position.z = 100

const geometry = new THREE.PlaneGeometry(10, 10, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });

const plane = new THREE.Mesh(geometry, material);
world.add(plane);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render()