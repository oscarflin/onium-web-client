<!--
 This file is subject to the terms and conditions defined in
 file 'LICENSE', which is part of this source code package.
 -->

<template>
  <div class="indexRealtor">
    <b-carousel class="index-carousel"
                controls
                indicators
                background="#ababab"
                :interval="4000"
                img-width="1110"
                img-height="450"
                v-model="slide"
                @sliding-start="onSlideStart"
                @sliding-end="onSlideEnd"
    >
      <b-carousel-slide caption="Первый слайд для риелторов" img-src="https://picsum.photos/1024/480/?image=1">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque
          ut lacus vel interdum.
        </p>
      </b-carousel-slide>
      <b-carousel-slide caption="Второй слайд для риелторов" img-src="https://picsum.photos/1024/480/?image=504">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque
          ut lacus vel interdum.
        </p>
      </b-carousel-slide>
      <b-carousel-slide caption="Третий слайд для риелторов" img-src="https://picsum.photos/1024/480/?image=442">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          eros felis, tincidunt a tincidunt eget, convallis vel est. Ut pellentesque
          ut lacus vel interdum.
        </p>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
  export default {
    name: 'indexRealtor',
    data () {
      return {
        slide: 0,
        sliding: null
      }
    },
    methods: {
      onSlideStart() {
        this.sliding = true
      },
      onSlideEnd() {
        this.sliding = false
      }
    }
  }
</script>

<style scoped>
  .index-carousel {
    text-shadow: 1px 1px 2px #333;
  }
</style>
