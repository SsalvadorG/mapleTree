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

// Se necesitan como minimo tres elementos, la escena, la camara y el rendere:

const scene = new THREE.Scene(); // Crea una escena
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Crea una camara
const renderer = new THREE.WebGLRenderer(); // Crea un Renderer

renderer.setSize(window.innerWidth, window.innerHeight); // Tamaño del canvas que ocupará el renderer
// Por defecto asumiremos que es un 100% 100%, eso si, por defecto esto se
// mantiene fijo una vez calculada la primera vez, asi que para
// recalcularse se ha de configurar eventListeners

document.body.appendChild(renderer.domElement); // Integrar el renderer en el body

////////////////////////////////////////////////////////////

// 2. INICIALIZAR ORBIT CONTROLS
// Vincula la cámara y el lienzo del ratón
// Como es un objeto prehecho no me esforzaré demasiado
// en tratar de entenderlo
const controls = new OrbitControls(camera, renderer.domElement);
// Entiendo que le pasas la camara en cuestión a modificar
// Y el render concreto que tendrá que tener en cuenta con los movimientos del raton
// Entiendo tambien que los movimientos del raton están preconfigurados.

// Configuraciones útiles para los controles (Opcionales pero recomendadas)
controls.enableDamping = true; // Suaviza el movimiento para que no sea brusco
controls.dampingFactor = 0.05;

////////////////////////////////////////////////////////////

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Luz de ambiente (entiendo que se aplica a todas las caras de manera uniforme por defecto)
scene.add(ambientLight); // Crea una nueva luz y la integra

const directionalLight = new THREE.DirectionalLight('red', 0.8); // Iluminación direccionada
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

////////////////////////////////////////////////////////////

// Inits basicos de camara
camera.position.set(0, -10, 90); // Alejar la cámara (Por defecto nace en el centro 0,0,0)
controls.target.set(0, 0, 0); // Indicarle a los controles dónde mirar inicialmente (en este caso al 0,0,0 porque ahí colocaré el modelo)

controls.update();

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

  glbRoute, // ruta de modelo .glb
 
  (gltf) => { // Callback de carga

    // IMPORTANTE: El modelo real en un GLTF viene dentro de la propiedad '.scene'
    const model = gltf.scene;

    // --- CENTRAR EL OBJETO AUTOMÁTICAMENTE ---
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3(); // Saca el centro por defecto
    box.getCenter(center); 
    model.position.sub(center);

    scene.add(model); // Agregar el modelo a la escena

    console.log("¡Modelo GLB cargado con éxito con todas sus texturas!");
  },
  (xhr) => console.log('Cargando GLB: ' + (xhr.loaded / xhr.total * 100) + '%'), // Se ejecuta cada X segundos
  (error) => console.error('Error crítico al cargar el archivo GLB', error) // Si no se puede cargar...

);

////////////////////////////////////////////////////////////

// Si el window cambia de tamaño, se llama a resize
window.addEventListener('resize', () => {

  renderer.setSize(window.innerWidth, window.innerHeight); // Actualizar el tamaño del renderizador

  // Actualizar la relación de aspecto de la cámara
  // Para evitar deformiades
  camera.aspect = window.innerWidth / window.innerHeight;
  
  // Indicar a la cámara que recalcule su matriz de proyección
  // Sea lo que sea que eso quiera sigmificar
  camera.updateProjectionMatrix();

});

////////////////////////////////////////////////////////////

// 5. Bucle de animación (Vuelve a dibujar la escena constantemente)
function animate() {
  requestAnimationFrame(animate);

  // 3. ACTUALIZAR LOS CONTROLES EN CADA FRAME
  // Esto es obligatorio si activas el "damping" (suavizado)
  // (no entienod porque es obligatorio)
  controls.update(); // Actualiza el modelo a 60 FPS
  // Esto permite que los controles hagan efecto, cambiando la posición
  // relativa de la camara respecto a la proyeción

  renderer.render(scene, camera);
  // Entiendo que el render es un canvas HTML, la camará es una posición
  // virtual relativa a la proyección y la escena es el conjunto de
  // modelos que se va a proyectar en el canvas.
  // O al menos eso es lo que creo que es.

}

////////////////////////////////////////////////////////////

animate();
