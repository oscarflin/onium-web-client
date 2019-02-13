<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div id="viewRequest">
    <div v-if="eventCreateResponse" class="alert alert-success createResponseAlert">Ответ на заявку был успешно создан</div>
    <requests-type-view :is="componentLoader"/>
  </div>
</template>

<script>
  export default {
    name: 'viewRequest',
    props: [
      'id',
      'eventCreateResponse'
    ],
    computed: {
      componentLoader() {
        return () => import('./components/' + this.$store.getters.userProfile.type)
      }
    }
  }
</script>

<style scoped>
  .createResponseAlert {
    border-radius: 0 !important;
    margin: 0;
  }
</style>
