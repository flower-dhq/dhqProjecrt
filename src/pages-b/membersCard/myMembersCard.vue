<template>
    <view class="membership" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
      <view class="membership_card">
        <view class="membership_card_module">
          <view class="membership_card_module_user">
            <view class="membership_card_module_user_portrait">
              <image :src="memberInformationData.headimg" alt=""></image>
            </view>
            <view class="membership_card_module_user_information">
              <h5>{{memberInformationData.nickname}}</h5>
              <span>{{memberTypeData.gradeName}}</span>
            </view>
          </view>
          <view class="membership_card_number">
            {{memberInformationData.memberCard}}
          </view>
          <image :src="require(`@/static/${[THEME_NAME]}/multiplexing/members.png`)" rel="会员卡"></image>
        </view>
      </view>
      <view class="membership_code">
        <view class="membership_code_module">
          <view class="membership_code_module_information">
            <!-- <view id="qrcode" ref="qrcode"></view> -->
            <image  class="qrcode" :src="QrCodeUrl"  v-show="QrCodeUrl"></image>
            <view class="membership_code_module_information_text">
              <span>{{cardNumber}}</span>
              <p>使用时请出示会员卡</p>
            </view>
          </view>
        </view>
      </view>
    </view>
</template>
<script>
  import util from '../../js/utils';
  import {getMemberInfoByApp,getMemberGradePage} from '@/service/wxmanage'
  export default {
    name: "myMembersCard",
    data(){
        const { MEMBER_ID } = this.$constant;
        return {
          memberId: util.storageAction({ key: MEMBER_ID, action: 'get' }),
          memberInformationData:'',//会员卡号信息
          memberTypeData:{},//会员类型数据信息
          cardNumber:'',//二维码下会员卡号
        }
    } ,
    onLoad() {
        let self=this;
        self.memberInformation();
    },
    methods:{
        memberInformation(){
          let self=this;
          const { MEMBER_ID } = this.$constant;
          let params = {
            data:{
            "memberId":util.storageAction({ key: MEMBER_ID, action: 'get' })
            }
          };
          getMemberInfoByApp(params).then(res=>{
             if(res.status=='200'){
               self.memberInformationData=res.data;
               if(res.data.memberGradeId){
                self.memberGradePage(res.data.memberGradeId);
               }
               self.cardNumber=self.memberInformationData.memberCard.replace('No.', '');
            //    self.memberCode();
             }
          })
        },
      memberGradePage(memberGradeId){
          let self=this;
         let params = {
            data:{
                memberGradeId,
            }
          };
         getMemberGradePage(params).then(res=>{
             if(res.status=='200'){
               self.memberTypeData=res.data.records[0];
             }
         });
      },
        memberCode(){
          let self=this;
            setTimeout(function(){
                let qrcode=new QRCode('qrcode', {
                    width: 100,  // 二维码宽度
                    height: 100, // 二维码高度
                    text:self.cardNumber
                })
            },500)
        },
       
    }

  }
</script>

<style lang="scss" scoped>
  .membership{
    padding:28rpx 36rpx 0 36rpx;
    background-color: #F5F5F5;
    height: 100vh;
    box-sizing: border-box;
  }

  .membership_card_module{
    position: relative;
  }
  .membership_card_module >image {
     height: 343rpx;
     width: 100%;
  }
  .membership_card_module .membership_card_module_user{
    position: absolute;
    top:20rpx;
    left: 24rpx;
    overflow: hidden;
  }
  .membership_card_module .membership_card_module_user .membership_card_module_user_portrait{
    width: 80rpx;
    height:80rpx;
    float: left;
    /*background: rgba(255,255,255,0.3);*/
    background: rgba(255,255,255,1);
    border-radius: 100%;
    /* padding: 3px; */
    -webkit-box-shadow: 0px 0px 40rpx 4rpx #cccccc;
    box-shadow: 0px 0px 40rpx 4rpx #cccccc;
    overflow: hidden;
    border: 6rpx solid #fff;
  }
  .membership_card_module .membership_card_module_user .membership_card_module_user_portrait image{
    width: 80rpx;
    height: 80rpx;
  }
  .membership_card_module .membership_card_module_user .membership_card_module_user_information{
    float: left;
    margin-left: 30rpx;
    padding-top: 12rpx;
  }
  .membership_card_module .membership_card_module_user .membership_card_module_user_information h5{
    font-size: 36rpx;
    color:#fff;
    font-weight: bold;
  }
  .membership_card_module .membership_card_module_user .membership_card_module_user_information span{
    font-size: 26rpx;
    color:#fff;
  }
  .membership_card_module .membership_card_number{
    position: absolute;
    bottom:20rpx;
    right: 24rpx;
    font-size: 28rpx;
    color: #fff;
  }

  .membership_code{
    margin-top: 100rpx;
  }
  .membership_code .membership_code_module{
    background-color: #fff;
    width: 80%;
    margin: 0 auto;
    padding: 120rpx 0;
    border-radius: 4px;
  }
  .membership_code .membership_code_module .membership_code_module_information{
    width: 300rpx;
    margin: 0 auto;
  }
 
  .membership_code .membership_code_module .membership_code_module_information .membership_code_module_information_text{
    margin-top: 10rpx;
  }
  .membership_code .membership_code_module .membership_code_module_information .membership_code_module_information_text span{
    font-size: 28rpx;
    color: #767676;
    display: block;
    text-align: center;
  }
  .membership_code .membership_code_module .membership_code_module_information .membership_code_module_information_text p{
    font-size: 26rpx;
    color: #cecece;
    display: block;
    text-align: center;
  }
</style>
