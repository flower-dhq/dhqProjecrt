<template>
  <view class="page-box" :style="[THEME_CSS_VAR]">
    <view class="top-box">
      <view class="tab-box">
        <u-tabs :list="tabList" :activeStyle="activeS" :inactiveStyle="inactiveS" lineColor="#fff" :scrollable="false"></u-tabs>
      </view>
      <view class="search-btn">筛选</view>
    </view>
    <u-list class="data-list" @scrolltolower="scrolltolower" height="calc(100% - 44px)">
      <view class="data-item">
        <view class="title-box">
          <view class="addr">地址</view>
          <view class="status">
            <text>待审核</text>
          </view>
        </view>
        <view class="cont-box">
          <view class="cont-text">标题</view>
          <view class="time">时间</view>
          <view class="btn-list">
            <u-button class="btn-box" type="default" text="同意"></u-button>
            <u-button class="btn-box btn-color" type="default" text="驳回"></u-button>
          </view>
        </view>
      </view>
    </u-list>
  </view>
</template>

<script>
export default {
  data(){
    return{
      tabList:[
        { name:'待审核' },
        { name:'已审核' },
        { name:'驳回' },
      ],
      activeS:{
        color:'#fff',
        fontWeight:'bold'
      },
      inactiveS:{
        color: '#fff',
        transform: 'scale(1)'
      }
    }
  },

  methods:{
    scrolltolower() {
      // if (this.pages > this.pageIndex) {
      //   this.pageIndex++;
      //   this.getList()
      // }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-box{
  min-height: 100vh;
  background-color: #F3F4F7;
  width: 100%;
}
.top-box{
  display: flex;
  height: 88rpx;
  background-color: #2760FF;
  .tab-box{
    width: 75%;
  }
  .search-btn{
    flex: 1;
    font-size: 30rpx;
    text-align: center;
    line-height: 88rpx;
    background-color: #2760FF;
    color: #fff;
  }
}
.list-box{
  height: calc( 100vh - 88rpx );
  padding: 20rpx 36rpx;
}
.data-list{
  padding: 20rpx 32rpx;
  box-sizing: border-box
}
.data-item{
  border-radius: 16rpx;
  background-color: #fff;
  .title-box{
    padding: 32rpx 0 32rpx 32rpx;
    display: flex;
    border-bottom: 2px solid #FBF9F9;
    .addr{
      flex: 1;
      padding-right: 48rpx;
      font-size: 28rpx;
      font-weight: Bold;
      color: #333;
    }
    .status{
      width: 120rpx;
    }
  }
  .cont-box{
    padding: 32rpx;
    .cont-text{
      margin-bottom: 20rpx;
      font-size: 28rpx;
      color: #333;
    }
    .time{
      font-size: 28rpx;
      color: #999;
      margin-bottom: 40rpx;
    }
  }
}
.btn-list{
  overflow: hidden;
  .btn-box{
    float: right;
    width: 166rpx;
    height: 68rpx;
    margin-left: 24rpx;
    padding: 0;
    background: linear-gradient(to right, #2760FF, #4F99FF);
    border-radius: 16rpx;
    color: #fff;
  }
  .btn-color{
    background: #ADCDFF;
  }
}
</style>