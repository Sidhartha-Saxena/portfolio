import Experience from "./experience/Experience";
import "./style.css";

const experience=new Experience(document.querySelector(".experience-canvas"))

let cursorWin = document.getElementById("cursor");
let hoversection = document.querySelectorAll(".hover-section");
const imgfile = ["musicimg", "custimg", "javaprojectimg", "spaceimg","gitimg","linkedimg"];
hoversection.forEach((c) => {
  c.addEventListener("mousemove", cursoranim);
  c.addEventListener("mouseover", () => {
    cursorWin.style.visibility = "visible";
    imgfile.forEach((cl) => {
      if (cursorWin.classList.contains(cl)) {
        cursorWin.classList.remove(cl);
      }
    });
    if (c.id === "musicapp") {
      cursorWin.classList.add(imgfile[0]);
    }
    if (c.id === "cust") {
      cursorWin.classList.add(imgfile[1]);
    }
    if (c.id === "javaproject") {
      cursorWin.classList.add(imgfile[2]);
    }
    if (c.id === "spacesite") {
      cursorWin.classList.add(imgfile[3]);
    }
    if (c.id === "git") {
      cursorWin.classList.add(imgfile[4]);
    }
    if (c.id === "linkedin") {
      cursorWin.classList.add(imgfile[5]);
    }
  });
  c.addEventListener("mouseleave", () => {
    cursorWin.style.visibility = "hidden";
  });
});
function cursoranim(e) {
  cursorWin.style.top = e.pageY + "px";
  cursorWin.style.left = e.pageX + "px";
}
