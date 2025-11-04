<template>
  <view class="page-box"  :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="list-content">
      <u-list
        @scrolltolower="scrolltolower"
        class="page-content-body"
      >
        <u-list-item
          v-for="(item, index) in meetingList"
          :key="index"
        > 
          <meeting-card :key="item.meetingId" :data="item" @click.native="linkTo(item.meetingId)" />
        </u-list-item>
      </u-list>
      <view v-if='meetingList.length==0' class="nodata"></view>
    </view>
  </view>
</template>

<script>
import MeetingCard from './components/meeting-card.vue'
import Utils from '@/js/utils'
import { getAuthCompanyList } from '@/service/community';
import { getMeetingRoomList } from '@/service/meeting'
// import AuthCompanyMixin from './components/auth-company-mixin.js'

export default {
  components: {
    MeetingCard
  },
  data() {
    const { MEMBER_ID, COMPLANY_ID,O_USER_INFO } = this.$constant
    return {
      isRefresh: false, // 是否刷新完
      isFinished: false, // 是否加载完
      meetingList: [], // 列表数据
      pageNum: 0, // 页码
      listCount: 0, // 列表总数
      // authCompany: new AuthCompanyMixin(), // 已认证的企业
      authCompany: '', // 已认证的企业
      companyId: (Utils.storageAction({ key: O_USER_INFO, action: 'get' })) ? (Utils.storageAction({ key: O_USER_INFO, action: 'get' })).companyId : Utils.storageAction({ key: COMPLANY_ID, action: 'get' }) ,
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getMeetingListData(1)
  },
  async created() {
    // await this.getEnterpriseAuthList()
    // await this.getMeetingListData(1)
  },

  async onShow(){
    const { MEMBER_ID} = this.$constant
    let memberId = Utils.storageAction({ key: MEMBER_ID, action: 'get' })
    if(!memberId){
      uni.navigateTo({ url:'/pages-a/authorization/bindingMobile'});
      return
    }else{
      await this.getEnterpriseAuthList()
      await this.getMeetingListData(1)
    }
  },

  methods: {
    // 上拉加载
    scrolltolower() {
      if (!this.isFinished) {
        this.pageNum++
        this.getMeetingListData(this.pageNum) 
      }
    },
    // 获取列表数据
    async getMeetingListData(pageNum) {
      const params = {
        data: {
          pageNum,
          pageSize: 20,
          enterpriseIds: this.authCompany
        }
      }
      const res = await getMeetingRoomList(params)

      this.isRefresh = false
      if (pageNum == 1) {
        this.meetingList = res.data.data.row || []
      }else {
        this.meetingList = this.meetingList.concat(res.data.data.row || [])
      }
      this.listCount = res.data.data.total || 0
      // 加载到最后一页，就关闭上拉加载
      if (this.meetingList.length === this.listCount) {
        this.isFinished = true
      }
      uni.stopPullDownRefresh()
    },
    // 跳转到详情页面
    linkTo(meetingId) {
      uni.navigateTo({
        url: `/pages-c/meeting-room/room-detail?meetingId=${meetingId}`
      })
    },
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
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  background-color: #f6f6f7;
}
.list-content {
  min-height: 100vh;
}
.threshold-bottom {
  width: 100%;
  height: 10px;
}
.nodata {
  height: 100vh;
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
