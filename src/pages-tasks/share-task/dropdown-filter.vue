<template>
  <dropdown-menu navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="270rpx" :dataForm="filterForm"
    :required="false" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
    <template v-slot="{ item }">
      <!-- 创建人 -->
      <dropdown-radio :show="item.name == 'creator'" :value="searchFrom.creator" :data="creatorList" required @confirm="confirmEvent('creator', $event)" />
      <!-- 截止日期 -->
      <dropdown-date :show="item.name == 'endDate'" isShowMonth isShowDate @confirm="confirmEvent('endDate', $event)" />
      <!-- 我的任务-状态 -->
      <dropdown-radio :show="item.name == 'state' && pageType == 'selfTask'" :value="searchForm.selfState" :data="selfStateList" required @confirm="confirmEvent('state', $event)" />
      <!-- 总任务-状态 -->
      <dropdown-radio :show="item.name == 'state' && pageType == 'allTask'" :value="searchForm.allState" :data="allStateList" required @confirm="confirmEvent('state', $event)" />
      <!-- 类型 -->
      <dropdown-radio :show="item.name == 'type'" :value="searchForm.type" :data="typeList" required @confirm="confirmEvent('type', $event)" />
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownDate from '@/components/dropdown-area/dropdown-date.vue'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownDate,
  },
  props: {
    // selfTask: 我的任务, allTask: 总任务
    pageType: {
      type: String,
      validator(val) {
        return ['selfTask', 'allTask'].includes(val)
      },
      default: 'selfTask'
    }
  },
  data() {
    return {
      filterForm: [
        // { label: '创建人', name: 'creator', icon: 'down-icon' },
        { label: '截止日期', name: 'endDate', icon: 'calendar' },
        { label: '状态', name: 'state', icon: 'down-icon' },
        { label: '类型', name: 'type', icon: 'down-icon' }
      ],
      searchForm: {
        creator: '',
        endDate: '',
        selfState: '',
        allState: '',
        type: ''
      },
      creatorList: [],
      selfStateList: [
        { label: '全部', name: '' },
        { label: '进行中', name: '0' },
        { label: '已完成', name: '1' },
        { label: '已过期', name: '2' },
        { label: '超时进行中', name: '3' },
        { label: '超时完成', name: '4' },
        { label: '已作废', name: '5' },
      ],
      allStateList: [
        { label: '全部', name: '' },
        { label: '进行中', name: '0' },
        { label: '已结束', name: '1' },
        { label: '已结束（全部完成）', name: '2' },
        { label: '超时进行中', name: '3' },
        { label: '超时完成', name: '4' },
        { label: '已作废', name: '5' },
      ],
      typeList: [
        { label: '全部', name: '' },
        { label: '消息群发', name: '1' },
        { label: '朋友圈转发', name: '2' },
      ],
    }
  },
  watch: {
    pageType: {
      handler(newVal) {
        newVal = newVal || 'selfTask'

        // 判断是否存在 创建人 数据
        const hasItem = this.filterForm.some(item => item.name === 'creator')

        if (newVal == 'allTask') {
          // 总任务列表 菜单栏下，不显示 创建人
          if (hasItem) this.filterForm.shift()
        } else if (newVal == 'selfTask') {
          // 我的任务 菜单栏下，显示 创建人
          // if (!hasItem) this.filterForm.unshift({ label: '创建人', name: 'creator', icon: 'down-icon' })
        }

        // 当菜单栏切换时，状态菜单的文字需要切换
        const index = this.filterForm.findIndex(item => item.name == 'state')
        if (newVal == 'selfTask') {
          const item = this.selfStateList.find(item => item.name == this.searchForm.selfState)
          this.filterForm[index].label = item.name == '' ? '状态' : item.label
        } else if (newVal == 'allTask') {
          const item = this.allStateList.find(item => item.name == this.searchForm.allState)
          this.filterForm[index].label = item.name === '' ? '状态' : item.label
        }
      }
    }
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

      if (name == 'creator') {
        this.searchForm.creator = item.name
      } else if (name == 'endDate') {
        this.searchForm.endDate = item.name ? (item.name + ' 23:59:59') : ''
      } else if (name == 'state') {
        if (this.pageType == 'selfTask') {
          this.searchForm.selfState = item.name
        } else if (this.pageType == 'allTask') {
          this.searchForm.allState = item.name
        }

        const index = this.filterForm.findIndex(item => item.name == 'state')
        this.filterForm[index].label = item.name === '' ? '状态' : item.label
      } else if (name == 'type') {
        this.searchForm.type = item.name

        const index = this.filterForm.findIndex(item => item.name == 'type')
        this.filterForm[index].label = item.name === '' ? '类型' : item.label
      }

      this.$emit('confirm', this.searchForm)
    }
  }
}
</script>

<style>
</style>