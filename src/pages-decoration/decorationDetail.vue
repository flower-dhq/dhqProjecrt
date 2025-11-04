<template>
  <view class="detail-page" :style="[THEME_CSS_VAR]">
    <view class="cont-item">
      <view class="title-box">基本信息</view>
      <view class="row-box" v-for="(item,i) in detailList" :key="i">
        <view class="row-label">{{ item.label }}</view>
        <view class="row-value">{{ item.value }}</view>
      </view>
    </view>

    <view class="cont-item">
      <view class="title-box">施工内容</view>
      <view class="input-box">
        <u--input class="input" placeholder="请输入施工内容" border="none" v-model="test" />
      </view>
    </view>

    <view class="cont-item">
      <view class="title-box">备注内容</view>
      <view class="input-box">
        <u--input class="input" placeholder="请输入备注内容" border="none" v-model="test" />
      </view>
    </view>

    <view class="cont-item">
      <view class="title-box">巡检计划</view>
      <view class="row-box" v-for="(item,i) in inspectionList" :key="i">
        <view class="row-label">{{ item.label }}</view>
        <view class="row-value">{{ item.value }}</view>
      </view>
    </view>

    <view class="cont-item">
      <view class="title-box">附件</view>
    </view>

    <view class="btn-list">
      <u-button class="btn-box btn-color" type="default" text="驳回"></u-button>
      <u-button class="btn-box" type="default" text="同意"></u-button>
    </view>

    
  </view>
</template>

<script>
  export default {
    data(){
      return{
        detailList:[
          { label:'项目名称:', value:'一碑科贸中心' },
          { label:'装修房间:', value:'谢生' },
          { label:'请求人:', value:'' },
          { label:'联系电话:', value:'' },
          { label:'装修地址:', value:'一碑科贸中心-一碑科贸中心- A座-1-104' },
          { label:'装修日期:', value:'' },
          { label:'装修公司:', value:'' },
          { label:'装修负责人:', value:'' },
          { label:'联系电话:', value:'' },
        ],
        inspectionList:[
          { label:'模板名称:', value:'' },
          { label:'计划名称:', value:'' },
          { label:'巡检起止日期:', value:'' },
          { label:'巡检人员:', value:'' },
        ],
        test:''
      }
    }
  }
</script>

<style lang="scss" scoped>
.detail-page{
  min-height: 100vh;
  background-color: #F3F4F7;
  width: 100%;
  padding: 20rpx 32rpx;
  box-sizing: border-box;
}
.cont-item{
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  background-color: #fff;
}
.title-box{
  position: relative;
  padding: 32rpx 32rpx 32rpx 64rpx;
  font-size: 28rpx;
  font-weight: bold;
  box-sizing: border-box;
}
.title-box::before{
  content: '';
  display: block;
  position: absolute;
  left: 32rpx;
  top: 40rpx;
  width: 12rpx;
  height: 28rpx;
  background: #2760ff;
}
.row-box{
  padding: 0 32rpx 30rpx;
  font-size: 28rpx;
  display: flex;
  .row-label{
    width: 160rpx;
  }
  .row-value{
    flex: 1;
  }
}
.input-box{
  padding: 0 32rpx 32rpx;
  box-sizing: border-box;
  .input{
    height: 98rpx;
    font-size: 28rpx;
    background: #F9F9F9;
  }
}

.btn-list{
  display: flex;
  padding: 0 26rpx;
  .btn-box{
    width: 292rpx;
    height: 80rpx;
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