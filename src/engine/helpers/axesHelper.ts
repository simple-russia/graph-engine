import { COLORS } from "../../utils/colors";
import { restrictNumber } from "../../utils/restrictNumber";
import { Line } from "../basicObjects/line";
import { Object2D } from "../basicObjects/object2d";
import { Text } from "../basicObjects/text";
import { Scene } from "../scene";


const yLabelOffset = 10;
const xLabelOffset = 10;

const maxXSteps = 15;
const minXSteps = 7;

const secondaryGridAdditionalOpacity = 0.8;

const log = (() => {
    let lastVal = 0;

    return function (val: any) {
        if (val === lastVal) return ;
        lastVal = val;
        console.log(val);
    };
})();

type LabelStep = number;
type SecondaryGridStep = number;
type SecondaryGridOpacity = number;

const getClosestPrettyStep = (width: number): [LabelStep, SecondaryGridStep, SecondaryGridOpacity] => {
    const maxDecimalStep = width / minXSteps;

    const power10 = Math.floor(Math.log10(maxDecimalStep));
    const closest1 = 10 ** power10 * 1;


    if (width / closest1 > maxXSteps) {
        const steps = width / closest1;
        const a = (steps - maxXSteps) / (minXSteps * 10 - maxXSteps);
        const opacity = 1 - restrictNumber(a, 0, 1);

        return [closest1 * 5, closest1, opacity];
    }

    const steps = width / closest1;
    const overflow = steps - minXSteps;
    const a1 = 1 - overflow / steps;
    const a2 = 1 - minXSteps / maxXSteps - overflow / steps;
    const opacity = restrictNumber(a1 - 0.5 + a2, 0, 1);

    return [closest1, closest1 / 2, opacity];
};


const isZero = (n: number) => {
    const EPSILON = 0.1 ** 8;
    return Math.abs(0 - n) < EPSILON;
};


export class AxesHelper extends Object2D {
    private xAxis: Line;
    private yAxis: Line;

    private xLabels: Text[];
    private yLabels: Text[];

    private gridVerticalLines: Line[];
    private gridHorizontalLines: Line[];

    private gridSecondaryVerticalLines: Line[];
    private gridSecondaryHorizontalLines: Line[];

    public renderPriority: number = -1;


    constructor () {
        super();

        this.xAxis = new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: COLORS.WHITE, opacity: 0.5 });
        this.yAxis = new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: COLORS.WHITE, opacity: 1 });

        this.xLabels = Array(maxXSteps).fill(null).map(() => new Text("", { x: 50, y: 10 }, 15, COLORS.WHITE, true));
        this.yLabels = Array(maxXSteps).fill(null).map(() => new Text("", { x: 10, y: 50 }, 15, COLORS.WHITE, true));

        this.gridVerticalLines = Array(maxXSteps).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: 0x333333 }));
        this.gridHorizontalLines = Array(maxXSteps).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: 0x333333 }));

        this.gridSecondaryVerticalLines = Array(maxXSteps * 5).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: 0x333333 }));
        this.gridSecondaryHorizontalLines = Array(maxXSteps * 5).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, { ignoreZoom: true, color: 0x333333 }));
    }


    public onAddedToScene(scene: Scene): void {
        this.gridHorizontalLines.forEach(line => scene.add(line));
        this.gridVerticalLines.forEach(line => scene.add(line));
        this.gridSecondaryHorizontalLines.forEach(line => scene.add(line));
        this.gridSecondaryVerticalLines.forEach(line => scene.add(line));
        scene.add(this.xAxis);
        scene.add(this.yAxis);
        this.yLabels.forEach(label => scene.add(label));
        this.xLabels.forEach(label => scene.add(label));
    }

    public hideLabelsAndGrid () {
        this.xLabels.forEach(label => {
            label.text = "";
        });
        this.yLabels.forEach(label => {
            label.text = "";
        });

        for (const grid of [this.gridVerticalLines, this.gridSecondaryHorizontalLines, this.gridSecondaryVerticalLines, this.gridHorizontalLines]) {
            grid.forEach(axis => {
                axis.point1.y = 0;
                axis.point1.x = 0;
                axis.point2.y = 0;
                axis.point2.x = 0;
            });
        }
    }


    render (scene: Scene) {
        // First hide all the axes and labels, then compute them again.
        this.hideLabelsAndGrid();

        const bounds = scene.camera.getVisibleBoundaries(scene);

        const width = bounds.rightBoundary - bounds.leftBoundary;
        // const height = bounds.topBoundary - bounds.bottomBoundary;

        // Axes points
        this.xAxis.point1.x = bounds.leftBoundary;
        this.xAxis.point2.x = bounds.rightBoundary;
        this.yAxis.point1.y = bounds.topBoundary;
        this.yAxis.point2.y = bounds.bottomBoundary;

        // What step to use for labels
        const [step, secondaryStep, secondaryOpacity] = getClosestPrettyStep(width);

        // How many decimals to show on labels
        let showDecimalNumbers = -Math.floor(Math.log10(step));
        showDecimalNumbers = showDecimalNumbers < 0 ? 0 : showDecimalNumbers;


        //  Going through all x's
        const xStart = (Math.floor(bounds.leftBoundary / step)) * step;
        let i_1: number;

        for (i_1 = 0; i_1 < maxXSteps; i_1++) {
            const x = xStart + i_1 * step;
            const label = this.xLabels[i_1];

            if (isZero(x)) {
                // Draw zero
                label.position.x = x;
                label.position.y = yLabelOffset * scene.camera.zoom;
                continue;
            };

            // Change the label
            label.position.x = x;
            label.position.y = yLabelOffset * scene.camera.zoom;
            label.text = x.toFixed(showDecimalNumbers);

            // Add a vertical line
            const verticalLine = this.gridVerticalLines[i_1];
            verticalLine.point1.y = bounds.bottomBoundary;
            verticalLine.point2.y = bounds.topBoundary;
            verticalLine.point1.x = label.position.x;
            verticalLine.point2.x = label.position.x;
        }

        let i_2: number;

        for (i_2 = 0; i_2 < maxXSteps * 5; i_2++) {
            const x = xStart + i_2 * secondaryStep;

            const verticalSecondaryLine = this.gridSecondaryVerticalLines[i_2];
            verticalSecondaryLine.point1.y = bounds.bottomBoundary;
            verticalSecondaryLine.point2.y = bounds.topBoundary;
            verticalSecondaryLine.point1.x = x;
            verticalSecondaryLine.point2.x = x;
            verticalSecondaryLine.opacity = secondaryOpacity * secondaryGridAdditionalOpacity;
        }

        // Going through all y's
        const yStart = (Math.floor(bounds.bottomBoundary / step)) * step;
        let j: number;

        for (j = 0; j < maxXSteps; j++) {
            const y = yStart + j * step;
            const label = this.yLabels[j];

            if (isZero(y)) {
                continue;
            };

            // Change the label
            label.position.y = y;
            label.position.x = xLabelOffset * scene.camera.zoom;
            label.text = y.toFixed(showDecimalNumbers);

            // Add a vertical line
            const horizontal = this.gridHorizontalLines[j];
            horizontal.point1.y = label.position.y;
            horizontal.point2.y = label.position.y;
            horizontal.point1.x = bounds.leftBoundary;
            horizontal.point2.x = bounds.rightBoundary;
        }


        let j_2: number;

        for (j_2 = 0; j_2 < maxXSteps * 5; j_2++) {
            const y = yStart + j_2 * secondaryStep;

            const horizontalVerticalLine = this.gridSecondaryHorizontalLines[j_2];

            horizontalVerticalLine.point1.y = y;
            horizontalVerticalLine.point2.y = y;
            horizontalVerticalLine.point1.x = bounds.leftBoundary;
            horizontalVerticalLine.point2.x = bounds.rightBoundary;
            horizontalVerticalLine.opacity = secondaryOpacity * secondaryGridAdditionalOpacity;
        }
    }
}
