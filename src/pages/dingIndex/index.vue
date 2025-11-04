<template>
  <view class="page-box">
    <view>
      <view class="nav-box">
        <u-tabs ref="t1" :inactiveStyle="{ color: '#666666', 'font-size': '26rpx' }"
          :activeStyle="{ color: '#2761FF', 'font-size': '26rpx' }" lineColor="#2761FF" lineWidth="30"
          :list="tabList" :current="tabCurrent" @click="change"></u-tabs>
      </view>
      <view class="menu-box">
        <view class="menu-cont" v-for="(item,i) in myMenuData" :key="i">
          <view class="menu-title">{{ item.label }}</view>
          <view class="menu-list">
            <view class="menu-item" v-for="(data,i2) in item.list" @click="skip(data)" :key="i2">
              <image class="img" width="24" height="24" :src="require(`@/static/index/${data.icon}.png`)"></image>
              <view class="text">{{ data.name }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <template v-if="noPermissions">
      <view class="lockBox">
        <view>
          <image :src="require(`@/static/theme-default/common/lock.png`)"></image>
        </view>
        <view class="lock-text">您没有权限访问该页面</view>
        <view class="lock-text2">如需访问，请联系系统管理员开通权限</view>
        <view class="lock-btn" slot="confirmButton">
          <navigator open-type="exit" target="miniProgram" class="close-btn complete">我知道了</navigator>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import utils from '@/js/utils';
import { menuList } from './menu'
import { getFunctionButtons2 } from '@/service/landcrm'

  export default {
    data(){
      return{
        tabList:[],
        tabCurrent:0,
        allMenuList:[],
        myMenuData:[],
        menuList:[],
        noPermissions:false
      }
    },

    created(){
      this.getMenu()
    },

    onLoad(){
      let res1 = {status: "200", success: true, statusCode: 200, data: {userId: "2063770", userName: "管理员", userAccount: "ybtestsadmin", telephone: "", companyId: "438", token: "4bd787ade68a7b7fae8c0b487f6e28c5", isEnableQw: "1", wechatUserId: "WangFuGui"}, message: "成功"}
      const { IS_AUTH, TOKEN, O_USER_INFO } = this.$constant;
        utils.storageAction({ key: IS_AUTH, action: 'set', value: '1' });
        utils.storageAction({ key: TOKEN, action: 'set', value: res1.data.token });
      utils.storageAction({ key: O_USER_INFO, action: 'set', value: res1.data });
    },

    methods:{
      // 初始菜单
      initData(list){
        this.myMenuData = list
        let arr = [
          {name:'全部'}
        ]
        list.forEach(item =>{
          arr.push({
            name: item.label
          })
        })
        this.tabList = arr
      },

      //获取菜单权限
      async getMenu() {
        const { O_USER_INFO } = this.$constant
        const userInfo = utils.storageAction({ key: O_USER_INFO, action: 'get' })

        const params = {
          data: {
            userId: userInfo.userId,
            menuTypes: 101,
            belongSystem: 'gj_applet'
          },
          hideLoading: true,
          responseToast: false,
        }
        const res = await getFunctionButtons2(params).finally(() => {
          uni.hideLoading()
        })

        const myData = res?.data?.[0]?.items ?? []
        if (res.resultCode !== 200 || myData.length == 0) {
          // 跳转到无权限页面
          this.noPermissions = true
          return
        }

        //过滤菜单权限
        let tempMenuList = JSON.parse(JSON.stringify(menuList))
        tempMenuList.forEach(item =>{
          let temp = []
          myData.forEach(data =>{
            if(item.menuCode==data.menuCode){
              if(data.items.length>0){
                item.list.forEach(item2 =>{
                  data.items.forEach(data2 =>{
                    if(item2.menuCode==data2.menuCode){
                      item2.name = data2.name
                      temp.push(item2)
                    }
                  })
                })
              }
            }
          })
          item.list = temp
        })

        //过滤没有子菜单分类
        let tempArr = tempMenuList.filter((e)=> {
          return e.list.length>0
        })
        this.allMenuList = tempArr
        this.initData(tempArr)
      },

      //切换分类
      change(e){
        if(e.index==0){
          this.myMenuData = JSON.parse(JSON.stringify(this.allMenuList))
        }else{
          let arr = []
          arr.push(this.allMenuList[e.index-1])
          this.myMenuData = arr
        }
      },

      //跳转功能
      skip({ path, name, showModal }) {
        // if (showModal) {
        //   this[showModal] = true;
        //   return;
        // }
        if (['催收管理', '发票管理'].includes(name)) {
          const title = name == '业户档案' ? '业主档案' : '收费宝'
          uni.navigateTo({ url: `/pages/webview/webview?url=${encodeURIComponent(path)}&title=${title}` })
        } else if (typeof (path) == 'string' && path) {
          uni.navigateTo({ url: path })
        // } else if (typeof (path) == 'function') {
        //   path.call(this)
        } else {
          uni.showModal({
            title: '提示',
            content: '功能暂未开放',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          });
        }
      }
    }
  }
</script>

<style scoped lang="scss">
.page-box{
  box-sizing: border-box;
  background-color: #F3F4F7;
  width: 100%;
  min-height: 100vh;
  padding: 108rpx 32rpx 20rpx;
}
.nav-box{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  margin-bottom: 20rpx;
  z-index: 1;
}
.menu-box{}
.menu-cont{
  margin-bottom: 20rpx;
  border-radius: 16rpx;
  background-color: #fff;
}
.menu-title{
  height: 94rpx;
  line-height: 94rpx;
  padding-left: 32rpx;
  font-size: 30rpx;
  font-weight: bold;
  color: #333333;
  border-bottom: 1px solid rgba(151, 151, 151, 0.10);
}
.menu-list{
  overflow: hidden;
  padding: 16rpx 0;
  box-sizing: border-box;
  .menu-item{
    float: left;
    width: 25%;
    text-align: center;
    padding: 16rpx;
    box-sizing: border-box;
    .img{
      width: 48rpx;
      height: 48rpx;
    }
    .text{
      font-size: 26rpx;
      color: #333;
    }
  }
}
.lockBox {
  min-height: 100vh;
  background: #FFFFFF;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  margin: 0 auto; 
  padding-top: 20%;

  image {
    width: 540rpx;
    height: 300rpx;
  }

  .lock-text {
    font-size: 28rpx;
    font-weight: bold;
    line-height: 30rpx;
    color: #333333;
  }

  .lock-text2 {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 30rpx;
    color: #999999;
    height: 38px;
    line-height: 38px;
  }
  .lock-btn{ 
  display: flex;
  align-items: center;
  justify-content: center;
  }
  .close-btn {
    background: #1989F7;
    font-size: 30rpx;
    color: #FFFFFF;
    width: 330rpx; 
    height: 80rpx;
    line-height: 80rpx; 
  }

}
</style>