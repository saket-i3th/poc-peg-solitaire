import { BoardTypes } from "./../constants/BoardTypes";
import { Peg } from "./board/Peg";
import { BoardConfig } from "./../configs/BoardConfig";
import { Container } from "@pixi/display";
import { Sprite } from "@pixi/sprite";
import { ViewMetrics } from "../constants/ViewMetrics";
import { InteractionEvent } from "@pixi/interaction";
import { Point } from "@pixi/math";

export class Board extends Container {
    private _boardTypes: BoardTypes[] = [
        BoardTypes.DIAMOND_32,
        BoardTypes.DIAMOND_37,
        BoardTypes.DIAMOND_39,
        BoardTypes.DIAMOND_41,
        BoardTypes.FRENCH,
        BoardTypes.SIX_X_SIX,
        BoardTypes.STANDARD,
    ];
    private fieldArray: number[][] = [];
    private pickedPeg: Peg | null = null;
    private squareContainer: Container;
    private moveContainer: Container;
    private pegContainer: Container;
    private localX = 0;
    private localY = 0;
    private oldX = 0;
    private oldY = 0;
    private possibleLandings: Point[] = [];
    private _levelIndex: number;
    public get isFirstLevel(): boolean {
        return this._levelIndex === 0;
    }
    public get isLastLevel(): boolean {
        return this._levelIndex === this._boardTypes.length - 1;
    }
    public get boardType(): string {
        return this._boardTypes[this._levelIndex];
    }
    constructor() {
        super();
        this.squareContainer = new Container();
        this.addChild(this.squareContainer);
        this.moveContainer = new Container();
        this.addChild(this.moveContainer);
        this.pegContainer = new Container();
        this.addChild(this.pegContainer);
        this._levelIndex = Math.floor(Math.random() * this._boardTypes.length);
        const boardType: string = this._boardTypes[this._levelIndex];
        this.setupLevel(boardType);
    }

    public nextLevel(): void {
        this.resetLevel();
        this._levelIndex++;
        const boardType: string = this._boardTypes[this._levelIndex];
        this.setupLevel(boardType);
    }

    public previousLevel(): void {
        this.resetLevel();
        this._levelIndex--;
        const boardType: string = this._boardTypes[this._levelIndex];
        this.setupLevel(boardType);
    }

    private resetLevel(): void {
        this.squareContainer.removeChildren();
        this.pegContainer.removeChildren();
        this.moveContainer.removeChildren();
    }

    private setupLevel(boardType: string): void {
        this.fieldArray = BoardConfig.getBoardConfigData(boardType);
        let square: Sprite;
        let peg: Peg;
        for (let i = 0; i < this.fieldArray.length; i++) {
            for (let j = 0; j < this.fieldArray[i].length; j++) {
                if (this.fieldArray[i][j] != -1) {
                    square = Sprite.from("square.png");
                    this.squareContainer.addChild(square);
                    square.x = j * 60;
                    square.y = i * 60;
                }
                if (this.fieldArray[i][j] == 1) {
                    peg = new Peg();
                    this.pegContainer.addChild(peg);
                    peg.x = j * 60;
                    peg.y = i * 60;
                    peg.theRow = i;
                    peg.theCol = j;
                    peg.on("pointerdown", (e) => {
                        this.pickPeg(e);
                    });
                }
                this.squareContainer.x = (ViewMetrics.landscapeWidth - this.squareContainer.width) / 2;
                this.squareContainer.y = (ViewMetrics.landscapeHeight - this.squareContainer.height) / 2;
                this.pegContainer.x = this.squareContainer.x;
                this.pegContainer.y = this.squareContainer.y;
                this.moveContainer.x = this.squareContainer.x;
                this.moveContainer.y = this.squareContainer.y;
            }
        }
    }

    private pickPeg(event: InteractionEvent): void {
        this.pickedPeg = event.target as Peg;
        this.oldX = this.pickedPeg.x;
        this.oldY = this.pickedPeg.y;
        this.localX = event.data.getLocalPosition(this.parent).x - this.pickedPeg.x;
        this.localY = event.data.getLocalPosition(this.parent).y - this.pickedPeg.y;
        this.checkPeg(this.pickedPeg);
        this.pegContainer.setChildIndex(this.pickedPeg, this.pegContainer.children.length - 1);
        this.pickedPeg.on("pointerup", () => {
            this.dropPeg();
        });
        this.pickedPeg.on("pointerupoutside", () => {
            this.dropPeg();
        });
        this.pickedPeg.on("pointermove", (e) => {
            this.movePeg(e);
        });
    }

    private movePeg(event: InteractionEvent): void {
        if (this.pickedPeg) {
            this.pickedPeg.x = event.data.getLocalPosition(this.parent).x - this.localX;
            this.pickedPeg.y = event.data.getLocalPosition(this.parent).y - this.localY;
        }
    }

    private dropPeg(): void {
        let legalMove = false;
        if (this.pickedPeg) {
            this.pickedPeg.removeListener("pointerup");
            this.pickedPeg.removeListener("pointerupoutside");
            this.pickedPeg.removeListener("pointermove");
            const dropX: number = Math.floor((this.pickedPeg.x + 30) / 60);
            const dropY: number = Math.floor((this.pickedPeg.y + 30) / 60);
            for (let i = 0; i < this.possibleLandings.length; i++) {
                if (this.possibleLandings[i].x == dropY && this.possibleLandings[i].y == dropX) {
                    legalMove = true;
                    break;
                }
            }
            if (!legalMove) {
                this.pickedPeg.x = this.oldX;
                this.pickedPeg.y = this.oldY;
            } else {
                const rowOffset: number = (dropY - this.pickedPeg.theRow) / 2;
                const colOffset: number = (dropX - this.pickedPeg.theCol) / 2;
                this.fieldArray[this.pickedPeg.theRow][this.pickedPeg.theCol] = 0;
                this.fieldArray[this.pickedPeg.theRow + rowOffset][this.pickedPeg.theCol + colOffset] = 0;
                this.fieldArray[this.pickedPeg.theRow + 2 * rowOffset][this.pickedPeg.theCol + 2 * colOffset] = 1;
                for (let i = 0; i < this.pegContainer.children.length; i++) {
                    const currentPeg: Peg = this.pegContainer.getChildAt(i) as Peg;
                    if (
                        currentPeg.theRow == this.pickedPeg.theRow + rowOffset &&
                        currentPeg.theCol == this.pickedPeg.theCol + colOffset
                    ) {
                        this.pegContainer.removeChildAt(i);
                    }
                }
                this.pickedPeg.x = dropX * 60;
                this.pickedPeg.y = dropY * 60;
                this.pickedPeg.theRow = dropY;
                this.pickedPeg.theCol = dropX;
            }
            let i = this.moveContainer.children.length;
            while (i--) {
                this.moveContainer.removeChildAt(i);
            }
        }
    }

    private checkPeg(m: Peg): void {
        let possibleMove: Sprite;
        this.possibleLandings = [];
        for (let i = 0; i < 4; i++) {
            const deltaRow: number = (1 - i) * ((i % 2) - 1);
            const deltaCol: number = (2 - i) * (i % 2);
            if (this.checkField(m, deltaRow, deltaCol)) {
                possibleMove = Sprite.from("possible_move.png");
                this.moveContainer.addChild(possibleMove);
                possibleMove.x = this.oldX + 120 * deltaCol;
                possibleMove.y = this.oldY + 120 * deltaRow;
                this.possibleLandings.push(new Point(m.theRow + 2 * deltaRow, m.theCol + 2 * deltaCol));
            }
        }
        if (this.possibleLandings.length > 0) {
            const startMove: Sprite = Sprite.from("start_move.png");
            this.moveContainer.addChild(startMove);
            startMove.x = this.oldX;
            startMove.y = this.oldY;
        } else {
            const wrongMove: Sprite = Sprite.from("wrong_move.png");
            this.moveContainer.addChild(wrongMove);
            wrongMove.x = this.oldX;
            wrongMove.y = this.oldY;
        }
    }
    private checkField(m: Peg, rowOffset: number, colOffset: number): boolean {
        if (
            this.fieldArray[m.theRow + 2 * rowOffset] != undefined &&
            this.fieldArray[m.theRow + 2 * rowOffset][m.theCol + 2 * colOffset] != undefined
        ) {
            if (
                this.fieldArray[m.theRow + rowOffset][m.theCol + colOffset] == 1 &&
                this.fieldArray[m.theRow + 2 * rowOffset][m.theCol + 2 * colOffset] == 0
            ) {
                return true;
            }
        }
        return false;
    }
}
