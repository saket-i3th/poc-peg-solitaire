import { Sprite } from "@pixi/sprite";
import { Container } from "@pixi/display";
import { Rectangle } from "@pixi/math";

export class Peg extends Container {
    private _bg: Sprite;
    public theRow: number;
    public theCol: number;
    constructor() {
        super();
        this._bg = Sprite.from("peg.png");
        this.addChild(this._bg);
        this.hitArea = new Rectangle(0, 0, this._bg.width, this._bg.height);
        this.theRow = 0;
        this.theCol = 0;
        this.interactive = true;
        this.buttonMode = true;
    }
}
