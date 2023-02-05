import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Resources from "./utils/Resources";
import assets from "./utils/assets";
import Camera from "./Camera";
import Theme from "./Theme";
import Renderer from "./Renderer";
import Preloader from "./Preloader";
import World from "./world/World";
import Controls from "./world/Controls";

export default class Experience {
  static instance;
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.time = new Time();
    this.sizes = new Sizes();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resoureces = new Resources(assets);
    this.theme = new Theme();
    this.world = new World();
    this.preloader = new Preloader();

    this.preloader.on("enablecontrols", () => {
      this.controls = new Controls();
    });

    this.time.on("resize", () => {
      this.resize();
    });
    this.time.on("update", () => {
      this.update();
    });
  }
  resize() {
    this.camera.resize();
    this.world.resize();
    this.renderer.resize();
  }
  update() {
    this.preloader.update();
    this.camera.update();
    this.world.update();
    this.renderer.update();
    if (this.controls) {
      this.controls.update();
    }
  }
}
