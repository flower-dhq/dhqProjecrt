<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <u-search placeholder="请输入名字搜索" v-model="searchForm.keyword" color="#999999" shape="square" :showAction="false"  @blur="getDetail" />
    <dropdown-menu
      navHeigh="88rpx" :navIndex="10" contentHeight="auto"
      maskTop="270rpx" :dataForm="filterForm" :required="false"
      ref="dropdownEl"
      @showMask="showMenuEvent" @hideMask="hideMenuEvent"
    >
      <template v-slot="{ item }">
        <dropdown-project :show="item.name == 'area'" isAllArea @confirm="confirmEvent('area', $event)" />
        <dropdown-radio
          :show="item.name == 'state'" :value="searchForm.state"
          :data="stateList" required
          @confirm="confirmEvent('state', $event)"
        />
      </template>
    </dropdown-menu>
    <view class="countView">共{{ pageForm.total }}位执行人员</view>
    <!-- <u-icon name="search" :label="'共' + pageForm.total + '位执行人员'" labelSize="14px" size="18px" customStyle="padding: 13px 0" /> -->
    <member-table v-if="categoryList.doing.length" stateText="进行中" :data="categoryList.doing" isShowSend :taskId="taskId" />
    <member-table v-if="categoryList.finished.length" stateText="已完成" :data="categoryList.finished" />
    <member-table v-if="categoryList.expired.length" stateText="已过期" :data="categoryList.expired" />
    <member-table v-if="categoryList.timeout.length" stateText="超时进行中" :data="categoryList.timeout" />
    <member-table v-if="categoryList.timeoutFinished.length" stateText="超时完成" :data="categoryList.timeoutFinished" />
    <member-table v-if="categoryList.abolished.length" stateText="已作废" :data="categoryList.abolished" />

    <u-safe-bottom />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownProject from '@/components/dropdown-area/dropdown-project.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import MemberTable from '@/pages-tasks/task-detail/modules/member-table.vue'
import { employeeMassSendingTask } from '@/service/api-gateway'

/**
 * 子任务执行情况
 */
export default {
  mixins: [mpMixin],
  components: {
    DropdownMenu,
    DropdownProject,
    DropdownRadio,
    MemberTable
  },
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    this.tableList = [] // 存储所有的执行成员

    return {
      filterForm: [
        { label: '全部', name: 'area', icon: 'down-icon' },
        { label: '状态', name: 'state', icon: 'down-icon' }
      ],
      stateList: [
        { label: '全部', name: '' },
        { label: '进行中', name: '0' },
        { label: '已完成', name: '1' },
        { label: '已过期', name: '2' },
        { label: '超时进行中', name: '3' },
        { label: '超时完成', name: '4' },
        { label: '已作废', name: '5' }
      ],
      searchForm: {
        areaId: '',
        projectId: '',
        state: '',
        keyword: ''
      },
      pageForm: {
        current: 1,
        size: 9999,
        total: 0,
        loadMore: 'loading' // loading, nomore
      },
      // 按任务状态分类存储执行成员
      categoryList: {
        // 进行中
        doing: [],
        // 已完成
        finished: [],
        // 已过期
        expired: [],
        // 超时进行中
        timeout: [],
        // 超时完成
        timeoutFinished: [],
        // 已作废
        abolished: []
      },
    }
  },
  mounted() {
  },
  methods: {
    // 显示菜单栏
    showMenuEvent(item) {
    },
    // 隐藏菜单栏
    hideMenuEvent() {
    },
    confirmEvent(name, item) {
      this.$refs.dropdownEl.showMaskEvent(false)

      if (name === 'area') {
        const projectId = item.project.projectId + ''
        this.filterForm[0].label = projectId.includes('-all') ? item.area.areaName : item.project.projectName
        const areaId = item.area.areaId + ''
        this.searchForm.areaId = areaId == 'all' ? '' : areaId // 'all'表示全部区域
        this.searchForm.projectId = projectId.includes('-all') ? '' : projectId // '[areaId]-all'表示区域下的全部项目
      } else if (name == 'state') {
        this.searchForm.state = item.name || ''
        this.filterForm[1].label = item.name === '' ? '状态' : (item.label || '状态')
      }

      this.getDetail()
    },
    async getDetail() {
      const params = {
        data: {
          size: this.pageForm.size,
          current: this.pageForm.current,
          taskId: this.taskId,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          nickName: this.searchForm.keyword,
          sendStatus: this.searchForm.state 
        }
      }
      const res = await employeeMassSendingTask(params)
      const data = res?.data ?? {}

      this.tableList = data.records || []
      this.pageForm.total = data.total || 0
      this.categoryList = this.stateCategory(data.records || [])
    },
    // 任务状态进行分类
    stateCategory(arr = []) {
      let store = {
        // 进行中
        doing: [],
        // 已完成
        finished: [],
        // 已过期
        expired: [],
        // 超时进行中
        timeout: [],
        // 超时完成
        timeoutFinished: [],
        // 已作废
        abolished: []
      }

      arr.forEach(item => {
        const state = item.sendStatus
        if (state == '0') {
          store.doing.push(item)
        } else if (state == '1') {
          store.finished.push(item)
        } else if (state == '2') {
          store.expired.push(item)
        } else if (state == '3') {
          store.timeout.push(item)
        } else if (state == '4') {
          store.timeoutFinished.push(item)
        } else if (state == '5') {
          store.abolished.push(item)
        } 
      })

      return store
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
.countView{
  background-color: #F9F9F9;
  padding-left: 30rpx;
  padding-top: 24rpx;
  font-size: 28rpx;
  color: #666666;
}
</style>