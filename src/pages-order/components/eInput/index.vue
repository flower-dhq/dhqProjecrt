<style lang="scss" scoped>
.e-input {
  @include flx-dsp($jsc: center, $ali: start);
  padding: 24rpx 0;
  background: #ffffff;
  flex-wrap: wrap;
  flex-direction: column;
  .e-name {
    font-size: 28rpx;
    color: #333333;
    max-width: 50%;
    text-align: left;
    margin-right: 14rpx;
    margin-bottom: 20rpx;
    @include flx-dsp($jsc: flex-start, $ali: center);
  }
  .textarea-name {
    max-width: unset;
    width: 100%;
    padding-bottom: 14rpx;
  }
  .value-wrap {
    font-size: 28rpx;
    color: #333333;
    text-align: right;
  }
  .radio-wrap {
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
    font-size: 28rpx;
    color: #999999;
    text-align: right;
  }
  .required {
    font-size: 28rpx;
    color: #ff0000;
    padding-left: 2rpx;
  }
  .content {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .textarea-box {
      font-size: 28rpx;
      color: #000000;
      background: #f5f5f5;
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      padding: 20rpx;
    }
  }
  .extra-wrap {
    min-width: 32rpx;
    @include flx-dsp($jsc: flex-end, $ali: start);
  }
}
.pad-input {
  padding: 0;
}
.b-line {
  border-bottom: 1rpx solid #eaeaea;
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
  .datetime-picker-wrap {
    ::v-deep .u-transition {
      position: unset !important;
    }
    // ::v-deep .u-picker__view__column__item {
    //   color: var(--app-primary-color) !important;
    // }
  }
}
</style>

<template>
  <view>
    <view class="e-input" :class="{ 'b-line': bLine, 'pad-input': isShowImg }" @click="onClick">
      <view class="e-name" :class="{ 'textarea-name': type == 'textarea' || type == 'upload' }"> {{ name }}<view v-if="required" class="required"> * </view> </view>
      <view class="content">
        <view v-if="type == 'custom'" :class="value ? 'value-wrap' : 'placeholder-wrap'"> {{ value ? value : placeholder }} </view>
        <view v-else-if="type === 'radio' || type === 'select' || type === 'checkbox' || type === 'DatePicker' || type === 'TimePicker'" :class="showVal ? 'value-wrap' : 'placeholder-wrap'">
          {{ showVal ? showVal : placeholder }}
        </view>
        <u-input v-else-if="type == 'input'" :value="value" @input="inputChange" :placeholder="placeholder" placeholderStyle="font-size: 28rpx;color: #999999;" border="none" fontSize="28rpx" />
        <u-input
          v-else-if="type == 'InputNumber'"
          type="number"
          :value="value"
          @input="inputChange"
          :placeholder="placeholder"
          placeholderStyle="font-size: 28rpx;color: #999999;"
          border="none"
          fontSize="28rpx"
        />
        <!-- <u-textarea   border="surround" :placeholder="placeholder" placeholderStyle="font-size: 28rpx;color: 999999;"></u-textarea> -->
        <textarea v-else-if="type == 'textarea'" :value="value" @input="inputChangeTextarea" :placeholder="placeholder" placeholder-style="font-size: 28rpx;color:#999999" class="textarea-box"></textarea>
        <!-- <view v-else-if="type == 'upload'">
          <u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple :maxCount="10"></u-upload>
        </view> -->
        <view v-else-if="type == 'upload'" class="upload-wrap">
          <e-upload :isUploadImg="isShowImg" :dValue="value" @file-change="fileChange" :projectName="projectName"></e-upload>
        </view>
       <!--  <view v-else-if="type == 'upload' && isAppH5" class="upload-wrap">
          <e-upload-by-app :isUploadImg="isShowImg" :dValue="value" @file-change="fileChange" :projectName="projectName"></e-upload-by-app>
        </view> -->
        <view v-else-if="type == 'Radio'" class="value-wrap">
          <u-radio-group v-model="rVal" placement="row" @change="radioChange">
            <view class="radio-wrap">
              <u-radio
                v-for="(item, index) in columns"
                :key="index"
                customStyle="margin-left: 16rpx;"
                labelColor="#333333"
                size="28rpx"
                labelSize="28rpx"
                :name="item.fieldVal"
                :label="item.fieldLabel"
              ></u-radio>
            </view>
          </u-radio-group>
        </view>
        <slot v-else></slot>
        <view class="extra-wrap">
          <u-icon v-if="isLink" size="32rpx" color="#999999" name="arrow-right"></u-icon>
        </view>
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
          <view
            @click="onSelected(item)"
            class="item-wrap"
            :class="{ active: ((type == 'radio' || type == 'select') && item.fieldVal === dVal) || (type == 'checkbox' && dVal.includes(item.fieldVal)) }"
            v-for="(item, index) in columns"
            :key="index"
          >
            <view class="item-name">{{ item.fieldLabel }}</view>
            <u-icon v-if="(type == 'radio' || type == 'select') && item.fieldVal === dVal" size="40rpx" color="var(--app-primary-color)" name="checkmark"></u-icon>
            <view v-if="type == 'checkbox' && !dVal.includes(item.fieldVal)" class="circle-wrap"></view>
            <u-icon v-if="type == 'checkbox' && dVal.includes(item.fieldVal)" size="40rpx" color="var(--app-primary-color)" name="checkmark-circle-fill"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>

    <view class="datetime-picker-wrap">
      <u-datetime-picker
        v-model="dVal"
        :show="dateShow"
        :minDate="minValueDate"
        :mode="type === 'TimePicker' ? 'time' : mode"
        :formatter="formatter"
        closeOnClickOverlay
        @close="onCancelDate"
        @cancel="onCancelDate"
        @confirm="onConfirmDate"
      ></u-datetime-picker>
    </view>
  </view>
</template>

<script>
import dayjs from "uview-ui/libs/util/dayjs";
import eUpload from '../eUpload/index.vue'
// import eUploadByApp from '@/pages-order/components/eUploadByApp/index'
// import Utils from '@/js/utils'

export default {
  name: "e-input",
  components: {
    'e-upload': eUpload,
  //   'e-upload-by-app': eUploadByApp
  },
  props: {
    type: {
      type: String,
      default: "custom",
    },
    required: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    value: {
      default: "",
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    isLink: {
      type: Boolean,
      default: false,
    },
    bLine: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      default: () => [],
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    title: {
      type: String,
      default: "",
    },
    fieldId:{
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: "确定",
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "date",
    },
    isShowImg: {
      type: Boolean,
      default: false,
    },
    minValue: {
      type: String,
      default: "",
    },
    projectName: {
      type: String,
      default: "",
    },
  },
  computed: {
    showVal() {
      if (this.type === "radio" || this.type === "select") {
        const itemIdx = this.columns.findIndex((ele) => ele.fieldVal === this.value);
        if (itemIdx > -1) {
          return this.columns[itemIdx].fieldLabel;
        }
      } else if (this.type === "checkbox") {
        if (this.value) {
          const list = this.columns.filter((ele) => this.value.includes(ele.fieldVal));
          const names = list.map((ele) => ele.fieldLabel);
          return names.join(",");
        }else{
          return '';
        }
      } else if (this.type === "DatePicker") {
        if (this.mode === "datetime" && this.value) {
          return dayjs(this.value).format("YYYY-MM-DD HH:mm");
        } else {
          return this.value;
        }
      } else if (this.type === "TimePicker" && this.value) {
        return this.value.substring(0, this.value.length - 3);
      }
      return "";
    },
    formatType() {
      if (this.mode === "datetime") {
        return "YYYY-MM-DD HH:mm:00";
      }
      return "YYYY-MM-DD";
    },
    minValueDate() {
      if (this.minValue) {
        return dayjs(this.minValue).valueOf();
      } else {
        return dayjs("2013-01-01").valueOf();
      }
    },
  },
  data() {
    return {
      pickerShow: false,
      dateShow: false,
      dVal: "",
      rVal: this.value,
      isAppH5: false,
    };
  },
  methods: {
    onSelected(e) {
      if (this.type == "radio" || this.type == "select") {
        this.dVal = e.fieldVal === this.dVal ? "" : e.fieldVal;
        this.$emit("input", this.dVal);
        this.pickerShow = false;
      } else if (this.type === "checkbox") {
        let Idx = this.dVal.findIndex((ele) => ele === e.fieldVal);
        if (Idx > -1) {
          this.dVal.splice(Idx, 1);
        } else {
          this.dVal.push(e.fieldVal);
        }
      }
      this.$emit("dataChange");
    },
    onConfirm() {
      this.$emit("input", this.dVal.join(","));
      this.pickerShow = false;
    },
    onConfirmDate(data) {
      if (this.type === "DatePicker") {
        this.dVal = dayjs(data.value).format(this.formatType);
        this.$emit("input", this.dVal);
      } else {
        this.dVal = data.value;
        this.$emit("input", this.dVal + ":00");
      }
      this.dateShow = false;
    },
    onCancelDate() {
      this.dateShow = false;
    },
    onClick() {
      if (this.type === "custom") {
        this.$emit("on-click");
      } else if (this.type == "radio" || this.type == "select") {
        this.dVal = this.value;
        this.pickerShow = true;
      } else if (this.type === "checkbox") {
        console.log("checkbox",this.value)
        this.dVal = this.value ? this.value.split(",") : [];
        this.pickerShow = true;
      } else if (this.type === "DatePicker") {
        this.dVal = dayjs(this.value || new Date()).format(this.formatType);
        this.dateShow = true;
      } else if (this.type === "TimePicker") {
        let val = this.value || "00:00:00";
        this.dVal = val.substring(0, val.length - 3);
        this.dateShow = true;
      }
    },
    inputChange(val) {
      this.$emit("input", val);
    },
    inputChangeTextarea(data) {
      this.$emit("input", data.detail.value);
    },
    radioChange(val) {
      console.log(333, val, this.rVal);

      this.$emit("input", val);
      this.$emit("dataChange");
    },
    fileChange(list) {
      const fileList = list.map((item) => ({
        fid: item.fid,
        fName: item.fName || "",
        resPath: item.resPath,
      }));
      if (this.isCustom) {
        let fileUrls = list.map((ele) => ele.resPath);
        this.$emit("input", fileUrls);
        this.$emit("dataChange", fileList, true, this.fieldId);
      } else {
        let fileIds = list.map((ele) => ele.fid);
        this.$emit("input", fileIds.join(","));
        this.$emit("dataChange", fileList);
      }
    },
    dateChange(data) {
      if (this.type === "DatePicker") {
        this.dVal = dayjs(data.value).format(this.formatType);
      } else {
        this.dVal = data.value;
      }
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      if (type === "hour") {
        return `${value}时`;
      }
      if (type === "minute") {
        return `${value}分`;
      }
      return value;
    },
  },
};
</script>
