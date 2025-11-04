<template>
  <view class="dropdown-filter" :style="[THEME_CSS_VAR]">
    <view class="dropdown-box">
      <!-- 区域项目下拉菜单 -->
      <view class="btn-panel" style="" @click="showProjectMenu">
        <text class="btn-text">{{ projectMenu.label }}</text>
        <image :src="require(`@/static/${THEME_NAME}/kanban/icon-white-down.png`)" style="width:16rpx;height:16rpx;margin-left: 10rpx;" />
      </view>
      <!-- 搜索框 -->
      <u-search placeholder="活动标题" v-model="searchForm.keyword" shape="square" :showAction="false" clearabled
        searchIcon=" " height="56rpx" @blur="initData" />
    </view>

    <!-- 条件筛选下拉菜单 -->
    <dropdown-menu navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="180rpx" :dataForm="filterForm"
      ref="dropdownEl" @showMask="showProjectMenu(false)" @hideMask="hideMenuEvent">
      <template v-slot="{ item }">
        <!-- 状态 -->
        <dropdown-radio :show="item.name == 'status'" :value="searchForm.status" :data="statusList"
          @confirm="confirmEvent('status', $event)" />
        <!-- 业主专享活动 -->
        <dropdown-radio :show="item.name == 'isMember'" :value="searchForm.isMember" :data="isMemberList"
          @confirm="confirmEvent('isMember', $event)" />
        <!-- 筛选 -->
        <dropdown-multiple-tree :show="item.name == 'filter'" expand="actForm" :value="getSelectNode"
          :data="filterList" nodeKey="name" menuMultiple @confirm="confirmEvent('filter', $event)"
          @reset="dropResetEvent"
        >
          <template v-slot="{ node }">
            <view class="date-panel" v-if="node.data.currentKey == 'activityDate'">
              <view :class="['date-range-panel', { read: !!searchForm.activityStartDate }]" @click="openDatePicker('actStart')">{{ searchForm.activityStartDate || '活动开始日期' }}</view> -
              <view :class="['date-range-panel', { read: !!searchForm.activityEndDate }]" @click="openDatePicker('actEnd')">{{ searchForm.activityEndDate || '活动结束日期' }}</view>
            </view>
            <view class="date-panel" v-if="node.data.currentKey == 'expirationDate'">
              <view :class="['date-range-panel', { read: !!searchForm.expirationStartDate }]" @click="openDatePicker('expStart')">{{ searchForm.expirationStartDate || '活动截止日期' }}</view> -
              <view :class="['date-range-panel', { read: !!searchForm.expirationEndDate }]" @click="openDatePicker('expEnd')">{{ searchForm.expirationEndDate || '活动截止日期' }}</view>
            </view>
          </template>
        </dropdown-multiple-tree>
      </template>
    </dropdown-menu>

    <!-- 区域项目下拉菜单的遮罩层 -->
    <dropdown-universal :show.sync="projectMenu.isShow" maskTop="90rpx" contentHeight="612rpx" contentTop="-90rpx">
      <dropdown-project show @confirm="projectConfirm" />
    </dropdown-universal>

    <!-- 活动日期 -->
    <u-datetime-picker ref="datetimeEl" :show="dateObj.isShow" v-model="dateObj.value" mode="date" @close="dateObj.isShow = false" @cancel="dateObj.isShow = false" @confirm="datetimeConfirm" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import DropdownUniversal from '@/components/dropdown-area/dropdown-universal.vue'
import DropdownProject from '@/components/dropdown-area/dropdown-project.vue'
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'

/**
 * 会员活动的条件筛选
 */
export default {
  name: 'DropdownFilter',
  mixins: [mpMixin],
  components: {
    DropdownUniversal,
    DropdownProject,
    DropdownMenu,
    DropdownRadio,
    dropdownMultipleTree
  },
  data() {
    // 获取今年的日期
    const nowDate = new Date()
    nowDate.getFullYear()

    return {
      searchForm: {
        areaId: '',
        projectId: '',
        keyword: '', // 标题搜索
        status: '', // 活动状态
        isMember: '', // 业主专享活动
        actForm: '', // 活动形式
        activityStartDate: '', // 活动报名开始日期
        activityEndDate: '', // 活动报名结束日期
        expirationStartDate: '', // 活动报名截止开始日期
        expirationEndDate: '' // 活动报名截止结束日期
      },
      projectMenu: {
        isShow: false,
        label: ''
      },
      filterForm: [
        { label: '状态', name: 'status', icon: 'down-icon' },
        { label: '业主专享活动', name: 'isMember', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' }
      ],
      statusList: [
        { label: '全部', name: '' },
        { label: '未开始', name: '1' },
        { label: '报名中', name: '2' },
        { label: '截止报名', name: '3' }
      ],
      isMemberList: [
        { label: '全部', name: '' },
        { label: '是', name: '1' },
        { label: '否', name: '0' },
      ],
      filterList: [
        {
          label: '活动形式', name: 'actForm', isRequired: true, children: [
            { label: '线下', name: '2' },
            { label: '线上', name: '1' }
          ]
        },
        { label: '活动时间', name: 'activityDate', isRequired: true, isCustom: true, isLazy: false },
        { label: '报名截止时间', name: 'expirationDate', isRequired: true, isCustom: true, isLazy: false },
      ],
      dateObj: {
        isShow: false,
        value: new Date(uni.$u.timeFormat('', 'yyyy/mm/dd 00:00:00')).getTime(),
        type: '', // 打开类型
      }
    }
  },
  computed: {
    getSelectNode() {
      return {
        actForm: [this.searchForm.actForm]
      }
    }
  },
  methods: {
    // 显示项目下拉菜单
    showProjectMenu(isShow) {
      if (typeof(isShow) == 'boolean') {
        this.projectMenu.isShow = isShow
      } else {
        this.$refs.dropdownEl.showMaskEvent(false) // 隐藏条件筛选下拉菜单
        this.projectMenu.isShow = !this.projectMenu.isShow
      }
    },
    // 项目下拉菜单确认事件
    projectConfirm(item) {
      const projectId = item.project.projectId + ''
      const areaId = item.area.areaId + ''
      this.searchForm.areaId = areaId
      this.searchForm.projectId = projectId.includes('-all') ? '' : projectId
      this.projectMenu.label = projectId.includes('-all') ? item.area.areaName : item.project.projectName
      this.projectMenu.isShow = false

      this.$emit('confirm', this.handleDate(this.searchForm))
    },
    initData() {
      this.$emit('confirm', this.handleDate(this.searchForm))
    },
    hideMenuEvent() {},
    // 条件筛选下拉菜单确认事件
    confirmEvent(name, item) {
      let actStartTmp = this.searchForm.activityStartDate
      let actEndTmp = this.searchForm.activityEndDate
      let expStartTmp = this.searchForm.expirationStartDate
      let expEndTmp = this.searchForm.expirationEndDate

      if (name == 'status') {
        this.searchForm.status = item.name || '';
        this.filterForm[0].label = item.label || '状态';
      } else if (name == 'isMember') {
        this.searchForm.isMember = item.name || '';
        this.filterForm[1].label = item.label || '业主专享活动';
      } else if (name == 'filter') {
        this.searchForm.actForm = item?.actForm?.children?.name ?? ''

        // 验证日期
        const validAct = this.validatorDate(actStartTmp, actEndTmp)
        if (!validAct.success && validAct.code == 'reFillData') return
        if (!validAct.success && validAct.code == 'initData') {
          this.searchForm.activityStartDate = ''
          this.searchForm.activityEndDate = ''
        }

        const validExp = this.validatorDate(expStartTmp, expEndTmp)
        if (!validExp.success && validExp.code == 'reFillData') return
        if (!validExp.success && validExp.code == 'initData') {
          this.searchForm.expirationStartDate = ''
          this.searchForm.expirationEndDate = ''
        }
      }

      this.$refs.dropdownEl.showMaskEvent(false)
      this.$emit('confirm', this.handleDate(this.searchForm))
    },
    // 将日期转换为具体到时间
    toDateTime(date, type) {
      let timeStr = type == 'start' ? '00:00:00' : '23:59:59'
      return date ? uni.$u.timeFormat(date, 'yyyy-mm-dd ' + timeStr) : ''
    },
    // 处理日期数据
    handleDate(formData) {
      return Object.assign({}, formData, {
        activityStartDate: this.toDateTime(this.searchForm.activityStartDate, 'start'),
        activityEndDate: this.toDateTime(this.searchForm.activityEndDate, 'end'),
        expirationStartDate: this.toDateTime(this.searchForm.expirationStartDate, 'start'),
        expirationEndDate: this.toDateTime(this.searchForm.expirationEndDate, 'end'),
      })
    },
    // 验证日期
    validatorDate(startDate, endDate) {
      const startTmp = this.DateStrToTime(startDate)
      const endTmp = this.DateStrToTime(endDate)

      if (startTmp && endTmp && endTmp < startTmp) {
        uni.showToast({
          title: '结束日期不能小于开始日期',
          icon: 'none'
        })
        return { success: false, code: 'reFillData' }
      }

      if (!startTmp || !endTmp) {
        return { success: false, code: 'initData' }
      }

      return { success: true }
    },
    // 将日期字符串转换为数字格式
    DateStrToTime(val) {
      if (!val) return 0
      return new Date(val.replace(/-/g, '/')).getTime()
    },
    // 条件筛选下拉菜单重置事件
    dropResetEvent() {
      this.searchForm.actForm = ''
      this.searchForm.activityStartDate = ''
      this.searchForm.activityEndDate = ''
      this.searchForm.expirationStartDate = ''
      this.searchForm.expirationEndDate = ''
    },
    // 打开日期选择器
    openDatePicker(type) {
      this.dateObj.type = type
      this.dateObj.isShow = true

      // 如果 datetime 为空，则表示获取当前时间
      const getTime = (datetime) => new Date(uni.$u.timeFormat(datetime || '', 'yyyy/mm/dd 00:00:00')).getTime()
      if (type == 'actStart') {
        this.dateObj.value = getTime(this.searchForm.activityStartDate)
      } else if (type == 'actEnd') {
        this.dateObj.value = getTime(this.searchForm.activityEndDate)
      } else if (type == 'expStart') {
        this.dateObj.value = getTime(this.searchForm.expirationStartDate)
      } else if (type == 'expEnd') {
        this.dateObj.value = getTime(this.searchForm.expirationEndDate)
      }

      setTimeout(() => {
        this.$refs.datetimeEl.init()
      })
    },
    // 日期选择器确认事件
    datetimeConfirm(date) {
      const val = uni.$u.timeFormat(date.value, 'yyyy-mm-dd')
      const type = this.dateObj.type
      if (type == 'actStart') {
        this.searchForm.activityStartDate = val
      } else if (type == 'actEnd') {
        this.searchForm.activityEndDate = val
      } else if (type == 'expStart') {
        this.searchForm.expirationStartDate = val
      } else if (type == 'expEnd') {
        this.searchForm.expirationEndDate = val
      }

      this.dateObj.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-filter {
  width: 100%;
  background: #fff;
}
.dropdown-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 14rpx 20rpx;
  box-sizing: border-box;
  border-bottom: 1px solid #ebebeb;
}
.btn-panel {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 204rpx;
  height: 60rpx;
  background-color: var(--app-primary-color);
  color: #fff;
  border-radius: 6rpx;
  font-size: 26rpx;
  font-family: 'PingFang SC';
  padding: 0 10rpx;
  box-sizing: border-box;
  margin-right: 20rpx;
}
.btn-text {
  @include ellipsis(1)
}
.date-panel {
  display: flex;
  padding: 30rpx;
}
.date-range-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  border: 1px solid #CCC;
  box-sizing: border-box;
  padding: 0 24rpx;
  width: 220rpx;
  height: 60rpx;
  color: #999;
  font-size: 26rpx;
  border-radius: 4rpx;

  &.read {
    color: #333;
  }
}
.date-range-gap {
  width: 70rpx;
  height: 60rpx;
  text-align: center;
  line-height: 60rpx;
  color: #999;
  font-size: 26rpx;
}
</style>