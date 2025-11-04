function getLocalFilePath(path) {
  if (path.indexOf('_www') === 0 || path.indexOf('_doc') === 0 || path.indexOf('_documents') === 0 || path.indexOf('_downloads') === 0) {
    return path
  }
  if (path.indexOf('file://') === 0) {
    return path
  }
  if (path.indexOf('/storage/emulated/0/') === 0) {
    return path
  }
  if (path.indexOf('/') === 0) {
    var localFilePath = plus.io.convertAbsoluteFileSystem(path)
    if (localFilePath !== path) {
      return localFilePath
    } else {
      path = path.substr(1)
    }
  }
  return '_www/' + path
}

function dataUrlToBase64(str) {
  var array = str.split(',')
  return array[array.length - 1]
}

var index = 0
function getNewFileId() {
  return Date.now() + String(index++)
}

function biggerThan(v1, v2) {
  var v1Array = v1.split('.')
  var v2Array = v2.split('.')
  var update = false
  for (var index = 0; index < v2Array.length; index++) {
    var diff = v1Array[index] - v2Array[index]
    if (diff !== 0) {
      update = diff > 0
      break
    }
  }
  return update
}

export function base64ToPath(base64) {
  return new Promise(function (resolve, reject) {
    if (typeof window === 'object' && 'document' in window) {
      base64 = base64.split(',')
      var type = base64[0].match(/:(.*?);/)[1]
      var str = atob(base64[1])
      var n = str.length
      var array = new Uint8Array(n)
      while (n--) {
        array[n] = str.charCodeAt(n)
      }
      return resolve((window.URL || window.webkitURL).createObjectURL(new Blob([array], { type: type })))
    }
    var extName = base64.split(',')[0].match(/data\:\S+\/(\S+);/)
    if (extName) {
      extName = extName[1]
    } else {
      reject(new Error('base64 error'))
    }
    var fileName = getNewFileId() + '.' + extName
    if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
      var filePath = wx.env.USER_DATA_PATH + '/' + fileName
      wx.getFileSystemManager().writeFile({
        filePath: filePath,
        data: dataUrlToBase64(base64),
        encoding: 'base64',
        success: function () {
          resolve(filePath)
        },
        fail: function (error) {
          reject(error)
        }
      })
      return
    }
    reject(new Error('not support'))
  })
}
