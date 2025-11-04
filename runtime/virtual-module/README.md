## VirtualModule
可生成虚拟模块。

### 属性
{ moduleName, options }

* moduleName {string} 文件名
* options {ModuleOptions}

**ModuleOptions：**
* content {string | function} 文件内容
* watch {string} 需要监听的路径，书写格式可参照[picomatch](https://www.npmjs.com/package/picomatch#user-content-globbing-features) 

### 使用
```js
// vue.config.js
const VirtualModulePlugin = require('./virtual-module')

module.exports = {
  configureWebpack: {
    plugins: {
      new VirtualModulePlugin({
        'theme-demo.scss': {
          content() { return ':root { --main-theme: '#ff3c3c' }' },
          watch: path.resolve(process.cwd(), 'src/theme-skin/**/*.scss')
        }
      })
    }
  }
}
```

```js
// src/uni.scss

@import 'theme-demo.scss';
```