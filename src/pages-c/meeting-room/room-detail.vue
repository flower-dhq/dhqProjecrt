<template>
  <view class="page-box flex-column"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <!-- 轮播图 -->
    <u-swiper
      :list="bannerList"
      height="230"
    ></u-swiper>

    <!-- 标题信息 -->
    <meeting-detail-title style="margin-bottom: 10px;" :data="meetingData" />
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 地址，打开跳转到地图  isLink-->
    <u-cell :title="meetingData.roomAddress" :border="isBorder" icon="map" @click="mapShow"></u-cell>
    <u-gap height="10" bgColor="#f5f5f5" />

    <!-- 增值服务 -->
    <u-cell-group :border="isBorder">
      <u-cell class="box-form-title" title="增值服务"></u-cell>
      <!-- <u-cell class="box-form-content" :title="item.dictName" v-for="item in typeListMiddle" :key="item.dictId">
        <meeting-price slot="value" :number="item.price" :suffix="item.unit" />
      </u-cell> -->
      <template>
        <view  v-for="item in typeListMiddle" :key="item.dictId" style="display: flex;justify-content: space-between;padding: 5px 16px;">
          <view style="display: inline-block;color: #a9a9a9;font-size: 28rpx;">
            {{item.dictName}}
          </view>
          <view>
            <meeting-price :number="item.price" :suffix="item.unit" :isBigSize="isBigSize" />
          </view>
        </view>
      </template>
      <!-- <u-cell class="box-form-desc" title="" label="说明：除了按次收费，其余费用皆是按实际算(人数*小时*单价)"></u-cell> -->
    </u-cell-group>
    <view class="box-form-desc" style="padding-top: 8px;padding-bottom: 12px;font-size: 12px;color: #999;padding-left:11px;">说明：除了按次收费，其余费用皆是按实际算(人数*小时*单价)</view>
    <u-gap height="10" bgColor="#f5f5f5" />
    <!-- 设施服务 -->
    <!-- <u-cell-group  :border="isBorder">
      <u-cell class="box-form-title"  :border="isBorder" title="设施服务"></u-cell>
      <u-cell class="box-form-tag" v-for="(item, index) in serviceDictRes" :key="index" :title="item.name" :label="item.children"></u-cell>
    </u-cell-group>
    <u-gap height="10" bgColor="#f5f5f5" /> -->
    <!-- 使用须知 -->
    <u-cell title="使用须知"  :border="isBorder" is-link @click="handleProtocol('cell')"></u-cell>
    <u-gap height="10" bgColor="#f5f5f5" />
    <view class="threshold-bottom"></view>

    <!-- 底部按钮 -->
    <view class="btn-bottom">
      <view class="yy-btn"  @click="handleProtocol('submit')">预约</view>
    </view>

    <!-- 协议 -->
    <agreement-modal v-model="isShowProtocol" :title="getProtocolTitle" :text="getProtocolText" @confirm="submitOrder" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import { getAuthCompanyList } from '@/service/community';
import { getMeetingReserveDetail } from '@/service/meeting'

import MeetingDetailTitle from './components/meeting-detail-title.vue'
import MeetingPrice from './components/meeting-price.vue'
import AgreementModal from './components/agreement-modal.vue'

  export default {
    name: 'RoomDetail',
    components: {
      MeetingDetailTitle,
      MeetingPrice,
      AgreementModal,
    },
    data() {
      const { MEMBER_ID, COMPLANY_ID } = this.$constant
      return {
        isBorder:false,
        isBigSize: true,
        meetingData: {}, // 存储接口数据
        bannerList: [], // 轮播图
        typeListMiddle: [], // 增值服务
        serviceDictRes: [], // 设施服务
        isShowProtocol: false, // 弹窗，协议
        readProtocolType: 'cell', // { cell: 通过点击使用须知单元格, submit: 通过点击预定按钮 }
        authCompany: '', // 已认证的企业
        meetingId: '',
        companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
        memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      }
    },
    computed: {
      getProtocolTitle() {
        return `关于${this.meetingData.meetingName || ''}预定须知`
      },
      getProtocolText() {
        return (this.meetingData.notice || '').replace(/(\n)+/g, '<br>')
      }
    },

    onLoad(option) {
      const { meetingId } = option
      this.meetingId = meetingId
      console.log('meetingId====',meetingId)
    },

    async created() {
      // await this.authCompany.getAuthCompanyList()
      await this.getEnterpriseAuthList()
      await this.getMeetingData()
    },
    methods: {
      // 获取数据
      async getMeetingData() {
        const params = {
          data: {
            meetingId: this.meetingId,
            reserveDate: this.formatDateTimeOfYMD(Date.now()),
            enterpriseIds: this.authCompany
          }
        }
        const res = await getMeetingReserveDetail(params)
        console.log('res=====',res)
        const data = res.data.data || {}

        this.meetingData = data
        this.bannerList = (data.bannerList || []).map(item => item.img)
        this.typeListMiddle = data.typeListMiddle || []
        console.log('typeListMiddle=====',this.typeListMiddle)
        this.serviceDictRes = (data.serviceDictRes || []).map(item => ({ name: item.name, children: (item.children || []).join(' ') }))
        console.log('serviceDictRes=====',this.serviceDictRes)
      },
      // 点击单元格弹出协议
      handleProtocol(type) {
        this.isShowProtocol = true
        this.readProtocolType = ['cell', 'submit'].includes(type) ? type : 'cell'
      },
      // 提交预约
      submitOrder() {
        if (this.readProtocolType !== 'submit') return

        // this.$router.push({
        //   path: '/meetingRoomEdit',
        //   query: {
        //     meetingId: this.meetingId
        //   }
        // })
        uni.navigateTo({
          url: `/pages-c/meeting-room/room-edit?meetingId=${this.meetingId}`
        })
      },
      // 跳转到地图
      mapShow() {
        const { longitude, latitude } = this.meetingData
        if (!longitude || !latitude) {
          uni.showToast({
            title: '该会议厅没有添加地理位置信息',
            icon: 'none'
          })
          return false
        }
        // uni.navigateTo({
        //   url: `/pages-c/meeting-room/meeting-map?jd=${longitude}&wd=${latitude}`
        // })
      },
      // 已认证企业
      getEnterpriseAuthList(){
        let params={
          data:{
            memberId:this.memberId,
            companyId:this.companyId,
            applyStatus:9  //已通过企业
          }
        }; 
        return new Promise(resolve => {
          getAuthCompanyList(params).then(res =>{
            if(res.status == "200"){
              let list=res.data || []
              this.authCompany = list.map(item => item.enterpriseId + '')
              resolve(list)
            }else{
              resolve([])
            }
          })
        })        
      },
      // 时间转换
      formatDateTimeOfYMD(timeStamp) {
        var date = new Date();
        date.setTime(timeStamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;

        return y + '-' + m + '-' + d;
      }
    }
  }

</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
}
// flex，垂直
.flex-column {
  @extend .flex-row;
  flex-direction: column;
}
// flex，自由伸缩
.flex-stretch {
  flex: 1;
  overflow: hidden;
}
// flex，固定大小
.felx-fixed {
  flex-grow: 0;
  flex-shrink: 0;
}
// 一行省略
.ellipsis-one {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meeting-detail-title {
  position: relative;
  margin-top: -33px;
}
.padding-cell {
  /* padding: 13px 20px; */
  margin-bottom: 10px;
}
.box-form {
  margin-bottom: 10px;

  .van-cell {
    padding: 5px 20px;
    line-height: 20px;
  }
  .box-form-title {
    padding-top: 15px;

    ::v-deep .van-cell__title {
      font-weight: bold;
    }
  }
  .box-form-content {
    ::v-deep .van-cell__title {
      color: #999;
    }
    .meeting-price {
      color: #333;
    }
    ::v-deep .price-12 {
      font-size: 10px;
    }
    ::v-deep .price-22 {
      font-size: 15px;
    }
    &::after {
      border-width: 0px;
    }
  }
  .box-form-desc {
    padding-top: 8px;
    padding-bottom: 12px;

    &::before {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 16px;
      top: 0;
      left: 16px;
      border-bottom: 1px solid #ebedf0;
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
    }
    ::v-deep .van-cell__label {
      font-size: 12px;
      color: #999;
    }
  }
  .box-form-tag {
    &::after {
      border-width: 0px;
    }
    ::v-deep .van-cell__label {
      font-size: 13px;
      color: #999;
      margin-top: 5px;
    }

  }
}
.threshold-bottom {
  padding-bottom: 64px;
  background: #f5f5f5;
}
.btn-bottom {
  width: 100%;
  position: fixed;
  bottom: 0;
  /* padding: 10px 52px 20px; */
  background-color: #f5f5f5;
  padding: 14px 0;

  .yy-btn {
    width: 70%;
    margin: 0 auto;
    color: #fff;
    text-align: center;
    line-height: 34px;
    border-radius: 22px;
    height: 34px;
    background-color: var(--app-primary-color);
    border-color: var(--app-primary-color);
  }
}
</style>
