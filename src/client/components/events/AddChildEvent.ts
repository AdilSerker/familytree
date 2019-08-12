import { NewPersonData } from "../../types/TreeTypes";

export class AddChildEvent extends CustomEvent<NewPersonData> {
    constructor(data: NewPersonData) {
        super('add-child', { detail: data });
    }
}
