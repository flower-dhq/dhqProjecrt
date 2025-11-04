<style lang="scss" scoped>
.e-input {
  padding: 30rpx;
  background: #ffffff;
  flex-wrap: wrap;
  @include flx-dsp($jsc: center, $ali: center);
  .e-name {
    font-size: 30rpx;
    color: #333333;
    max-width: 50%;
    text-align: left;
    margin-right: 14rpx;
    @include flx-dsp($jsc: flex-start, $ali: center);
  }
  .textarea-name {
    max-width: unset;
    width: 100%;
    padding-bottom: 14rpx;
  }
  .value-wrap {
    font-size: 30rpx;
    color: #333333;
    text-align: right;
  }
  .radio-wrap{
    flex: 1;
    @include flx-dsp($jsc: flex-end, $ali: center);
    .u-radio {
      margin-left: 16rpx;
    }
    ::v-deep .u-radio__text {
      color: #333333 !important;
    }
  }
  .placeholder-wrap {
    font-size: 30rpx;
    color: #999999;
    text-align: right;
  }
  .required {
    font-size: 30rpx;
    color: #ff0000;
    padding-left: 2rpx;
  }
  .content {
    flex: 1;
  }
  .extra-wrap {
    min-width: 32rpx;
    @include flx-dsp($jsc: center, $ali: center);
  }
}
.pad-input {
  padding: 0;
}
.b-line {
  border: 1rpx solid #eaeaea;
}
.picker-wrap {
  width: 100%;
  .title-wrap {
    padding: 26rpx 48rpx;
    border-bottom: 1px solid #eaeaea;
    @include flx-dsp($jsc: space-between, $ali: center);
    .cancel-wrap {
      color: #999999;
    }
    .confirm-wrap {
      color: var(--app-primary-color);
    }
  }
  .content-wrap {
    max-height: 60vh;
    overflow: auto;
    .item-wrap {
      padding: 30rpx 40rpx;
      color: #333333;
      border-bottom: 1px solid #eaeaea;
      @include flx-dsp($jsc: center, $ali: center);
      .item-name {
        flex: 1;
        font-size: 30rpx;
        margin-right: 10rpx;
      }
      .circle-wrap {
        width: 34rpx;
        height: 34rpx;
        border: 2rpx solid #cccccc;
        border-radius: 50%;
      }
    }
    .active {
      color: var(--app-primary-color) !important;
    }
  }
}
.datetime-picker-wrap ::v-deep .u-transition {
  position: unset !important;
}
</style>

<template>
  <view>
    <view class="e-input" :class="{ 'b-line': bLine, 'pad-input': isShowImg }" @click="onClick">
      <view class="e-name" :class="{ 'textarea-name': type == 'textarea' || type == 'upload' }"> {{ name }}<view v-if="required" class="required"> * </view> </view>
      <view class="content">
        <view v-if="type == 'custom'" :class="value ? 'value-wrap' : 'placeholder-wrap'"> {{ value ? value : placeholder }} </view>
        <view v-else-if="type === 'radio' || type === 'select' || type === 'checkbox' || type === 'DatePicker' || type === 'TimePicker'" :class="showVal ? 'value-wrap' : 'placeholder-wrap'"> {{ showVal ? showVal : placeholder }} </view>
        <u-input v-else-if="type == 'input'" :value="value" @input="inputChange" :placeholder="placeholder" placeholderStyle="font-size: 30rpx;color: #999999;" border="none" inputAlign="right" />
        <u-input v-else-if="type == 'InputNumber'" type="number" :value="value" @input="inputChange" :placeholder="placeholder" placeholderStyle="font-size: 30rpx;color: #999999;" border="none" inputAlign="right" />
        <u--textarea v-else-if="type == 'textarea'" :value="value" @input="inputChange" border="surround" :placeholder="placeholder" placeholderStyle="font-size: 30rpx;color: #999999;"></u--textarea>
        <view v-else-if="type == 'upload' && !isAppH5" class="upload-wrap">
          <e-upload :isUploadImg="isShowImg" :dValue="value" @file-change="fileChange" :projectName="projectName"></e-upload>
        </view>
        <view v-else-if="type == 'upload' && isAppH5" class="upload-wrap">
          <e-upload-by-app :isUploadImg="isShowImg" :dValue="value" @file-change="fileChange" :projectName="projectName"></e-upload-by-app>
        </view>
        <view v-else-if="type == 'Radio'" class="value-wrap">
          <u-radio-group v-model="rVal" placement="row" @change="radioChange">
            <view class="radio-wrap">
              <u-radio customStyle="margin-left: 16rpx;" labelColor="#333333" v-for="(item, index) in columns" :key="index" activeColor="var(--app-primary-color)" :name="item.fieldVal" :label="item.fieldLabel"></u-radio>
            </view>
          </u-radio-group>
        </view>
      </view>
      <view class="extra-wrap">
        <u-icon v-if="isLink" size="32rpx" color="#999999" name="arrow-right"></u-icon>
      </view>
    </view>

    <u-popup :show="pickerShow" closeOnClickOverlay @close="pickerShow = false" safeAreaInsetBottom>
      <view class="picker-wrap">
        <view v-if="type == 'checkbox'" class="title-wrap">
          <view class="cancel-wrap" @click="pickerShow = false">{{ cancelText }}</view>
          <view class="title-name"> {{ title }}</view>
          <view class="confirm-wrap" @click="onConfirm">{{ confirmText }}</view>
        </view>
        <view class="content-wrap">
          <view @click="onSelected(item)" class="item-wrap" :class="{ active: ((type == 'radio' || type == 'select') && item.fieldVal === dVal) || (type == 'checkbox' && dVal.includes(item.fieldVal)) }" v-for="(item, index) in columns" :key="index">
            <view class="item-name">{{ item.fieldLabel }}</view>
            <u-icon v-if="(type == 'radio' || type == 'select') && item.fieldVal === dVal" size="38rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
            <view v-if="type == 'checkbox' && !dVal.includes(item.fieldVal)" class="circle-wrap"></view>
            <u-icon v-if="type == 'checkbox' && dVal.includes(item.fieldVal)" size="38rpx" color="var(--app-primary-color)" name="checkmark-circle-fill"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
    <u-popup :show="dateShow" closeOnClickOverlay @close="dateShow = false" safeAreaInsetBottom>
      <view class="picker-wrap">
        <view class="title-wrap">
          <view class="cancel-wrap" @click="dateShow = false">{{ cancelText }}</view>
          <view class="title-name"> {{ title }}</view>
          <view class="confirm-wrap" @click="onConfirmDate">{{ confirmText }}</view>
        </view>

        <view class="datetime-picker-wrap">
          <u-datetime-picker v-model="dVal" @change="dateChange" :show="dateShow" :minDate="minValueDate" :mode="type === 'TimePicker' ? 'time' : mode" :formatter="formatter" closeOnClickOverlay @close="dateShow = false" :showToolbar="false"></u-datetime-picker>
        </view>
      </view>
    </u-popup>
   </view>
</template>

<script>
import eUpload from '../eUpload/index'
import eUploadByApp from '../eUploadByApp/index'

export default {
  name: 'e-input',
  components: {
    'e-upload': eUpload,
    'e-upload-by-app': eUploadByApp
  },
  options: {
    styleIsolation: 'shared' // 允许样式穿透
  },
  props: {
    type: {
      type: String,
      default: 'custom'
    },
    required: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isLink: {
      type: Boolean,
      default: false
    },
    bLine: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    title: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    isCustom: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'date'
    },
    isShowImg: {
      type: Boolean,
      default: false
    },
    minValue: {
      type: String,
      default: ''
    },
    projectName: {
      type: String,
      default: ''
    }
  },
  computed: {
    showVal() {
      if (this.type === 'radio' || this.type === 'select') {
        const itemIdx = this.columns.findIndex((ele) => ele.fieldVal === this.value)
        if (itemIdx > -1) {
          return this.columns[itemIdx].fieldLabel
        }
      } else if (this.type === 'checkbox') {
        if(!this.value){
          this.value = ''
        }
        const list = this.columns.filter((ele) => this.value.includes(ele.fieldVal))
        const names = list.map((ele) => ele.fieldLabel)
        return names.join(',')
      } else if (this.type === 'DatePicker') {
        if (this.mode === 'datetime' && this.value) {
          return this.$dayjs(this.value).format('YYYY-MM-DD HH:mm')
        } else {
          return this.value
        }
      } else if (this.type === 'TimePicker' && this.value) {
        return this.value.substring(0, this.value.length - 3)
      }
      return ''
    },
    formatType() {
      if (this.mode === 'datetime') {
        return 'YYYY-MM-DD HH:mm:00'
      }
      return 'YYYY-MM-DD'
    },
    minValueDate() {
      if (this.minValue) {
        return this.$dayjs(this.minValue).valueOf()
      } else {
        return this.$dayjs('2013-01-01').valueOf()
      }
    }
  },
  data() {
    return {
      pickerShow: false,
      dateShow: false,
      dVal: [],
      rVal: this.value,
      isAppH5: false
    }
  },
  methods: {
    onSelected(e) {
      if (this.type == 'radio' || this.type == 'select') {
        this.dVal = e.fieldVal === this.dVal ? '' : e.fieldVal
        this.$emit('input', this.dVal)
        this.pickerShow = false
      } else if (this.type === 'checkbox') {
        let Idx = this.dVal.findIndex((ele) => ele === e.fieldVal)
        if (Idx > -1) {
          this.dVal.splice(Idx, 1)
        } else {
          this.dVal.push(e.fieldVal)
        }
      }
      this.$emit('dataChange')
    },
    onConfirm() {
      this.$emit('input', this.dVal.join(','))
      this.pickerShow = false
    },
    onConfirmDate() {
      if (this.type === 'DatePicker') {
        this.$emit('input', this.dVal)
      } else {
        console.log(this.dVal + ':00')
        this.$emit('input', this.dVal + ':00')
      }
      this.dateShow = false
    },
    onClick() {
      if (this.type === 'custom') {
        this.$emit('on-click')
      } else if (this.type == 'radio' || this.type == 'select') {
        this.dVal = this.value
        this.pickerShow = true
      } else if (this.type === 'checkbox') {
        this.dVal = this.value ? this.value.split(',') : []
        this.pickerShow = true
      } else if (this.type === 'DatePicker') {
        this.dVal = this.$dayjs(this.value || new Date()).format(this.formatType)
        this.dateShow = true
      } else if (this.type === 'TimePicker') {
        let val = this.value || '00:00:00'
        this.dVal = val.substring(0, val.length - 3)
        this.dateShow = true
      }
    },
    inputChange(val) {
      this.$emit('input', val)
    },
    radioChange(val) {
      this.$emit('input', val)
      this.$emit('dataChange')
    },
    fileChange(list) {
      if (this.isCustom) {
        let fileUrls = list.map((ele) => ele.resPath)
        this.$emit('input', fileUrls)
      } else {
        let fileIds = list.map((ele) => ele.fileId)
        this.$emit('input', fileIds.join(','))
      }
    },
    dateChange(data) {
      if (this.type === 'DatePicker') {
        this.dVal = this.$dayjs(data.value).format(this.formatType)
      } else {
        this.dVal = data.value
      }
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      if (type === 'hour') {
        return `${value}时`
      }
      if (type === 'minute') {
        return `${value}分`
      }
      return value
    }
  }
}
</script>
