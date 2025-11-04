<template>
  <view class="mod">
    <view class="mod-box">
      <view class="mod-item">
        <span>发票类型</span>
        <view>
          <cl-select v-model="invoicesData.invoiceType" :options="invoicesTypeList"></cl-select>
        </view>
        
      </view>

      <view class="mod-item">
        <span>抬头类型 <i> *</i></span>
        <cl-radio-group v-model="invoicesData.headType" @change="headTypeChange">
          <cl-radio :label="1">个人</cl-radio>
          <cl-radio :label="2">企业</cl-radio>
        </cl-radio-group>
      </view>

      <view class="mod-item">
        <span>发票抬头 <i> *</i></span>
        <input type="text" placeholder="请输入发票抬头信息" v-model="invoicesData.invoiceHead" @input="evt => onInput({evt, key: 'invoiceHead'})"/>
      </view>

      <template v-if="invoicesData.headType == 2">
        <view class="mod-item">
          <span>税号 <i> *</i></span>
          <input @blur="blur_input" type="text" placeholder="请输入纳税人识别号"  v-model="invoicesData.taxNumber" @input="evt => onInput({evt, key: 'taxNumber'})"/>
        </view>
        <view class="mod-item">
          <span>开户银行</span>
          <input @blur="blur_input" type="text" placeholder="选填"  v-model="invoicesData.bankName" @input="evt => onInput({evt, key: 'bankName'})"/>
        </view>
        <view class="mod-item">
          <span>银行账号</span>
          <input @blur="blur_input" type="text" placeholder="选填"  v-model="invoicesData.bankAccount" @input="evt => onInput({evt, key: 'bankAccount'})"/>
        </view>
        <view class="mod-item">
          <span>企业地址</span>
          <input @blur="blur_input" type="text" placeholder="选填"  v-model="invoicesData.companyAddress" @input="evt => onInput({evt, key: 'companyAddress'})"/>
        </view>
        <view class="mod-item">
          <span>企业电话</span>
          <input @blur="blur_input" type="text" placeholder="选填"  v-model="invoicesData.companyPhone" @input="evt => onInput({evt, key: 'companyPhone'})"/>
        </view>
      </template>
      
      <view class="mod-item">
        <span>邮箱</span>
        <input @blur="blur_input" type="text" placeholder="选填" v-model="invoicesData.receiveInvoiceEmailAddress" @input="evt => onInput({evt, key: 'receiveInvoiceEmailAddress'})"/>
      </view>
     

    </view>

    <view class="btn-group">
      <view class="noSubmit" @tap="isSubmit(0)">不开发票</view>
      <view class="submit" @tap="isSubmit(1)">提交申请</view>
    </view>

    <!-- 消息提示 -->
    <cl-toast ref="elMessage"></cl-toast>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data(){
    return {
      invoicesData:{
        invoiceType: 2,  // 发票类型（1-普通发票 2-增值税专用发票)
        headType: 1,    // 抬头类型  (1-个人 2-企业)
        invoiceHead:'', // 发票抬头
        taxNumber:'',   // 税号
        bankName:'',    // 开户银行
        bankAccount:'', // 银行账号
        companyAddress:'',  // 企业地址
        companyPhone:'',    // 企业电话
        receiveInvoiceEmailAddress:'',  // 邮箱
      },
      invoicesTypeList:[
        {
          label: "普通发票",
          value: 1
        },
        {
          label: "增值税专用发票",
          value: 2
        }
      ]

    }
  },
  computed:{
    ...mapState('mall', {
      invoicesInfo: state => state.invoicesInfo
    })
  },
  methods:{
    ...mapMutations({
      updateInvoicesInfo: 'mall/updateInvoicesInfo'		
    }),
    onInput(params = {}) {
      const {evt, key} = params;
      const value = evt.detail.value;

      const regKeys = ["taxNumber", "bankAccount", "companyPhone"]
      const pattern = new RegExp("[\u4E00-\u9FA5]+")  // 中文正则验证
      if(regKeys.includes(key) && pattern.test(value)){
        this.$nextTick(() => {
          this.invoicesData[key] = "";
        })
      }
      // this.invoicesData[key] = value;
    },
    isSubmit(type){
      if(type == 1){
        if(!this.invoicesData.invoiceHead){
          this.$refs.elMessage.open({
            message: '请填写发票抬头！',
            position: 'top'
          })
          return;
        }
        if(this.invoicesData.headType == 2 && !this.invoicesData.taxNumber){
          this.$refs.elMessage.open({
            message: '请填写税号！',
            position: 'top'
          })
          return;
        }
        this.updateInvoicesInfo(this.invoicesData)
      } else {
        this.updateInvoicesInfo(null)
      }
      setTimeout(() => {
        uni.navigateBack()
      },100)
    },
    // 获取上次填写的发票信息
    async getLastInvoiceInfo(){
      let params = {}
      const { data:res } = await this.$mallApi.data.getInvoiceInfo({ params })
      if(res){
        this.invoicesData = res
      }

    },
    headTypeChange(){
      this.invoicesData.taxNumber = ''
      this.invoicesData.bankName = ''
      this.invoicesData.bankAccount = ''
      this.invoicesData.companyAddress = ''
      this.invoicesData.companyPhone = ''
    },
    // 获取发票类型列表
    async getinvoiceTypeList(){
      const params = {
        pathParams: '/orderInvoiceType',
      }
      const { data:res } = await this.$mallApi.data.getConfigByCode(params)
      if(res && res.children.length > 0){
        this.invoicesTypeList = []
        res.children.forEach(item => {
          this.invoicesTypeList.push({
            label: item.configName,
            value: Number(item.configDesc)
          })
        })
      }
    },
    // 失去焦点
    blur_input() {
      setTimeout(function(){
        uni.pageScrollTo({ scrollTop: 0, duration: 0 })
        //为了处理安卓手机键盘弹回后底部空白界面占位
        document.getElementById("a").scrollIntoView()
      },100)
    },
  },
  onLoad(){
    if(this.invoicesInfo) { 
      this.invoicesData = this.invoicesInfo 
    } else { 
      this.getLastInvoiceInfo() 
    }

    this.getinvoiceTypeList()
  },
}
</script>

<style lang="scss" scoped>
.cl-select::v-deep .cl-select__inner .cl-select__icon{
  right: -50rpx;
}

.mod {
  width: 100%;
  height: 100%;
  background: #F2F2F2;
  padding-top: 10rpx;
  box-sizing: border-box;

  .mod-box {
    padding: 0 30rpx;
    background-color: #FFFFFF;

    .mod-item {
      width: 100%;
      height: 100rpx;
      border-bottom: 1px #F6F6F6 solid;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 28rpx;
        color: #333333;

        i {
          display: inline-block;
          color: red;
          font-size: 24rpx;
        }
      }

      input {
        font-size: 28rpx;
        color: #333333;
        text-align: right;

        input::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #999999;
          font-size: 24rpx;
        }

        input:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #999999;
          font-size: 24rpx;
        }

        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #999999;
          font-size: 24rpx;
        }

        input::-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #999999;
          font-size: 24rpx;
        }

      }
    }
  }

  .btn-group {
    width: 100%;
    height: 100rpx;
    font-size: 28rpx;
    line-height: 100rpx;
    text-align: center;
    display: flex;
    position: fixed;
    bottom: 0;

    .noSubmit {
      width: 30%;
      height: 100%;
      background-color: #fff;
      color: #333333;
    }

    .submit {
      width: 70%;
      height: 100%;
      background-color: $uni-color-primary;
      color: #FFFFFF;
    }

  }
}

</style>