import { myCustomButtonsHelper } from "./buttons";
import { StraightLine } from "./package/engine/objectLibrary/straightLine";
import { Text } from "./package/engine/basicObjects/text";
import { AxesHelper } from "./package/engine/helpers/axesHelper";
import { CameraControls } from "./package/engine/helpers/cameraControls";
import { FPSHelper } from "./package/engine/helpers/fpsHelper";
import { Circle } from "./package/engine/objectLibrary/circle";
import { MathFunction } from "./package/engine/objectLibrary/function";
import { Square } from "./package/engine/objectLibrary/square";
import { Scene } from "./package/engine/scene/scene";
import { COLORS } from "./package/utils/colors";

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
scene.add(new MathFunction((x => Math.sin(x * 0.05) * 100), 0x2222DD));
scene.add(new MathFunction((x => -x / Math.sqrt(100**2 - x**2)), 0xDD2222));
scene.add(new MathFunction((x => -1 * x ** 2), 0x22BB22));


scene.add(new Square({ bgColor: COLORS.WHITE, height: 20, width: 100, position: { x: 110, y: -60 } }));
scene.add(new Square({ bgColor: COLORS.BLUE, height: 20, width: 100, position: { x: 110, y: -80 } }));
scene.add(new Square({ bgColor: COLORS.RED, height: 20, width: 100, position: { x: 110, y: -100 } }));


// scene.add(new Text("Testing zIndex", { x: -160, y: -30 }, 30, COLORS.WHITE));
scene.add(new Text({ text: "Testing z-index", position: { x: -160, y: -30 }, color: COLORS.WHITE }));

const red_sq = new Square({ bgColor: COLORS.RED, height: 50, width: 60, position: { x: -100, y: -70 }, zIndex: 50 });
const green_sq = new Square({ bgColor: COLORS.GREEN, height: 50, width: 60, position: { x: -100, y: -90 }, zIndex: 53 });
const blue_sq = new Square({ bgColor: COLORS.BLUE, height: 50, width: 60, position: { x: -100, y: -110 }, zIndex: 56 });
const yellow_sq = new Square({ bgColor: COLORS.YELLOW, height: 90, width: 60, position: { x: -140, y: -100 }, zIndex: 59 });

scene.add(green_sq);
scene.add(red_sq);
scene.add(blue_sq);
scene.add(yellow_sq);

function zIndexTest () {
    setTimeout(() => yellow_sq.renderPriority = 55, 1000);
    setTimeout(() => yellow_sq.renderPriority = 52, 2000);
    setTimeout(() => yellow_sq.renderPriority = 49, 3000);
    setTimeout(() => yellow_sq.renderPriority = 59, 4000);
    setTimeout(() => zIndexTest(), 4000);
}
zIndexTest();

scene.add(new Circle({ bgColor: 0x990099, position: { x: -250, y: -250 }, radius: 50 }));


for (let i = 0; i < 10_000; i++) {
    const pos = {
        x: 100 + Math.random() * 44900,
        y: 100 + Math.random() * 44900,
    };
    const size = Math.random()* 70 + 10;
    scene.add(new Square({ bgColor: Math.floor(0xFFFFFF * Math.random()), height: size, width: size, lineWidth: 4, position: pos, strokeColor: 0xFF0000 }));
}

for (let i = 0; i < 3_000; i++) {
    const pos = {
        x: 1000 + Math.random() * 1244900,
        y: 100 + Math.random() * 1244900,
    };
    scene.add(new Square({ bgColor: Math.floor(0xFFFFFF * Math.random()), height: Math.random() * 1700 + 1000, width: Math.random() * 2100 + 1000, lineWidth: 24, position: pos, strokeColor: 0xFF0000 }));
}

for (let i = 0; i < 300; i++) {
    const pos = {
        x: 10000 + Math.random() * 1244900,
        y: 10000 + Math.random() * 1244900,
    };
    scene.add(new Square({ bgColor: Math.floor(0xFFFFFF * Math.random()), height: Math.random() * 25000 + 4000, width: Math.random() * 25000 + 4000, lineWidth: 240, position: pos, strokeColor: 0xFF0000 }));
}


// @ts-ignore
window.scene = scene;
