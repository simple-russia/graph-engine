import { myCustomButtonsHelper } from "./buttons";
import { Line } from "./engine/basicObjects/line";
import { Text } from "./engine/basicObjects/text";
import { AxesHelper } from "./engine/helpers/axesHelper";
import { CameraControls } from "./engine/helpers/cameraControls";
import { FPSHelper } from "./engine/helpers/fpsHelper";
import { MathFunction } from "./engine/objectLibrary/function";
import { Scene } from "./engine/scene";
import { COLORS } from "./utils/colors";

// Creation and basic configuratiob
const root = document.querySelector("#root")!;
const scene = new Scene(root);
scene.fps = 60;
scene.bgColor = 0x000000;

// Camera controls
const cameraControls = new CameraControls(scene);
cameraControls.eventHandler.subscribe("dragStart", () => root.classList.add("dragging"));
cameraControls.eventHandler.subscribe("dragEnd", () => root.classList.remove("dragging"));

// Helpers
scene.add(new AxesHelper());
new FPSHelper(scene);
myCustomButtonsHelper(scene, cameraControls);

// Start scene
scene.start();

// Functions
scene.add(new MathFunction((x => Math.sqrt((100) ** 2 - (x) ** 2)), 0x2222DD));
scene.add(new MathFunction((x => -x / Math.sqrt(100**2 - x**2)), 0xDD2222));
scene.add(new MathFunction((x => -1 * x ** 2), 0x22BB22));

// Fun texts
scene.add(new Text("Made by Danya (simple.alex)", { x: 100, y: 200 }, 16, COLORS.RED));
scene.add(new Text("Press Button -z", { x: 100, y: 170 }, 24, COLORS.ORANGE));

scene.add(new Text("Earth", { x: 80, y: 100 }, 30, COLORS.WHITE));
scene.add(new Text("12,742 km", { x: 80, y: 70 }, 30, COLORS.BLUE));

scene.add(new Text("The moon", { x: 10, y: 25 }, 7.8, COLORS.WHITE));
scene.add(new Text("3,478 km", { x: 10, y: 25 - 7.8 }, 7.8, COLORS.BLUE));

scene.add(new Text("Eiffel Tower", { x: 2, y: 4.5 }, 2, COLORS.WHITE));
scene.add(new Text("300m", { x: 2, y: 4.5 - 2 }, 2, COLORS.BLUE));

scene.add(new Text("Michael Jordan", { x: 0.2, y: 0.4 }, .2, COLORS.WHITE));
scene.add(new Text("1.98m", { x: 0.2, y: 0.4 - .2 }, 0.2, COLORS.BLUE));

scene.add(new Text("The average cat", { x: 0.04, y: 0.1 }, .05, COLORS.WHITE));
scene.add(new Text("25cm", { x: 0.04, y: 0.1 - .05 }, .05, COLORS.BLUE));

scene.add(new Text("Адекватность верстальщиков", { x: 0.01, y: 0.01 }, .002, COLORS.WHITE));
scene.add(new Text("2.5cm", { x: 0.01, y: 0.01 - .002 }, .002, COLORS.BLUE));

scene.add(new Text("Now press HA to get back:)", { x: 0.01, y: -0.01 }, .002, COLORS.ORANGE));


// About
scene.add(new Line({ x: -450, y: 320 }, { x: -90, y: 320 }, { color: COLORS.GREEN }));
scene.add(new Line({ x: -90, y: 320 }, { x: -90, y: 70 }, { color: COLORS.GREEN }));
scene.add(new Line({ x: -90, y: 70 }, { x: -450, y: 70 }, { color: COLORS.GREEN }));
scene.add(new Line({ x: -450, y: 70 }, { x: -450, y: 320 }, { color: COLORS.GREEN }));

scene.add(new Text("danya.js", { x: -440, y: 300 }, 20, COLORS.YELLOW));
scene.add(new Text("Hey there! This is Danya's new", { x: -440, y: 275 }, 20, COLORS.WHITE));
scene.add(new Text("project revolving around HTML5", { x: -440, y: 250 }, 20, COLORS.WHITE));
scene.add(new Text("canvas and custom 2D engine. In the", { x: -440, y: 225 }, 20, COLORS.WHITE));
scene.add(new Text("near future i plan to implement a lot", { x: -440, y: 200 }, 20, COLORS.WHITE));
scene.add(new Text("of cool projects based on this engine", { x: -440, y: 175 }, 20, COLORS.WHITE));
scene.add(new Text("as well as add new features and", { x: -440, y: 150 }, 20, COLORS.WHITE));
scene.add(new Text("perfomance optimizations. You can", { x: -440, y: 125 }, 20, COLORS.WHITE));
scene.add(new Text("the source code here below:", { x: -440, y: 100 }, 20, COLORS.WHITE));
scene.add(new Text("https://github.com/simple...", { x: -440, y: 75 }, 20, 0x5555FF));

const changingText = new Text("", { x: -400, y: 35 }, 20, COLORS.WHITE);
const percents = new Text("", { x: -450, y: 35 }, 20, COLORS.WHITE);
scene.add(changingText);
scene.add(percents);

const phrases = ["3", "2", "1", "New", "framework", "for", "doing", "cool", "things"];
const percentsArr: string[] = [];
for (let i = 0; i < 5; i++) {
    phrases.unshift("Loading...");
    phrases.unshift("Loading..");
    phrases.unshift("Loading.");
    phrases.unshift("Loading");
}

for (let i = 101; i > -1; i-=2) {
    percentsArr.unshift(i.toString() + "%");
}

let i = 0;
setInterval(() => {
    changingText.text = phrases[i];
    changingText.color = changingText.text === "cool" ? COLORS.RED : COLORS.WHITE;
    i++; i%=phrases.length;
}, 200);
let j = 0;
setInterval(() => {
    percents.text = percentsArr[j];
    const R = Math.floor(0xFF * ((50 - j) / 50));
    const Rstr = R.toString(16).padStart(2, "0");
    percents.color = Number(`0xFF${Rstr}${Rstr}`);
    j++; j%=phrases.length;
}, 100);

// @ts-ignore
window.scene = scene;
