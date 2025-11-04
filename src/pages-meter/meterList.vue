<template>
  <view class="page" :style="[THEME_CSS_VAR]">
    <!-- 表 选择地址   扫码   区块 -->
    <view class="page-title">
      <view class="address">
        <dropdown-btn ref="btnEl" maskTop="90rpx" :navIndex="11" contentTop="10rpx" contentHeight="270rpx;" @confirm="areaProjectEvent" @showMask="hideMenuEvent('btn')"/>
        <u--text v-if="searchForm.outside == '1'" :text="areaText" suffixIcon="arrow-down-fill" color="#333" size="26rpx" iconStyle="color: #ccc; font-size: 18rpx;" customStyle="height: 88rpx;" @click="areaChange" />
        <dropdown-text-btn v-else ref="btnAddreeEl" maskTop="90rpx" :navIndex="11" contentHeight="612rpx;" @confirm="areaProjectTextEvent" @showMask="hideMenuEvent('navigator')" />
      </view>
      <image class="address-ecode" :src="require(`@/static/${[THEME_NAME]}/common/icon-sao.png`)" @click="scanCode"/>
    </view>

    <!-- 楼栋弹窗 -->
    <dropdown-universal :show.sync="areaShow" maskTop="90rpx" contentTop="1rpx" contentHeight="510rpx" @hideMask="areaChange(false)">
      <dropdown-three-tree :show="dropReq" :selectData="defaultDrop" @confirm="dropdownEvent" />
    </dropdown-universal>

    <u-gap height="24rpx" bgColor="#f9f9f9" />
    <!-- color: '#2761FF', lineColor="#2761FF" -->
    <u-tabs :list="tabsList" :activeStyle="{ color: '#fff', lineHeight: '88rpx', width: '100%', backgroundColor: '#2761FF', textAlign: 'center'}" itemStyle="height: 88rpx; padding: 0; width: 50%;background-color: #fff;" :scrollable="false" @change="tabChange"></u-tabs>

    <!-- 筛选条件 -->
    <view>
      <view class="search-line">
        <u-search shape="round" placeholder="请输入表单号/客户名称/手机号/资产编码查询" :disabled="areaShow" v-model="searchForm.keyWord" @search="searchData" :showAction="showAction" :inputStyle="{'fontSize': '13px'}"></u-search>
        <view class="more-btn" @click="isMoreModel = !isMoreModel">
          <text>筛选</text>
          <image class="img-more" :src="require(`@/static/${[THEME_NAME]}/common/icon-more.png`)"/>
        </view>
      </view>
      <view class="popup-container" v-show="isMoreModel">
        <view class="popup-mask" @click="isMoreModel = false"></view>
        <view class="popup-content">
          <view class="popup-search">
            <view class="search-title">
              <text>抄表种类</text>
              <text class="more-select">（可多选）</text>
            </view>
            <view class="select_list">
              <view :class="['select-btn', item.checked?'select-btn-active':'']" v-for="(item,index) in selectList" :key="index" @click="checkboxClick(index)">{{item.name}}</view>
            </view>
            <view class="search-title" style="margin-top: 20rpx;">
              <text>是否开通</text>
            </view>
            <view class="radio_list">
              <view :class="['select-btn', item.checked?'select-btn-active':'']" v-for="(item,index) in selectRadiosList" :key="index" @click="radioClick(index)" style="margin-right: 24rpx;">{{item.name}}</view>
            </view>
            <view class="search-title" style="margin-top: 20rpx;">
              <text>最近抄表日期</text>
            </view>
            <view class="time_list">
              <view class="time-btn" @click="showStartTime = true">{{searchForm.startTime || '开始时间'}}</view>
              <view class="time-line">-</view>
              <view class="time-btn" @click="showEndTime = true">{{searchForm.endTime || '结束时间'}}</view>
            </view>
          </view>
          <view class="popup-footer">
            <view class="footer-btn" @click="resetFrom">重置</view>
            <view class="footer-btn primary" @click="searchData">确定</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 单位表-列表 -->
    <!-- xuni 虚拟   water 水表  ranqi 燃气  --- 样式 -->
    <view v-show="searchForm.outside == '1'" style="height: 100%;">
      <room-tree ref="roomTreeRef" :buildData="treeFrom" :searchForm="searchForm"  @goPage="onGoPage"/>
    </view>
    <!-- 虚拟表、公用表-列表  -->
    <view v-show="searchForm.outside == '12'||searchForm.outside == '13'">
      <view class="room-list">
        <view :class="['common-item', item.meterKind==2?'dian': '', item.meterKind==1?'water': '', item.meterKind==4?'xuni': '']" v-for="(item,index) in roomList" :key="index" @click="goMerterInfoPage(item, searchForm.projectId)">{{item.number}}</view>
      </view>
    </view>

    <!-- 开始时间 -->
    <u-datetime-picker :show="showStartTime" v-model="timeValue" mode="date" @confirm="startTimeConfirm"  @cancel="showStartTime = false"></u-datetime-picker>
    <!-- 结束时间 -->
    <u-datetime-picker :show="showEndTime" v-model="timeValue" mode="date" @confirm="endTimeConfirm"   @cancel="showEndTime = false"></u-datetime-picker>
  </view>
</template>

<script>
import menuAuthMixin from '@/js/mixin/menuAuthMixin'
import {
  getMeterList,
  getTree
} from "@/service/energy";
import utils from '@/js/utils'
import DropdownBtn from './dropdown-btn.vue'
import DropdownTextBtn from '@/components/dropdown-area/dropdown-text-btn.vue'
import RoomTree from '@/components/room-tree/room-tree.vue'
import DropdownUniversal from '@/components/dropdown-area/dropdown-universal.vue'
import dropdownThreeTree from '@/components/dropdown-area/dropdown-three-tree.vue'

export default {
  mixins: [menuAuthMixin],
  authName: '移动抄表',
  data() {
    let { O_USER_INFO } = this.$constant;
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' });
    return {
      userId: userInfo.userId,
      treeFrom: {
        areaId: '',
        projectId: '',
        name: ''
      }, 
      minDate: Number(new Date()),
      timeValue: Number(new Date()),
      showStartTime: false,
      showEndTime: false,
    
      areaShow: false, // 是否显示遮罩层
      areaText: '',
      dropReq: false, // 是否请求下拉菜单数据
      defaultDrop: [], // 下拉菜单被选中的数据。[areaId, projectId, parkId]

      showAction: false,
      isOutsideFlag: false,
      isMoreModel: false,  //撒选弹窗
      searchForm: {
        outside: '1',
        outsideName: '单位表',
        keyWord: '',  //搜索框
        areaId: '',
        projectId: '',
        customList: [],

        meterKind: '',  // 表号
        openFlag: '1',    //是否开通标识  0-未开通 1-已开通
        startTime: '',  //开始时间
        endTime: '',   //结束时间
        readFlag: 0, // 0-未抄，1-已抄
      },
      tabCurrent: 1,
      tabsList: [
        {
          name: '本月未抄',
          id: 1,
          value: 0,
        }, {
          name: '本月已抄',
          id: 2,
          value: 1,
        }
      ],
      roomList: [],
      selectList: [{
        name: '水表',
        value: '1',
        checked: false
      },{
        name: '电表',
        value: '2',
        checked: false
      },{
        name: '燃气表',
        value: '3',
        checked: false
      },{
        name: '冷量表',
        value: '9',
        checked: false
      },{
        name: '新风表',
        value: '8',
        checked: false
      },{
        name: '虚拟表',
        value: '4',
        checked: false
      },{
        name: '空调表',
        value: '5',
        checked: false
      },{
        name: '中水表',
        value: '11',
        checked: false
      }],
      selectRadiosList: [
        {
          name: '是',
          value: 1,
          checked: true
        },{
          name: '否',
          value: 0,
          checked: false
        }
      ],
    }
  },
  components: {
    DropdownBtn,
    DropdownTextBtn,
    RoomTree,
    DropdownUniversal,
    dropdownThreeTree
  },
  onLoad() {
    this.dropReq = true
  },
  methods: {
    //公共表、虚拟表仪表数据 
    getCommonData() {
      const { readFlag } = this.searchForm
      const startTime = this.searchForm.startTime
      const endTime = this.searchForm.endTime
      let params = {
        data: {
          // areaId: this.searchForm.areaId,  //项目id
          projectId: Number(this.searchForm.projectId),  //项目id
          // roomIdList: [],   //房间
          userId: this.userId,
          pageIndex: 1,
          pageSize: 500,
          customList: this.searchForm.customList,
          openFlag: this.searchForm.openFlag,
          meterKind: this.searchForm.meterKind,
          keyWord: this.searchForm.keyWord,
          readFlag,
          startReadDate: startTime ? startTime + ' 00:00:00' : '',
          endReadDate: endTime ? endTime + ' 00:00:00' : '',
        }
      }
      getMeterList(params).then(res=>{
        this.roomList = res?.data?.records || []
        console.log('roomList===',this.roomList)
        if (!res.success) {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    // 获取公共表、虚拟表区域的customList   再进行获取仪表数据
    getCommonTree() {
      let params = {
        data: {
          // areaId: this.searchForm.areaId,
          nodeCategory: this.searchForm.outside,
          projectId: this.searchForm.projectId,
          userId: this.userId,
        }
      }
      getTree(params).then(res=>{
        this.searchForm.customList = res?.data || []
        if (this.searchForm.customList.length>0) {
          this.getCommonData() 
        }else {
          this.roomList = []
        }
      })
    },
    areaProjectEvent(data) {
      this.searchForm.outside = data.name
      console.log('this.searchForm.outside===',this.searchForm.outside)
      if (this.searchForm.outside == '1') {
        // this.$refs.roomTreeRef.getData()
        this.$refs.roomTreeRef.getBuildingData(this.treeFrom)
      }else {
        this.getCommonTree()
      }
    },
    // 虚拟表-公用表   地区回调
    areaProjectTextEvent(data) {
      console.log('地区回调====',data)
      this.searchForm.areaId = data.areaId
      this.searchForm.projectId = data.projectId
      this.getCommonTree()
      // this.getCommonData()
    },
    hideMenuEvent(type) {
      if (type == 'btn') {
        this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
        this.$refs.btnAddreeEl?.showMaskEvent(false)
        this.areaShow = !this.areaShowse
        this.dropReq = !this.dropReq
        this.areaChange(false)
      } else if (type == 'navigator') {
        // this.areaChange()
        // this.$refs.navigatorEl?.$refs?.dropdownEl?.showMaskEvent(false)
        // this.$refs.btnAddreeEl.showMaskEvent(false)
        // this.$refs.btnEl.showMaskEvent(false)
      }
      this.isMoreModel = false
    },
    tabChange(item) {
      this.tabCurrent = item.id
      this.searchForm.readFlag = item.value
      console.log('readFlag===', this.searchForm.readFlag)
      setTimeout(() => {
        this.searchData()
      }) 
      // this.$refs.roomTreeRef.getBuildingData(this.treeFrom)
    },
    checkboxClick(index) {
      this.selectList[index].checked = !this.selectList[index].checked
    },
    radioClick(paresIndex) {
      this.selectRadiosList.map((item, index) => {
        item.checked = index === paresIndex ? true : false
      })
    },

    areaChange(isShow) {
      isShow = typeof(isShow) == 'boolean' ? isShow : !this.areaShow
      this.areaShow = isShow
      this.dropReq = isShow
      this.isMoreModel = false
    },
    // 下拉菜单确认事件
    dropdownEvent(selArr) {
      console.log('selArr===',selArr)
      this.areaChange(false)
      this.areaText = selArr.map((item) => item.label).filter((label) => label).join('-')
      this.defaultDrop = selArr.map((item) => item.name)
      // 楼栋值
      this.treeFrom.areaId = selArr[0].areaId
      this.treeFrom.projectId = selArr[1].projectId
      this.treeFrom.name = selArr[2].name
      this.$refs.roomTreeRef.getBuildingData(this.treeFrom)
      console.log('this.treeFrom===',this.treeFrom)
    },
    // 开始时间-弹窗
    startTimeConfirm(data) {
      this.searchForm.startTime = utils.formatDate({ type: 's2d', format: 'YY-MM-DD', value: data.value })
      this.showStartTime = false
    },
    // 结束时间-弹窗
    endTimeConfirm(data) {
      this.searchForm.endTime = utils.formatDate({ type: 's2d', format: 'YY-MM-DD', value: data.value })

      this.showEndTime = false
    },
    // 重置
    resetFrom() {
      this.searchForm.openFlag = 1
      this.searchForm.meterKind = ''
      this.searchForm.startTime = ''
      this.searchForm.endTime = ''
      this.selectRadiosList.forEach((item)=>{
        item.value?item.checked = true:item.checked = false
      })
      this.selectList.forEach(item=>{
        item.checked = false
      })
      if (this.searchForm.outside == '1') {
        this.$refs.roomTreeRef.getData()
      }else {
        this.getCommonData()
      }
      this.isMoreModel = false
    },
    //查询-确定
    searchData() {
      this.searchForm.meterKind = ''
      this.selectRadiosList.forEach((item)=>{
        if (item.checked) this.searchForm.openFlag = item.value
      })
			let list = []
			this.selectList.forEach(item=>{
			  if (item.checked) {
					list.push(item.value)
				}
			})
			this.searchForm.meterKind = list.join(',')
      if (this.searchForm.outside == '1') {
        // this.$refs.roomTreeRef.getData(this.searchForm)
        this.$refs.roomTreeRef.getData()
      }else {
        if (this.searchForm.customList.length>0) {
          this.getCommonData() 
        }
      }
      this.isMoreModel = false
      
    },
    onGoPage(evt) {
      const {data, projectId} = evt || {}
      this.goMerterInfoPage(data, projectId) 
    },
    // 跳转新增
    goMerterInfoPage(item, projectId) {
      console.log('item====',item)
      uni.navigateTo({
        url: `/pages-meter/meterInfo?meterId=${item.mid}&projectId=${projectId}`
      })
    },
    // 扫码抄表
    scanCode() {
      uni.scanCode({
        success: res => {
          const { result } = res || {}
          const scanInfo = JSON.stringify(decodeURIComponent(result))
          console.log('扫码结果====', scanInfo)
          uni.navigateTo({
            url: `/pages-meter/addMeterReading?scanInfo=${result}`
          })
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .page {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    /* background-color: #F9F9F9; */
    font-family: PingFang SC, "Helvetica Neue", Arial, sans-serif;
  }
  .page-title {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 26rpx;
    color: #333;
    /* padding: 0 30rpx; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    /* border-bottom: 1px solid #EBEBEB; */
    .address {
      display: flex;
      height: 88rpx;
    }
    .address-ecode {
      width: 48rpx;
      height: 48rpx;
      vertical-align: middle;
      margin-right: 30rpx;
    }
  }

  .room-list {
    /* display: flex;
    flex-wrap: wrap; */
    display: grid;
    flex-direction: column;
    grid-gap: 50rpx;
    grid-template-columns: repeat(3, 1fr);
    /* justify-content: space-between; */
    padding: 36rpx 40rpx;
    background-color: #fff;
    .room {
      display: flex;
      margin-bottom: 24rpx;
    }
    .room-item {
      width: 84rpx;
      height: 52rpx;
      background: #1989F7;
      color: #fff;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border: 1px solid #1989F7;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .no-radius {
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
      border-left: none !important;
      margin-bottom: 0rpx !important;
    }
    .common-item {
      width: 172rpx;
      height: 52rpx;
      line-height: 52rpx;
      @include ellipsis(1);
      text-align: center;
      color: #666;
      font-size: 26rpx;
      border: 1px solid #999999;
      border-radius: 4px;
      position: relative;
      /* margin-bottom: 48rpx; */
    }
    .ranqi::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-ranqi.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
    .xuni::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-xuni.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
    .water::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-water.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
    .dian::after {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      background-image: url('@/static/theme-default/common/icon-dian.png');
      background-size: 100%;
      width: 44rpx;
      height: 44rpx;
    }
  }

  ::v-deep .u-search {
    width: 570rpx;
  }

  .search-line {
    height: 88rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-bottom: 1px solid #EBEBEB;
    border-top: 1px solid #EBEBEB;
    .more-btn {
      font-size: 26rpx;
      color: #666;
      margin-left: 24rpx;
      display: flex;
      align-items: center;
      .img-more {
        width: 24rpx;
        height: 24rpx;
        margin-left: 6rpx;
      }
    }
  }

  .popup-container {
    position: fixed;
    top: 294rpx;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
  }
  .popup-mask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .popup-content {
    position: absolute;
    top: 0;
    width: 100%;
    height: 704rpx;
    background-color: #fff;
  }
  .popup-search {
    padding: 30rpx;
  }
  .popup-footer {
    padding: 20rpx 30rpx;
    height: 90rpx;
    background: #FFFFFF;
    box-shadow: 0px -2px 8px #EFF2F6;
    display: flex;
    justify-content: space-between;
    .footer-btn {
      width: 330rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #1989F7;
      background: rgba(255,255,255,0.99);
      border: 1px solid #1989F7;
      border-radius: 4px;
    }
    .primary {
      background-color: #1989F7;
      color: #fff;
      /* margin-left: 20rpx; */
    }
  }
  .search-title {
    font-size: 30rpx;
    margin-bottom: 24rpx;
    color: #333;
    .more-select {
      font-size: 24rpx;
    }
  }

  .select_list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .select-btn {
    width: 150rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    background-color: #F7F7F7;
    border: 1px solid #F7F7F7;
    border-radius: 4px;
    color: #333;
    font-size: 26rpx;
    margin-bottom: 24rpx;
    box-sizing: border-box;
  }
  .select-btn-active {
    background: #F1F8FF;
    border: 1px solid #1989F7;
    color: #1989F7;
  }
  .radio_list {
    display: flex;
  }

  .time_list {
    display: flex;
    justify-content: space-between;
  }
  .time-btn {
    width: 300rpx;
    height: 60rpx;
    line-height: 60rpx;
    border: 1px solid #CCCCCC;
    border-radius: 4px;
    text-align: center;
    font-size: 26rpx;
    color: #999;
  }
  .time-line {
    line-height: 60rpx;
  }

  .search-line ::v-deep .u-search__content__input {
    font-size: 24rpx;
  }
  /* ::v-deep .page .u-popup {
    flex: inherit;
  } */
</style>
