<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <b-navbar toggleable="md" type="dark" variant="primary" class="navbar-wrapper">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand to="/">
      <img src="../assets/logo.png" alt="ONIUM">
    </b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav v-if="this.$store.getters.isAuthenticated">
        <b-nav-item to="/requests">Заявки <b-badge v-if="this.$store.getters.requestsCounter" variant="primary" class="nav-badge">{{ this.$store.getters.requestsCounter }}</b-badge></b-nav-item>
        <b-nav-item to="/contacts">Контакты <b-badge v-if="this.$store.getters.dialogsCounter" variant="primary" class="nav-badge">{{ this.$store.getters.dialogsCounter }}</b-badge></b-nav-item>
        <b-nav-item to="/events">События <b-badge v-if="this.$store.getters.eventsCounter" variant="primary" class="nav-badge">{{ this.$store.getters.eventsCounter }}</b-badge></b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-if="this.$store.getters.isAuthenticated">
        <b-nav-item-dropdown right>
          <template slot="button-content">
            {{ this.$store.getters.userProfile.name }}
          </template>
          <b-dropdown-item :to="{ name: 'profile'}">Профиль</b-dropdown-item>
          <b-dropdown-item v-on:click="logout">Выход</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto" v-if="!this.$store.getters.isAuthenticated">
        <b-nav-item to="/signin">Вход</b-nav-item>
        <b-nav-item to="/signup">Регистрация</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
  import {
    USER_AUTH_LOGOUT
  } from '../store/actions/users'

  export default {
    name: "Navbar",
    methods: {
      logout: function () {
        this.$store.dispatch(USER_AUTH_LOGOUT)
          .then(() => {
            this.$router.push({ name: 'home' })
          })
      }
    }
  }
</script>

<style scoped>
  .navbar-wrapper {
    border-left: 1px solid #ced4da;
    border-right: 1px solid #ced4da;
  }
  .nav-badge {
    border: 1px solid #fff;
  }
</style>
