<template>
  <view :class="[THEME_NAME, 'page']" :style="[THEME_CSS_VAR]">
    <view class="head">
      <view class="subsection">
        <view class="subsection-item" :class="{ 'subsection-action': current == index }"
          v-for="(item, index) in list1" :key="index" @click="sectionChange(index)">{{ item.name }}
        </view>
      </view>
      <u-gap height="1" bg-color="#F3F4F7"></u-gap>
      <view class="t">

      </view>
      <view class="tabs-bg">
        <u-tabs ref="t1" :inactiveStyle="{ color: '#666666', 'font-size': '26rpx' }"
          :activeStyle="{ color: '#2761FF', 'font-size': '26rpx' }" lineColor="#2761FF" lineWidth="30"
          :list="tabList" :current="tabsl.current1" @click="change"></u-tabs>
      </view>
      <view class="searchBox">
        <view class="area" @click="selectArea">
          <text style="margin-right:10rpx;">{{ projectName }}</text>
          <u-icon name="arrow-down-fill" color="#80848F" size="14"></u-icon>
        </view>
        <view v-if="current == 1" class="searchTimeBox" @click="closeArea">
          <u-datetime-picker :show="financialEndDateShow" v-model="financialEndtime" mode="date" @cancel='financialEndDateShow = false' @confirm='(evt) => bindsDateChange(evt, 1)' :cancelText="$t('重置')" :closeOnClickOverlay="true" @close="financialEndDateShow = false"></u-datetime-picker>
          <view @click="financialEndDateShow = true" class="uni-input" :class="{'uni-input-gray':financialEndtime==''}">{{ financialEndtimeTxt ? financialEndtimeTxt : $t('结束时间') }}</view>
          <u-icon style="margin-top:2px;" name="calendar-fill" color="#80848F" size="24"></u-icon>
        </view>
        <view v-else class="searchTimeBox" @click="closeArea">
          <u-datetime-picker :show="sartDateShow" :title="$t('开始时间')" class="title-cla" v-model="sartVal" mode="year-month" @cancel='startCancel' @confirm='bindsDateChange' :confirmText="$t('确认')" :cancelText="$t('重置')" :closeOnClickOverlay="true" @close="sartDateShow = false"></u-datetime-picker>
          <view @click="sartDateShow = true" class="uni-input" :class="{'uni-input-gray':sartDate==''}">{{ sartDate ? sartDate : $t('开始时间') }}</view>
          <text class="split-line">~</text>
          <u-datetime-picker :show="endDateShow" :title="$t('结束时间')" class="title-cla" v-model="endVal" mode="year-month" @cancel='endCancel' @confirm='bindeDateChange' :confirmText="$t('确认')" :cancelText="$t('重置')" :closeOnClickOverlay="true" @close="endDateShow = false"></u-datetime-picker>
          <view @click="endDateShow = true" class="uni-input" :class="{'uni-input-gray':endDate==''}">{{ endDate ? endDate : $t('结束时间') }}</view>
          <u-icon style="margin-top:2px;" name="calendar-fill" color="#80848F" size="24"></u-icon>
        </view>

      </view>
    </view>
    <u-gap height="12" bg-color="#F3F4F7"></u-gap>
    <swiper class="swiperContent" :current="swiperCurrent" @change="changeSwiper">
				<swiper-item style="height: 100%;" v-for="(item,i) in list1" :key="item.code">
          <view style="height: 100%;" v-if="item.code == 'guangjianzhibiao'"> 
            <scroll-view class="scrollContent" @scroll="onScroll" scroll-y="true" :scroll-into-view="intoView" scroll-with-animation="true">
              <template v-if="indicatorsObj.guanligailan">
                <overview id="contentglgl" ref="overview"></overview>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.housedynamics">
                <house-dynamic-info id="contentfwdt" ref="houseDynamics"></house-dynamic-info>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.mainbusinessfinancialanalysis">
                <main-revenue-analysis id="contentzysr" ref="mainRevenue"></main-revenue-analysis>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.operatingcost">
                <operating-cost id="contentjycb" ref="operatingCost"></operating-cost>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.nomainbusinessfinancialanalysis">
                <non-main-revenue-analysis id="contentfzysr" ref="nonMainRevenue"></non-main-revenue-analysis>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.caiwufenxigjzb">
                <finance id="contentcwfx" @jumpEvent='jumpPosition'></finance>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.duojingshourugjzb">
                <much-revenue id="contentdjsr" ref="muchRevenue"></much-revenue>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.gongdanfenxi">
                <order-analysis id="contentgdfx" ref="orderAnalysis" @jumpEvent='jumpPosition'></order-analysis>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.shebeiguankong">
                <device-control id="contentsbgk" ref="deviceControl" @jumpEvent='jumpPosition'></device-control>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.pinzhiguangli">
                <quality-manage id="contentpzgl" category="inspection" @jumpEvent='jumpPosition' canvasIds="inspection" ref="qualityManageD"></quality-manage>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.kefuyuqing">
                <opinion id="contentkfyq" canvasIds="manageCIds" @jumpEvent='jumpPosition' ref="opinionD"></opinion>
                <u-gap height="10" bg-color="#F3F4F7"></u-gap>
              </template>
              <template v-if="indicatorsObj.xunluofenxi">
                <quality-manage id="contentzhxl" category="patrol" @jumpEvent='jumpPosition' canvasIds="patrol" ref="qualityManage"></quality-manage>
              </template>
            </scroll-view>
          </view>
					<view style="height: 100%;" v-if="item.code == 'caiwufenxi'">
            <erp ref="financeErp" :jurisdiction="erpListObj" :idsList="erpList" @scrollTabs="scrollTabs" :isScroll="isScroll" :intoView="intoView"></erp>
          </view>
					<view style="height: 100%;" v-if="item.code == 'kehufuwu'">
            <customer-service :jurisdiction="clientsListObj" :idsList="clientsList" ref="customerServiceRef" @scrollTabs="scrollTabs" :isScroll="isScroll" :intoView="intoView"></customer-service>
          </view>
					<view style="height: 100%;" v-if="item.code == 'xianchangguanli'">
            <site-manage ref="siteManagement" :jurisdiction="liveListObj" :idsList="liveList" @scrollTabs="scrollTabs" :isScroll="isScroll" :intoView="intoView"></site-manage>
          </view>
					<view style="height: 100%;"  v-if="item.code == 'kehuyunying'">
            <community ref="communityD" :jurisdiction="communityListObj" :idsList="communityList" @scrollTabs="scrollTabs" :isScroll="isScroll" :intoView="intoView"></community>
          </view>
        </swiper-item>
			</swiper>
    
    <!-- app和微信小程序显示 -->
    <!-- #ifdef APP-VUE || MP-WEIXIN -->
    <c-tabbar :value="1"></c-tabbar>
    <!-- #endif -->
    <screening ref="screening" top="140px" @selectProject="selectProject"></screening>
  </view>
</template>
<script>
import i18n from '../../lang/index'

import { mapMutations } from 'vuex'
import overview from '@/pages-kanban/kanban/component/overview.vue'; //管理概览
import finance from '@/pages-kanban/kanban/component/finance.vue';//财务分析
import muchRevenue from '@/pages-kanban/kanban/component/muchRevenue.vue'; //多经收入
import orderAnalysis from '@/pages-kanban/kanban/component/orderAnalysis.vue';//工单分析
import DeviceControl from '@/pages-kanban/kanban/component/deviceControl.vue';//设备管控
import QualityManage from '@/pages-kanban/kanban/component/qualityManage.vue'; //品质管理,综合巡逻
import Opinion from '@/pages-kanban/kanban/component/opinion.vue'; //舆情管理
import CTabbar from '@/components/c-tabbar.vue';
import Screening from '@/components/screening-criteria/screening.vue';
import Erp from '@/pages-kanban/kanban/erp.vue';  //erp
import CustomerService from '@/pages-kanban/kanban/customerService.vue'; //客户管理
import SiteManage from '@/pages-kanban/kanban/siteManage.vue'; //现场管理
import Community from '@/pages-kanban/kanban/community.vue'; //社区运营
import HouseDynamicInfo from '@/pages-kanban/kanban/component/house-dynamic-info.vue';
import LabelHeader from '@/pages-kanban/kanban/component/label-header.vue';
import MainRevenueAnalysis from '@/pages-kanban/kanban/component/main-revenue-analysis.vue';
import NonMainRevenueAnalysis from '@/pages-kanban/kanban/component/non-main-revenue-analysis.vue';
import OperatingCost from '@/pages-kanban/kanban/component/operating-cost.vue';
import SwitchTabs from '@/pages-kanban/kanban/component/switch-tabs.vue'; 
import dayjs from 'dayjs'
import { getFunctionButtons2 } from '@/service/landcrm'

export default {
  components: {
    overview,
    finance,
    muchRevenue,
    orderAnalysis,
    DeviceControl,
    QualityManage,
    Opinion,
    CTabbar,
    Screening,
    Erp,
    CustomerService,
    Community,
    SiteManage,
    HouseDynamicInfo,
    LabelHeader,
    MainRevenueAnalysis,
    SwitchTabs,
    OperatingCost,
    NonMainRevenueAnalysis
  },
  data() {
    const date = new Date()
    const y = uni.$u.timeFormat(date, 'yyyy')
    const sd = `${y}-01`
    const month = date.getMonth() + 1
    const ed = `${y}-${month < 10 ? '0' + month : month}`
    const financialEnd = uni.$u.timeFormat(date, 'yyyy-mm-dd')
    return {
      swiperCurrent:0,
      test: true,
      isScroll: true,
      scrolltop: 0,
      sartVal: sd, //用于初始化组件默认值
      endVal: ed,
      sartDate: sd,
      endDate: ed,
      sartDateShow:false,
      endDateShow:false,
      showTabs: true,
      intoView: '',
      projectName: i18n.t('公司项目'),
      list: [
        { name: i18n.t('关键指标'), code:'guangjianzhibiao',key:'indicators' },
        { name: i18n.t('财务分析'), code:'caiwufenxi', key:'erpList' },
        { name: i18n.t('客户服务'), code:'kehufuwu', key:'clientsList' },
        { name: i18n.t('现场管理'), code:'xianchangguanli', key:'liveList' },
        { name: i18n.t('客户运营'), code:'kehuyunying', key:'communityList' }
      ],
      list1:[],
      current: 0,
      tabsl: {
        current1: 0
      },
      tabList: [],
      indicatorsObj:{
        guanligailan:false,
        housedynamics:false,
        mainbusinessfinancialanalysis:false,
        operatingcost:false,
        nomainbusinessfinancialanalysis:false,
        caiwufenxigjzb:false,
        duojingshourugjzb:false,
        gongdanfenxi:false,
        shebeiguankong:false,
        pinzhiguangli:false,
        kefuyuqing:false,
        xunluofenxi:false,
      },
      indicators: [//关键指标
        { name: i18n.t('管理概览'), id: 'glgl', menuCode: "guanligailan" },
        { name: i18n.t('房屋动态'), id: 'fwdt', menuCode: "housedynamics" },
        { name: i18n.t('主营业务收入'), id: 'zyyw', menuCode: "mainbusinessfinancialanalysis" },
        { name: i18n.t('经营成本'), id: 'jycb', menuCode: "operatingcost" },
        { name: i18n.t('非主营业务收入'), id: 'fzyyw', menuCode: "nomainbusinessfinancialanalysis" },
        { name: i18n.t('财务分析'), id: 'cwfx', menuCode: "caiwufenxigjzb" },
        { name: i18n.t('多经收入'), id: 'djsr', menuCode: "duojingshourugjzb" },
        { name: i18n.t('工单分析'), id: 'gdfx', menuCode: "gongdanfenxi" },
        { name: i18n.t('设备管控'), id: 'sbgk', menuCode: "shebeiguankong" },
        { name: i18n.t('品质管理'), id: 'pzgl', menuCode: "pinzhiguangli" },
        { name: i18n.t('客户舆情'), id: 'kfyq', menuCode: "kefuyuqing" },
        { name: i18n.t('综合巡逻'), id: 'zhxl', menuCode: "xunluofenxi" }],
      erpListObj:{
        shoujiaoqingkuang:false,
        xianjinliu:false,
        yushouqingkuang:false,
        qingqianqingkuang:false,
        duojingshourucwfx:false,
        zhaosangfenxi:false,
      },
      erpList: [//ERP财务
        { name: i18n.t('收缴情况'), id: 'erpSj', menuCode: "shoujiaoqingkuang" },
        { name: i18n.t('现金流'), id: 'erpXjl', menuCode: "xianjinliu" },
        { name: i18n.t('预缴情况'), id: 'erpYs', menuCode: "yushouqingkuang" },
        { name: i18n.t('清欠情况'), id: 'erpQq', menuCode: "qingqianqingkuang" },
        { name: i18n.t('多经收入'), id: 'erpDj', menuCode: "duojingshourucwfx" },
        { name: i18n.t('招商分析'), id: 'erpZS', menuCode: "zhaosangfenxi" }],
      clientsListObj:{
        gongdanqingkuang:false,
      },
      clientsList: [{ name: i18n.t('工单情况'), id: 'clientsGdqk', menuCode: "gongdanqingkuang" }],
      liveListObj:{
        yinhuanyujing:false,
        pinzhiguanli:false,
        shebeiguangli:false,
        shebeixunjian:false,
      },
      liveList: [ //现场管理
        { name: i18n.t('隐患预警'), id: 'sitYh', menuCode: "yinhuanyujing" },
        { name: i18n.t('品质管理'), id: 'sitPz', menuCode: "pinzhiguanli" },
        { name: i18n.t('设备管理'), id: 'sitSheb', menuCode: "shebeiguangli" },
        { name: i18n.t('设备巡检'), id: 'sitXj', menuCode: "shebeixunjian" }
      ],
      communityListObj:{
        yunyinggailan:false,
        renzhengfenxi:false,
        kehuyuqing:false,
        zhongdianrenqun:false,
        kehuchuxing:false,
        fuwushouru:false,
      },
      communityList: [
        { name: i18n.t('运营概览'), id: 'comYy', menuCode: "yunyinggailan" },
        { name: i18n.t('认证分析'), id: 'comFx', menuCode: "renzhengfenxi" },
        { name: i18n.t('客户舆情'), id: 'comYq', menuCode: "kehuyuqing" },
        { name: i18n.t('重点人群'), id: 'comRq', menuCode: "zhongdianrenqun" },
        { name: i18n.t('客户出行'), id: 'comCx', menuCode: "kehuchuxing" },
        { name: i18n.t('服务收入'), id: 'comSr', menuCode: "fuwushouru" }
      ],
      distanceArr: [],
      idsList: [{// 用来做滚动锚点                 
        tabsName: i18n.t('关键指标'),
        index: 0,
        ids: [{ id: 'glgl', index: 0 },
        { id: 'cwfx', index: 1 },
        { id: 'djsr', index: 2 },
        { id: 'gdfx', index: 3 },
        { id: 'sbgk', index: 4 },
        { id: 'pzgl', index: 5 },
        { id: 'kfyq', index: 6 },
        { id: 'zhxl', index: 7 }]
      }],
      searchForm:{
        areaId:'',
        projectId:''
      },
      financialEndtime: financialEnd,
      financialEndtimeTxt: financialEnd,
      financialEndDateShow: false,
      permission: {
        housedynamics: false, // 房屋动态 
        mainbusinessfinancialanalysis: false, // 主营业务收入
        operatingcost: false, // 经营成本
        nomainbusinessfinancialanalysis: false // 非主营业务收入
      },
      menusLoaded: false,
      timerId:null
    };
  },
  computed: {
    filterData() {
      const {areaId, projectId} = this.searchForm
      const sartVal = this.sartVal
      const endVal = this.endVal
      const sartDate = this.sartDate
      const endDate = this.endDate
      const financialEndtime = this.financialEndtime
      const financialEndtimeTxt = this.financialEndtimeTxt
      
      return {
        areaId,
        projectId,
        sartVal,
        endVal,
        sartDate,
        endDate,
        financialEndtime,
        financialEndtimeTxt,
        startTime: this.formatTime(sartDate,0),
        endTime: this.formatTime(endDate,1)
      }
    }
  },
  watch: {
    filterData: {
      handler(n) {
        this.updateKanbanFilter(n)
      },
      deep: true,
      immediate: true
    }
  },
  onshow() {
    // 1.利用uni app的boundingClientRect
    try {
      EbeiPlugins.setNavigationItemTitle(i18n.t('看板'));
    }catch (e) {
    }

  },

  methods: {
    ...mapMutations(['updateKanbanFilter']),
    initData(){
      let that = this
      let params = {
        areaId:this.searchForm.areaId,
        projectId:this.searchForm.projectId,
        startTime:this.formatTime(this.sartDate,0),
        endTime:this.formatTime(this.endDate,1)
      }
      let myCode = this.list1[this.current].code
      if(myCode == 'guangjianzhibiao'){
        that.keyIndicator(params)
      }else if(myCode == 'caiwufenxi'){
        that.$refs.financeErp[0].init(params)
      }else if(myCode == 'kehufuwu'){
        that.$refs.customerServiceRef[0].init(params)
      }else if(myCode == 'xianchangguanli'){
        this.$refs.siteManagement[0].init(params)
      }else if(myCode == 'kehuyunying'){
        that.$refs.communityD[0].init(params)
      } 
    
      // if (houseDynamics && houseDynamics.updateHouseDynamicInfo) houseDynamics.updateHouseDynamicInfo(params)
    },

    // 关键指标全部接口
    keyIndicator(params){
      let that = this
      const { O_USER_INFO } = this.$constant;
      const { companyId: cid } = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {};
      const companyId = cid || this.$appConfig.COMPLANY_ID;
      const searchDate = params.endTime
      const customModuleParams = {...params, companyId, searchDate}
      this.indicators.forEach(item =>{
        that.$nextTick(() => {
          if(item.menuCode=='guanligailan'){
            console.log('that.$refs',that.$refs)
            that.$refs.overview[0].init(params)
          }else if(item.menuCode=='housedynamics'){
            that.$refs.houseDynamics[0].init(customModuleParams)
          }else if(item.menuCode=='mainbusinessfinancialanalysis'){
            that.$refs.mainRevenue[0].init(customModuleParams)
          }else if(item.menuCode=='operatingcost'){
            that.$refs.operatingCost[0].init(customModuleParams)
          }else if(item.menuCode=='nomainbusinessfinancialanalysis'){
            that.$refs.nonMainRevenue[0].init(customModuleParams)
          }else if(item.menuCode=='gongdanfenxi'){
            that.$refs.orderAnalysis[0].init(params)
          }else if(item.menuCode=='shebeiguankong'){
            that.$refs.deviceControl[0].init(params)
          }else if(item.menuCode=='pinzhiguangli'){
            that.$refs.qualityManageD[0].init(params) 
          }else if(item.menuCode=='kefuyuqing'){
            that.$refs.opinionD[0].init(params) 
          }else if(item.menuCode=='xunluofenxi'){
            that.$refs.qualityManage[0].init(params)   
          }
        })
      })
    },
    // 监听页面滚动
    onScroll(event) {
      var that = this;
      if (this.isScroll) {
        // that.distanceArr = [];
        let mapList = new Map();;
        // let ids = that.idsList[that.current].ids;
        this.indicators.map((element) => {
          const query = uni.createSelectorQuery().in(that);
          query.select('#content' + element.id).boundingClientRect(data => {
            mapList[element.id] = { id: element.id, index: element.index, top: data.top - 140 };
          }).exec();
        });
        setTimeout(() => {
          let list = [];
          for (var key in mapList) {
            list.push(mapList[key])
          }
          that.distanceArr = list;
          that.$nextTick(() => {
            let x = 0;
            var arr = that.distanceArr;
            let s = arr.sort((a, b) => Math.abs(x - a.top) - Math.abs(x - b.top));
            if (s && s.length > 0) {
              that.$set(this.tabsl, 'current1', s[0].index);
            }
          })
        }, 100);
      }
    },
    scrollTabs(index) {
      this.$set(this.tabsl, 'current1', index);
    },
    sectionChange(index) {
      this.showTabs = false;
      this.current = index;
      this.swiperCurrent = index;
      let myCode = this.list1[index].code
      let that = this
      this.$nextTick(() => {
        if (myCode == 'guangjianzhibiao') {
          that.tabList = that.indicators;
        } else if (myCode == 'caiwufenxi') {
          // that.tabList = that.erpList;
        } else if (myCode == 'kehufuwu') {
          that.tabList = that.clientsList;
        } else if (myCode == 'xianchangguanli') {
          that.tabList = that.liveList;
        } else if (myCode == 'kehuyunying') {
          that.tabList = that.communityList;
        }
      })
      this.$nextTick(() => {
        // this.$set(this.tabsl, 'current1', 0); 
        this.tabsl.current1 = 0;
        this.$refs.t1.innerCurrent = 0;
        this.intoView = `${index == 0 ? 'content' : ''}${this.tabList[0].id}`
        this.showTabs = true;
      })
      this.initData()
    },
    change(item) {
      this.isScroll = false;
      if (this.current === 0) {
        this.intoView = `content${item.id}`
      } else {
        this.intoView = item.id;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          this.isScroll = true;
        }, 2000)
      })
    },
    selectArea() {
      this.$refs.screening.open();
    },
    selectProject(item) { 
      if(item.projectName == i18n.t('全部')){
        this.projectName = item.areaName;
        return;
      }
      this.projectName = item.projectName ? item.projectName : item.areaName ? item.areaName : i18n.t('公司项目');
      this.searchForm.areaId=item.areaId;
      this.searchForm.projectId=item.projectId;
      this.initData()
    },
    closeArea() {
      this.$refs.screening.close();
    },

    //选择开始时间
    bindsDateChange: function (e, financialEndtime) {
      let v = e.value;
      if (financialEndtime) {
        this.financialEndtimeTxt = uni.$u.timeFormat(v, 'yyyy-mm-dd'),
        this.financialEndDateShow = false
        this.initData()
        return
      }
      if(this.endDate!=''){
        let s = new Date(v)
        let end = new Date(this.endDate)
        if(s.getTime() > end.getTime()){
          uni.showToast({
            title: i18n.t('开始时间不能比结束时间晚！'),
            duration: 2000,
            icon: 'none',
          });
        }else{
          this.sartDate = this.getCurrentMonth(v)
          this.initData()
        }
      }
      this.sartDateShow = false
    },

    //选择结束时间
    bindeDateChange: function (e) {
      let v = e.value;
      if(this.sartDate!=''){
        let s = new Date(this.sartDate)
        let end = new Date(v)
        if(s.getTime() > end.getTime()){
          uni.showToast({
            title: i18n.t('开始时间不能比结束时间晚！'),
            duration: 2000,
            icon: 'none',
          });
        }else{
          this.endDate = this.getCurrentMonth(v)
          this.initData()
        }
        this.endDateShow = false
      } 
    },

    //格式化时间
    formatTime(data,type){
      if(!data){
        return ''
      }
      let myData = new Date(data)
      let newData
      if(type==0){
        newData = new Date(myData.getFullYear(), myData.getMonth(), 1)
      }else{
        newData = new Date(myData.getFullYear(), myData.getMonth() + 1, 0, 23, 59, 59)
      }
      return dayjs(newData).format('YYYY-MM-DD HH:mm:ss')
    },

    startCancel(){
      this.sartDate = ''
      this.sartDateShow = false
    },

    endCancel(){
      this.endDate = ''
      this.endDateShow = false
    },

    getCurrentMonth(v) {
      const date = v ? new Date(v) : new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      month = month > 9 ? month : '0' + month
      return `${year}-${month}`
    },
    // 获取所有元素在当前页面所处的位置信息
    // getDistanceArr() {
    //     const _this = this
    //     _this.tabs.map(el => {
    //         uni.createSelectorQuery().select(el.id).boundingClientRect(data => {
    //             // 获取当前ID距离顶部的top值
    //             _this.distanceArr.push(data.top)
    //             console.log('顶部',_this.distanceArr);
    //         }).exec()
    //     })
    // },

    //跳转到指定位置
    jumpPosition(parmas){
      this.sectionChange(parmas.tab1)
      if(parmas.id){
        let index = this[parmas.listName].map(item => item.id).indexOf(parmas.id)
        this.$nextTick(() => {
          setTimeout(() => {
            this.change(parmas)
            this.tabsl.current1=index
          }, 2000)
        })
      }
    },
    changeSwiper(e){ 
      let index = e.detail.current;
      this.showTabs = false;
      this.current = index;
      let myCode = this.list1[index].code
      let that = this
      this.$nextTick(() => {
        if (myCode == 'guangjianzhibiao') {
          that.tabList = that.indicators;
        } else if (myCode == 'caiwufenxi') {
          that.tabList = that.erpList;
        } else if (myCode == 'kehufuwu') {
          that.tabList = that.clientsList;
        } else if (myCode == 'xianchangguanli') {
          that.tabList = that.liveList;
        } else if (myCode == 'kehuyunying') {
          that.tabList = that.communityList;
        }
      })
      this.$nextTick(() => {
        // this.$set(this.tabsl, 'current1', 0); 
        this.tabsl.current1 = 0;
        this.$refs.t1.innerCurrent = 0;
        this.intoView = `${index == 0 ? 'content' : ''}${this.tabList[0].id}`
        this.showTabs = true;
      })
      this.initData()
    },
    updatelocale(){ 
      return new Promise((resolve) => {
        const { uniPlatform } = uni.getSystemInfoSync();
        const isWeb = uniPlatform === 'web';
        let conut = 0, timer = null

        if (isWeb) {
          timer = setInterval(() => {
            conut += 100
            if (window.EbeiPlugins) {
              window.EbeiPlugins.getLocalUserInfo(result => { 
                const { locale = 'zh'} = result || {}
                 uni.setStorageSync('locale', locale);
                resolve()
                clearInterval(timer)
                // if (!this.menusLoaded) this.getFunctionButtons2()
              })
            }
            if (conut >= 1500) {
              clearInterval(timer)
              resolve()
            }
          }, 100);
        } else {
          resolve()
        }
      })
    },
    updateUserInfoFromNative() {
      return new Promise((resolve) => {
        const { uniPlatform } = uni.getSystemInfoSync();
        const isWeb = uniPlatform === 'web';
        // let conut = 0, timer = null

        if (isWeb) {
          // timer = setInterval(() => {
          //   conut += 100
            if (window.EbeiPlugins) {
              window.EbeiPlugins.getLocalUserInfo(result => { 
                const { companyId = '', id_token, locale = 'zh'} = result || {}
                const { O_USER_INFO, TOKEN } = this.$constant;
                const userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {}
                this.$utils.storageAction({ key: O_USER_INFO, action: 'set', value: {...userInfo, companyId } })
                this.$utils.storageAction({ key: TOKEN, action: 'set', value: userInfo.token })
                uni.setStorageSync('id_token', id_token);
                //缓存和方法获取回来的值不一样，则刷新页面
                if(uni.getStorageSync('locale')!=locale){
                  uni.setStorageSync('locale', locale);
                  // 获取语言后，需要刷新一下，才能显示
                  uni.navigateBack({
                    delta: 1, // 返回的页面层数
                    success: () => {
                      setTimeout(() => {
                        uni.navigateTo({
                          url: '/pages-kanban/kanban/index'
                        });
                      }, 100); // 延迟确保返回动画完成
                    }
                  });
                }
                EbeiPlugins.setNavigationItemTitle(i18n.t('看板'));
                resolve()
                // clearInterval(timer)
                if (!this.menusLoaded) this.getFunctionButtons2()
              })
            }
          //   if (conut >= 1500) {
          //     clearInterval(timer)
          //     resolve()
          //   }
          // }, 100);
        } else {
          resolve()
        }
      })
    },
    // 获取菜单权限
    getFunctionButtons2() {
      const { O_USER_INFO } = this.$constant
      const { uniPlatform } = uni.getSystemInfoSync();
      const isWeb = uniPlatform === 'web';
      const { userId = '' } = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' }) || {}
      const params = {
        data: {
          userId : isWeb ? uni.getStorageSync('userId') : userId,
          menuTypes: 0,
          belongSystem: '1'
        },
        hideLoading: true,
        responseToast: false,
      }
      return new Promise((resolve) => {
        getFunctionButtons2(params).then(res => {
          if (res.resultCode == 200) {
            const menus = Array.isArray(res.data) ? res.data : []
            this.menusLoaded = true
            menus.some(item => {
              const { name, items } = item
              if (name == i18n.t('门户驾驶舱')) {
                items.some(item => {
                  const { name, items } = item
                  if (name == i18n.t('关键指标')) {
                    items.forEach(item => {
                      const { menuCode } = item
                      const menuAvailable = this.permission.hasOwnProperty(menuCode)
                      this.permission[menuCode] = menuAvailable 
                    });
                    return true
                  }
                })

                // 权限控制
                //第一层数据
                let list = []
                this.list.forEach(item1 =>{
                  items.forEach(item2 =>{
                    if(item2.menuCode==item1.code)
                    list.push(item1)
                  })
                })
           
                //没勾选权限，默认显示所有
                this.list1 = list.length>0 ? list : this.list

                this.list1.forEach(item1 =>{
                  let tempList = []
                  items.forEach(item2 =>{
                    if(item1.code==item2.menuCode){
                      console.log('item2',item2)
                      this[item1.key].forEach(item3 =>{
                        item2.items.forEach(item4 =>{
                          if(item3.menuCode==item4.menuCode){
                            tempList.push(item3)
                          }
                        })
                      })
                    }
                  })
                  
                  tempList.forEach((e,index) =>{
                    e.index = index
                    this[item1.key+'Obj'][e.menuCode] = true
                  })
                  console.log('indicatorsObj',this.indicatorsObj)
                  this[item1.key] = tempList
                  this.tabList = this[this.list1[0].key];
                })
                this.initData()
                return true
              }
            })
            resolve()
          }
        })
      })
    },

  },
  onLoad(){
    
    try {
      //  this.updatelocale();
      EbeiPlugins.setNavigationItemTitle(i18n.t('看板'));
       
    }catch (e) {
    }
  },
  async created() {
    await this.getFunctionButtons2()
  },
  mounted() {
    let timerId=setTimeout(e=>{
      //需延时获取用户信息，不然有可能EbeiPlugins为undefined
      this.updateUserInfoFromNative()
      clearTimeout(timerId)
    },100)
    // this.initData()
    // this.getDistanceArr()

    
  },
  onUnload() {
    // 页面卸载时清除定时器，避免内存泄漏
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}
</script> 
<style scoped lang="scss">
.page {
  box-sizing: border-box;
  background-color: #F3F4F7;
  width: 100%;
  height: 100%;
}

.head {
  .subsection {
    height: 88rpx;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    padding: 0 10rpx;
    font-size: 24rpx;
    font-family: PingFang SC;
    color: #666666;

    .subsection-item {
      flex: 1;
      text-align: center;
    }

    .subsection-action {
      height: 52rpx;
      line-height: 52rpx;
      background: #2761FF;
      border-radius: 4rpx;
      font-size: 24rpx;
      font-family: PingFang SC;
      color: #FFFFFF;
    }

    // /deep/ .u-subsection__item{ 
    //     background: green;
    // }
  }

  .subsection ::v-deep .u-subsection__item--no-border-right {
    background: green;
  }

  .tabs-bg {
    background-color: #FFFFFF;
    border-bottom: 1px solid #F3F4F7;
    height: 88rpx;
  }
}

.searchBox {
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx;

  .area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26rpx;
    font-family: 'PingFang SC';
    color: #333333;

    // &::after {
    //     color: #666666;
    //     content: '\25BC';
    // }

  }
}

.swiperContent{ 
   height: calc(100% - 210px);
   // #ifdef H5
   height: calc(100% - 160px);
   // #endif
}
.scrollContent {  
  overflow: auto;
  height: 100%;
}

.searchTimeBox {
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 1px solid;
  padding: 0 5px;
  // border-color: #F3F4F7;
  border-radius: 5px;

 ::v-deep .u-toolbar__title   {
    color: #333333 !important;
  }
}

.uni-input {
  font-size: 13px;
  font-family: "PingFang SC";
  color: #333333;
}
.uni-input-gray{
  color: #999;
}
.split-line{
  padding: 0 10rpx;
}
.ele-hidden {
  display: none;
}
</style>