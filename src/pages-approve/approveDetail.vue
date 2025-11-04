<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="detail-body">
      <!-- 基础信息 -->
      <view class="baseInfo">
        <view class="section">
          <view class="box-item">
            <view class="title">{{ approveData.approveTitle }}</view>
            <view class="detail-item">
              <text class="detail-label">审批编号：</text>
              <text class="detail-val">{{ approveData.auditItemId }}</text>
            </view>
            <!-- 审批 -->
            <template>
              <view class="detail-item">
                <text class="detail-label">发起人：</text>
                <text class="detail-val">{{ approveData.approveLaunchUserName }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">发起时间：</text>
                <text class="detail-val">{{ approveData.approveLaunchDate }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">流水号：</text>
                <text class="detail-val">{{ approveData.fkId }}</text>
              </view>
            </template>
            <!-- 信息变更 -->
            <!-- <template>
              <view class="detail-item">
                <text class="detail-label">用户姓名：</text>
                <text class="detail-val">{{informatationChangeMessage.userName}}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">联系电话：</text>
                <text class="detail-val">{{informatationChangeMessage.userPhone}}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">用户地址：</text>
                <text class="detail-val">{{baseMessage.address}}</text>
              </view>
            </template> -->
            <!-- 公告 -->
            <template v-if="approveData.approveType == 'advertisingApplication'">
              <view class="detail-item">
                <text class="detail-label">发布区域：</text>
                <text class="detail-val">{{ baseMessage.areaName }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">发布项目:</text>
                <text class="detail-val">{{ baseMessage.projectName }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">发布人员：</text>
                <text class="detail-val">{{ baseMessage.create_name }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">公告标题：</text>
                <text class="detail-val blue_link" @click="showArticle">{{
                  baseMessage.title
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">备注：</text>
                <text class="detail-val">{{ approveParam.remarks }}</text>
              </view>
            </template>
            <!-- 非正常关闭 -->
            <template v-if="approveData.approveType == 'notNormalCloseApproval'">
              <view class="detail-item">
                <text class="detail-label">所属区域：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.areaName
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">所属项目：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.projectName
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">服务请求人：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.contactName
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">联系电话：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.contactPhone
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务类型：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.typeName
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务状态：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.quesTaskStateName
                }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">任务详情：</text>
                <text class="detail-val">{{
                  notNormalCloseApprovalInfo.quesDesc
                }}</text>
              </view>
            </template>
            <view style="position: absolute; z-index: 200; right: 14px; top: 50px">
              <image
                v-if="approveData.approveState == '1'"
                :src="require(`@/static/${THEME_NAME}/approve/havePass.png`)"
                width="70px"
              />
              <image
                v-if="approveData.approveState == '2'"
                :src="require(`@/static/${THEME_NAME}/approve/haveRejected.png`)"
                width="70px"
              />
            </view>
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
          <view class="section" v-if="userCompanyId != 282">
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

          <view class="section" v-if="userCompanyId == 282">
            <view class="box-item">
              <view class="header-line">
                <view class="lineleft"></view>
                <view class="name">结算单信息</view>
              </view>
              <view class="title_line"></view>
              <view class="detail-item">
                <text class="detail-label">NO：</text>
                <text class="detail-val">{{ resultInformation.NO }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">工程名称：</text>
                <text class="detail-val">{{ resultInformation.projectName }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">班组：</text>
                <text class="detail-val">{{ resultInformation.constructionTeam }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">费用责任单位：</text>
                <text class="detail-val">{{ resultInformation.costAttributionUnit }}</text>
              </view>
              <Table class="resTable" ref="resTable" :columns="resColumns" :data="resultInformation.tableList" max-height="200" style="margin-top: 10px;width: 100%;" border></Table>
            </view>
          </view>
        </view>

        <view class="apply-item" v-if="khinfor2">
          <view class="section">
            <view class="box-item">
              <view
                class="detail-item"
                style="
                  font-size: 15px;
                  font-weight: bold;
                  border-bottom: 1px solid #dfdfdf;
                "
              >
                考核信息
              </view>
              <view class="detail-item">供方负责人：{{ khinfor["供方负责人"] }}</view>
              <view class="detail-item">我方负责人：{{ khinfor["我方负责人"] }}</view>
              <view
                class="detail-item"
                v-for="(item, index) in khinfor2"
                :key="index"
              >
                {{ item.title }}：{{ item.option }} ({{ item.score }})
              </view>
              <view class="detail-item">特别说明：{{ khinfor["特别说明"] }}</view>
              <view class="detail-item">违约记录：{{ khinfor["违约记录"] }}</view>
            </view>
          </view>
        </view>

        <view class="apply-item" v-if="contractAttach.attachName">
          <view class="section">
            <view class="box-item">
              <view
                class="detail-item"
                style="
                  font-size: 15px;
                  font-weight: bold;
                  border-bottom: 1px solid #dfdfdf;
                "
              >
                合同文档
              </view>
              <text class="detail-label">点击查看 :</text>
              <text
                class="detail-val"
                style="color: #2760ff; cursor: pointer; margin-top: 10px"
                @click="download"
              >{{ contractAttach.attachName }}</text
              >
            </view>
          </view>
        </view>

        <view class="apply-item" v-if="attachList.length > 0">
          <view class="section">
            <view class="box-item">
              <view class="header-line">
                <view class="lineleft"></view>
                <view class="name">{{ userCompanyId == 165 ? "审批-特定附件" : "表单附件" }}</view>
              </view>
              <view class="title_line"></view>
              <view
                v-for="(item, kvalue) in attachList"
                :key="kvalue"
                style="margin-top: 8px"
              >
                <text class="detail-label">点击查看 :</text>
                <text
                  class="detail-val"
                  style="color: #2760ff; cursor: pointer; margin-top: 10px; margin-left: 10px;"
                  @click="previewImg(item)"
                >{{item.attachName ? item.attachName : '附件' + (kvalue + 1)}}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="apply-item" v-if="attachApplyList.length > 0">
          <view class="section">
            <view
              class="detail-item"
              style="
                font-size: 15px;
                font-weight: bold;
                border-bottom: 1px solid #dfdfdf;
              "
            >
              {{ userCompanyId == 165 ? "审批-附件" : "表单附件" }}
            </view>
            <view
              v-for="(data, kvalue) in attachApplyList"
              :key="kvalue"
              style="margin-top: 8px"
            >
              <text class="detail-label">点击查看 :</text>
              <text
                class="detail-val"
                style="color: #2760ff; cursor: pointer; margin-top: 10px"
                @click="previewImg(data)"
              >{{approveData.attachName ? approveData.attachName : '附件' + (kvalue + 1)}}</text>
            </view>
          </view>
        </view>

        <view
          class="apply-item"
          v-for="(key1, name1) in PCInformationnew"
          :key="name1"
          v-if="PCInformationnew && key1.length != 0 && userCompanyId != 282"
        >
          <view class="section" v-for="(key, name) in key1.data" :key="name">
            <view class="box-item">
              <view class="header-line">
                <view class="lineleft"></view>
                <view class="name">{{ name }}</view>
              </view>
              <view class="title_line"></view>
              <view class="add-value" v-if="false">
                <view v-for="(item, index) in key" :key="index">
                  <text v-for="(i, k) in item" :key="k">{{ k }}：{{i}}<br/></text>
                </view>

              </view>

              <view class="list-table">
                <table style="text-align: center" border="0" cellspacing="0">
                  <tr>
                    <td class="titlestd" v-for="(i, k) in key[0]" :key="k">
                      {{ k }} {{i}}
                    </td>
                    <!-- <td class="titlestd"  v-for="(i, k) in data" :key="k">{{i}}</td> -->
                  </tr>
                </table>
                <table
                  v-for="(data, kvalue) in key"
                  :key="kvalue"
                  style="text-align: center"
                  border="0"
                  cellspacing="0"
                >
                  <tr :class="kvalue == key.length - 1 ? 'tr' : ''">
                    <td class="titletd" v-for="(i, k) in data" :key="k">
                      {{ i }}
                    </td>
                  </tr>
                </table>
              </view>

              <view class="list-table" v-if="false">
                <table
                  class="ht-table"
                  style="text-align: center;width:100%;"
                  cellspacing="0"
                >
                  <tr>
                    <td style="width:50%;">附件名称</td>
                    <td style="width:50%;">附件路径</td>
                  </tr>
                  <tr v-for="(data, kvalue) in key" :key="kvalue">
                    <td style="width:50%;">{{approveData.fullName}}</td>
                    <td style="width:50%;">
                      <image :src="approveData.resPath" @click="downloadHTList(data)" width="50" height="50" style="margin-top: 4px;" />
                    </td>
                  </tr>
                </table>
              </view>
            </view>
          </view>
        </view>

        <!-- 非正常关闭 -->
        <view
          class="section"
          v-if="approveData.approveType == 'notNormalCloseApproval'"
        >
          <view class="detail-item">
            <text class="detail-label">非正常关闭原因：</text>
            <text class="detail-val">{{
              notNormalCloseApprovalInfo.reason
            }}</text>
          </view>
        </view>
        <view class="drawer-time">
          <view class="box-item">
            <view class="header-line">
              <view class="lineleft"></view>
              <view class="name">审批记录</view>
            </view>
            <view class="title_line"></view>
            <view class="line-list">
              <view class="liItem">
                <view class="dot-line">
                  <view
                    :class="approveData.approveState == '3' ? 'dot-gray' : 'dot-large'"
                  >
                  </view>
                  <view
                    :class="approveData.approveState == '3' ? 'line-hidden' : 'line'"
                  ></view>
                </view>
                <view class="info-box">
                  <text class="line-state2">
                    发起人
                    <text v-if="approveData.approveState == '3'">撤回</text>
                  </text>
                  <view class="line_desc">{{ approveData.approveLaunchUserName }}</view>
                </view>
                <view class="line-date">{{ formDate(approveData.approveLaunchDate) }}</view>
              </view>
              <template v-if="approveData.approveState != '3'">
                <view class="liItem" v-for="(item, index) in approveData.auditRecordGroupList" :key="index">
                  <view class="dot-line">
                    <view v-if="item.groupState == '2'" class="dot-red">
                    </view>
                    <view
                      v-else
                      :class="
                        item.groupState == '1' || item.groupState == '3'
                          ? 'dot-large'
                          : item.dataType == '2' ? 'remark'
                          : 'dot'
                      "
                    >
                      <view
                        v-if="item.groupState == '1' || item.groupState == '3'"
                      >
                      </view>
                      <view v-else>{{ item.dataType == '2' ? '' : '...' }}</view>
                    </view>
                    <view
                      :class="
                        index + 1 == approveData.auditRecordGroupList.length
                          ? 'line-hidden'
                          : 'line'
                      "
                    ></view>
                  </view>
                  <view class="info-box">
                    <view v-if="item.dataType == '1'">
                      <view class="dot-flex">
                        <text class="line-state2" v-if="item.groupState == '2'">驳回</text>
                        <text class="line-state2" v-if="item.groupState == '1'">同意</text>
                        <text class="line-state2" v-if="item.groupState == '0'">审批中</text>
                        <view class="line-date">
                          {{ item.groupCreateDate ? formDate(item.groupCreateDate) : formDate(item.createDate) }}
                        </view>
                      </view>
                      <view
                        class="line_desc"
                        v-for="(items, i) in item.detail"
                        :key="i"
                      >
                        <text>{{ items.approveUserName }}({{items.approveFlagText}})</text>
                        <text v-if="items.approveContent && items.approveContent != ''">(</text>
                        <text v-if="items.approveContent">{{ items.approveContent }}</text>
                        <text v-if="items.approveContent && items.approveContent != ''">)</text>
                      </view>
                      <view class="line-file" v-if="item.attachment">
                        <view v-if="item.comments" style="margin-bottom: 8px;">{{ item.comments == '审批附件' ? '' : item.comments}}</view>
                        <view v-for="(fileItem, fileIndex) in JSON.parse(item.attachment)" :key="fileItem.fileId" style="display: flex;">
                          <view style="width: 46px;">附件：</view>
                          <view class="blue_link" style="cursor: pointer;flex: 1;overflow: hidden;white-space: normal;text-overflow: ellipsis;" @click="previewImg(fileItem)">{{ fileItem.fileName }}</view>
                        </view>
                      </view>
                    </view>
                    <view v-if="item.dataType == '2'">
                      <view class="dot-flex">
                        <view>
                          <text class="blue_font">{{ item.commentUserName }}</text>
                          添加了评论
                        </view>
                        <view class="line-date">{{ formDate(item.groupCreateDate) }}</view>
                      </view>
                      <view class="line-file" v-if="item.attachment">
                        <view v-if="item.comments" style="margin-bottom: 8px;">{{ item.comments == '审批附件' ? '' : item.comments}}</view>
                        <view v-for="(fileItem, fileIndex) in JSON.parse(item.attachment)" :key="fileItem.fileId" style="display: flex;">
                          <view>附件：</view>
                          <view class="blue_link" style="cursor: pointer;flex: 1;overflow: hidden;white-space: normal;text-overflow: ellipsis;" @click="previewImg(fileItem)">{{ fileItem.fileName }}</view>
                        </view>
                      </view>
                      <view class="line-file" v-else>
                        {{ item.comments }}
                      </view>
                    </view>
                  </view>
                </view>
              </template>

            </view>
          </view>
        </view>
        <view style="background: #f3f3f3;height: 60px;"></view>
      </view>
      <view class="drawer-footer" v-if="doneOrNotDone == 1 && type == '1' && actTaskId" style="display: flex;justify-content: space-between;">
        <view style="display: flex;align-items: center;margin-left: 20px;" @click="goSubmitPage('0')">
          <u-icon name="chat" color="#2979ff" size="28" style="margin-right: 8px;"/>
          <text style="margin-left: 4px; color: #2979ff;">评论</text>
        </view>
        <view v-if="approveData.approveState == '0'" style="width: 50%;display: flex;padding-right: 20px;">
          <u-button type="primary" style="background: #2761ff;" @click="goSubmitPage('2')">驳回</u-button>
          <!-- @click="executeApprove('1')" -->
          <u-button type="primary" :customStyle="{ marginLeft: '30rpx' }" @click="goSubmitPage('1')">同意</u-button>
        </view>

      </view>
      <view class="drawer-footer" v-else-if="approveData.approveState == '1' || approveData.approveState == '2'" style="display: flex;align-items: center;justify-content: center;">
        <view style="display: flex;align-items: center;margin-left: 20px;" @click="goSubmitPage('0')">
          <u-icon name="chat" color="#2979ff" size="28" style="margin-right: 8px;"/>
          <text style="margin-left: 4px; color: #2979ff;">评论</text>
        </view>
      </view>

      <!-- 只要有一个节点是审批通过的就不可以撤回 -->
      <view class="drawer-footer" v-if="doneOrNotDone == undefined && approveData.approveState == 0 && type == '1'">
        <u-button v-if="flag == true" @click="revokeProcess()">撤销</u-button>
      </view>
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
import { getQueryApproveDetailById, revokeProcess } from '@/service/activiti';
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
      nodeId:'',
    }
  },
  components: {},
  onLoad(options) {
    console.log('options===', options)
    this.approveItemId = options.auditItemId
    this.doneOrNotDone = options.doneOrNotDone
    this.processKey = options.processKey
    this.actTaskId = options.actTaskId
    this.fromPage = options.fromPage
    this.createdData = options.createdData
    this.nodeId = options.nodeId
    this.getApproveData()
  },
  methods: {
    // 获取审批记录数据
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
        if(this.nodeId){
          this.doneOrNotDone = this.nodeId == res.data.currentApproveNode ? '1' : '';
        }
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
