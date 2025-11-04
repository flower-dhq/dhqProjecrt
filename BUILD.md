
## 按需打包说明

1、增加按需编译/打包的脚本命令在package.json，例如：`script-dev:mp-wx_kanban`、 `script-build:mp-wx_kanban,` 右侧增加对应参数 `MODULE=BASE,KANBAN` MODULE右侧参数值逗号左侧值为pages.json配置参数的基础配置或者通用配置，逗号右侧值为应用的按需的配置 


2、MODULE参数右侧的参数值：“基础配置” “按需配置”，要对`pages-json-config`文件夹配置js文件里的PROJECT_CODE，例如：

```js
  // 配置对象
  const config = {
    // 项目编码
    PROJECT_CODE: 'BASE'
  };
```

3、如果脚本命令没有MODULE参数，按照之前方式进行编译；例如，通用配置还是用`pages-json-config`里的 `common.js`，按需的配置还是用`app-config/project`项目配置文件里`APP_CONFIG.PROJECT_CODE`；


4、全量打包可以执行原来脚本命令：`script-build:mp-weixin`，按需打包可以执行自定义命令 `script-build:mp-xxx`，也就是在原来命令 `node runtime/run-script.js NPM_ARG=dev:mp-weixin` 基础上增加 `MODULE=BASE,KANBAN`，此参数MODULE可以按需自定义