let locationUtil = {}

/**
 * @description 调用baidu地图进行定位
 * @returns {Promise<*>}
 */
locationUtil.getLocation = function () {
  return new Promise ((resolve, reject) => {
    let geolocation = new window.BMap.Geolocation()
    geolocation.getCurrentPosition(function(r) {
      let status = this.getStatus()
      if(status == BMAP_STATUS_SUCCESS){
        resolve(r)
      } else {
        let err = new Error('定位失败')
        reject(err)
      }
    })
  })
}

export default locationUtil;
