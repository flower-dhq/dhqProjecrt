<template>
  <view :class="['dropdown-project', getCustomClass]" :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]">
    <view class="tree-panel">

      <!-- 左侧菜单栏 -->
      <view class="tree-menu">
        <text :class="['tree-menu--item', { selected: tempForm.menuId == item.name }]" v-for="(item, index) in menuList" :key="index" @click="menuClickEvent(index, item)">{{ item.label }}</text>
      </view>

      <!-- 右侧列表 -->
      <!-- 受理人 -->
      <view :class="['tree-list', { show: tempForm.menuId == 'receivePeople' }]">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in staffList" :key="index">
            <view :class="['tree-list--item', { selected: tempForm.receivePeople == item.userName }]" @click="childClickEvent('receivePeople', index, item)">
              <text>{{ item.userName }}</text>
              <u-icon name="checkmark" v-if="tempForm.receivePeople == item.userName" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>

      <!-- 关闭时限 -->
      <view :class="['tree-list', { show: tempForm.menuId == 'closeDate' }]">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in closeDateList" :key="index">
            <view :class="['tree-list--item', { selected: tempForm.acceptanceTime == item.name }]" @click="childClickEvent('acceptanceTime', index, item)">
              <text>{{ item.label }}</text>
              <u-icon name="checkmark" v-if="tempForm.acceptanceTime == item.name" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>

      <!-- 支付状态 -->
      <view :class="['tree-list', { show: tempForm.menuId == 'payment' }]">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in paymentList" :key="index">
            <view :class="['tree-list--item', { selected: tempForm.payStatus == item.name }]" @click="childClickEvent('payStatus', index, item)">
              <text>{{ item.label }}</text>
              <u-icon name="checkmark" v-if="tempForm.payStatus == item.name" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>

    </view>

    <view class="tree-btn">
      <u-button text="重置" :customStyle="{ flex: '0 0 240rpx', height: '88rpx' }" @click="resetEvent" />
      <u-button text="确认" type="primary" :customStyle="{ flex: '1 1 auto', height: '88rpx' }" @click="confirmEvent"  />
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import { getJobArchUsers } from '@/service/landcrm'

/**
 * 下拉列表 - 筛选[受理人, 关闭时限, 支付状态]
 * @event confirm 提交事件
 */
export default {
  name: 'DropdownProject',
  mixins: [mpMixin],
  props: {
    // 显示/隐藏
    show: Boolean,
    // 区域和项目，是用于查询出受理人的
    areaId: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      menuList: [
        { label: '受理人', name: 'receivePeople' },
        { label: '关闭时限', name: 'closeDate' },
        { label: '支付状态', name: 'payment' }
      ],
      staffList: [],
      closeDateList: [
        { label: '今天', name: '1' },
        { label: '昨天', name: '2' },
        { label: '更多', name: '0' },
      ],
      paymentList: [
        { label: '已创建', name: '0' },
        { label: '已支付', name: '1' },
        { label: '已退款', name: '2' },
        { label: '部分退款', name: '3' },
      ],
      // 默认设置
      defaultForm: {
        menuId: '',
        receivePeople: '',
        acceptanceTime: '',
        payStatus: ''
      },
      // 临时设置
      tempForm: {
        menuId: '',
        receivePeople: '',
        acceptanceTime: '',
        payStatus: ''
      }
    }
  },
  watch: {
    show(newVal) {
      // 如果点击展示，则请求数据
      if (newVal) {
        this.getJobArchUsers()
      } else {
        this.resetEvent()
      }
    }
  },
  async created() {
    this.menuClickEvent(0, this.menuList[0])
  },
  methods: {
    async getJobArchUsers() {
      const params = {
        data: {
          jobId: '',
          areaId: this.areaId,
          projectId: this.projectId.includes('-all') ? '' : this.projectId // '[areaId]-all'表示区域下的全部项目
        },
        hideLoading: true
      }
      const res = await getJobArchUsers(params)
      this.staffList = res.data || []
    },
    // 左侧菜单栏操作
    menuClickEvent(index, item) {
      this.tempForm.menuId = item.name
    },
    // 右侧列表操作
    childClickEvent(keyName, index, item) {
      let value = this.tempForm[keyName]
      // 如果是点击同一个节点，则设置不选中，否则设置选中
      this.tempForm[keyName] = (value == item.userName) ? '' : item.userName
    },
    // 重置
    resetEvent() {
      this.tempForm = Object.assign({}, this.defaultForm)
    },
    // 提交。只有确认操作，才能保存数据
    confirmEvent() {
      const tmp = this.defaultForm = Object.assign({}, this.tempForm)
      const { menuId, ...params } = tmp
      this.$emit('confirm', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-multiple-tree {
  @include flx-dsp(flex-start, flex-start, column);
  font-family: "PingFang SC";
}
.tree-panel {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
  height: 408rpx;
}
.tree-menu {
  flex: 0 0 180rpx;
  height: 100%;
  background-color: #F7F7F7;
}
.tree-menu--item {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 30rpx;
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
  padding: 30rpx;
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