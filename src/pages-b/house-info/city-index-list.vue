<style>
page{
  background:#f5f5f5;
}
</style>
<style lang="scss" scoped>
.list-cell {
  box-sizing: border-box;
  padding: 0 40rpx;
  width: 100%;
  overflow: hidden;
  color: #323233;
  font-size: 28rpx;
  line-height: 48rpx;
  background-color: #fff;
  view{
    padding: 20rpx 0;
    border-bottom: 1px solid #eee;
  }
	}
  .list-cell:last-child view{
    border-bottom: unset;
  }
  ::v-deep .u-index-anchor{
    background-color: #f5f5f5 !important;
    height: 36rpx !important;
  }
  ::v-deep .u-border-bottom{
    // padding-left: 40rpx;
    // height: 44rpx !important;
    border-color: #eee !important;
  }
  ::v-deep .u-index-anchor__text{
    color: #c5c5c5 !important;
  }
  .view-text{
    height: 90rpx;
    line-height: 90rpx;
    padding-left: 40rpx;
    font-size: 28rpx;
    background-color: #fff;
  }
  .title{
    color: #c5c5c5;
    background-color: #f5f5f5;
  }
  ::v-deep .u-index-list__letter {
    display: none;
  }

</style>
<template>
  <view :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
    <view class="view-text title">您的位置</view>
    <view class="view-text" @click="selectCity(currentLocation)">{{ currentLocation }}</view>
    <view class="view-text title">切换城市</view>
    <u-index-list :index-list="indexList">
      <view v-for="(item, index) in dataList" :key="index">
        <!-- #ifdef APP-NVUE -->
        <u-index-anchor :text="indexList[index]"></u-index-anchor>
        <!-- #endif -->
        <u-index-item>
          <!-- #ifndef APP-NVUE -->
          <u-index-anchor :text="indexList[index]"></u-index-anchor>
          <!-- #endif -->
          <view class="list-cell" v-for="(cell, i) in item.cities" :key="i">
            <view @click="selectCity(cell.cityName)">{{cell.cityName}}</view>
          </view>
        </u-index-item>
      </view>
    </u-index-list>
  </view>
</template>
<script>
import utils from '@/js/utils';
import { getCities, geocoder, getCityByLatLon } from '../../service/community'
import {mapGetters, mapMutations } from 'vuex'
import commLogic from '@/js/comm-logic';
export default {
  data(){
    return{
      indexList: [],
      dataList:[],
      projectType:'',
      currentLocation:'',
      latitude:'',
      longitude:'',
      position:{},
       // 页面垂直滑动的距离
    scrollTop: undefined,
    }
  },
  onPageScroll(res) {
    this.scrollTop = e.scrollTop;
  },
  computed: {
    ...mapGetters('houseAuth', {
      getAuthInfo: 'getAuthInfo',
    }),
  },

  onLoad(){
    this.getMemberInfo()
    this.getCityList()
    // #ifdef H5 || APP-NVUE
    this.getLocation()
    // #endif
    // #ifdef  MP-WEIXIN
    this.getFuzzyLocation()
    // #endif
  },

  methods:{
    ...mapMutations('houseAuth', [
      'saveAuthInfo',
      'clearAuthInfo'
    ]),

    selectCity(name){
      let data = this.getAuthInfo;
      data.cityName = name;
      data.pageFrom = "selectCity" //标记从城市列表回新增房产页面
      this.saveAuthInfo(JSON.parse(JSON.stringify(data)));
      let canNavBack = getCurrentPages();  
      if(canNavBack && canNavBack.length>1) {  
        uni.navigateBack({  
          delta: 1 //返回层数，2则上上页 
        });  
      } else {  
        history.back(); //被刷新后，历史栈消失，用这个返回上一层。
      }
    },
    // h5经纬度
    getLocation(){
      let self = this
      uni.getLocation({
			  type: 'wgs84',
        // type: 'gcj02',
        success: function (res) {
        console.log('获取当前位置',res)
        self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。 
        self.currentLocation = '定位中...';  
        self.getLocationAllLJ(self.latitude,self.longitude)
        },
				fail: function (err) {
          console.log('err：' + JSON.stringify(err)); 
					uni.showToast({
					  title: '获取地址失败，将导致部分功能不可用',
						icon:'none'
					});
				}
			});
    },
    // 小程序经纬度
    getFuzzyLocation(){
      let self = this
      uni.getFuzzyLocation({
			  type: 'wgs84',
        // type: 'gcj02',
        success: function (res) {
        console.log('获取当前位置',res)
        self.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        self.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。 
        self.currentLocation = '定位中...';  
        self.getLocationAllLJ(self.latitude,self.longitude)
        },
				fail: function (err) {
          console.log('err：' + JSON.stringify(err)); 
					uni.showToast({
					  title: '获取地址失败，将导致部分功能不可用',
						icon:'none'
					});
				}
			});
    },

    // 根据经纬度获取项目
    getLocationAllLJ(lat,lon){
      let params = {
        data:{
          lat,
          lon,
        },
        hideLoading:true
      }
      getCityByLatLon(params).then(res=>{
        if(res.status == '200'){
          this.currentLocation = res.data
        }else{
          uni.showToast({
					  title: res.message,
						icon:'none'
					});
        }
      })
    },

    gcjTobd(g2_lat, g2_lng) { 
        var that = this; 
      let x_pi = 3.14159265358979324 * 3000.0 / 180.0; 
      let z = Math.sqrt(g2_lng * g2_lng + g2_lat * g2_lat) + 0.00002 * Math.sin(g2_lat * x_pi); 
      let theta = Math.atan2(g2_lat, g2_lng) + 0.000003 * Math.cos(g2_lng * x_pi); 
      let bd_lng = z * Math.cos(theta) + 0.0065; 
      let bd_lat = z * Math.sin(theta) + 0.006;    
           var params ={
            data:{
              latLng:bd_lat+','+bd_lng
            }
           }
            geocoder(params).then(res=>{ 
                if(res.status==200){ 
                    that.currentLocation = res.data.city; 
                } 
              })    
      },

    getCityList(){
      let params = {
        data: {
          projectType: this.projectType
        }
      }
      getCities(params).then(res =>{
        if(res.status == '200'){
          let arr = res.data
          this.dataList = []
          this.indexList = []
          arr.forEach(item => {
            if(item.cities.length>0){
              this.indexList.push(item.code)
              this.dataList.push(item)
            }
          });
        }
      })
    },

    //获取缓存信息
    getMemberInfo(){
      const { O_USER_INFO } = this.$constant;
      const { companyId, id } = utils.storageAction({ key: O_USER_INFO, action: 'get' });
      this.companyId = companyId;
      this.memberId = id
      const { projectType } = commLogic.getProjectConfig();
      this.projectType = projectType
    },
  }
}
</script>