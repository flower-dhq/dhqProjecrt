<template>
  <view class="page">
    <view class="mod">
      <cl-scroller ref="scroller" @up="onUp" @down="onDown">
        <view class="mod-item" v-for="(item,i) in shopList" :key="i">
          <p>{{item.sellerName}} - {{item.sellerUserAccount}}</p>
          <cl-button type="error" round @click="unBindAccount(item.sellerUserId)">解绑</cl-button>
        </view>

        <cl-loadmore v-if="shopList.length > 0" :loading="loading" :finish="noMore"></cl-loadmore>
      </cl-scroller>

    </view>

    <cl-message ref="message"></cl-message>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        pageNum: 1, // 当前页数
        pagesize: 10,  // 每页显示的条数
        pageCount: 0,  // 总页数
        loading: false,
        noMore: false,
        shopList:[]
      }
    },
    methods:{
      async getSellersList(){
        const args = {
					pathParams: `/${this.pagesize}/${this.pageNum}`,
					hideLoading: true
				}
        return await this.$mallApi.data.sellerUserPage(args)
      },
      onUp() {
				this.loading = true;

				setTimeout(async() => {
          this.pageNum++;
          if(this.pageNum <= this.pageCount){
            const res = await this.getSellersList()
            this.shopList.push(res.data.records)
            this.loading = false;
          } else {
            this.loading = false;
            this.noMore = true;
            this.$refs["scroller"].end();
          }
				}, 1000);
			},
			onDown() {
				setTimeout(async() => {
          const res = await this.getSellersList()
          this.pageCount = res.pages;
          this.shopList = res.data.records
          if(res.data.total < 10){
            this.noMore = true;
          }

					this.$refs["scroller"].end();
				}, 1000);
			},
      async unBindAccount(sellerUserId){
        const args = {
					pathParams: `/${sellerUserId}`
				}
        const res = await this.$mallApi.data.unbindSellerUser(args)

        if(res.statusCode == 200){
          this.$refs["message"].open({
            type: 'success',
            message: '解绑成功',
            position: 'middle'
          });
          this.onDown()
        } else {
          this.$refs["message"].open({
            type: 'error',
            message: res.message,
            position: 'middle'
          });
        }
      }
    },
    onLoad(){
      this.onDown()
    },
    
  }
</script>

<style lang="scss" scoped>
.page {
  background: #f7f7f7;
  height: 100%;
  width: 100%;
  padding-top: 20rpx;
}

.mod {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .mod-item {
    padding: 30rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      color: #333333;
      margin-left: 30rpx;
    }
  }

  
}
</style>