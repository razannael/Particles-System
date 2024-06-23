import * as THREE from 'three';
import * as dat from 'dat.gui';
import cross from './assets/cross.png';
import gsap from 'gsap';
import CSSRulePlugin from 'gsap/CSSRulePlugin';

//gsap plugins
gsap.registerPlugin(CSSRulePlugin);


//Texture
const texture = new THREE.TextureLoader().load(cross);

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.TorusGeometry(.9, .15, 16, 110);
const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 1500;
const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Materials
const material = new THREE.PointsMaterial({
    size: 0.005
});

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05, // Increased size for visibility
    transparent: true,
    map: texture,
    color: '#ff88cc',
    blending: THREE.AdditiveBlending // Added for better visibility
});

// Mesh
const sphere = new THREE.Points(geometry, material);
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(sphere, particlesMesh);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Added ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(-1, 0.75, 0.5);
scene.add(directionalLight);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


//gsap texts animations
const content = CSSRulePlugin.getRule('.content::before');
const h1 = document.querySelector('h1');
const p = document.querySelector('p');
const t1 = gsap.timeline();
t1.from(
    content,{delay: 0.3, duration: 4, cssRule: {scaleX: 0}}
)
t1.to(h1, {duration: 2, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"}, "-=3.6")
t1.to(p, {duration: 4, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"}, "-=1.2")



//mouse
document.addEventListener('mousemove', animateParticles);
let mouseX = 0;
let mouseY = 0;
function animateParticles(event) {

    mouseX = event.clientX;
    mouseY = event.clientY;
}


window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#161035'), 1); // Ensure background color is set here

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = .5 * elapsedTime;
    particlesMesh.rotation.y = -.1 * elapsedTime;
    if(mouseX>0){
        particlesMesh.rotation.x = -mouseY * elapsedTime * 0.0001; // Rotate particles for effect
        particlesMesh.rotation.y = mouseX * elapsedTime * 0.0001;
    }
    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
