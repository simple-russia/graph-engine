import { Line } from "./engine/basicObjects/line";
import { Text } from "./engine/basicObjects/text";
import { AxesHelper } from "./engine/helpers/axesHelper";
import { CameraControls } from "./engine/helpers/cameraControls";
import { FPSHelper } from "./engine/helpers/fpsHelper";
import { MathFunction } from "./engine/objectLibrary/function";
import { Scene } from "./engine/scene";
import { COLORS } from "./utils/colors";

const root = document.querySelector("#root")!;

const scene = new Scene(root);
scene.fps = 50;
scene.bgColor = 0x000000;

const cameraControls = new CameraControls(scene);
cameraControls.eventHandler.subscribe("dragStart", () => root.classList.add("dragging"));
cameraControls.eventHandler.subscribe("dragEnd", () => root.classList.remove("dragging"));

scene.add(new AxesHelper());
new FPSHelper(scene);

scene.start();

// scene.add(new MathFunction((x => x + Math.sin(0.02 * x) * 100), 0x33A5FF));
// scene.add(new MathFunction((x => 20 + 1/(x - 50) * 5000), COLORS.BLUE));

// scene.add(new MathFunction((x => 0.5 * -Math.sqrt(300 ** 2 - x ** 2) + 100), COLORS.LIGHTBLUE));
// scene.add(new MathFunction((x => 0.5 * Math.sqrt(300 ** 2 - x ** 2) + 100), COLORS.LIGHTBLUE));

// scene.add(new MathFunction(x => x ** 3, COLORS.RED));
// scene.add(new MathFunction(x => 1, COLORS.BLUE));

const maxX = 1000;
const minX = 100;
const minY = 10;
const maxY = 1000;
const lines = 5000;

for (let i = 0; i < lines; i++) {
    // scene.add(new MathFunction((x => Math.sqrt(300 ** 2 - (x + i * 5) ** 2) + 10 * i), COLORS.LIGHTBLUE));
    // scene.add(new MathFunction((x => x + i * 10 + Math.sin(0.02 * x) * 100), 0x33A5FF));
    const x1 = Math.floor(minX + Math.random() * (maxX - minX));
    const y1 = Math.floor(minX + Math.random() * (maxX - minX));
    const x2 = Math.floor(minY + Math.random() * (maxY - minY));
    const y2 = Math.floor(minY + Math.random() * (maxY - minY));
    scene.add(new Line({ x: x1, y: y1 }, { x: x2, y: y2 }, 1, Math.floor(0xFFFFFF * Math.random()), false));
}

// @ts-ignore
window.scene = scene;
