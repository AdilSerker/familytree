import { PersonData } from './../types/TreeTypes.d';
export class Store {
    private static instance: Store;
    private relationshipPerson: Map<string, PersonData>;

    constructor() {
        this.relationshipPerson = new Map();
    }

    public static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }

        return Store.instance;
    }

    public set(persons: PersonData[]) {
        persons.forEach(i => {
            this.relationshipPerson.set(i.id, i);
        });
    }

    public get(id: string) {
        return this.relationshipPerson.get(id);
    }

}