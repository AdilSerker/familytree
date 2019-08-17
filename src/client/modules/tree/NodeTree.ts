import { Gender, NodeParams, ColorScheme } from "../../types/TreeTypes";
import { Vec2 } from "../../components/Vec2";
import { InterfaceEvent } from "../../components/events/UIEvent";
import { TreeEvent } from "../../components/events/TreeEvent";

export type RangeX = {
    min: number,
    max: number
}

export class NodeTree {
    public pos: Vec2;
    public radius: number;
    public readonly id: string;
    public readonly generation: number;
    public readonly parentId: string;
    public readonly name: string;
    public readonly born: string;

    public readonly relationship: string;
    public readonly gender: Gender;

    public readonly children: NodeTree[];

    public constructor(nodeParams: NodeParams) {
        const { id, gender, generation, name, parentId, relationship, born } = nodeParams;

        this.generation = generation;
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.relationship = relationship;
        this.gender = gender;
        this.born = born;

        this.radius = 4;

        this.pos = new Vec2();

        this.children = [];

        window.addEventListener('ui', this.onClick.bind(this), false);
    }

    public isHaveChildren() {
        return !!this.children.length;
    }

    public setPositionByChildren() {
        const sum = this.children.reduce((sum, item) => sum + item.pos.x, 0);

        this.pos.setX(sum / this.children.length);
    }

    public addChildren(children: NodeTree[]) {
        this.children.push(...children);
    }

    public move(v: Vec2): void {
        this.pos.add(v);

        this.children.forEach(item => item.move(v));
    }

    public setLeftEdgePosition(scalar: number): void {
        const newXValue = scalar - this.getLeftEdgePosition();

        this.move(new Vec2(newXValue, 0));
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        context.fill();
    }

    public getRangeX(): RangeX {
        return {
            min: this.getLeftEdgePosition(),
            max: this.getRightEdgePosition()
        }
    }

    public isClickable(v: Vec2): boolean {
        return this.pos.clone().sub(v).length() < this.radius*5;
    }

    private onClick(e: InterfaceEvent) {
        if (!this.isClickable(e.detail)) return;

        window.dispatchEvent(new TreeEvent(this));
    }

    private getLeftEdgePosition(): number {
        if (!this.children.length) {
            return this.pos.x - this.radius;
        }

        let value = this.children[0].getRangeX().min;
        this.children.forEach(item => {
            value = item.getRangeX().min < value ? item.getRangeX().min : value;
        });

        return value;
    }

    private getRightEdgePosition(): number {
        if (!this.children.length) {
            return this.pos.x + this.radius;
        }

        let value = this.children[0].getRangeX().max;
        this.children.forEach(item => {
            value = item.getRangeX().max > value ? item.getRangeX().max : value;
        });

        return value;
    }

}