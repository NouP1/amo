import { ConfigService } from '@nestjs/config';
import { Lead } from './../../../amo-crm-frontend/src/types';
export declare class LeadsService {
    private configService;
    private readonly accessToken;
    private readonly subdomain;
    constructor(configService: ConfigService);
    getLeads(query?: string): Promise<{
        _embedded: {
            leads: Lead[];
        };
    }>;
    getResponsibleUser(userId: number): Promise<any>;
}
