import { Vec2 } from "../../../components/Vec2";
import { Canvas } from "../../../components/Canvas";
import { ColorScheme, NewPersonData, WidgetState } from "../../../types/TreeTypes";
import { SelectGenderW } from "./SelectGenderW";
import { InterfaceEvent } from "../../../components/events/UIEvent";
import { NewPersonEvent } from "../../../components/events/NewPersonEvent";
import { AddChildEvent } from "../../../components/events/AddChildEvent";
import { AddParentEvent } from "../../../components/events/AddParentEvent";

export enum FromAction { NewPerson, AddChild, AddParent };

export class AddPersonForm {
    private state: WidgetState;

    private pos: Vec2;
    private radius: number;

    private genderW: SelectGenderW;

    private parentId: string;
    private generation: number;

    private action: FromAction;

    private actionAuthor: string;
    
    constructor() {
        this.radius = 20;
        const height = document.body.clientHeight;
        const step = height/20;

        this.genderW = new SelectGenderW(step*8);
        this.genderW.enable = false;

        this.generation = 1;
        this.parentId = null;

        this.action = FromAction.NewPerson;

        window.addEventListener('ui', this.onClick.bind(this),false);
    }

    public setAction(action: FromAction) {
        this.action = action;
    }
    
    public setActionAuthor(name: string) {
        this.actionAuthor = name;
    }

    public addForm() {
        this.state = WidgetState.Opened;
        if (!document.getElementById('create_person')) {
            document.body.appendChild(this.generateDivInputForm());
        }
        this.genderW.enable = true;

    }

    public setDefaults(data: { parentId: string, generation: number }) {
        this.parentId = data.parentId;
        this.generation = data.generation;
    }

    public removeForm() {
        this.state = WidgetState.Closed;
        const form = document.getElementById('create_person');
        document.body.removeChild(form);
    }

    public validate() {
        const nameField = <HTMLInputElement>document.getElementById('name');
        if (!nameField.value.length || !this.genderW.selectedGender) {
            throw new Error('validate error');
        }
            
    }

    public getInputValues(): NewPersonData {
        const nameField = <HTMLInputElement>document.getElementById('name');
        // const dobField = <HTMLInputElement>document.getElementById('dob');
        const pobField = <HTMLInputElement>document.getElementById('pob');

        return {
            name: nameField.value,
            gender: this.genderW.selectedGender,
            born: pobField.value,
            generation: this.generation,
            parentId: this.action === FromAction.AddParent ? null : this.parentId
        };
    }

    public draw() {
        if (this.state !== WidgetState.Opened) return;
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.pos = new Vec2(width / 2, height / 1.2);

        const step = height / 20;

        this.drawRectangle(ColorScheme.White);
        this.drawCircleWidget();
        this.drawV();
        this.drawInputLine(step*6.6);
        this.drawInputLine(step*10.6);
        this.drawInputLine(step*12.6);
        this.setupFont(14);
        this.drawActionInfo(step*3.6);
        this.setupFont(22, 'italic');
        this.drawWidgetInfo('OK');
        this.genderW.draw();
    }

    public isClicked(v: Vec2): boolean {
        if(this.state === WidgetState.Closed) return;
    
        return this.pos.clone().sub(v).length() < this.radius;
    }

    private drawActionInfo(y: number) {
        if (this.action === FromAction.NewPerson) return;
        const context = Canvas.getInstance().getContext();

        const linePos = new Vec2(document.body.clientWidth/2, y);

        const title = (this.action === FromAction.AddChild ?
            'Add Child' :
            'Add parent'
        ) + ' for ' + this.actionAuthor;
        context.fillText(title, linePos.x, linePos.y, document.body.clientWidth);
    }

    private onClick(e: InterfaceEvent) {

        if (this.state !== WidgetState.Opened || !this.isClicked(e.detail)) return;

        try {
            this.validate();
            const inputValues = this.getInputValues();

            if (this.action === FromAction.NewPerson) {
                dispatchEvent(new NewPersonEvent(inputValues));
            }
            if (this.action === FromAction.AddChild) {
                dispatchEvent(new AddChildEvent(inputValues));
            }
            if (this.action === FromAction.AddParent) {
                dispatchEvent(new AddParentEvent(inputValues));
            }

            this.removeForm();
        } catch (error) {
            dispatchEvent(new CustomEvent('error', { detail: error }));
        }
    }

    private drawRectangle(color: ColorScheme) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = color;
        context.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    }

    private drawInputLine(y: number) {
        const context = Canvas.getInstance().getContext();

        const widthLine = document.body.clientWidth - 40;
        const linePos = new Vec2(20, y);

        context.beginPath();
        context.moveTo(linePos.x, linePos.y);
        context.lineTo(linePos.x + widthLine, linePos.y);
        context.stroke();
    }

    private setupFont(size: number, style: string = '') {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.Black;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = `${style} ${size}px sans-serif`;
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

    private drawCircleWidget() {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = ColorScheme.WhiteOpacity;
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius - 2, 0, 2 * Math.PI);
        context.stroke();
    }

    private drawV() {
        const context = Canvas.getInstance().getContext();

        const vPos = this.pos.clone().add(new Vec2(-4, 8));
        context.beginPath();
        const turnedVec = new Vec2(1, 0).rotateAround(new Vec2(), -3 * Math.PI / 4);
        const vecInCircle = turnedVec.clone()
            .multiplyScalar(this.radius / 2)
            .add(vPos);
        context.moveTo(vPos.x, vPos.y);
        context.lineTo(vecInCircle.x, vecInCircle.y);
        const vecOnCircle = turnedVec.rotateAround(new Vec2(), Math.PI / 2)
            .multiplyScalar(this.radius).add(vPos);
        context.moveTo(vPos.x, vPos.y);
        context.lineTo(vecOnCircle.x, vecOnCircle.y);
        context.stroke();
    }

    private generateDivInputForm() {
        const form = document.createElement('div');
        form.style.position = 'fixed';
        form.style.top = '0';
        form.style.left = '0';
        form.style.width = '100%';
        form.style.height = '100%';
        form.id = 'create_person';

        const step = document.body.clientHeight / 20;
        form.appendChild(this.generateInputText('name', 'Name', new Vec2(0, step * 5)));
        form.appendChild(this.generateInputText('dob', 'Date of Birth', new Vec2(0, step * 9)));
        form.appendChild(this.generateInputText('pob', 'Place of Birth', new Vec2(0, step * 11)));

        return form;
    }

    private generateInputText(id: string, placeholder: string, pos: Vec2) {
        const inputText = document.createElement('input');
        inputText.type = 'text';
        inputText.id = id;
        inputText.name = id;
        inputText.placeholder = placeholder;

        inputText.style.position = 'absolute';
        inputText.style.width = '100%';
        inputText.style.top = `${pos.y}`;
        inputText.style.left = `${pos.x}`;

        inputText.style.padding = '10 30 10 30';
        inputText.style.fontSize = '20px';
        inputText.style.textAlign = 'center';
        inputText.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        inputText.style.borderColor = 'rgba(255, 255, 255, 0)';

        return inputText;
    }
}