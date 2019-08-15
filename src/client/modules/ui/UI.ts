import { Vec2 } from "../../components/Vec2";
import { Header } from "./Header";
import { PersonWidget } from "./widgets/PersonWidget";
import { NewPersonWidget } from "./widgets/NewPersonWidget";
import { Footer } from './Footer';

export class UI {
    private header: Header;
    private footer: Footer;
    private personWidget: PersonWidget;
    private newPersonWidget: NewPersonWidget;

    public constructor() {
        this.header = new Header();
        this.footer = new Footer();
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
        this.footer.draw();
    }

    public isClicked(mousePos: Vec2): boolean {
        return this.header.isClicked(mousePos);
    }

    public hideWidgets() {
        this.newPersonWidget.setInvisible();
        this.personWidget.setInvisible();
    }
}
