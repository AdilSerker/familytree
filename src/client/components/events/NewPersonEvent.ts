import { NewPersonData } from "../../types/TreeTypes";

export class NewPersonEvent extends CustomEvent<NewPersonData> {
    constructor(data: NewPersonData) {
        super('new-person', { detail: data });
    }
}
