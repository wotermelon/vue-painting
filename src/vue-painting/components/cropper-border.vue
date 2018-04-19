<template>
  <div class="crop-border-box">
    <span class="crop-line line-top"></span>
    <span class="crop-line line-left"></span>
    <span class="crop-line line-bottom"></span>
    <span class="crop-line line-right"></span>
    <!---->
    <span class="crop-point left-top"></span>
    <span class="crop-point left-mid"></span>
    <span class="crop-point left-bottom"></span>
    <span class="crop-point bottom-mid"></span>
    <span class="crop-point right-bottom"></span>
    <span class="crop-point right-mid"></span>
    <span class="crop-point right-top"></span>
    <span class="crop-point top-mid"></span>
    <!---->
  </div>
</template>

<script>
export default {
  name: 'cropper-border'
}
</script>

<style scoped lang="less">
  .crop-border-box {

    span {
      z-index: 1000;
    }

    .crop-line {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      opacity: .1;
    }

    .line-top {
      top: -3px;
      left: 0;
      height: 5px;
      // cursor: n-resize;
    }

    .line-left {
      left: -3px;
      top: 0;
      width: 5px;
      // cursor: w-resize;
    }

    .line-bottom {
      bottom: -3px;
      left: 0;
      height: 5px;
      // cursor: s-resize;
    }

    .line-right {
      right: -3px;
      top: 0;
      width: 5px;
      // cursor: e-resize;
    }

    .crop-point {
      position: absolute;
      width: 5px;
      height: 5px;
      opacity: .75;
      background-color: #39f;
      // border-radius: 100%;
    }

    .left-top {
      top: -3px;
      left: -3px;
      // cursor: nw-resize;
    }

    .left-mid {
      top: 50%;
      margin-top: -3px;
      left: -3px;
      // cursor: w-resize;
    }

    .left-bottom {
      bottom: -3px;
      left: -3px;
      // cursor: sw-resize;
    }

    .bottom-mid {
      bottom: -3px;
      left: 50%;
      margin-left: -3px;
      // cursor: s-resize;
    }

    .right-bottom {
      bottom: -3px;
      right: -3px;
      // cursor: nw-resize;
    }

    .right-mid {
      top: 50%;
      margin-top: -3px;
      right: -3px;
      // cursor: w-resize;
    }

    .right-top {
      top: -3px;
      right: -3px;
      // cursor: ne-resize;
    }

    .top-mid {
      top: -3px;
      left: 50%;
      margin-left: -3px;
      // cursor: n-resize;
    }
  }
</style>
