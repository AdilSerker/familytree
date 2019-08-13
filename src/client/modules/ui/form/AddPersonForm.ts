import { Vec2 } from "../../../components/Vec2";
import { Canvas } from "../../../components/Canvas";
import { ColorScheme, NewPersonData, WidgetState, Gender } from "../../../types/TreeTypes";
import { SelectGenderW } from "./SelectGenderW";
import { InterfaceEvent } from "../../../components/events/UIEvent";
import { NewPersonEvent } from "../../../components/events/NewPersonEvent";
import { AddChildEvent } from "../../../components/events/AddChildEvent";
import { AddParentEvent } from "../../../components/events/AddParentEvent";
import { AddRelationshipEvent } from "../../../components/events/AddRelationshipEvent";

export enum FromAction { NewPerson, AddChild, AddParent, AddRelationship };

type Button = {
    pos: Vec2,
    name: string,
    radius: number
}

export class AddPersonForm {
    private state: WidgetState;

    private pos: Vec2;
    private genderWidget: SelectGenderW;
    private okButton: Button;

    private action: FromAction;

    private actionAuthor: {
        id: string;
        name: string;
        generation: number;
        gender: Gender
    };

    constructor() {
        const h = Canvas.h;
        const w = Canvas.w;
        this.okButton = {
            radius: 20,
            name: 'Ok',
            pos: new Vec2(w*50, h*85)
        };

        this.pos = new Vec2();

        this.genderWidget = new SelectGenderW(new Vec2(0, h*50));
        this.genderWidget.enable = false;

        this.actionAuthor = {
            id: null,
            name: null,
            generation: 1,
            gender: null
        }

        this.action = FromAction.NewPerson;

        window.addEventListener('ui', this.onClick.bind(this), false);
        window.addEventListener('hide-widgets', () => {
            this.state = WidgetState.Closed;
            this.removeForm();
        }, false);
    }

    public update(deltaSecond: number) {
        this.updateInputPos();
    }

    public setAction(action: FromAction) {
        this.action = action;
    }

    public setActionAuthor(author: {
        id: string;
        name: string;
        generation: number,
        gender: Gender
    }) {
        this.actionAuthor = { ...author };
    }


    public addForm() {
        this.state = WidgetState.Opened;
        if (!document.getElementById('create_person')) {
            document.body.appendChild(this.generateDivInputForm());
        }
        this.genderWidget.enable = this.action === FromAction.AddRelationship ? false : true;

    }

    public removeForm() {
        this.state = WidgetState.Closed;
        const form = document.getElementById('create_person');
        form && document.body.removeChild(form);
    }

    public validate() {
        const nameField = <HTMLInputElement>document.getElementById('name');
        if (!nameField.value.length || !this.genderWidget.selectedGender) {
            throw new Error('validate error');
        }

    }

    public getInputValues(): NewPersonData {
        const nameField = <HTMLInputElement>document.getElementById('name');
        // const dobField = <HTMLInputElement>document.getElementById('dob');
        const pobField = <HTMLInputElement>document.getElementById('pob');

        return {
            name: nameField.value,
            gender: this.genderWidget.selectedGender,
            born: pobField.value,
            generation: this.actionAuthor.generation,
            parentId: this.action === FromAction.AddParent ? null : this.actionAuthor.id
        };
    }

    public draw() {
        if (this.state !== WidgetState.Opened) return;

        this.drawbackPlane(ColorScheme.White);
        this.drawOkButton();
        this.drawInputLines();
        this.setupFont(14);
        this.drawActionInfo(new Vec2(Canvas.w*50, Canvas.h*30));
        this.genderWidget.draw(this.pos);
    }

    public isClicked(v: Vec2): boolean {
        if (this.state === WidgetState.Closed) return;

        return this.pos.clone().add(this.okButton.pos).sub(v).length() < this.okButton.radius;
    }

    private updateInputPos() {
        const inputName = document.getElementById('name');
        const inputDob = document.getElementById('dob');
        const inputPob = document.getElementById('pob');
        const inputFamily = document.getElementById('family');

        const h = Canvas.h;

        const namePos = new Vec2(0, h*35).add(this.pos);
        const dobPos = new Vec2(0, h*55).add(this.pos);
        const pobPos = new Vec2(0, h*65).add(this.pos);
        const famPos = new Vec2(0, h*45).add(this.pos);

        inputName.style.left = namePos.x + 'px';
        inputName.style.top = namePos.y + 'px';
        inputDob.style.left = dobPos.x + 'px';
        inputDob.style.top = dobPos.y + 'px';
        inputPob.style.left = pobPos.x + 'px';
        inputPob.style.top = pobPos.y + 'px';
        inputFamily.style.left = famPos.x + 'px';
        inputFamily.style.top = famPos.y + 'px';
    }

    private drawActionInfo(v: Vec2) {
        if (this.action === FromAction.NewPerson) return;
        const context = Canvas.getInstance().getContext();

        const linePos = v.add(this.pos);

        const title = (this.action === FromAction.AddChild ?
            'Add Child' :
            this.action === FromAction.AddParent ?
                'Add Parent' :
                'Add Relationship'
        ) + ' for ' + this.actionAuthor.name;

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
            if (this.action === FromAction.AddRelationship) {
                dispatchEvent(new AddRelationshipEvent(inputValues));
            }

            this.removeForm();
            this.genderWidget.selectedGender = null;
        } catch (error) {
            dispatchEvent(new CustomEvent('error', { detail: error }));
        }
    }

    private drawbackPlane(color: ColorScheme) {
        const context = Canvas.getInstance().getContext();

        context.fillStyle = color;

        context.fillRect(this.pos.x, this.pos.y, Canvas.w*100, Canvas.h*100);
    }

    private drawInputLines() {
        const context = Canvas.getInstance().getContext();
        const w = Canvas.w;

        const inputs = document.body.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; ++i) {
            const x = Number(inputs[i].style.left.split('px')[0]);
            const y = Number(inputs[i].style.top.split('px')[0]);
            const heightInput = inputs[i].clientHeight;

            const widthLine = w*80;
            const linePos = new Vec2(x+w*10, y + heightInput);
    
            context.fillStyle = ColorScheme.Black;
            context.beginPath();
            context.moveTo(linePos.x, linePos.y);
            context.lineTo(linePos.x + widthLine, linePos.y);
            context.stroke();
        }
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
        const turnedVec = new Vec2(this.okButton.radius - 2, 0).rotateAround(new Vec2(), Math.PI / 4);
        const dotOnCircle = turnedVec.clone().add(this.pos.clone().add(this.okButton.pos));
        context.moveTo(dotOnCircle.x, dotOnCircle.y);
        const turnedVecScaled = turnedVec.clone().multiplyScalar(2);
        const dotOutCircle = turnedVecScaled.clone().add(this.pos.clone().add(this.okButton.pos));
        context.lineTo(dotOutCircle.x, dotOutCircle.y);
        context.lineTo(dotOutCircle.x + widthString, dotOutCircle.y);
        context.stroke();
        context.fillText(title, dotOutCircle.x + widthString / 2, dotOutCircle.y - this.okButton.radius / 1.7, widthString);
    }

    private drawOkButton() {
        const context = Canvas.getInstance().getContext();

        const pos = this.pos.clone().add(this.okButton.pos);

        context.fillStyle = ColorScheme.WhiteOpacity;
        context.beginPath();
        context.arc(pos.x, pos.y, this.okButton.radius, 0, 2 * Math.PI);
        context.fill();

        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(pos.x, pos.y, this.okButton.radius - 2, 0, 2 * Math.PI);
        context.stroke();

        const vPos = pos.clone().add(new Vec2(-4, 8));
        context.beginPath();
        const turnedVec = new Vec2(1, 0).rotateAround(new Vec2(), -3 * Math.PI / 4);
        const vecInCircle = turnedVec.clone()
            .multiplyScalar(this.okButton.radius / 2)
            .add(vPos);
        context.moveTo(vPos.x, vPos.y);
        context.lineTo(vecInCircle.x, vecInCircle.y);
        const vecOnCircle = turnedVec.rotateAround(new Vec2(), Math.PI / 2)
            .multiplyScalar(this.okButton.radius).add(vPos);
        context.moveTo(vPos.x, vPos.y);
        context.lineTo(vecOnCircle.x, vecOnCircle.y);
        context.stroke();

        this.setupFont(22, 'italic');
        this.drawWidgetInfo('OK');
    }

    private generateDivInputForm() {
        const form = document.createElement('div');
        form.style.position = 'fixed';
        form.style.top = '0';
        form.style.left = '0';
        form.style.width = '100%';
        form.style.height = '100%';
        form.id = 'create_person';

        const h = Canvas.h;
        form.appendChild(this.generateInputText('name', 'Name', new Vec2(0, h*35).add(this.pos)));
        this.action === FromAction.AddRelationship &&
            form.appendChild(this.generateInputText('family', 'Family', new Vec2(0, h*45).add(this.pos)));
        form.appendChild(this.generateInputText('dob', 'Date of Birth', new Vec2(0, h*55).add(this.pos)));
        form.appendChild(this.generateInputText('pob', 'Place of Birth', new Vec2(0, h*65).add(this.pos)));

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

        inputText.autocomplete = 'off';

        inputText.style.outline = '0';
        inputText.style.outlineOffset = '0';

        return inputText;
    }
}