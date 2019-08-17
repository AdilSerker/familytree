import { PersonRelationshipForm } from './../../server/types.d';
import { PersonForm, PersonData } from "../types/TreeTypes";

export class PersonApi {

    static async createPerson(data: PersonForm): Promise<PersonData> {
        const response = await fetch(`http://${window.location.hostname}:8080/api/person/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    static async addChild(data: PersonForm): Promise<PersonData> {
        const URL = `http://${window.location.hostname}:8080/api/person/${data.parentId}/child`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    static async addParent(data: PersonForm): Promise<PersonData> {
        const URL = `http://${window.location.hostname}:8080/api/person/parent`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    static async addRelationship(data: PersonRelationshipForm): Promise<PersonData> {
        const URL = `http://${window.location.hostname}:8080/api/person/${data.relationship}/relationship`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    static async getPersonList(params: { ids: string[] }): Promise<PersonData[]> {
        const url = `http://${window.location.hostname}:8080/api/person?ids=${
            params.ids.reduce((a, i) => { return a + i + ',' }, '').slice(0, -1)
        }`;

        const response = await fetch(url);

        return response.json();
    }
}