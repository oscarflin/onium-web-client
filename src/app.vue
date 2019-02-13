<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div id="app">
    <loading
      :active.sync="this.$store.getters.processing"
      :can-cancel="false"
      :is-full-page="true"
      color="#007bff"
      :height="128"
      :width="128"
      :opacity="0.8"
      class="processing"
    />
    <b-alert
      v-if="this.$store.getters.init === false"
      show
      variant="danger"
      class="errorInitAlert"
    >
      Ошибка инициализации приложения. Попробуйте через несколько минут.
    </b-alert>
    <b-container
      v-if="this.$store.getters.init"
      class="container"
    >
      <div class="wrapper">
        <nav-bar/>
        <router-view class="view"/>
      </div>
      <Footer/>
    </b-container>
  </div>
</template>

<script>
  import {
    USER_INIT
  } from './store/actions/users'

  import Loading from 'vue-loading-overlay';
  import NavBar from './components/navbar';
  import Footer from './components/footer'

  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: 'app',
    components: {
      Loading,
      NavBar,
      Footer
    },
    mounted() {
      this.$store.dispatch(USER_INIT);
    }
  }
</script>

<style scoped>
  .processing {
    z-index: 99999;
  }
  .errorInitAlert {
    border-radius: 0 !important;
  }
  .wrapper {
    box-shadow: 0 0 10px #e3e3e3;
  }
  .view {
    border-left: 1px solid #ced4da;
    border-right: 1px solid #ced4da;
    border-bottom: 1px solid #ced4da;
  }
</style>
