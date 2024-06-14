<template>
  <div id="app">
    <LeadsTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LeadsTable from './components/LeadsTable.vue';

export default defineComponent({
  name: 'App',
  components: {
    LeadsTable,
  },
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f5f5f5;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>