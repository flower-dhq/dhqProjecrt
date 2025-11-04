<template>
  <view class="page" :style="[THEME_CSS_VAR]">
    <view style="padding: 24rpx 20rpx 0px;">
      <view class="meter-info">
          <cell-text customClass="auto-width header-desc" label="客户：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{meterInfo.customerName}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="仪表种类：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{meterInfo.meterKindText}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="仪表编号：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{meterInfo.deviceCode}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="仪表类型：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{meterInfo.meterTypeText}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="仪表路址：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{meterInfo.address?meterInfo.address:'暂无路址信息'}}</text>
          </cell-text>
      </view>
    </view>
    <view style="padding: 47rpx 20rpx 0px;border-radius: 8px;">
      <view v-if="meterReadingData.length < 1" style="text-align:center;">暂无抄表数据</view>
      <view class="meter-reading-info" v-for="(item, index) in meterReadingData" :key="index">
        <view class="info-item">
          <cell-text customClass="auto-width header-desc" label="抄表来源：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{item.channelStr}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="状态：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{item.statusStr}}</text>
            <text v-if="item.status != 1">({{item.remark}})</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="月份：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{item.month}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="抄表日期：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{item.readDate}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="示数：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text
                v-for="(item2, index2) in item.thisReadArr"
                :key="index2"
                class="font-color-14"
            >{{item2}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="用量：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text
              v-for="(item3, index3) in item.dosageArr"
              :key="index3"
              class="font-color-14"
            >{{item3}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="金额：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text
              v-for="(item4, index4) in item.amountArr"
              :key="index4"
              class="font-color-14"
            >{{item4}}</text>
          </cell-text>
          <cell-text customClass="auto-width header-desc" label="抄表人：" labelColor="#666" labelWidth="80px" border="none" isRight
            padding="8px 18px" :customStyle="{ fontSize: '28rpx' }">
            <text class="font-color-14">{{item.creator}}</text>
          </cell-text>
        </view>
      </view>
    </view>
    <view style="height: 250rpx;"></view>
    <view class="footer-btn">
      <u-button type="primary" :customStyle="{ width: '670rpx', height: '88rpx', padding: '0', background: '#1989F7' }" @click="addBtn">新增抄表</u-button>
      <u-safe-bottom />
    </view>
  </view>
</template>

<script>
import {
  getHistoryReadRequest,   //查询仪表抄表数据
  getDeviceDetail,     //查询仪表详情
} from "@/service/energy";
import CellText from '@/components/cell-text.vue'
export default {
    data(){
      return{
        projectId: '',    //项目id
        meterId: '',
        meterInfo: {},
        meterReadingData: [],
      }
    },
    components: {
      CellText,
    },
    onLoad(option) {
      console.log('option===',option)
      this.projectId = option.projectId || ''
      this.meterId = option.meterId || ''
      this.meterReadingData = []
      this.getMeterInfo()
      this.getMeterReadingList()
    },
    methods:{
        //查询仪表信息
        getMeterInfo(){
          let params = {
            data: {
              meterId: this.meterId,
            }
          };
          getDeviceDetail(params).then(res=>{
            if(res.status == 200){
              this.meterInfo = res.data;
            }else{
              this.toastWord({text: res.message})
            }
          })
        },

        //获取仪表抄表数据
        getMeterReadingList(){
          let params = {
            data: {
              projectId: this.projectId,
              // projectId: '2932247',
              midList: [this.meterId],
              pageIndex: 1,
              pageSize: 3,
            }
          };
          getHistoryReadRequest(params).then(res=>{
            if(res.status == 200){
              if(res.data.records && res.data.records.length > 0){
                res.data.records.forEach(item => {
                  item.thisReadArr = [];
                  item.dosageArr = [];
                  item.amountArr = [];
                  if(item.readChildList && item.readChildList.length > 0){
                    item.readChildList.forEach(item2=>{
                      if(item2.thisRead){
                        item.thisReadArr.push( item2.subsectionName+ ":"+ item2.thisRead);
                      }else{
                        item.thisReadArr.push("");
                      }
                      if(item2.dosage){
                        item.dosageArr.push( item2.subsectionName+ ":"+ item2.dosage);
                      }else{
                        item.dosageArr.push("");
                      }
                      if(item2.totalAmount){
                        item.amountArr.push( item2.subsectionName+ ":"+ item2.totalAmount);
                      }else{
                        item.amountArr.push("");
                      }
                    })
                  }
                });
                this.meterReadingData = res.data.records;
              }
            }else{
              this.toastWord({text: res.message})
            }
          })
        },

        addBtn(){
          uni.navigateTo({
            url: `/pages-meter/addMeterReading?meterId=${this.meterId}&customerId=${this.meterInfo.customerId}`
          })
        },

        // 提示文字
        toastWord(params) {
            // const {text} = params;
            // if (!text) return;
            // Toast({
            //     message: text,
            //     position: 'bottom',
            // });
        },
    }
}
</script>

<style lang="scss" scoped>
.font-color {
  color: #333;
  font-size: 15px;
  font-family: PingFang SC;
}
.font-color-14 {
  font-size: 28rpx;
  color: #333;
  font-family: PingFang SC;
  margin-left: 10px;
}

::v-deep .header-title {
  .cell-text-label {
    font-size: 28rpx;
  }
 } 
.page {
  width: 100%;
  min-height: 100%;
  background-color: #f9f9f9;
  font-family: PingFang SC, "Helvetica Neue", Arial, sans-serif;
}
.meter-info{
    /* overflow-y: scroll; */
    /* padding: 0 15px; */
    padding: 30rpx 0;
    background-color: #fff;
}
.meter-reading-info{
    background: #fff;
    padding: 6px 0;
    margin-bottom: 24rpx;
}
.footer-btn{
    bottom: 40rpx;
    position: fixed;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.value-flex-3{
    flex: 3;
}
.value-flex-4{
    flex: 4;
}
.grey{
    color: #969799;
}
.black{
    color: #333;
}
.info-item{
    padding: 6px 0;
}
.info-item ::v-deep .van-cell{
    padding: 0 16px;
}
.info-item ::v-deep .van-cell::after{
    border-bottom: none;
}
// .meter-reading-info .info-item:first-child{
//     margin-top: 0;
// }
</style>
