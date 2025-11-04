<template>
  <view id="allMap"></view>
</template>

<script>
  export default {
    data() {
      return {
        map: null,
        jd: '',
        wd: ''
      }
    },
    onLoad(option) {
      this.jd = option.jd
      this.wd = option.wd
    },
    mounted() {
      let jd = this.jd
      let wd = this.wd
      this.map = new BMap.Map("allMap"); // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(jd, wd), 18); // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      this.map.addControl(new BMap.MapTypeControl({
        mapTypes: [
          BMAP_NORMAL_MAP,
          BMAP_HYBRID_MAP
        ]
      }));
      this.map.setCurrentCity("地址"); // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true);
    },
  }

</script>

<style scoped>
  #allMap {
    height: 100%;
    width: 100%;
  }

</style>
