<template>
  <div class="list_cont">
    <div class="title">
      认证企业
    </div>
    <div class="line"></div>
    <div class="company_item">
      <div class="company_title">
        <span v-if="companyInfo.name" class="l_name">{{ companyInfo.name }}</span>
        <span v-else class="l_noData">请选择企业</span>
        <img class="r_img" src="../../assets/images/companyAuth/icon_right.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['companyInfo'],
  data(){
    return{
      
    }
  },
  methods:{
    //格式化手机号码
    formatTel(tel){
      if(tel){
        let reg = /^(\d{3})\d{4}(\d{4})$/;  
        return tel.replace(reg, "$1****$2");
      }
      
    },
    //格式化
    formatName(str){
      if(str){
        let arr=str.split('')
        let list=''
        for(let i=0;i<arr.length;i++){
          if(i==0){
            list=arr[0]
          }else{
            list=list+'*'
          }
        }
        return list
      }
      
    },
  }
}
</script>
<style lang="scss" scoped>
.list_cont{
  .title{
    padding: 0 22px;
    height: 1rem;
    line-height: 1rem;
    color: #333;
    font-size: 0.32rem;
    font-weight: bold;
    background-color: #fff;
  }
}
  .company_item{
    margin-bottom: 10px;
    padding: 6px 22px;
    background-color: #fff;
    .company_title{
      padding: 10px 0;
      overflow: hidden;
      font-size: 0.3rem;
      color: #333333;
      font-weight: bold;
      .l_name{
        float: left;
      }
      .l_noData{
        float: left;
        font-weight: 400;
        color: #d7d7d7;
        padding-bottom: 10px;
      }
      .r_img{
        float: right;
        position: relative;
        top: 0.1rem;
        width: 0.24rem;
        height: 0.24rem;
      }
    }
    .authInfo_cont{
      padding: 8px 0;
      div{
        display: flex;
        padding: 7px 0;
        font-size: 0.28rem;
        color: #707070;
        img{
          width: 0.36rem;
          height: 0.36rem;
        }
        span{
          display: 1;
          margin-left: 3px;
        }
      }

    }
  }
  .line{
    position:relative;    //先给元素设置定位,除了static都可以
  }
  .line::after{
    content: '';    //追加一个空
    position: absolute;    //设置定位
    top: 0;  //如果不设置可能会出现偏移
    left: 0;  
    border-bottom: 1px solid #e4e4e4;    //设置边框
    width: 200%;    //设置为插入元素的两倍宽高
    height: 200%;
    transform-origin: 0 0;    //设置元素的基点为0 0
    transform: scale(0.5,0.5);    //宽高缩小一半
    box-sizing: border-box;    //设置盒模型 这一步必须要有,否则边框不会随着一起缩放
  }
</style>