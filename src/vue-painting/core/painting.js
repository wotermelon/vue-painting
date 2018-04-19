import Konva from 'konva'

export default class Painting {
  constructor ({ container }) {
    this.layers = []
    this.container = document.getElementById(container)
    this._setStyle(this.container, {
      position: 'relative'
    })
    const options = {
      container,
      width: 0,
      height: 0
    }
    this.stage = new Konva.Stage(options)
    this.drawConfig = {
      type: '',
      color: '#000',
      lineWidth: 3
    }
    this.stage.on('contentMousedown.proto', this.onStageDraw.bind(this))
    this.stage.on('canmouseover', () => {
      this.canTextOver = true
    })
    this.stage.on('cannotmouseover', () => {
      this.canTextOver = false
    })
    this.canTextOver = true
    this.init()
  }
  // 设置画笔选项
  setDrawConfig (config) {
    this.drawConfig = Object.assign(this.drawConfig, config)
  }
  // 画背景图
  drawImage (options) {
    this.containerInfo = this.container.getBoundingClientRect()
    this.stage.setWidth(this.containerInfo.width)
    this.stage.setHeight(this.containerInfo.height)
    this.backgroundLayer = new Konva.Layer()
    var yoda = new Konva.Image(options)
    this.backgroundLayer.add(yoda)
    this.stage.add(this.backgroundLayer)
    this.stage.draw()
  }
  // clear
  clear () {
    this.stage.destroyChildren()
    this.layers.length = 0
  }
  // 销毁
  destroy () {
    this.clear()
    this.stage.destroy()
  }
  // 画
  onStageDraw () {
    switch (this.drawConfig.type) {
      case 'pencil':
        this.drawPencil()
        break
      case 'rect':
        this.drawRect()
        break
      case 'arrow':
        this.drawArrow()
        break
      case 'ellipse':
        this.drawEllipse()
        break
      case 'text':
        this.drawText()
        break
      default:
        break
    }
  }
  // 初始化文本框
  init () {
    let textWrapperHtml = `<textarea class="text-hold"></textarea>
      <div>
        <span
          class="text-left"></span>
        <span
          class="text-bottom"></span>
        <span
          class="text-right"></span>
        <span
          class="text-top"></span>
    </div>`
    let textWrapperStyle = `.text-wrap {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
      }
      .text-wrap span {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: .1;
        cursor: move;
      }
      .text-wrap .text-left {
        width: 4px;
        left: -2px;
        top: 0;
      }
      .text-wrap .text-bottom {
        height: 4px;
        bottom: -2px;
        left: 0;
      }
      .text-wrap .text-right {
        width: 4px;
        right: -2px;
        top: 0;
      }
      .text-wrap .text-top {
        height: 4px;
        left: 0;
        top: -2px;
      }
      .text-wrap .text-hold {
        display: block;
        width: 100px;
        word-break: break-all;
        background: transparent;
        border: 1px dashed #000;
        outline: none;
        font-size: 14px;
        min-width: 35px;
      }
      .text-wrap .text-hold::-webkit-scrollbar {
        width: 5px;
        height: 0;
    }`
    this.textWrapper = document.createElement('div')
    this.textWrapper.className = 'text-wrap'
    this.textWrapper.innerHTML = textWrapperHtml
    this.container.appendChild(this.textWrapper)
    let styleEl = document.createElement('style')
    styleEl.innerHTML = textWrapperStyle
    document.body.appendChild(styleEl)
    this.bindEvent()
  }
  // 绑定文本框事件
  bindEvent () {
    this.textarea = this.textWrapper.querySelector('.text-hold')
    // autosize(this.textarea)
    // this.textarea.addEventListener('input', function () {
    //   this._setStyle(this.textarea, {
    //     overflow: 'auto'
    //   })
    // }.bind(this))
    // 拖拽事件
    this.textWrapper.addEventListener('mousedown', (e) => {
      if (e.target.tagName.toLowerCase() === 'span') {
        this._onTextareaDrag(e)
      }
    })
    // 失去焦点事件
    this.textarea.addEventListener('blur', this._onTextareaBlur.bind(this))
    // 聚焦事件
    this.textarea.addEventListener('focus', this._onTextareaFocus.bind(this))
  }
  // 文本框拖拽事件
  _onTextareaDrag (e) {
    // this.triggerDrag = true
    const self = this
    self.canTextOver = false
    let pointPos = {
      x: e.clientX - self.containerInfo.left,
      y: e.clientY - self.containerInfo.top
    }
    let textWrapperInfo = self.textWrapper.getBoundingClientRect()
    let originPos = {
      x: textWrapperInfo.left - self.containerInfo.left,
      y: textWrapperInfo.top - self.containerInfo.top
    }
    window.addEventListener('mousemove', _onMousemove)
    window.addEventListener('mouseup', _onMouseup)

    function _onMousemove (e) {
      let nowX = e.clientX - self.containerInfo.left - pointPos.x + originPos.x
      let nowY = e.clientY - self.containerInfo.top - pointPos.y + originPos.y
      let lastPos = {
        x: nowX <= 0 ? 0 : (nowX + textWrapperInfo.width) >= self.containerInfo.width ? self.containerInfo.width - textWrapperInfo.width : nowX,
        y: nowY <= 0 ? 0 : (nowY + textWrapperInfo.height) >= self.containerInfo.height ? self.containerInfo.height - textWrapperInfo.height : nowY
      }
      self._setStyle(self.textWrapper, {
        left: lastPos.x + 'px',
        top: lastPos.y + 'px'
      })
    }

    function _onMouseup (e) {
      self.canTextOver = true
      self.textarea.focus()
      window.removeEventListener('mousemove', _onMousemove)
      window.removeEventListener('mouseup', _onMouseup)
    }
  }
  // 文本框失去焦点事件
  _onTextareaBlur () {
    if (!this.canTextOver) return
    console.log('textarea blur')
    // 文本框有内容才写入文字
    if (this.textarea.value) {
      this._setTextShape()
      this.textarea.value = ''
    }
    this.isFocus = false
    this._setStyle(this.textWrapper, {
      display: 'none'
    })
  }
  // 文本框聚焦事件
  _onTextareaFocus () {
    console.log('textarea focus')
    this.isFocus = true
  }
  beforeDraw () {
    this.stage.fire('cannotmouseover')
  }
  afterDraw () {
    this.stage.fire('canmouseover')
  }
  drawPencil (options) {
    this.beforeDraw()
    // 如果是聚焦状态，点击其他位置则移开
    if (this.isFocus) {
      return this.textarea.blur()
    }
    var self = this
    const layer = this._createLayer()
    const { shape, canvas } = this._shapeFactory()
    const ctx = canvas.getContext('2d')
    var lastPos = this.stage.getPointerPosition()

    layer.add(shape)
    this.stage.add(layer)
    this.stage.draw()
    ctx.lineJoin = 'round'
    ctx.strokeStyle = this.drawConfig.color
    ctx.lineWidth = this.drawConfig.lineWidth

    window.addEventListener('mousemove', _onDrawPencilMousemove)
    window.addEventListener('mouseup', _onDrawPencilMouseup)

    function _onDrawPencilMousemove (e) {
      var pos = self.stage.getPointerPosition()
      if (!pos) {
        var offsetX = e.clientX - self.containerInfo.left
        var offsetY = e.clientY - self.containerInfo.top
        let width = self.containerInfo.width
        let height = self.containerInfo.height
        pos = {
          x: offsetX >= width ? width : offsetX <= 0 ? 0 : offsetX,
          y: offsetY >= height ? height : offsetY <= 0 ? 0 : offsetY
        }
      }
      self._pencil(ctx, lastPos.x, lastPos.y, pos.x, pos.y)
      lastPos = pos
      layer.draw()
    }
    function _onDrawPencilMouseup () {
      self.afterDraw()
      self.layers.push(layer)
      window.removeEventListener('mousemove', _onDrawPencilMousemove)
      window.removeEventListener('mouseup', _onDrawPencilMouseup)
    }
  }
  drawRect () {
    this.beforeDraw()
    // this.canTextOver = false
    // 如果是聚焦状态，点击其他位置则移开
    if (this.isFocus) {
      return this.textarea.blur()
    }
    const self = this
    const layer = this._createLayer()
    const { shape, canvas } = this._shapeFactory()
    layer.add(shape)
    this.stage.add(layer)
    this.stage.draw()

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = this.drawConfig.color
    ctx.lineWidth = this.drawConfig.lineWidth

    let lastPointerPosition = this.stage.getPointerPosition()
    let originPos = {
      x: lastPointerPosition.x,
      y: lastPointerPosition.y
    }

    window.addEventListener('mousemove', _onDrawPencilMousemove)
    window.addEventListener('mouseup', _onDrawPencilMouseup)

    function _onDrawPencilMousemove (e) {
      let width = self.containerInfo.width
      let height = self.containerInfo.height
      ctx.clearRect(0, 0, width, height)
      var pos = self.stage.getPointerPosition()
      if (!pos) {
        var offsetX = e.clientX - self.containerInfo.left
        var offsetY = e.clientY - self.containerInfo.top
        pos = {
          x: offsetX >= width ? width : offsetX <= 0 ? 0 : offsetX,
          y: offsetY >= height ? height : offsetY <= 0 ? 0 : offsetY
        }
      }
      self._rect(ctx, originPos.x, originPos.y, pos.x, pos.y)
      layer.draw()
    }
    function _onDrawPencilMouseup () {
      self.layers.push(layer)
      self.afterDraw()
      window.removeEventListener('mousemove', _onDrawPencilMousemove)
      window.removeEventListener('mouseup', _onDrawPencilMouseup)
    }
  }
  drawArrow () {
    this.beforeDraw()
    // 如果是聚焦状态，点击其他位置则移开
    if (this.isFocus) {
      return this.textarea.blur()
    }
    const self = this
    const layer = this._createLayer()
    const { shape, canvas } = this._shapeFactory()
    layer.add(shape)
    this.stage.add(layer)
    this.stage.draw()

    const ctx = canvas.getContext('2d')
    ctx.lineJoin = 'round'
    ctx.strokeStyle = this.drawConfig.color
    ctx.lineWidth = this.drawConfig.lineWidth

    let lastPointerPosition = this.stage.getPointerPosition()
    let originPos = {
      x: lastPointerPosition.x,
      y: lastPointerPosition.y
    }

    window.addEventListener('mousemove', _onDrawPencilMousemove)
    window.addEventListener('mouseup', _onDrawPencilMouseup)

    function _onDrawPencilMousemove (e) {
      let width = self.containerInfo.width
      let height = self.containerInfo.height
      ctx.clearRect(0, 0, width, height)
      var pos = self.stage.getPointerPosition()
      if (!pos) {
        var offsetX = e.clientX - self.containerInfo.left
        var offsetY = e.clientY - self.containerInfo.top
        pos = {
          x: offsetX >= width ? width : offsetX <= 0 ? 0 : offsetX,
          y: offsetY >= height ? height : offsetY <= 0 ? 0 : offsetY
        }
      }
      self._arrow(ctx, originPos.x, originPos.y, pos.x, pos.y)
      layer.draw()
    }
    function _onDrawPencilMouseup () {
      self.afterDraw()
      self.layers.push(layer)
      window.removeEventListener('mousemove', _onDrawPencilMousemove)
      window.removeEventListener('mouseup', _onDrawPencilMouseup)
    }
  }
  drawEllipse () {
    this.beforeDraw()
    // 如果是聚焦状态，点击其他位置则移开
    if (this.isFocus) {
      return this.textarea.blur()
    }
    const self = this
    const layer = this._createLayer()
    let lastPointerPosition = this.stage.getPointerPosition()
    let originPos = {
      x: lastPointerPosition.x,
      y: lastPointerPosition.y
    }
    var oval

    this.stage.add(layer)
    window.addEventListener('mousemove', _onDrawPencilMousemove)
    window.addEventListener('mouseup', _onDrawPencilMouseup)

    function _onDrawPencilMousemove (e) {
      oval && oval.destroy()
      var pos = self.stage.getPointerPosition()
      if (!pos) {
        var offsetX = e.clientX - self.containerInfo.left
        var offsetY = e.clientY - self.containerInfo.top
        let width = self.containerInfo.width
        let height = self.containerInfo.height
        pos = {
          x: offsetX >= width ? width : offsetX <= 0 ? 0 : offsetX,
          y: offsetY >= height ? height : offsetY <= 0 ? 0 : offsetY
        }
      }
      oval = self._ellipse(originPos.x, originPos.y, pos.x, pos.y)
      layer.add(oval)
      layer.draw()
    }
    function _onDrawPencilMouseup () {
      self.afterDraw()
      self.layers.push(layer)
      window.removeEventListener('mousemove', _onDrawPencilMousemove)
      window.removeEventListener('mouseup', _onDrawPencilMouseup)
    }
  }
  drawText () {
    // 如果是聚焦状态，点击其他位置则移开
    if (this.isFocus) {
      return this.textarea.blur()
    }
    this._initTextarea()
  }
  // 撤销
  undo () {
    if (!this.layers.length) return
    let nowLayer = this.layers.pop()
    nowLayer.destroy()
  }
  // 转化成图片blob二进制
  toImage (quality = 1) {
    return new Promise((resolve, reject) => {
      let config = {
        quality,
        callback (img) {
          let el = document.createElement('canvas')
          el.width = img.width
          el.height = img.height
          let ctx = el.getContext('2d')
          ctx.drawImage(img, 0, 0)
          el.toBlob((blobFile) => {
            el = null
            resolve(blobFile)
          }, 'image/jpeg', quality)
        }
      }
      this.stage.toImage(config)
    })
  }
  _setTextShape () {
    const layer = this._createLayer()
    this.stage.add(layer)
    const textWrapperInfo = this.textWrapper.getBoundingClientRect()
    const shape = this._text(
      textWrapperInfo.left - this.containerInfo.left,
      textWrapperInfo.top - this.containerInfo.top,
      textWrapperInfo.width,
      textWrapperInfo.height,
      this.textarea.value
    )
    layer.add(shape)
    layer.draw()
    this.layers.push(layer)
    this.textarea.setAttribute('color', '')
    this.textarea.setAttribute('fontSize', '')
  }
  _setStyle (el, styleObj) {
    Object.assign(el.style, styleObj)
  }
  _canvasFactory () {
    const canvas = document.createElement('canvas')
    canvas.width = this.stage.width()
    canvas.height = this.stage.height()
    return canvas
  }
  // 创建涂鸦shape
  _shapeFactory () {
    const _canvas = this._canvasFactory()
    const shape = new Konva.Image({
      image: _canvas,
      x: 0,
      y: 0
    })
    return {
      shape,
      canvas: _canvas
    }
  }
  // 创建layer
  _createLayer () {
    return new Konva.Layer()
  }
  // 获取起点与x轴之间的夹角角度值
  _getAngle (startX, startY, endX, endY) {
    return Math.atan2(endY - startY, endX - startX) * 180 / Math.PI
  }
  _initTextarea () {
    let originPos = this.stage.getPointerPosition()
    this.isFocus = true
    this._setStyle(this.textWrapper, {
      top: originPos.y + 'px',
      left: originPos.x + 'px',
      display: 'block'
    })
    this._setStyle(this.textarea, {
      color: this.drawConfig.color,
      fontSize: this.drawConfig.fontSize + 'px'
    })
    this.textarea.setAttribute('color', this.drawConfig.color)
    this.textarea.setAttribute('fontSize', this.drawConfig.fontSize)
    this.textarea.focus()
  }
  // 矩形
  _rect (ctx, startX, startY, endX, endY) {
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, startY)
    ctx.lineTo(endX, endY)
    ctx.lineTo(startX, endY)
    ctx.lineTo(startX, startY)
    ctx.stroke()
    ctx.closePath()
  }
  // 涂鸦
  _pencil (ctx, startX, startY, endX, endY) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.closePath()
    ctx.stroke()
  }
  // 箭头
  _arrow (ctx, startX, startY, endX, endY) {
    const CONFIG = {
      edgeLen: 25,
      angle: 30
    }
    const angle = this._getAngle(startX, startY, endX, endY)
    let dot = []
    dot[0] = endX - CONFIG.edgeLen * Math.cos(Math.PI / 180 * (angle + CONFIG.angle))
    dot[1] = endY - CONFIG.edgeLen * Math.sin(Math.PI / 180 * (angle + CONFIG.angle))
    dot[2] = endX - CONFIG.edgeLen * Math.cos(Math.PI / 180 * (angle - CONFIG.angle))
    dot[3] = endY - CONFIG.edgeLen * Math.sin(Math.PI / 180 * (angle - CONFIG.angle))
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.lineTo(dot[2], dot[3])
    ctx.moveTo(endX, endY)
    ctx.lineTo(dot[0], dot[1])
    ctx.stroke()
  }
  // 椭圆
  _ellipse (startX, startY, endX, endY) {
    const halfWidth = (endX - startX) / 2
    const halfHeight = (endY - startY) / 2
    return new Konva.Ellipse({
      x: startX + halfWidth,
      y: startY + halfHeight,
      radius: {
        x: Math.abs(halfWidth),
        y: Math.abs(halfHeight)
      },
      stroke: this.drawConfig.color,
      strokeWidth: this.drawConfig.lineWidth
    })
  }
  // 文本框
  _text (x, y, w, h, val) {
    console.log(this.textarea.getAttribute('color'))
    const text = new Konva.Text({
      x: x - 1,
      y: y,
      width: w,
      height: h,
      text: val,
      fontSize: this.textarea.getAttribute('fontSize'),
      fontFamily: 'monospace',
      fill: this.textarea.getAttribute('color'),
      lineHeight: 1.2,
      padding: 3,
      wrap: 'char'
    })
    // 悬浮出现编辑框
    text.on('mouseover', (e) => {
      if (!this.canTextOver) return
      if (this.isFocus) {
        this.textarea.blur()
      }
      // 文本框出现时删除图层,并清除缓存
      let id = text.getLayer()._id
      this.layers = this.layers.filter(item => {
        if (item._id === id) {
          item.destroy()
          return false
        }
        return true
      })
      let attrs = e.currentTarget.attrs
      this.textarea.value = attrs.text
      this._setStyle(this.textarea, {
        color: attrs.fill,
        fontSize: attrs.fontSize + 'px'
      })
      this.textarea.setAttribute('color', attrs.fill)
      this.textarea.setAttribute('fontSize', attrs.fontSize)
      this._setStyle(this.textWrapper, {
        top: attrs.y + 'px',
        left: attrs.x + 'px',
        display: 'block'
      })
      this.textarea.focus()
    })
    return text
  }
}
