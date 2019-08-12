import { NodeTree } from "../../modules/tree/NodeTree";

export class TreeEvent extends CustomEvent<NodeTree> {
    constructor(node: NodeTree) {
        super("selecttree", { detail: node });
    }
}