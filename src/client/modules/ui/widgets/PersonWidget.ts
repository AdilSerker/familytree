import { Store } from './../../../components/Store';
import { ColorScheme, WidgetState } from "../../../types/TreeTypes";
import { NodeTree } from "../../tree/NodeTree";
import { TreeEvent } from "../../../components/events/TreeEvent";
import { Canvas } from "../../../components/Canvas";
import { TreeLockEvent } from "../../../components/events/TreeLockEvent";
import { Vec2 } from "../../../components/Vec2";
import { AddPersonForm, FromAction as FormAction } from "../form/AddPersonForm";

enum Action {
    AddChild = 'Add Child',
    AddParent = 'Add Parent',
    AddRelationship = 'Add Relationship'
}

export class PersonWidget {

    private node: NodeTree;
    private radius: number;
    private cursorPos: Vec2;

    private action: Action;

    private state: WidgetState;

    private addPersonForm: AddPersonForm;

    public constructor() {
        this.radius = 8;
        this.node = undefined;

        this.state = WidgetState.Closed;

        this.addPersonForm = new AddPersonForm();

        this.initHandlers();
    }

    private initHandlers() {
        window.addEventListener("selecttree", this.onClick.bind(this));
        window.addEventListener("touchstart", (e: TouchEvent) => {
            if (this.state === WidgetState.Closed)
                return;
            const touchPos = e.touches.item(0);
            this.cursorPos = new Vec2(touchPos.clientX, touchPos.clientY);
            if (this.state !== WidgetState.CreatePerson) {
                this.isClicable(this.cursorPos) && window.dispatchEvent(new TreeLockEvent(true));
                this.state = this.isClicable(this.cursorPos) ? WidgetState.Drag : WidgetState.Opened;
            }
        }, false);
        window.addEventListener("touchmove", (e: TouchEvent) => {
            if (this.state === WidgetState.Closed)
                return;
            const touchPos = e.touches.item(0);
            this.cursorPos = new Vec2(touchPos.clientX, touchPos.clientY);
            this.action = this.getAction();
        }, false);
        window.addEventListener("touchend", (e: TouchEvent) => {
            if (this.state === WidgetState.Closed)
                return;
            if (this.state === WidgetState.Drag) {
                this.state = WidgetState.CreatePerson;
                const action = this.action === Action.AddChild ? FormAction.AddChild :
                    this.action === Action.AddParent ? FormAction.AddParent : FormAction.AddRelationship;
                this.addPersonForm.setAction(action);
                this.addPersonForm.setActionAuthor({
                    id: this.node.id,
                    name: this.node.name,
                    generation: this.node.generation + 1,
                    gender: this.node.gender
                });
                this.addPersonForm.addForm();
            }
            this.action = null;
        }, false);
        window.addEventListener('hide-widgets', () => {
            this.state = WidgetState.Closed;
        }, false);
    }

    private getAction() {
        const angle = this.node.pos.clone().sub(this.cursorPos).negate().angle();

        let action: Action = Action.AddChild;
        if (!this.node.parentId) {
            action = angle < Math.PI && angle > 0 ? Action.AddParent : action;
        }

        if (!this.node.relationship) {
            action = angle < 2*Math.PI && angle > Math.PI ? Action.AddRelationship :
                this.node.parentId ? Action.AddRelationship : action;
        }

        return action;
    }

    public setInvisible() {
        this.state = WidgetState.Closed;
    }

    public draw() {
        if (!this.node) return;

        if (this.state === WidgetState.CreatePerson) {
            this.addPersonForm.draw();
            return;
        }
        this.drawRectangle(ColorScheme.WhiteOpacity);
        this.node.relationship && this.drawRelationship();
        this.drawNodePoint(ColorScheme.Black);
        this.drawNodeInfo();

        if (this.state === WidgetState.Drag) {
            this.nodeCreatorDraw();
        }
        
    }

    public drawRelationship() {
        const context = Canvas.getInstance().getContext();

        const relationName = Store.getInstance().get(this.node.relationship).name;
        this.setTextOption(22, 'italic');
        const widthName = context.measureText(relationName).width;
        const pos = this.node.pos;
        const { isRight, turnedVec, mirroredVec } = this.breakLineDraw(pos, widthName, this.radius * 5, 1);

        const infoPosX = isRight ? turnedVec.x + widthName / 2 : mirroredVec.x - widthName / 2;
        this.setTextOption(20, 'italic');
        context.fillText(relationName, infoPosX, turnedVec.y + this.radius * 1.2);

        context.fillStyle = ColorScheme.White;
        context.beginPath();
        context.arc(this.node.pos.x, this.node.pos.y, this.radius * 2, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(this.node.pos.x, this.node.pos.y, this.radius * 2, 0, 2 * Math.PI);
        context.stroke();
    }

    private nodeCreatorDraw() {
        const context = Canvas.getInstance().getContext();
        this.drawRectangle(ColorScheme.WhiteOpacity);
        this.drawNodePoint(ColorScheme.Black);
        this.action && this.actionNameDraw(context);
        this.actionSelectorDraw(context);
    }

    private actionNameDraw(context: CanvasRenderingContext2D) {
        this.setTextOption(25, 'italic');
        const widthName = context.measureText(this.action).width;
        const { isRight, turnedVec, mirroredVec } = this.breakLineDraw(this.cursorPos, widthName, this.radius * 10);
        const infoPosX = isRight ? turnedVec.x + widthName / 2 : mirroredVec.x - widthName / 2;

        context.fillStyle = ColorScheme.Black;
        context.fillText(this.action, infoPosX, turnedVec.y - this.radius * 1.2);
    }

    private actionSelectorDraw(context: CanvasRenderingContext2D) {
        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.moveTo(this.node.pos.x, this.node.pos.y);
        context.lineTo(this.cursorPos.x, this.cursorPos.y);
        context.stroke();
        context.fillStyle = ColorScheme.White;
        context.beginPath();
        context.arc(this.cursorPos.x, this.cursorPos.y, this.radius * 4, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(this.cursorPos.x, this.cursorPos.y, this.radius * 4, 0, 2 * Math.PI);
        context.stroke();
    }

    private drawNodeInfo() {
        const context = Canvas.getInstance().getContext();

        this.setTextOption(25, 'italic');
        const widthName = this.getWidthString(this.node.name);

        const pos = this.node.pos;

        const { isRight, turnedVec, mirroredVec } = this.breakLineDraw(pos, widthName, this.radius * 5);

        const infoPosX = isRight ? turnedVec.x + widthName / 2 : mirroredVec.x - widthName / 2;

        context.fillText(this.node.name, infoPosX, turnedVec.y - this.radius * 1.2);
        this.setTextOption(14);
        context.fillText(this.node.born, infoPosX, turnedVec.y + this.radius * 1.2);
        this.setTextOption(12);
        context.fillText('1 сентября 1885', infoPosX, turnedVec.y + this.radius * 2.8);

    }

    private breakLineDraw(pos: Vec2, widthName: number, braekLenght: number, positif: number = -1) {
        const context = Canvas.getInstance().getContext();
        context.fillStyle = ColorScheme.Black;
        const turnedVec = new Vec2(1, 0).rotateAround(new Vec2(), positif * Math.PI / 4)
            .multiplyScalar(braekLenght)
            .add(pos);
        const isRight = turnedVec.x + widthName < document.body.clientWidth;
        const mirroredVec = turnedVec.clone().rotateAround(pos, positif * Math.PI / 2);
        context.beginPath();
        context.moveTo(pos.x, pos.y);
        isRight ? context.lineTo(turnedVec.x, turnedVec.y) : context.lineTo(mirroredVec.x, mirroredVec.y);
        isRight ?
            context.lineTo(turnedVec.x + widthName, turnedVec.y) :
            context.lineTo(mirroredVec.x - widthName, mirroredVec.y);
        context.stroke();
        return { isRight, turnedVec, mirroredVec };
    }

    private setTextOption(size: number, style: string = '') {
        const context = Canvas.getInstance().getContext();

        context.textAlign = "center";
        context.textBaseline = "middle"
        context.font = style + ` ${size}px sans-serif`;
    }

    private drawRectangle(color: ColorScheme) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = color;
        context.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    }

    private drawNodePoint(color: ColorScheme) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = color;
        context.beginPath();
        context.arc(this.node.pos.x, this.node.pos.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }

    private onClick(event: TreeEvent) {
        if (this.state === WidgetState.CreatePerson) return;
        if (!event.detail) {
            this.node = undefined;

            this.state = WidgetState.Closed;
            window.dispatchEvent(new TreeLockEvent(false));
            return;
        }

        this.state = WidgetState.Opened;
        this.node = event.detail;
    }

    private isClicable(v: Vec2): boolean {
        return this.node.pos.clone().sub(v).length() < this.radius*3;
    }

    protected clamp(min: number, max: number, v: number) {
        let res;
        res = v > max ? max : v;
        res = v < min ? min : v;
        return res;
    }

    protected getWidthString(string: string) {
        const context = Canvas.getInstance().getContext()

        const width = context.measureText(this.node.name).width;
        const minWidth = context.measureText('AAAAA').width;

        return this.clamp(minWidth, width, width);
    }
}