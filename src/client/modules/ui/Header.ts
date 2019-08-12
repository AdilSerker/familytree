import { ColorScheme } from "../../types/TreeTypes";
import { Vec2 } from "../../components/Vec2";
import { Canvas } from "../../components/Canvas";

export class Header {
    private title = 'Serkerov';
    private subTitle = 'family tree';
    private height: number;

    public constructor() {
        this.height = document.body.clientHeight/6;
    }

    public draw(): void {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.WhiteOpacity;
        context.fillRect(0, 0, document.body.clientWidth, this.height);

        this.drawTitle();
    }

    public setTitle(name: string) {
        this.title = name;
    }

    public drawTitle() {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.Black;
        context.textAlign = "center";
        context.textBaseline = "middle"
        context.font = "35px sans-serif";
        const width = document.body.clientWidth;
        context.fillText(this.title, width/2, document.body.clientHeight/13, width);

        const widthString = context.measureText(this.title).width;
        this.drawSubTitle(widthString);

    }

    public drawSubTitle(widthString: number) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.Black;
        context.textAlign = "start";
        context.textBaseline = "middle"
        context.font = "italic 16px sans-serif";
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;
        context.fillText(this.subTitle, width/2, height/9, widthString);

    }

    public updateTitle(title: string) {
        this.title = title;
    }

    public isClicked(v: Vec2): boolean {
        return v.y < this.height;
    }
}