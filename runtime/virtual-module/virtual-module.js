const path = require('path')
const fs = require('fs')
const kindOf = require('kind-of')
const chokidar = require('chokidar')
const picomatch = require('picomatch')
const os = require('os')
const md5 = require('js-md5')
const tempStore = require('./tempStore')

module.exports = class VirtualModulePlugin {
  constructor(options) {
    const opts = kindOf(options) === 'object' ? options : {}
    this.fileList = Object.entries(opts)
      .filter(([key, val]) => kindOf(val) === 'object' && ['string', 'function'].includes(kindOf(val.content)))
      .reduce((store, [key, val]) => {
        store[key] = {
          content: val.content,
          watch: val.watch,
          moduleFile: ''
        }

        return store
      }, {})

    this.watchFlag = false // 如果运行过了就打上标记，表示只运行一次

    this.rootPath = path.join(os.tmpdir(), '.temp-module')
    if (!fs.existsSync(this.rootPath)) {
      fs.mkdirSync(this.rootPath)
    }
    let unique = md5(process.cwd())
    this.cache = tempStore(unique, this.rootPath)

    Object.entries(this.fileList).forEach(([moduleName, val]) => this.createFile(moduleName, val.content))
  }

  createFile(moduleName, content) {
    this.fileList[moduleName].moduleFile = this.cache.setTemp(moduleName, content)
  }

  watch() {
    // 使用 --null-- 进行占位
    const watcher = chokidar.watch(path.join(process.cwd(), '--null--'), { ignoreInitial: true })

    watcher.on('all', (eventName, filePath, stats) => {
      Object.entries(this.fileList).forEach(([moduleName, val]) => {
        if (!!val.watch) {
          const ismath = picomatch.isMatch(filePath, val.watch)
          if (ismath) {
            val.moduleFile = this.createFile(moduleName, val.content)
          }
        }
      })
    })
    Object.entries(this.fileList).forEach(([_, { watch }]) => {
      if (!watch) return

      // 添加监听的路径
      watcher.add(watch)
    })
  }

  apply(compiler) {
    compiler.hooks.entryOption.tap('VirtualModulePlugin', (context, entry) => {
      const config = compiler.options
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
      config.includes = config.includes || []
      const { alias } = config.resolve

      // 添加别名
      Object.entries(this.fileList).forEach(([moduleName, val]) => {
        if (Array.isArray(alias)) {
          alias.push({
            name: moduleName,
            alias: val.moduleFile
          })
        } else {
          alias[moduleName] = val.moduleFile
        }
      })
      
      return undefined
    })
    compiler.hooks.watchRun.tap('VirtualModulePlugin', () => {
      if (this.watchFlag) return
      this.watchFlag = true

      this.watch()
    })
  }
}