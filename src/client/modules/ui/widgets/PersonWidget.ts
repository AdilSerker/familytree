import { ColorScheme, WidgetState } from "../../../types/TreeTypes";
import { NodeTree } from "../../tree/NodeTree";
import { TreeEvent } from "../../../components/events/TreeEvent";
import { Canvas } from "../../../components/Canvas";
import { TreeLockEvent } from "../../../components/events/TreeLockEvent";
import { Vec2 } from "../../../components/Vec2";
import { AddPersonForm, FromAction } from "./AddPersonForm";

enum Action {
    AddChild = 'Add Child',
    AddParent = 'Add Parent'
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

        window.addEventListener("selecttree", this.onClick.bind(this));

        window.addEventListener("touchstart", (e: TouchEvent) => {
            if (this.state === WidgetState.Closed) return;

            const touchPos = e.touches.item(0);
            this.cursorPos = new Vec2(touchPos.clientX, touchPos.clientY);

            if (this.state !== WidgetState.CreatePerson) {
                this.state = this.isClicable(this.cursorPos) ? WidgetState.Drag : WidgetState.Opened;
            }

        }, false);

        window.addEventListener("touchmove", (e: TouchEvent) => {
            if (this.state === WidgetState.Closed) return;

            const touchPos = e.touches.item(0);

            this.action = this.node.pos.clone().sub(this.cursorPos).y > 0 ?
                Action.AddChild :
                Action.AddParent;

            this.action = this.node.parentId ? Action.AddChild : this.action;

            this.cursorPos = new Vec2(touchPos.clientX, touchPos.clientY);
        }, false);

        window.addEventListener("touchend", (e: TouchEvent) => {
            if (this.state === WidgetState.Closed) return;

            if (this.state === WidgetState.Drag) {
                this.state = WidgetState.CreatePerson;
                this.addPersonForm.setDefaults({
                    parentId: this.node.id,
                    generation: this.node.generation + 1
                });
                const action = this.action === Action.AddChild ? FromAction.AddChild :
                    this.action === Action.AddParent ? FromAction.AddParent : null;
                this.addPersonForm.setAction(action);
                this.addPersonForm.setActionAuthor(this.node.name);
                this.addPersonForm.addForm();
            }

        }, false);
    }

    public setInvisible() {
        this.state = WidgetState.Closed;
    }

    public draw() {
        if (!this.node) return;

        if (this.state === WidgetState.Opened) {
            this.drawRectangle(ColorScheme.WhiteOpacity);
            this.drawNodePoint(ColorScheme.Black);
            this.drawNodeInfo();
        }

        if (this.state === WidgetState.Drag) {
            this.drawRectangle(ColorScheme.WhiteOpacity);
            this.drawNodePoint(ColorScheme.Black);
            this.drawNodeInfo();
            this.nodeCreatorDraw();
        }
        if (this.state === WidgetState.CreatePerson) {
            this.addPersonForm.draw();

        }
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
        const { isRight, turnedVec, mirroredVec } = this.breakLineDraw(this.cursorPos, widthName);
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
        context.arc(this.cursorPos.x, this.cursorPos.y, this.radius * 1.5, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(this.cursorPos.x, this.cursorPos.y, this.radius * 1.5, 0, 2 * Math.PI);
        context.stroke();
    }

    private drawNodeInfo() {
        const context = Canvas.getInstance().getContext();

        this.setTextOption(25, 'italic');
        const widthName = context.measureText(this.node.name).width;

        const pos = this.node.pos;

        const { isRight, turnedVec, mirroredVec } = this.breakLineDraw(pos, widthName);

        const infoPosX = isRight ? turnedVec.x + widthName / 2 : mirroredVec.x - widthName / 2;

        context.fillText(this.node.name, infoPosX, turnedVec.y - this.radius * 1.2);
        this.setTextOption(14);
        context.fillText(this.node.born, infoPosX, turnedVec.y + this.radius * 1.2);
        this.setTextOption(12);
        context.fillText('1 сентября 1885', infoPosX, turnedVec.y + this.radius * 2.8);

    }

    private breakLineDraw(pos: Vec2, widthName: number) {
        const context = Canvas.getInstance().getContext();
        context.fillStyle = ColorScheme.Black;
        const turnedVec = new Vec2(1, 0).rotateAround(new Vec2(), -Math.PI / 4)
            .multiplyScalar(this.radius * 4)
            .add(pos);
        const isRight = turnedVec.x + widthName < document.body.clientWidth;
        const mirroredVec = turnedVec.clone().rotateAround(pos, -Math.PI / 2);
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
        window.dispatchEvent(new TreeLockEvent(true));
    }

    private isClicable(v: Vec2): boolean {
        return this.node.pos.clone().sub(v).length() < this.radius;
    }
}