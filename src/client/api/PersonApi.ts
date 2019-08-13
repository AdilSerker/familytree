import { PersonForm } from "../types/TreeTypes";

export class PersonApi {

    static async createPerson(data: PersonForm): Promise<any> {
        const response = await fetch(`https://${window.location.hostname}:8080/api/person/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    static async addChild(data: PersonForm): Promise<any> {
        const URL = `https://${window.location.hostname}:8080/api/person/${data.parentId}/child`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }

    static async addParent(data: PersonForm): Promise<any> {
        const URL = `https://${window.location.hostname}:8080/api/person/parent`;
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return response.json();
    }
}