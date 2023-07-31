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
scene.fps = 30;
scene.bgColor = 0x000000;

const cameraControls = new CameraControls(scene);
cameraControls.eventHandler.subscribe("dragStart", () => root.classList.add("dragging"));
cameraControls.eventHandler.subscribe("dragEnd", () => root.classList.remove("dragging"));

scene.add(new AxesHelper());
new FPSHelper(scene);

scene.start();


const maxR = 200;
const cirles = 4;
const fillTime = 10;
const stepTime = 10;

const makeCircle = (r: number) => {

    const color = 0xAA77DD;
    const h1 = new MathFunction((x => Math.sqrt((r) ** 2 - (x) ** 2)), color);
    const h2 = new MathFunction((x => -Math.sqrt((r) ** 2 - (x) ** 2)), color);

    return [h1, h2];
};


scene.add(new MathFunction((x => Math.sqrt((100) ** 2 - (x) ** 2)), COLORS.BLUE));
scene.add(new MathFunction((x => -x / Math.sqrt(100**2 - x**2)), COLORS.RED));
scene.add(new MathFunction((x => -1 * x ** 2), COLORS.GREEN));


// @ts-ignore
window.scene = scene;
