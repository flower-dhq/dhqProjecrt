<template>
  <view class="container" :style="[THEME_CSS_VAR]">
    <view style="background-color: #fff; margin: 10px 16px 65px;">
      <view style="margin-bottom: 10px">
        <u--textarea
          v-model="approveContent"
          height="100"
          :placeholder="requestData.type == '0' ? '请输入评价' : '请输入审批意见'"
          border="none"
        >
        </u--textarea>
      </view>
      <!-- 动态表单 目前只支持文本和数字框 -->
      <template v-if="requestData.formData">
        <view  v-for="(formItem, formIndex) in requestData.formDataJson" :key="formIndex" style="margin-bottom: 10px">
          <!-- <van-field
            style="margin-bottom: 10px"
            v-model="formItem.value"
            :label="formItem.name"
            :type="formItem.type == 'string' ? 'textarea' : 'number' "
            :autosize="{ minHeight: 100 }"
            :placeholder="'请输入' + formItem.name"
          /> -->
          <u--textarea
            v-if="formItem.type == 'string'"
            v-model="formItem.value"
            :placeholder="'请输入' + formItem.name"
            height="100">
          </u--textarea>
          <u--input
            v-else
            v-model="formItem.value"
            type="number"
            :placeholder="'请输入' + formItem.name"
            border="surround"
            clearable
          ></u--input>
        </view>
      </template>
      <view style="margin-left: 16px;">
        <u-upload name="upload" :fileList="fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
          @delete="delFile" />
      </view>
    </view>
    <!-- <van-icon name="plus" /> -->
    <view class="footer-btn">
      <u-button
        type="primary"
        block
        style="width: 80%;"
        @click="submitApprove"
        color="#2760ff"
        :customStyle="{ height: '52px' }"
        >提交</u-button
      >
    </view>
  </view>
</template>

<script type="text/ecmascript-6">
// uploadMutiFile
import { uploadMutiFile } from '@/service/landcrm'
import { saveComment, executeApprove } from '@/service/activiti'
export default {
  data() {
    let { O_USER_INFO } = this.$constant
    let userInfo = this.$utils.storageAction({ key: O_USER_INFO, action: 'get' })
    return {
      requestData: {},
      approveContent: '',
      fileList: [],
      uploadFileList: [],
      uploadFiles: '',
      userInfo: userInfo,
      companyId: userInfo.companyId ? userInfo.companyId : this.$appConfig.COMPLANY_ID,
      fromPage:'',
      createdData:'',
    }
  },
  components: {},
  onLoad(option) {
    let query = option;
    console.log('参数==', query)
    this.fromPage = option.fromPage //是否来自待办页面
    this.createdData = option.createdData //是否来自待办页面
    if (query.type == '0') {
      uni.setNavigationBarTitle({ title: '评价' })
    }else if(query.type == '1') {
      uni.setNavigationBarTitle({ title: '同意' })
      this.approveContent = '通过'
    }else if(query.type == '2') {
      uni.setNavigationBarTitle({ title: '驳回' })
      this.approveContent = '驳回'
    }
    if (query.formData) {
      let formDataJson = JSON.parse(query.formData)
      query.formDataJson = formDataJson.map(item => {
        return {
          ...item,
          value: ''
        }
      })
    }

    this.requestData = query
  },
  methods: {
    afterRead(evt) {
      uploadMutiFile({ filePath: evt.file.url, name: 'file' }).then(res => {
        console.log('上传成功==', res)
        if (res.result == '1' && res.fileInfo.resPath != '-1') {
          const file = res.fileInfo || {};
          // this.fileList.push({ ...file, url: file.resPath });
          this.fileList.push({
            fileId: file.fid,
            fileName: file.fName,
            filePath: file.resPath,
            url: file.resPath });
        }else {
          uni.showToast({ title: '上传失败', icon: 'none' })
        }
      })
    },
    submitApprove() {
      console.log('提交==', this.requestData)
      if (this.requestData.type == '1' || this.requestData.type == '2') {
        this.savaApprove()
      }else {
        this.uploadImg()
      }
    },
    // 删除照片
    delFile(evt) {
      this.fileList.splice(evt.index, 1);
    },
    // 评论提交
    uploadImg() {
      let params = {
        header: {
          'x-userId-header': this.userInfo.userId,
          'x-companyid-header': this.companyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
        },
        data: {
          auditItemId: this.requestData.approveItemId,
          commentUserId: this.userInfo.userId, // 审批任务的代办人ID
          commentUserAccount: this.userInfo.userName, //备注人账号
          commentUserName: this.userInfo.userName, // 操作人
          attachment: '',
          comments: this.approveContent,
        },
        hideLoading: true
      }
      if (this.fileList.length > 0) {
        params.data.attachment = JSON.stringify(this.fileList)
      }
      if (!this.approveContent && !params.data.attachment) {
        uni.showToast({
          title: '评论或附件不可为空',
          icon: 'none'
        })
        return
      }

      console.log('评论参数==', params)
      saveComment(params).then((res) => {
        if (res.status == 200) {
          this.approveContent = ''
          this.fileList = []

          uni.showToast({
            title: '评论成功',
            icon: 'success'
          })
          if(this.fromPage=='todoTask'){
            // uni.navigateTo({
            //   url: '/pages-todoTask/todo-task/todoTask'
            // })
            uni.navigateBack({
              delta: 2
            });
            uni.$emit('nextTask', {
              createdData: this.createdData
            });
          }else{
            uni.navigateTo({
              url: '/pages-approve/approveList'
            })
          }
        }else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    },
    savaApprove() {
      let params = {
        header: {
          'x-userId-header': this.userInfo.userId,
          'x-companyid-header': this.companyId,
          // 'x-userId-header': 2082395,
          // 'x-companyid-header': 389,
          "Content-Type": "application/json",
        },
        data: {
          approveItemId: this.requestData.approveItemId,
          actTaskId: this.requestData.actTaskId, //任务ID
          approveUserId: this.userInfo.userId, // 审批任务的代办人ID
          apvFlag: this.requestData.type, //审批结果(1:通过,2:驳回)
          approveContent: this.approveContent, //审批内容
          attachment: '',
        },
        hideLoading: true
      }
      if (this.fileList.length > 0) {
        params.data.attachment = JSON.stringify(this.fileList)
      }
      if (!this.approveContent && !params.data.attachment) {
        uni.showToast({
          title: '审批意见或附件不可为空',
          icon: 'none'
        })
        return
      }
      if(this.requestData.formDataJson) {
        for(let i = 0; i < this.requestData.formDataJson.length; i++) {
          if(this.requestData.formDataJson[i].isRequired) {
            if((this.requestData.formDataJson[i].type == 'string' && !this.requestData.formDataJson[i].value) || (this.requestData.formDataJson[i].type == 'long' && this.requestData.formDataJson[i].value === 0)) {
              uni.showToast({
                title: '请填写' + this.requestData.formDataJson[i].name,
                icon: 'none'
              })
              return
            }
          }
        }
        params.data.formDataJson = this.requestData.formDataJson
      }
      console.log('params==', params)


      executeApprove(params).then(res => {
        if (res.status == 200) {
          this.approveContent = ''
          this.fileList = []
          this.uploadFileList = []

          uni.showToast({
            title: '提交成功',
            icon: 'success'
          })
          if(this.fromPage=='todoTask'){
            // uni.navigateTo({
            //   url: '/pages-todoTask/todo-task/todoTask'
            // })
            uni.navigateBack({
              delta: 2
            });
            uni.$emit('nextTask', {
              createdData: this.createdData
            });

          }else{
            uni.navigateTo({
              url: '/pages-approve/approveList'
            })
          }

        }else {
          uni.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .container {
    background: #F9F9F9;
    padding-top: 8px;
    height: 100%;
  }
  .footer-btn {
    /* position: fixed;
    bottom: 20px;
    left: 10%; */
    width: 80%;
    margin: 0 auto;
  }
  ::v-deep .van-field__label {
    display: none;
  }
</style>
