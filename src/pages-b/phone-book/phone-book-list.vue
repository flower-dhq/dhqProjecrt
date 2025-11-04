<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="header-panel" v-if="steward.stewardPhone">
      <phone-card-user :data="steward" :userInfo="userInfo" />
    </view>

    <view v-if="!phoneList.length" class="nodata"></view>
    <view class="content-panel">
      <phone-card v-for="(item, index) in phoneList" :key="index" :data="item" />
    </view>
    <u-gap height="80" bgColor="#f5f5f5" />

    <!-- <view class="footer-panel">
      <u-button type="primary" shape="circle" text="一键报修" @click="baoxiu"/>
    </view> -->

    <u-modal :show="modalShow" content='请关联物业管家' @confirm="modalShow = false" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import PhoneCard from './modules/phone-card.vue'
import PhoneCardUser from './modules/phone-card-user.vue'
import { findLocations } from '@/service/community'
import { findStewardByBuilding, getConvenienceTel } from '@/service/wxmanage'

export default {
  name: 'PhoneBookList',
  components: {
    PhoneCard,
    PhoneCardUser
  },
  data() {
    const { MEMBER_ID, PROJECT_ID, COMPLANY_ID, AREA_ID } = this.$constant

    return {
      companyId: Utils.storageAction({ key: COMPLANY_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      // 电话列表
      phoneList: [],
      userInfo: {},
      // 管家信息
      steward: {
        stewardName: '管家名称',
        stewardHeadUrl: '',
        stewardPhone: '',
        stewardRecord: '以全心全意的卓越服务，带给用户发自内心的预愉悦。'
      },
      modalShow: false
    }
  },
  onLoad(){
    const { O_USER_INFO,O_STEWARD_INFO } = this.$constant;
				const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' });
        const stewardInfo = Utils.storageAction({key: O_STEWARD_INFO, action: 'get' })
        console.log(57,userInfo,this.$constant,stewardInfo)
  },
  async created() {
    // console.log(55,this.$router)
    // const isFlag = this.getUrlQuery()
    // if (!isFlag) {
    //   await this.getUserInfo()
    //   await this.getStewardInfo()
    // }
    // // await this.getUserInfo()
    // // await this.getStewardInfo()
    // await this.getConvenienceTel()
  },
  async onShow() {
    const { MEMBER_ID} = this.$constant
    let memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' })
    if(!memberId){
      uni.navigateTo({ url:'/pages-a/authorization/bindingMobile'});
      return
    }else{
      console.log(55,this.$router)
      const isFlag = this.getUrlQuery()
      if (!isFlag) {
        await this.getUserInfo()
        await this.getStewardInfo()
      }
      await this.getConvenienceTel()
    }
  },
  methods: {
   async getUrlQuery() {
      let stewardInfo = this.$route.query.stewardInfo
      try {
        stewardInfo = JSON.parse(decodeURIComponent(stewardInfo))
      } catch (error) {
        stewardInfo = {}
      }

      if (stewardInfo.name && stewardInfo.name !== '管家名称') {
        this.steward = {
          stewardName: stewardInfo.name,
          stewardHeadUrl: stewardInfo.img,
          stewardPhone: stewardInfo.phone,
          stewardRecord: stewardInfo.desc
        }
        return true
      }
      
      return false
    },
    // 获取用户信息
    async getUserInfo() {
      const params = {
        pathParams: '/1',
        data: {
          memberId: this.memberId,
          projectType: this.projectId,
          companyId: this.companyId
        }
      }
      const res = await findLocations(params)

      this.ownerInfo = (res.data?.authBuildings || []).find(item => item.isDefault == 1) || {}
    },
    // 获取管家信息
    async getStewardInfo() {
      const params = {
        data: {
          buildingId: this.ownerInfo.buildingId,
          projectId: this.projectId,
          memberId: this.memberId,
          roomId: this.ownerInfo.roomId || ''
        }
      }
      const res = await findStewardByBuilding(params)
      const data = res.data || []
      
      if (res.status != 200) {
        // this.modalShow.isShow = true
        this.modalShow = true

      }
      if (data[0]?.stewardHeadUrl) {
        this.steward = data[0]
      }
    },
    // 获取便民电话列表
    async getConvenienceTel() {
      const params = {
        data: {
          file: null,
          pageSize: 1000,
          pageNum: 1,
          areaId: this.areaId,
          projectId: this.projectId,
        }
      }
      const res = await getConvenienceTel(params)

      this.phoneList = (res.data?.records || []).map(item => ({
        ...item,
        // logoUrl: encodeURIComponent(item.logoUrl || '')
        logoUrl: item.logoUrl?item.logoUrl.replace(/\s/g, encodeURIComponent(' ')):''   // 空格字符转码，否则backgroundImage无法识别链接

      }))
      console.log(145,this.phoneList)
    },
    //跳转报修
    baoxiu(){   
          uni.navigateTo({ url:'/pages-a/repair/reportingRorRepairs?taskType=1' });    
        },
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  min-height: 100vh;
  padding-top: 16rpx;
  background-color: #f5f5f5;
  box-sizing: border-box;
}
.phone-card {
  margin-bottom: 15px;
}
.header-panel {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 10px 10px 15px;
  background-color: #f5f5f5;
}
.content-panel {
  padding: 0 0 0 10rpx;
  // display: flex;
  // flex-direction: row;
  // flex-wrap: wrap;
  // justify-content: center;
  // align-items: center;
}
.footer-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 40px;
  background-color: #f5f5f5;
  z-index: 10;
}

.nodata {
    height: calc(100vh - 100rpx);
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