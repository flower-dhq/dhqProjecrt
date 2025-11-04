<template>
  <view class="house-auth-popup">
    <u-popup :show="isShow" mode="bottom" :round="15" :customStyle="{ height: '150px' }" @close="onClose" @open="onOpen">
      <scroll-view scroll-y :scroll-into-view="scrollTo">
        <!-- <view class="house__content"> -->
          <cell-text
            v-for="(item, index) in houseList" :key="item.uniqueId" :label="item.ownerName"
            isRight isDesc labelColor="#333"
            labelWidth="50%" :border="index === houseList.length - 1 ? 'none' : 'bottom'" :padding="10"
            contentAlign="flex-end" :class="{ 'isSelect': index === selItem.index }" :id="item.uniqueId"
            @click.native="onSelect(item, index)"
          >
            <text>{{ item.ownerPhones }}</text>
            <view class="house__content--right" slot="right" style="width: 45px;">{{ item.authTypeText }}</view>
            <text slot="desc">{{ item.address }}</text>
          </cell-text>
        <!-- </view> -->
      </scroll-view>
      <u-gap height="7" bgColor="#eaeaec" />
      <u-button @click="getPage" text="添加认证" :customStyle="{ border: 'none', borderRadius: 0 }" />
    </u-popup>
    <uniPop ref="rzModal"></uniPop>

  </view>
</template>

<script>
import CellText from '@/components/cell-text/cell-text'
import { findLocations } from '@/service/community'
import Utils from '@/js/utils'

/**
 * @property {boolean} isShow
 * 
 * @slot select 参数：被选中项
 */
export default {
  name: 'HouseAuthPopup',
  props: {
    isShow: Boolean
  },
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID, PROJECT_ID, O_USER_INFO } = this.$constant

    const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })
    return {
      companyId: userInfo.companyId,
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      houseList: [],
      selItem: {
        index: 0,
        value: {}
      },
      scrollTo: ''
    }
  },
  created() {
    this.findLocations()
  },
  methods: {
    async findLocations() {
      const params = {
        data: {
          companyId: this.companyId,
          memberId: this.memberId,
          projectType: this.projectId,
          authType:'1',
        },
        pathParams: '/0'
      }
      let res = await findLocations(params)
      
      this.houseList = (res.data?.authBuildings || []).map(item => ({
        ...item,
        uniqueId: 'cell-text-' + Utils.uuid().substring(0, 8),
        authTypeText: this.authType(item.authType)
      })).filter(item=>item.authType==1)
      if (this.houseList.length) {
        this.onSelect(this.houseList[0], 0)
      }
    },
    authType(type) {
      const tmp = {
        1: '已认证',
        2: '待认证',
        3: '已取消',
        4: '已取消',
        5: '异常'
      }

      return tmp[type] || ''
    },
    onClose(item) {
      if (item) {
        item = JSON.parse(JSON.stringify(item))
      }
      this.$emit('select', item)
    },
    onSelect(item, index) {
      this.selItem.index = index
      this.selItem.value = item

      this.onClose(item)
    },
    onOpen() {
      this.$nextTick(() => {
        this.scrollTo = this.selItem.value.uniqueId
      })
    },
    getPage() {
      this.$refs.rzModal.showModal({ modalType: 'rz' });
      this.$refs.rzModal.showCompanyConfig();
      // uni.navigateTo({url: '/pages-b/house-info/add-house-address'})
    }
  }
}
</script>

<style lang="scss" scoped>
scroll-view {
  height: 250px;
  font-size: 14px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow-x: hidden;
}
.house__content--right {
  color: #ff0167;
}
.cell-text.isSelect {
  background-color: #f2f3f5;
}
.cell-text:active {
  background-color: #f2f3f5;
}
</style>