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
      var a = document.createElement('a')
      a.download = `painting-${+new Date}.png`
      a.href = window.URL.createObjectURL(blobFile)
      a.click()
    },
    onCopyImage (blobFile) {
      alert('copyToClipBord')
    },
    onQuitDraw (a) {
      alert('quit')
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
