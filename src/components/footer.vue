<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="footer">
    <div class="footer-nav float-right">
      <b-button to="/" size="sm" variant="link" class="footer-nav-link">О компании</b-button> &middot;
      <b-button to="/" size="sm" variant="link" class="footer-nav-link">Инвесторам</b-button> &middot;
      <b-button :to="{ name: 'developers' }" size="sm" variant="link" class="footer-nav-link">Разработчикам</b-button>
    </div>
    &copy; 2019
    <b-button to="/" size="sm" variant="link" class="footer-nav-link">Условия использования</b-button>
  </div>
</template>

<script>
  export default {
    name: "Footer"
  }
</script>

<style scoped>
  .footer {
    padding: 15px 5px;
  }
</style>
