export class Canvas {
    private static instance: Canvas;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    public constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.context = <CanvasRenderingContext2D>this.canvas.getContext("2d", { antialias: true });

        this.resizeCanvas();
        window.addEventListener("resize", this.resizeCanvas.bind(this), false);

        this.canvas.addEventListener("wheel", (e: MouseEvent) => {
            e.preventDefault();
        }, false);
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    public static getInstance(): Canvas {
        if (!Canvas.instance) {
            Canvas.instance = new Canvas();
        }
        return Canvas.instance;
    }

    public clear() {
        this.context.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
        this.context.fillStyle = "rgba(255, 255, 255, 1)";
        this.context.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    }

    private resizeCanvas(): void {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }
}
