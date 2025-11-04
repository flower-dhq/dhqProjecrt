<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="main">
      <image  class="img" :src="require(`@/static/${THEME_NAME}/leasing/icon-tool-bg.png`)" style="width:400rpx;height:400rpx;" />
    </view>
    <u-modal :show="projectShow" title="请选择项目">
      <view class="slot-content">
        <view class="slot-content-item" v-for="(item, index) in projectList" :key="index" @click="goToPay(item)">
          <text class="name">{{ item.projectName }}</text>
          <image  class="img" :src="require(`@/static/${THEME_NAME}/leasing/icon-right.png`)" style="width:20rpx;height:20rpx;" />
        </view>

      </view>
      <view slot="confirmButton">
        <!-- 退出小程序 -->
        <navigator open-type="exit" target="miniProgram" class="close-btn complete">取消</navigator>
      </view>
    </u-modal>
    <yb-complete exist ref="completeMsgEl" />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import { getBuildingQuesTaskList } from '@/service/landcrm'
import {getCustomerTree,getFloorRoomInfoByCell,getCustomerDetailByUnionId} from "@/service/leasing";
import Utils from '@/js/utils'

export default {
  mixins: [menuAuthMixin],
  components: {
  },
  authName: '应收管理',
  data() {
    return {
      searchForm: {
        areaName: '',
        projectName: '',
        compoundName: '',
        buildingId: '',
        cellId: '',
      },
      buildingList: [],
      cellList: [],
      roomList: [],
      parkingList: [],
      bills: {},
      showArrears: false,
      userInfo: {},
      current: 0,
      projectShow: false,
      projectList: [],
    }
  },
  computed: {
    compoundName(){
      if(this.searchForm.areaName){
        return [ this.searchForm.projectName, this.searchForm.compoundName].join('-');
      }
    },
    filterRoomList(){
      if(this.showArrears){
        return this.roomList.filter(item => {
          return item.rooms.every(ele =>  ele.arrear && ele.arrear == '1')
        })
      }else{
        return this.roomList;
      }
    }
  },
  onLoad(){
    var O_USER_INFO = this.$constant.O_USER_INFO;
    this.userInfo = this.$utils.storageAction({
      key: O_USER_INFO,
      action: 'get'
    });
    console.log('userInfo', this.userInfo);


  },
  mounted() {
    // this.$refs.completeMsgEl.showMessage('该业主未认证，请先邀请业主认证后使用')
  },
  async onShow() {
    // 认证登录
    await this.$onLaunched
    uni.showLoading({
      title: '授权中...'
    });
    this.dealShow()
  },
  methods: {
   dealShow() {
      let self= this;
      wx.qy.getContext({
        success:async function(res){
          var entry = res.entry;//返回进入小程序的入口类型
          console.log('entry', entry);
          if(entry == 'single_chat_tools') {
            // 判断是否有菜单权限
            let flag = await Utils.toolbarPermissions()
            if(!flag) return

            wx.qy.getCurExternalContact  ({
              success: function(res) {
                var userId = res.userId //返回当前联系人userId
                console.log('userId', userId);
                var params = {
                  data: {
                    companyId: self.$appConfig.COMPLANY_ID,
                    userId: userId,
                    stewardId: self.userInfo.userId,
                  },
                  hideLoading: true,
                  responseToast: false,
                }
                console.log('params:', params.data);
                getCustomerDetailByUnionId(params).then(res => {
                  uni.hideLoading()
                  console.log('getCustomerDetailByUnionId',res);
                  if(res.status == 200){
                    if(!res.data.length ){
                      self.$refs.completeMsgEl.showMessage('该业主未认证，请先邀请业主认证后使用')
                      return;
                    }else if(res.data.length  == 1){
                      let customers =encodeURIComponent(JSON.stringify(res.data));
                      uni.redirectTo({
                        url: `/pages-leasing/staffPayment?customers=${customers}`
                      });
                    }else{
                      self.projectList = res.data;
                      self.projectShow = true;
                    }

                  }else{
                    self.$refs.completeMsgEl.showMessage(res.message)
                  }
                })
              },
              fail: function (res){
                console.log('fail', res);
              }
            })
          }
        },
        fail: function (res){
          console.log('fail', res);
        }
      })
    },
    goToPay(item){
      let customers =encodeURIComponent(JSON.stringify([item]));
      uni.redirectTo({
        url: `/pages-leasing/staffPayment?customers=${customers}`
      });
      this.projectShow = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.close-btn {
  display: block;
  text-align: center;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 16px;
  color: #606266;

  &:active:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.page-panel {
  padding-bottom: 10px;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  width: 100%;
  .main{
    display: flex;
    flex-direction: row;
    justify-content: center;
    .img{
      margin-top: 150rpx;
    }
  }
}
.slot-content{
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 500rpx;
  overflow: hidden;
  overflow-y: scroll;
  &-item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom:  1px solid #EBEBEB;;
    align-items: center;
    .name{
      font-family: PingFang SC;
      font-weight: 400;
      font-size: 26rpx;
      color: #333333;
    }
  }
}
::v-deep .u-sticky {
  border-bottom: 1px solid #EAEAEA;
}
::v-deep .u-tabs__wrapper__nav__line {
  bottom: 16rpx !important;
}
::v-deep .u-search {
  padding: 14rpx 24rpx;
  border-bottom: 1px solid #EAEAEA;
  background-color: #fff;
  z-index: 10;
  position: relative;

  .u-search__content__input {
    height: 56rpx !important;
  }
}
::v-deep .workorder-sheet {
  margin: 24rpx 20rpx 0;
}
</style>
