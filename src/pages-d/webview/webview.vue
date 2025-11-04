<template>
    <view>
        <web-view :src="urls" :update-title="false"></web-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            urls: '',
            code:'',
            prePage:''
        }
    },

    onLoad(e) {
        // 获取传递过来的链接
        this.urls = decodeURIComponent(e.url)
        this.code = e.code
        let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
        let curParam = routes[routes.length - 1].options; //获取路由参数 
        var prePage = routes[routes.length - 2];
        this.prePage = prePage.route
        const page = getCurrentPages()[3];
        const vm = page.$vm
    },
    mounted(){
        //产投动态为跳转到第三方链接，因其页面未命名，导致打包成app时，标题显示连接
        //此方法是修改app webview标题
        if(this.code=='chantou'){
            var currentWebview = this.$mp.page.$getAppWebview().children()[0];
            currentWebview.addEventListener('loaded', function() {
            setTimeout(()=>{
                uni.setNavigationBarTitle({
                title:'产投动态'
                })
                },1)
            }, false)
        } 
        // #ifdef APP-PLUS
        if(this.prePage == 'pages-d/activity/activityDetail'){
            var currentWebview = this.$mp.page.$getAppWebview().children()[0];
            currentWebview.addEventListener('loading', function() {
            setTimeout(()=>{
               uni.setNavigationBarTitle({
               title:'活动详情'
                    })
                },1)
            }, false)
            currentWebview.addEventListener('loaded', function() {
            setTimeout(()=>{
               uni.setNavigationBarTitle({
               title:'活动详情'
                    })
                },1)
            }, false)
        }
        // #endif
        }
}
</script>

<style>
</style>