import { ViewMetrics } from "./constants/ViewMetrics";
import { Playground } from "./playground/Playground";
import * as PIXI from "pixi.js";
import "./style.css";

declare const VERSION: string;

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`);

const app = new PIXI.Application({
    backgroundColor: 0xffffff,
    width: ViewMetrics.landscapeWidth,
    height: ViewMetrics.landscapeHeight,
});

const stage = app.stage;
ViewMetrics.stage = stage;

window.onload = async (): Promise<void> => {
    await loadGameAssets();

    document.body.appendChild(app.view);

    resizeCanvas();

    // Entry Point
    const playground: Playground = new Playground();
    stage.addChild(playground);
};

async function loadGameAssets(): Promise<void> {
    return new Promise((res, rej) => {
        const loader = PIXI.Loader.shared;
        loader.add("rabbit", "./assets/spritesheet.json");

        loader.onComplete.once(() => {
            res();
        });

        loader.onError.once(() => {
            rej();
        });

        loader.load();
    });
}

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        const newScale = Math.min(
            window.innerWidth / ViewMetrics.landscapeWidth,
            window.innerHeight / ViewMetrics.landscapeHeight
        );
        ViewMetrics.scale = newScale;
        app.stage.scale.x = newScale;
        app.stage.scale.y = newScale;
        app.stage.x = Math.max(0, (window.innerWidth - ViewMetrics.landscapeWidth * newScale) / 2);
        app.stage.y = 0;
    };
    resize();
    window.addEventListener("resize", resize);
}
