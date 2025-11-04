<template>
  <dropdown-menu navHeight="88rpx" :navIndex="10" contentMinHeight="100rpx" contentHeight="auto" maskTop="180rpx" :dataForm="filterForm" ref="dropdownEl" @showMask="showMenuEvent" @hideMask="hideMenuEvent">
    <template v-slot="{ item }">
      <!-- 状态 -->
      <dropdown-radio :show="item.name == 'status'" :required="true" :value="searchForm.status" :data="statusList" @confirm="confirmEvent('status', $event)" />
      <!-- 问卷类型 -->
      <dropdown-radio :show="item.name == 'type'" :required="true" :value="searchForm.type" :data="typeList" @confirm="confirmEvent('type', $event)" />
    </template>
  </dropdown-menu>
</template>

<script>
import { getDictDetail } from '@/service/landcrm'
import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue';
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue';
import DropdownDate from '@/components/dropdown-area/dropdown-date.vue';

export default {
  name: 'DropdownFilter',
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownDate,
  },
  data() {
    return {
      filterForm: [
        { label: '状态', name: 'status' },
        { label: '问卷类型', name: 'type' },
      ],
      statusList: [
        { label: '全部', name: '' },
        { label: '未开始', name: '1' },
        { label: '进行中', name: '2' },
        { label: '已结束', name: '3' },
      ],
      typeList: [
        { label: '全部', name: '' },
      ],
      searchForm: {
        status: '',
        type: '',
      },
    };
  },
  methods: {
    // 显示菜单栏
    showMenuEvent() {
      this.$emit("showFilter");
    },
    // 隐藏菜单栏
    hideMenuEvent() {

    },
    // 点击选择
    confirmEvent(key, data) {
      const { name } = data
      this.searchForm[key] = name;  
      if(key == 'status'){
        this.filterForm[0].label = data.label || '状态'

      }else if(key == 'type'){
        this.filterForm[1].label = data.label || '问卷类型'
      }
      this.$emit("confirm", this.searchForm);
      this.$refs.dropdownEl.showMaskEvent(false);
    },
     // 获取类型
     getDictDetail() {
      const params = {
        data: {
          dictCode: 'questionnaireType'
        },
        hideLoading: true
      }
      getDictDetail(params).then(res => {
        if (res.success) {
          const data = res.data || []
          const list = data
            .filter(item => item.detailName == '普通问卷')
            .map(item => ({
              label: item.detailDesc,
              name: item.detailId
            }))
          this.typeList = [{ label: '全部', name: '' }].concat(list)
        }
      })
    },
  },
  mounted() {
    this.getDictDetail()
  }
};
</script>

<style></style>
