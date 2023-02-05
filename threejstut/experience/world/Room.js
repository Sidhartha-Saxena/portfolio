import Experience from "../Experience";
import * as THREE from "three";
import GSAP from "gsap";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resoureces;
    this.time = this.experience.time;
    this.room = this.resources.items.room;
    this.actualRoom = this.room.scene;
    this.roomChildren = {};
    this.lerp = {
      current: 0,
      target: 1,
      ease: 0.1,
    };
    this.setModel();
    this.onMouseMove();
  }
  setModel() {
    this.actualRoom.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child instanceof THREE.Group) {
        child.children.forEach((c) => {
          c.castShadow = true;
          c.receiveShadow = true;
        });
      }
      if (child.name === "amir") {
        child.material = new THREE.MeshPhysicalMaterial();
        child.material.roughness = 0;
        child.material.color.set(0x549dd2);
        child.material.ior = 3;
        child.material.transmission = 0.9;
        child.material.opacity = 0;
      }
      // if (child.name === "lmir") {
      //   child.material = new THREE.MeshPhysicalMaterial();
      //   child.material.roughness = 0;
      //   child.material.color.set(0x7cfc00);
      //   child.material.ior = 3;
      //   child.material.transmission = 0.95;
      //   child.material.opacity = 1;
      // }
      if (child.name === "screen") {
        // 1.945662498474121, y: 3.0490336418151855, z: -0.5241203308105469
        child.material = new THREE.MeshBasicMaterial({
          map: this.resources.items.screen,
        });
      }
      child.scale.set(0, 0, 0);
      if (child.name === "introcube") {
        child.position.set(0, -1, 0);
        child.rotation.y=Math.PI/4
      }

      this.roomChildren[child.name.toLowerCase()] = child;
    });
    // console.log(this.actualRoom);
    const width = 1;
    const height = 1;
    const intensity = 2;
    const rectLight = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight.position.set(-2, 3, 3);
    rectLight.rotation.x = -Math.PI / 2;
    rectLight.rotation.z = Math.PI / 6;
    // rectLight.rotation.y=Math.PI/4
    this.actualRoom.add(rectLight);

    const rectLight2 = new THREE.RectAreaLight(
      0xffffff,
      intensity,
      width,
      height
    );
    rectLight2.position.set(1, 3, -1.5);
    // rectLight2.rotation.x=-Math.PI/2
    // rectLight2.rotation.z=Math.PI/6
    rectLight2.rotation.y = Math.PI / 5 + Math.PI / 2;
    this.actualRoom.add(rectLight2);

    // const rectLight3 = new THREE.RectAreaLight(0xffffff, 0.3, 0.1, 0.2);
    // rectLight3.position.set(1.4, 1.7, 0);
    // rectLight3.rotation.x = Math.PI / 2;
    // rectLight3.rotation.z = Math.PI / 6;
    // // rectLight.rotation.y=Math.PI/4
    // const rectLightHelper = new RectAreaLightHelper(rectLight3);
    // rectLight3.add(rectLightHelper);
    // this.actualRoom.add(rectLight3);

    // console.log(this.actualRoom);
    this.roomChildren["rectlight"] = rectLight;
    this.roomChildren["rectlight2"] = rectLight2;
    this.scene.add(this.actualRoom);
    this.actualRoom.scale.set(0.45, 0.45, 0.45);
  }
  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      this.rotation =
        ((e.clientX - window.innerWidth / 2) * 2) / window.innerWidth;
      this.lerp.target = this.rotation * 0.05;
    });
  }
  resize() {}
  update() {
    this.lerp.current = GSAP.utils.interpolate(
      this.lerp.current,
      this.lerp.target,
      this.lerp.ease
    );

    this.actualRoom.rotation.y = this.lerp.current;
  }
}
