import { NewPersonData } from "../../types/TreeTypes";

export class AddParentEvent extends CustomEvent<NewPersonData> {
    constructor(data: NewPersonData) {
        super('add-parent', { detail: data });
    }
}
