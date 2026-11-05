import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Para GLB
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// NOTA
// En el desarrollo web moderno con Three.js, el formato GLB
// (la versión binaria de glTF) ha sustituido casi por
// completo a la vieja combinación de OBJ + MTL.

// Esto implica que puedo suponer que si trabajo con three
// uasré GLBs, cosa que parece más simple que cargar 
// todos los demas fihceros de una

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

////////////////////////////////////////////////////////////

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); 
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

////////////////////////////////////////////////////////////

// Inits basicos de camara

// Alejar la cámara (Tu configuración actual)
camera.position.set(0, -10, 90); 
// Indicarle a los controles dónde mirar inicialmente
controls.target.set(0, 0, 0); 
controls.update();

////////////////////////////////////////////////////////////

// 3. Alejar la cámara (Por defecto nace en el centro 0,0,0)
camera.position.set(0, -10, 90); 
////////////////////////////////////////////////////////////


// 2. CAMBIO: Instanciamos el cargador de GLTF/GLB
const gltfLoader = new GLTFLoader();

const glbRoute = './maple_tree.glb';
// Importante, la ruta debe empezar por ./
// porque supone que './' es el directorio public.
// Esto depende de el fichero vite.config.js
// Pero como regla general, todas las rutas a
// recursos se escriben con ./, basandose en public

// 3. CAMBIO: Cargamos el archivo .glb
gltfLoader.load(
  glbRoute, // Pon aquí la ruta de tu .glb
  (gltf) => {
    // IMPORTANTE: El modelo real en un GLTF viene dentro de la propiedad '.scene'
    const model = gltf.scene;

    // --- CENTRAR EL OBJETO AUTOMÁTICAMENTE ---
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center); 
    model.position.sub(center);

    // Agregar el modelo a la escena
    scene.add(model);
    console.log("¡Modelo GLB cargado con éxito con todas sus texturas!");
  },
  (xhr) => console.log('Cargando GLB: ' + (xhr.loaded / xhr.total * 100) + '%'),
  (error) => console.error('Error crítico al cargar el archivo GLB', error)
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
