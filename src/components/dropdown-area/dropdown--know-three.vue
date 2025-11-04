

<template>
  <view :class="['dropdown-know', getCustomClass]" :style="[THEME_CSS_VAR, show ? {} : { display: 'none' }, getCustomStyle]">
    <view class="tree-panel">

      <!-- 左侧菜单栏 -->
      <view class="tree-menu">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <text :class="['tree-menu--item', { selected: selCategory.categoryId == item.categoryId }]" v-for="(item, index) in categoryList" :key="index" @click="menuClickEvent(index, item)">{{ item.categoryName }}</text>
        </scroll-view>
      </view>

      <!-- 右侧列表 -->
      <view :class="['tree-list', { show: true }]">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in secondList" :key="index">
            <view :class="['tree-list--item', { selected: selSecond.categoryId == item.categoryId && item.check}]" @click="childClickEvent(index, item)">
              <text>{{ item.categoryName }}</text>
              <u-icon name="checkmark" v-if="selSecond.categoryId == item.categoryId && item.check" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>
      
      <view :class="['tree-list', { show: true }]" v-show="fishList.length>0">
        <scroll-view :scrollTop="0" scroll-y style="width: 100%; height: 100%;">
          <block v-for="(item, index) in fishList" :key="index">
            <view :class="['tree-list--item', { selected: (selFish.categoryId == item.categoryId) && item.check}]" @click="childFishClick(index, item)">
              <text>{{ item.categoryName }}</text>
              <u-icon name="checkmark" v-if="(selFish.categoryId == item.categoryId) && item.check" :color="THEME_COLOR"></u-icon>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
    <view class="tree-btn">
      <u-button text="重置" :customStyle="{ flex: '0 0 240rpx', height: '88rpx' }" @click="resetEvent" />
      <u-button text="确定" :customStyle="{ backgroundColor: '#2761FF', color: '#fff', height: '88rpx', borderRadius: '0rpx' }"
        @click="confirmSubmission" />
    </view>
  </view>
</template>

<script>
import mpMixin from '@/js/mixin/mpMixin'
import {  getQuesCategoryList, //获取分类列表
            getCategoryTreeList,   //获取二三四级分类列表
   } from '@/service/knowledgeBase'

/**
 * 下拉列表 - 区域项目
 * @event confirm 提交事件
 */
export default {
  name: 'DropdownProject',
  mixins: [mpMixin],
  props: {
    // 显示/隐藏
    show: Boolean,
    // 是否显示全部项目，默认是true
    isAll:{
      type: Boolean,
      default: true
    },
    autoInit: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      store: {},
      categoryList: [],
      secondList:[],
      thirdList:[],
      fishList:[],
      selCategory: {},
      selSecond: {},
      selFish:{},
      firstCreate:false
    }
  },
  computed: {
  },
  async created() {
    // this.firstCreate = true
    // #ifdef MP-WEIXIN
    const res = wx.getSystemInfoSync()
    if (res.environment) {
      await this.$onLaunched;
    }
    // #endif
    
    await this.getCategoryList()
    if (this.categoryList.length) {
      // 获取第一个数据
      if( this.categoryList[0] && this.categoryList[0].categoryId){
              // await this.menuClickEvent(0, this.categoryList[0])
            }
    }
  },
  onShow(){

  },
  methods: {

        //获取分类列表
        getCategoryList(parentId){
      let params = {
        data: {
          parentId:0
        },
        hideLoading: true
       
      }
      return new Promise(resolve => {
        getQuesCategoryList(params).then(res =>{
          if(res.status == "200"){
            let list=res.data || []
            list.map((item,index)=>{
              this.categoryList.push(Object.assign(item,{check:false}))
             })
            resolve(this.categoryList)
          }else{
            resolve([])
          }
        })
      })
    },


    //获取二三级分类列表
  async  getCategoryTreeList(parentId,i){
      this.categoryIndex = i
      this.parentCategoryId = parentId;
      let params = {
        data: {
          quesCategoryId:parentId
        },
        hideLoading: true
      }
   await   getCategoryTreeList(params).then(res =>{
        if(res.status=='200'){
          let columnData = res.data;
          // this.secondList = columnData
          columnData.map((item,index)=>{
            this.secondList.push(Object.assign(item,{check:false}))
             })
          this.secondList.map((item)=>{
            if(item.children.length>0){
              item.children.map((child)=>{
                if(item.categoryId == child.parentId){
                  this.thirdList.push(Object.assign(child,{check:false}))
                 }
              })
             
            }
           
           })
       
      }})
    },
    async confirmSubmission() {
      console.log(164, this.selFish,this.selSecond,this.selCategory )
      if( this.selFish && this.selFish.check == true) {
        this.$emit('confirm', this.selFish)
        return;
      }
      if(this.selSecond && this.selSecond.check == true ) {
        this.$emit('confirm', this.selSecond)
        return;
      }
      if(this.selCategory ) {
        this.$emit('confirm', this.selCategory)
        return;
      }


      // this.$emit('confirm', { area: this.selArea, project: this.selProject })
    },
   
    // 左侧菜单栏操作
    async menuClickEvent(index, item) {
      this.selCategory = item
      this.secondList = [];
      this.thirdList = [];
      this.fishList = [];
      this.selSecond= {};
      this.selFish={}
      await this.getCategoryTreeList(item.categoryId)
      if(this.secondList.length){
        await   this.childClickEvent(0, this.secondList[0])
        }
      if(this.fishList.length){
        await   this.childFishClick(0, this.fishList[0])
        }
        // if(  this.firstCreate == true){
        // await  this.confirmSubmission()
        // }
        // this.firstCreate = false
    },
    // 右侧列表操作
    childClickEvent(index, item) {
      typeof (item.check) == 'boolean' ? (item.check = !item.check)  : item.check
      this.secondList.map((item1,index)=>{
              if(item1.categoryId != item.categoryId && item1.check == true){
                item1.check = false;
              }
             })
      this.selSecond = item
      // if(item.check == false){
        this.fishList = this.thirdList.filter(items=>items.parentId == item.categoryId)
        this.fishList.forEach((items) =>{
          items.check = false
        })
         this.selFish.check = false;
      // }else {
      //   this.fishList = this.thirdList.filter(items=>items.parentId == item.categoryId)
      // }
    },
    childFishClick(index, item) {
      typeof (item.check) == 'boolean' ? (item.check = !item.check)  : item.check
      this.fishList.map((item1,index)=>{
              if(item1.categoryId != item.categoryId && item1.check == true){
                item1.check = false;
              }
             })
      this.selFish = Object.assign({}, item)
      this.fishList.forEach((items) => {
             if(item.categoryId == items.categoryId){
              items.check = item.check
             }
            });
       this.fishList =  Object.assign([], this.fishList)
    },
    resetEvent(){
      this.secondList = [];
      this.thirdList=[]
      this.fishList=[]
      this.selCategory={}
      this.selSecond={}
      this.selFish={}
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-know {
  @include flx-dsp(flex-start, flex-start, column);
  font-family: "PingFang SC";
}
.tree-panel {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
  height: 612rpx;
}
.tree-menu {
  flex: 0 0 230rpx;
  height: 100%;
  background-color: #F7F7F7;
}
.tree-menu--item {
  @include flx-dsp(flex-start, flex-start, column);
  width: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  font-size: 30rpx;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
    background-color: #fff;
  }
}
.tree-list {
  flex: 1 1 auto;
  height: 100%;
  display: none;

  &.show {
    display: block;
  }
}
.tree-list--item {
  width: 100%;
  @include flx-dsp(space-between, center);
  font-size: 30rpx;
  padding: 30rpx;
  // border-bottom: 1px solid #EAEAEA;
  box-sizing: border-box;
  color: #333;

  &.selected {
    color: var(--app-primary-color);
  }
}
.tree-btn {
  @include flx-dsp(flex-start, flex-start);
  width: 100%;
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
</style>