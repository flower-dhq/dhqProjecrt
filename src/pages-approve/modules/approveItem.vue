<template>
  <view style="background-color: #f3f5f9;">
    <view v-for="(item, index) in listData" :key="index" class="data-list" @click="clickBase(item)">
      <view class="list-item title-flex">
        <text class="data-address">{{item.approveTitle}}</text>
        <text class="data-time">{{formTime(item.approveLaunchDate)}}</text>
      </view>
      <!-- 信息变更 -->
      <template v-if="item.approveType == 'informatationChange'">
        <view class="list-item">变更类型：{{item.approveTypeText}}</view>
      </template>
      <!-- 翔顺单独显示 其他客户默认 -->
      <template v-if="item.contractKeyArrdata && item.newApproveParam && userCompanyId != 282" >
        <view class="text-mb" v-for="(i, indexs) in item.newApproveParam" :key="indexs" v-if="indexs != '上传附件'">{{indexs}}: {{i}}</view>
      </template>
      <template v-if="userCompanyId == 282">
        <view class="mt-10">
          <view class="mb-4">NO：{{ item.NO }}</view>
          <view class="mb-4">工程名称：{{ item.projectName }}</view>
          <view class="mb-4">班组：{{ item.constructionTeam }}</view>
          <view class="mb-4">费用责任单位：{{ item.costAttributionUnit }}</view>
        </view>
      </template>
      <template v-if="item.khinfor">
        <view class="text-mb">供方负责人：{{ item.khinfor['供方负责人'] }}</view>
        <view class="text-mb">我方负责人：{{ item.khinfor['我方负责人'] }}</view>
      </template>
      <template v-if="item.khinfor2">
        <view class="text-mb" v-for="(item, index) in item.khinfor2" :key="index">
          {{ item.title }}：{{ item.option }} ({{ item.score }})
        </view>
      </template>
      <template v-if="item.khinfor">
        <view class="text-mb">特别说明：{{ item.khinfor['特别说明'] }}</view>
        <view class="text-mb">违约记录：{{ item.khinfor['违约记录'] }}</view>
      </template>
      <!-- 摘要 -->
      <!-- <view class="list-item" v-for="(approveSummary,idx) in item.approveSummaryArr" :key="idx">{{approveSummary}}</view> -->
      <!-- 非正常关闭 -->
      <view class="state" :class="item.approveState == '1' ? 'stateGreen' : 'stateOrange'">{{item.approveStateText}}</view>
      <!-- 同意 驳回 暂时屏蔽 -->
      <!-- <view class="item-line"  v-if="item.doneOrNotDone == 1 && item.approveState == '0'"></view>
      <view v-if="item.doneOrNotDone == 1">
        <view v-if="item.approveState == '0'" style="width: 100%;display: flex;">
          <van-button type="primary" style="background: #fff;border: none;color: #333;width: 49%;border-right: 1px solid #e5e5e5;" @click.stop="goSubmitPage(item, '2')">驳回</van-button>
          <van-button style="background: #fff;border: none;color: #2761ff;width: 50%;" @click.stop="goSubmitPage(item, '1')">同意</van-button>
        </view>
      </view> -->
    </view>
  </view>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    listData: {
      type: Array,
      default: () => {
				return []
			}
    },
    state: {
      type: String,
      default: ""
    }
  },
  created() {},
  data() {
    let { O_USER_INFO } = this.$constant
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
    return {
      approveUserId : userInfo.userId,
      userCompanyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
      dataList: [],
      contractKeyArrdata:false,
      typeStatus: '', //代办或者已办
      caohejing: ['chjClimbingHigh', 'chjFireWork', 'chjConfinedSpace', 'chjSprayTask', 'chjTmpElectricity', 'chjWorkContact'],
      hasFee: [ // 有费项
        "kfAccessCard", // 门禁卡
        'kfTenantNameplate', // 租户铭牌申请
        'kfDisplayScreen', // 显示屏申请
        'kfRenovation', // 二次装修
        'kfCommunicationBusiness', // 通讯业务
        'kfDecorationRestoration', // 装修复原
        'kfCustomerDemands', // 客户诉求
        'kfSporadicCharges' // 零星收费

      ],
      noFee: [ // 不含费项的
        'kfCheckInInspect', // 入住验收
        'kfCheckInApply', // 入住申请
        'kfRecoveryOffer', // 复原报价
        'kfCustomerComplaints', // 客户投诉
        'kfRefundOfDeposit' // 押金退还
      ],
      hasEdit: [
        'kfRentWithDraw' // 退租
      ],
      // kfRefundOfDeposit, cwContractTZ  cwContractAdd 车位, fwContractAdd 房屋租赁  ycContractAdd //有偿服务
      //  fwContractChange  房屋合同变更
      fwKeyArr: ["fwContractAdd", "fwContractChange", "fwContractTZ"],
      cwKeyArr: ["cwContractAdd", "cwContractChange", "cwContractTZ", "cwContractDelay"],
      ycKeyArr: ["ycContractAdd", "ycContractChange", "ycContractTZ","ycContractAdd_0", "ycContractAdd_1"],
      // 幸福基业
      gonggaoKeyArr:['advertisingApplication','GG-FGS','GG-PROJECT'], //公告（集团级,分公司级,项目级）
      queKeyArr:['WJDC-COMPANY','WJDC-AREA-MBKW','WJDC-AREA-MBKN','WJDC-PROJECT'],   // 问卷调查申请   集团级,分公司级-模板库外,分公司级-模板库内,项目级
      msgKeyArr:['QFTZ-COMPANY','QFTZ-AREA-MBKW','QFTZ-AREA-MBKN','QFTZ-PROJECT-MBKW','QFTZ-PROJECT-MBKN'],    // 群发通知 集团级,分公司级-模板库外,分公司级-模板库内,项目级-模板库外,项目级-模板库内
      tssqKeyArr:['TSSQ-950','TSSQ-NOT-950'], // 投诉申请(来源950,非950)
      typeChangeKeyArr:['LXTZ-950','LXTZ-NOT-950'], // 类型变更(来源950,非950)
      notNormalCloseKeyArr:['notNormalCloseApproval','FZCGB-NOT-950'],  //  非正常关闭(来源950,非950)
      zuofeiKeyArr:['ZF-950','ZF-NOT-950'],    // 作废  来源950，非950
      contractKeyArr:['fwLeasingContractAdd','kfCardApplication','kfBankTransfer','kfKeyReveive','fwRuisihCancellationAgreement','fwRuishApplication','kfMeetingReserve',
              'kfApartmentHousingReserve','kfCustomerModify','fwLeaseIntent','fwLeaseIntentMoneyRefund','fwLeaseInitiating','testInside','kfAskForLeave','crmOrderPause'],//共享一个详情页流程
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
    };
  },
  watch: {
    listData: {
      handler: function(val, oldVal) {
        // this.handleData();
        console.log('val===', val, this.listData)
      },
      deep: true
    },
    state: {
      handler: function(val, oldVal) {
        this.typeStatus = val;
      },
      deep: true
    }
  },
  methods: {
    isChj(flag) {
      return this.caohejing.includes(flag)
    },
    handleData() {
      //处理数据
      var self = this;
      // if (this.listData.length > 0) {
      //   this.listData.forEach(item => {});
      // }
      console.log('进来===', self.listData)
      if (self.listData.length > 0) {
        self.listData.forEach((item,index) => {
          if(item.appApproveParam!=undefined && item.appApproveParam){
            // item.newApproveParam=JSON.parse(item.appApproveParam)
            if(this.userCompanyId == 282) {
              let appApproveParam = JSON.parse(item.appApproveParam)
              console.log('appApproveParam===', appApproveParam)
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
          if (self.otherArr.indexOf(item.approveType) > -1) {//合同
            item.contractKeyArrdata = false
          }else{
            item.contractKeyArrdata = true
          }
        });
      }
      this.dataList = this.listData;
      console.log('this.dataList1111111=====', this.listData)
      console.log('this.dataList22222222=====', this.dataList)
    },
    formTime(time) {
      if (time != '') {
        var newTime = time.split(' ')[0];
        return newTime
      }

    },
    clickBase(item) {
      let path = '/approveDetail';
      let query = {
        auditItemId: item.auditItemId,
        doneOrNotDone: item.doneOrNotDone,
        actTaskId: item.actTaskId,
        state: item.state,
        processKey: item.approveType,
        serialNumber: item.fkId
      }
      if(this.notNormalCloseKeyArr.includes(item.approveType) || this.zuofeiKeyArr.includes(item.approveType) || this.typeChangeKeyArr.includes(item.approveType) || this.tssqKeyArr.includes(item.approveType)){
        if(item.approveParam){
          let approveParam = JSON.parse(item.approveParam);
          if(approveParam.quesTaskId){
            query.quesTaskId = approveParam.quesTaskId;
          }
        }
      }

      uni.navigateTo({
        url: `/pages-approve/approveDetail?auditItemId=${item.auditItemId}&doneOrNotDone=${item.doneOrNotDone}&actTaskId=${item.actTaskId}&processKey=${item.approveType}&serialNumber=${item.fkId}`
      })
      // this.$router.push({
      //   path: path,
      //   query
      // })

      // ?auditItemId=202409291727580238192&doneOrNotDone=1&actTaskId=1890264&processKey=Decoration_Review&serialNumber=1582
    },
    goSubmitPage(item, type) {
      let query = {}
      // 1 同意  2 拒绝
      query = {
        type,
        approveItemId: item.auditItemId,
        actTaskId: item.actTaskId, //任务ID
        approveUserId: this.approveUserId, // 审批任务的代办人ID
        apvFlag: type, //审批结果(1:通过,2:驳回)
      }

      // uni.navigateTo({
      //   path: '/approveDetailSubmit',
      //   query
      // })
    },

  }
};

</script>
<style scoped>
.title-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
}

.title-flex .title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}

.title-flex .title .title-icon {
  width: 16px;
  height: 16px;
  margin-left: 5px;
}

.title-flex .title .title-icon image {
  width: 100%;
  height: 100%;
}

.title-flex .title .title-icon .iconfont {
}
.data-list {
  margin-top: 10px;
  background: #FFFFFF;
  padding: 10rpx 26rpx 0px;
  display: flex;
  flex-direction: column;
  list-style: none;
  border-bottom: 1px solid #e8eaec;
  color: #333;
}
.list-item{
  margin-top: 5px;
}
.data-address {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  float: left;
  font-size: 30rpx;
  font-weight: bold;
  /* width: calc(100% - px); */
  flex: 1;
}

.data-time{
  width: 180rpx;
  color:#ccc;
}
.state{
  margin-top:10px;
  margin-bottom:10px;
}
.stateOrange {
  color: #ff9900;
  /* background-color: #fcf6f2; */
}

.stateGreen {
  color: #19be6b;
  /* background-color: #eef8f6; */
}

.div_item_detail {
  display: flex;
  flex-direction: row-reverse;
}

.item-line {
  width: 106%;
  height: 1px;
  background: #e5e5e5;
  margin-left: -10px;
}

.mb-4 {
  margin-bottom: 4px;
}
.mt-10 {
  margin-top: 10px;
}
.text-mb {
  color: #666;
  margin-bottom: 14rpx;
}

</style>
