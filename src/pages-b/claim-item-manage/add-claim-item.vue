<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <cell-text label="标题 *" isDesc border="none" padding="10px" class="flex-start">
      <u-textarea slot="desc" v-model="formObj.title" :height="50" :maxlength="20" placeholder="请输入标题" count border="none" placeholderStyle="font-size: 14px;" />
    </cell-text>
    <view class="gap"></view>
    <cell-text label="详情" isDesc border="none" padding="10px" class="flex-start">
      <u-textarea slot="desc" v-model="formObj.describe" :height="100" :maxlength="1000" placeholder="请描述具体问题" count border="none" placeholderStyle="font-size: 14px;" />
    </cell-text>
    <view class="gap"></view>
    <cell-text label="上传照片 *" isDesc border="none" padding="10px" class="flex-start">
      <u-upload slot="desc" name="upload" :fileList="formObj.fileList" :maxCount="9" previewFullImage @afterRead="uploadImage" @delete="deleteImage" />
    </cell-text>
    <view class="gap"></view>
    <cell-text label="遗失地点 *" isDesc border="none" padding="10px" class="flex-start">
      <u-textarea slot="desc" v-model="formObj.location" :height="40" :maxlength="20" placeholder="请输入地点" count border="none" placeholderStyle="font-size: 14px;" />
    </cell-text>
    <view class="gap"></view>
    <cell-text label="企业名称" border="none" padding="10px">
      <u-input v-model="formObj.companyName" placeholder="选填" border="none" placeholderStyle="font-size: 14px;" />
    </cell-text>
    <cell-text label="联系人 *" border="none" padding="0 10px">
      <u-input v-model="formObj.contactPerson" placeholder="选填" border="none" placeholderStyle="font-size: 14px;" />
    </cell-text>
    <cell-text label="联系电话 *" border="none" padding="10px">
      <u-input v-model="formObj.contactPhone" placeholder="选填" border="none" placeholderStyle="font-size: 14px;" />
    </cell-text>
    
    <view class="button-panel">
      <u-button text="提交" type="primary" :loading="isLoading" @click="saveOrder" />
    </view>

    <u-toast ref="toastRef" />
  </view>
</template>

<script>
import Utils from '@/js/utils'
import CellText from '@/components/cell-text/cell-text.vue'
import { getFindItemDetail, addFindItemOrder, editFindItemOrder } from '@/service/community'
import { uploadMutiFile } from '@/service/landcrm'

/**
 * @query {string|number} id
 */
export default {
  name: 'AddClaimItem',
  components: {
    CellText
  },
  data() {
    const { MEMBER_ID, PROJECT_ID, AREA_ID, O_USER_INFO, USER_TYPE } = this.$constant
    const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })

    return {
      companyId: userInfo.companyId,
      memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
      areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
      userType: Utils.storageAction({ key: USER_TYPE, action: 'get' }),
      formObj: {
        type: 'add',
        id: '',
        title: '',
        describe: '',
        fileList: [],
        location: '',
        companyName: '',
        contactPerson: '',
        contactPhone: ''
      },
      isLoading: false
    }
  },
  async onLoad() {
    const { id } = await Utils.getPageQuery()
    if (!!id || id === 0) {
      // 编辑模式
      await this.getFindItemDetail(id)
    } else {
      // 新增模式
      const { O_USER_INFO } = this.$constant
      const userInfo = Utils.storageAction({ key: O_USER_INFO, action: 'get' })

      this.formObj.companyName = this.userType != '游客' && userInfo.companyName || '',
      this.formObj.contactPerson = userInfo.realName || userInfo.fullName || '',
      this.formObj.contactPhone = userInfo.phoneNumber || userInfo.phone || ''
    }
  },
  methods: {
    // 获取详情
    async getFindItemDetail(id) {
      const res = await getFindItemDetail(id)
      let data = res.data || {}
      this.formObj = Object.assign({}, this.formObj, {
        type: 'edit',
        id: data.id,
        title: data.title,
        describe: data.detail,
        fileList: (data.fileList || []).map(item => ({ id: item.id, status: 'success', type: 'image', url: item.filePath })),
        location: data.address,
        contactPerson: data.contactName,
        contactPhone: data.contactPhone
      })
    },
    // 上传图片
    async uploadImage(event) {
      const message = {
        ...event.file,
        status: 'uploading',
        message: '上传中'
      }
      let tmp = this.formObj.fileList
      tmp.push(message)

      const res = await uploadMutiFile(message.url)
      const fileInfo = res.fileInfo

      let lastIndex = tmp.length - 1
      let item = tmp[lastIndex]
      tmp.splice(lastIndex, 1, {
        ...item,
        url: fileInfo.resPath,
        status: 'success',
        message: ''
      })
    },
    deleteImage(event) {
      this.formObj.fileList.splice(event.index, 1)
    },
    // 提交订单
    async saveOrder() {
      if (this.isLoading) return

      // 校验参数
      const valid = this.validateParams().next().value
      if (!valid.success) {
        this.$refs.toastRef.show({
          type: 'warning',
          message: valid.message
        })
        return
      }

      this.isLoading = true
      const params = this.filterEmpty({
        companyId: this.companyId,
        memberId: this.memberId,
        id: this.formObj.type === 'add' ? undefined : this.formObj.id,
        areaId: this.areaId || '',
        projectId: this.projectId || '',
        fileList: this.formObj.fileList.map(item => ({ id: item.id, filePath: item.url, relateId: this.formObj.id || '' })),
        title: this.formObj.title,
        enterpriseName: this.formObj.companyName,
        contactName: this.formObj.contactPerson,
        contactPhone: this.formObj.contactPhone,
        address: this.formObj.location,
        detail: this.formObj.describe
      })

      let res = {}
      const finallycb = () => {
        this.isLoading = false
      }
      if (this.formObj.type === 'add') {
        res = await addFindItemOrder({ data: params }).finally(finallycb)
      } else if (this.formObj.type === 'edit') {
        res = await editFindItemOrder({ data: params }).finally(finallycb)
      }

      if (res.status == 200) {
        this.$refs.toastRef.show({
          type: 'success',
          message: '提交成功',
          complete: () => {
            // 跳转到列表页面
            uni.redirectTo({
              url: '/pages-b/claim-item-manage/claim-item-list'
            })
          }
        })
      } else {
        this.$refs.toastRef.show({
          type: 'error',
          message: res.message
        })
      }
    },
    // 过滤掉 undefined
    filterEmpty(obj) {
      return Object.keys(obj).reduce((store, key) => {
        if (obj[key] !== undefined && obj[key] !== null) {
          store[key] = obj[key]
        }
        return store
      }, {})
    },
    // 校验参数
    * validateParams() {
      if (!this.formObj.title) yield { success: false, message: '请填写标题' }
      if (!this.formObj.fileList.length) yield { success: false, message: '请上传图片' }
      if (!this.formObj.location) yield { success: false, message: '请填写遗失地点' }
      if (!this.formObj.contactPerson) yield { success: false, message: '请填写联系人' }
      if (!this.formObj.contactPhone) yield { success: false, message: '请填写联系电话' }
      return { success: true }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
}
::v-deep .cell-text {
  font-size: 14px !important;
}
::v-deep .flex-start .cell-text-panel {
  align-items: flex-start;
}
::v-deep .u-textarea {
  padding: 0 0 16px !important;
}
.gap {
  height: 10px;
  background-color: #f6f6f7;
}
.button-panel {
  width: 100%;
  padding: 10px 20px;
  background-color: #f6f6f7;
  box-sizing: border-box;
}
</style>