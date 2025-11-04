<template>
  <view class="page-panel" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="money_bxo">
      <view class="tle">可用金额(元)</view>
      <view class="num">2000.00</view>
    </view>
    <view class="charge_bxo">
      <view class="title">充值金额</view>
      <view class="num_list">
        <view class="num_bxo" @click="changeAr(10)" :class="arNum == 10 ? 'num_bxo_select':''">10元</view>
        <view class="num_bxo" @click="changeAr(20)" :class="arNum == 20 ? 'num_bxo_select':''">20元</view>
        <view class="num_bxo" @click="changeAr(50)" :class="arNum == 50 ? 'num_bxo_select':''">50元</view>
        <view class="num_bxo" @click="changeAr(100)" :class="arNum == 100 ? 'num_bxo_select':''">100元</view>
        <view class="num_bxo" @click="changeAr(200)" :class="arNum == 200 ? 'num_bxo_select':''">200元</view>
        <view class="num_inp" @click="changeAr(null)">
          <u--input fontSize="13px" color="#333333" textAlign="center" type='number' v-model="chargeNum" placeholder="自定义" border="none" :customStyle="{padding: '6px 13px'}"></u--input>
        </view>
      </view>
    </view>

    <view class="charge_type">
      <view class="tile">支付方式</view>
      <view class="all_types">
        <view class="type_box">
          <view class="left">
            <image class="left_icon" :src="require(`@/static/${[THEME_NAME]}/multiplexing/wechat-icon.png`)"></image>
            <view class="all_txt">微信支付</view>
          </view>
          <image class="right_icon" :src="require(`@/static/${[THEME_NAME]}/multiplexing/select-icon.png`)"></image>
        </view>
      </view>
    </view>

    <view class="fixed_pd">
      <view class="all_list">
      </view>
      <view class="safeHeight" :style="{height:safeArea+'px'}"></view>
    </view>
    <view class="fiexd_bottom">
      <view class="all_list">
        <view class="left">
          <view class="tip">合计 ：</view>
          <view class="money">￥200.00</view>
        </view>
        <view class="changr">立即充值</view>
      </view>
      <view class="safeHeight" :style="{height:safeArea+'px'}"></view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      type:'',//1个人钱吧2企业钱包
      changeType:'1',
      chargeNum:'',
      safeArea:'',//安全距离
      arNum:"",//充值金额
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    this.safeArea = systemInfo.screenHeight - systemInfo.safeArea.bottom;
  },
  methods: {
    changeAr(num){
      if(!num){
        this.arNum = ''
        return
      }
      this.arNum = num
    },
    changeSelect(type){
      this.changeType = type
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .u-image {
  margin: 0 auto;
}
::v-deep .u-input__content__field-wrapper__field{
  text-align: center !important;
}
.page-panel{
  width: 100%;
  box-sizing: border-box;
  padding:0 20rpx;
  background: #FFF;
  min-height: 100%;
}
.money_bxo{
  width: 100%;
  height: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #EAEAEA;
  .tle{
    font-size: 28rpx;
    line-height: 40rpx;
    padding-bottom: 4rpx;
  }
  .num{
    color: #FF9900;
    font-size: 60rpx;
    font-weight: bold;
    line-height: 84rpx;
  }
}
.charge_bxo{
  padding: 40rpx 0 18rpx;
  border-bottom: 1px solid #EAEAEA;
  .title{
    font-size: 32rpx;
    line-height: 44rpx;
    font-weight: bold;
    padding-bottom: 20rpx;
  }
  .num_list{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .num_bxo,.num_inp{
      width: 222rpx;
      height: 100rpx;
      border-radius: 20rpx;
      border: 1px solid #C8924B;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      margin-bottom: 22rpx;
      cursor: pointer;
    }
    .num_bxo_select{
      background: #C8924B;
      color: #fff;
    }
  }
}

.charge_type{
  width: 100%;
  padding-top: 40rpx;
  .tile{
    font-size: 32rpx;
    font-weight: bold;
    padding-bottom: 20rpx;
  }
  .all_types{
    width: 100%;
    .type_box{
      width: 100%;
      height: 80rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        display: flex;
        align-items: center;
        .left_icon{
          width: 40rpx;
          height: 40rpx;
        }
        .all_txt{
          font-size: 28rpx;
          padding-left: 20rpx;
        }
      }
      .right_icon{
        width: 28rpx;
        height: 28rpx;
      }
    }
  }
}

.fixed_pd{
  width: 100%;
}
.fiexd_bottom{
  width: 100%;
  box-shadow: 0 -2rpx 12rpx 2rpx rgba(0,0,0,.16);
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  padding: 0 20rpx;
  .all_list{
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      display: flex;
      align-items: center;
      .tip{
        font-size: 28rpx;
        line-height: 28rpx;
      }
      .money{
        font-size: 40rpx;
        line-height: 40rpx;
        font-weight: bold;
        color: #C8924B;
      }
    }
    .changr{
      width: 320rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 32rpx;
      font-weight: bold;
      border-radius: 16rpx;
      background: #fff;
      background: linear-gradient(to right,#FFE266,#C8924B);
    }
  }
  .safeHeight{
    width: 100%;
  }
}
</style>