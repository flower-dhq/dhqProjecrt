
<style lang="scss" scoped>
.totalRecords {
    background-color: #fff;
    padding: 20rpx 40rpx;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 16rpx;
    image {
        width:120rpx;
        height: 120rpx;
    }
    .top_cont {
        display: flex;
        justify-content: space-between;
    }
    .center_cont {
        display: flex;
        .l {
            padding: 16rpx;

        }
        .r {
            flex: 1;
            padding: 16rpx;
            p {
                padding: 12rpx 0;
            }
        }
    }
    .bottom_cont {
        display: flex;
        justify-content: space-between;
    }
}
.nodata {
    background: url("@/static/theme-default/multiplexing/tips.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 175px;
    position: relative;
    background-position: center 25%;
    background-color: #ffffff;
}
.nodata::after {
    content: "暂无数据~";
    color: #999;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
} 
</style>
<template>
    <view style="background-color: #f5f5f5;min-height: 100vh;"> 
         <scroll-view  scroll-y="true" @scrolltolower="scrolltolower" style="padding-bottom: 60rpx;">
            <view v-for="(item,index) in records" :key="index" class="totalRecords">
                <view class="top_cont">
                  <span>{{ item.visitor }}</span>
                  <span>{{ item.telephone }}</span>
                </view>
              <view class="center_cont">
                <view class="l">
                  <view class="qrcode-box" v-if="currProjectName == 'ruisihang'" @click="viewQrcode(1)">
                    <view id="qrCode" ref="qrCodeDiv"></view>
                  </view>
                  <image v-else :src="item.codePath" alt="" />
                </view>
                <view class="r">
                  <p>创建日期：{{item.createDate.substr(0, item.createDate.indexOf(" "))}}</p>
                  <p>有效期限：{{ item.availDate.substr(0, item.availDate.indexOf(" ")) }}</p>
                </view>
              </view>
              <view class="bottom_cont">
              <span>{{ item.visitReason }}</span>
              <span v-if="currProjectName != 'ruisihang'">次数{{ item.availNumber }}</span>
              </view>
              <view v-show="isShow" class="view-box" @click="viewQrcode(0)" @touchmove.prevent>
              <view class="qrcode-box">
                <view ref="qrCodeDiv2"></view>
                <image :src="imgPath" alt=""></image>
              </view>
              </view>
            </view>
            <u-divider style="margin: 15px 40px;" v-if="page===pageIndex && shopNodata" text="已无其他内容"></u-divider>
          </scroll-view>
     </view>
</template>

<script>
import {  getVisitors} from '@/service/doorService'
export default {
    data() {
        const { PROJECT_CODE } = this.$appConfig;
        return {
            ownerId:'',
        records:[],
        loading: false,
        hasMoreData: true,
        noMoreDataTips: '已无更多数据',
        size: 10, // 每页数量
        page: 1, // 页码
        total: 0,
        currProjectName:PROJECT_CODE
        }
    },
    onLoad(e) {
        console.log(176,e)
        this.ownerId = e.ownerId
        this.getInviteRecordData();
    },
    methods: {
      
        getInviteRecordData(){
        this.page = 1;
        this.loading = true
        let params = {
            data:{
                ownerId:this.ownerId
            }
        }
        let that = this
        getVisitors(params).then((res) => {
          that.records = [];
          if (res.status == '200') {
            for (let i = 0; i < res.data.length; i++) {
              that.records.push(res.data[i]);
            }
          } else {
            uni.showToast({
							title:res.message,
							icon: 'none'
						})
          }
        
        }).catch((err) => {
          that.loading = false
        })
      },
       
       

       
    }
}
</script>
 