import { ButtonsHelper } from "./engine/helpers/buttonsHelper";
import { CameraControls } from "./engine/helpers/cameraControls";
import { Scene } from "./engine/scene/scene";


export const myCustomButtonsHelper = (scene: Scene, cameraControls: CameraControls) => {
    const buttonsHelper = new ButtonsHelper(scene);

    buttonsHelper.addButton("+", () => scene.camera.zoomIn(0.8));
    buttonsHelper.addButton("-", () => scene.camera.zoomOut(0.8));
    buttonsHelper.addButton("H", () => {
        scene.camera.position = { x: 0, y: 0 };
        scene.camera.zoom = 1;
    });

    buttonsHelper.addButton("HA", () => {
        let intervalId: number;
        const duration = 300;
        const steps = Math.floor(duration / 10) + 1;

        const xStep = (0 - scene.camera.position.x) / steps;
        const yStep = (0 - scene.camera.position.y) / steps;
        const zStep = (1 - scene.camera.zoom) / steps;

        let i = 0;

        intervalId = window.setInterval(() => {
            if (i >= steps) {
                clearInterval(intervalId);
                return;
            }

            scene.camera.position.x += xStep;
            scene.camera.position.y += yStep;
            scene.camera.zoom += zStep;

            i++;
        }, duration / steps);

        cameraControls.eventHandler.subscribe("zoomIn", () => clearInterval(intervalId));
        cameraControls.eventHandler.subscribe("zoomOut", () => clearInterval(intervalId));
        cameraControls.eventHandler.subscribe("drag", () => clearInterval(intervalId));
    });

    buttonsHelper.addButton("z-", () => {
        let intervalId: number;
        const stepDuration = 20;
        const zoomTo = 0.0001;

        intervalId = window.setInterval(() => {
            if (scene.camera.zoom > zoomTo) {
                scene.camera.zoomIn(0.99);
            } else {
                clearInterval(intervalId);
            }
        }, stepDuration);

        cameraControls.eventHandler.subscribe("zoomIn", () => clearInterval(intervalId));
        cameraControls.eventHandler.subscribe("zoomOut", () => clearInterval(intervalId));
        cameraControls.eventHandler.subscribe("drag", () => clearInterval(intervalId));
    });

    return buttonsHelper;
};
