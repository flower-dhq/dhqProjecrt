<!--  -->
<template>
  <view class="pageIndex">
    <template v-for="(item, index) in menuList">
      <view class="box" :key="index" v-if="menuConfig[item.menuCode]" @click="selectType(item.menuCode)">
        <image :src="item.icon" style="width: 84rpx; height: 84rpx" />
        <view class="text-box">
          <view class="t-name">{{ item.title }}</view>
          <view class="t-tips">{{ item.desc }}</view>
        </view>
        <u-icon class="u-icon" name="arrow-right" color="#999999" size="24" />
      </view>
    </template>
    <custom-modal ref="customModal" />
    <uniPop ref="rzModal" />
  </view>
</template>

<script>
import util from "@/js/utils";
import { getAppByCode, getCompanyConfig } from "@/service/community";
import iconRemote from '@/static/aKeyOpenDoor/icon-remote.png'
import iconCode from '@/static/aKeyOpenDoor/icon-code.png'
import iconBluetooth from '@/static/aKeyOpenDoor/icon-bluetooth.png'

export default {
  components: {},
  data() {
    return {
      menuConfig: {},
      menuList: [
        {
          title: '远程开门',
          desc: '远程便捷快速开门',
          icon: iconRemote,
          menuCode: 'remoteOpenDoor'
        },
        {
          title: '二维码开门',
          desc: '扫一扫，二维码开门',
          icon: iconCode,
          menuCode: 'openDoorByCode'
        },
        {
          title: '蓝牙开门',
          desc: '诺普顿蓝牙开门',
          icon: iconBluetooth,
          menuCode: 'openDoorByNPD'
        }
      ],
      isShowFWQY: 0,
      scene: {
        ownerId: '',
        addrId: ''
      }
    };
  },
  computed: {
    // 判断是否从访客邀请过来的二维码开门
    isFromVisitor() {
      return this.scene.ownerId && this.scene.addrId
    }
  },
  async onLoad(query) {
    // 检查授权认证
    const hasMenu = await this.getMenuConfig()
    if (!hasMenu) return
    const hasPhone = await this.registerPhone()
    if (!hasPhone) return
    const hasAuth = await this.setAuthType()
    if (!hasAuth) return

    // 从访客邀请过来的二维码开门
    const scene = decodeURIComponent(decodeURIComponent(query.scene || ''))
    const [ownerId = '', addrId = ''] = scene.split('&')
    this.scene.ownerId = ownerId
    this.scene.addrId = addrId
  },
  methods: {
    selectType(menuCode) {
      if (!this.hasAuth()) {
        this.showAuthModal()
        return
      }

      let query = {}
      if (this.isFromVisitor) {
        query = {
          ownerId: this.scene.ownerId,
          addrId: this.scene.addrId,
          isFromVisitor: 1
        }
      }

      let path = "";
      if (menuCode == 'remoteOpenDoor') {
        path = '/pages-d/keyopen/remoteOpenDoor'
      } else if (menuCode == 'openDoorByCode') {
        path = '/pages-d/keyopen/codeOpenDoor'
      } else if (menuCode == 'openDoorByNPD') {
        query.menuCode = menuCode
        path = '/pages-d/keyopen/deviceList'
      }
      uni.navigateTo({ url: path + uni.$u.queryParams(query) });
    },
    // 获取菜单
    async getMenuConfig() {
      const { PROJECT_ID, MEMBER_ID } = this.$constant;
      const projectId = util.storageAction({ key: PROJECT_ID, action: "get" });
      const memberId = util.storageAction({ key: MEMBER_ID, action: "get" });

      const params = {
        data: {
          configCode: "paymentAuthModules",
          projectId,
          memberId,
        },
        hideLoading: true,
      };
      const res = await getAppByCode(params);
      const data = res.data.configDesc || [];
      this.menuConfig = this.filterMenu(data);

      const hasMenu = !!Object.keys(this.menuConfig).length
      if (!hasMenu) {
        this.$nextTick(() => {
          this.showMessage('menu')
        })
      }
      return hasMenu
    },
    filterMenu(list = []) {
      const menuCode = ["remoteOpenDoor", "openDoorByCode", 'openDoorByNPD'];
      return list
        .filter((item) => menuCode.includes(item.detailCode))
        .reduce((store, item) => {
          store[item.detailCode] = item;
          return store;
        }, {});
    },
    showMessage(type) {
      if (type == 'menu') {
        // 没有菜单权限
        this.$refs.customModal.show({
          title: '提示',
          content: '此功能暂未开放，敬请期待~',
          showConfirmButton: true,
          confirmText: '确定',
          onConfirm: () => {
            uni.navigateBack({ delta: 1 });
          },
        })
      } else if (['houseAuth', 'companyAuth'].includes(type)) {
        // 没有业主认证
        this.$refs.customModal.show({
          title: '提示',
          content: '您还未认证，请先去认证',
          showConfirmButton: true,
          showCancelButton: true,
          confirmText: "去认证",
          cancelText: '取消',
          onConfirm: () => {
            if (type == 'houseAuth') {
              // 房产认证
              uni.navigateTo({url:'/pages-b/house-info/add-house-address'})
            } else if (type == 'companyAuth') {
              // 企业认证
              uni.navigateTo({url:'/pages-d/enterprise-info/join-company'})
            }
          },
        })
      }
    },
    // 判断是否注册手机号
    registerPhone() {
      const { PROGRAM_TYPE } = this.$appConfig
      const { O_USER_INFO } = this.$constant
      const userInfo = util.storageAction({ key: O_USER_INFO, action: 'get' })

      if (!userInfo?.phoneNumber) {
        if (['wechat', 'appH5'].includes(PROGRAM_TYPE)) {
          uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' })
        } else {
          uni.navigateTo({ url: '/pages-a/authorization/bindingMobile' })
        }
        return Promise.resolve(false)
      }
      return Promise.resolve(true)
    },
    // 如果未认证，则设置认证类型
    async setAuthType() {
      if (this.hasAuth()) return Promise.resolve(true)

      const { COMPLANY_ID } = this.$constant
      const companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
      const params = {
        data: {
          companyId
        }
      }
      const res = await getCompanyConfig(params)
      const authTypes = this.parseStr2JSON(res.data?.authType).filter(Boolean)

      // 设置认证类型
      let temp = 0
      if (authTypes.length == 1) {
        const num = parseInt(authTypes[0])
        temp =  isNaN(num) ? 0 : num
      } else if (authTypes.length == 2) {
        temp = 0
      }
      this.showFWQY = temp

      this.$nextTick(() => {
        this.showAuthModal()
      })

      return Promise.resolve(false)
    },
    // 将字符串转换为数组，例如 "["2", "1"]" => ["2", "1"]
    parseStr2JSON(val) {
      try {
        return JSON.parse(val)
      } catch (error) {
        return []
      }
    },
    // 弹出认证窗口
    showAuthModal() {
      if (this.showFWQY == 0) {
        this.$refs.rzModal.showModal({ modalType: 'rz' })
        this.$refs.rzModal.showCompanyConfig()
      } else {
        this.showMessage(this.showFWQY == 1 ? 'houseAuth' : 'companyAuth')
      }
    },
    // 判断业主是否认证
    hasAuth() {
      const { IS_ASSOCIATION } = this.$constant
      const isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' })
      return (isAssociation != void 0 && isAssociation != '0' && isAssociation != '-1')
    }
  },
};
</script>
<style scoped lang="scss">
.pageIndex {
  background: #f5f5f5;
  padding: 30rpx 20rpx;
  height: 100vh;
  box-sizing: border-box;
}

.box {
  background: #ffffff;
  padding: 48rpx 30rpx;
  display: flex;
  align-items: center;
  border-radius: 8rpx;
  margin-bottom: 30rpx;

  .text-box {
    margin: 0 20rpx;
    display: grid;
    gap: 4rpx;

    .t-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
    }

    .t-tips {
      font-size: 28rpx;
      color: #999999;
    }
  }

  ::v-deep .u-icon {
    position: absolute !important;
    right: 30rpx !important;
  }
}
</style>
