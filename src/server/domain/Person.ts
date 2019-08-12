export type PersonParam = {
    id: string;
    name: string;
    born?: string;
    parentId?: string;
    family: string;
    gender: string;
    generation: number;
    relationship?: string;
    children?: Person[];
}


export class Person {
    public id: string;
    public name: string;
    public born: string;
    public generation: number;
    public gender: string;
    public family: string;
    public parentId: string;
    public relationship: string;
    public children: Person[];

    public constructor(param: PersonParam) {
        const { id, name, born, parentId, family, gender, generation, relationship, children } = param;
        this.id = id;
        this.name = name;
        this.born = born;
        this.generation = generation;
        this.family = family;
        this.gender = gender;
        this.parentId = parentId;
        this.relationship = relationship;
        this.children = children;
    }
}