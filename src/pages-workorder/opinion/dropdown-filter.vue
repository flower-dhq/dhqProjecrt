<template>
  <dropdown-menu
    navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="270rpx"
    :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
  >
    <template v-slot="{ item }">
      <dropdown-reset-project :show="item.name == 'area'" @confirm="confirmEvent('area', $event)" ref="dropdownProject"/>
      <dropdown-radio :show="item.name == 'group'" :value="searchForm.groupId" :data="groupList" maxHeight="600rpx" @confirm="confirmEvent('group', $event)"/>
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'
import DropdownResetProject from './dropdown-reset-project.vue'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownResetProject
  },
  props: {
    groupList: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      filterForm: [
        { label: '区域项目', name: 'area', icon: 'down-icon' },
        { label: '群聊', name: 'group', icon: 'down-icon' }
      ],
      searchForm: {
        areaId: '',
        projectId: '',
        groupId: '',
        typeName: ''
      },
      numFlag: 0
    }
  },
  async created() {
  },
  methods: {
    // 显示菜单栏
    showMenuEvent(item) {
      if (this.numFlag == '0') {
        this.$refs.dropdownProject.getAreaList() 
        this.numFlag++
      }
    },
    // 隐藏菜单栏
    hideMenuEvent() {
    },
    confirmEvent(name, item) {
      this.$refs.dropdownEl.showMaskEvent(false)
      this.searchForm.typeName = name
      if (name == 'area') {
        let projectId = item.project.projectId ? item.project.projectId + '' : ''
        // 舆情 重置后需要 全部 及列表不查询数据   
        this.filterForm[0].label = projectId.includes('-all') ? item.area.areaName : item.project.projectName ? item.project.projectName : '区域项目'
        if (this.filterForm[0].label == '区域项目') this.numFlag = 0
        this.searchForm.areaId = item.area.areaId?item.area.areaId + '':''
        this.searchForm.projectId = projectId.includes('-all') ? '' : projectId
      } else if (name == 'group') {
        this.searchForm.groupId = item.id
      }
      this.$emit('confirm', this.searchForm)
    }
  }
}
</script>

<style>

</style>