<template>
  <u-popup :show="isShow" mode="left" :customStyle="{ width: '100vw', height: '100vh' }">
    <view class="model-panel">
      <view class="report-panel">
        <textarea class="report-textarea" placeholder="汇报进展" placeholder-style="color: #CCCCCC; font-size: 28rpx;" />
        <u-upload name="upload" :fileList="fileList" :maxCount="9" previewFullImage sizeType="compressed" @afterRead="afterRead"
          @delete="deleteImg" />
      </view>
      <view class="footer-panel">
        <u-button text="取消" :customStyle="{ margin: '0', borderColor: THEME_COLOR, color: THEME_COLOR, fontSize: '32rpx', borderTopRightRadius: '0', borderBottomRightRadius: '0' }" @click="closeModel" />
        <u-button text="提交" type="primary" :customStyle="{ margin: '0', fontSize: '32rpx', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }" />
      </view>
    </view>
  </u-popup>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import CellText from '@/components/cell-text.vue'
import { uploadMutiFile } from '@/service/landcrm'

export default {
  name: 'WorkorderModel',
  mixins: [mpMixin],
  components: {
    CellText
  },
  props: {
    show: Boolean,
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fileList: [], // 上传的图片
    }
  },
  computed: {
    isShow: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('update:show', val)
      }
    }
  },
  created() {
  },
  methods: {
    closeModel() {
      this.isShow = false
    },
    // 上传图片
    async afterRead(evt) {
      const res = await uploadMutiFile({ filePath: evt.file.url, name: 'file' })

      const file = res.fileInfo || {}
      this.fileList.push({ ...file, url: file.resPath })
    },
    // 删除图片
    deleteImg(evt) {
      this.fileList.splice(evt.index, 1)
    },
  }
}
</script>

<style lang="scss" scoped>
.model-panel {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F3F4F7;
}
.footer-panel {
  width: 100%;
  display: flex;
  padding: 60rpx 54rpx;
  box-sizing: border-box;
}
.report-panel {
  background-color: #fff;
  box-sizing: border-box;
  padding: 30rpx;

  .report-textarea {
    width: 100%;
    height: 200rpx;
    padding-bottom: 20rpx;
  }
}
</style>