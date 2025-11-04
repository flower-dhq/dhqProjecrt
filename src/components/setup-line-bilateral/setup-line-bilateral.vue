<template>
  <view class="setup-line-bilateral">
    <view
      v-for="(item, index) in filterToList"
      :key="index"
      :class="['line-panel', { 'is-active': getActiveIndex >= index }]"
      :style="{ width: `calc(100% / ${filterToList.length})` }"
    >
      <!-- 点的上方区域 -->
      <view class="line-prefix-panel" :style="{ height: getPrefixHeight }" v-if="item.prefix.isEnable">
        <image
          v-if="item.prefix.type === 'icon'"
          :style="{ width: getPrefixHeight, height: getPrefixHeight }"
          :src="item.prefix.content"
          mode="aspectFit"
        />
        <text v-else>{{ item.prefix.content }}</text>
      </view>
      <!-- 点 -->
      <view class="line-point"></view>
      <!-- 点的下方区域 -->
      <view class="line-suffix-panel" :style="{ height: getSuffixHeight }" v-if="item.suffix.isEnable">
        <image
          v-if="item.suffix.type === 'icon'"
          :style="{ width: getSuffixHeight, height: getSuffixHeight }"
          :src="item.suffix.content"
          mode="aspectFit"
        />
        <text v-else>{{ item.suffix.content }}</text>
      </view>
    </view>
    <!-- 步骤线 -->
    <view class="line" :style="{ left: linePosition, right: linePosition, top: linePositionTop }">
      <view class="line-active" :style="{ width: getActiveWidth }"></view>
    </view>
  </view>
</template>

<script>
// 水平双边步骤线

export default {
  options: { styleIsolation: 'shared' },
  props: {
    /* 列表数据，[{ label: '', prefix: { type: 'icon' || 'text', content: String, isEnable: true }, suffix: { type: 'icon' || 'text', content: String, isEnable: true } }]
     * 如果type为icon，则使用图标，content为地址。
     * 如果type为text，则使用文本，content为文本内容。
     */
    setupList: {
      type: Array,
      default: () => []
    },
    // 点的上方的高度
    prefixHeight: {
      type: [String, Number],
      default: 0
    },
    // 点的下方的高度
    suffixHeight: {
      type: [String, Number],
      default: 0
    },
    // 绑定的是label
    value: {
      type: String,
      default: '',
      required: true
    }
  },
  computed: {
    filterToList() {
      return this.setupList.map(item => {
        if (!Boolean(item.prefix)) {
          throw new TypeError('setupList上的属性prefix为undefined')
        } else if (!Boolean(item.suffix)) {
          throw new TypeError('setupList上的属性suffix为undefined')
        } else if (typeof item.prefix.isEnable !== 'boolean' || typeof item.suffix.isEnable !== 'boolean') {
          throw new TypeError('setupList上的属性isEnable为undefined')
        }

        return item
      })
    },
    getPrefixHeight() {
      return typeof this.prefixHeight === 'number' ? this.prefixHeight + 'rpx' : this.prefixHeight
    },
    getSuffixHeight() {
      return typeof this.suffixHeight === 'number' ? this.suffixHeight + 'rpx' : this.suffixHeight
    },
    linePosition() {
      return `calc(100% / ${this.filterToList.length} / 2)`
    },
    linePositionTop() {
      const temp = parseInt(this.prefixHeight)

      return temp + 31 + 'rpx'
    },
    getActiveIndex() {
      const length = this.filterToList.length
      for(let i = length - 1; i >= 0; i--) {
        const item = this.filterToList[i]
        if (item.label === this.value) {
          return i
        }
      }
      
      return -1
    },
    getActiveWidth() {
      const length = this.filterToList.length
      if (length <= 1) return '0rpx'

      const setupLength = 2 * (length - 1)

      if (this.getActiveIndex === 0) {
        return `calc(100% / ${setupLength})`
      } else if (this.getActiveIndex === length - 1) {
        return `100%`
      } else {
        return `calc(100% / ${(setupLength / (1 + 2 * this.getActiveIndex))})`
      }
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    // 进行下一步
    next() {
      const length = this.filterToList.length
      const newIndex = this.getActiveIndex + 1
      if (newIndex >= length) return

      this.$emit('input', this.filterToList[newIndex].label)
    }
  }
}
</script>

<style lang="scss" scoped>
.setup-line-bilateral {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
}
.line {
  height: 2rpx;
  background-color: rgba(#fff, 0.5);
  
  position: absolute;
  top: 58%;
  transform: translateY(-50%);

  .line-active {
    height: 2rpx;
    background-color: rgba(#fff, 1);
    position: absolute;
    opacity: 1;
    top: 0;
    left: 0;
  }
}
.line-panel {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .line-point {
    $size: 22rpx;

    display: inline-block;
    width: $size;
    height: $size;
    background-color: rgba(#fff, 0.5);
    border-radius: 100%;
  }
  .line-prefix-panel,
  .line-suffix-panel {
    width: 100%;
    text-align: center;
    font-size: 24rpx;
    color: #fff;
    overflow: hidden;
    word-break: break-all;
  }
  .line-prefix-panel {
    margin-bottom: 20rpx;
    image{
      opacity: .5;
    }
  } 
  .line-suffix-panel {
    margin-top: 20rpx;
  }
  
  &.is-active .line-point {
    background-color: rgba(#fff, 1);
  }
}
.is-active{
  image{
    opacity: 1 !important; 
  }
}
</style>