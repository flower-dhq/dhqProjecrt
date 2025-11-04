<template>
  <view>
    <view :class="['dropdown-menu', getCustomClass]" :style="[THEME_CSS_VAR, getCustomStyle]" catchtouchmove="moveHandle" >
    <view :class="['overlay-wrap', { show: maskShow, hide: !maskAnimate }]" :style="{ top: maskTop }" catchtouchmove @tap="showMenuEvents({ isShow: false})"></view>
    <view class="dropdown-box" :style="[{ zIndex: navIndex }]">
      <view class="navigator-panel" :style="[getNavigatorStyle]">
        <view class="navigator-text-panel" :style="[getNavItemStyle]" v-for="(item, index) in filterForm" :key="index" @tap="showMenuEvents({ itemData: item })">
          <text>{{ item.label }}</text>
					<image v-if="item.label == '筛选'" :src="require(`@/static/${THEME_NAME}/common/screen-icon.png`)" style="width:24rpx;height:24rpx;" />
					<image v-else :src="require(`@/static/${THEME_NAME}/common/down-icon.png`)" style="width:24rpx;height:24rpx;" />
        </view>
      </view>
      <view :class="['content-panel', { show: maskShow, hide: !maskAnimate }]" :style="[{ top: navHeight, zIndex: navIndex - 1, minHeight: contentMinHeight, height: contentHeight, overflow: 'hidden' }]">
        <slot >
        <!-- 状态 -->
        <dropdown-radio :show="selItem.name == 'status'" :value="searchForm.statusId" :data="statusList" @confirm="confirmEvent('status', $event)" />
        <!-- 跟进人 -->
        <dropdown-radio :show="selItem.name == 'follower'" :value="searchForm.followerId" :data="followerList" required @confirm="confirmEvent('follower', $event)" />
        <!-- 级别 -->
        <dropdown-radio :show="selItem.name == 'level'" :value="searchForm.levelId" :data="levelList" required @confirm="confirmEvent('level', $event)" />
        <!-- 筛选 -->
        <view class="multi-screening" v-show="item.name == 'filter'" :style="[ filterShow? {display:'block'} : { display: 'none' }]">
          <view class="tree-panel">
            <!-- 左侧菜单栏 -->
            <view class="tree-menu">
              <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%">
                <text :class="['tree-menu--item', { selected: screening.tempVal == item.value }]" v-for="(item, index) in screening.list" :key="index" @click="menuClickEvt(item)">{{ item.label }} </text>
              </scroll-view>
            </view>

            <!-- 右侧列表 -->
            <view class="tree-list">
              <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%">
                <view class="date-panel" v-if="screening.tempVal == 'rangeTime'">
                  <view :class="['date-range-panel', { read: !!searchForm.rangeTimeModel }]" @click="openDatePicker('startTime')">{{ searchForm.startTime || '开始时间' }}</view>
                  <text class="range-character">-</text>
                  <view :class="['date-range-panel', { read: !!searchForm.rangeTimeModel }]" @click="openDatePicker('endTime')">{{ searchForm.endTime || '结束时间' }}</view>
                </view>
                <template v-else v-for="(item, index) in screeningOption">
                  <view :class="['tree-list--item', { selected: index ===  optionIndex }]" @click="optionClickEvt(item, index)">
                    <text>{{ item.label }}</text>
                    <u-icon name="checkmark" v-if="index ===  optionIndex " :color="THEME_COLOR"></u-icon>
                  </view>
                </template>
              </scroll-view>
            </view>
          </view>
          <view class="tree-btn">
            <u-button text="重置" :customStyle="{ flex: '0 0 240rpx', height: '88rpx', borderRadius: '0rpx' }" @click="resetEvent" />
            <u-button text="确认" type="primary" :customStyle="{ flex: '1 1 auto', height: '88rpx', borderRadius: '0rpx' }" @click="filterConfirm" />
          </view>
        </view>
        </slot>
      </view>
    </view>
    </view>
    <!-- 预约上门时间 -->
    <u-datetime-picker :show="dateRangeForm.show" v-model="dateRangeForm.value" mode="date" @close="dateRangeForm.show = false" @cancel="dateRangeForm.show = false" @confirm="dateConfirm" />
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
// import DropdownMenu from '@/components/dropdown-area/dropdown-menu.vue';
import DropdownRadio from '@/components/dropdown-area/dropdown-radio.vue';
import DropdownStaff from '@/components/dropdown-area/dropdown-staff.vue';

export default {
  name: 'DropdownFilter',
  mixins: [mpMixin],
  components: {
    // DropdownMenu,
    DropdownRadio,
    DropdownStaff,
  },
  data() {
    return {
      filterForm: [
        { label: '状态', name: 'status', icon: 'down-icon' },
        { label: '跟进人', name: 'follower', icon: 'down-icon' },
        { label: '级别', name: 'level', icon: 'down-icon' },
        { label: '筛选', name: 'filter', icon: 'screen-icon' },
      ],
      // 跟进人列表
      followerList: [
        { label: '全部', name: '' },
        { label: '自己', name: '1' },
      ],
      // 级别
      levelList: [{ label: '全部', name: '' },
      { label: '一级', name: 1 },{ label: '二级', name: 2 },
      { label: '三级', name: 3 },{ label: '四级', name: 4 },
      { label: '五级', name: 5 },{ label: '六级', name: 6 },
      { label: '七级', name: 7 },{ label: '八级', name: 8 },{ label: '九级', name: 9 },{ label: '十级', name: 10 },
              ],
      filterList: [],
      // 状态列表
      statusList: [
        { label: '全部', name: '' },
        { label: '待确认', name: '0' },
        { label: '处理中', name: '1' },
        { label: '已完成', name: '2' },
      ],
      searchForm: {
        followerId: '', // 跟进人
        statusId: '', // 状态
        groupChatId: '', // 群聊
        startTime: '', // 开始时间段
        endTime: '', // 结束时间段
      },
      dateRangeForm: {
        show: false,
        value: new Date(uni.$u.timeFormat(Date.now(), 'yyyy-mm-dd')).getTime(), // 日期
      },
      contentHeight: 'auto', // 下拉菜单的固定高度
      screening: {
        value: 'groupChat',
        tempVal: '',
        list: [
          {
            label: '群聊',
            value: 'groupChat',
            model: '',
            tempMdl: '',
            options: []
          },
          {
            label: '生成时间段',
            value: 'rangeTime',
            startTime: '',
            endTime: '',
          },
        ],
      },
      maskShow: false,
      maskAnimate: false,
      selItem: {}, // 被选中的菜单
      loading: false, // 动画在执行中
      navHeight:'88rpx',
      navIndex:10,
      maskTop:'180rpx',
      filterShow :false
    };
  },
  props: {
    // 群聊选项
    groupOptions: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    groupOptions(n) {
      if (n.length) this.setScreeningOption('groupChat', n)
    }
  },
  computed: {
    // 筛选列表
    screeningOption() {
      const { tempVal, list } = this.screening
      const { options } = list.find(item => item.value == tempVal) || {}
      return Array.isArray(options) ? options : []
    },
    optionIndex() {
      const { tempVal, list } = this.screening
      const { tempMdl } = list.find(item => item.value == tempVal) || {}
      return tempMdl
    },
    getNavigatorStyle() {
      return {
        height: this.navHeight,
        zIndex: this.navIndex
      }
    },
    getNavItemStyle() {
      return {
        flexBasis: (100 / this.filterForm.length) + '%'
      }
    }
  },
  async created() {
    // this.getWarningLevel();
  },
  methods: {
    async showMenuEvents({ isShow, itemData = {} }) {
      console.log(238)
      if (typeof(isShow) == 'boolean') {
        isShow = isShow
      } else if (itemData.name && itemData.name != this.selItem.name) {
        // 切换菜单操作
        isShow = true
      } else {
        isShow = !this.maskShow
      }

      this.showMaskEvents(isShow, itemData)
    },
    // 显示/隐藏遮罩层
    showMaskEvents(isShow, itemData) {
      if (this.loading) return
      this.loading = true

      if (isShow) {
        this.maskAnimate = true
        this.selItem = itemData
        setTimeout(() => {
          this.loading = false
          this.maskShow = true
          this.showMenuEvent(this.selItem)
          // this.$emit('showMask', this.selItem)
        }, 150)
      } else {
        this.maskShow = false
        setTimeout(() => {
          this.loading = false
          this.maskAnimate = false
          this.filterShow =false
          this.selItem = {}
          // this.emitData()
          // this.$emit('hideMask')
        }, 200)
      }
    },
    // 显示菜单栏
    showMenuEvent(item) {
      const { name } = item
      if (name == 'filter') this.initScreening()
      this.contentHeight = 'auto';
    },
    confirmEvent(name, item) {
      if (name == 'status') {
        this.searchForm.statusId = item.name || '';
        this.filterForm[0].label = item.label || '状态';
      } else if (name == 'follower') {
        this.searchForm.followerId = item.name || '';
        this.filterForm[1].label = item.label || '跟进人';
      } else if (name == 'level') {
        this.searchForm.levelId = item.name || '';
        this.filterForm[2].label = item.label || '级别';
      }
      this.emitData()
    },
    openDatePicker(type) {
      this.dateRangeForm.type = type;
      this.dateRangeForm.show = true;
    },
    dateConfirm(date) {
      const { type } = this.dateRangeForm
      const { startTime, endTime } = this.searchForm
      const val = (this.dateRangeForm.value = uni.$u.timeFormat(date.value, 'yyyy-mm-dd'));
      const value = new Date(val).getTime()
      const stn = new Date(startTime).getTime()
      const enn = new Date(endTime).getTime()
      if (type == 'startTime' && value >= enn) {
        uni.showToast({
          title: '开始日期不能大于等于结束日期',
          duration: 2000,
          icon: 'none',
        });
        return 
      }
      if (type == 'endTime' && value <= stn) {
        uni.showToast({
          title: '结束日期不能小于等于开始日期',
          duration: 2000,
          icon: 'none',
        });
        return 
      }
      this.searchForm[type] = val;
      this.dateRangeForm.show = false;
    },
    // getWarningLevel() {
    //   earlyWarningList({ hideLoading: true }).then((res) => {
    //     if (res.success) {
    //       const list = res.data;
    //       const tempList = [{ label: '全部', name: '' }];
    //       list.forEach((item) => {
    //         const { name, id } = item;
    //         tempList.push({
    //           label: name,
    //           name: id,
    //         });
    //       });
    //       this.levelList = tempList;
    //     }
    //   });

    // },
    menuClickEvt(data) {
      const { value } = data;
      this.screening.tempVal = value;
    },
    optionClickEvt(data, index) {
      const { } = data
      const { tempVal: key } = this.screening
      this.screening.list.some(item => {
        const { value } = item
        if (value == 'groupChat' && value == key) {
          item.tempMdl = index
          return true
        } else {
          return false
        }
      })
    },
    setScreeningOption(key, options) {
      this.screening.list.some(item => {
        const { value } = item
        if (value == key) {
          item.options = options
          return true
        } else {
          return false
        }
      })
    },
    initScreening() {
      const { value } = this.screening
      this.screening.tempVal = value
      this.screening.list.forEach(item => {
        if (item.value == 'rangeTime') {
          this.searchForm.startTime = item.startTime
          this.searchForm.endTime = item.endTime
        }
        item.tempMdl = item.model
      })
      this.filterShow = true
    },
    filterConfirm() {
      const { tempVal } = this.screening
      this.screening.value = tempVal
      this.screening.list.forEach(item => {
        item.model = item.tempMdl
        if (item.value == 'rangeTime') {
          item.startTime = this.searchForm.startTime
          item.endTime = this.searchForm.endTime
        }
      })
      this.emitData()
    },
    resetEvent() {
      this.screening.value = 'groupChat'
      this.screening.tempVal = ''
      this.screening.list.forEach(item => {
        const { value } = item
        item.tempMdl = ''
        item.model = ''
        if (value == 'rangeTime') {
          item.startTime = ''
          item.endTime = ''
          this.searchForm.startTime = ''
          this.searchForm.endTime = ''
        }
      })
      this.emitData()
    },
    emitData() {
      const data = JSON.parse(JSON.stringify(this.searchForm))
      const { list } = this.screening
      list.forEach(item => {
        const { tempMdl, options } = item
        if (item.value == 'groupChat') {
          data.groupChatId = options[tempMdl]?.id || ''
        }
      })
      this.$emit('onFilterData', data)
      this.showMaskEvents(false)
      // this.$refs.dropdownEl.showMaskEvent(false)
    }
  },
};
</script>

<style lang="scss" scoped>
.date-panel {
  display: flex;
  padding: 30rpx;
}
.date-range-panel {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
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

.multi-screening {
  .tree-panel {
    @include flx-dsp(flex-start, flex-start);
    width: 100%;
    height: 408rpx;
  }

  .tree-menu {
    // flex: 0 0 180rpx;
    height: 100%;
    background-color: #f7f7f7;
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
    // display: none;

    &.show {
      display: block;
    }
  }

  .tree-list--item {
    width: 100%;
    @include flx-dsp(space-between, center);
    font-size: 30rpx;
    padding: 30rpx;
    border-bottom: 1px solid #eaeaea;
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

  .range-character{
    display: inline-block;
    margin: 0 10rpx;
  }
}
.overlay-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.15s linear;
  z-index: 10;

  &.show {
    background-color: rgba(0, 0, 0, 0.5);
  }
  &.hide {
    display: none;
  }
}
.dropdown-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 11;
  width: 100%;
}
.navigator-panel {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #EAEAEA;
}
.navigator-text-panel {
  flex: 1 1 auto;
  height: 100%;
  text-align: center;
  font-size: 26rpx;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content-panel {
  width: 100%;
  background-color: #fff;
  transition: transform 0.15s linear;
  transform-origin: 0 0;
  transform: scaleY(0);
  position: absolute;
  left: 0;

  &.show {
    transform: scaleY(1);
  }
  &.hide {
    display: none;
  }
}
</style>
