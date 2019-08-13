import { Canvas } from '../components/Canvas';
import { TreeApi } from '../api/TreeApi';
import { Tree } from '../modules/tree/Tree';
import { Vec2 } from '../components/Vec2';
import { UI } from '../modules/ui/UI';
import { InterfaceEvent } from '../components/events/UIEvent';
import { NewPersonEvent } from '../components/events/NewPersonEvent';
import { PersonApi } from '../api/PersonApi';
import { AddChildEvent } from '../components/events/AddChildEvent';
import { AddParentEvent } from '../components/events/AddParentEvent';

export class App {
    private canvas: Canvas;
    private tree: Tree;
    private ui: UI;

    private isDragState: boolean;
    private lastWindowCenter: Vec2;

    private lastCursorPos: Vec2;
    private cursorPos: Vec2;

    private familyId: string;

    public constructor() {
        // window.addEventListener("mousedown", (e: MouseEvent) => {
        //     this.isDragState = !this.ui.isClicked(new Vec2(e.clientX, e.clientY));
        //     this.cursorPos = new Vec2(e.clientX, e.clientY);
        // }, false);
        // window.addEventListener("mouseup", this.mouseUp.bind(this), false);
        // window.addEventListener("mousemove", this.mouseMove.bind(this), false);

        this.lastWindowCenter = new Vec2(document.body.clientWidth / 2, 0);
        this.cursorPos = new Vec2(document.body.clientWidth/2, document.body.clientHeight/2)
        window.addEventListener("resize", this.resizeWindow.bind(this), false);

        window.addEventListener("wheel", this.zoomApp.bind(this), false);

        window.addEventListener("touchstart", (e: TouchEvent) => {
            
            const touchPos = e.touches.item(0);



            dispatchEvent(new CustomEvent('console', { detail: `count touches ${e.touches.length}` }));

            this.cursorPos = new Vec2(touchPos.clientX, touchPos.clientY);
            this.isDragState = !this.ui.isClicked(this.cursorPos);
            this.lastCursorPos = this.cursorPos;
        }, false);

        window.addEventListener("touchmove", (e: TouchEvent) => {
            const touch1 = e.touches.item(0);
            const touch2 = e.touches.item(1);
            if (e.touches.length > 1) {
                this.zoomTouch(new Vec2(touch1.clientX, touch1.clientY), new Vec2(touch2.clientX, touch2.clientY));
            }
            
            this.lastCursorPos = this.cursorPos;

            this.cursorPos = new Vec2(touch1.clientX, touch1.clientY);
            if (this.isDragState && e.touches.length === 1) {
                this.moveTree(this.cursorPos);
            }

        }, false);

        window.addEventListener("touchend", (e: TouchEvent) => {
            this.isDragState = false;

            if (this.cursorPos.equal(this.lastCursorPos)) {
                window.dispatchEvent(new InterfaceEvent(this.cursorPos));
            }
            this.lastCursorPos = undefined;
        }, false);

        window.addEventListener('new-person', this.createNewPerson.bind(this));
        window.addEventListener('add-child', this.addChild.bind(this));
        window.addEventListener('add-parent', this.addParent.bind(this));
    }

    public async init() {
        this.canvas = Canvas.getInstance();
        this.ui = new UI();

        const tree = await TreeApi.getTree('44805438-0040-40bf-b65b-6a9c24430bff');

        this.ui.serHeaderName(tree.familyName);

        this.tree = new Tree(tree.nodes);
        this.familyId = tree.familyId;
    }

    public run(): void {
        requestAnimationFrame(this.tick.bind(this));
    }

    private resizeWindow() {
        const newCenter = new Vec2(document.body.clientWidth / 2, 0);
        const moveVec = this.lastWindowCenter.clone().sub(newCenter);
        this.tree.move(moveVec.negate());

        this.lastWindowCenter = newCenter;
    }

    private zoomApp(e: WheelEvent) {
        this.tree.zoom(this.cursorPos, 0.01, e.deltaY > 0);
    }

    private zoomTouch(touch1: Vec2, touch2: Vec2) {
        this.tree.zoomTouch(touch1, touch2);
    }

    

    private mouseUp(e: MouseEvent) {
        this.isDragState = false;
        this.lastCursorPos = undefined;

        const clickPos = new Vec2(e.clientX, e.clientY);

        if (this.cursorPos.equal(clickPos)) {
            const uiEvent = new InterfaceEvent(clickPos);

            window.dispatchEvent(uiEvent);
        }
    }


    private mouseMove(e: MouseEvent) {
        this.cursorPos = new Vec2(e.clientX, e.clientY);
        if (this.isDragState) {
            this.moveTree(this.cursorPos);
        }
    }

    private moveTree(v: Vec2) {
        const moveVec = v.clone().sub(this.lastCursorPos);
        this.tree.move(moveVec);
    }


    private tick() {
        requestAnimationFrame(this.tick.bind(this));

        this.update();
        this.render();

    }

    private update() {

    }

    private render() {
        this.canvas.clear();

        this.tree.draw(this.canvas.getContext());
        this.ui.draw();
    }

    private async createNewPerson(e: NewPersonEvent) {

        await PersonApi.createPerson({
            ...e.detail,
            family: this.familyId
        });

        this.ui.hideWidgets();

        const tree = await TreeApi.getTree(this.familyId);
        this.tree = new Tree(tree.nodes);
    }

    private async addChild(e: AddChildEvent) {

        await PersonApi.addChild({
            ...e.detail,
            family: this.familyId
        });

        this.ui.hideWidgets();

        const tree = await TreeApi.getTree(this.familyId);
        this.tree = new Tree(tree.nodes);
    }
    private async addParent(e: AddParentEvent) {

        await PersonApi.addParent({
            ...e.detail,
            family: this.familyId
        });

        this.ui.hideWidgets();

        const tree = await TreeApi.getTree(this.familyId);
        this.tree = new Tree(tree.nodes);
    }

}
