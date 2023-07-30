import { Line } from "./engine/basicObjects/line";
import { Text } from "./engine/basicObjects/text";
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

new FPSHelper(scene);

const axisXColor = 0xFFFFFF;
const axisYColor = 0xFFFFFF;

const line1 = new Line({ x: -1000, y: 0 }, { x: 1000, y: 0 }, 1, axisXColor, true);
const line2 = new Line({ x: 0, y: -1000 }, { x: 0, y: 1000 }, 1, axisYColor, true);
scene.add(line1);
scene.add(line2);
scene.add(new Text("0", { x: 10, y: 10 }, 10, 0xFFFFFF));


for (let i = -20; i <= 20; i++) {
    if (i === 0) continue;

    scene.add(new Text((i * 50).toString(), { y: i * 50 - 2, x: 20 }, 10, 0xFFFFFF));
    scene.add(new Line({ y: i * 50, x: -5 }, { y: i * 50, x: 5 }, 1, axisYColor, true));

    scene.add(new Text((i * 50).toString(), { x: i * 50, y: 10 }, 10, 0xFFFFFF));
    scene.add(new Line({ x: i * 50, y: -5 }, { x: i * 50, y: 5 }, 1, axisXColor, true));
}


scene.start();

scene.add(new MathFunction((x => Math.sin(0.02 * x) * 100), 0x33A5FF));
scene.add(new MathFunction((x => 1/(x - 50) * 5000), COLORS.BLUE));

scene.add(new MathFunction((x => 0.5 * -Math.sqrt(300 ** 2 - x ** 2) + 100), COLORS.LIGHTBLUE));
scene.add(new MathFunction((x => 0.5 * Math.sqrt(300 ** 2 - x ** 2) + 100), COLORS.LIGHTBLUE));

scene.add(new MathFunction(x => 3 * x ** 3, COLORS.RED));


// @ts-ignore
window.scene = scene;
// @ts-ignore
window.line1 = line1;
