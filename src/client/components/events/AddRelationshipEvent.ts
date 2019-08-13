import { NewPersonData } from "../../types/TreeTypes";

export class AddRelationshipEvent extends CustomEvent<NewPersonData> {
    constructor(data: NewPersonData) {
        super('add-relationship', { detail: data });
    }
}
