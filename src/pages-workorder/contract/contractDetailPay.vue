<template>
  <view class="page-panel" :style="[THEME_CSS_VAR]">
    <view class="title-warp">
      <view style="padding: 24rpx 30rpx;background: #fff;border-radius: 12rpx;">
        <view class="flex-sb">
          <text class="font-weight">{{processDetail.serialNumber}}</text>
          <text class="orange font30" :class="[processDetail.contractStatusText=='已终止'||processDetail.contractStatusText=='已废弃'?'grey9':'']">{{processDetail.contractStatusText}}</text>
        </view>
        <view class="company-line">
          {{processDetail.customerName}} | {{processDetail.projectName}}
        </view>
        <view class="btn-line">
          <view class="btn">{{processDetail.contractCategoryText}}</view>
        </view>
      </view>
    </view>
    <view class="info-warp">
      <view style="background: #fff;border-radius: 12rpx; padding-bottom: 18rpx;">
        <view class="line-warp">
          <text>基础信息</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">合同名称：</text>
          <text class="gray">{{processDetail.contractName}}</text>
        </view>
        <view class="border-bottom font28" v-if="processDetail.fwContractId">
          <text class="laber-name">关联主合同：</text>
          <text class="gray">{{processDetail.fwContractId}}</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">合同编号：</text>
          <text>{{processDetail.serialNumber}}</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">金额/条款变更：</text>
          <text class="gray">{{processDetail.figureOrClauseAlteration == 1?'是':'否'}}</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">开始时间：</text>
          <text class="gray">{{processDetail.startDate}}</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">结束时间：</text>
          <text class="gray">{{processDetail.endDate}}</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">部门会签审批人：</text>
          <text class="gray">{{processDetail.customerName}}</text>
        </view>
        <view class="border-bottom font28">
          <text class="laber-name">备注：</text>
          <text class="gray">{{processDetail.remark}}</text>
        </view>
      </view>
    </view>
    <view class="hetong-warp">
      <view style="background: #fff;border-radius: 12rpx; padding-bottom: 18rpx;">
        <view class="line-warp">
          <text>应收费项目</text>
        </view>
        <view style="padding: 0 30rpx;">
          <view class="hetong-item" v-for="(item,index) in contentList" :key="index">
            <view class="flex-sb mb-30">
              <text class="font-30 grey">{{item.fiName}}</text>
            </view>
            <view class="icon-line" style="margin-bottom: 24rpx;">
              <view class="iconItem font-28">
                每期应收：
                <text>￥{{item.receivableAmount}}</text>
              </view>
              <view class="iconItem font-28">
                计费周期：
                <text>{{item.chargeCpFixDay}}</text>
              </view>
            </view>
            <view class="icon-line">
              <view class="iconItem font-28">
                开始时间：
                <text>{{item.startDate.split(' ')[0]}}</text>
              </view>
              <view class="iconItem font-28">
                结束时间：
                <text>{{item.endDate.split(' ')[0]}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="money-warp" v-if="bailLists.length">
      <view style="background: #fff;border-radius: 12rpx; padding-bottom: 18rpx;">
        <view class="line-warp">
          <text>保证金</text>
        </view>
        <view style="padding: 0 30rpx;">
          <view class="money-item" v-for="(item,index) in bailLists" :key="index">
            <view class="flex-sb mb-30">
              <text class="font-30 grey">{{item.fiName}} | ￥{{item.receivableAmount}}</text>
              <!-- <text class="font-30 font-weight">￥{{item.receivableAmount}}</text> -->
            </view>
            <view class="mb-10 font">
              账期：{{item.chargePeriod}}
            </view>
            <view class="font">
              房间：{{item.roomsCode}}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="file-warp" v-if="fileLists.length">
      <view style="background: #fff;border-radius: 12rpx; padding-bottom: 18rpx;">
        <view class="line-warp">
          <text>合同附件</text>
        </view>
        <view class="border-bottom-30 flex-sb" v-for="(item, index) in fileLists" :key="index">
          <text class="font-28">{{item.fileName}}</text>
          <view class="flex">
            <text class="font-28 blue" @click="previewImg(item)">查看</text>
            <u-icon name="arrow-right" color="#1989F7" size="16"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <u-safe-bottom />
  </view>
</template>

<script type="text/ecmascript-6">
import { 
  getHouseContractInfo,
  getLeasingFileInfoList, //合同附件
  getDetailBySerialNumber,  //有偿合同详情
} from '@/service/leasing'
export default {
  name: "",
  data() {
    return {
      serialNumber: '',
      processDetail: {},  //详情信息
      contentList: [],  // 合同内容
      bailLists: [],  // 保证金列表
      fileLists: [],  // 合同附件
    }
  },
  components: {},
  onLoad(option) {
    console.log('option===',option)
    this.serialNumber = option.serialNumber
    // this.getContractDetail()
    this.getlBySerialNumberDetail()
    this.getFileList()
  },
  methods: {
    // 获取房屋合同详情
    getContractDetail() {
      let params = {
        data: {
          serialNumber: this.serialNumber
        }
      }
      getHouseContractInfo(params).then(res => {
        this.processDetail = res?.data?.houseContractBaseInfo || {};
        // this.setFeeItem(res.data.houseContractItemInfo);
        this.contentList = res?.data?.houseContractItemInfo || [];
        this.bailLists = res?.data?.houseContractDepositInfo || [];
      })
    },
    // 获取有偿合同详情
    getlBySerialNumberDetail() {
      let params = {
        data: {
          serialNumber: this.serialNumber
        }
      }
      getDetailBySerialNumber(params).then(res=>{
        console.log('有偿===',res)
         this.processDetail = res?.data || {}
         this.contentList = res?.data?.feeItemSettingList || []
         this.bailLists = res?.data?.houseContractDepositInfo || []
         this.processDetail.startDate = uni.$u.timeFormat(this.processDetail.startDate, 'yyyy-mm-dd')
         this.processDetail.endDate = uni.$u.timeFormat(this.processDetail.endDate, 'yyyy-mm-dd')
      })
    },
    // 合同附件
    getFileList() {
      let params = {
        data: {
          relationType: 1,
          fkId: this.serialNumber
        }
      };
      getLeasingFileInfoList(params).then(res => {
        this.fileLists = res?.data || [];
      });
    },
    // 下载
    getDown(item) {
      console.log('下载中')
    },
    // 查看图片
    previewImg(item) {
      var reg = /\.(png|jpg|gif|jpeg|webp)$/;
      reg.test(item.fileName)
      if (reg.test(item.fileName)) {
        uni.previewImage({
          current: 0,
          urls: [item.filePath]
        });
      }else {
        this.previewFile(item)
      }
    },
    previewFile(item) {
      uni.showLoading({title:'加载中'})
      //后端返回的文件地址
      uni.downloadFile({
      // url: item.value, filePath: wx.env.USER_DATA_PATH + '/' + item.name + '.' + item.value.split('.')[item.value.split('.').length - 1],
      url: item.filePath,
      filePath: wx.env.USER_DATA_PATH + '/' + item.fileName + '.' + item.fileName.split('.')[item.fileName.split('.').length - 1],
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
    // 获取授权判断是否授权相册
    getSaveImg(){ 
      // var str= this.hbUrl[0].replace("data:image/jpeg;base64,",""); 
      let str = 'https://thirdwx.qlogo.cn/mmopen/vi_32/icMgtUCNNSmbPzrGpZeo5cl0G6m1mS50aS6TiaVvytcZt3UGPqHicc3dKNh1Qva6U0wXcAhZ2bonyCFFHPial21nicQ/132'
      let that = this;
      uni.getSetting({
        success: (res)=>{
          console.log('uni设置',res)
          if (!res.authSetting["scope.writePhotosAlbum"]){
              uni.showModal({
                  title: '警告',
                  content: '检测到您没您未授权相册权限,点击确定获取授权。',
                  success: function (res) {
                  console.log(res)
                  if (res.confirm) {
                  uni.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                          // 用户已经同意
                          that.saveImgToAlbum(str);
                      },
                      fail(err){
                          console.log(err)
                          if (err.errMsg == 'authorize:fail 系统错误，错误码：-12006,auth deny') {
                          uni.showModal({
                              content: '检测到您没打开授权相册功能权限，是否去设置打开？',
                              confirmText: "确认",
                              cancelText: '取消',
                              success: (res) => {
                                  if (res.confirm) {
                                      uni.openSetting({
                                          success: (res) => {
                                          console.log(res);
                                          }
                                      })
                                  } else {
                                  console.log('取消');
                                  }
                              }
                          })
                                          
                          }
                      //  console.log('用户拒绝授权相册') 
                          
                      }
                      })		 
                  }
                  }
              })
          }else{
            console.log('执行这里')
            that.saveImgToAlbum(str);
          }
        },
        fail: () => {
          console.log('点击了拒绝')
        }
      })
    },
    // 保存二维码图片到相册
    saveImgToAlbum(qrcode) {
      console.log('qrcode===',qrcode)
      var fileManager = uni.getFileSystemManager();
      console.log('fileManager===',fileManager)
      fileManager.writeFile({
        filePath: wx.env.USER_DATA_PATH+'/img.jpg', // 指定图片的临时路径
        data: qrcode, // 要写入的文本或二进制数据
        encoding: 'base64', // 指定写入文件的字符编码
        success: res => {
          console.log('写入文件成功', res)
          console.log(wx.env.USER_DATA_PATH + '/img.jpg')
          uni.saveImageToPhotosAlbum({ // 保存图片到相册
            filePath: wx.env.USER_DATA_PATH + '/img.jpg',
            success: function (res) {
              console.log('保存成功', res)
              uni.showToast({
                title: '保存成功',
              })
            },
            fail: function (err) {
              console.log('保存失败', err)
            }
          })
        },
        file: err => {
          console.log('写入文件失败', err)
        }
      })
    }, 
  }
}
</script>

<style lang="scss" scoped>
  .page-panel {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background: #F9F9F9;
  }
  .flex-sb {
    display: flex;
    justify-content: space-between;
  }
  .title-warp {
    padding: 24rpx 20rpx 0;
    .company-line {
      font-size: 26rpx;
      color: #666;
      margin: 20rpx 0;
    }
    .btn-line {
      .btn {
        padding: 0 8rpx;
        height: 46rpx;
        line-height: 46rpx;
        text-align: center;
				display: inline-block;
        color: #1989F7;
        background-color: #e6f3fe;
        border-radius: 6rpx;
        font-size: 22rpx;
      }
    }
  }
  .line-warp {
    padding: 30rpx;
    color: #333;
    font-size: 30rpx;
    font-weight: bold;
    border-bottom: 1px solid #EBEBEB;
  }
  .info-warp, .file-warp {
    padding: 24rpx 20rpx 0;
    color: #333;
    font-size: 28rpx;
  }
  .hetong-warp {
    padding: 24rpx 20rpx 0;
    font-size: 24rpx;
    color: #666;
    .hetong-item {
      padding: 30rpx 0;
      /* border-bottom: 1px solid #F9F9F9; */
      border-bottom: 1px solid #EBEBEB;
      .icon-line {
        display: flex;
        flex-direction: row;
        .iconItem {
          width: 50%;
          display: flex;
          align-items: center;
        }
      }
    }
    .hetong-item:last-child {
      border-bottom: none;
    }
  }
  .money-warp {
    padding: 24rpx 20rpx 0;

    .money-item {
      padding: 30rpx 0;
      .icon-line {
        color: #333;
        font-size: 28rpx;
        display: flex;
        flex-direction: row;
        .iconItem {
          width: 50%;
          display: flex;
          align-items: center;
        }
      }
    }
    .money-item:last-child {
      border-bottom: none;
    }
  }
  .font-weight {
    font-size: 30rpx;
    color: #222;
  }
  .orange {
    color: #FF8A15;
  }
  .font30 {
    font-size: 30rpx;
  }
  .font28 {
    font-size: 28rpx;
  }
  .laber-name {
    width: 240rpx;
    display: inline-block;
  }
  .border-bottom {
    color: #666;
    padding: 16rpx 30rpx;
  }
  .font {
    font-size: 28rpx;
    color: #666;
  }
  .mb-10 {
    margin-bottom: 16rpx;
    color: #666;
    font-size: 28rpx;
  }
  .img-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
  }
  .font-30 {
    font-size: 30rpx;
  }
  .font-28 {
    font-size: 28rpx;
  }
  .font-weight {
    font-weight:bold;
  }
  .mb-30 {
    margin-bottom: 30rpx;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .blue {
    color: #1989F7;
  }
  .grey {
    color: #222;
  }
  .gray {
    color: #333;
  }

  .border-bottom-30 {
    padding: 30rpx;
    font-size: 28rpx;
    color: #333;
  }
  .grey9 {
    color: #999 !important;
  }
</style>
