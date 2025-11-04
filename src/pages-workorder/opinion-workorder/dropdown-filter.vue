<template>
  <dropdown-menu
    navHeight="88rpx" :navIndex="10" contentHeight="auto" maskTop="270rpx"
    :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent"
  >
    <template v-slot="{ item }">
      <dropdown-project :show="item.name == 'area'" @confirm="confirmEvent('area', $event)" />
      <dropdown-radio :show="item.name == 'group'" :value="searchForm.groupId" :data="groupList" @confirm="confirmEvent('group', $event)" />
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue'
import DropdownProject from '@/components/dropdown-area/dropdown-project.vue'
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue'

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownProject,
    DropdownRadio
  },
  data() {
    return {
      filterForm: [
        { label: '全部', name: 'area', icon: 'down-icon' },
        { label: '群聊', name: 'group', icon: 'down-icon' }
      ],
      groupList: [],
      searchForm: {
        areaId: '',
        projectId: '',
        groupId: '',
      }
    }
  },
  async created() {
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

      if (name == 'area') {
        let projectId = item.project.projectId + ''
        this.filterForm[0].label = projectId.includes('-all') ? item.area.areaName : item.project.projectName
        this.searchForm.areaId = item.area.areaId + ''
        this.searchForm.projectId = projectId.includes('-all') ? '' : projectId
      } else if (name == 'group') {
        // this.searchForm.taskId = item.name
      }

      this.$emit('confirm', this.searchForm)
    }
  }
}
</script>

<style>

</style>