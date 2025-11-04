<template>
  <view class="chooseHouses">
    <!-- <view class="curr-city-title"><text>当前城市</text></view> -->
    <view class="curr-city-item" @click="onSelectCities">
      <view class="curr-city-subitem">
        <text>{{houseValue}}</text>
      </view>
      <view class="curr-city-subitem" @click.stop="initData">
        <!-- <text>重新定位</text> -->
      </view>
    </view>
    <view class="curr-city-title" v-if="field==0"><text>院区</text></view>
    <view class="curr-city-title" v-if="field==1"><text>街道</text></view>
    <view class="curr-city-title" v-if="field==6"><text>楼栋</text></view>
    <view class="curr-city-title" v-if="field==2"><text>单元</text></view>
    <view class="curr-city-title" v-if="field==3"><text>楼层</text></view>
    <view class="curr-city-title" v-if="field==4"><text>房间</text></view>
    <view v-for="(project,index) in projectArray" :key="project.assetId" class="project-item" @click="onProjectClick(project)">
      <view :class="[projectInfoClass, index === projectArray.length - 1 ? '' : bottomLine]">{{project.assetLocation}}</view>
    </view>

  </view>
</template>

<script>
import { selectAssestsByParentId } from '@/service/community'
export default {
  name: 'ChooseHouses',

  data () {
    return {
      /** 当前城市项目列表 */
      projectArray: [],
      houseValue:'',
      field:'',
      /** css相关 */
      projectInfoClass: 'project-info',
      bottomLine: 'vux-1px-b',
      moduleConfig: process.env.moduleConfig, 
    }
  },
watch: {
　　// 利用watch方法检测路由变化：
　　$route: function (to, from) {
  this.field = to.query.type
  if(from.query.type==6 && to.query.type==1){
   this.$router.go(-1)    
  }else{ 
  this.initData(this.$route.query.projectId,this.$route.query.parentId);
  this.loadPageData(to.query.type,to.query.assetLocation);
  }
　　　　// 拿到目标参数 to.query.id 去再次请求数据接口
// 　　　　this.loadPageData(to.query.id)
}
},

  created () { 
    this.houseValue = ''; 
    console.log( this.$route.query.projectId)
    this.initData(this.$route.query.projectId,this.$route.query.parentId);      
             
  },
 beforeRouteLeave(to, from, next){
    if(to.name === 'HouseAuthAddHouse') {
      to.meta.keepAlive = true
    }
    next()
  },  
  methods: {
    initData(e,parentId) { 
      let params = {
        data: {
          projectId:e,
          parentId:parentId
        }
      }
      selectAssestsByParentId(params).then((res) => {
        if (res.status === '200') {
          this.projectArray = res.data.records
          if(this.field == 1){  
              if(res.data.records &&  res.data.records.length==1){ 
                localStorage.setItem('marking',true)
                 
                this.onProjectClick(this.projectArray[0] ); 
              }else{
                localStorage.setItem('marking',false)
              }
          }
        } else {
          let errInfo = res.message
          if (!this.util.isNotEmpty(errInfo)) {
            errInfo = "获取项目列表失败"
          }
          this.showToast(errInfo)
        }
      })
    },
    loadPageData(type,value){
      console.log(type,value)
      this.houseValue = ''
      var reg = /^[0-9]+.?[0-9]*$/;
      if (type.toString()=='0') {
        let gardenSelectValue = localStorage.removeItem("gardenName");
        let streetSelectValue = localStorage.removeItem("streetName");
        let buildingSelectValue = localStorage.removeItem("buildingName");
        let cellSelectValue = localStorage.removeItem("cellName");
        let floorSelectValue = localStorage.removeItem("levelName");
        let roomSelectValue = localStorage.removeItem("roomName");
      if(!!value){
        gardenSelectValue =''
        streetSelectValue =''
        buildingSelectValue=''
        cellSelectValue = ''
        floorSelectValue = ''
        roomSelectValue = ''  
      }      
      }      
       else if (type.toString()=='1') {
        let streetSelectValue = localStorage.removeItem("streetName");
        let buildingSelectValue = localStorage.removeItem("buildingName");
        let cellSelectValue = localStorage.removeItem("cellName");
        let floorSelectValue = localStorage.removeItem("levelName");
        let roomSelectValue = localStorage.removeItem("roomName");    
      if(!!value){
        streetSelectValue  =''
        buildingSelectValue=''
        cellSelectValue = ''
        floorSelectValue = ''
        roomSelectValue = ''  
      }      
      }
      else if (type.toString()=='6') {
        let buildingSelectValue = localStorage.setItem('buildingName', '')
        let cellSelectValue = localStorage.setItem('cellName', '')
        let floorSelectValue = localStorage.setItem('levelName', '')
        let roomSelectValue = localStorage.setItem('roomName', '')          
      if(!!value){
        buildingSelectValue=''
        cellSelectValue = ''
        floorSelectValue = ''
        roomSelectValue = ''    
      }      
      }
      else if (type.toString()=='2') {
        let cellSelectValue = localStorage.setItem('cellName', '')
        let floorSelectValue = localStorage.setItem('levelName', '')
        let roomSelectValue = localStorage.setItem('roomName', '')   
      if(!!value){
        cellSelectValue = ''
        floorSelectValue = ''
        roomSelectValue = ''       
      }      
      }
      else if (type.toString()=='3') {
        let floorSelectValue = localStorage.setItem('levelName', '')
        let roomSelectValue = localStorage.setItem('roomName', '')     
        if(!!value){
        floorSelectValue = ''
        roomSelectValue = ''          
      }
      }   
      else if (type.toString()=='4') {
       let roomSelectValue = localStorage.setItem('roomName', '') 
      if(!!value){
         roomSelectValue = ''   
      }      
      }  
      else if (type.toString()=='5') {
      if(!!value){
      //  roomSelectValue = '' 
      }      
      }          
      let gardenSelectValue = localStorage.getItem("gardenName");
      let streetSelectValue = localStorage.getItem("streetName");
      let buildingSelectValue = localStorage.getItem("buildingName");
      let cellSelectValue= localStorage.getItem("cellName");
      let floorSelectValue = localStorage.getItem("levelName");
      let roomSelectValue = localStorage.getItem("roomName");      
      if(!!gardenSelectValue){
        if (gardenSelectValue =='默认') {
          this.houseValue += ''
        }else{

          this.houseValue += gardenSelectValue+'-'
        }
      }
      if(!!streetSelectValue){
        // this.houseValue += streetSelectValue
        if (streetSelectValue =='默认') {
          this.houseValue += ''
        }else{
        
          this.houseValue += streetSelectValue+'-'
        }       
      }      
      if(!!buildingSelectValue){
        // this.houseValue += buildingSelectValue
        if (buildingSelectValue =='默认') {
          this.houseValue += ''
        }else{

          if(/^[0-9]+$/.test(buildingSelectValue)){
          this.houseValue += buildingSelectValue+'-'
          }else{
           this.houseValue += buildingSelectValue+'-'
          }

          // if(buildingSelectValue.indexOf("栋")==-1){
          //    this.houseValue += buildingSelectValue+'栋-'
          // }else{
          //   this.houseValue += buildingSelectValue+'-'
          // }
        }        
      }

      if(!!cellSelectValue){
        // this.houseValue += cellSelectValue
        if (cellSelectValue =='默认') {
          this.houseValue += ''
        }else{
          if(/^[0-9]+$/.test(cellSelectValue)){
          this.houseValue += cellSelectValue+'-'
          }else{
           this.houseValue += cellSelectValue+'-'
          }          
          // this.houseValue += cellSelectValue+'-'
        }        
      }

      if(!!floorSelectValue){
        // this.houseValue += floorSelectValue
        if (floorSelectValue =='默认') {
          this.houseValue += ''
        }else{
          if(/^[0-9]+$/.test(floorSelectValue)){
          this.houseValue += floorSelectValue+'-'
          }else{
           this.houseValue += floorSelectValue+'-'
          }            
          // this.houseValue += floorSelectValue+'-'
        }          
      }

      if(!!roomSelectValue){
        // this.houseValue += roomSelectValue
        if (roomSelectValue =='默认') {
          this.houseValue += ''
        }else{
          if(/^[0-9]+$/.test(roomSelectValue)){
          this.houseValue += roomSelectValue+'-'
          }else{
           this.houseValue += roomSelectValue+'-'
          }  
          // this.houseValue += roomSelectValue
        }           
      }

      console.log(this.houseValue)
    },
    showToast (content) {
      this.$vux.toast.show({
        type: 'text',
        text: content,
        position: 'bottom'
      })
    },

    onSelectCities () {
      // this.$router.push({
      //   name: 'CityIndexList'
      // })
    },

    onProjectClick (project) {
      if (project.assetType==1) {
        localStorage.setItem('gardenName', project.assetLocation) // 院区
      }
      if (project.assetType==6) {
        localStorage.setItem('streetName', project.assetLocation) // 街道
      }
      if (project.assetType==2) {
        localStorage.setItem('buildingName', project.assetLocation) // 楼栋
      }
      if (project.assetType==3) {
        localStorage.setItem('cellName', project.assetLocation) // 单元
      }
      if (project.assetType==4) {
        localStorage.setItem('levelName', project.assetLocation) // 楼层
      }
      if (project.assetType==5) {
        localStorage.setItem('roomName', project.assetLocation) // 房间
      }                     
    let key = project.assetType
    let routertype = '';
    let routerassetId = '';
    let routerprojectId = '';
    let assetLocation= '';
    // debugger
    switch (key) {
      case 1:
         routertype = 1
         routerassetId = project.assetId
         routerprojectId =project.projectId
         assetLocation= project.assetLocation
        break;      
      case 6:
         routertype = 6
         routerassetId = project.assetId
         routerprojectId =project.projectId
         assetLocation= project.assetLocation
        break;
      case 2:
         routertype = 2
         routerassetId = project.assetId
         routerprojectId =project.projectId
         assetLocation= project.assetLocation
        break;
      case 3:
         routertype = 3
         routerassetId = project.assetId
         routerprojectId =project.projectId
         assetLocation= project.assetLocation
        break;
      case 4:
         routertype = 4
         routerassetId = project.assetId
         routerprojectId =project.projectId
         assetLocation= project.assetLocation
        break;
      case 5:
         routertype = 5
         routerassetId = project.assetId
         routerprojectId =project.projectId
         assetLocation= project.assetLocation
        break;                            
      default:
        break;
    }
    if (key != 5) {
      this.$router.push({
        name: 'ChooseHouses',
          query:{
            type:routertype,
            assetLocation:assetLocation,
            parentId:routerassetId,
            projectId:routerprojectId,
          }        
      })      
    } else { 
      if(localStorage.marking == 'true'){ 
       this.$router.go(-6)    
      }else{
       this.$router.go(-5) 
      } 
     localStorage.setItem('assetIdValue', project.roomId)
      localStorage.setItem('addressValue', this.houseValue+project.assetLocation)
      // this.$router.push({
      //   name: 'HouseAuthAddHouse',
      //     query:{
      //       assetId:project.roomId,
      //       address:this.houseValue+project.assetLocation
      //     }        
      // })     
    }

    }
    
  },
}
</script>

<style lang="scss" scoped>
.chooseHouses{
  padding-bottom: 88rpx;
}
.width-100-p {
  width: 100%;
}

.height-44 {
  height: 88rpx;
}

.font-size-14 {
  font-size: 28rpx;
}

.color-1 {
  color: #232321;
}

.padding-20 {
  padding: 0 40rpx 0 40rpx;
}

.curr-city-title {
  @extend .width-100-p;
  @extend .height-44;
  @extend .padding-20;
  @extend .font-size-14;
  color: #C5C5C5;
  line-height: 44px;
  background-color: #F7F7F7;
}

.curr-city-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @extend .width-100-p;
  @extend .height-44;
  @extend .padding-20;
  @extend .font-size-14;
  @extend .color-1;
  background-color: white;
}

.curr-city-subitem {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.project-item {
  @extend .padding-20;
  background-color: white;
}

.project-info {
  @extend .width-100-p;
  @extend .height-44;
  @extend .font-size-14;
  @extend .color-1;
  line-height: 44px;
}
</style>
