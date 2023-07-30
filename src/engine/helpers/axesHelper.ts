import { COLORS } from "../../utils/colors";
import { Line } from "../basicObjects/line";
import { Object2D } from "../basicObjects/object2d";
import { Text } from "../basicObjects/text";
import { Scene } from "../scene";

const axesOffset = 20;
const showXNumbers = 15;
const showYNumbers = 15;

const yLabelOffset = 10;
const xLabelOffset = 10;

export class AxesHelper extends Object2D {
    private xAxis: Line;
    private yAxis: Line;

    private xLabels: Text[];
    private yLabels: Text[];

    private gridVerticalLines: Line[];
    private gridHorizontalLines: Line[];

    public renderPriority: number = -1;

    constructor () {
        super();

        this.xAxis = new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, COLORS.WHITE, true);
        this.yAxis = new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, COLORS.WHITE, true);

        this.xLabels = Array(showXNumbers).fill(null).map(() => new Text("", { x: 50, y: 10 }, 15, COLORS.WHITE, true));
        this.yLabels = Array(showYNumbers).fill(null).map(() => new Text("", { x: 10, y: 50 }, 15, COLORS.WHITE, true));

        this.gridVerticalLines = Array(showXNumbers).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 0x333333, true));
        this.gridHorizontalLines = Array(showYNumbers).fill(null).map(() => new Line({ x: 0, y: 0 }, { x: 0, y: 0 }, 1, 0x333333, true));
    }

    render (scene: Scene) {
        this.gridHorizontalLines.forEach(line => scene.add(line));
        this.gridVerticalLines.forEach(line => scene.add(line));
        scene.add(this.xAxis);
        scene.add(this.yAxis);
        this.yLabels.forEach(label => scene.add(label));
        this.xLabels.forEach(label => scene.add(label));

        let centerX = scene.camera.position.x;
        let centerY = scene.camera.position.y;

        const leftBoundary = centerX - (scene.width / 2 - axesOffset) * scene.camera.zoom;
        const rightBoundary = centerX + (scene.width / 2 - axesOffset) * scene.camera.zoom;
        const topBoundary = centerY + (scene.height / 2 - axesOffset) * scene.camera.zoom;
        const bottomBoundary = centerY - (scene.height / 2 - axesOffset) * scene.camera.zoom;

        const width = rightBoundary - leftBoundary;
        const height = topBoundary - bottomBoundary;

        this.xAxis.point1.x = leftBoundary;
        this.xAxis.point2.x = rightBoundary;
        this.yAxis.point1.y = topBoundary;
        this.yAxis.point2.y = bottomBoundary;

        const xLabelStep = width / showXNumbers;

        let currentXPosition = Math.floor(leftBoundary / xLabelStep) * xLabelStep + xLabelStep;
        let i = 0;

        let showDecimalNumbers = -Math.floor(Math.log10(xLabelStep));
        if (showDecimalNumbers < 0) {
            showDecimalNumbers = 0;
        }

        while (currentXPosition < rightBoundary) {
            const label = this.xLabels[i];

            if (label === undefined) break;

            const isZeroX = Math.abs(currentXPosition) < 0.1 ** 8;

            if (isZeroX) {
                label.position.x = currentXPosition + xLabelOffset * scene.camera.zoom;
                label.position.y = yLabelOffset * scene.camera.zoom;

                label.text = "0";
            } else {
                label.position.x = currentXPosition;
                label.position.y = yLabelOffset * scene.camera.zoom;

                label.text = currentXPosition.toFixed(showDecimalNumbers);
            }

            if (!isZeroX) {
                const verticalLine = this.gridVerticalLines[i];
                verticalLine.point1.y = bottomBoundary;
                verticalLine.point2.y = topBoundary;
                verticalLine.point1.x = label.position.x;
                verticalLine.point2.x = label.position.x;
            }

            i++;
            currentXPosition += xLabelStep;
        }

        const yLabelStep = height / showYNumbers;

        let currentYPosition = Math.floor(bottomBoundary / yLabelStep) * yLabelStep + yLabelStep;
        let j = 0;

        while (currentYPosition < topBoundary) {
            const label = this.yLabels[j];

            if (label === undefined) continue;

            const isZeroY = Math.abs(currentYPosition) < 0.1 ** 8;

            if (isZeroY) {
                label.text = "";
            } else {
                label.position.y = currentYPosition;
                label.position.x = xLabelOffset * scene.camera.zoom;

                label.text = currentYPosition.toFixed(showDecimalNumbers);
            }

            const horizontalLine = this.gridHorizontalLines[j];
            if (!isZeroY) {
                horizontalLine.point1.y = label.position.y;
                horizontalLine.point2.y = label.position.y;
                horizontalLine.point1.x = leftBoundary;
                horizontalLine.point2.x = rightBoundary;
            } else {
                horizontalLine.point1.y = 0;
                horizontalLine.point2.y = 0;
                horizontalLine.point1.x = 0;
                horizontalLine.point2.x = 0;
            }

            j++;
            currentYPosition += yLabelStep;
        }
    }
}
