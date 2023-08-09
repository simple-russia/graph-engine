import { Scene } from "../scene";

const HELPER_ELEMENT_ID = "fps-helper-display-table";

export class FPSHelper {
    private fpsBlock: HTMLDivElement;
    private currentFPS: HTMLDivElement;
    private maxFPS: HTMLDivElement;


    constructor (scene: Scene) {
        const fpsBlock = document.createElement("div");
        this.fpsBlock = fpsBlock;
        fpsBlock.setAttribute("style", "position: absolute; font-size: 14px; top: 0px; left: 2px; font-family: monospace; color: #00FF00; user-select: none");
        fpsBlock.id = HELPER_ELEMENT_ID;

        const currentFPS = document.createElement("div");
        this.currentFPS = currentFPS;

        const maxFPS = document.createElement("div");
        this.maxFPS = maxFPS;

        fpsBlock.appendChild(currentFPS);
        fpsBlock.appendChild(maxFPS);

        scene.canvas.parentElement.appendChild(fpsBlock);


        scene.eventHandler.subscribe("fpsUpdate", this.updateFPS.bind(this, scene));

        this.updateFPS(scene, 0);
    }

    updateFPS (scene: Scene, fps: number) {
        this.currentFPS.innerText = `FPS: ${fps}`;
        this.maxFPS.innerText = `MAX: ${scene.fps}`;
    }
}
