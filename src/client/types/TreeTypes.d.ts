import { NodeTree } from "../modules/tree/NodeTree";

export const enum Gender {
    Male = 'male',
    Female = 'female'
}

export const enum WidgetState {
    Closed,
    Opened,
    Drag,
    CreatePerson
}

export type TreeResponse = {
    familyId: string;
    familyName: string;
    nodes: NodeParams[]
}

export type NodeParams = {
    generation: number,
    id: string,
    name: string,
    parentId: string,
    relationship: string,
    gender: Gender,
    born: string
}

export const enum ColorScheme {
    White = "rgba(255, 255, 255, 1)",
    WhiteOpacity = "rgba(255, 255, 255, 0.75)",
    Black = "rgba(0, 0, 0, 1)",
    BlackOpacity = "rgba(0, 0, 0, 0.4)"
}

export type NewPersonData = {
    name: string,
    gender: Gender,
    generation: number,
    relationship?: string,
    familyName?: string,
    born?: string;
    age?: string;
    parentId?: string;
}

export type PersonForm = {
    name: string;
    family: string;
    generation: number;
    gender: string;
    born?: string;
    age?: string;
    parentId?: string;
}

export interface PersonData {
    id: string;
    name: string;
    born: string;
    generation: number;
    gender: string;
    family: string;
    parentId: string;
    relationship: string;
}


