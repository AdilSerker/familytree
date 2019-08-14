import { Canvas } from "../../components/Canvas";
import { ColorScheme, WidgetState } from "../../types/TreeTypes";
import { Vec2 } from "../../components/Vec2";

export class Footer {
    private state: WidgetState

    private height: number;
    private message: string;

    private pos: Vec2;
    private color: ColorScheme;

    constructor() {
        this.state = WidgetState.Closed;
        this.color = ColorScheme.BlackOpacity;
        this.height = Canvas.h*20;
        this.message;
        this.pos = new Vec2(0, Canvas.h*100 - this.height);

        addEventListener('console', (e: CustomEvent) => {
            this.state = WidgetState.Opened;
            this.message = e.detail;

            setTimeout(() => {
                this.state = WidgetState.Closed;
                this.message = '';
            }, 3000);
        })
    }

    public draw() {
        if (this.state === WidgetState.Closed) return;

        const context = Canvas.getInstance().getContext();

        context.fillStyle = this.color;
        context.fillRect(this.pos.x, this.pos.y, Canvas.w*100, this.height);

        context.fillStyle = ColorScheme.White;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px sans-serif";

        const textPos = new Vec2(Canvas.w*50, this.height/2).add(this.pos);
        context.fillText(this.message, textPos.x, textPos.y, Canvas.w*85);
    }
}