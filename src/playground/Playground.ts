import { ViewMetrics } from "./../constants/ViewMetrics";
import { Button } from "./../ui/Button";
import { Board } from "./Board";
import { Container } from "@pixi/display";

export class Playground extends Container {
    private _board: Board;
    private _btnPrev: Button;
    private _btnNext: Button;
    constructor() {
        super();

        this._board = new Board();
        this.addChild(this._board);
        this._btnPrev = new Button("previous.png");
        this._btnPrev.x = 100;
        this._btnPrev.y = ViewMetrics.landscapeHeight - 100;
        this.addChild(this._btnPrev);
        this._btnPrev.on("click", () => {
            this._board.previousLevel();
            this.updateButtons();
        });
        this._btnPrev.on("tap", () => {
            this._board.previousLevel();
            this.updateButtons();
        });
        this._btnNext = new Button("next.png");
        this._btnNext.x = ViewMetrics.landscapeWidth - 100;
        this._btnNext.y = ViewMetrics.landscapeHeight - 100;
        this.addChild(this._btnNext);
        this._btnNext.on("click", () => {
            this._board.nextLevel();
            this.updateButtons();
        });
        this._btnNext.on("tap", () => {
            this._board.nextLevel();
            this.updateButtons();
        });
        this.updateButtons();
    }

    private updateButtons(): void {
        this._btnPrev.enabled = !this._board.isFirstLevel;
        this._btnNext.enabled = !this._board.isLastLevel;
    }
}
