<template>
  <view>
    <view class="curr-city-title"><text>全部社区</text></view>
    <view v-for="(project,index) in projectArray" :key="index" class="project-item" @click="onProjectClick(project)">
      <view :class="[projectInfoClass, index === projectArray.length - 1 ? '' : bottomLine]">{{project.projectName}}</view>
    </view>
  </view>
</template>

<script>
// import util from './../../assets/js/util.js'
import {getProjectsByCity, getAuthCompanyList,findCompanyAuthInfoList } from '@/service/community'
// import { mapState, mapMutations } from 'vuex'
	import Utils from '@/js/utils'
	import commLogic from '@/js/comm-logic';
export default {
  name: 'ProjectSwitchsecond',

  data () {
		const { MEMBER_ID, PROJECT_ID, COMPLANY_ID, AREA_ID } = this.$constant
    return {
      /** 当前城市项目列表 */
			projectId: Utils.storageAction({ key: PROJECT_ID, action: 'get' }),
			areaId: Utils.storageAction({ key: AREA_ID, action: 'get' }),
			memberId: Utils.storageAction({ key: MEMBER_ID, action: 'get' }),
      projectArray: [],
      projectIds:[],
      /** css相关 */
      projectInfoClass: 'project-info',
      bottomLine: 'vux-1px-b',
			projectType:'184',
			companyId:'440',
    }
  },

  onLoad() {
		const { projectType,companyId } = commLogic.getProjectConfig();
		this.projectType = projectType
		this.companyId = companyId
    this.getProjectList()
  },
  mounted () {
  },
  // computed: {
  //   ...mapState({
  //     currentCityName: state => state.projectSwitch.currCityName,
  //     currentCityCode: state => state.projectSwitch.currCityCode,
  //   }),
    // /** 当前城市 */
    // currentCity () {
    //   return util.isNotEmpty(this.currentCityName) ? this.currentCityName : '正在获取地理位置'
    // }
  // },

  methods: {
    // ...mapMutations('projectSwitch', [
    //   'clean',
    //   'setCurrCityName',
    //   'setCurrCityCode',
    // ]),
        //查询认证企业
    getEnterpriseAuthList(){
      let params={
        data:{
					memberId:this.memberId,
					companyId:this.companyId,
					applyStatus:9  //已通过企业
				}
      }
      return new Promise(resolve => {
        findCompanyAuthInfoList(params).then(res =>{
          if(res.status == "200"){
            let list=res.data || []
            resolve(list)
          }else{
            resolve([])
          }
        })
      })
    },

    async getProjectList(){
      let that = this
			const { INDEX_PROJECT_ID } = this.$constant;
			let indexProjectId = JSON.parse(Utils.storageAction({ key: INDEX_PROJECT_ID, action: 'get' }));
      let enterpriseList = await that.getEnterpriseAuthList()
      if(indexProjectId){
        var pId = indexProjectId;
        let params = {
          data:{
						projectIds:pId,
						projectType: this.projectType
					}
        }

        getProjectsByCity(params).then((res) => {
          if (res.status === '200') {
            // this.projectArray = res.data
            let list = res.data
            if(enterpriseList.length>0){
              enterpriseList.forEach(item =>{
                list.push(item)
              })
            }
            //去重
            let obj = {}
            list = list.reduce(function(init, item){
              obj[item.projectId] ? '' : (obj[item.projectId] = true && init.push(item))
              return init
            }, [])
            this.projectArray = list
          } else {
            let errInfo = res.message
            if (!this.util.isNotEmpty(errInfo)) {
              errInfo = "获取项目列表失败"
            }
            this.showToast(errInfo)
          }
        }).catch((err) => {
          let errInfo = err.message
          if (!this.util.isNotEmpty(errInfo)) {
            errInfo = "未知错误"
          }
          let tip = window.fetch ? '1' : '0'
          let res = tip + '++' + err.status + '++' + err.responseText
          this.showToast(res)
        })
      }else{
        if(enterpriseList.length>0){
          let lst = enterpriseList
          //去重
          let obj = {}
          lst = lst.reduce(function(init, item){
            obj[item.projectId] ? '' : (obj[item.projectId] = true && init.push(item))
            return init
          }, [])
          this.projectArray = lst
        }

      }

    },

    showToast (content) {
      uni.showToast({
      	title:content,
				icon:'none'
      })
    },

    onProjectClick (project) {
      const key = 'currProject'
      const areaIdKey = 'areaId'
      const projectIdKey = 'projectId'
      const projectNameKey = 'projectName'
			const { AREA_ID, PROJECT_ID, USER_ADDR_INFO, AREA_NAME, PROJECT_NAME, SWITCH_PROJECT_ID } = this.$constant;
      Utils.storageAction({ key: AREA_ID, action: 'set', value: project.areaId });
      Utils.storageAction({ key: PROJECT_ID, action: 'set', value: project.projectId });
      Utils.storageAction({ key: SWITCH_PROJECT_ID, action: 'set', value: project.projectId });
      Utils.storageAction({ key: PROJECT_NAME, action: 'set', value: project.projectName });          
      uni.navigateBack()
    }
  },
}
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
</style>
<style lang="scss" scoped>


.vux-1px-b {
  border-bottom-style: solid;
  border-color: #EAEAEA;
  border-width: 1rpx;
}

.width-100-p {
  width: 100%;
}

.height-44 {
  height: 44px;
}

.font-size-14 {
  font-size: 14px;
}

.color-1 {
  color: #232321;
}

.padding-20 {
  padding: 0 20px 0 20px;
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
