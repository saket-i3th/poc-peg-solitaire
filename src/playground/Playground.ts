import { Text } from "@pixi/text";
import { ViewMetrics } from "./../constants/ViewMetrics";
import { Button } from "./../ui/Button";
import { Board } from "./Board";
import { Container } from "@pixi/display";

export class Playground extends Container {
    private _board: Board;
    private _btnPrev: Button;
    private _btnNext: Button;
    private _title: Text;
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
        this._btnNext = new Button("next.png");
        this._btnNext.x = ViewMetrics.landscapeWidth - 100;
        this._btnNext.y = ViewMetrics.landscapeHeight - 100;
        this.addChild(this._btnNext);
        this._btnNext.on("click", () => {
            this._board.nextLevel();
            this.updateButtons();
        });
        this._title = new Text("");
        this._title.x = 0;
        this._title.y = 50;
        this._title.anchor.set(0, 0.5);
        this.addChild(this._title);
        this.updateButtons();
    }

    private updateButtons(): void {
        this._title.text = this._board.boardType;
        this._btnPrev.enabled = !this._board.isFirstLevel;
        this._btnNext.enabled = !this._board.isLastLevel;
    }
}
