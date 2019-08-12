export type NodeTreeView = {
    id: string,
    name: string,
    generation: string,
    gender: string,
    born: string,
    parent: string,
    family: string,
    relationship: string,
    children: NodeTreeView[]
}


export type TreeView = {
    nodes: NodeTreeView[]
}

export type TreeFrom = {
    name: string;
}

export type PersonForm = {
    name: string;
    family: string;
    generation: number;
    gender: string;
    born?: string;
    relationship?: string;
    parentId?: string;
}

export type PersonChildForm = {
    name: string;
    gender: string;
    born?: string;
}

export type PersonRelationshipForm = {
    name: string;
    familyName: string;
    generation: number;
    gender: string;
    born?: string;
    relationship: string;
    parentId?: string;
}



