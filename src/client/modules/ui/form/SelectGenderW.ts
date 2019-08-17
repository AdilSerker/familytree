import { Gender, ColorScheme } from "../../../types/TreeTypes";
import { Vec2 } from "../../../components/Vec2";
import { InterfaceEvent } from "../../../components/events/UIEvent";
import { Canvas } from "../../../components/Canvas";

export class SelectGenderW {
    public selectedGender: Gender;

    public enable: boolean;

    private position: Vec2;
    private maleRadioPos: Vec2;
    private femaleRadioPos: Vec2;

    private radius: number;

    constructor(pos: Vec2) {
        const h = Canvas.h;
        const w = Canvas.w;

        this.selectedGender = null;
        this.radius = 5;
        this.position = pos;
        this.maleRadioPos = new Vec2(w*17 + this.radius, 0);
        this.femaleRadioPos = new Vec2(w*65 + this.radius, 0);
        window.addEventListener('ui', this.onClick.bind(this),false);
        
        window.addEventListener('hide-widgets', () => {
            this.selectedGender = null;
        }, false);

    }

    public updatePosition(pos: Vec2) {
        this.position.add(pos);
    }

    public draw(v: Vec2) {
        if (!this.enable) return;
        const position = this.position.clone().add(v);

        this.setupFont();
        this.drawCircle(this.maleRadioPos.clone()
            .add(position), this.selectedGender === Gender.Male);
        this.drawWidgetInfo('Male', this.maleRadioPos.clone().add(position));
        this.drawCircle(this.femaleRadioPos.clone()
            .add(position), this.selectedGender === Gender.Female);
        this.drawWidgetInfo('Female', this.femaleRadioPos.clone().add(position));

    }

    private setupFont() {
        const context = Canvas.getInstance().getContext();
        context.fillStyle = ColorScheme.Black;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "italic 20px sans-serif";
    }

    private drawWidgetInfo(title: string, v: Vec2) {
        const context = Canvas.getInstance().getContext();

        const widthString = context.measureText(title).width;
        context.beginPath();
        const turnedVec = new Vec2(this.radius, 0).rotateAround(new Vec2(), Math.PI/4);
        const dotOnCircle = turnedVec.clone().add(v);
        context.moveTo(dotOnCircle.x, dotOnCircle.y);
        const turnedVecScaled = turnedVec.clone().multiplyScalar(2);
        const dotOutCircle = turnedVecScaled.clone().add(v);
        context.lineTo(dotOutCircle.x, dotOutCircle.y);
        context.lineTo(dotOutCircle.x + widthString, dotOutCircle.y);
        context.stroke();
        context.fillText(title, dotOutCircle.x + widthString / 2, dotOutCircle.y - this.radius*2, widthString);
    }

    private drawCircle(v: Vec2, selected: boolean) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(v.x, v.y, this.radius, 0, 2 * Math.PI);
        selected ? context.fill() : context.stroke();
    }


    private isClicked(v: Vec2): boolean {
        return this.isMaleSelect(v) || this.isFemaleSelect(v);
    }

    private onClick(e: InterfaceEvent) {
        if (!this.enable || !this.isClicked(e.detail)) return;
        
        if (this.isMaleSelect(e.detail)) this.selectedGender = Gender.Male;
        if (this.isFemaleSelect(e.detail)) this.selectedGender = Gender.Female;
    }

    private isMaleSelect(v: Vec2): boolean {
        return v.x < document.body.clientWidth/2
            && v.y < this.position.clone().add(this.maleRadioPos).y + this.radius * 3
            && v.y > this.position.clone().add(this.maleRadioPos).y - this.radius * 6;

    }

    private isFemaleSelect(v: Vec2): boolean {
        return v.x > document.body.clientWidth/2
            && v.y < this.position.clone().add(this.femaleRadioPos).y + this.radius * 3
            && v.y > this.position.clone().add(this.femaleRadioPos).y - this.radius * 6;
    }


}