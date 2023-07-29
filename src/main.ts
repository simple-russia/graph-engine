import { Line } from "./engine/basicObjects/line";
import { CameraControls } from "./engine/helpers/cameraControls";
import { Scene } from "./engine/scene";

const root = document.querySelector("#root")!;
const scene = new Scene(root);

const line1 = new Line({ x: -150, y: 0 }, { x: 150, y: 0 });
scene.add(line1);

scene.add(new Line({ x: -150, y: -75 }, { x: 150, y: -75 }, 15));
scene.add(new Line({ x: -150, y: 75 }, { x: 150, y: 75 }));

scene.add(new Line({ x: 0, y: -150 }, { x: 0, y: 150 }));
scene.add(new Line({ x: -75, y: -150 }, { x: -75, y: 150 }, 10));
scene.add(new Line({ x: 75, y: -150 }, { x: 75, y: 150 }, 20));

scene.fps = 30;

const cameraControls = new CameraControls(scene);

scene.start();


// @ts-ignore
window.scene = scene;
// @ts-ignore
window.line1 = line1;
