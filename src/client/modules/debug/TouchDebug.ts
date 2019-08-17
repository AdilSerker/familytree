import { Vec2 } from "../../components/Vec2";
import { Canvas } from "../../components/Canvas";

export class TouchDebug {
    private pos: Vec2;
    private radius: number;
    private touches: Map<number, Vec2>;

    constructor() {
        this.radius = 25;
        this.touches = new Map<number, Vec2>();
        addEventListener('touched', (e: CustomEvent<{ index: number, v: Vec2 }>) => {
            this.addTouch(e.detail.index, e.detail.v);
        }, false);
        addEventListener('clear-touch', this.clear.bind(this), false);
    }

    addTouch(index: number, v: Vec2) {
        this.touches.set(index, v);
    }

    clear() {
        this.touches.clear();
    }

    draw() {
        if (!this.touches.size) return;

        const context = Canvas.getInstance().getContext();
        this.touches.forEach((item) => {
            context.fillStyle = 'rgb(200, 0, 0)';
            context.beginPath();
            context.arc(item.x, item.y, this.radius, 0, 2 * Math.PI);
            context.fill();
        });
    }
}