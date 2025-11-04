<style lang="scss" scoped>
.dropdown-selection {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  box-sizing: border-box;
  &::after {
    position: absolute;
    left: 0;
    bottom: 0;
    content: '';
    display: block;
    width: 100%;
    height: 1rpx;
    transform: scaleY(50%);
    background-color: #ebebeb;
  }
  .container {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 88rpx;
    background-color: #fff;
    @include flx-dsp($jsc: flex-start, $ali: center);
    padding-left: 20rpx;
  }
  .trigger-button {
    @include flx-dsp($jsc: center, $ali: center);
    border-radius: 6rpx;
    background-color: var(--app-primary-color);
    padding: 12rpx 20rpx;
    color: #fff;
    width: 120rpx;
    box-sizing: border-box;
    text {
      font-size: 26rpx;
      margin-right: 4rpx;
      @include ellipsis(1)
    }
    ::v-deep .u-icon {
      position: relative;
      top: 3rpx;
    }
  }
  .search-input {
    width: 424rpx;
    margin-left: 20rpx;
    margin-right: 30rpx;
  }
  .not-filled {
    @include flx-dsp($jsc: flex-start, $ali: center);
    text {
      font-size: 26rpx;
      color: #333;
      margin-right: 4rpx;
    }
    image {
      position: relative;
      top: 2rpx;
      width: 24rpx;
      height: 24rpx;
    }
    &--color {
      text {
        color: var(--app-primary-color);
      }
    }
  }
  .popup-layer {
    position: absolute;
    left: 0;
    top: 90rpx;
    z-index: 98;
    width: 100%;
    height: 100vh;
    background-color:#000;
    transition: background-color 0.15s linear;
    z-index: 99;
    display: none;
    &--show{
      display: block;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .selection-area {
    position: absolute;
    left: 0;
    top: 90rpx;
    z-index: 99;
    width: 100%;
    max-height: 600rpx;
    overflow-y: auto;
    background-color: #fff;
    transition: transform 0.15s linear;
    transform-origin: 0 0;
    transform: scaleY(0);
    &--show{
      transform: scaleY(1);
    }
    &--hide{
      transform: scaleY(0);
    }
    .row {
      @include flx-dsp($jsc: space-between, $ali: center);
      font-size: 30rpx;
      padding: 30rpx;
      border-bottom: 1px solid #eaeaea;
      box-sizing: border-box;
    }
  }
}
</style>

<template>
  <view class="dropdown-selection" :style="[THEME_CSS_VAR]">
    <view class="container">
      <view class="trigger-button" @click="popupShow = true">
        <text>{{ button }}</text>
        <u-icon size="6" name="arrow-down-fill" color="#fff"></u-icon>
      </view>
      <view class="search-input">
        <u-search placeholder="姓名/电话" v-model="keywords" shape="square" :showAction="false" searchIcon=" " height="56rpx" @search="onSearch" @clear="onSearch" />
      </view>
      <view :class="['not-filled', filled ? 'not-filled--color' : '']" @click="toggle">
        <text>未填写</text>
        <image v-if="filled" :src="require(`@/static/${[THEME_NAME]}/common/filter_color.png`)"></image>
        <image v-else :src="require(`@/static/${[THEME_NAME]}/common/icon-more.png`)"></image>
      </view>
    </view>
    <view :class="['popup-layer',  popupShow ? 'popup-layer--show': '']" @click="popupShow = false"></view>
    <view :class="['selection-area', popupShow ? 'selection-area--show': 'selection-area--hide']">
      <view class="row" v-for="(item, index) in rowList" :key="index" @click="rowClick(item, index)">
        <text> {{ item.label }} </text>
        <u-icon v-if="rowIndex == index" size="16" name="checkmark" :color="THEME_COLOR"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import { getBuildingDetailList } from '@/service/landcrm'
export default {
  data() {
    return {
      keywords: '',
      button: '全部',
      popupShow: false,
      filled: false,
      rowIndex: 0,
      num: 0,
      rowList: [
        {
          label: '全部',
          value: '',
        },
      ],

    };
  },
  components: {},
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // buildingValue: {
    //   type: String,
    //   default: ''
    // }
  },
  methods: {
    // 行点击
    rowClick(data, index) {
      if(data.buildingValue && data.buildingIdList && data.buildingIdList.includes(',')){
        this.rowIndex = 0
        this.button = '全部'
      }else if(data.buildingValue && data.buildingIdList && data.buildingIdList.indexOf == -1){
        this.rowIndex = index
        this.button = '全部'
        // this.button = data.label
      }
      else {
        this.rowIndex = index
        this.button = data.label
      }
      this.popupShow = false
      if(data.label == '全部'){
        this.$emit('rowClick', this.options)
       }else {
        this.$emit('rowClick', data)
       }
    },
    // 获取楼层
    getBuildingData() {
      const { projectId } = this.options
      const params = {
        data: {
          projectId,
          startIndex: 1,
          pageSize: 10000
        },
        hideLoading: true
      }
      getBuildingDetailList(params).then((res) => {
        if (res.success) {
          const records = Array.isArray(res.data) ? res.data : [];
          const tempList = [
            {
              label: '全部',
              value: '',
            },
          ];
          if (Array.isArray(records)) {
            records.forEach((item,index) => {
              let d = {
                ...item,
                label: item.buildingLocation,
                value: item.buildingId
              };
              if(index == 0 && this.options.buildingValue && this.options.buildingIdList.includes(',')){
                this.rowClick(this.options)
              }else if(this.options.buildingValue && this.options.buildingIdList && this.options.buildingIdList.indexOf(',') == -1 && this.options.buildingValue == (item.buildingId).toString()){
                this.rowClick(d)
              }
              // if (this.options.buildingValue == item.buildingId) {
              //   this.rowIndex = index + 1
              // }
              if(this.options.buildingValue && (this.options.buildingIdList.split(',')).includes(item.buildingId.toString())){
                tempList.push(d);
                return;
              }else {
                // tempList.push(d);
                return;
              }
            });
          }
          this.rowList = tempList;
        }
      });
    },
    onSearch() {
      this.$emit('search', this.keywords)
    },
    // 未填写切换
    toggle() {
      this.filled = !this.filled
      this.$emit('toggle', this.filled)
    }
  },
  // watch: {
  //   rowIndex(newVal, oldVal) {
  //     console.log(237,newVal,oldVal)
  //     if (this.num == '0') {
  //       this.rowList.map((item,index)=>{
  //         if (this.rowIndex == index) {
  //           console.log('item===', item,index)
  //           this.rowClick(item, index)
  //         }
  //       })  
  //       this.num ++
  //     }
  //   }
  // },
  mounted() {
    this.getBuildingData();
  },
};
</script>
