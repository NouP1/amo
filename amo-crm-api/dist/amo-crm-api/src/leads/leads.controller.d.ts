import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    getLeads(query?: string): Promise<{
        _embedded: {
            leads: import("../../../amo-crm-frontend/src/types").Lead[];
        };
    }>;
}
