<template>
  <div id="app">
    <vue-painting
      :img="require('./assets/bg.png')"
      @saveImage="onSaveImage"
      @copyImage="onCopyImage"
      @quit="onQuitDraw">></vue-painting>
  </div>
</template>

<script>
import VuePainting from '../../src/index'
// import VuePainting from '../../dist/vue-painting'

export default {
  name: 'App',
  methods: {
    onSaveImage (blobFile) {

    },
    onCopyImage (blobFile) {

    },
    onQuitDraw (a) {

    }
  },
  components: {
    VuePainting
  }
}
</script>

<style>
#app {
  margin: 20px;
  height: 500px;
}
</style>
