import { Scene } from "../../scene/scene";
import "./buttonsHelper.scss";

const HELPER_ELEMENT_ID = "buttonsHelper-helper-display-table";
type ButtonIcon = string;

export class ButtonsHelper {
    private buttonsHelperContainer: HTMLDivElement;
    private buttons: Record<ButtonIcon, {
        callback: (e: MouseEvent) => void
        htmlElement: HTMLButtonElement
    }>;


    constructor (scene: Scene) {
        const buttonsContainer = document.createElement("div");

        this.buttonsHelperContainer = buttonsContainer;
        // buttonsContainer.setAttribute("style", " ",);
        buttonsContainer.id = HELPER_ELEMENT_ID;
        buttonsContainer.classList.add("buttonHelper__buttonContainer");

        this.buttons = {};

        scene.canvas.parentElement.appendChild(buttonsContainer);
    }


    public addButton (icon: string, callback: (e: MouseEvent) => void) {
        const button = document.createElement("button");
        button.addEventListener("click", callback);
        button.innerText = icon;
        button.classList.add("buttonHelper__buttonContainer_button");

        this.buttons[icon] = {
            callback,
            htmlElement: button,
        };

        this.buttonsHelperContainer.appendChild(this.buttons[icon].htmlElement);
    }
}
