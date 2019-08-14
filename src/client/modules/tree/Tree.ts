import { NodeParams, ColorScheme } from "../../types/TreeTypes";
import { NodeTree } from "./NodeTree";
import { Vec2 } from "../../components/Vec2";
import { TreeEvent } from "../../components/events/TreeEvent";
import { InterfaceEvent } from "../../components/events/UIEvent";
import { TreeLockEvent } from "../../components/events/TreeLockEvent";
import { Canvas } from "../../components/Canvas";

export type GroupedNodes = {
    [key: string]: NodeTree[]
}

const FIRST_GENERATION = 1;

export class Tree {
    
    public lockPos: boolean;

    private nodes: NodeTree[];

    private intervalX: number;
    private intervalY: number;

    private zoomCount: number;

    public constructor(treeData: NodeParams[]) {
        this.nodes = treeData.length ? treeData.map(item => new NodeTree(item)) : [];

        this.intervalX = 5;
        this.intervalY = -40;
        this.lockPos = false;

        this.init();

        window.addEventListener('ui', this.onClick.bind(this), false);

        window.addEventListener('tree-lock', (e: TreeLockEvent) => {
            this.lockPos = e.detail;
        }, false);

        if (!this.nodes.length) {
            window.dispatchEvent(new Event('tree-is-empty'));
        }

        if (this.nodes.length) {
            window.dispatchEvent(new Event('tree-is-not-empty'));
        }
    }

    public get pos() {
        return this.getFirstGenerationNode().pos;
    }

    public zoomTouch(touch1: Vec2, touch2: Vec2) {
        if (!this.nodes.length) return;
        const centerDot = touch2.clone().sub(touch1).divideScalar(2);

        if (!this.zoomCount) { this.zoomCount = touch2.clone().sub(centerDot).length(); }

        const delta = touch2.clone().sub(centerDot).length() - this.zoomCount;

        this.nodes.forEach(item => {
            const vec = item.pos.clone().sub(centerDot);
            item.pos.addScaledVector(vec.normalize(), delta);
        });

        this.zoomCount = touch2.clone().sub(centerDot).length();

    }

    public zoom(mousePos: Vec2, scale: number, isNegate: boolean) {
        if (!this.nodes.length) return;
        if (isNegate) {
            this.nodes.forEach(item => {
                const vec = mousePos.clone().sub(item.pos);
                item.pos.addScaledVector(vec, scale);
            });
        } else {
            this.nodes.forEach(item => {
                const vec = item.pos.clone().sub(mousePos);
                item.pos.addScaledVector(vec, scale);
            });
        }
    }

    public draw(context: CanvasRenderingContext2D) {
        this.drawConnection(context, this.getFirstGenerationNode());
        this.nodes.forEach(item => item.draw(context));
    }

    public move(v: Vec2) {
        if (!this.nodes.length || this.lockPos) return;
        this.getFirstGenerationNode().move(v);
    }

   
    private getFirstGenerationNode(): NodeTree {
        return this.nodes.find(item => item.generation === FIRST_GENERATION);
    }

    private drawConnection(context: CanvasRenderingContext2D, node: NodeTree) {
        if (node && node.isHaveChildren()) {
            const parentPosition = node.pos;
            const childrenPositions = node.children.map(item => item.pos);

            childrenPositions.forEach(item => this.drawLine(context, parentPosition, item));

            node.children.forEach(item => this.drawConnection(context, item));
        }
    }

    private drawLine(context: CanvasRenderingContext2D, from: Vec2, to: Vec2): void {
        context.fillStyle = ColorScheme.Black;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
    }

    private init() {
        this.sortNode();
        this.buildTree(this.findLastGeneration());
        this.formatTree(this.findLastGeneration());
        this.centeredTree();
    }

    private centeredTree() {
        if (!this.nodes.length) return;
        const node = this.nodes.find(item => item.generation === FIRST_GENERATION);

        const shiftX = Canvas.w*40  - node.pos.x;
        const shiftY = Canvas.h * 75 - node.pos.y;

        node.move(new Vec2(shiftX, shiftY));

    }

    private formatTree(generation: number) {
        if (!generation) { return; }

        const generationNodes = this.nodes.filter(item => item.generation === generation);

        generationNodes.forEach((item, i) => {
            item.pos.setY(this.intervalY * generation);

            if (item.isHaveChildren()) {
                item.setPositionByChildren();

            } else {
                item.pos.setX(this.intervalX * (i + 1));
            }

            if (i) {
                const range = this.intervalX - generationNodes[i - 1].radius + item.radius;

                if (item.getRangeX().min < generationNodes[i - 1].getRangeX().max + range) {
                    item.setLeftEdgePosition(generationNodes[i - 1].getRangeX().max + range);
                }
                if (item.getRangeX().min > generationNodes[i - 1].getRangeX().max + range) {
                    item.setLeftEdgePosition(generationNodes[i - 1].getRangeX().max + range);
                }
            }

        });

        this.formatTree(--generation);
    }

    private buildTree(generation: number) {
        if (!generation) { return; }

        const generationNodes = this.nodes.filter(item => item.generation === generation);
        const groupedNodes = this.groupNodesByParent(generationNodes);

        for (const key in groupedNodes) {
            const parent = this.nodes.find(item => item.id === key);

            parent && parent.addChildren(groupedNodes[key]);
        }

        generation && this.buildTree(--generation);
    }

    private findLastGeneration(): number {
        let lastGen = 0;
        this.nodes.forEach(item => {
            if (item.generation > lastGen) {
                lastGen = item.generation
            }
        });

        return lastGen;
    }

    private sortNode() {
        this.nodes = this.nodes.sort((a: NodeTree, b: NodeTree) => {
            if (a.parentId < b.parentId) {
                return -1;
            }
            if (a.parentId > b.parentId) {
                return 1;
            }
            
            return 0;

        })
    }

    private groupNodesByParent(nodes: NodeTree[]): GroupedNodes {
        return nodes.reduce((agr, item) => {
            if (!agr[item.parentId] || !agr[item.parentId].length) {
                agr[item.parentId] = [];
            }
            agr[item.parentId].push(item);
            return agr;
        }, {} as GroupedNodes);
    }

    private onClick(e: InterfaceEvent) {
        if (!this.treeMatch(e.detail)) {
            window.dispatchEvent(new TreeEvent(null));
        }
    }

    private treeMatch(v: Vec2): boolean {
        for (let node of this.nodes) {
            if (node.isClickable(v)) {
                return true;
            }
        }

        return false;
    }


}
