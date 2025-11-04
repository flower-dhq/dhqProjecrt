const path = require('path')
const fs = require('fs')
const kindOf = require('kind-of')
const rimraf = require('rimraf')

/**
 * 
 * @param {string} tempId 最后会拼接成 directory + tempId 路径
 * @param {string} directory 临时文件夹的路径
 */
module.exports = function create(tempId, directory) {
  directory = path.normalize(directory)
  const isExist = fs.existsSync(directory)
  const isDir = isExist && fs.statSync(directory).isDirectory()

  if (!isDir) {
    throw new Error(`【virtual-module】no such directory, stat '${directory}'`)
  }

  const tempPath = path.normalize(path.join(directory, tempId))
  rimraf.sync(path.join(tempPath, '/**')) // 清空目录
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath)
  }

  return {
    /**写入到临时文件中 */
    setTemp(moduleName, content) {
      const moduleFile = path.normalize(path.join(tempPath, moduleName))

      const writeStream = fs.createWriteStream(moduleFile, { encoding: 'utf-8', flags: 'w+' })
      writeStream.write(kindOf(content) === 'string' ? content : kindOf(content) === 'function' ? content.call(null) : '')
      writeStream.end()

      return moduleFile
    }
  }
}

