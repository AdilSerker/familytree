import { ColorScheme } from "../../types/TreeTypes";
import { Vec2 } from "../../components/Vec2";
import { Canvas } from "../../components/Canvas";
import { InterfaceEvent } from "../../components/events/UIEvent";

export class Header {
    private title = 'Serkerov';
    private subTitle = 'family tree';
    private height: number;

    public constructor() {
        this.height = Canvas.h*23;

        addEventListener('ui', this.onClick.bind(this), false);
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
        context.font = "60px sans-serif";
        context.fillText(this.title, Canvas.w*50, this.height*0.45, Canvas.w*100);
        
        const widthString = context.measureText(this.title).width;
        
        this.drawSubTitle(widthString);

    }

    public drawSubTitle(widthString: number) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.Black;
        context.textAlign = "left";
        context.textBaseline = "middle"
        context.font = "italic 20px sans-serif";

        context.fillText(this.subTitle, Canvas.w*53, this.height*0.68, widthString);

    }

    public updateTitle(title: string) {
        this.title = title;
    }

    public isClicked(v: Vec2): boolean {
        return v.y < this.height;
    }

    private onClick(e: InterfaceEvent) {
        if(!this.isClicked(e.detail)) return;

        dispatchEvent(new Event('hide-widgets'));
    }
}