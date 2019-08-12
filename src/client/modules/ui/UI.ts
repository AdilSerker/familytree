import { Vec2 } from "../../components/Vec2";
import { Header } from "./Header";
import { PersonWidget } from "./widgets/PersonWidget";
import { NewPersonWidget } from "./widgets/NewPersonWidget";

export class UI {
    private header: Header;
    private personWidget: PersonWidget;
    private newPersonWidget: NewPersonWidget;

    public constructor() {
        this.header = new Header();
        this.personWidget = new PersonWidget();
        this.newPersonWidget = new NewPersonWidget();
    }

    public serHeaderName(name: string): void {
        this.header.setTitle(name);
    }

    public draw() {
        this.personWidget.draw();
        this.newPersonWidget.draw();
        this.header.draw();
    }

    public isClicked(mousePos: Vec2): boolean {
        return this.header.isClicked(mousePos);
    }

    public hideWidgets() {
        this.newPersonWidget.setInvisible();
        this.personWidget.setInvisible();
    }
}
