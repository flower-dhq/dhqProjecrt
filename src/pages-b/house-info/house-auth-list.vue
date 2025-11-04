<style lang="scss" scoped>
.house_auth--box {
  padding-top: 92rpx;
}

.top-fixed {
  height: 92rpx;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #aaa;

  .left {
    flex: 1;
    padding-left: 24rpx;

    text {
      display: block;
    }
  }

  .right {
    width: 140rpx;
    display: flex;
    color: var(--app-primary-color);
  }
}

.house-list--cont {
  padding: 26rpx;
}

.btn-cont {
  display: flex;
  padding: 100rpx 50rpx;

  view {
    flex: 1;

    text {
      width: 270rpx;
      height: 68rpx;
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 34rpx;
      font-size: 28rpx;
    }

    .add-address {
      border: 1px solid var(--app-primary-color);
      color: var(--app-primary-color);
    }

    .add-person {
      background: var(--app-primary-color);
      color: white;
    }
  }
}

.btn-cont .family-show {
  flex: 0 !important;
}
</style>
<template>
  <view class="house_auth--box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="top-fixed">
      <view class="left">
        <text>{{ userName }}您好，您的手机号为：{{ userPhone }}</text>
        <text>以下是您绑定的房产</text>
      </view>
      <view class="right" @click="navToEdit">
        <text>更改手机号</text>
      </view>
    </view>
    <view class="house-list--cont">
      <house-info-item v-for="(item, i) in addressList" :key="i" :obj="item"
        @setDefault="setDefault(item)"></house-info-item>
    </view>
    <view class="btn-cont">
      <view>
        <text class="add-address" @click.native="addAddress()" :class="{ 'house-show': showAddFamily == false }">房屋认证</text>
      </view>
      <view :class="{ 'family-show': !showAddFamily }">
        <text class="add-person" @click="inviteFamily()" v-if="showAddFamily">添加家人/租户</text>
      </view>
    </view>
  </view>
</template>
<script>
import { savePageTitle } from '@/js/router/router-utils'
import houseInfoItem from './components/house-info-item.vue'
import { findLocations, setDefaultAddress } from '../../service/community'
import utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
export default {
  components: {
    houseInfoItem
  },
  data() {
    return {
      companyId: '',
      memberId: '',
      projectType: '',
      addressList: [],
      userName: '',
      userPhone: '',
      ownerId: '',
      showAddFamily: false,
      addressInfo: {}
    }
  },

  onShow() {
    this.init();
  },

  methods: {
    navToEdit() {
      savePageTitle({ title:'个人信息' })
      uni.navigateTo({
        url: '/pages-a/profile/profile'
      })
    },
    async init() {
      const { O_USER_INFO } = this.$constant;
			const { phoneNumber } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      if (!phoneNumber) return uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
      await this.getMemberInfo();
      await this.getHouselist();
    },
    //获取房屋列表
    getHouselist() {
      let params = {
        data: {
          companyId: this.companyId,
          memberId: this.memberId,
          projectType: this.projectType
        },
        pathParams: '/1',
        "hideLoading": true
      }
      findLocations(params).then(res => {
        if (res.status == '200') {
          let tempArr = res.data.authBuildings
          if (tempArr.length > 0) {
            this.userName = tempArr[0].ownerName;
            this.userPhone = tempArr[0].ownerCall;
            let flag = true
            // 判断是否有默认地址，没有默认地址直接直接将第一套已认证房产设为默认地址
            let isDefault = tempArr.filter(f => { return f.authType == 1 && f.isDefault == 1 }).length > 0
            if (!isDefault) {
              // 获取第一个已认证房产
              let defaultList = tempArr.filter(f => { return f.authType == 1 })?.[0];
              if (defaultList) {
                this.setDefault(defaultList, false);
              }
            }
            tempArr.forEach(item => {
              //顶部姓名电话取已认证第一条数据,如果没有已认证，则取列表第一个
              if (item.authType == 1 && flag) {
                this.userName = item.ownerName;
                this.userPhone = item.ownerCall;
                this.ownerId = item.ownerId;
                flag = false
              }
              // 是否有默认地址
              if (item.authType == 1 && item.isDefault == 1) {
                isDefault = true;
              }
              //是否显示添加家人按钮
              if (item.houseState === 2 && item.authType === 1) {
                this.showAddFamily = true;
              }

              //房产认证状态
              let authTypeStr = '';
              switch (item.authType) {
                case 1:
                  authTypeStr = '认证成功';
                  break;
                case 2:
                  authTypeStr = '待认证';
                  break;
                case 3:
                  authTypeStr = '拒绝认证';
                  break;
                case 4:
                  authTypeStr = '已取消';
                  break;
                case 5:
                  authTypeStr = '异常';
                  break;
              }
              item.authTypeStr = authTypeStr

              if (item.cancelDesc) {
                item.cancelDesc = '拒绝原因：' + item.cancelDesc
              }
              if (item.rejectDesc) {
                item.rejectDesc = '取消原因：' + item.rejectDesc
              }
            });
            this.addressList = tempArr
          } else {
            this.addressList = []
          }
        }
      })
    },

    //设置为默认房产  flag 判断是否需要显示提示语
    setDefault(data, flag = true) {
      let params = {
        data: {
          memberId: this.memberId,
        },
        pathParams: `/1/${data.relateId}`,
      };
      setDefaultAddress(params).then(res => {
        if (res.status === '200') {
          if (flag) {
            this.showToast('设为默认地址成功')
          }
          this.getHouselist(false, true);
        } else {
          this.showToast(res.message)
        }
      }).catch(error => {

      })
    },

    //添加房屋
    addAddress() {
      uni.navigateTo({
        url: `/pages-b/house-info/add-house-address?ownerId=${this.ownerId}`
      });
    },

    //邀请家人/租户
    inviteFamily() {
      uni.navigateTo({
        url: '/pages-b/house-info/invite-family'
      });
    },

    // 提示
    showToast(tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },

    //获取缓存信息
    getMemberInfo() {
      const { O_USER_INFO } = this.$constant;
      const { companyId, id, phone } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.companyId = companyId;
      this.memberId = id;
      this.userPhone = phone;
      const { projectType } = commLogic.getProjectConfig();
      this.projectType = projectType
    },
  }
}
</script>