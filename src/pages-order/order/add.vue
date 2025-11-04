<template>
  <view class="page-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view v-if="formId && showQuotation == 1" class="quotation-link" @click="toQuotation">
      <u-icon name="file-text" color="#FF740A" size="36rpx"></u-icon>
      <u--text text="点击查看报价单明细" color="#FF740A" size="28rpx"></u--text>
      <u-icon name="arrow-right" color="#FF740A" size="28rpx"></u-icon>
    </view>
    <view class="field-form">
      <e-input :value="info.serviceAddress" :name="fieldNames['serviceAddress']" isLink :required="required['serviceAddress']" placeholder="服务地址" @on-click="selectAddress" />
      <e-input v-if="serviceTypeList.length > 0" :value="info.serviceType" :name="fieldNames['serviceType']" type="slotcontent" :required="required['serviceType']" placeholder="服务类型">
        <view class="service-type-content">
          <!-- 业务分类二级 -->
          <view class="service-type-list-level1">
            <view :class="['list-level1', { active: serverId1 == item.serverId }]" v-for="(item, index) in serviceTypeList" :key="index" @click="handleSelectServiceType(item, 1)">{{
              item.serverName
            }}</view>
          </view>
          <!-- 业务分类三级 -->
          <view v-show="childrenSeverList.length > 0" class="service-type-list-level2">
            <view :class="['list-level2', { active: serverId2 == item.serverId }]" v-for="(item, index) in childrenSeverList" :key="index" @click="handleSelectServiceType(item, 2)">{{
              item.serverName
            }}</view>
          </view>
        </view>
      </e-input>
      <!-- <e-input v-if="isAuth('areaName') || isAuth('projectName')" :value="info.areaName && info.projectName ? info.areaName + '-' + info.projectName : ''" @on-click="selectArea" :name="fieldNames['areaName'] + fieldNames['projectName']" :required="required['projectName']" isLink /> -->
      <!-- <e-input v-if="isAuth('orignSource')" v-model="info.orignSource" type="Radio" :columns="fieldValues['orignSource']" :name="fieldNames['orignSource'].name" :required="required['orignSource']" /> -->
      <!-- <e-input v-if="isAuth('taskSubTypeName')" v-model="info.taskSubTypeName" @on-click="selectType" :name="fieldNames['taskSubTypeName'].name" :required="required['taskSubTypeName']" isLink /> -->
      <!-- <e-input v-if="isAuth('ownerName')" v-model="info.ownerName" @on-click="selectOwner" :name="fieldNames['ownerName'].name" :required="required['ownerName']" isLink /> -->
      <e-input
        v-if="isAuth('contactName')"
        :required="required['contactName']"
        v-model="info.contactName"
        type="input"
        :name="fieldNames['contactName'].name"
        :placeholder="fieldNames['contactName'].placeholder"
      />
      <e-input
        v-if="isAuth('contactPhone')"
        :required="required['contactPhone']"
        v-model="info.contactPhone"
        type="input"
        :name="fieldNames['contactPhone'].name"
        :placeholder="fieldNames['contactPhone'].placeholder"
      />
      <e-input
        v-if="isAuth('ownerCardType')"
        :columns="fieldValues['ownerCardType']"
        :required="required['ownerCardType']"
        v-model="info.ownerCardType"
        type="select"
        :name="fieldNames['ownerCardType'].name"
        isLink
      />
      <e-input
        v-if="isAuth('ownerCardNum')"
        :required="required['ownerCardNum']"
        v-model="info.ownerCardNum"
        type="input"
        :name="fieldNames['ownerCardNum'].name"
        :placeholder="fieldNames['ownerCardNum'].placeholder"
      />
      <e-input v-if="isAuth('location')" :required="required['location']" v-model="info.location" type="input" :name="fieldNames['location'].name" :placeholder="fieldNames['location'].placeholder" />
      <e-input
        v-if="isAuth('taskSource')"
        :columns="fieldValues['taskSource']"
        :required="required['taskSource']"
        v-model="info.taskSource"
        type="select"
        :name="fieldNames['taskSource'].name"
        isLink
      />
      <e-input
        v-if="isAuth('emergencyLevel')"
        :columns="fieldValues['emergencyLevel']"
        :required="required['emergencyLevel']"
        v-model="info.emergencyLevel"
        type="select"
        :name="fieldNames['emergencyLevel'].name"
        isLink
      />
      <e-input
        v-if="isAuth('appointmentDate')"
        :columns="fieldValues['appointmentDate']"
        :required="required['appointmentDate']"
        v-model="info.appointmentDate"
        type="DatePicker"
        mode="datetime"
        :name="fieldNames['appointmentDate'].name"
        isLink
      />
      <e-input
        v-if="isAuth('followUserName') && (!fieldValues['followUserName'] || !fieldValues['followUserName'].length)"
        :required="required['followUserName']"
        v-model="info.followUserName"
        @on-click="selectStaff"
        :name="fieldNames['followUserName'].name"
        isLink
      />
      <e-input v-if="isAuth('isPublic')" :columns="fieldValues['isPublic']" :required="required['isPublic']" v-model="info.isPublic" type="select" :name="fieldNames['isPublic'].name" isLink />
      <e-input v-if="isAuth('isPaid')" :columns="fieldValues['isPaid']" :required="required['isPaid']" v-model="info.isPaid" type="select" :name="fieldNames['isPaid'].name" isLink />
      <e-input
        v-if="isAuth('cancelReason')"
        :columns="fieldValues['cancelReason']"
        :required="required['cancelReason']"
        v-model="info.cancelReason"
        type="select"
        :name="fieldNames['cancelReason'].name"
        isLink
      />
      <e-input
        v-if="isAuth('pauseDeadline')"
        :columns="fieldValues['pauseDeadline']"
        :required="required['pauseDeadline']"
        v-model="info.pauseDeadline"
        type="DatePicker"
        mode="datetime"
        :name="fieldNames['pauseDeadline'].name"
        isLink
      />
      <e-input
        v-if="isAuth('actualPrice')"
        :required="required['actualPrice']"
        v-model="info.actualPrice"
        type="input"
        :name="fieldNames['actualPrice'].name"
        :placeholder="fieldNames['actualPrice'].placeholder"
      />
      <e-input v-if="isAuth('payType')" :columns="fieldValues['payType']" :required="required['payType']" v-model="info.payType" type="radio" :name="fieldNames['payType'].name" isLink />
      <e-input v-if="isAuth('associatedDevice')" @on-click="selectDevice" :required="required['associatedDevice']" v-model="info.associatedDevice" :name="fieldNames['associatedDevice'].name" isLink />
      <e-input v-if="isAuth('zhuangXiuDanHao')" @on-click="selectDecorate" :required="required['zhuangXiuDanHao']" v-model="info.zhuangXiuDanHao" :name="fieldNames['zhuangXiuDanHao'].name" isLink />
      <e-input
        v-if="isAuth('ownerSign')"
        :required="required['ownerSign']"
        v-model="info.ownerSign"
        type="input"
        :name="fieldNames['ownerSign'].name"
        :placeholder="fieldNames['ownerSign'].placeholder"
      />
      <e-input
        v-if="isAuth('taskDesc')"
        :required="required['taskDesc']"
        v-model="info.taskDesc"
        type="textarea"
        :name="fieldNames['taskDesc'].name"
        :placeholder="fieldNames['taskDesc'].placeholder"
      />
      <e-input
        v-if="isAuth('jiashiDate')"
        :required="required['jiashiDate']"
        v-model="info.jiashiDate"
        type="DatePicker"
        mode="date"
        :name="fieldNames['jiashiDate'].name"
        :placeholder="fieldNames['jiashiDate'].placeholder"
        isLink
      />
      <e-input
        v-if="isAuth('appointDate')"
        :required="required['appointDate']"
        v-model="info.appointDate"
        type="DatePicker"
        mode="date"
        :name="fieldNames['appointDate'].name"
        :placeholder="fieldNames['appointDate'].placeholder"
        isLink
      />
      <e-input
        v-if="isAuth('jiashiMoney')"
        :required="required['jiashiMoney']"
        v-model="info.jiashiMoney"
        type="input"
        :name="fieldNames['jiashiMoney'].name"
        :placeholder="fieldNames['jiashiMoney'].placeholder"
      />
      <e-input
        v-if="isAuth('jiashiOriginalTime')"
        :required="required['jiashiOriginalTime']"
        v-model="info.jiashiOriginalTime"
        type="input"
        :name="fieldNames['jiashiOriginalTime'].name"
        :placeholder="fieldNames['jiashiOriginalTime'].placeholder"
      />
      <e-input
        v-if="isAuth('jiashiRealityTime')"
        :required="required['jiashiRealityTime']"
        v-model="info.jiashiRealityTime"
        type="input"
        :name="fieldNames['jiashiRealityTime'].name"
        :placeholder="fieldNames['jiashiRealityTime'].placeholder"
      />
      <e-input
        v-if="isAuth('taskAttachment')"
        :required="required['taskAttachment']"
        v-model="info.taskAttachment"
        type="upload"
        :name="fieldNames['taskAttachment'].name"
        :projectName="info.projectName"
        @dataChange="handleUploadChange"
      />
      <u-collapse value="0" accordion>
          <view v-for="(item, index) in customAppFormFieldJson" :key="index">
            <u-collapse-item :title="item.groupName" :name="index" v-if="item.rule && item.rule.length">
              <!-- <e-input v-for="(item1, index1) in item.rule" isCustom :columns="item1.options" :key="index1"
                :required="item1.required" v-model="info.customFields[item1.key]" :type="item1.type" :name="item1.title"
                :placeholder="item1.placeholder" :isLink="item1.isLink" :projectName="info.projectName" :mode="item1.modeType" />	 -->
              <e-input
                v-for="(item1, index1) in item.rule"
                :key="index1"
                isCustom
                :columns="item1.options"
                :fieldId="item1.key"
                :required="item1.required"
                v-model="info.customFields[item1.key]"
                :type="item1.type"
                :name="item1.title"
                :placeholder="item1.placeholder"
                :isLink="item1.isLink"
                :projectName="info.projectName"
                @dataChange="handleUploadChange"
              />
            </u-collapse-item>				 
          </view>
        </u-collapse>
    </view>
    <view class="submit-btn">
      <view class="submit" @click="handleSave">提交</view>
      <view class="history" @click="goToHistory">查看历史记录</view>
    </view>
    <!-- 提交成功 -->
    <view class="submit-success" :class="{ 'success-show': submitSuccess }">
      <view class="submit-success-cont">
        <image :src="iconSuccess" mode="widthFix" class="submit-success-img" />
        <text class="submit-success-text">提交成功！</text>
        <button class="btn-box" @click="toIndex">返回首页</button>
      </view>
    </view>
  </view>
</template>

<script>
import utils from "@/js/utils";
import commLogic from "@/js/comm-logic";
import wycrmApi from "@/service/wycrm6.0.js";
import { findLocations } from "@/service/community";
import eInput from "../components/eInput";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: { eInput },
  data() {
    return {
      userInfo: {},
      companyId: "",
      projectId: "",
      projectType: "",
      canLoadVuexCache: false,
      formId: "",
      showQuotation: 0, //是否显示报价单
      filterFiedldJson: ["areaId", "areaName", "projectId", "projectName", "orignSource"],
      ownerFormFieldJson: [],
      customAppFormFieldJson: [],
      info: {
        serviceAddress: "",
        projectId: "",
        projectName: "",
        location: "",
        customFields: {},
      },
      ownerInfo: {},
      required: {},
      fieldValues: {},
      fieldNames: {
        serviceAddress: "服务地址",
        serviceType: "服务类型",
      },
      serverId1: "",
      serverId2: "",
      serviceTypeList: [],
      childrenSeverList: [],
      serverSettingList: [],
      submitSuccess: false,
      switchPjId: "",
    };
  },
  computed: {
    ...mapGetters("repair", {
      getRepairsInfo: "getRepairsInfo",
    }),
    iconSuccess() {
      return `${this.IMG_BASE_URL}/static/${this.THEME_NAME}/multiplexing/icon_success.png`;
    },
  },
  onLoad(options) {
    const { O_USER_INFO, PROJECT_ID } = this.$constant;
    const userInfo = utils.storageAction({ key: O_USER_INFO, action: "get" });
    this.switchPjId = utils.storageAction({ key: PROJECT_ID, action: 'get'}) || '';
    this.userInfo = userInfo;
    this.info.taskSubTypeId = options.serverId || "8b0f4d4c-405f-11f0-a7eb-9eec8628bc09";
    this.getMemberInfo();
  },
  onShow() {},
  methods: {
    ...mapMutations("repair", ["clearRepairsInfo", "saveRepairsInfo"]),

    //获取缓存信息
    getMemberInfo() {
      const { O_USER_INFO, PROJECT_ID } = this.$constant;
      const { companyId, id } = utils.storageAction({ key: O_USER_INFO, action: "get" });
      this.projectId = utils.storageAction({ key: PROJECT_ID, action: "get" });
      const { projectType } = commLogic.getProjectConfig();
      this.companyId = companyId;
      this.memberId = id;
      this.projectType = projectType;
      this.getAddrList();
    },

    getAddrList() {
      let params = {
        data: {
          memberId: this.memberId,
          companyId: this.companyId,
          projectType: this.projectType,
          authType: 1, // 已认证房产
          isEnterpriseHouse: 1, // 查询企业房产
        },
        pathParams: "/0", // 0- 查所有 1-查业主认证房产 2-查收获地址 3-查企业认证房产
      };
      findLocations(params)
        .then((result) => {
          if (result.status == 200) {
            let list = result.data.authBuildings;
            if (list.length > 0) {
              let data = {}
              let sameHouseList = list.filter((item) => item.projectId == this.switchPjId);
              if (sameHouseList.length > 0) {
                data = sameHouseList[0];
              }else{
                data = list[0];
              }
              this.ownerInfo = data;
              this.info.serviceAddress = data.address;
              this.info.location = data.address;
              this.info.areaId = data.areaId;
              this.info.projectId = data.projectId;
              this.info.projectName = data.projectName;
              this.requestSeverTypeList();
              this.requestSystemSettingList(data.areaId, data.projectId);
              // this.requestServerSettingList();
            } else {
              this.ownerInfo = {}
              this.info.serviceAddress = "";
              this.info.location = "";
            }
          }
        })
        .catch((err) => {});
    },
    requestSystemSettingList(areaId, projectId) {
      let params = {
        data: {
          settingType: 4,
          companyId: this.companyId,
          userId: this.memberId,
          areaId: areaId,
          projectId: projectId,
          pageNum: 1,
          pageSize: 10,
        },
      };
      wycrmApi.getSystemSettingList(params).then((res) => {
        if (res.status == 200 && res.data.records && res.data.records.length > 0) {
          // showQuotation 1展示
          let obj = res.data.records[0];
          this.showQuotation = obj.showQuotation;
        } else {
          this.showQuotation = 0;
        }
      });
    },
    requestServerSettingList() {
      const params = {
        data: {
          companyId: this.userInfo.companyId,
          areaId: this.info.areaId,
          projectId: this.info.projectId,
          applyType: 1,
        },
      };
      wycrmApi.getQuesTaskServerSettingList(params).then((result) => {
        if (result.status == 200 && result.data && result.data.length > 0) {
          this.serverSettingList = result.data;
        } else {
          this.serverSettingList = [];
        }
      });
    },
    requestSeverTypeList() {
      let params = {
        data: {
          companyId: this.companyId,
          projectId: this.info.projectId,
          serverId: this.info.taskSubTypeId,
        },
      };
      wycrmApi.getServerSettingTreeByServerId(params).then((result) => {
        if (result.status == 200 && result.data[0]) {
          let data = result.data[0];
          uni.setNavigationBarTitle({ title: data.serverName });

          if (data.children && data.children.length > 0) {
            this.serviceTypeList = data.children;
            this.handleSelectServiceType(this.serviceTypeList[0], 1);
          } else {
            this.childrenSeverList = [];
            this.formId = data.formId;
            this.info.taskSubTypeId = data.serverId;
            this.info.serverSettingId = data.serverSettingId;
            this.info.taskSubTypeName = data.serverName;
            this.requestFormList();
          }
        }else{
          this.childrenSeverList = [];
          this.requestFormList();
        }
      });
    },
    handleDownload(file) {
      console.log(file);

      uni.downloadFile({
        url: file.templateResPath,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.openDocument({
              filePath: res.tempFilePath,
              success: (res) => {
                console.log("打开文档成功");
              },
              fail: function (err) {
                // console.log('打开文档失败'+JSON.stringify(err));
                uni.showToast({ title: "不支持查看该类型附件", icon: "none" });
              },
            });
          }
        },
      });
    },
    requestFormList() {
      let params = {
        data: {
          formId: this.formId,
          serverSettingId: this.info.serverSettingId,
          userId: this.memberId,
          companyId: this.companyId,
        },
      };
      wycrmApi.getFormDetailByFormId(params).then((res) => {
        if (res.status == 200) {
          // 固定字段
          let list = JSON.parse(res.data.ownerFormFieldJson);
          let _data = [];
          for (let index = 0; index < list.length; index++) {
            const ele = list[index];
            if (!this.filterFiedldJson.includes(ele.fieldCode)) {
              let name = ele.ownerFieldName ? ele.ownerFieldName : ele.fieldName;
              let placeholder = ele.defaultValue ? ele.defaultValue : ele.fieldType == 1 ? "请填写" : "请选择";
              this.required[ele.fieldCode] = ele.required || false;
              this.fieldValues[ele.fieldCode] = ele.fieldValueList.length > 0 ? ele.fieldValueList : ele.fieldType == 1 ? "" : [];
              this.fieldNames[ele.fieldCode] = { name: name, placeholder: placeholder };
              _data.push(ele);
            }
          }
          this.ownerFormFieldJson = _data;
          // 自定义字段
          let _cusdata = [];
          let _list = JSON.parse(res.data.customAppFormFieldJson);
          this.customAppFormFieldJson = _list.map((item) => {
            return {
              ...item,
              rule: item.rule.map((ele) => {
                let item = {};
                ele.key = ele.field;
                ele.name = ele.title;
                ele.mode = ele.type == 'DatePicker' ? ele.props.type : '';
                ele.required = ele.validate[0].required;
                let placeholder = ele.props.placeholder ? ele.props.placeholder : ele.type == 'Input' ? '请填写' : '请选择';
                ele.placeholder = placeholder;
                if (ele.options && ele.options.length > 0) {
                  item.options = ele.options.map((option) => {
                    option.fieldLabel = option.label;
                    option.fieldVal = option.label;
                    return option;
                  });
                }
                ele.options = item.options;
                return ele;
              }),
            };
          });
          // console.log("_list", _list);
          // for (let index = 0; index < _list.length; index++) {
          //   for (let index1 = 0; index < _list[index].rule.length; index1++) {

          //   const ele = _list[index].rule[index1];
          //   let item = {};

          // }

          // }
          // this.customAppFormFieldJson = _cusdata;
          console.log("customAppFormFieldJson", this.ownerFormFieldJson, this.info);
        }
      });
    },
    handleSelectServiceType(data, level) {
      level == 1 && (this.serverId1 = data.serverId);
      level == 2 && (this.serverId2 = data.serverId);
      if (data.children && data.children.length > 0) {
        this.childrenSeverList = data.children;
        this.customAppFormFieldJson = [];
        this.ownerFormFieldJson = [];
        this.serverId2 = "";
        this.formId = "";
      } else {
        level == 1 && (this.childrenSeverList = []);
        this.formId = data.formId;
        this.info.taskSubTypeId = data.serverId;
        this.info.taskSubTypeName = data.serverName;
        this.info.serverSettingId = data.serverSettingId;
        this.requestFormList();
      }
    },
    isAuth(code) {
      let Idx = this.ownerFormFieldJson.findIndex((ele) => ele.fieldCode === code);
      return Idx > -1;
    },
    toQuotation() {
      uni.navigateTo({
        url: "/pages-order/order/quotation?areaId=" + this.info.areaId + "&projectId=" + this.info.projectId,
      });
    },
    selectAddress() {
      uni.navigateTo({
        url: "/pages-b/house-info/auth-address-list?page=addCustomWorkOrder&taskType=2",
        events: {
          dataEvent: (data) => {
            console.log("data", data);
            this.ownerInfo = data.data;
            let info = data.data;
            this.info.serviceAddress = info.address;
            this.info.location = info.address;
            this.info.areaId = info.areaId;
            this.info.projectId = info.projectId;
            this.info.projectName = info.projectName;
            this.requestSeverTypeList();
            this.requestSystemSettingList(info.areaId, info.projectId);
          },
        },
      });
    },
    handleUploadChange(fileList, isCustom, fieldId) {
      console.log("handleUploadChange", fileList, isCustom, fieldId);

      if (isCustom) {
        this.info.customFields[fieldId] = {};
        if (fileList && fileList.length > 0) {
          this.info.customFields[fieldId].taskAttachmentList = fileList;
          this.info.customFields[fieldId].taskAttachment = fileList.map((item) => item.fid).join(",");
        }
      } else {
        if (fileList && fileList.length > 0) {
          this.info.taskAttachmentList = fileList;
          this.info.taskAttachment = fileList.map((item) => item.fid).join(",");
        }
      }
    },
    handleSave() {
      let isValidate = false;
      let msg = "";
      uni.showLoading({
        mask: true,
      });
      if (!this.info.serviceAddress) {
        uni.hideLoading();
        uni.showToast({ title: "请选择服务地址", icon: "none" });
        return;
      }
      if (!this.info.taskSubTypeId) {
        uni.hideLoading();
        uni.showToast({ title: "请选择服务类型", icon: "none" });
        return;
      }
      this.ownerFormFieldJson.forEach((ele) => {
        if (!isValidate && this.required[ele.fieldCode] && !this.info[ele.fieldCode]) {
          console.log(ele.fieldCode, this.info[ele.fieldCode], "this.info[ele.fieldCode]this.info[ele.fieldCode]");
          msg = "请补充" + ele.fieldName;
          isValidate = true;
        }
      });
      this.customAppFormFieldJson.forEach((ele) => {
        if (!isValidate && ele.required && !this.info.customFields[ele.key]) {
          msg = "请补充" + ele.name;
          isValidate = true;
        }
      });
      if (isValidate) {
        uni.hideLoading();
        uni.showToast({ title: msg, icon: "none" });
        return;
      }
      let params = {
        header: {
          "x-userId-header": this.userInfo.memberId,
          "x-userAccount-header": this.userInfo.STRG_phone,
          "x-userName-header": encodeURIComponent(this.userInfo.memberName),
        },
        data: {
          ...this.info,
          orignSource: "customerTask", // 客户下单
          customFields: JSON.stringify(this.info.customFields),
          operationCode: "submittask",
          operationName: "新增任务",
          sourceType: this.info.sourceType || "-1",
          memberId: this.userInfo.memberId,
          ownerId: this.ownerInfo.ownerId || '',
          ownerName: this.ownerInfo.ownerName || '',
          ownerPhone: this.ownerInfo.ownerPhones || '',
          houseinfoId: this.ownerInfo.relateId || '',
          buildingId: this.ownerInfo.buildingId || '',
          contactName: this.ownerInfo.ownerName || '',
          contactPhone: this.ownerInfo.ownerPhones || '',
        },
        hideLoading: false,
      };
      console.log(123, params);
      wycrmApi.saveAndUpdateQuestionTask(params).then((res) => {
        if (res.status == 200) {
          this.submitSuccess = true;
        } else {
          uni.showToast({ title: "提交失败", duration: 1000, icon: "none" });
        }
      });
    },
    goToHistory() {
      uni.navigateTo({
        url: "/pages-order/order/repairHistory",
      });
    },
    // 返回首页
    toIndex() {
      this.submitSuccess = false;
      this.submitLoading = false;
      uni.switchTab({ url: "/pages/index/index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-box {
  // margin: 0 30rpx;

  .quotation-link {
    display: flex;
    background: rgba(255, 191, 68, 0.2);
    padding: 16rpx 30rpx;
  }

  .field-form {
    margin: 0 30rpx;
  }

  .service-type-content {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .service-type-list-level1 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;

      .list-level1 {
        width: 334rpx;
        height: 66rpx;
        line-height: 66rpx;
        text-align: center;
        background: #f5f5f5;
        font-size: 30rpx;
        color: #000000;
        font-weight: 400;
        font-family: PingFang SC, PingFang SC;
        border-radius: 10rpx 10rpx 10rpx 10rpx;
      }

      .active {
        background: var(--app-primary-color) !important;
        color: #ffffff !important;
      }
    }
    .service-type-list-level2 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;

      .list-level2 {
        width: 210rpx;
        height: 66rpx;
        line-height: 66rpx;
        text-align: center;
        font-size: 30rpx;
        color: #000000;
        font-weight: 400;
        font-family: PingFang SC, PingFang SC;
        border: 2rpx solid #cccccc;
        border-radius: 10rpx 10rpx 10rpx 10rpx;
      }
      .active {
        color: var(--app-primary-color) !important;
        border-color: var(--app-primary-color) !important;
      }
    }
  }

  .submit-btn {
    display: flex;
    justify-content: center;
    flex-direction: column;
    row-gap: 20rpx;
    margin: 20rpx 0;
    .submit {
      margin: 0 50rpx;
      padding: 18rpx 0;
      font-family: PingFang SC, PingFang SC;
      font-weight: bold;
      font-size: 32rpx;
      color: #ffffff;
      line-height: 44rpx;
      text-align: center;
      font-style: normal;
      text-transform: none;
      background: var(--app-primary-color);
      border-radius: 16rpx 16rpx 16rpx 16rpx;
      border: 2rpx solid var(--app-primary-color);
    }
    .history {
      padding-bottom: 40rpx;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 28rpx;
      color: var(--app-primary-color);
      line-height: 40rpx;
      text-align: left;
      font-style: normal;
      text-transform: none;
      text-align: center;
    }
  }

  .submit-success {
    &.success-show {
      @include flx-dsp($jsc: center, $ali: center);
      display: flex;
      opacity: 1;
    }
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s;
    opacity: 0;
    display: none;
    .submit-success-cont {
      @include flx-dsp($jsc: center, $ali: center, $drt: column);
      overflow: hidden;
      width: 550rpx;
      height: 394rpx;
      background: #ffffff;
      border-radius: 10rpx;
      .submit-success-img {
        width: 102rpx;
        margin-bottom: 20rpx;
      }
      .submit-success-text {
        font-size: 30rpx;
        color: #555555;
        margin-bottom: 50rpx;
        padding-left: 20rpx;
      }
      .btn-box {
        width: 260rpx;
        height: 68rpx;
        line-height: 68rpx;
        background: var(--app-primary-color);
        border-radius: 46rpx;
        color: #fff;
        padding: 0;
        font-size: 28rpx;
      }
      button::after {
        border: none;
      }
    }
  }
  .submit-success {
    &.success-show {
      @include flx-dsp($jsc: center, $ali: center);
      display: flex;
      opacity: 1;
    }
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    transition: opacity 0.3s;
    opacity: 0;
    display: none;
    .submit-success-cont {
      @include flx-dsp($jsc: center, $ali: center, $drt: column);
      overflow: hidden;
      width: 550rpx;
      height: 394rpx;
      background: #ffffff;
      border-radius: 10rpx;
      .submit-success-img {
        width: 102rpx;
        margin-bottom: 20rpx;
      }
      .submit-success-text {
        font-size: 30rpx;
        color: #555555;
        margin-bottom: 50rpx;
        padding-left: 20rpx;
      }
      .btn-box {
        width: 260rpx;
        height: 68rpx;
        line-height: 68rpx;
        background: var(--app-primary-color);
        border-radius: 46rpx;
        color: #fff;
        padding: 0;
        font-size: 28rpx;
      }
      button::after {
        border: none;
      }
    }
  }
}
</style>
