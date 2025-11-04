let deviceObj = {
  deviceId: '',
  deviceName: '',
  deviceVendor: '',
  address: '',
  key: '',
  mac: '',
  projectId: '',
  projectName: ''
}

export function setDeviceData(data) {
  Object.keys(data).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(deviceObj, key)) {
      deviceObj[key] = data[key]
    }
  })
}

export function getDeviceData() {
  return Object.assign({}, deviceObj)
}