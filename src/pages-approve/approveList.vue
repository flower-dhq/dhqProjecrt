<template>
  <view class="page-panel"  :style="[THEME_CSS_VAR]">
    <u-sticky bgColor="#fff" offsetTop="0" customNavHeight="0">
      <u-tabs :current="currentTab" :list="tabList" :scrollable="false" :lineWidth="60" :lineHeight="2" @click="tabChange"
      :activeStyle="{fontWeight: '400',fontSize: '28rpx',color: '#2761FF'}" 
      :inactiveStyle="{fontWeight: '400',fontSize: '28rpx',color: '#666666 '}"/>
      <view class="page-time">
        <view class="startime">
          <text style="color: #333;margin-right: 20rpx;">申请时间:</text>
          <view @click="showStartTime = true">{{ searchForm.tjTimeStart || '开始时间' }}</view>
        </view>
        <view class="endtime"  @click="showEndTime = true">{{ searchForm.tjTimeEnd || '结束时间' }}</view>
      </view>
      <view class="page-search"> 
        <u-search  placeholder="输入标题/描述关键词搜索" :showAction="true" actionText="搜索" @search="searchData" @custom="searchData" v-model="searchForm.keyword"></u-search>
      </view>
    </u-sticky>

    <view style="min-height: calc(100vh - 110px); background-color: #F9F9F9;">
      <approve-item :listData="listData" :state="state" class="dataliststyle"></approve-item>
      <!-- <scroll-view :scrollTop="0" scroll-y style="width: 100%;height: 100%;">
        <approve-item :listData="listData" :state="state" class="dataliststyle"></approve-item>
      </scroll-view> -->
      <u-loadmore v-if="isLastPage || pageForm.loadMore == 'loading'" :status="pageForm.loadMore" line />
    </view>



    <!-- 弹出框 -->
    <u-datetime-picker :show="showStartTime" v-model="tjTimeStart" mode="date" @confirm="confirmStartTime" @cancel="showStartTime = false"></u-datetime-picker>
    <u-datetime-picker :show="showEndTime" v-model="tjTimeEnd" mode="date" @confirm="confirmEndTime" @cancel="showEndTime = false"></u-datetime-picker>
  </view>
</template>

<script type="text/ecmascript-6">
import { getApproveListByAuditUserId, getApproveListByCopyUserId, getApproveListByLaunchUserId, getApproveListByAuditUserIdCount } from '@/service/activiti';
import dayjs from 'dayjs';
import approveItem from './modules/approveItem.vue';
export default {
  name: "",
  components: {
    approveItem
  },
  data() {
    let { O_USER_INFO } = this.$constant
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
    return {
      currentTab: 0,
      listData: [],
      state: 1,
      tjTimeStart: dayjs(new Date()).subtract(2, 'months').format('YYYY-MM-DD'),
      tjTimeEnd: dayjs(new Date()).format('YYYY-MM-DD'),
      userInfo: userInfo,
      searchForm: {
        approveUserId : userInfo.userId,//审批任务的代办人ID
        doneOrNotDone: 0, // 代办or已办(0:代办;1：已办;)
        keyword: '',  // 关键词
        tjTimeStart: dayjs(new Date()).subtract(2, 'months').format('YYYY-MM-DD'),   // 开始时间
        tjTimeEnd: dayjs(new Date()).format('YYYY-MM-DD'),  // 结束时间
        timeConditionType: 4,
        companyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID
      },
      tabList: [
        { name: '待处理' },
        { name: '已处理' },
        { name: '抄送我' },
        { name: '我发起的' },
      ],
      showStartTime: false,
      showEndTime: false,
      hasMoreData: false,
      pageForm: {
        current: 1,
        size: 10,
        total: 0,
        pages: 0,
        loadMore: 'nomore' // loading, nomore
      },
      otherArr:['ZF-950','ZF-NOT-950','notNormalCloseApproval','FZCGB-NOT-950','LXTZ-950','LXTZ-NOT-950','TSSQ-950','TSSQ-NOT-950','QFTZ-COMPANY','QFTZ-AREA-MBKW','QFTZ-AREA-MBKN','QFTZ-PROJECT-MBKW','QFTZ-PROJECT-MBKN'
      ,'WJDC-COMPANY','WJDC-AREA-MBKW','WJDC-AREA-MBKN','WJDC-PROJECT','advertisingApplication','GG-FGS','GG-PROJECT',"ycContractAdd", "ycContractChange", "ycContractTZ","ycContractAdd_0", "ycContractAdd_1",
        "cwContractAdd", "cwContractChange", "cwContractTZ", "cwContractDelay","fwContractAdd", "fwContractChange", "fwContractTZ",
        'kfCheckInInspect', // 入住验收
        'kfCheckInApply', // 入住申请
        'kfRecoveryOffer', // 复原报价
        'kfCustomerComplaints', // 客户投诉
        'kfRefundOfDeposit', // 押金退还
        "kfAccessCard", // 门禁卡
        'kfTenantNameplate', // 租户铭牌申请
        'kfDisplayScreen', // 显示屏申请
        'kfRenovation', // 二次装修
        'kfCommunicationBusiness', // 通讯业务
        'kfDecorationRestoration', // 装修复原
        'kfCustomerDemands', // 客户诉求
        'kfSporadicCharges', // 零星收费
        'chjClimbingHigh', 'chjFireWork', 'chjConfinedSpace', 'chjSprayTask', 'chjTmpElectricity', 'chjWorkContact'],
    }
  },
  computed: {
    isLastPage() {
      // console.log('this.listData.length==', this.listData.length)
      // console.log('this.pageForm.total==', this.pageForm.total)
      // console.log('this.listData.length >= this.pageForm.total====', this.listData.length >= this.pageForm.total)
      return this.listData.length >= this.pageForm.total
    }
  },
  onLoad() {
    this.initData()
  },
  onPullDownRefresh() {
    this.initData()
  },
  async onReachBottom() {
    switch (this.currentTab) {
      case 0: //待处理
        this.searchForm.doneOrNotDone = 0
        this.getData(this.pageForm.current + 1)
        break;
      case 1: //已处理
        this.searchForm.doneOrNotDone = 1
        this.getData(this.pageForm.current + 1)
        break;
      case 2: //抄送我
        this.state = '1';
        this.pageForm.current ++
        this.getApproveListByCopyUserId()
        break;
      case 3: //我发起的
        this.state = '2';
        this.pageForm.current ++
        this.getApproveListByLaunchUserId()
        break;
      default:
        break;
    }
  },
  methods: {
    // 初始化数据
    initData() {
      this.getData(1)
    },
    // 查询
    searchData() {
      this.pageForm.current = 1
      switch (this.currentTab) {
        case 0: //待处理
          this.searchForm.doneOrNotDone = 0
          this.getData(1)
          break;
        case 1: //已处理
          this.searchForm.doneOrNotDone = 1
          this.getData(1)
          break;
        case 2: //抄送我
          this.state = '1';
          this.getApproveListByCopyUserId()
          break;
        case 3: //我发起的
          this.state = '2';
          this.getApproveListByLaunchUserId()
          break;
        default:
          break;
      }
    },
    getTabsNum(){
      const params = {
        header: {
          // 'x-userId-header': this.userInfo.userId,
          // 'x-companyid-header': this.searchForm.companyId,
          'x-userId-header': 2082395,
          'x-companyid-header': 389,
        },
        data: {
          tjTimeStart: this.searchForm.tjTimeStart,
          tjTimeEnd: this.searchForm.tjTimeEnd,
          timeConditionType: 4,
          // processKey:'Decoration_Water_Verify',
          companyId: this.searchForm.companyId,
          approveUserId: this.userInfo.userId,
          companyId: 389,
          approveUserId:2082395,
        },
        hideLoading: true
      }
      getApproveListByAuditUserIdCount(params).then(res => {
        console.log('res.res',res.data)
        if(res.status == 200){

          let data = res.data[0] || {};
          // this.$set(this.tabList[0],'num',data.notDoneCount);
          this.tabList = [
            { name: '待处理', badge: { value: data.notDoneCount } },
            { label: '已处理', badge: { value: data.doneCount } },
            { label: '抄送我', badge: { value: data.copyCount } },
            { label: '我发起的', badge: { value: data.launchCount } },
          ]
        }
      })
    },
    async getData(pageIndex = 1) {
      let listData = [
          {
              "apvFlagText": "待审核 ",
              "approveType": "Decoration_Review",
              "approveLaunchUserName": "管理员",
              "currentApproveNode": "Node01",
              "approveLaunchUserId": "2082395",
              "apvFlag": "0",
              "approveParam": "{\"launchApproveSystem\":{\"code\":\"Decoration_Review\",\"name\":\"装修审核\"},\"callBackUrl\":\"https://portal.wuyeface.com/decorationManage/decoration/approvalDecorationCallBack\",\"attachApplyList\":[],\"attachList\":[{\"attachPath\":\"https://cms.wuyeface.com/filemanager/filedatabase/crm/attach/2024/8/1/a8db55b1-f2e3-4daf-b9f3-2171fa680d9c.xlsx\",\"attachType\":2,\"attachName\":\"cshi1.xlsx\"},{\"attachPath\":\"https://cms.wuyeface.com/filemanager/filedatabase/crm/attach/2024/8/1/ba8150d0-55c4-4478-92ed-4536658d9e9d.xlsx\",\"attachType\":2,\"attachName\":\"cshi1.xlsx\"},{\"attachPath\":\"https://cms.wuyeface.com/filemanager/filedatabase/crm/attach/2024/8/1/c0baa970-7f6a-4988-8d13-54495eee5cb6.xlsx\",\"attachType\":2,\"attachName\":\"cshi1.xlsx\"}],\"taskNodeFlowVar\":{\"decorationType\":\"2771365\"}}",
              "actTaskId": "1890264",
              "currentApproveNodeText": "一级审批",
              "approveTitle": "管理员发起的装修申请",
              "auditItemId": "202409291727580238192",
              "fkId": "1582",
              "chooseType": 1,
              "approveTypeText": "装修申请",
              "appApproveParam": "{\"项目名称\":\"一碑-科技产业园\",\"装修负责人\":\"1\",\"区域名称\":\"一碑-无锡区域\",\"装修起止日期\":\"2024/08/01~2024/08/02\",\"联系方式\":\"13805548861\",\"施工单位\":\"13805548861\",\"灭火器应配备\":0,\"审核说明\":\"1\",\"业主性质\":\"\",\"装修编码\":\"202408011759742\",\"请求人\":\"叶凯\",\"联系电话\":\"13805548861\",\"施工内容\":\"1\",\"施工人员数量\":1,\"发证日期\":\"2024-08-01\",\"装修房间\":\"一碑-科技产业园-1-1单元-102\",\"装修地址\":\"一碑-科技产业园-A院区-1-1-102\",\"审核结果\":\"审核通过\",\"防火负责人\":\"1\",\"装修类型\":\"\"}",
              "approveLaunchDate": "2024-09-29 11:23:58",
              "currentAuditFlag": "Node01-7a7a792b-f24f-4b37-861b-1977e6478945",
              "tenantId": "389",
              "pcApproveParam": "{\"项目名称\":\"一碑-科技产业园\",\"装修负责人\":\"1\",\"区域名称\":\"一碑-无锡区域\",\"装修起止日期\":\"2024/08/01~2024/08/02\",\"联系方式\":\"13805548861\",\"施工单位\":\"13805548861\",\"灭火器应配备\":0,\"审核说明\":\"1\",\"业主性质\":\"\",\"装修编码\":\"202408011759742\",\"请求人\":\"叶凯\",\"联系电话\":\"13805548861\",\"施工内容\":\"1\",\"施工人员数量\":1,\"发证日期\":\"2024-08-01\",\"装修房间\":\"一碑-科技产业园-1-1单元-102\",\"装修地址\":\"一碑-科技产业园-A院区-1-1-102\",\"审核结果\":\"审核通过\",\"防火负责人\":\"1\",\"装修类型\":\"\"}",
              "doneOrNotDone": 1,
              "processType": "内部模型",
              "approveStateText": "审批中",
              "approveState": "0",
              "approveCompleteDate": "",
              "approveSummaryArr": [],
              "newApproveParam": {
                  "项目名称": "一碑-科技产业园",
                  "装修负责人": "1",
                  "区域名称": "一碑-无锡区域",
                  "装修起止日期": "2024/08/01~2024/08/02",
                  "联系方式": "13805548861",
                  "施工单位": "13805548861",
                  "灭火器应配备": 0,
                  "审核说明": "1",
                  "业主性质": "",
                  "装修编码": "202408011759742",
                  "请求人": "叶凯",
                  "联系电话": "13805548861",
                  "施工内容": "1",
                  "施工人员数量": 1,
                  "发证日期": "2024-08-01",
                  "装修房间": "一碑-科技产业园-1-1单元-102",
                  "装修地址": "一碑-科技产业园-A院区-1-1-102",
                  "审核结果": "审核通过",
                  "防火负责人": "1",
                  "装修类型": ""
              },
              "contractKeyArrdata": true
          },
          {
              "apvFlagText": "待审核 ",
              "approveType": "Decoration_Review",
              "approveLaunchUserName": "mob",
              "currentApproveNode": "Node01",
              "approveLaunchUserId": "2092742",
              "apvFlag": "0",
              "approveParam": "{\"launchApproveSystem\":{\"code\":\"Decoration_Review\",\"name\":\"装修审核\"},\"callBackUrl\":\"https://portal.wuyeface.com/decorationManage/decoration/approvalDecorationCallBack\",\"attachApplyList\":[],\"attachList\":[],\"taskNodeFlowVar\":{\"decorationType\":\"2771365\"}}",
              "actTaskId": "1890196",
              "currentApproveNodeText": "一级审批",
              "approveTitle": "mob发起的装修申请",
              "auditItemId": "202409291727579938215",
              "fkId": "1581",
              "chooseType": 1,
              "approveTypeText": "装修申请",
              "appApproveParam": "{\"附件\":[],\"项目名称\":\"一碑-科技产业园\",\"装修负责人\":\"张三\",\"区域名称\":\"一碑-无锡区域\",\"装修起止日期\":\"2024/09/29~2024/10/04\",\"联系方式\":\"15877766554\",\"施工单位\":\"测试单位\",\"灭火器应配备\":1,\"业主性质\":\"\",\"装修编码\":\"202409291110768\",\"请求人\":\"杨建周\",\"联系电话\":\"15877766554\",\"施工内容\":\"测试审核按钮\",\"施工人员数量\":1,\"发证日期\":\"2024-09-29\",\"装修房间\":\"一碑-科技产业园-1-1单元-101\",\"装修地址\":\"一碑-科技产业园-A院区-1-1-101\",\"审核结果\":\"审核通过\",\"防火负责人\":\"张三\",\"装修类型\":\"\"}",
              "approveLaunchDate": "2024-09-29 11:18:58",
              "currentAuditFlag": "Node01-89c67d9d-0e17-42cd-a575-4eaa07cf556d",
              "tenantId": "389",
              "pcApproveParam": "{\"附件\":[],\"项目名称\":\"一碑-科技产业园\",\"装修负责人\":\"张三\",\"区域名称\":\"一碑-无锡区域\",\"装修起止日期\":\"2024/09/29~2024/10/04\",\"联系方式\":\"15877766554\",\"施工单位\":\"测试单位\",\"灭火器应配备\":1,\"业主性质\":\"\",\"装修编码\":\"202409291110768\",\"请求人\":\"杨建周\",\"联系电话\":\"15877766554\",\"施工内容\":\"测试审核按钮\",\"施工人员数量\":1,\"发证日期\":\"2024-09-29\",\"装修房间\":\"一碑-科技产业园-1-1单元-101\",\"装修地址\":\"一碑-科技产业园-A院区-1-1-101\",\"审核结果\":\"审核通过\",\"防火负责人\":\"张三\",\"装修类型\":\"\"}",
              "doneOrNotDone": 1,
              "processType": "内部模型",
              "approveStateText": "审批中",
              "approveState": "0",
              "approveCompleteDate": "",
              "approveSummaryArr": [],
              "newApproveParam": {
                  "附件": [],
                  "项目名称": "一碑-科技产业园",
                  "装修负责人": "张三",
                  "区域名称": "一碑-无锡区域",
                  "装修起止日期": "2024/09/29~2024/10/04",
                  "联系方式": "15877766554",
                  "施工单位": "测试单位",
                  "灭火器应配备": 1,
                  "业主性质": "",
                  "装修编码": "202409291110768",
                  "请求人": "杨建周",
                  "联系电话": "15877766554",
                  "施工内容": "测试审核按钮",
                  "施工人员数量": 1,
                  "发证日期": "2024-09-29",
                  "装修房间": "一碑-科技产业园-1-1单元-101",
                  "装修地址": "一碑-科技产业园-A院区-1-1-101",
                  "审核结果": "审核通过",
                  "防火负责人": "张三",
                  "装修类型": ""
              },
              "contractKeyArrdata": true
          }
      ]
      // this.listData = this.handleData(listData)
      console.log('this.listData===', this.listData.length, typeof(this.listData))

      if (pageIndex != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = 'nomore'
        return
      }
      if (pageIndex == 1) {
        // 滚动到顶部
        this.listData = []
        this.pageForm.total = 0
        uni.pageScrollTo({ scrollTop: 0 })
      }

      this.pageForm.loadMore = 'loading'
      this.pageForm.current = pageIndex
      let params = {
        header: {
          'x-userId-header': this.userInfo.userId,
          'x-companyid-header': this.searchForm.companyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          pageIndex,
          pageSize: this.pageForm.size,
          ...this.searchForm,
          approveUserId: this.userInfo.userId,
          companyId: this.searchForm.companyId,
          // 测试参数
          // approveUserId: 2082395,
          // companyId: 389,
        },
        hideLoading: true
      }
      const res = await getApproveListByAuditUserId(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })
      console.log('res111===', res)
      let data = res?.data?.records || []
      data = this.handleData(data)
      this.listData = pageIndex == 1 ? data : this.listData.concat(data)
      this.pageForm.total = res?.data?.total || 0
    },
    //处理数据
    handleData(initData) {
      if (initData.length > 0) {
        initData.forEach((item,index) => {
          if(item.appApproveParam!=undefined && item.appApproveParam){
            // item.newApproveParam=JSON.parse(item.appApproveParam)
            if(this.searchForm.companyId == 282) {
              let appApproveParam = JSON.parse(item.appApproveParam)
              for (var key in appApproveParam) {
                if(key == 'NO') {
                  item.NO = appApproveParam[key]
                }else if(key == 'projectName') {
                  item.projectName = appApproveParam[key]
                }else if(key == 'constructionTeam') {
                  item.constructionTeam = appApproveParam[key]
                }else if(key == 'costAttributionUnit') {
                  item.costAttributionUnit = appApproveParam[key]
                }
              }
            }

            let json1 = JSON.parse(item.appApproveParam)
            let obj = {};
            console.log("json1", json1);
            for (var key in json1) {
              if (json1[key].constructor == Array) {
                obj[key] = json1[key];
              } else {
                if (key == "ckeckDetails") {
                  let obj1 = {}
                  for (var key1 in json1[key]) {
                    if (key1 == '考核详情') {
                      item.khinfor2 = JSON.parse(json1[key][key1])
                    } else {
                      obj1[key1] = json1[key][key1]
                    }
                  }
                  item.khinfor = obj1
                } else {
                  obj[key] = json1[key];
                }
              }
            }
            item.newApproveParam = obj
          }
          if(item.approveSummary){
            if(item.approveSummary.includes(';')){
              item.approveSummaryArr = item.approveSummary.split(';');
            }else{
              item.approveSummaryArr = item.approveSummary.split(',');
            }
          }else{
            item.approveSummaryArr = [];
          }

          if (this.otherArr.indexOf(item.approveType) > -1) {//合同
            item.contractKeyArrdata = false
          }else{
            item.contractKeyArrdata = true
          }
        });
      }
      return initData;
    },
    // 切换tab
    tabChange(obj) {
      this.currentTab = obj.index
      console.log('index==', obj.index, this.currentTab)
      this.listData = []
      this.searchData()
    },
    goPage() {
      uni.navigateTo({
        url: '/pages-approve/approveDetail'
      })
    },
    // 确定开始时间
    confirmStartTime(obj) {
      this.searchForm.tjTimeStart = dayjs(obj.value).format('YYYY-MM-DD')
      this.showStartTime = false
    },
    // 确定结束时间
    confirmEndTime(obj) {
      this.searchForm.tjTimeEnd = dayjs(obj.value).format('YYYY-MM-DD')
      this.showEndTime = false
    },
    // 获取抄送我列表
    async getApproveListByCopyUserId(isRefresh) {
      // this.getApproveListByAuditUserIdCount()
      // if(this.hasMoreData) return
      // if(this.pageForm.pages <= this.pageForm.current){
      //   this.pageForm.loadMore = 'nomore'
      //   return
      // }
      if (this.pageForm.current != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = 'nomore'
        return
      }
      if (this.pageForm.current == 1) {
        // 滚动到顶部
        this.listData = []
        this.pageForm.total = 0
        uni.pageScrollTo({ scrollTop: 0 })
      }
      let params = {
        header: {
          'x-userId-header': this.userInfo.userId,
          'x-companyid-header': this.searchForm.companyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          copyUserId: this.userInfo.userId,
          companyId: this.searchForm.companyId,
          // copyUserId: 2082395,  // 测试用
          // companyId: 389,
          pageIndex: this.pageForm.current,
          pageSize: this.pageForm.size,
          tjTimeStart: this.searchForm.tjTimeStart,
          tjTimeEnd: this.searchForm.tjTimeEnd,
          timeConditionType: 4,
          keyword: this.searchForm.keyword,
        },
        hideLoading: true
      }
      this.pageForm.loadMore = 'loading'
      let res = await getApproveListByCopyUserId(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })
      if (res.status == 200) {
          let data = res.data.records
          data = this.handleData(data)
          this.listData = this.listData.concat(data)
          this.pageForm.pages = res.data.pages
          this.pageForm.total = res.data.total
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
    },

    // 获取我的发起列表
    async getApproveListByLaunchUserId(isRefresh) {
      if (this.pageForm.current != 1 && this.isLastPage) {
        // 最后一页
        this.pageForm.loadMore = 'nomore'
        return
      }
      if (this.pageForm.current == 1) {
        // 滚动到顶部
        this.listData = []
        this.pageForm.total = 0
        uni.pageScrollTo({ scrollTop: 0 })
      }
      let params = {
        header: {
          'x-userId-header': this.userInfo.userId,
          'x-companyid-header': this.searchForm.companyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          launchUserId: this.userInfo.userId,
          companyId: this.searchForm.companyId,
          // launchUserId: 2082395,  // 测试用
          // companyId: 389,
          pageIndex: this.pageForm.current,
          pageSize: this.pageForm.size,
          tjTimeStart: this.searchForm.tjTimeStart,
          tjTimeEnd: this.searchForm.tjTimeEnd,
          timeConditionType: 4,
          keyword: this.searchForm.keyword,
        },
        hideLoading: true
      }
      this.pageForm.loadMore = 'loading'

      let res = await getApproveListByLaunchUserId(params).finally(() => {
        uni.stopPullDownRefresh()
        this.pageForm.loadMore = 'nomore'
      })
      if (res.status == 200) {
        let data = res.data.records
        data = this.handleData(data)
        this.listData = this.listData.concat(data)
        this.pageForm.pages = res.data.pages
        this.pageForm.total = res.data.total
      } else {
        uni.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-panel {
    padding-bottom: 10px;
    background-color: #F9F9F9;
    min-height: 100vh;
    box-sizing: border-box;
    /* font-family: "PingFang SC"; */
  }
  .d_flex {
    display: flex;
  }

  .page-time {
    display: flex;
    flex-direction:row;
    position: relative;
    background-color: white;
    padding: 20px 16px;
    border-bottom: 1px solid #ddd;
    font-size: 28rpx;
    color: #999;
    .startime {
      display: flex;
      width: 60%;
      position: relative;
    }
    .startime::before {
      content: '';
      position: absolute;
      right: 0;
      top: 60%;
      transform: translate(-50%, -50%);
      width: 1px;
      height: 30px;
      background-color: #ddd;
    }
    .endtime {
      width: 40%;
      padding-left: 60rpx;
    }
  }
  .page-search {
    background: #fff;
    padding: 20rpx;
  }
</style>
