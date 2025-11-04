<template>
  <view class="parent-row" style="display: flex;flex-wrap:wrap">
    <view :class="item.isSelected?'radio-text-select':'radio-text'" v-for="(item, index) in itemList" :key="index" @click="selectItem(index)">
      <text>{{item.name}}</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'SelectSingleView',
    data() {
      return {
        itemList:[],
        lastSelectIndex:-1,
      }
    },
    props:{
      typeName: {
        type: String,
        default: "",
      },
    },
    created() {
    },
    methods: {
      setItems(items, selectIndex){
        for (var index in items) {
          items[index].isSelected = false;
        }
        if (selectIndex > -1) {
          this.lastSelectIndex = selectIndex;
          items[this.lastSelectIndex].isSelected = true;
        }
        this.itemList = items;
      },
      selectItem(index){
        if (index != this.lastSelectIndex) {
          if (this.lastSelectIndex > -1) {
            this.itemList[this.lastSelectIndex].isSelected = false;
          }
          this.itemList[index].isSelected = true;
          this.lastSelectIndex = index;

          var item = this.itemList[index];
          item._index = index;
          this.$emit("onItemSelect", this.typeName, item);
        }
      },
    }
  }
</script>

<style scoped>
  .parent-row{
    display: flex;flex-direction: row;
  }
  .parent-column{
    display: flex;flex-direction: column;
  }
  .radio-text{
    display: flex;
    height: 30px;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    color: #535353;
    border: 1px solid #d4d4d4;
    border-radius: 3px;
    margin-right: 10px;
    background: white;
    margin-bottom: 10px;
  }
  .radio-text:last-child {
    margin-right: 0px;
  }
  .radio-text-select{
    display: flex;
    height: 30px;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    color: #C8A063;
    border: 1px solid #C8A063;
    border-radius: 3px;
    background: #FBF9F5;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .radio-text-select:last-child {
    margin-right: 0px;
  }
</style>
