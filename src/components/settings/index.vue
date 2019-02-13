<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="settings">
    <settings-type :is="componentLoader"/>
  </div>
</template>

<script>
  export default {
    name: 'settings',
    computed: {
      componentLoader() {
        return () => import('./components/' + this.$store.getters.userProfile.type)
      }
    }
  }
</script>
