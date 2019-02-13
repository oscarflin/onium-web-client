<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="home">
    <index-seeker v-if="show.seeker"/>
    <index-realtor v-if="show.realtor"/>
    <div class="controls">
      <b-button to="/signup" size="lg" variant="outline-danger">Начать работу</b-button>
      <b-form-radio-group buttons button-variant="outline-primary" size="lg" v-model="selected" :options="options" class="float-right"/>
    </div>
  </div>
</template>

<script>
  import IndexSeeker from './components/seeker'
  import IndexRealtor from './components/realtor'

  export default {
    name: 'home',
    data () {
      return {
        show: {
          seeker: true,
          realtor: false
        },
        selected: 'seeker',
        options: [
          { text: 'Риелтору', value: 'realtor' },
          { text: 'Соискателю', value: 'seeker' }
        ]
      }
    },
    watch: {
      selected: function (value) {
        switch (value) {
          case 'seeker':
            this.show.seeker = true;
            this.show.realtor = false;
            break;
          case 'realtor':
            this.show.seeker = false;
            this.show.realtor = true;
            break;
        }
      }
    },
    components: {
      IndexSeeker,
      IndexRealtor
    }
  }
</script>

<style scoped>
  .controls {
    margin: 30px;
  }
</style>
