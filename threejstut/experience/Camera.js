import Experience from "./Experience";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.createPerspectiveCamera();
    this.createOrthoCamera();
    this.setOrbitControles();
  }
  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    );
    this.scene.add(this.perspectiveCamera);
    this.perspectiveCamera.position.x = 29;
    this.perspectiveCamera.position.y = 14;
    this.perspectiveCamera.position.z = 12;
  }
  createOrthoCamera() {
    this.orthoCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustrum) / 2,
      (this.sizes.aspect * this.sizes.frustrum) / 2,
      this.sizes.frustrum / 2,
      -this.sizes.frustrum / 2,
      -50,
      50
    );
    this.orthoCamera.position.y = 5.65;
    this.orthoCamera.position.z = 10;
    this.orthoCamera.rotation.x = -Math.PI / 6;

    this.scene.add(this.orthoCamera);
    // const size = 20;
    // const divisions = 20;

    // HELPERS

    // this.helper=new THREE.CameraHelper(this.orthoCamera)
    // this.scene.add(this.helper)
    // const gridHelper = new THREE.GridHelper(size, divisions);
    // this.scene.add(gridHelper);
    // const axesHelper = new THREE.AxesHelper(10);
    // this.scene.add(axesHelper);

  }
  setOrbitControles() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
  }

  resize() {
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    this.orthoCamera.left = (-this.sizes.aspect * this.sizes.frustrum) / 2;
    this.orthoCamera.right = (this.sizes.aspect * this.sizes.frustrum) / 2;
    this.orthoCamera.top = this.sizes.frustrum / 2;
    this.orthoCamera.bottom = -this.sizes.frustrum / 2;
    this.orthoCamera.updateProjectionMatrix();
  }
  update() {
    this.controls.update();
    // this.helper.matrixWorldNeedsUpdate=true;
    // this.helper.update();
    
    // this.helper.position.copy(this.orthoCamera.position)
    // this.helper.rotation.copy(this.orthoCamera.rotation)
  }
}
