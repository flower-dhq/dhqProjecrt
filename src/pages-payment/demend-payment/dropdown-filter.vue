<template>
  <dropdown-menu
    navHeight="88rpx"
    :navIndex="10"
    contentHeight="auto"
    maskTop="180rpx"
    :dataForm="filterForm"
    ref="dropdownEl"
    @showMask="showMenuEvent"
    @hideMask="hideMenuEvent"
  >
    <template v-slot="{ item }">
      <dropdown-date ref="dropdownDate" :show="item.name == 'date'" @confirm="confirmEvent('billEndDate', $event)"></dropdown-date>
      <!-- 催缴状态 -->
      <dropdown-radio
        :show="item.name == 'reminderState'"
        :required="true"
        :value="searchForm.reminderState"
        :data="reminderStateList"
        @confirm="confirmEvent('reminderState', $event)"
      />
    </template>
  </dropdown-menu>
</template>

<script>
import DropdownMenu from "@/components/dropdown-area/dropdown-menu.vue";
import DropdownRadio from "@/components/dropdown-area/dropdown-radio.vue";
import DropdownDate from "@/components/dropdown-area/dropdown-date.vue";

export default {
  name: "DropdownFilter",
  components: {
    DropdownMenu,
    DropdownRadio,
    DropdownDate
  },
  data() {
    return {
      modalType: false,
      filterForm: [
        { label: uni.$u.timeFormat(Date.now(), 'yyyy-mm'), name: "date", icon: "down-icon" },
        { label: "催缴状态", name: "reminderState", icon: "down-icon" }
      ],
      reminderStateList: [
        { label: "全部", name: "" },
        { label: "待催缴", name: "0" },
        { label: "已催缴", name: "1" },
        { label: "欠费缴清", name: "2" }
      ],
      searchForm: {
        billEndDate: uni.$u.timeFormat(Date.now(), 'yyyy-mm'),
        reminderState: ""
      }
    };
  },
  methods: {
    iniDate(date){
      this.$refs.dropdownDate.iniDate(date);
    },
    // 显示菜单栏
    showMenuEvent(item) {},
    // 隐藏菜单栏
    hideMenuEvent() {

      console.log(333,this.modalType);
      if (this.modalType) {
        this.$emit("confirm", this.searchForm);
        this.modalType = false;
      }
    },
    confirmEvent(name, item) {
      if (name == "billEndDate") {
        this.modalType = false;
        this.filterForm[0].label = item.name;
        this.searchForm.billEndDate = item.name;
        this.$refs.dropdownEl.showMaskEvent(false);
        this.$emit("confirm", this.searchForm);
      } else if (name == "reminderState") {
        this.modalType = false;
        this.searchForm.reminderState = item.name;
        this.filterForm[1].label = item.label || '催缴状态';
        this.$refs.dropdownEl.showMaskEvent(false);
        this.$emit("confirm", this.searchForm);
      }
      console.log(333, this.searchForm);
    },
  }
};
</script>

<style>
</style>
