<template>
  <cl-popup :visible.sync="isShowAddress" direction="bottom" size="916rpx">
    <view class="address-popup" id="addressPopup">
      <text class="address-title">选择地址</text>
      <view class="address-list">
        <scroll-view class="address-scroll" scroll-y="true">
          <cl-radio-group v-model="addressValue" @change="selectChange">
            <cl-radio
              v-for="(item,index) in addessList"
              :key="item.receivingAddressId"
              :label="item.receivingAddressId"
              round
            >{{item.consigneeAddress}}{{item.inputAddress}}</cl-radio>
          </cl-radio-group>
        </scroll-view>
      </view>
      <view class="address-other" @tap="createEditAddr">
        <text>选择其他地址</text>
      </view>
    </view>
  </cl-popup>
</template>

<script>
import commonMethod from '@/js/commonMethod'
export default {
  options: { styleIsolation: 'shared' },
  props: {
    // 显示/隐藏
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    addressData: {
      type: Object,
      default: {}
    }
  },
  computed: {
    // 显示收货地址弹窗
    isShowAddress: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  data() {
    return {
      addressValue: '',
      addessList: [],
      selectedCityCode: ''
    }
  },
  onLoad() {},
  created() {
    this.getAddress()
    uni.$on('changeAddress', this.getAddress)
  },
  methods: {
    // 获取收货地址
    async getAddress() {
      // 获取 memberId
      let { memberId } = commonMethod.getUserStatusInfo()
      const res = await this.$mallApi.data.addrList({hideLoading: true, responseToast: false })
      if (res.statusCode == 200) {
        let { data } = res
        data.forEach(item => {
          if (item.isDefault == 1) {
            this.addressValue = item.receivingAddressId
            this.$emit('update:addressData', item)
          }
        })
        this.addessList = data
      }
    },
    // 选中
    async selectChange(val) {
      let addressData = this.addessList.find(item => item.receivingAddressId == val)
      let {
        receivingAddressId,
        consignee,
        receivingTelephone,
        consigneeAddress,
        inputAddress,
        provinceName,
        cityName,
        countyName,
        streetName,
        memberId
      } = addressData
      this.$emit('update:addressData', addressData)
      let params = {
        memberId,
        receivingAddressId,
        consignee,
        receivingTelephone,
        consigneeAddress,
        inputAddress,
        provinceName,
        cityName,
        countyName,
        streetName,
        isDefault: 1
      }
      console.log('params', JSON.stringify(params))
      uni.showLoading({ title: '设置中' })
      const res = await this.$mallApi.data.editAddr({ hideLoading: true, data: params })
      if (res.statusCode === 200) {
        this.getAddress()
        // this.$parent.getAddrStock()
        this.$emit('getAddrStock')
        this.isShowAddress = false
      } else {
        this.toastTips({ message: res.message })
      }
      uni.hideLoading()
    },
    //打开 选择其他地址
    openSelectCity() {
      this.$refs['selectCity'].openSelect()
    },
    cityConfirm(evt) {
      const { selectedCityName, selectedCityCode } = evt
      // this.areaText = selectedCityName;
      // this.selectedCityData = evt;
    },
    // 选择其他收货地址   --跳到新增页面
    createEditAddr() {
      uni.navigateTo({
        url: '/pages-mall-a/address-mng/create-edit-addr'
      })
    }
  },
  beforeDestroy() {
    uni.$off('changeAddress', this.getAddress)
  }
}
</script>

<style lang="scss" scoped>
::v-deep .cl-radio {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  margin-bottom: 40rpx;
  height: auto;
}
::v-deep .cl-radio__input {
  top: 0;
}
::v-deep .cl-radio__label {
  flex: 1;
  font-size: 26rpx;
  color: $uni-text-color;
  padding-left: 10rpx;
}
::v-deep .cl-radio + .cl-radio {
  margin-left: 0px;
}
cl-popup ::v-deep .cl-popup,
::v-deep .cl-popup {
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.address-popup {
  height: 100%;

  & > .address-title {
    display: block;
    font-size: 30rpx;
    color: $uni-text-color;
    text-align: center;
    padding-bottom: 30rpx;
  }
  /* & > .address-scroll {
    height: 689rpx;
  } */

  .address-list {
    .address-scroll {
      height: 689rpx;
      .addItem {
        padding: 0 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;
        .addItem_text {
          flex: 1;
          display: block;
          font-size: 26rpx;
          color: $uni-text-color;
          padding-top: 8rpx;
          padding-left: 10rpx;
        }
      }
    }
  }
  .address-other {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 70%;
    margin-left: 15%;
    height: 114rpx;
    background-color: #fff;
    @include flx-dsp($jsc: center, $ali: flex-start);
    & > text {
      @include flx-dsp($jsc: center, $ali: center);
      width: 704rpx;
      height: 88rpx;
      background: $uni-color-primary;
      border-radius: 60rpx;
      font-size: 30rpx;
      color: #fff;
    }
  }
}
</style>