<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="detail-body">
      <!-- 基础信息 -->
      <view class="baseInfo" v-if="visible">
        <view class="section">
          <view class="box-item">
            <view class="title">基本信息</view>
            <view class="detail-item">
              <text class="detail-label">消息标题：</text>
              <text class="detail-val">{{ approveData.taskTitle }}</text>
            </view>
            <!-- 审批 -->
            <template>
              <view class="detail-item">
                <text class="detail-label">消息类型：</text>
                <text class="detail-val">{{ approveData.noticeTypeName }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">创建时间：</text>
                <text class="detail-val">{{ approveData.createdData }}</text>
              </view>
            </template>
          </view>
        </view>
        <view class="apply-item">
          <view
            class="apply-p"
            style="
              float: right;
              color: #2760ff;
              cursor: pointer;
              margin-top: 10px;
              margin-right: 5px;
            "
            v-if="formUrl"
            @click="applydetails"
          >
            查看更多
          </view>

          <!-- 除翔顺 其他都显示默认表单信息 -->
          <view class="section" >
            <view class="box-item">
              <view class="header-line">
                <view class="lineleft"></view>
                <view class="name">表单信息</view>
              </view>
              <view class="title_line"></view>
              <view
                class="detail-item"
                v-for="(item, index) in PCInformation"
                :key="index"
                v-if="PCInformation"
              >
                <text class="detail-label">{{ index }} :</text>
                <text class="detail-val">{{ item }}</text>
              </view>
            </view>
          </view>
          <view v-if="!PCInformation" class="section">暂无数据</view>
        </view>
      </view>

    </view>
  </view>
</template>

<script type="text/ecmascript-6">
import { getPendingTaskById, updateReadingStatus } from '@/service/datawarehouse';
export default {
  name: "",
  data() {
    let { O_USER_INFO } = this.$constant
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
    return {
      userCompanyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
      bhShow: false,
      tyShow: false,
      approveContent: "",
      khinfor: null,
      khinfor2: null,
      newFiles: [[], [], [], []],
      attachList: [],
      attachApplyList: [],
      articleShow: false,
      getFlowNodemodal: false,
      isPDF: false,
      getFlowNodedata: [
          // {
          //   "conditionExpression":0,
          //   "flowName":"1233"
          // },
          // {
          //   "conditionExpression":1,
          //   "flowName":"12332345"
          // }
      ],
      getFlowNodevalue: "",
      tabName: "baseInfo",
      url: "/landcrm/rest/uploadFileInfo/uploadMutiFile",
      // havePass: require('@/static/theme-default/approve/havePass.png'),
      // haveRejected: require('@/static/theme-default/approve/haveRejected.png'),
      data: {},
      fileList: [], // 基础信息的附件
      getData: {},
      jimaoData: {},
      upLoadData: [],
      tipData: [], //备注
      departmentName: [],
      uploadFiles: [],
      actTaskId: '',
      operateDate: {},
      comments: "", //备注内容
      num: "",
      isChoose: false, //图片放大缩小类的添加
      addStatus: false, //备注里的添加显示状态
      userId: userInfo.userId,
      doneOrNotDone: "",
      flag: true,
      type: "", //代办或已办
      approveParam: {},
      processDetail: {}, // 合同
      processKey: '',
      baseMessage: {},
      approvalMessage: {}, // 非正常关闭
      notNormalCloseApprovalInfo: {}, // 非正常关闭
      articleMessage: {}, // 公告
      informatationChangeMessage: {}, // 信息变更
      contractList: [], // 合同列表
      attachmentList: [], // 附件列表
      // 图片预览
      showPreview: false,
      previewUrl: "",
      PCInformation: [],
      examineDetail: "",
      formUrl: "",
      PCInformationnew: [],
      contractAttach: {},
      pdfContractAttach: {},
      tenantId: "",
      modelKey: "",
      currentNode: "",

      approveData: {},
      approveItemId: '',

      resColumns: [
        {
          title: "工单编号",
          key: "serialNumber",
          align: "center",
          width: 180,
          render: (h, params) => {
            const row = params.row;
            return h('view', {}, [
              h('a', {
                style: {
                  color:'#2d8cf0',
                },
                on: {
                  click: () => {
                    try {
                      EbeiPlugins.openWebViewPage('dist_custom_order', params.row.jumpLink)
                    } catch (e) {}
                  }
                },
              }, params.row.serialNumber)
            ])
          }
        },
        {
          title: "施工班组",
          key: "maintainUnit",
          align: "center",
          width: 200,
        },
        {
          title: "人工费用（元）",
          key: "artificialCost",
          align: "center",
          width: 100
        },
        {
          title: "运输费用（元）",
          key: "transportCost",
          align: "center",
          width: 100
        },
        {
          title: "机械费用（元）",
          key: "machineCost",
          align: "center",
          width: 100
        },
        {
          title: "其他费用（元）",
          key: "otherCost",
          align: "center",
          width: 100
        },
        {
          title: "合计（元）",
          key: "oneTotal",
          align: "center",
          width: 120
        },
      ],
      resultInformation: {
        tableList: []
      },
      fromPage:'',
      createdData:'',
      visible: false,
    }
  },
  components: {},
  onLoad(options) {
    console.log('options===', options)
    this.messageId = options.messageId
    // this.getApproveData()
    this.loadDetail();
    this.updateReadingStatus();
  },
  methods: {
    // 获取审批记录数据
    loadDetail() {
      let params = {
        header: {
          'x-userId-header': this.userId,
          'x-companyid-header': this.userCompanyId,
        },
        data: {
          id: this.messageId,
        },
        hideLoading: false
      }
      getPendingTaskById(params).then(res=>{
        console.log('审批记录===', res)
        this.PCInformation = [];
        this.PCInformationnew = [];
        if (res.status == 200) {
          if(!res.data.formJson){
            uni.redirectTo({ url: `${res.data.jumpLinkH}`})
          }else{
            this.visible = true;
            let json1 = JSON.parse(res.data.formJson)
            let obj = {}
            let paramsdata = {}
            for (var key in json1) {
              if (json1[key].constructor == Array) {
                paramsdata[key] = json1[key];
              } else {
                if (key == "ckeckDetails") {
                  let obj1 = {};
                  for (var key1 in json1[key]) {
                    if (key1 == "考核详情") {
                      this.khinfor2 = JSON.parse(json1[key][key1]);
                    } else {
                      obj1[key1] = json1[key][key1];
                    }
                  }
                  this.khinfor = obj1;
                } else {
                  obj[key] = json1[key];
                }
              }
            }

            this.PCInformation = obj;
            this.approveData = res.data
          }
        }
      })
    },
    updateReadingStatus() {
      let params = {
        header: {
          'x-userId-header': this.userId,
          'x-companyid-header': this.userCompanyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          officeIdList:  [this.messageId]
        },
        hideLoading: true
      }
      updateReadingStatus(params).then(res => {
        if(res.status == 200){
          uni.$emit('nextTask', {
            createdData: ''
          });
        }
      })
    },
    getApproveData() {
      let params = {
        header: {
          'x-userId-header': this.userId,
          'x-companyid-header': this.userCompanyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          approveItemId: this.approveItemId
        },
        hideLoading: true
      }
      console.log('审批params===', params)
      getQueryApproveDetailById(params).then(res=>{
        console.log('审批记录===', res)
        this.PCInformation = [];
        this.PCInformationnew = [];
        if (res.status == 200) {
          let json1 = JSON.parse(res.data.pcApproveParam)
          let obj = {}
          let paramsdata = {}
          for (var key in json1) {
            if (json1[key].constructor == Array) {
              paramsdata[key] = json1[key];
            } else {
              if (key == "ckeckDetails") {
                let obj1 = {};
                for (var key1 in json1[key]) {
                  if (key1 == "考核详情") {
                    this.khinfor2 = JSON.parse(json1[key][key1]);
                  } else {
                    obj1[key1] = json1[key][key1];
                  }
                }
                this.khinfor = obj1;
              } else {
                obj[key] = json1[key];
              }
            }
          }

          // 翔顺结算单信息
          if (this.userCompanyId == 282) {
            this.resultInformation = JSON.parse(res.data.appApproveParam)
            console.log('结算单信息====', this.resultInformation)
          }
          // this.PCInformationnew =paramsdata
          this.PCInformationnew.push({
              data: paramsdata,
          });
          console.log("this.PCInformationnew", this.PCInformationnew);
          this.PCInformation = obj;
          this.approveData = res.data
          if (
            this.approveData.approveParam &&
            this.approveData.approveParam.length > 0 &&
            JSON.parse(this.approveData.approveParam).attachList !=
            undefined &&
            JSON.parse(this.approveData.approveParam).attachList.length > 0
          ) {
            this.attachList = JSON.parse(
              this.approveData.approveParam
            ).attachList.filter(
              (a) => a.attachPath != "" && a.attachPath != null
            );
          } else {
            this.attachList = [];
          }
          if (
            this.approveData.approveParam &&
            this.approveData.approveParam.length > 0 &&
            JSON.parse(this.approveData.approveParam).attachApplyList !=
            undefined &&
            JSON.parse(this.approveData.approveParam).attachApplyList.length > 0
          ) {
            this.attachApplyList = JSON.parse(this.approveData.approveParam).attachApplyList.filter(
              (a) => a.attachPath != "" && a.attachPath != null
            )
          } else {
            this.attachApplyList = []
          }
          console.log("-------------------------");
          console.log(this.approveData.approveParam);

          if (
            this.approveData.approveParam &&
            this.approveData.approveParam.length > 0 &&
            JSON.parse(this.approveData.approveParam).pdfContractAttach !=
            undefined &&
            JSON.parse(this.approveData.approveParam).pdfContractAttach != ""
          ) {
            this.contractAttach = JSON.parse(this.approveData.approveParam).pdfContractAttach
          } else {
            this.contractAttach = {}
          }

          // this.actTaskId = res.data.auditRecordGroupList[0]?.actTaskId
          this.type = res.data.state;

          if (res.data.approveParam && res.data.approveParam != "") {
              // let approveParam = JSON.parse(res.data.approveParam)
              this.approveParam = JSON.parse(res.data.approveParam);
              if (this.approveParam.baseMessage) {
                if (typeof this.approveParam.baseMessage == "string") {
                  this.baseMessage = JSON.parse(this.approveParam.baseMessage);
                } else {
                  this.baseMessage = this.approveParam.baseMessage;
                }
              }

              this.approvalMessage = this.approveParam.approvalMessage || {}; // 非正常关闭
              this.articleMessage = this.approveParam.articleMessage || {}; // 公告
              this.informatationChangeMessage = this.approveParam.informatationChangeMessage || {}; // 信息变更
              if ((this.processKey = "informatationChange")) {
                if (this.informatationChangeMessage.changeFile) {
                  this.fileList = JSON.parse(this.informatationChangeMessage.changeFile)
                }
              }
              if (this.approveParam.projectId && this.approveParam.serialNumber) {
                this.listFormFeeItem(
                  this.approveParam.serialNumber,
                  this.approveParam.projectId
                );
              }
              // 审批节点中第一个节点知道有一个审批过，就不可以撤销
              if (
                  res.data.auditRecordGroup &&
                  res.data.auditRecordGroup.length > 0
              ) {
                  for (let item in res.data.auditRecordGroup) {
                      res.data.auditRecordGroup[item].createDate =
                          res.data.auditRecordGroup[item].createDate.replaceAll(
                              "-",
                              "/"
                          );
                  }
                  res.data.auditRecordGroup.sort(this.sortBy("createDate"));
                  if (res.data.approveState == "0") {
                      if (res.data.auditRecordGroup[0].groupState == "0") {
                          var i = 0;
                          res.data.auditRecordGroup[0].detail.forEach((item) => {
                              if (item.approveFlag == "1") {
                                  i = i + 1;
                              }
                          });
                          if (i == 0) {
                              this.flag = true;
                          } else {
                              this.flag = false;
                          }
                      } else {
                          this.flag = false;
                      }
                  } else {
                      this.flag = true;
                  }
              }
          }
          if (
              this.approveData.approveParam &&
              this.approveData.approveParam.length > 0 &&
              JSON.parse(this.approveData.approveParam).formUrl != undefined &&
              JSON.parse(this.approveData.approveParam).formUrl != ""
          ) {
              // this.formUrl = JSON.parse(this.approveData.approveParam).formUrl + "?fkId=" + this.approveData.fkId
              let openDetail = this.parseUrlCode(
                  JSON.parse(this.approveData.approveParam).formUrl,
                  "openDetail"
              );
              let taskId = JSON.parse(openDetail).NO;
              if (taskId) {
                  if (dd.env.platform !== "notInDingTalk") {
                      //要是在钉钉中的就不显示 ‘查看更多’
                      this.formUrl = "";
                  } else {
                      this.formUrl = taskId;
                  }
              } else {
                  this.formUrl = "";
              }
          } else {
              this.formUrl = "";
          }
          // this.approveData = res.data
        }
      })
    },
    goPage() {
      uni.navigateTo({
        url: '/pages-approve/approveDetail'
      })
    },
    parseUrlCode(url, variable) {
      var query = url.split('?')[1]
      var vars = query.split('&')
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=')
        if (pair[0] == variable) {
          return pair[1]
        }
      }
      return false
    },
    // 设置时间轴时间
    formDate(date) {
      if (date && date != "") {
        let str = "";
        let arr = date.split(" ");
        str += arr[0].match(/\d{2}-\d{2}$/) + " " + arr[1].match(/^\d{2}:\d{2}/);
        return str;
      }
    },
    goSubmitPage(type) {
      console.log('type==', type)
      let query = {}
      // 1 同意  2 拒绝   0 评价
      if (type == '1' || type == '2') {
        query = {
          type,
          approveItemId: this.approveItemId,
          actTaskId: this.actTaskId, //任务ID
          approveUserId: this.userId, // 审批任务的代办人ID
          apvFlag: type, //审批结果(1:通过,2:驳回)
          formData: this.approveData.formData
        }
        uni.navigateTo({
          url: `/pages-approve/approveSubmit?type=${type}&approveItemId=${this.approveItemId}&actTaskId=${this.actTaskId}&approveUserId=${this.userId}&apvFlag=${type}&formData=${this.approveData.formData ? this.approveData.formData : ''}&fromPage=${this.fromPage}&createdData=${this.createdData}`
        })
      }else {
        query = {
          type,
          approveItemId: this.approveItemId,
          actTaskId: this.actTaskId, //任务ID
          approveUserId: this.userId, // 审批任务的代办人ID
          apvFlag: 1, //审批结果(1:通过,2:驳回)
          // approveContent: this.approveContent, //审批内容
        }
        uni.navigateTo({
          url: `/pages-approve/approveSubmit?type=${type}&approveItemId=${this.approveItemId}&actTaskId=${this.actTaskId}&approveUserId=${this.userId}&apvFlag=${type}&fromPage=${this.fromPage}&createdData=${this.createdData}`
        })
      }
    },
    //撤销一个流程
    revokeProcess() {
      var self = this;
      var params = {
        header: {
          'x-userId-header': this.userId,
          'x-companyid-header': this.userCompanyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          approveItemId: self.approveData.auditItemId, // 审批项ID
          //    approveLaunchUserId :localStorage.user_id,  //申请发起人ID
          // approveLaunchUserId :'2052392',//备注人ID
          approveLaunchUserId: this.userId, // 审批任务的代办人ID
        }
      };
      revokeProcess(params).then((res) => {
        if (res.status == 200) {
          uni.showToast({
            title: "操作成功",
            icon: "none"
          })
          uni.navigateBack()
        } else {
          uni.showToast({
            title: res.message,
            icon: "none"
          })
        }
      });
    },
    // 查看
    previewImg(item) {
      let url = item.attachPath || item.filePath;
      let name = item.attachName || item.fileName;
      if (!url) {
        uni.showToast({
          title: "附件地址为空",
          icon: "none"
        })
        return;
      }
      var reg = /\.(png|jpg|gif|jpeg|webp)$/;
      // 打开图片
      if (reg.test(name)) {
        uni.previewImage({
          current: 0,
          urls: [url]
        });
      }else {
        // 打开文件
        this.previewFile(url, name)
      }
    },
    previewFile(url, name) {
      uni.showLoading({title:'加载中'})
      //后端返回的文件地址
      uni.downloadFile({
      // url: item.value, filePath: wx.env.USER_DATA_PATH + '/' + item.name + '.' + item.value.split('.')[item.value.split('.').length - 1],
      url: url,
      filePath: wx.env.USER_DATA_PATH + '/' + name + '.' + name.split('.')[name.split('.').length - 1],
      success: function (res) {
        if (res.statusCode === 200) {
          uni.openDocument({
          showMenu: true,
          filePath: res.filePath,
          success: function (res) {
            console.log(res,'打开文件成功')
          },
          fail: (err) => {
            uni.showToast({title:'打开文件失败请重试',icon:'none'})}})
          }
        else {
          uni.showToast({title:'打开文件失败请重试',icon:'none'})
        }
        uni.hideLoading()
      },fail:(err) => {
        uni.hideLoading()
        uni.showToast({title: '加载失败请重试',icon:"none"})}
        })
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-panel {
    padding-bottom: 10px;
    background-color: #f3f5f9;
    min-height: 100vh;
    box-sizing: border-box;
    font-family: "PingFang SC";
  }
  .attachment {
    display: inline-block;
    position: relative;
  }

  .attachment image {
    transform: scale(1);
    /*图片原始大小1倍*/
    transition: all ease 0.5s;
    /*图片放大所用时间*/
  }

  .attachment image.active {
    transform: scale(3);
    /*图片需要放大3倍*/
    position: absolute;
    /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
    z-index: 100;
  }

  .detail-body {
    padding: 5px 0px;
  }

  .baseInfo {
    height: 100%;
    background: #f3f3f3;
  }

  .title {
    font-size: 16px;
    line-height: 30px;
    font-weight: bold;
    padding: 5px 0px;
  }

  .section {
    /* background: #fff; */
    padding: 5px 10px;
    margin-bottom: 10px;
  }

  .line-list {
    background: #ffffff;
    border-radius: 4px;
    padding: 28px 0;
  }

  .line-list .liItem {
    display: flex;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    color: #222222;
    font-size: 14px;
  }

  .inp {
    /* position:relative;
          left:10px; */
    float: left !important;
    width: 93%;
  }

  .inp ::v-deep .ivu-input {
    border-radius: 0px 3px 0px 0px !important;
    border-left-style: none !important;
  }

  .line-date {
    color: #6a6a6a;
    font-size: 24rpx;
    padding: 0 0 5px;
    text-align: right;
    width: 108px;
  }

  .dot-line {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2px 12px 0;
  }

  .dot-large {
    height: 15px;
    width: 15px;
    background: url("@/static/theme-default/approve/t-icon.png") no-repeat;
    background-size: 100% 100%;
  }

  .dot-large view {
    text-align: center;
    color: #ffffff;
    line-height: 8px;
    font-size: 24rpx;
  }

  .dot-red {
    height: 15px;
    width: 15px;
    background: url("@/static/theme-default/approve/f-icon.png") no-repeat;
    background-size: 100% 100%;
    margin: 0;
  }

  .dot-red view {
    text-align: center;
    color: #ffffff;
    line-height: 9px;
    font-size: 24rpx;
  }

  .remark {
    height: 15px;
    width: 15px;
    background: url("@/static/theme-default/approve/pl-icon.png") no-repeat;
    background-size: 100% 100%;
    margin: 0;
  }

  .dot-gray {
    height: 15px;
    width: 15px;
    background: url("@/static/theme-default/approve/t-icon.png") no-repeat;
    background-size: 100% 100%;
    margin: 0;
  }

  .dot-gray view {
    text-align: center;
    color: #ffffff;
    line-height: 9px;
    font-size: 24rpx;
  }

  .dot {
    height: 15px;
    width: 15px;
    background: #faad13;
    border-radius: 15px;
    border: #ececec solid 2px;
    margin: 0;
  }

  .dot view {
    text-align: center;
    color: #ffffff;
    line-height: 8px;
    font-size: 24rpx;
  }

  .line-hidden {
    width: 1px;
    background-color: #ffffff;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
  }

  .line {
    width: 1px;
    background-color: #dddddd;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
  }

  .line_desc {
    color: rgba(0, 0, 0, 0.5);
    font-size: 24rpx;
    padding: 0 5px;
  }

  .line-state2 {
    color: rgba(0, 0, 0, 0.8);
    font-size: 28rpx;
    padding: 0 5px;
    display: inline-block;
  }

  .info-box {
    padding: 0 0 10px 0;
    width: calc(100% - 30px);
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.1) !important;
  }

  .line-list view:last-child .info-box {
    border-bottom: none;
  }

  .drawer-time {
    margin-bottom: 10px;
    padding: 5px 10px;
    /* background: #e8eaec; */
  }

  /* 操作按钮 */
  .blue_link {
    color: #2760ff;
    display: inline-block;
    margin-right: 3px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
  }

  .blue_link:hover {
    color: #1860ad;
  }

  .drawer-tip ::v-deep .ivu-input-suffix {
    right: 10px;
    top: 5px;
  }

  .addbeizhu {
    height: 32px;
    flex: 1;
    /* background-color: red; */
  }

  .drawer-footer {
    /* height: 50px; */
    width: 100%;
    /* float: left; */
    padding: 10px;
    text-align: center;
    position: fixed;
    bottom: 0px;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 999;
    /* align-content:flex-start; */
    /* display: flex; */
    /* margin-top:50px; */
    /* align-items: flex-end; */
  }

  /* .drawer-footer button {
    color: #fff;
    font-size: 15px;
    float: left;
    width: 100%;
    height: 40px;
    border-radius: 5px;
    background: rgba(0, 74, 179, 1);
  } */

  .inputfile {
    position: absolute;
    /*left:-99999px;*/
    opacity: 0;
    width: 25px;
    height: 32px;
    z-index: 2;
  }

  .detail-item {
    margin-top: 8px;
    display: flex;
  }

  .detail-item .detail-label {
    flex-shrink: 0;
    color: #333;
    /*width: 90px;*/
    /* flex-shrink:none; */
  }

  .detail-item .detail-val {
    flex: 1;
    flex-wrap: wrap;
    color: #333;
  }

  .detail-item .detail-val .img {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }

  .detail-item .detail-val.attachment {
    display: flex;
    align-items: center;
  }

  .detail-item .detail-val.attachment .attachment-item {
    margin-right: 5px;
  }

  .tab {
    display: flex;
    margin-top: 10px;
  }

  .tab span {
    flex: 1;
    text-align: center;
    height: 30px;
    border: solid 1px #dcdcdc;
    margin-left: -1px;
    line-height: 30px;
  }

  .tab text.on {
    background: rgba(129, 211, 248, 1);
    color: #fff;
  }

  .section {
    margin-bottom: 10px;
  }

  .section .section-title {
    margin-bottom: 5px;
  }

  .article-title {
    font-weight: bold;
    text-align: center;
    padding: 10px 0;
  }

  .file-pic {
    width: 60px;
    height: 40px;
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
    border: solid 1px #ccc;
  }

  .file-pic image {
    width: 100%;
    height: 100%;
  }

  .flexImgBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .imgBox {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .imgBox image {
    max-width: 100%;
    max-height: 100%;
  }
  .previewBtn {
    height: 60px;
    text-align: center;
    color: #fff;
    line-height: 60px;
  }
  .titlestd {
    height: 40px;
    min-width: 80px;
    border-top: 1px solid rgb(236, 236, 236);
    border-left: 1px solid rgb(236, 236, 236);
    background-color: rgb(248, 249, 251);
  }
  .titletd {
    height: 30px;
    min-width: 80px;
    border-top: 1px solid rgb(236, 236, 236);
    border-left: 1px solid rgb(236, 236, 236);
  }
  .tr > td {
    border-bottom: 1px solid rgb(236, 236, 236);
  }
  .list-table {
    width: 100%;
    margin-top: 10px;
    overflow-x: scroll;
  }
  ::v-deep .van-dialog__header {
    padding: 10px 0;
  }
  .add-value{
    padding: 5px 0;
  }
  .add-value text{
    line-height: 20px;
  }

  .ht-table, .ht-table td {
    border: 1px solid rgb(223, 223, 223);
    border-collapse: collapse;
  }

  .box-item {
    background: #fff;
    padding: 10px;
    border-radius: 5px;
  }
  .lineleft {
    height: 12px;
    width: 3px;
    position: relative;
    top: 4px;
    left: 3px;
    background-color: #2760ff;
  }
  .header-line {
    display: flex;
    padding-bottom: 6px;
  }
  .header-line .name {
    padding-left: 10px;
    font-weight: bold;
    font-size: 16px;
  }
  .title_line {
    width: 100%;
    height: 1px;
    background: #dfdfdf;
  }

  .line-file {
    padding: 10px;
    background: #f5f5f5;
    margin-top: 10px;
  }

  .dot-flex {
    display: flex;
    justify-content: space-between;
  }

</style>
