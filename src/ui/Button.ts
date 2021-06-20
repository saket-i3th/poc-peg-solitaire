import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
export class Button extends Container {
    protected _bg: Sprite;

    public set enabled(value: boolean) {
        this.buttonMode = value;
        this.interactive = value;
        this._bg.alpha = value ? 1 : 0.5;
    }
    constructor(source: string) {
        super();

        this._bg = Sprite.from(source);
        this._bg.anchor.set(0.5);
        this.addChild(this._bg);
    }
}
