import Experience from "../Experience";
import * as THREE from "three";
import GSAP from "gsap";
// import GUI from "lil-gui";
export default class Enviroment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    // this.gui = new GUI({ container: document.querySelector(".hero-main") });
    this.obj = {
      colorObj: { r: 0, g: 0, b: 0 },
      intensity: 3,
    };
    this.setSunLight();
    // this.setGui();
  }
  setGui() {
    this.gui.addColor(this.obj, "colorObj").onChange(() => {
      this.sunLight.color.copy(this.obj.colorObj);
      this.ambLight.color.copy(this.obj.colorObj);
      console.log(this.obj.colorObj);
    });
    this.gui.add(this.obj, "intensity", 0, 10).onChange(() => {
      this.sunLight.intensity = this.obj.intensity;
      this.ambLight.intensity = this.obj.intensity;
      console.log(this.obj.intensity);
    });
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 20;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.normalBias = 0.05;
    // const helper=new THREE.CameraHelper(this.sunLight.shadow.camera)
    // this.scene.add(helper)
    this.sunLight.position.set(-1.5, 7, 3);
    this.scene.add(this.sunLight);

    this.ambLight = new THREE.AmbientLight("#ffffff", 1);
    this.scene.add(this.ambLight);
  }
  switchTheme(theme) {
    if (theme === "dark") {
      GSAP.to(this.sunLight.color, {
        b: 75/255,
        g: 1/255,
        r: 14/255,
      });
      GSAP.to(this.ambLight.color, {
        b: 0.5372549019607843,
        g: 0.3176470588235294,
        r: 0.30196078431372547,
      });
      GSAP.to(this.ambLight,{intensity:1})
      GSAP.to(this.sunLight,{intensity:0.5})
    } else {
      GSAP.to(this.sunLight.color, {
        r: 255 / 255,
        g: 255 / 255,
        b: 255 / 255,
      });
      GSAP.to(this.ambLight.color, {
        r: 1,
        g: 1,
        b: 1,
      });
      GSAP.to(this.ambLight,{intensity:1})
      GSAP.to(this.sunLight,{intensity:3})
    }
  }
  resize() {}
  update() {}
}
