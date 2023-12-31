import type { point2D } from "../types";
import { Scene } from "../scene/scene";
import { Object2D } from "./object2d";
import { color } from "../../utils/color";
import { BoundingBox } from "./types";
import { createPositionObservable } from "../../utils/observables/position";


interface ITextProps {
    text: string
    position: point2D
    fontSize: number
    color: number
    ignoreZoom: boolean
    opacity: number
    renderPriotiy: number
}

const TEXT_DEFAULT_OPTIONS: ITextProps = {
    color: 0x000000,
    fontSize: 30,
    ignoreZoom: false,
    opacity: 1,
    position: { x: 0, y: 0 },
    renderPriotiy: 1,
    text: "",
};

export class Text extends Object2D {
    public position: point2D;
    public color: number;
    public fontSize: number;
    public text: string;
    public ignoreZoom: boolean;
    public opacity: number;


    constructor(options: Partial<ITextProps> = {}) {
        options = { ...TEXT_DEFAULT_OPTIONS, ...options };

        super();
        this.color = options.color;
        this.position = options.position;

        this.position = createPositionObservable({ x: options.position.x, y: options.position.y });

        this.fontSize = options.fontSize;
        this.text = options.text;
        this.ignoreZoom = options.ignoreZoom;
        this.renderPriority = options.renderPriotiy;
        this.opacity = options.opacity;
    }


    getBoundingBox(): BoundingBox {
        return null;
    }

    render (scene: Scene) {
        const ctx = scene.canvas.getContext("2d");
        const camera = scene.camera;

        const fontSize = this.fontSize / (this.ignoreZoom ? 1 : camera.zoom);

        ctx.fillStyle = color(this.color, this.opacity);
        ctx.font = `${fontSize}px Arial`;
        ctx.lineWidth = 1;

        const textPos = { ...this.position };

        textPos.y *= -1;

        textPos.x = textPos.x * 1 / camera.zoom;
        textPos.y = textPos.y * 1 / camera.zoom;

        textPos.x += scene.width / 2;
        textPos.y += scene.height / 2;

        textPos.x += -scene.camera.position.x * 1 / camera.zoom;
        textPos.y += scene.camera.position.y * 1 / camera.zoom;

        ctx.fillText(this.text, textPos.x, textPos.y);
    }
}
