<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div id="requests">
    <div v-if="eventCreate" class="alert alert-success createRequestAlert">Новая заявка успешно создана</div>
    <div v-if="eventArchived" class="alert alert-success updateSettingsAlert">Заявка успешно перемещена в архив</div>
    <div v-if="eventUpdateSettings" class="alert alert-success updateSettingsAlert">Настройки входящих заявок успешно обновлены</div>
    <requests-type :is="componentLoader"/>
  </div>
</template>

<script>
  export default {
    name: 'requests',
    props: [
      'eventCreate',
      'eventUpdateSettings',
      'eventArchived'
    ],
    computed: {
      componentLoader() {
        return () => import('./components/' + this.$store.getters.userProfile.type)
      }
    }
  }
</script>

<style scoped>
  .createRequestAlert,
  .updateSettingsAlert {
    border-radius: 0 !important;
    margin: 0;
  }
</style>
