<!--  -->
<template>
  <view class='' catchtouchmove>
    <view v-if="show" class='uni-calendar__mask' :class="{ 'uni-calendar--mask-show': aniMaskShow }"  @click="maskClick">
    </view>
    <!-- 选择院区 -->
    <view v-if="showArea" class="uni-calendar__content"
          :class="{ 'uni-calendar--fixed': !insert, 'uni-calendar--ani-show': aniMaskShow }" :style="{ top: top }" >
      <view class="areaBox" v-if="type == 1">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;" class="areaBox-left">
          <view class="col_ul" :class="{ 'ul_active': searchForm.projectId == item.projectId }"
                v-for="(item, index) in projectList" :key="index" @click="changeProject(item)">{{ item.projectName }} </view>
        </scroll-view >
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;" class="areaBox-right">
          <view class="col_ul" :class="{ 'ul_active': searchForm.compoundId == item.Id && searchForm.compoundName == item.Name }"
                v-for="(item, index) in compoundList" :key="index" @click="changeCompound(item)">{{ item.Name }} <u-icon name="checkmark" v-if="searchForm.compoundId == item.Id && searchForm.compoundName == item.Name" :color="THEME_COLOR"></u-icon></view>
        </scroll-view>
      </view>
      <view class="areaBox" v-else>
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;" class="areaBox-left">
          <view class="col_ul" :class="{ 'ul_active': searchForm.areaId == item.areaId }"
                v-for="(item, index) in areaList" :key="index" @click="changeArea(item)">{{ item.areaName }} </view>
        </scroll-view>
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;" class="areaBox-right">
          <view class="col_ul" :class="{ 'ul_active': searchForm.projectId == item.projectId }"
                v-for="(item, index) in filterProjectList" :key="index" @click="changeProject(item)">{{ item.projectName }} <u-icon name="checkmark" v-if="searchForm.projectId == item.projectId  " :color="THEME_COLOR"></u-icon></view>
        </scroll-view >
      </view>
    </view>

  </view>
</template>

<script>
import { getPermissionProjects, getCustomerTree } from '@/service/leasing'

export default {
  props: {
    top: {
      type: String,
      default: 0
    },
    type: {
      type: String,
      default: '1'
    },
    insert: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      show: false,
      showArea: false,
      showData: false,
      aniMaskShow: false,
      areaList: [],
      projectList: [],
      compoundList: [],
      searchForm: {
        areaId: '',
        areaName: '',
        projectId: '',
        projectName: '',
        compoundName: '',
      },
      groupDate: [],
      dataList:[],
      keyName:'',
      keyValue:'',
      isFirst: true,
      userInfo: {},
    };
  },
  computed: {
    filterProjectList(){
      if(this.searchForm.areaId){
        return this.projectList.filter(item => item.areaId == this.searchForm.areaId);
      }
    }
  },
  watch: {},
  methods: {
    // 蒙版点击事件
    maskClick() {
      this.close()
      this.$emit('maskClose')
    },
    selectArea() {
      this.close();
    },
    /**
     * 打开日历弹窗
     */
    open(type,dataList) {
      //   默认打开区域项目
      this.show = true
      this.aniMaskShow = true
      if (type == 'group') {
        this.dataList = dataList.data;
        this.keyName = dataList.keyName,
            this.keyValue =dataList.keyValue,
            this.showData = true;
      } else {
        this.showArea = true;
      }


    },
    /**
     * 关闭日历弹窗
     */
    close() {
      this.show = false
      this.aniMaskShow = false
      this.showArea = false;
      this.showData = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('close')
        }, 300)
      })
    },
    changeArea(item){
      this.searchForm.areaId = item.areaId;
      this.searchForm.areaName = item.areaName;
    },
    changeProject(item) {
      let that = this;
      that.searchForm.areaId = item.areaId;
      that.searchForm.areaName = item.areaName;
      that.searchForm.projectId = item.projectId;
      that.searchForm.projectName = item.projectName;
      if(this.type == 1){
        that.getCompoundData(that.searchForm.areaId);
      }else{
        this.$emit('on-selected', this.searchForm);
        that.close();
      }

    },
    getProject() {
      var params = {
        data: {
          userId: this.userInfo.userId,
        },
        hideLoading: true,
        responseToast: false,
      }
      getPermissionProjects(params).then(res => {
        this.projectList = res.data || [];
        if(this.type == 1){
          this.$nextTick(() => {
            this.changeProject(this.projectList[0]);
          })
        }else{
          let areaSet = new Set();
          this.projectList.forEach(item =>{
            if(!areaSet.has(item.areaId)){
              this.areaList.push(item);
              areaSet.add(item.areaId);
            }
          })
          let defaultData = this.areaList[0];
          this.searchForm.areaId = defaultData.areaId;
          this.searchForm.areaName = defaultData.areaName;
          this.searchForm.projectId = defaultData.projectId;
          this.searchForm.projectName = defaultData.projectName;
          this.$emit('on-selected', this.searchForm)
        }

      })
    },
    changeCompound(item) {
      let that = this;
      if(item){
        that.searchForm.compoundId = item.Id;
        that.searchForm.compoundName = item.Name;
      }
      this.searchForm = Object.assign(this.searchForm, item);
      that.$emit('on-selected', that.searchForm)
      that.close()
    },
    getCompoundData(val) {
      /**
       * 根据城市公司id和userId查询项目列表
       */
      var self = this;
      if (val == '') {
        return false;
      }
      var params = {
        data: {
          pId: this.searchForm.projectId,
          nodeCategory: 1,
          projectId: this.searchForm.projectId,
        },
        hideLoading: true,
        responseToast: false,
      }
      getCustomerTree(params).then(res => {
        self.compoundList =res.data
        this.$nextTick(() => {
          if(this.isFirst){
            if(this.compoundList.length){
              this.changeCompound(this.compoundList[0])
            }else{
              this.changeCompound();
            }
          }
          this.isFirst = !this.isFirst;

        })
      })
    },

  },
  created() {
    var O_USER_INFO = this.$constant.O_USER_INFO;
    this.userInfo = this.$utils.storageAction({
      key: O_USER_INFO,
      action: 'get'
    });
  },
  mounted() {
    this.getProject();
  },
}
</script>
<style scoped lang="scss">
.uni-calendar__mask {
  position: fixed;
  bottom: 0;
  top: 140px;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  // transition-property: opacity;
  // transition-duration: 0.3s;
  opacity: 0;
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.uni-calendar--mask-show {
  opacity: 1
}

.uni-calendar--fixed {
  position: fixed;
  bottom: auto;
  left: 0;
  right: 0;
  // transition-property: transform;
  // transition-duration: 0.3s;
  // transform: translateY(0);
  /* #ifndef APP-NVUE */
  z-index: 99;
  /* #endif */
}

.uni-calendar--ani-show {
  transform: translateY(0);
}

.uni-calendar__content {
  background-color: #fff;
  margin: 0 0 100rpx 0;

  &::v-deep .u-cell {
    height: 300px;
    overflow: auto;
  }
}


// 区域弹出框样式
.areaBox {
  display: flex;
  height: 300px;
}

.areaBox-left {
  width: 40%;
  overflow: auto;
  background: #F7F7F7;
}

.areaBox-right {
  width: 60%;
  overflow: auto;
  background: #fff;
  .col_ul{
    border-bottom: 1px solid #EAEAEA;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-right: 30rpx;
    background: #fff;
  }

}

.col_ul {

  background: #F7F7F7;
  font-size: 30rpx;
  color: #333333;
  padding: 30rpx 0 30rpx 30rpx;
}

.ul_active {
  color: #2761FF;
  background: #FFFFFF;
}

.area_submit {
  width: 100%;
  color: #FFFFFF;
  font-size: 14px;
  background: #2761FF;
  height: 38px;
  line-height: 38px;
  text-align: center;
}
.cell-box{
  height: 300px;
  overflow-y: auto;
}

// end
</style>
