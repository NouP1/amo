export interface Contact {
    id: number;
    name: string;
}
export interface Lead {
    id: number;
    name: string;
    price: number;
    status: {
        id: number;
        name: string;
    };
    contacts: Contact[];
    responsibleUser: string;
}
