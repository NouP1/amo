"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
let LeadsService = class LeadsService {
    constructor(configService) {
        this.configService = configService;
        this.accessToken = this.configService.get('AMOCRM_ACCESS_TOKEN');
        this.subdomain = this.configService.get('AMOCRM_SUBDOMAIN');
    }
    async getLeads(query) {
        try {
            const leadsResponse = await axios_1.default.get(`https://${this.subdomain}.amocrm.ru/api/v4/leads`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
                params: query ? { query } : {},
            });
            const pipelinesResponse = await axios_1.default.get(`https://${this.subdomain}.amocrm.ru/api/v4/leads/pipelines`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            const leadsWithDetails = await Promise.all(leadsResponse.data._embedded.leads.map(async (lead) => ({
                id: lead.id,
                name: lead.name,
                price: lead.price,
                responsibleUser: await this.getResponsibleUser(lead.responsible_user_id),
            })));
            return { _embedded: { leads: leadsWithDetails } };
        }
        catch (error) {
            console.error('Error fetching leads:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    async getResponsibleUser(userId) {
        try {
            const response = await axios_1.default.get(`https://${this.subdomain}.amocrm.ru/api/v4/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            });
            return response.data.name;
        }
        catch (error) {
            console.error('Failed to fetch responsible user', error);
            return 'Unknown';
        }
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map