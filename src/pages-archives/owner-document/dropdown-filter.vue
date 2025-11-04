<template>
  <dropdown-menu
    navHeight="88rpx" :navIndex="10" contentMinHeight="100rpx" contentHeight="auto"
    maskTop="270rpx" :dataForm="filterForm" :required="false"
    ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
  >
    <template v-slot="{ item }">
      <dropdown-radio :show="item.name == 'houseState'" :value="searchForm.houseState" :data="userList" required @confirm="confirmEvent('houseState', $event)" />
      <dropdown-radio :show="item.name == 'authType'" :value="searchForm.authType" :data="statusList" required @confirm="confirmEvent('authType', $event)" />
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
  },
  props: {
    pageType: {
      type: String,
      default: 'room',
      validator(val) {
        return ['room', 'group'].includes(val)
      }
    }
  },
  data() {
    return {
      filterForm: [
        { label: '用户身份', name: 'houseState', icon: 'down-icon' },
        { label: '认证状态', name: 'authType', icon: 'down-icon' }
      ],
      userList: [],
      statusList: [
        { label: '全部', name: '' },
        { label: '待认证', name: '2' },
        { label: '已认证', name: '1' },
        { label: '已驳回', name: '3' },
        { label: '已取消', name: '4' }
      ],
      searchForm: {
        houseState: '',
        authType: '',
      }
    }
  },
  mounted() {
    this.userList = this.pageType == 'room' ?
      [
        { label: '全部', name: '' },
        { label: '租户', name: '1' },
        { label: '业主', name: '2' },
        { label: '家属', name: '3' },
        { label: '家政', name: '5' },
        { label: '企业联系人', name: '4' },
        { label: '企业员工', name: '6' }
      ] :
      [
        // { label: '外部联系人', name: '1' },
        { label: '会员', name: '2' },
        { label: '认证业主', name: '3' },
      ]
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

      if (name == 'houseState') { 
        this.searchForm.houseState = item.name || '';
        this.filterForm[0].label = item.label || '用户身份';
      } else if (name == 'authType') {
        this.searchForm.authType = item.name || '';
        this.filterForm[1].label = item.label || '认证状态';
      }

      this.$emit('confirm', this.searchForm)
    },
  }
}
</script>

<style>

</style>