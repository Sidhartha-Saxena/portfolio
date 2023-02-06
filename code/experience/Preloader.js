import { EventEmitter } from "events";
import Experience from "./Experience";
import GSAP from "gsap";
import convert from "./utils/converdistospan";
import * as THREE from "three";

export default class Preloader extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resoureces;
    this.camera = this.experience.camera;
    this.world = this.experience.world;
    this.device = this.sizes.device;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x612824 });
    this.introcube = new THREE.Mesh(geometry, material);
    this.introcube.rotation.y = Math.PI / 4;
    this.scene.add(this.introcube);
    this.sizes.on("switchdevice", (device) => {
      this.device = device;
    });
    this.world.on("worldReady", () => {
      this.setAssets();
      this.playIntro();
    });
  }
  setAssets() {
    convert(document.querySelector(".intro-text"));
    convert(document.querySelector(".hero-main-title"));
    convert(document.querySelector(".hero-main-description"));
    convert(document.querySelector(".hero-second-subheading"));
    convert(document.querySelector(".second-sub"));

    this.room = this.experience.world.room.actualRoom;
    this.roomChildren = this.experience.world.room.roomChildren;
    // console.log(this.roomChildren);
  }
  firstIntro() {
    return new Promise((resolve) => {
      this.timeline = new GSAP.timeline();
      this.timeline.set(".animatedis", { y: 0, yPercent: 100 });
      this.timeline.to(".preloader", {
        opacity: 0,
        delay: 1,
        onComplete: () => {
          document.querySelector(".preloader").classList.add("hidden");
        },
      });
      if (this.device === "desktop") {
        this.timeline
          .to(this.introcube.scale, {
            x: 1,
            y: 2,
            z: 1,
            ease: "back.out(2.5)",
            duration: 1,
          })
          .to(this.introcube.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: "back.out(2.5)",
            duration: 1,
          });
      } else {
        this.timeline
          .to(this.introcube.scale, {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            ease: "back.out(2.5)",
            duration: 1,
          })
          .to(this.room.position, {
            z: -1,
            ease: "power1.out",
            duration: 0.7,
          });
      }
      this.timeline
        .to(".intro-text .animatedis", {
          yPercent: 0,
          stagger: 0.05,
          ease: "back.out(1.7)",
        })
        .to(
          ".arrow-svg-wrapper",
          {
            opacity: 1,
          },
          "same"
        )
        .to(
          ".toggle-bar",
          {
            opacity: 1,
            onComplete: resolve,
          },
          "same"
        );
    });
  }
  secondIntro() {
    return new Promise((resolve) => {
      this.secondTimeline = new GSAP.timeline();

      this.secondTimeline
        .to(
          ".intro-text .animatedis",
          {
            yPercent: 100,
            stagger: 0.05,
            ease: "back.in(1.7)",
          },
          "fadeout"
        )
        .to(
          ".arrow-svg-wrapper",
          {
            opacity: 0,
          },
          "fadeout"
        )
        .to(
          this.room.position,
          {
            x: 0,
            y: 0,
            z: 0,
            ease: "power1.out",
          },
          "same"
        )
        .to(
          this.introcube.rotation,
          {
            y: 2 * Math.PI + Math.PI / 4,
          },
          "same"
        )
        .to(
          this.camera.orthoCamera.position,
          {
            y: 6.5,
          },
          "same"
        )
        .to(
          this.introcube.scale,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 1,
          },
          "introtext"
        )
        .to(
          ".hero-main-title .animatedis",
          {
            yPercent: 0,
            stagger: 0.07,
            ease: "back.out(1)",
          },
          "introtext"
        )
        .to(
          ".hero-main-description .animatedis",
          {
            yPercent: 0,
            stagger: 0.07,
            ease: "back.out(1)",
          },
          "introtext"
        )
        .to(
          ".first-sub .animatedis",
          {
            yPercent: 0,
            stagger: 0.07,
            ease: "back.out(1)",
          },
          "introtext"
        )
        .to(
          ".second-sub .animatedis",
          {
            yPercent: 0,
            stagger: 0.07,
            ease: "back.out(1)",
          },
          "introtext"
        )
        .to(".arrow-svg-wrapper", {
          opacity: 1,
          onComplete: resolve,
        });
      Object.values(this.roomChildren).forEach((child, i) => {
        if (child.name !== "introcube") {
          if (i % 2 == 0) {
            this.secondTimeline.to(
              child.scale,
              {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1.2)",
                duration: 1,
              },
              "sameobject"
            );
          } else {
            this.secondTimeline.to(
              child.scale,
              {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(1.4)",
                duration: 1,
              },
              "sameobject2"
            );
          }
        }
      });
    });
  }

  onScroll(e) {
    // console.log(e);
    if (e.deltaY > 0) {
      this.removeEventListeners();
      this.playSecondIntro();
    }
  }

  onTouch(e) {
    this.initalY = e.touches[0].clientY;
  }

  onTouchMove(e) {
    let currentY = e.touches[0].clientY;
    let difference = this.initalY - currentY;
    if (difference > 0) {
      console.log("swipped up");
      this.removeEventListeners();
      this.playSecondIntro();
    }
    this.intialY = null;
  }

  removeEventListeners() {
    window.removeEventListener("wheel", this.scrollOnceEvent);
    window.removeEventListener("touchstart", this.touchStart);
    window.removeEventListener("touchmove", this.touchMove);
    window.removeEventListener("keydown", this.keypressanimate);
  }
  onKeyPress(e) {
    e["deltaY"] = 1;
    this.scrollOnceEvent(e);
  }
  async playIntro() {
    this.scaleFlag = true;
    await this.firstIntro();
    this.moveFlag = true;
    this.scrollOnceEvent = this.onScroll.bind(this);
    this.touchStart = this.onTouch.bind(this);
    this.touchMove = this.onTouchMove.bind(this);
    this.keypressanimate = this.onKeyPress.bind(this);
    window.addEventListener("wheel", this.scrollOnceEvent);
    window.addEventListener("touchstart", this.touchStart);
    window.addEventListener("touchmove", this.touchMove);
    window.addEventListener("keydown", this.keypressanimate);
  }
  async playSecondIntro() {
    this.moveFlag = false;
    await this.secondIntro();
    this.scaleFlag = false;

    this.scene.remove(this.introcube);
    this.introcube.geometry.dispose();
    this.introcube.material.dispose();
    this.introcube = undefined;
    this.emit("enablecontrols");
  }

  move() {
    if (this.device === "desktop") {
      this.room.position.set(-1, 0, 0);
    } else {
      this.room.position.set(0, 0, -1);
    }
  }

  scale() {
    this.roomChildren.rectlight.width = 0;
    this.roomChildren.rectlight.height = 0;
    this.roomChildren.rectlight2.width = 0;
    this.roomChildren.rectlight2.height = 0;

    if (this.device === "desktop") {
      this.room.scale.set(0.11, 0.11, 0.11);
    } else {
      this.room.scale.set(0.07, 0.07, 0.07);
    }
  }

  update() {
    if (this.moveFlag) {
      this.move();
    }

    if (this.scaleFlag) {
      this.scale();
    }
  }
}
