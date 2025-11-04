<!--  -->
<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <template v-if="true">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <view class="header-panel">
        <dropdown-btn :autoInit="!queryCondition.triggerUserId" ref="btnEl" maskTop="90rpx" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectEvent" @showMask="" />
        <u-search
          placeholder="编号/关键词/概要/触发人"  shape="square"
          v-model="queryCondition.codeKeywordsSummaryTrigger"
          :showAction="false" searchIcon=" " height="56rpx" @search="initData" @clear="initData" 
        />
      </view>
      <filter-selection ref="navigatorEl" :groupOptions="groupData" @onFilterData="filterConfirm" />
    </u-sticky>
  </template>

  <template v-else>
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <u-tabs :list="tabList" :scrollable="false" :current="searchForm.selTab.index" itemStyle="height: 88rpx; padding: 0 10rpx;border-bottom:1px solid #F3F4F7;" :activeStyle="{
          color: '#2761FF', transform: 'scale(0.95)', width: '100%', textAlign: 'center'}" :inactiveStyle="{ color: '#666666', transform: 'scale(0.95)', width: '100%', textAlign: 'center'}" @change="($event) => getData(1, $event.index)" />
      <!-- <view class="searchBox">
        <view class="area" @click="selectScreening">
          <text style="margin-right:10rpx;">{{ projectName }}</text>
          <u-icon name="arrow-down-fill" color="#80848F" size="14"></u-icon>
        </view>
        <view class="area" @click="selectScreening('group')">
          <text style="margin-right:10rpx;">{{ groupsName }}</text>
          <u-icon name="arrow-down-fill" color="#80848F" size="14"></u-icon>
        </view>
      </view> -->
      <!--  :filterForm="filterListForm" :filterList="filterList" -->
      <dropdown-filter ref="navigatorEl" @confirm="dropdownEvent" :groupList="groupData"/>
    </u-sticky>
    <screening ref="screening" :defaultArea="false" top="80px" @selectProject="selectProject" @selectData="selectData">
    </screening>
  </template>  
    <view v-if="false"  v-for="(item, index) in dataList" :key="index" class="content" @click="skip(item)">
      <view class="item-title">
        <view class="item-caption">{{ item.warningCode }}</view>
        <view
          :class="['item-status', { wait: item.warningStatus == '0', doing: item.warningStatus == '1', close: item.warningStatus == '2' }]">
          {{ item.warningStatus == '0' ? '待确认' : item.warningStatus == 1 ? '处理中' : item.warningStatus == 2 ? '已完结' : '' }}
        </view>
      </view>
      <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>
      <view class="item-content"><text v-for="(childItem, index) in textRed(item)" :key="index"
          :class="{ 'textRed': childItem == item.sensitiveWords }">{{ childItem ? childItem : item.sensitiveWords
          }}</text>
      </view>
      <view class="item-tag">
        <view class="tags">{{ item.levelName }}</view>
      </view>
      <u-gap height="0.5" bg-color="#F3F4F7"></u-gap>

      <view class="item-addr">
        <text v-if="item.areaName && item.areaName != ''">{{ item.areaName }}-</text>
        <text v-if="item.projectName && item.projectName != '' && item.projectName != '-'" decode>{{ item.projectName
        }}|{{ '&nbsp;' }}</text> {{ item.createDate }}
      </view>
    </view>

    <!-- 新样式 -->
    <view class="item-style" v-for="(item, index) in dataList" :key="index" @click="skip(item)">
      <view class="item-style__top">
        <text :class="['level-label', `${styleColor(item, 'l')}`]">{{ item.levelName }}</text>
        <!-- <text class="descr">{{ item.warningContent }}</text> -->
        <view class="descr">
          <text v-for="(childItem, index) in textRed(item)" :key="index"
          :class="{ 'textRed': childItem == item.sensitiveWords }">{{ childItem ? childItem : item.sensitiveWords
          }}</text>
        </view>
       
        <text :class="[`${styleColor(item, 's')}`]">{{ statusText(item) }}</text>
      </view>
      <view class="item-style__bottom">
        <text class="date">{{ item.createDate }}</text>
      </view>
    </view>


    <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import { getEarlyWarningPage, getContactGroupList, getWarningRecordPageInMini} from '@/service/wechatguanjia';
import utils from '@/js/utils';
import Screening from '@/components/screening-criteria/screening.vue';
import DropdownFilter from './dropdown-filter.vue'
import FilterSelection from './filter-selection.vue'
import DropdownBtn from '@/components/dropdown-area/dropdown-btn.vue'

export default {
  mixins: [menuAuthMixin],
  components: {
    Screening,
    DropdownFilter,
    FilterSelection,
    DropdownBtn
  },
  authName: '舆情预警',
  data() {
    return {
      projectName: '公司项目',
      groupsName: '群组',
      tabList: [
        { name: '待确认', id: '0' },
        { name: '处理中', id: '1' },
        { name: '已完结', id: '2' },
      ],
      searchForm: {
        selTab: { index: 0 },
        areaId: '',
        projectId: '',
        taskTypeId: '',
        groupId: ''
      },
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        loadMore: 'nomore' // loading, nomore
      },
      dataList: [],
      groupData: [],
      searchStatus: '',
      queryCondition: {
        codeKeywordsSummaryTrigger: '',
        areaId: '',
        projectId: '',
        groupId: '',
        // levelId: '',
        level: null,
        createStartDate: '',
        createEndDate: '',
        operator: '',
        status: '',
        triggerUserId: '' // 触发人id
      }
    };
  },
  onLoad(options) {
    const { triggerUserId } = options || {}
    if (triggerUserId) {
      uni.setNavigationBarTitle({
        title: '预警记录'
      });
      this.queryCondition.triggerUserId = triggerUserId
      this.initData();
    }
    this.getGroupList();
    
  },
  onShow() {
  },
  computed: {
    isLastPage() {
      return this.dataList.length >= this.pageForm.total
    },
  },
  onPullDownRefresh() {

    this.initData()
  },
  async onReachBottom() {
    this.getData(this.pageForm.current + 1)
  },
  methods: {
    textRed(item) {
      let list = []; 
      if (item.warningContent) {
        let warningContent = item.warningContent.replace(/\n/g,'');
        let key = item.sensitiveWords;
        let length = warningContent.length;
        let keyLength = key.length; 
        let arr = [];
        if (key == warningContent) {
          arr.push(warningContent);
        } else {
           let index = warningContent.indexOf(key);
          let endIndex = index + keyLength;
          // 取大概20个字  
          if (length > 20) { 
            if (index == 0) {
              arr = this.splitStr(warningContent, key)
            } else if (endIndex == length) {
              // 结尾  设一行最多显示15个字体
              let subString ='...'+ warningContent.slice(endIndex - 15, endIndex)
              arr = this.splitStr(subString, key)
             } else {
              let subString = '';
              if (endIndex + (20 - keyLength - 15) > warningContent.length) {
                subString ='...'+ warningContent.slice(warningContent.length - 15, warningContent.length)

              } else if ((index - 15) < 0) {
                var numCnt = warningContent.replace(/\D/g, '').length;
                if(numCnt > 16){
                  subString = warningContent.slice(0, 18)+'...'
                }else {
                  subString = warningContent.slice(0, 15)+'...'
                }
              } else {
                subString = '...'+ warningContent.slice(index - 9, endIndex + (20 - keyLength - 3))+'...';
              }

              arr = this.splitStr(subString, key)
             }
          } else {
             arr = this.splitStr(warningContent, key)
          }
        }
        list = arr;
       }

      return list;
    },
    splitStr(text, key) { 
      let arr = [];
      let keyLength = key.length;
      let index = text.indexOf(key);
      if (index == -1) {
        arr.push(text)
      } else if (index == 0) {
        arr.push(key);
        let str = text.slice(keyLength, text.length);
        let rA = this.splitStr(str, key);
        arr = arr.concat(rA).filter(item=> item);
      } else if ((index + keyLength) == text.length) {
        // 结尾
        let startVal
        // var reg = new RegExp("[A-Za-z]+")
        // if(index + 1 == text.length && reg.test(text)){
        startVal = text.slice(0, index);
        // }else {
        //  startVal = text.slice(0, index - 1);
        //  console.log(239,startVal)
        // }
        let endVal = text.slice(index, text.length);
        arr.push(startVal);
        arr.push(endVal);
      } else {
        // 中间部分
        let startVal = text.slice(0, index);
        let endVal = text.slice(index, text.length);
        arr.push(startVal);
        let rA = this.splitStr(endVal, key)

        arr = arr.concat(rA);
      }
      return arr;
    },
    // 获取数据
    async getData(pageIndex = 1, selTabIndex) {
      if (pageIndex != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = 'nomore'
        return
      }
      if (pageIndex == 1) {
        // 滚动到顶部
        this.dataList = []
        this.pageForm.total = 0
        uni.pageScrollTo({ scrollTop: 0 })
      }

      this.pageForm.loadMore = 'loading'
      this.pageForm.current = pageIndex
      if (typeof (selTabIndex) == 'number') {
        this.searchForm.selTab = Object.assign({}, this.tabList[selTabIndex], { index: selTabIndex })
      }
      var params1 = {
        data: {
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          status: this.searchForm.selTab.index,
          groupId: this.searchForm.groupId,
          pageSize: this.pageForm.size,
          pageNum: pageIndex
        }

      }
      const params = {
        data: this.queryCondition,
        pathParams: `/${pageIndex}/${this.pageForm.size}`,
        hideLoading: true
      }
      const res = await getWarningRecordPageInMini(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })

      let data = res?.data?.records ?? []
      this.dataList = pageIndex == 1 ? data : this.dataList.concat(data)
      this.pageForm.total = res.data.total || 0
    },
    initData() {
      this.getData(1)
    },
    selectProject(item) {
      this.searchForm.areaId = item.areaId;
      if (item.projectName == '全部') {
        this.projectName = item.areaName;
        this.searchForm.projectId = '';
        this.getGroupList();
        this.getData(1, this.searchForm.selTab.index)
        return;
      }
      this.searchForm.projectId = item.projectId;
      this.projectName = item.projectName;
      if (this.searchForm.areaId == '' && this.searchForm.projectId == '') {
        this.projectName = '公司项目'
      }
      this.getGroupList();
      this.getData(1, this.searchForm.selTab.index)

    },
    closeArea() {
      this.$refs.screening.close();
    },
    selectScreening(type) {
      let dataList = {
        keyName: '',
        keyValue: '',
        data: []
      };
      if (type == 'group') {
        this.searchStatus = 'group'
        dataList = {
          keyName: 'id',
          keyValue: 'groupName',
          selectData: this.searchForm.groupId,
          data: this.groupData
        }
      }

      if (dataList.data.length > 0) {
        this.$refs.screening.open(type, dataList);
      } else {
        this.$refs.screening.open(type);

      }
    },
    async changeDateFormat(val) {
      console.log('传递的时间', val, utils.formatDate({ value: val, format: 'YYYY-MM-DD HH:mm:ss' }));
      return await utils.formatDate({ value: val, format: 'YYYY-MM-DD HH:mm:ss' })
    },
    selectData(info) {
      if (this.searchStatus == 'group') {
        if (this.searchForm.groupId == info.id) {
          this.searchForm.groupId = '';
        } else {
          this.searchForm.groupId = info.id;
        }
      }
      this.$refs.screening.close();
      this.getData(1, this.searchForm.selTab.index)
    },
    getGroupList() {      
      let { O_USER_INFO } = this.$constant;
      let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
      let companyId = userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID;
      let params = {
        data: {
          pageIndex: 1,
          pageSize: 10,
          areaId: this.searchForm.areaId,
          projectId: this.searchForm.projectId,
          groupName: '',
          groupOwner: '',
          companyId: companyId,
          pageIndex: 1,
          pageSize: 10000,
          groupType: 0,
        },
        hideLoading: true,
        responseToast: false,
      }
      this.searchForm.groupId = '';
      getContactGroupList(params).then(res => {
        if (res.status == 200) {
          const list = res.data.records
          list.forEach(item => {
            const { groupName, id } = item
              item.label = groupName
              item.name = id
          });
          this.groupData = list
        }
      })
    },
    skip(item) {
      uni.navigateTo({ url: `/pages-workorder/opinion/detail?recordId=${item.id}` })
    },
    dropdownEvent(data) {
      console.log('返回数据====',data)
      this.searchForm.areaId = data.areaId
      this.searchForm.projectId = data.projectId
      this.searchForm.groupId = data.groupId || ''
      if (data.typeName == 'area') {
        this.getGroupList() 
      }
      this.initData()
    },
    areaProjectEvent(evt) {
      const { areaId, projectId } = evt
      const { triggerUserId } = this.queryCondition
      this.queryCondition.areaId = areaId
      this.queryCondition.projectId = projectId
      this.initData();
    },
    filterConfirm(evt) {
      const { statusId, followerId, levelId, groupChatId, startTime, endTime} = evt
      const { O_USER_INFO } = this.$constant;
      const { userId } = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }); 
      const d = {
        status: statusId,
        groupId: groupChatId,
        // levelId: levelId || '',
        level:  levelId == '' ? null : (levelId || null),
        createStartDate: `${startTime ? `${startTime} 00:00:00` : ''}`,
        createEndDate: `${endTime ? `${endTime} 23:59:59` : ''}`,
        operator: followerId ? userId : '',
      }
      Object.assign(this.queryCondition, d)
      this.initData()
    },
    statusText(params) {
      const { warningStatus: code } = params
      return code === 0 ? '待确认' : code === 1 ? '处理中' : code === 2 ? '已完成' : '未知'
    },
    styleColor(params, n) {
      const { level, warningStatus } = params
      const l = `${n}-${level >=4 ? 4 : level}`
      const s = `${n}-${warningStatus}`
      return `${n == 'l' ? l : s}` 
    }
  },
};
</script>
<style scoped lang="scss">
.page-panel {
  padding-bottom: 10px;
  background-color: #f3f5f9;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: "PingFang SC";
}

::v-deep .u-sticky {
  border-bottom: 1px solid #EAEAEA;
}

::v-deep .u-tabs__wrapper__nav__line {
  bottom: 16rpx !important;
}

.content {
  margin: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;

  .item-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx 30rpx;

    .item-caption {
      font-size: 28rpx;
      font-family: PingFang SC;
      color: #666666;
    }

    .item-status {
      font-size: 28rpx;

      &.wait {
        color: #FAAD13;
      }

      &.doing {
        color: #2761FF;
      }

      &.close {
        color: #33BA73;
      }
    }
  }

  .item-content {
    margin: 12rpx 30rpx;

    font-size: 30rpx;
    font-weight: bold;
    color: #222222;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;

    .textRed {
      color: red;
    }
  }

  .item-tag {
    padding: 12rpx 30rpx;

    display: flex;

    .tags {
      font-size: 22rpx;
      color: #2761ff;
      margin: 0 10rpx 0 0;
      padding: 10rpx;
      text-align: center;
      background: rgba(39, 97, 255, 0.1);
      border-radius: 4rpx;
    }
  }

  .item-addr {
    padding: 24rpx 30rpx;
    font-size: 26rpx;
    color: #999999;
  }
}

.searchBox {
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // padding: 0 40rpx;
  padding: 0 150rpx 0 122rpx;
  height: 44px;

  .area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    font-family: 'PingFang SC';
    color: #333333;

  }
}

.header-panel {
  @include flx-dsp(flex-start, flex-start);
  background-color: #fff;

  ::v-deep .dropdown-btn {
    flex: 0 0 auto;
    padding: 14rpx 0 14rpx 24rpx;
    box-sizing: border-box;

    .content-panel {
      left: -24rpx;
    }
  }
}
::v-deep .u-search {
  padding: 14rpx 24rpx 14rpx 16rpx;
  border-bottom: 1px solid #f8f8f8;
  background-color: #fff;
}
::v-deep .workorder-sheet {
  margin: 20rpx 20rpx 0;
}
.item-style{
  margin: 20rpx;
  background: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx 24rpx;
  box-sizing: border-box;
  &__top{
    @include flx-dsp($jsc: flex-start, $ali: center);
    text {
      display: inline-block;
      font-size: 28rpx;
    }
    .level-label{
      @include flx-dsp($jsc: center, $ali: center);
      width: 60rpx;
      height: 40rpx;
      color: #fff;
      font-size: 24rpx;
    }
    .descr{
      width: 460rpx;
      margin-left: 16rpx;
      margin-right: 30rpx;
      @include ellipsis(1);
      font-weight: bold;
     
    }
    .l-1{
      background-color: var(--app-primary-color);
    }
    .s-0{
      color: #FAAD13;
    }
    .l-2{
      background-color: #ebcb4f;
    }
    .s-1{
      color: #2761FF;
    }
    .l-3{
      background-color: #ff8115;
    }
    .s-2{
      color: #33BA73;
    }
    .l-4{
      background-color: #fc0b0b;
    }
  }
  &__bottom{
    margin-top: 30rpx;
    .date {
      color: #666;
      font-size: 28rpx;
    }
  }
}
.item-style__top {
  .textRed {
    color: red;
  }
 .descr text {
    display: contents !important;
  }
}
</style>