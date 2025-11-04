<template>
  <view class="repair-detail-page" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view style="padding: 40rpx 30rpx 30rpx; font-weight: bold">业主性质</view>
    <view class="detail-info detail-info-center" style="padding: 20rpx">
      <view>
        <u-radio-group v-model="form.ownerType" iconPlacement="left" disabled>
          <u-radio :activeColor="THEME_COLOR" :name="0" label="业主" :customStyle="{ marginRight: '16rpx' }"></u-radio>
          <u-radio :activeColor="THEME_COLOR" :name="1" label="公司"></u-radio>
        </u-radio-group>
      </view>
    </view>

    <view style="padding: 40rpx 30rpx 30rpx; font-weight: bold">业主信息</view>
    <view class="detail-info">
      <u-form labelWidth="168rpx" label-margin-right="24rpx" label-align="left" class="detail-userInfo">
        <u-form-item>
          <text slot="label" class="lab">房号</text>
          <text>{{ form.roomName }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">房产地址</text>
          <text>{{ form.address }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">联系人</text>
          <text>{{ form.ownerName }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">联系电话</text>
          <text>{{ form.telephone }}</text>
        </u-form-item>
        <u-form-item v-if="form.ownerType == '1'">
          <text class="lab" slot="label">公司名称</text>
          <text>{{ form.ownerCompanyName }}</text>
        </u-form-item>
      </u-form>
    </view>

    <view style="padding: 40rpx 30rpx 30rpx; font-weight: bold">装修公司信息</view>
    <view class="detail-info">
      <u-form labelWidth="168rpx" label-margin-right="24rpx" label-align="left" class="detail-userInfo">
        <u-form-item>
          <text class="lab" slot="label">施工单位</text>
          <text>{{ form.decorationCompanyName }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">负责人</text>
          <text>{{ form.decorationLeader }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">联系电话</text>
          <text>{{ form.leaderTelephone }}</text>
        </u-form-item>
      </u-form>
    </view>

    <view style="padding: 40rpx 30rpx 30rpx; font-weight: bold">装修信息</view>
    <view class="detail-info">
      <u-form label-width="198rpx" label-margin-right="24rpx" label-align="left" class="detail-userInfo">
        <u-form-item>
          <text slot="label" class="lab2">装修开始时间</text>
          <text>{{ form.decorationStartDate }}</text>
        </u-form-item>
        <u-form-item>
          <text slot="label" class="lab2">装修结束时间</text>
          <text>{{ form.decorationEndDate }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab2" slot="label">防火负责人</text>
          <text>{{ form.firemanName }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab2" slot="label">防火负责人联系电话</text>
          <text>{{ form.firemanTelephone }}</text>
        </u-form-item>
        <u-form-item>
          <text slot="label" class="lab2">发证日期</text>
          <text>{{ form.openingDate }}</text>
        </u-form-item>
        <u-form-item>
          <text slot="label" class="lab2">装修类型</text>
          <text>{{ decorationTypeText }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">灭火器应配备</text>
          <text>{{ form.fireExtinguisherNum }}</text>
        </u-form-item>
        <u-form-item>
          <text class="lab" slot="label">施工内容</text>
          <text>{{ form.constructionContent }}</text>
        </u-form-item>
      </u-form>
    </view>

    <view style="padding: 40rpx 30rpx 30rpx; font-weight: bold">装修申请资料</view>
    <view class="detail-info" style="padding: 20rpx">
      <text class="text_yzx">业主需根据装修要求进行筛选</text>
      <view class="weui-cell__bd weui-cell__primary">
        <view v-for="(item, index) in fileData" :key="index" style="padding: 16rpx">
          <view style="margin-bottom: 5px;">{{ index + 1 }}.{{ item.detailName }}</view>
          <u-upload :deletable="false" :fileList="item.fileList" :maxCount="1" :previewFullImage="true" />
        </view>
        
      </view>
    </view>

    <view  style="padding: 40rpx 30rpx 30rpx; font-weight: bold"> 相关文件下载链接 </view>
    <view class="detail-info" style="padding: 20rpx">
      <view style="word-break: break-all">
        {{ downloadLink.length ? downloadLink[0].detailName : '' }}
        <view @click="copy">复制</view>
      </view>
    </view>

    <view class="detail-info" style="padding: 20rpx; background: transparent">
      <text class="text_hint">提示:装修开始日期7天前,需要提交所有资料,图纸审核需要3个工作日</text>
    </view>

    <u-picker show-name :show="showRoomNum" @confirm="change1" placeholder="请选择房号" :columns="[rooms]" keyName="houseRoom" v-model="selectedRoom" value-text-align="left" @cancel="cancelRoomNum"></u-picker>
    <u-datetime-picker ref="elDateTimeStart" :show="startDateObj.isShow" v-model="startDateObj.value" mode="date" :minDate="startDateObj.minDate" @cancel="startDateObj.isShow = false" @confirm="DateConfirm('start', $event)" />
    <u-datetime-picker ref="elDateTimeEnd" :show="endDateObj.isShow" v-model="endDateObj.value" mode="date" :minDate="endDateObj.minDate" @cancel="endDateObj.isShow = false" @confirm="DateConfirm('end', $event)" />
    <u-datetime-picker :show="issueObj.isShow" v-model="issueObj.value" mode="date" @cancel="issueObj.isShow = false" @confirm="DateConfirm('decorate', $event)" />
    <u-picker :show="decorateTypeObj.isShow" :columns="[list]" keyName="name" @confirm="decorateTypeChange" @cancel="decorateTypeObj.isShow = false" />
  </view>
</template>

<script>
import { getDicDetailType, addAPPDecoration, fireExtinguisherNum, selectDecoration } from '@/service/decorationManage';
import Utils from '@/js/utils';
import commLogic from '@/js/comm-logic';
import {
  findLocations, //认证房产地址
} from '@/service/community';
import { uploadMutiFile } from '@/service/landcrm';
export default {
  data() {
    const { MEMBER_ID, PROJECT_ID, COMPLANY_ID, AREA_ID } = this.$constant;
    return {
      selectedRoom: null,
      showRoomNum: false,
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectType: '184',
      companyId: '440',
      form: {
        ownerType: '',
        roomCode: '',
        address: '',
        ownerCompanyName: '',
        ownerName: '',
        telephone: '',
        decorationLeader: '',
        leaderTelephone: '',
        decorationCompanyName: '',
        decorationStartDate: '',
        decorationEndDate: '',
        firemanName: '',
        firemanTelephone: '',
        openingDate: '',
        fireExtinguisherNum: 0,
        decorationType: '',
        constructionContent: '',
      },
      minFire: 0,
      identityType: 0,
      successShow: false,
      infoId: '',
      roomId: '',
      rooms: [],
      downloadLink: [],
      fileData: [],
      list: [],
      list1: [[]],
      startDateObj: {
        isShow: false,
        minDate: new Date().getTime(),
        value: '',
      },
      endDateObj: {
        isShow: false,
        minDate: new Date().getTime(),
        value: '',
      },
      issueObj: {
        isShow: false,
        value: new Date().getTime(),
      },
      decorateTypeObj: {
        isShow: false,
        name: '',
        value: '',
      },
      fileList: [], // 缓存附件
    };
  },
  computed: {
    // 获取房号
    getRoomNum() {
      return this.selectedRoom ? this.selectedRoom.houseRoom : '';
    },
    decorationTypeText() {
      const { name = '' } = this.list.find(item => item.value == this.form.decorationType) || {}
      return name
    }
  },
  onLoad(option) {
    const {id} = option
    const { projectType, companyId } = commLogic.getProjectConfig();
    this.projectType = projectType;
    this.companyId = companyId;
    this.getDecorationDetail(id)

    let params1 = {
      data: {
        memberId: this.memberId,
        authType: 1,
        projectType: this.projectType,
      },
      pathParams: '/1',
    };
    findLocations(params1).then((res) => {
      if (res.status == 200) {
        this.rooms = res.data.authBuildings;
        for (let i in res.data.authBuildings) {
          this.list1[0].push({
            name: res.data.authBuildings[i].houseRoomCode,
            value: res.data.authBuildings[i].houseRoomCode,
          });
        }
        this.selectedRoom = this.rooms[0] || {};
        this.form.roomCode = [res.data.authBuildings[0].houseRoomCode];
        this.form.address = res.data.authBuildings[0].address;
        this.infoId = res.data.authBuildings[0].addrId;
        this.roomId = res.data.authBuildings[0].addrId;
        //处理灭火器
        if (this.infoId) {
          this.getMhq();
        }
      }
    });
    getDicDetailType({
      dictDetaillist: ['decorationApply'],
      projectId: this.projectId,
    }).then((res) => {
      let arr = [];
      for (let i in res.data.decorationApply) {
        arr.push({
          detailName: res.data.decorationApply[i].detailName,
          fileDetailType: res.data.decorationApply[i].detailCode,
          specialType: 2,
          fileName: '',
          resPath: '',
          fullName: '',
        });
      }
      this.fileData = arr;
      this.attachmentAssembly()
    });
    let linkStr = this.companyId == '165' ? 'downloadLinkZgc' : 'downloadLink';
    getDicDetailType({
      dictDetaillist: [linkStr],
    }).then((res) => {
      if (res.status == 200) {
        this.downloadLink = res.data[linkStr];
      }
    });
    if (this.companyId == 165) {
      getDicDetailType({
        dictDetaillist: ['decorationListZgc'],
      }).then((res) => {
        for (let i in res.data.decorationListZgc) {
          this.list.push({
            name: res.data.decorationListZgc[i].detailName,
            value: res.data.decorationListZgc[i].detailId,
          });
        }
        // this.form.decorationType = res.data.decorationListZgc[0].detailId;
      });
    } else {
      getDicDetailType({
        dictDetaillist: ['decorationList'],
      }).then((res) => {
        for (let i in res.data.decorationList) {
          this.list.push({
            name: res.data.decorationList[i].detailName,
            value: res.data.decorationList[i].detailId,
          });
        }
        // this.form.decorationType = res.data.decorationList[0].detailId;
      });
    }
  },
  methods: {
    cancelRoomNum() {
      this.showRoomNum = false;
    },
    selectRoomNum() {
      this.showRoomNum = true;
    },
    getMhq() {
      if (this.companyId == '165') {
        return false;
      }
      //处理灭火器
      if (this.infoId) {
        fireExtinguisherNum(this.infoId).then((res) => {
          if (res.status == 200) {
            this.minFire = res.data;
          }
        });
      }
    },
    change(value) {
      console.log('change', value);
    },
    imgUpload(data, index) {
      // this.files = data
      console.log(data, index);
      this.fileData[index].resPath = data[0].filePath;
      this.fileData[index].fileName = data[0].fileName;
      this.fileData[index].fullName = data[0].fileName;
    },
    // 上传图片
    async uploadPic(event) {
      const { code } = await commLogic.permissionCheckAndAlert({ permissionKeys: ['camera', 'readStorage'] });
      if (code !== 1 && code !== -2) {
        return;
      }
      const fileList = {
        ...event.file,
        status: 'uploading',
        message: '上传中',
      };
      this.fileList.push(fileList);

      const res = await uploadMutiFile(fileList.url);
      const fileInfo = res.fileInfo;
      if (!fileInfo) {
        uni.showToast({ title: res.msg, icon: 'none' });
        return;
      }
      let lastIndex = this.fileList.length - 1;
      let item = this.fileList[lastIndex];
      this.fileList.splice(lastIndex, 1, {
        ...item,
        ...fileInfo,
        status: 'success',
        message: '',
      });
    },
    /**删除图片 */
    deletePic(event) {
      this.fileList.splice(event.index, 1);
    },
    change1(value) {
      this.showRoomNum = false;
      console.log('change', value);
      //let selectRoom = this.rooms.filter((a) => a.houseRoomCode == value)[0];
      const index = value.indexs[0];
      this.selectedRoom = this.rooms[index];
      this.form.roomCode = this.selectedRoom.houseRoomCode;
      this.form.address = this.selectedRoom.address;
      this.infoId = this.selectedRoom.addrId;
      this.roomId = this.selectedRoom.addrId;
      //处理灭火器
      if (this.infoId) {
        this.getMhq();
      }
    },
    showToast(txt) {
      uni.showToast({
        title: txt,
        icon: 'none',
      });
    },
    customsApplication() {
      const fileList = this.fileList;
      const fileData = JSON.parse(JSON.stringify(this.fileData));
      const uploadedAttachment = this.fileList.length >= fileData.length;
      let notmustArr = ['ownerCompanyName', 'ownerType', 'fireExtinguisherNum'];
      let cango = true;
      for (let item in this.form) {
        if (notmustArr.indexOf(item) != -1) {
        } else {
          if (!this.form[item]) {
            this.showToast('请将内容填写完整');
            cango = false;
            return false;
          }
        }
      }
      if (fileData.length && !uploadedAttachment) return this.showToast('请上传全部附件');
      // for (let i in this.fileData) {
      //   if (!this.fileData[i].resPath) {
      //     this.showToast("请上传全部附件");
      //     cango = false;
      //     return false;
      //   }
      // }
      if (this.form.ownerType == '1' && !this.form.ownerCompanyName) {
        this.showToast('请将内容填写完整');
        return false;
      }
      if (+new Date(this.form.decorationEndDate) - new Date(this.form.decorationStartDate) < 0) {
        this.showToast('装修开始时间不能大于结束时间');
        return false;
      }
      if (!cango) {
        return false;
      }

      let postData = {
        areaId: this.areaId,
        projectId: this.projectId,
        // areaId: '1',
        // projectId: '1',
        roomName: this.form.roomCode[0],
        infoId: this.infoId,
        roomId: this.roomId,
        ...this.form,
      };
      postData.decorationStartDate = postData.decorationStartDate + ' 00:00:00';
      postData.decorationEndDate = postData.decorationEndDate + ' 23:59:59';
      postData.openingDate = postData.openingDate + ' 00:00:00';
      console.log(fileList, 'fileList');
      postData.decorationApply = fileData.map((item, index) => {
        const { fName = '', resPath = '' } = fileList[index] || {};

        item.resPath = resPath;
        item.fileName = fName;
        item.fullName = fName;
        return item;
      });

      addAPPDecoration({
        data: postData,
      }).then((res) => {
        if (res.status == 200) {
          this.showToast('新增成功');
          uni.navigateBack({ delta: 1 });
        }
      });
    },
    returnHomeClick() {
      let self = this;
      self.$router.push('/index');
    },
    copy() {
      let _this = this;
      copyText(_this.downloadLink[0].detailName);
      // var save = function (e) {
      //   e.clipboardData.setData("text/plain", _this.downloadLink[0].detailName); //下面会说到clipboardData对象
      //   e.preventDefault(); //阻止默认行为
      // };
      // document.addEventListener("copy", save);
      // document.execCommand("copy");
      // this.showToast("复制成功，请于浏览器中打开网址");
    },
    DateConfirm(type, data) {
      if (type == 'start') {
        this.form.decorationStartDate = this.startDateObj.value = uni.$u.timeFormat(data.value, 'yyyy-mm-dd');
        this.startDateObj.isShow = false;
      } else if (type == 'end') {
        this.form.decorationEndDate = this.endDateObj.value = uni.$u.timeFormat(data.value, 'yyyy-mm-dd');
        this.endDateObj.isShow = false;
      } else if (type == 'decorate') {
        this.form.openingDate = uni.$u.timeFormat(data.value, 'yyyy-mm-dd');
        this.issueObj.isShow = false;
      }
    },
    decorateTypeChange({ index, value, values }) {
      if (index < 0) return;
      this.decorateTypeObj.isShow = false;

      // this.form.decorationType = this.decorateTypeObj.value = value[0].value;
      this.decorateTypeObj.name = value[0].name;
    },
    attachmentAssembly() {
      const list = this.form.decorationApply
      if (Array.isArray(list) && list.length) {
        list.forEach(item => {
          const { resPath, fileDetailType } = item
          this.fileData.some(item => {
            if (item.fileDetailType == fileDetailType) {
              item.fileList = [{url: resPath}]
              return true
            }
          })
        })
      }
      console.log(this.fileData, list, 'pp')
    },
    getDecorationDetail(id) {
      const params = {
        pathParams: `/${id}`
      }
      selectDecoration(params).then(res => {
        if (res.success) {
          this.form = res.data || {}
          this.attachmentAssembly()
        }
      })
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vux-label {
  font-weight: normal;
}

::v-deep .vux-cell-box:not(:first-child):before {
  border-top: none;
}

.repair-detail-page {
  background: #f6f7f9;
}
.detail-info-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-info {
  margin: 0 30rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 0 30rpx;
}

.image-style {
  width: 110rpx;
  height: 110rpx;
  border-radius: 16rpx;
  background: pink;
  margin-bottom: 10rpx;
  margin-right: 10rpx;
}

.detail-userInfo ::v-deep .weui-cells {
  margin-top: 0;
  padding-top: 20rpx;
  -webkit-border-radius: 16rpx;
  -moz-border-radius: 16rpx;
  border-radius: 16rpx;
}

.detail-userInfo ::v-deep .weui-cells:after {
  border: 0;
}

.detail-userInfo ::v-deep .weui-cells .weui-cell {
  line-height: 216rpx;
}

.detail-userInfo ::v-deep .weui-cells .weui-cell:before {
  border-top: 0;
}

.detail-userInfo ::v-deep .vux-label {
  font-size: 28rpx;
  color: #2c3444;
}

.detail-userInfo ::v-deep .weui-cell__ft.vux-cell-primary.vux-cell-align-left {
  font-size: 28rpx;
  color: #2c3444;
}

.flow-step-style ::v-deep .weui-wepay-flow:last-child {
  height: 60px !important;
}

.flow-step {
  background: #fff;
  margin: 0 110rpx 110rpx;
  padding: 110rpx 110rpx 410rpx;
  -webkit-border-radius: 16rpx;
  -moz-border-radius: 16rpx;
  border-radius: 16rpx;
}

.flow-step ::v-deep .weui-wepay-flow {
  padding: 0;
}

.flow-step ::v-deep .weui-wepay-flow .weui-wepay-flow__bd {
  -webkit-align-items: flex-start;
  align-items: flex-start;
}

.flow-step ::v-deep .weui-wepay-flow .weui-wepay-flow__bd .weui-wepay-flow__line {
  width: 2px;
  margin-left: 4px;
  background: #cad3e7;
}

.flow-step ::v-deep .weui-wepay-flow .weui-wepay-flow__li {
  width: 20rpx;
  height: 20rpx;
  z-index: 0;
}

.flow-step ::v-deep .weui-wepay-flow .weui-wepay-flow__li .weui-wepay-flow__state {
  width: 20rpx;
  height: 20rpx;
  line-height: 20rpx;
  -webkit-border-radius: 10rpx;
  -moz-border-radius: 10rpx;
  border-radius: 10rpx;
  background: #a1a6bb;
}

.flow-step ::v-deep .weui-wepay-flow .weui-wepay-flow__li .weui-wepay-flow__title-right {
  color: #2c3444;
  left: 40rpx;
  top: -10rpx;
  -webkit-transform: translateY(0);
  transform: translateY(0);
}

.flow-step ::v-deep .weui-wepay-flow .weui-wepay-flow__li_done .weui-wepay-flow__state {
  background: var(--app-primary-color);
}

.flow-step .complete-content {
  height: initial;
  white-space: initial;
  color: #566075;
  font-size: 24rpx;
}

.flow-step .complete-info {
  height: initial;
  white-space: initial;
  margin: 10rpx 0;
  font-size: 24rpx;
}

.flow-step .complete-info-person {
  float: left;
  color: #566075;
  padding-right: 20rpx;
  max-width: calc(100vw - 916rpx);
}

.flow-step .complete-info-phone {
  float: left;
  width: 32rpx;
  height: 32rpx;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.flow-step .complete-info-date {
  float: right;
  color: #566075;
}

.detail-cancel-mask,
.service-evaluation-mask {
  height: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(55, 55, 55, 0.6);
}

/*.detail-cancel-model, .service-evaluation-model{
    -webkit-border-radius: 16rpx;
    -moz-border-radius: 16rpx;
    border-radius: 16rpx;
    margin: 0 40px;
    background: #fff;
    position: absolute;
    top: 40%;
    z-index: 1001;
    transform: translateY(-50%);
    padding: 60rpx 0px 110rpx;
  }*/
.detail-cancel-model ::v-deep .weui-dialog,
.service-evaluation-model ::v-deep .weui-dialog {
  padding: 60rpx 0px 110rpx;
  top: -130px;
  width: calc(100% - 160rpx) !important;
  -webkit-border-radius: 16rpx;
  -moz-border-radius: 16rpx;
  border-radius: 16rpx;
}

.detail-cancel-model ::v-deep .weui-dialog .weui-dialog__bd,
.service-evaluation-model ::v-deep .weui-dialog .weui-dialog__bd {
  padding: 0px !important;
}

.detail-buttons {
  width: 50%;
  float: left;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.service-evaluation-model ::v-deep .vux-rater .vux-rater-inner text {
  font-size: 210rpx;
}

.detail-button {
  padding: 16rpx 0;
  -webkit-border-radius: 40rpx;
  -moz-border-radius: 40rpx;
  border-radius: 40rpx;
  text-align: center;
  color: #fff;
}

.detail-cancel {
  background: #d9dce7;
}

.detail-cancel:active {
  color: hsla(0, 0%, 100%, 0.6);
  background-color: #d9dce7;
}

.detail-sure {
  background: var(--app-primary-color);
}

.detail-sure:active {
  color: hsla(0, 0%, 100%, 0.6);
  background-color: var(--app-primary-color);
}

.service-evaluation {
  max-width: 440rpx;
  /*width: 65%;*/
  display: inline-block;
}

.service-evaluation ::v-deep .weui-cells {
  margin-top: 0;
  width: 100%;
  border-radius: 16rpx;
  overflow: inherit;
}

.service-evaluation ::v-deep .weui-cells:before {
  border-top: none;
}

.service-evaluation ::v-deep .weui-cells .weui-cell {
  padding: 20rpx 0 20rpx 110rpx;
}

.service-evaluation ::v-deep .weui-cells .weui-cell .weui-cell__ft {
  margin-top: -3px;
}

.service-evaluation ::v-deep .vux-label {
  font-size: 28rpx;
}

.service-evaluation ::v-deep .vux-rater-inner text {
  font-size: 48rpx;
}

.complain-evaluation {
  margin: 0 110rpx;
  padding: 110rpx 0;
  background: #fff;
  -webkit-border-radius: 16rpx;
  -moz-border-radius: 16rpx;
  border-radius: 16rpx;
}

.complain-evaluation-star ::v-deep view text text {
  font-size: 48rpx;
}

.complain-evaluation-confirm {
  margin-top: 3px;
  height: 40rpx;
  line-height: 116rpx;
  color: #04be02;
  padding: 0 20rpx;
  font-size: 24rpx;
  border: 1px solid #04be02;
  -webkit-border-radius: 20rpx;
  -moz-border-radius: 20rpx;
  border-radius: 20rpx;
  float: right;
}

.identity-type-check {
  border: 1px solid #d9dce7;
  border-radius: 50%;
  width: 40rpx;
  height: 40rpx;
  padding: 0 0;
}

.identity-type-selected {
  // background: url("../../assets/images/houseAuth/identity-type-icon.png")
  // no-repeat;
  // background-position: 0;
  // background-size: 100%;
  // border: none;
}

/*一键生成和一键申请按钮*/
.authorize_button {
  width: 45%;
  border-radius: 100rpx;
  font-size: 116rpx;
}

.authorize_button:after {
  border-radius: 100rpx;
  border: none;
}

.authorize_button_refused {
  /*margin-right: 5%;*/
  background-color: #fff;
  border: 1px solid var(--app-primary-color);
  color: var(--app-primary-color);
}

.authorize_button_authorization {
  background-color: var(--app-primary-color);
}

/*一键申请弹出框*/
.remove_authorization .remove_authorization_module {
  margin-bottom: 60rpx;
}

.remove_authorization .remove_authorization_center {
  width: 160rpx;
  margin: 0 auto;
}

.remove_authorization .remove_authorization_icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 32rpx;
}

.remove_authorization .remove_authorization_span {
  font-size: 116rpx;
  color: #2c3444;
}

.remove_authorization ::v-deep .weui-dialog {
  border-radius: 16rpx;
}

.remove_authorization ::v-deep .weui-dialog__bd {
  padding: 48rpx 24rpx 32rpx 24rpx !important;
}

.remove_authorization ::v-deep .weui-dialog__ft {
  display: none;
}

.remove_authorization_buttom {
  background: var(--app-primary-color);
  border-radius: 100px;
}

::v-deep .red {
  color: red;
  margin-right: 3px;
}

::v-deep .lab {
  width: 184rpx;
  text-align: left;
  margin-right: 24rpx;
  display: block;
  line-height: 48rpx;
  font-size: 30rpx;
}

::v-deep .lab2 {
  width: 198rpx;
  text-align: left;
  margin-right: 24rpx;
  display: block;
  font-size: 30rpx;
}

::v-deep .u-form {
  background-color: #fff;
}

.common-bottom-btn-container {
  display: flex;
  height: 120rpx;
  padding: 16rpx 30rpx 16rpx 30rpx;
}
.authorize_button_refused {
  height: 88rpx;
  width: 100%;
  font-size: 36rpx;
  color: var(--app-primary-color);
  text-align: center;
  line-height: 88rpx;
  border: 1px solid var(--app-primary-color);
  border-radius: 50rpx;
}

.text_yzx {
  display: block;
  font-size: 30rpx;
  margin-bottom: 10rpx;
}
.upload-prompt {
  color: #999;
  font-size: 12px;
}

.text_hint {
  font-size: 24rpx;
  color: #999999;
}
</style>
