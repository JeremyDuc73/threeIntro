import './style.css'
import * as THREE from 'three'
import {OrbitControls} from "three/addons";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

const pointLight = new THREE.PointLight(0xffffff, 500)
pointLight.position.set(0,10, 0)

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

const spaceTexture = new THREE.TextureLoader().load('public/space.jpg')
scene.background = spaceTexture

let mixer


const loader = new GLTFLoader()

loader.load(
    'cat/scene.gltf',
    function (object) {
        object.scene.scale.set(0.01, 0.01, 0.01)
        mixer = new THREE.AnimationMixer(object.scene)
        let action = mixer.clipAction(object.animations[0])
        action.play()
        scene.add(object.scene)
    }
)



const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    controls.update()


    renderer.render(scene, camera)

}

animate()