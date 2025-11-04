<template>
  <!-- 快递代收 -->
	<view  :class="[THEME_NAME,'parent-column']" :style="[THEME_CSS_VAR]">
    <text class="text-item">请完善如下信息后提交给物业中心</text>
    <view class="form-cont" style="background:#fff;">
      <u-form :model="form" ref="uForm" labelWidth="80">
        <u-form-item label="快递公司" border-bottom @click="isShow = true">
          <u-input v-model="form.expressCompany" disabled="true" disabledColor="#fff"  placeholder="选择快递公司（非必填）" type="select" border="false"/>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="数量" border-bottom>
          <SelectSingleView @onItemSelect="onItemSelect" ref="expressNumberView"></SelectSingleView>
        </u-form-item>
        <u-form-item label="快递单号" border-bottom>
          <u-input v-model="form.expressCode" placeholder="输入快递单号（非必填）"  border="false"/>
        </u-form-item>
        <u-form-item label="备注" border-bottom>
          <u-input v-model="form.remark" placeholder="输入备注（非必填）"  border="false"/>
        </u-form-item>
      </u-form>
    </view>

    <view style="display: flex;flex-direction:column;padding: 15px">
      <text class="tab-value-text" style="width: 100%">1.物业服务中心包裹代收时间9:00-17:00。</text>
      <text class="tab-value-text" style="width: 100%">2.物业服务中心只代收外观完好的包裹，如包裹出现破损，物业中心有权拒绝代收。对于已代收的包裹物业服务中心仅保证其外观的完好性。</text>
      <text class="tab-value-text" style="width: 100%">3.受存储空间所限，由物业服务中心代收的包裹请及时取回， 48小时未取走的包裹，物业服务中心将进行催收。</text>
      <text class="tab-value-text" style="width: 100%">4.本次服务预约仅当日有效，如超过代收时间，请重新预约。</text>
    </view>
    
    <u-button class="notice-btn" type="primary" text="通知物业" :loading="loading" @click="notifyProperty">通知物业</u-button>

    <view class="item-list" @tap.stop.prevent="moreGoodsList" style="background: white;margin: 5px;margin-top: 15px;margin-bottom: 15px">
      <view class="tab-item">
        <text class="tab-title-me">我的快递</text>
        <text class="tab-title-more">更多</text>
      </view>

      <view class="divider-view" style="margin-left: 0px"></view>

      <view v-for="(item, index) in expressInfos" :key="index">
        <GoodCollectionInfoView :collectionInfo="item"></GoodCollectionInfoView>
        <view class="divider-view" v-show="index < expressInfos.length - 1"></view>
      </view>
    </view>
    <u-picker :show="isShow" :columns="expressCompanys" @cancel="isShow=false" @confirm="complayConfirm"></u-picker>

    <u-notify message="网络错误" ref="uNotify"></u-notify>
    <u-modal 
      ref="uModal" 
      :show="isFalg" 
      title="提交成功" 
      content="是否返回上一页" 
      @confirm="onConfirm"
      :asyncClose="true" :showCancelButton="isShowCancelButton" @cancel="onCancel"
      width="300"
    >
    </u-modal>
    <uniPop ref="rzModal" />
  </view>
</template>

<script>
  import util from '../../js/utils'
  import SelectSingleView from './components/SelectSingleView'
  import GoodCollectionInfoView from './components/GoodCollectionInfoView'
  import {mapGetters, mapMutations} from 'vuex'
  import {
    getOwnerBuildingListComm,
    judgeAuthOwner,
    getExpressList,
    saveExpress,
    getCompanyConfig
  } from '../../service/community'
  export default {
    name: 'goodsCollection',
    components: {
      SelectSingleView,
      GoodCollectionInfoView,
    },
    data () {
      return {
        loading: false,
        isShowCancelButton: true,
        relateAddress:{},//关联的地址
        expressCompanys:[['百世汇通', 'EMS', '京东', '申通', '顺丰', '天天快递', '邮政', '圆通', '韵达', '宅急送', '中通', '其他']],
        list: [
					{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
        expressCompany:['选择快递公司（非必填）'],
        expressNumberList: [{
          name: "1件",
          isSelected: false,
        }, {
          name: "2件",
          isSelected: false,
        }, {
          name: "3件",
          isSelected: false,
        }, {
          name: "4件",
          isSelected: false,
        }, {
          name: "5件",
          isSelected: false,
        }, {
          name: "6件",
          isSelected: false,
        }, {
          name: "7件",
          isSelected: false,
        }, {
          name: "7件以上",
          isSelected: false,
        }],
        lastSelectNumberIndex:-1,
        expressCode:"",
        remark:"",
        expressInfos: [],

        isAuthOwnerInfo:false,
        addLoad:true,
        form: {
          expressCompany: '',
          expressCompanyId: '', // 快递公司id
          expressCode: '',  //快递单号
          remark: '',     //备注
        },
        isShow: false,
        memberId: '',
        companyId: '',
        isTip: false,
        isFalg: false,
      }
    },
    onLoad() {
      const { MEMBER_ID, COMPLANY_ID } = this.$constant;
      this.memberId = util.storageAction({ key: MEMBER_ID, action: 'get' });
      this.companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' });
    },
    async onShow() {
      const { O_USER_INFO } = this.$constant;
      const {phoneNumber} = util.storageAction({ key: O_USER_INFO, action: 'get' });
         if(!phoneNumber){
		  		  uni.navigateTo({ url: '/pages-a/authorization/bindingMobile'});
		  			return
		  	  }
          const hasAuth = await this.setAuthType()
          console.log(154,hasAuth)
          if (!hasAuth) return
    },
    mounted () {
      this.$refs["expressNumberView"].setItems(this.expressNumberList, this.lastSelectNumberIndex);
      let params = {
        data: {
          memberId:this.memberId
        }
      }
      judgeAuthOwner(params).then(res=>{
        if(res.status == 200 && res.data && res.data.isAuthUser == 1) {
          this.isAuthOwnerInfo = true;
          this.initData();
        }else if(res.status == 200 && res.data && res.data.isAuthUser == 0){
          const hasAuth =  this.setAuthType()
          console.log(170,hasAuth)
          if (!hasAuth) return
          // this.$refs.uNotify.error('网络错误')
        }
      })
      // this.initData()
    },
    computed:{
      ...mapGetters('goodsCollection',{
        getCrm:'getCollectionInfo',
      }),
    },
    methods: {
      ...mapMutations('goodsCollection',[
        'clearCollectionInfo',
        'setCollectionInfo'
      ]),
      moreRouteGo(){
        const url = `/pages-c/housekeeper/moreMyGoodCollection?ownerId=${this.phone}`;
        uni.navigateTo({ url });
      },
      initesRefresh(){
        this.$refs["expressNumberView"].setItems(this.expressNumberList, this.lastSelectNumberIndex);
      let params = {
        data: {
          memberId:this.memberId
        }
      }
      judgeAuthOwner(params).then(res=>{
        if(res.status == 200 && res.data && res.data.isAuthUser == 1) {
          this.isAuthOwnerInfo = true;
          this.initData();
        }else {
          this.$refs.uNotify.error('网络错误')
        }
      })
      },
      // 点击快递公司确定
			complayConfirm(columnIndex) {
        // console.log('columnIndex',columnIndex)
        this.form.expressCompanyId = columnIndex.indexs[0]
				this.form.expressCompany = columnIndex.value[0]
        this.isShow = false
			},
      moreGoodsList(){
        console.log(200)
        uni.navigateTo({
          url: '/pages-c/housekeeper/moreMyGoodCollection?ownerId='+ this.relateAddress.ownerId,
          fail(err) {
						console.log(err)
					}
        })
     

      },
      initData() {
        var collectionInfo = this.getCollectionInfo;
        if (collectionInfo) {
          this.expressNumberList = collectionInfo.expressNumberList;
          this.lastSelectNumberIndex = collectionInfo.lastSelectNumberIndex;
        } else {
          this.lastSelectNumberIndex = 0;
        }

        this.$refs["expressNumberView"].setItems(this.expressNumberList, this.lastSelectNumberIndex);

        // 获取默认的地址
        let type = 1;
        let params = {
          data: {
            companyId: this.companyId,
            memberId: this.memberId
          },
          // "hideLoading": true
        }
        // console.log('params1===',params1)
        getOwnerBuildingListComm(params).then(response => {
          if (response.status == '200') {
            var houseList = response.data ? response.data : [];
            let tempReleaseList1 = [];
            let userAdd1 = [];
            let userAdd2 =[];
            if (houseList.length > 0) {
              userAdd1 = houseList.filter(f => { return f.authType == 1 && f.isDefault === 1 })
              userAdd2 = houseList.filter(f => { return f.authType == 1})
              console.log(239,userAdd1,houseList,userAdd2)
              if(userAdd1.length > 0){
                tempReleaseList1 = userAdd1[0];
              } else if(userAdd2.length > 0){
                tempReleaseList1 = userAdd2[0];
              } else {
                tempReleaseList1 = houseList[0];
              }
            }
            console.log(tempReleaseList1, '2')
            this.relateAddress = tempReleaseList1;
            if (this.relateAddress) {
              this.getExpressList();
            }

          }
        })       
      },
      getExpressList() {
        let params = {
          data: {
            ownerId: this.relateAddress.ownerId
          }

        };
        getExpressList(params).then(response =>{
          if (response.data && response.data.records) {
            if(this.addLoad == false){
              console.log(272)
              uni.hideLoading();
            }
            var infos = response.data.records;
            if (infos.length > 4) {
              infos.splice(4, infos.length);
            }
            for (var index in infos) {
              var item = infos[index];
              var records = new Array();
              for (var j = item.expressRecords.length - 1; j > -1; j--) {
                records.push(item.expressRecords[j]);
              }
              item.expressRecords = records;
            }
            this.expressInfos = infos;
          }
        })
      },
      saveCurrentData() {
        var collectionInfo = {};
        collectionInfo.expressNumberList = this.expressNumberList;
        collectionInfo.lastSelectNumberIndex = this.lastSelectNumberIndex;
        this.setCollectionInfo(collectionInfo);
      },
      onItemSelect(typeName, item){
        this.lastSelectNumberIndex = item._index;
      },
      checkPostReq () { //校验提交信息
        if(!this.relateAddress.relateId) {
          this.$refs.uNotify.error('未获取到地址信息')
          return false;
        }
        if(this.lastSelectNumberIndex == -1) {
          this.$refs.uNotify.error('请选择数量')
          return false;
        }
        return true;
      },
      notifyProperty(){
        if (!this.checkPostReq()) {
          return;
        }
        this.loading = true
        let params = {
          data: {
            areaId:this.relateAddress.areaId,//区域Id
            projectId:this.relateAddress.projectId,//项目Id
            projectName:this.relateAddress.projectName,//项目名字
            buildingId:this.relateAddress.buildingId,//楼栋Id
            buildingName:this.relateAddress.houseBuiding,//楼栋名字
            roomId:this.relateAddress.addrId,//房间Id
            roomName:this.relateAddress.houseRoom,//房间名字
            expressCompany: this.form.expressCompanyId,//快递公司Id
            // num:(this.lastSelectNumberIndex + 1),//快递数量值
            num:this.expressNumberList[this.lastSelectNumberIndex].name,//快递数量值
            courierNumber:this.form.expressCode,//快递单号
            remark:this.form.remark,//备注
            ownerId:this.relateAddress.ownerId,//业主Id
            ownerName:this.relateAddress.regName,//业主名称
            operator:this.relateAddress.regName,//操作人
            creator:this.relateAddress.regName,//创建人
            contactPhone:this.relateAddress.regNumber,//创建人
            areaName:'',//区域名称
            flag: 1,
          }
        }
        console.log('params====',params)
        saveExpress(params).then(response =>{
          this.loading = false
          if (response && response.status == '200') {
            // this.isFalg = true
          this.showToast('提交成功！')
          this.form.expressCompany=''
          this.form.expressCompanyId=''
          this.form.expressCode=''
          this.form.remark=''
          this.expressInfos=[],
       
          // this.$router.go(0)
            setTimeout(() => {
              this.addLoad = false
                uni.showLoading({title: '加载中'});
                this.initData();
             }, 600);
          // this.initesRefresh()
        
          } else {
            console.log(315)
            this.$refs.uNotify.error('提交失败')
          }
        }).catch((error) =>{
          console.log(316)
          // this.$refs.uNotify.error('提交失败')
        })
      },
      onConfirm() {
        uni.navigateBack();
      },
      onCancel() {
        this.isFalg = false
        this.getExpressList()
      },
        // 提示
    showToast (tips) {
      uni.showToast({ title: tips, icon: 'none' });
    },
    // 如果未认证，则设置认证类型
    async setAuthType() {
          if (this.hasAuth()) return Promise.resolve(true)
          const { COMPLANY_ID } = this.$constant
          const companyId = util.storageAction({ key: COMPLANY_ID, action: 'get' })
          const params = {
            data: {
          companyId
            }
          }
          const res = await getCompanyConfig(params)
          const authTypes = this.parseStr2JSON(res.data?.authType).filter(Boolean)
          // 设置认证类型
          let temp = 0
          if (authTypes.length == 1) {
            const num = parseInt(authTypes[0])
            temp = isNaN(num) ? 0 : num
          } else if (authTypes.length == 2) {
            temp = 0
          }
          this.showFWQY = temp
    
          this.showAuthModal()

          return Promise.resolve(false)
        },
        // 将字符串转换为数组，例如 "["2", "1"]" => ["2", "1"]
        parseStr2JSON(val) {
          try {
            return JSON.parse(val)
          } catch (error) {
            return []
          }
        },
        // 弹出认证窗口
        showAuthModal() {
            this.$refs.rzModal.showModal({ modalType: 'rz' })
            this.$refs.rzModal.showCompanyConfig()
        },
        // 判断业主是否认证
        hasAuth() {
          const { IS_ASSOCIATION } = this.$constant
          const isAssociation = util.storageAction({ key: IS_ASSOCIATION, action: 'get' })
          return (isAssociation != void 0 && isAssociation != '0' && isAssociation != '-1')
        }
    }
  }
</script>

<style lang="scss" scoped>
.parent-column {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background: #F7F7F7
}
.text-item {
  padding: 30rpx;
  font-size: 28rpx;
  text-align: left;
  color: #333333;
}
.item-list {
  display:flex;
  flex-direction: column;
  margin-left: 40rpx;
  margin-right: 40rpx;
}
.input-form {width: 100%;background: #FFFFFF;}
.uForm {width: 100%;background: #FFFFFF;}
.tab-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20rpx 10rpx;
  justify-content: space-between;
}
.tab-title-me {
  font-size: 28rpx;
  color: #333333;
  margin-left: 20rpx;
}
.tab-title-more {
  margin-right: 32rpx;
  font-size: 28rpx;
  color: #333333;
}
.tab-value-item {
  display: flex;
  margin-left: 40rpx;
  flex: 1;
}
.divider-view {
  display: flex;
  flex: 1;
  height: 2rpx;
  margin-left: 30rpx;
  background: #F7F7F7;
}
.tab-value-text {
  display: flex;
  flex-direction: row;
  font-size: 28rpx;
  color: #666666;
  margin: 10rpx 0px;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color:    #B8B8B8;
}
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  color:    #B8B8B8;
}
::-moz-placeholder { /* Mozilla Firefox 19+ */
  color:    #B8B8B8;
}
:-ms-input-placeholder { /* Internet Explorer 10+ */
  color:    #B8B8B8;
}
.notice-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 320rpx;
  height: 68rpx;
  /* background-color: #C8924B !important; */
  background-color: var(--app-primary-color);
  /* border-color: #C8924B; */
  border-color: var(--app-primary-color);
}
.form-cont {
  padding: 0 30rpx;
}
</style>
