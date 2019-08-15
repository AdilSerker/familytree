import { Vec2 } from "../../../components/Vec2";
import { ColorScheme, WidgetState } from "../../../types/TreeTypes";
import { Canvas } from "../../../components/Canvas";
import { InterfaceEvent } from "../../../components/events/UIEvent";
import { AddPersonForm } from "../form/AddPersonForm";

export class NewPersonWidget {
    private state: WidgetState;
    private pos: Vec2;
    private radius: number;

    private addPersonForm: AddPersonForm;

    public constructor(pos: Vec2 = new Vec2()) {
        this.state = WidgetState.Closed;
        this.pos = pos;

        this.radius = 20;

        this.addPersonForm = new AddPersonForm();

        window.addEventListener('ui', this.onClick.bind(this),false);
        window.addEventListener('tree-is-empty', this.onVisible.bind(this), false);
        window.addEventListener('tree-is-not-empty', this.onInvisible.bind(this), false);
    } 

    public draw() {
        if(this.state === WidgetState.Closed) return;

        const context = Canvas.getInstance().getContext();

        if (this.state === WidgetState.Opened) {
            this.drawButton(context);
        }
        if (this.state === WidgetState.CreatePerson) {
            this.drawCreatePersonForm();
        }
    }

    public setInvisible() {
        this.state = WidgetState.Closed;
    }

    public isClicked(v: Vec2): boolean {
        if(this.state === WidgetState.Closed) return;
    
        return this.pos.clone().sub(v).length() < this.radius;
    }

    private onClick(e: InterfaceEvent) {
        if (this.state !== WidgetState.Opened || !this.isClicked(e.detail)) return;

        this.state = WidgetState.CreatePerson;
        this.addPersonForm.addForm();      
    }

    private drawButton(context: CanvasRenderingContext2D) {
        const width = document.body.clientWidth;
        this.pos.x = width/2;

        const height = document.body.clientHeight;
        this.pos.y = (height/5)*3;

        this.drawCircleWidget(context);

        context.beginPath();
        context.moveTo(this.pos.x - 5, this.pos.y);
        context.lineTo(this.pos.x + 5, this.pos.y);
        context.moveTo(this.pos.x, this.pos.y - 5);
        context.lineTo(this.pos.x, this.pos.y + 5);
        context.stroke();

        this.setupFont(context);
        this.drawWidgetInfo('Add Person');
    }


    private drawCreatePersonForm() {
        this.addPersonForm.draw()
    }

    private setupFont(context: CanvasRenderingContext2D) {
        context.fillStyle = ColorScheme.Black;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "italic 22px sans-serif";
    }

    private drawCircleWidget(context: CanvasRenderingContext2D) {
        context.fillStyle = ColorScheme.WhiteOpacity;
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius - 2, 0, 2 * Math.PI);
        context.stroke();
    }

    private drawWidgetInfo(title: string) {
        const context = Canvas.getInstance().getContext();

        const widthString = context.measureText(title).width;
        context.beginPath();
        const turnedVec = new Vec2(this.radius - 2, 0).rotateAround(new Vec2(), Math.PI / 4);
        const dotOnCircle = turnedVec.clone().add(this.pos);
        context.moveTo(dotOnCircle.x, dotOnCircle.y);
        const turnedVecScaled = turnedVec.clone().multiplyScalar(2);
        const dotOutCircle = turnedVecScaled.clone().add(this.pos);
        context.lineTo(dotOutCircle.x, dotOutCircle.y);
        context.lineTo(dotOutCircle.x + widthString, dotOutCircle.y);
        context.stroke();
        context.fillText(title, dotOutCircle.x + widthString / 2, dotOutCircle.y - this.radius / 1.7, widthString);
    }

    private onVisible(e: any) {
        this.state = WidgetState.Opened;
    }

    private onInvisible(e: any) {
        this.state = WidgetState.Closed;
    }
}