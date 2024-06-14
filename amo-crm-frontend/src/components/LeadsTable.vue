<template>
  <div>
    <h1>Leads</h1>
    <table v-if="leads.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Status</th>
          <th>Responsible User</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in leads" :key="lead.id">
          <td>{{ lead.name }}</td>
          <td>{{ lead.price }}</td>
          <td>{{ lead.status }}</td>
          <td>{{ lead.responsibleUser }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      No leads found.
    </div>
  </div>
</template>

<script lang="ts">
import { Lead } from '@/types';
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  setup() {
    const leads = ref([] as Lead[]);

    const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/leads');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();

        if (data._embedded && data._embedded.leads) {
          // Преобразуем данные о сделках, обрабатывая промисы на сервере
          const processedLeads = await Promise.all(data._embedded.leads.map(async (lead: any) => ({
            id: lead.id,
            name: lead.name,
            price: lead.price,
            status: await getStatusName(lead.status_id),
            responsibleUser: await getResponsibleUser(lead.responsible_user_id),
          })));

          leads.value = processedLeads;
        }
      } catch (error) {
        console.error('Failed to fetch leads', error);
      }
    };

    const getStatusName = async (statusId: number) => {
      try {
        const response = await fetch(`http://localhost:3000/api/statuses/${statusId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.name;
      } catch (error) {
        console.error('Failed to fetch status', error);
        return 'Unknown';
      }
    };

    const getResponsibleUser = async (userId: number) => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.name;
      } catch (error) {
        console.error('Failed to fetch responsible user', error);
        return 'Unknown';
      }
    };

    onMounted(fetchLeads);

    return {
      leads,
    };
  },
});
</script>
<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

input {
  margin-bottom: 20px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
</style>