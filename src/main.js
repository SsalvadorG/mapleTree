import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

////////////////////////////////////////////////////////////

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

////////////////////////////////////////////////////////////

// 2. INICIALIZAR ORBIT CONTROLS
// Vincula la cámara y el lienzo del ratón
const controls = new OrbitControls(camera, renderer.domElement);

// Configuraciones útiles para los controles (Opcionales pero recomendadas)
controls.enableDamping = true; // Suaviza el movimiento para que no sea brusco
controls.dampingFactor = 0.05;

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Alejar la cámara (Tu configuración actual)
camera.position.set(0, -10, 90); 
// Indicarle a los controles dónde mirar inicialmente
controls.target.set(0, 0, 0); 
controls.update();

////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////

// 3. Alejar la cámara (Por defecto nace en el centro 0,0,0)
camera.position.set(0, -10, 90); 
////////////////////////////////////////////////////////////

// 1. Instanciar únicamente el cargador de Objetos (.obj)
const objLoader = new OBJLoader();

// 2. Cargar directamente el archivo .obj sin intermediarios
objLoader.load(
  '../public/maple-tree/QuickMapleOptimized.obj', 
  (object) => {

    // --- CENTRAR EL OBJETO AUTOMÁTICAMENTE ---
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    box.getCenter(center); 
    object.position.sub(center);

    // Forzar a la cámara a mirar al centro del árbol
    //camera.lookAt(0, 2, 0);

    // Agregar el modelo limpio a la escena
    scene.add(object);
    console.log("¡Modelo OBJ cargado con éxito!");
  },
  (xhr) => console.log('Cargando OBJ: ' + (xhr.loaded / xhr.total * 100) + '%'),
  (error) => console.error('Error crítico al cargar el archivo OBJ', error)
);

////////////////////////////////////////////////////////////

// 5. Bucle de animación (Vuelve a dibujar la escena constantemente)
function animate() {
  requestAnimationFrame(animate);

  // 3. ACTUALIZAR LOS CONTROLES EN CADA FRAME
  // Esto es obligatorio si activas el "damping" (suavizado)
  controls.update(); 

  renderer.render(scene, camera);
}

////////////////////////////////////////////////////////////

animate();
