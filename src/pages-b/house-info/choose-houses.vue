<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.choose-addr-box{
  font-size: 28rpx;
}
.addr-str{
  height: 86rpx;
  line-height: 86rpx;
  padding-left: 40rpx;
  background-color: #fff;
}
.addr-title{
  padding: 22rpx 0 22rpx 40rpx;
  color: #aaa;
}
.list-cont{
  padding: 0 40rpx;
  background-color: #fff;
  .data-item{
    padding: 22rpx 0;
    border-bottom: 2rpx solid #eee;
  }
  :last-child{
    border-bottom: unset;
  }
}
</style>

<template>
  <view class="choose-addr-box" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="addr-str">{{ address }}</view>
    <view class="addr-title"> {{ levelText }} </view>
    <view class="list-cont">
      <view class="data-item" v-for="(item,i) in addrData" :key="i" @click="selectNextItem(item)"> {{item.assetLocation}} </view>
    </view>
  </view>
</template>

<script>
import { selectAssestsByParentId } from '../../service/wxmanage'
import {mapGetters, mapMutations } from 'vuex'
export default {
  data(){
    return{
      addrTitle:'院区',
      type:0,
      indexFlag:0,
      titleList:[
        { id: 0, name:'院区'},
        { id: 1, name:'街道'},
        { id: 6, name:'楼栋'},
        { id: 2, name:'单元'},
        { id: 3, name:'楼层'},
        { id: 4, name:'房间'}
      ],
      projectId:'',
      parentId:'',
      addrData:[],
      address:'',
      pageCount: 0, // 页面跳转层数
      levelCount: 0, // 
    }
  },

  computed: {
    ...mapGetters('houseAuth', {
      getAuthInfo: 'getAuthInfo',
    }),
    levelText() {
      const index = this.levelCount - 1
      const { name } = this.titleList[index] || {}
      return name || ''
    }
  },

  onLoad(query){
    // this.type = query.type
    // for(let i=0;i<this.titleList.length;i++){
    //   let item = this.titleList[i]
    //   if(this.type==item.id){
    //     this.addrTitle = item.name;
    //     this.indexFlag = i;
    //     break;
    //   }
    // }
    // this.projectId = query.projectId
    // if(query.parentId){
    //   this.parentId = query.parentId
    // }
    // if(query.address){
    //   this.address = query.address
    // }
    // this.getAddrList()
    this.levelCount = this.pageCount = Number(query.pageCount) || 1
    this.initData(query)
  },

  methods:{
    ...mapMutations('houseAuth', [
      'saveAuthInfo'
    ]),

    selectNextItem(item){
    // debugger;
      const { assetId } = item || {}
      const pageCount = this.pageCount
      const geMax = pageCount >= 4
      const { uniPlatform } = uni.getSystemInfoSync();
      const mpWx = uniPlatform == 'mp-weixin'
      // const hasStreet = this.titleList.find(item => item.name == '街道')
      // const parentId = pageCount == 1 && !hasStreet ?  Number(assetId) + 1 : assetId // 院区-街道-楼栋： 跳过街道，直接到楼栋，楼栋assetId可以院区assetId+1
      const parentId =  assetId // 院区-街道-楼栋： 跳过街道，直接到楼栋，楼栋assetId可以院区assetId+1
      // debugger;
      let str = this.address + 
      (item.assetLocation=='默认' ? '' : item.assetLocation + (item.assetType == 5 ? '' : '-')) 
      if(item.assetType == 5){
        let data = this.getAuthInfo
        data.addrDetail = {
          houseId:item.roomId,
          addrstr:str
        }
        data.pageFrom = 'selectAddr'
        this.saveAuthInfo(JSON.parse(JSON.stringify(data)));
        uni.navigateBack({
          delta: mpWx ? Number(pageCount) : this.titleList.length
        })
      } else if (geMax && mpWx) {
        const d = {
          type: item.assetType,
          projectId: item.projectId,
          assetLocation: item.assetLocation,
          parentId: item.assetId,
          address: str
        }
        this.levelCount += 1
        this.initData(d)
      }
      else{

        // let type = this.titleList[this.indexFlag+1].id;
        uni.navigateTo({
          url: `/pages-b/house-info/choose-houses?type=${item.assetType}&projectId=${item.projectId}&assetLocation=${item.assetLocation}&parentId=${parentId}&address=${str}&pageCount=${pageCount + 1}`
        });
      }
    },

    getAddrList(){
      let params = {
        data:{
          projectId:this.projectId,
          parentId: this.parentId
        },
        pathParams:'/1000/1',
      }
      selectAssestsByParentId(params).then( res =>{
        this.addrData = res.data.records
      })
    },
    initData(query = {}) {
      this.type = query.type
      for(let i=0;i<this.titleList.length;i++){
        let item = this.titleList[i]
        if(this.type==item.id){
          this.addrTitle = item.name;
          this.indexFlag = i;
          break;
        }
      }
      this.projectId = query.projectId
      if(query.parentId){
        this.parentId = query.parentId
      }
      if(query.address){
        this.address = query.address
      }
      this.getAddrList()
    }
  }
}
</script>