<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="area-panel">
      <u--text :text="areaText" suffixIcon="arrow-down-fill" color="#333" size="26rpx" iconStyle="color: #ccc; font-size: 18rpx;" customStyle="height: 88rpx;" @click="areaChange" />
    </view>
    <dropdown-universal :show.sync="areaShow" maskTop="90rpx" contentTop="1rpx" contentHeight="510rpx" @hideMask="areaChange(false)">
      <dropdown-three-tree :show="dropReq" :selectData="getDefaultDrop" @confirm="dropdownEvent" />
    </dropdown-universal>
    <u-gap height="24rpx" bgColor="#f9f9f9" />
    <!-- 搜索 -->
    <view class="search-panel">
      <view class="search-entity" @click="linkToSearch">
        <u-icon name="search" size="44rpx" color="#909399" customStyle="margin-right: 10rpx" />
        <text>请输入房号/客户名称/手机号码</text>
      </view>
      <!-- <u-search :value="formObj.keywords" placeholder="请输入房号/客户名称/手机号码" shape="round" :disabled="areaShow"  :showAction="false" clearabled customStyle="flex: 1 1 auto;" @blur="searchBlur" /> -->
    </view>
    <room-tree-archives :roomData="getRoomTreeData" />
    <u-safe-bottom />

    <u-toast ref="messageEl" />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import RoomTreeArchives from '@/pages-archives/modules/room-tree-archives.vue'
import DropdownUniversal from '@/components/dropdown-area/dropdown-universal.vue'
import dropdownThreeTree from '@/components/dropdown-area/dropdown-three-tree.vue'
import { syncOwnerInfo } from '@/service/api-gateway'

export default {
  mixins: [menuAuthMixin],
  components: {
    RoomTreeArchives,
    DropdownUniversal,
    dropdownThreeTree
  },
  authName: '业户档案',
  data() {
    return {
      formObj: {
        areaId: '',
        projectId: '',
        parkId: '',
        buildId: 1,
        unitId: 1,
        roomId: '',
        keywords: ''
      },
      areaShow: false, // 是否显示遮罩层
      areaText: '',
      dropReq: false, // 是否请求下拉菜单数据
    }
  },
  computed: {
    getDefaultDrop() {
      return [
        this.formObj.areaId,
        this.formObj.projectId,
        this.formObj.parkId
      ]
    },
    getRoomTreeData() {
      return {
        areaId: this.formObj.areaId,
        projectId: this.formObj.projectId,
        parkId: this.formObj.parkId,
        keywords: this.formObj.keywords
      }
    }
  },
  created() {
    this.dropReq = true
    this.syncOwnerInfo()
  },
  methods: {
    areaChange(isShow) {
      isShow = typeof(isShow) == 'boolean' ? isShow : !this.areaShow
      this.areaShow = isShow
      this.dropReq = isShow
    },
    itemEvent(type, item, index) {
      if (type == 'build') {
        this.formObj.buildId = item.name
      } else if (type == 'unit') {
        this.formObj.unitId = item.name
      } else if (type == 'room') {
        this.formObj.roomId = item.name
      }
    },
    // 下拉菜单确认事件
    dropdownEvent(selArr) {
      this.areaChange(false)
      this.areaText = selArr.map((item) => item.label).filter((label) => label).join('-')
      const defaultDrop = selArr.map((item) => item.name)
      this.formObj.areaId = defaultDrop[0] || ''
      this.formObj.projectId = defaultDrop[1] || ''
      this.formObj.parkId = defaultDrop[2] || ''
    },
    // 搜索
    linkToSearch() {
      const query = uni.$u.queryParams({
        pageType: 'room',
        isKeyword: '1', // 1: 表示启用搜索功能; 0: 表示不启用
        params: encodeURIComponent(JSON.stringify({
          areaId: this.formObj.areaId,
          projectId: this.formObj.projectId,
          parkId: this.formObj.parkId,
        }))
      })
      uni.navigateTo({ url: '/pages-archives/owner-document/list' + query })
    },
    searchBlur(value) {
      this.formObj.keywords = value || ''
    },
    // 同步接口
    async syncOwnerInfo() {
      const { O_USER_INFO } = this.$constant
      const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
      await syncOwnerInfo(userInfo.userId)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
  display: flex;
  flex-direction: column;
}
.area-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  width: 100%;
  height: 88rpx;
  background-color: #fff;
  padding: 0 30rpx;
  box-sizing: border-box;
  color: #333;
  font-size: 26rpx;
}
.search-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 14rpx 30rpx;
  border-bottom: 1px solid #EBEBEB;

  ::v-deep .u-text {
    flex: 0 0 auto !important;
    width: auto !important;
  }
}
.search-entity {
  display: flex;
  align-items: center;
  width: 100%;
  height: 68rpx;
  border-radius: 34rpx;
  background-color: #f2f2f2;
  font-size: 28rpx;
  color: #909399;
  line-height: 68rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}
</style>