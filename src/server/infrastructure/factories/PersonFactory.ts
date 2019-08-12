import { Service } from "typedi";

import { Person } from '../../domain/Person';
import { PersonModel } from "../models/PersonModel";

@Service()
export class PersonFactory {
    public createItem(item: PersonModel): Person {
        const person = new Person(item);

        return person;
    }

    public createList(items: PersonModel[]): Person[] {
        
        return items.map(item => this.createItem(item));
    }
}