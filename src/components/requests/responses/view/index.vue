<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div id="viewRequestResponse">
    <request-response-type-view :is="componentLoader"/>
  </div>
</template>

<script>
  export default {
    name: 'viewRequestResponse',
    props: [
      'id'
    ],
    computed: {
      componentLoader() {
        return () => import('./components/' + this.$store.getters.userProfile.type)
      }
    }
  }
</script>
