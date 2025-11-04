<template>
  <view :class="['dropdown-project', getCustomClass]" :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]">
    <view class="tree-panel">

      <!-- 左侧菜单栏 -->
      <view class="tree-menu">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <text :class="['tree-menu--item', { selected: selArea.areaId == item.areaId }]" v-for="(item, index) in areaList" :key="index" @click="menuClickEvent(index, item)">{{ item.areaName }}</text>
        </scroll-view>
      </view>

      <!-- 右侧列表 -->
      <view :class="['tree-list', { show: true }]">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in getChildList" :key="index">
            <view :class="['tree-list--item', { selected: selProject.projectId == item.projectId }]" @click="childClickEvent(index, item)">
              <text>{{ item.projectName }}</text>
              <u-icon name="checkmark" v-if="selProject.projectId == item.projectId" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>

    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getAreaList, getProjectList } from '@/service/landcrm'

/**
 * 下拉列表 - 区域项目
 * @event confirm 提交事件
 */
export default {
  name: 'DropdownProject',
  mixins: [mpMixin],
  props: {
    // 显示/隐藏
    show: Boolean
  },
  data() {
    return {
      store: {},
      areaList: [],
      selArea: {},
      selProject: {}
    }
  },
  computed: {
    getChildList() {
      return this.store[this.selArea.areaId] || []
    }
  },
  async created() {
    this.tempId = 0
    await this.getAreaList()
    if (this.areaList.length) {
      // 获取第一个区域数据
      await this.menuClickEvent(0, this.areaList[0])
    }
    // 获取第一个项目数据
    if (this.getChildList.length) {
      this.childClickEvent(0, this.getChildList[0])
    }
  },
  methods: {
    async getAreaList() {
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      const params = {
        data: {
          userId: userInfo.userId
        },
        hideLoading: true,
        responseToast: false
      }
      let res = await getAreaList(params)
      this.areaList = res.items
      this.store = res.items.reduce((store, item) => {
        store[item.areaId] = null
        return store
      }, {})
    },
    async getProjectList(areaId) {
      // 判断是否已经加载过了
      if (this.store[areaId]) return
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      
      const params = {
        data: {
          userId:userInfo.userId,
          areaId
        },
        hideLoading: true,
        responseToast: false
      }
      let res = await getProjectList(params)
      // res.items.unshift({ projectName: '全部', projectId: `${areaId}-all` })
      this.store[areaId] = res.items
    },
    // 左侧菜单栏操作
    async menuClickEvent(index, item) {
      this.selArea = item
      await this.getProjectList(item.areaId)
    },
    // 右侧列表操作
    childClickEvent(index, item) {
      this.selProject = item
      this.confirmEvent()
    },
    // 提交
    confirmEvent() {
      this.$emit('confirm', { area: this.selArea, project: this.selProject })
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-project {
  @include flx-dsp(flex-start, flex-start, column);
  font-family: "PingFang SC";
}
.tree-panel {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
  height: 612rpx;
}
.tree-menu {
  flex: 0 0 230rpx;
  height: 100%;
  background-color: #F7F7F7;
}
.tree-menu--item {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 0 20rpx 0 30rpx;
  box-sizing: border-box;
  font-size: 30rpx;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
    background-color: #fff;
  }
}
.tree-list {
  flex: 1 1 auto;
  height: 100%;
  display: none;

  &.show {
    display: block;
  }
}
.tree-list--item {
  width: 100%;
  @include flx-dsp(space-between, center);
  font-size: 30rpx;
  padding: 0 30rpx;
  border-bottom: 1px solid #EAEAEA;
  box-sizing: border-box;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
  }
}
.tree-btn {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
}
</style>