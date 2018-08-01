<template>
  <div class="toolbar-wrap">
    <!-- 工具栏 -->
    <ul class="toolbar" :style="toolStyle">
      <li
        @click="onToolItemClick(types[0])"
        :class="{ active: types[0] === activeType}">
        <div class="rect"></div>
      </li>
      <li
        @click="onToolItemClick(types[1])"
        :class="{ active: types[1] === activeType}">
        <div class="ellipse"></div>
      </li>
      <li
        @click="onToolItemClick(types[2])"
        :class="{ active: types[2] === activeType}">
        <div class="arrow"></div>
      </li>
      <li
        @click="onToolItemClick(types[3])"
        :class="{ active: types[3] === activeType}">
        <div class="pencil"></div>
      </li>
      <li
        @click="onToolItemClick(types[4])"
        :class="{ active: types[4] === activeType}">
        <div class="text">A</div>
      </li>
      <li class="divider"></li>
      <li @click="onOperationClick(operations[0])">
        <div class="undo"></div>
      </li>
      <li @click="onOperationClick(operations[1])">
        <div class="save"></div>
      </li>
      <li @click="onOperationClick(operations[2])">
        <div class="abandon">×</div>
      </li>
      <li @click="onOperationClick(operations[3])">
        <div class="complete"></div>
      </li>
    </ul>
    <!-- 选项栏 -->
    <ul
      v-show="optionsShow"
      :style="optionsStyle"
      class="toolbar-options">
      <!-- 粗细 -->
      <li
        v-show="optionType === 'lineWidth'"
        v-for="item in lineWidths"
        :key="item"
        @click="changeDot(item)"
        class="options-dot"
        :class="{ 'active-dot': _lineWidth === item }"></li>
      <!-- 字体大小 -->
      <li class="options-text" v-show="optionType === 'fontsize'">
        <span>A</span>
        <select
          @change="selectChange">
          <option
            v-for="item in fontSizes"
            :key="item"
            :selected="_fontSize === item"
            :value="item">{{ item }}</option>
        </select>
      </li>
      <li class="divider"></li>
      <!-- 颜色 -->
      <li class="color-wrap">
        <div
          class="current-color"
          :style="{ background: _color }"></div>
        <ul class="options-color">
          <li
            v-for="item in colors"
            :key="item"
            @click="changeColor(item)"
            :style="{ background: item }"></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import config from '../config'

const COLORS = config.colors
const FONTSIZE = config.fontSizes
const LINEWIDTH = [0, 1, 2]

export default {
  name: 'toolbar',
  props: {
    // 颜色
    color: {
      type: String
    },
    // 字体
    fontSize: {
      type: Number
    },
    // 粗细
    lineWidth: {
      type: Number
    },
    // TODO: 工具栏样式
    toolStyle: {
      type: Object,
      default: () => ({})
    },
    // TODO:
    optionsStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      types: ['rect', 'ellipse', 'arrow', 'pencil', 'text'], // 左侧操作
      operations: ['undo', 'save', 'abandon', 'complete'], // 右侧操作
      colors: COLORS, // 颜色
      fontSizes: FONTSIZE, // 字体大小
      lineWidths: LINEWIDTH, // 线条粗细
      optionsShow: false, // 选项栏是否显示
      activeType: '', // 当前激活的操作
      optionType: 'lineWidth' // 选项栏显示字体还是线条粗
    }
  },
  computed: {
    _color: {
      get () {
        if (this.color === undefined) {
          this.$emit('update:color', COLORS[0])
          return COLORS[0]
        }
        return this.color
      },
      set (val) {
        this.$emit('update:color', val)
      }
    },
    _fontSize: {
      get () {
        if (this.fontSize === undefined) {
          this.$emit('update:fontSize', FONTSIZE[8])
          return FONTSIZE[8]
        }
        return this.fontSize
      },
      set (val) {
        this.$emit('update:fontSize', val)
      }
    },
    _lineWidth: {
      get () {
        if (this.lineWidth === undefined) {
          this.$emit('update:lineWidth', LINEWIDTH[0])
          return LINEWIDTH[0]
        }
        return this.lineWidth
      },
      set (val) {
        this.$emit('update:lineWidth', val)
      }
    }
  },
  methods: {
    // 画
    onToolItemClick (type) {
      this.activeType = this.activeType === type ? '' : type
      if (this.activeType === 'text') {
        this.optionType = 'fontsize'
      } else {
        this.optionType = 'lineWidth'
      }
      this.$emit('drawType', this.activeType)
    },
    // TODO:操作
    onOperationClick (operation) {
      switch (operation) {
        // 撤销
        case this.operations[0]:
          this.$emit('undoDraw')
          break
        // 保存
        case this.operations[1]:
          this.$emit('saveDraw')
          break
        // 放弃
        case this.operations[2]:
          this.$emit('abandonDraw')
          break
        // 完成
        case this.operations[3]:
          this.$emit('completeDraw')
          break
        default:
          break
      }
    },
    // 改变颜色
    changeColor (currrentColor) {
      this._color = currrentColor
    },
    // 改变粗细
    changeDot (dot) {
      this._lineWidth = dot
    },
    // 选择框
    selectChange (e) {
      this._fontSize = ~~e.target.value
    }
  },
  watch: {
    activeType (val) {
      this.optionsShow = !!val
    }
  }
}
</script>

<style lang="less" scoped>
  @main-color: #1677bd;
  @active-border-color: #999;
  @w: 260px;

  .toolbar-wrap {
    .toolbar {
      display: flex;
      width: @w;
      background: #deeeff;
      border: 1px solid #4e99d2;
      padding: 5px 2px;
      margin: 0;
      list-style: none;

      li {
        margin: 0 2px;
        padding: 3px;
        box-sizing: border-box;
        border: 1px solid transparent;

        &.active {
          border: 1px solid @active-border-color;
          border-radius: 2px;
        }

        div {
          position: relative;
          width: 16px;
          height: 14px;
          box-sizing: border-box;
          text-align: center;
          line-height: 14px;
        }
      }

      .divider {
        padding: 0;
        width: 1px;
        height: 18px;
        background: #999;
        margin-top: 2px;
      }

      .rect {
        border: 1px solid #71a4e5;
        background: #f2f6fa;
      }

      .ellipse {
        border-radius: 50%;
        border: 1px solid #71a4e5;
        background: #f2f6fa;
      }

      .arrow {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 2px;
          height: 16px;
          background: @main-color;
          transform: translateX(7px) rotate(45deg);
        }

        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          width: 0;
          height: 0;
          border-top: 4px solid @main-color;
          border-left: 4px solid transparent;
          border-right: 4px solid @main-color;
          border-bottom: 4px solid transparent;
        }
      }

      .pencil {
        background: url(../assets/image/pencil.png);
      }

      .text {
        font-size: 18px;
        color: #2359a2;
      }

      .undo {
        background: url(../assets/image/undo.png);
      }

      .save {
        background: url(../assets/image/save.png);
      }

      .abandon {
        font-size: 24px;
        line-height: 12px;
        font-weight: bold;
        color: red;
        cursor: default;
      }

      .complete {
        &::before,
        &:after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          background: green;
        }

        &::before {
          width: 2px;
          height: 9px;
          transform: translate3d(3px, 4px, 0) rotate(-45deg);
        }

        &::after {
          width: 2px;
          height: 14px;
          transform: translate3d(10px, 0, 0) rotate(45deg);
        }
      }
    }

    .toolbar-options {
      display: flex;
      width: @w;
      align-items: center;
      background: #deeeff;
      border: 1px solid #4e99d2;
      padding: 0 2px;
      margin: 0;
      list-style: none;

      & > li {
        box-sizing: border-box;
      }

      .divider {
        width: 1px;
        height: 24px;
        background: #999;
        margin: 0 2px;
      }

      .options-dot {
        position: relative;
        width: 24px;
        height: 24px;
        margin: 0 2px;

        &:hover, &.active-dot {
          border: 1px solid @active-border-color;
          border-radius: 2px;
          background: #c2e6ff;
        }

        &:after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 50%;
          background: @main-color;
          transform: translateX(-50%) translateY(-50%);
        }

        &:nth-of-type(1)::after {
          width: 2px;
          height: 2px;
        }

        &:nth-of-type(2)::after {
          width: 4px;
          height: 4px;
        }

        &:nth-of-type(3)::after {
          width: 8px;
          height: 8px;
        }
      }

      .options-text {
        margin: 0 4px;
        select,
        option {
          outline: none;
          width: 50px;
        }

        span {
          vertical-align: bottom;
        }
      }
    }

    .color-wrap {
      display: flex;
      align-items: center;
      margin: 3px 0;
      padding: 0 4px;
    }

    .current-color {
      width: 28px;
      height: 28px;
      border: 1px solid @active-border-color;
      box-sizing: border-box;
      margin-right: 5px;
    }

    .options-color {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 130px;
      list-style: none;
      padding: 0;

      li {
        width: 13px;
        height: 13px;
        margin: 1px;
        box-sizing: border-box;
        border: 1px solid @active-border-color;

        &:hover {
          border: 1px solid #fff;
        }
      }

    }
  }
</style>
