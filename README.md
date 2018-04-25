# vue-painting

<!-- ![License](https://img.shields.io/npm/l/express.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com) -->

A Vue.js(v2.x+) component for cropping and painting image.

see：[demo](https://wotermelon.github.io/vue-painting/)

## Installation

### NPM

```
npm install vue-painting --save
```

#### ES6:

```js
import VuePainting from 'vue-painting'

new Vue({
  components: {
    VuePainting
  }
})
```
#### CommonJS:

```js
const  VuePainting = require('vue-painting')

new Vue({
  components: {
    VuePainting
  }
})
```

### Browser

```html
<body>
  <script src="path/to/vue.js"></script>
  <script src="path/to/vue-painting.js"></script>
  <script>
    new Vue({
      components: {
        'vue-painting': VuePainting
      }
    })
  </script>
</body>
```

## Usage

### Props

| Prop | Type   | Descrition                               |
| ---- | ------ | ---------------------------------------- |
| img  | String | The image source,can be `base64` and `url` |

### Events

| Name      | Param[Type]     | Descrition                        |
| --------- | --------------- | --------------------------------- |
| saveImage | clipImage[Blob] | dispatch when `save button` click |
| copyImage | clipImage[Blob] | dispatch when `√` click           |
| quit      |                 | dispatch when `quit`              |

## License

[MIT](https://opensource.org/licenses/MIT)

