import * as PIXI from "pixi.js";
import { Point } from "@pixi/math";

export class ViewMetrics {
    public static get landscapeWidth(): number {
        return 600;
    }

    public static get landscapeHeight(): number {
        return 600;
    }

    private static _centre: Point;

    public static get CENTER_POINT(): Point {
        if (!this._centre) {
            this._centre = new Point(300, 300);
        }
        return this._centre;
    }

    public static stage: PIXI.Container;
    public static scale: number;
}
