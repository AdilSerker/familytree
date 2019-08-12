import { Vec2 } from "../Vec2";

export class InterfaceEvent extends CustomEvent<Vec2> {
    constructor(vector: Vec2) {
        super('ui', { detail: vector });
    }
}