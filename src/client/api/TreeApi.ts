import { NodeParams, TreeResponse } from "../types/TreeTypes";



export class TreeApi {
    static async getTree(id: string = '814de0e2-3624-4110-9d1f-cac1644db8d5'): Promise<TreeResponse> {
        const response = await fetch(`http://${window.location.hostname}:8080/api/tree/${id}`);
        return response.json();
    }

    static async createTree(familyName: string): Promise<void> {
        const response = await fetch(`http://${window.location.hostname}:8080/api/tree/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: familyName })
        });

    }
}