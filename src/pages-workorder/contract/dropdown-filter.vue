<template>
  <dropdown-menu
    navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="180rpx"
    :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
  >
    <template v-slot="{ item }">
      <!-- 资源分类 -->
      <dropdown-radio :show="item.name == 'ziyuan'" :value="searchForm.resourceMenuIds"  :data="zyList" @confirm="confirmEvent('ziyuan', $event)" />
      <!-- 合同状态 -->
      <dropdown-radio :show="item.name == 'heTongState'" :value="searchForm.contractStatus" :data="heTongStateList" @confirm="confirmEvent('heTongState', $event)" />
      <!--车位 合同状态 -->
      <dropdown-radio :show="item.name == 'carHeTongState'" :value="searchForm.contractStatus" :data="carHeTongStateList" @confirm="confirmEvent('carHeTongState', $event)" />
      <!-- 合同类型 -->
      <dropdown-radio :show="item.name == 'typeState'" :value="searchForm.typeState" :data="typeStateList" @confirm="confirmEvent('typeState', $event)" />
      <!-- 处理时限 -->
      <dropdown-radio :show="item.name == 'approvalState'" :value="searchForm.approveStatus" :data="approvalStateList" @confirm="confirmEvent('approvalState', $event)" />
      <!-- 筛选 -->
      <dropdown-radio :show="item.name == 'filter'" :value="searchForm.fiId" :data="filterList" maxHeight="600rpx" @confirm="confirmEvent('filter', $event)"/>
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue'
import dropdownMultipleTree from '@/components/dropdown-area/dropdown-multiple-tree.vue'
export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownStaff,
    dropdownMultipleTree
  },
  props: {
    filterForm: {
      type: Array,
      default: () => ([
        { label: '合同状态', name: 'heTongState', icon: 'down-icon' },
        { label: '审批状态', name: 'approvalState', icon: 'down-icon' },
        // { label: '费项', name: 'filter', icon: 'bottom' }
      ])
    },
    isZongFlag: {
      type: String,
      default: ''
    },
    filterList: {
      type: Array,
      default: () => []
    },
    zyList:{
      type: Array,
      default: () => []
    }
  },
  data() {
    const userId = this.$appConfig.USER_ID
    const nowDate = new Date()


    return {
      ziyuanList: [
        { label: '电梯广告', name: '0' },
        { label: '快递柜', name: '1' },
        { label: '大堂广告', name: '2' },
      ],
      // contractStatus
      heTongStateList: [
        { label: '全部',name: '' },
        { label: '未开始', name: '0' },
        { label: '进行中', name: '1' },
        { label: '已终止', name: '2' },
        // { label: '待终止', name: '3' },
        { label: '已废弃', name: '4' },
        { label: '即将到期', name: '5' },
      ],
      carHeTongStateList: [
        { label: '全部',name: '' },
        { label: '待开始', name: '3' },
        { label: '进行中', name: '1' },
        { label: '已终止', name: '2' },
        // { label: '待终止', name: '3' },
        { label: '已废弃', name: '4' },
      ],
      typeStateList: [
        { label: '全部',name: '' },
        { label: '出租', name: '0' },
        { label: '出售', name: '1' },
        { label: '空置', name: '2' },
      ],
      approvalStateList: [
        { label: '全部',name: '' },
        { label: '待提交', name: '0' },
        { label: '审批中', name: '1' },
        { label: '审批通过', name: '2' },
        { label: '审批驳回', name: '3' },
        { label: '审批撤回', name: '4' },
        // { label: '业主取消', name: '5' },
      ],
      // filterList: [],
      searchForm: {
        contractStatus: '',
        endDate: '',
        approveStatus: '',
        applicantId: '',
        quesRecordFlag: '',
        fiId: '',
        typeState: ''
      }
    }
  },
  async created() {
    console.log(92,this.zyList)
    this.ziyuanList = this.zyList

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

      if (name == 'heTongState') {
        this.searchForm.contractStatus = item.name || '',
        this.searchForm.endDate = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd')
      }else if (name == 'carHeTongState') {
        this.searchForm.contractStatus = item.name || ''
      } else if (name == 'approvalState') {
        this.searchForm.approveStatus = item.name || ''
      } else if (name == 'filter') {
        this.searchForm.fiId = item.name || ''
      } else if(name == 'ziyuan') {
        this.searchForm.resourceMenuIds = item.name || ''
      } else if(name == 'typeState') {
        this.searchForm.typeState = item.name || ''
      }

      this.$emit('confirm', this.searchForm,name,item)
    },
    // 请求子节点列表
    loadList(item, next) {
      setTimeout(() => {
        next([
          // { label: '管理员', name: 'admin' },
          // { label: '用户', name: 'user' }
        ])
      }, 2000)
    }
  }
}
</script>

<style>

</style>
