import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Lead } from './../../../amo-crm-frontend/src/types';

@Injectable()
export class LeadsService {
  private readonly accessToken: string;
  private readonly subdomain: string;

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('AMOCRM_ACCESS_TOKEN');
    this.subdomain = this.configService.get<string>('AMOCRM_SUBDOMAIN');
  //   console.log('AccessToken:', this.accessToken);
  //   console.log('Subdomain:', this.subdomain);
  }

  async getLeads(query?: string): Promise<{ _embedded: { leads: Lead[] } }> {
    try {
      const leadsResponse = await axios.get(`https://${this.subdomain}.amocrm.ru/api/v4/leads`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: query ? { query } : {},
      });

      const pipelinesResponse = await axios.get(`https://${this.subdomain}.amocrm.ru/api/v4/leads/pipelines`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      // const pipelines = pipelinesResponse.data._embedded.pipelines.reduce((map: any, pipeline: any) => {
      //   pipeline.statuses.forEach((status: any) => {
      //     map[status.id] = status.name;
      //   });
      //   return map;
      // }, {});

      const leadsWithDetails = await Promise.all(leadsResponse.data._embedded.leads.map(async (lead: any) => ({
        id: lead.id,
        name: lead.name,
        price: lead.price,
        // status: pipelines[lead.status_id] || 'Unknown Status',
        responsibleUser: await this.getResponsibleUser(lead.responsible_user_id),
      })));

      return { _embedded: { leads: leadsWithDetails } };
    } catch (error) {
      console.error('Error fetching leads:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async getResponsibleUser(userId: number) {
    try {
      const response = await axios.get(`https://${this.subdomain}.amocrm.ru/api/v4/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });
      return response.data.name; 
    } catch (error) {
      console.error('Failed to fetch responsible user', error);
      return 'Unknown'; 
    }
  }
}