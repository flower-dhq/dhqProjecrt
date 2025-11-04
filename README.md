
## 运行/ 打包

``` bash
# 安装依赖
npm install

# 起本地服务
npm run dev:h5 
npm run dev:mp-weixin
npm run script-dev:xxx

# 生产打包
npm run build:h5
npm run build:mp-weixin
npm run script-build:xxx

````

## 开发时注意！！！
1、 由于云环境的项目共用一套代码一套配置一个环境，在web端如公众号存储localStorage的数据时，key键名会存在共用(冲突)问题，所以，存储localStorage的数据时，通过 `/src/js/utils` 里的 `storageAction` 方法存储，它会在键名后统一拼接projectType加以区分。  
```js
// 存储时会在键名前后加上前后缀例如：APP_MEMBER_ID_175，前缀区分同个浏览器其他工程存的键名有比较小可能相同(冲突)，后缀区分云环境冲突
const { MEMBER_ID } = this.$constant; // 挂到 Vue.prototype原型上
utils.storageAction({ key: MEMBER_ID, action: 'set', value: '会员id'}); // 储存
const memberId = utils.storageAction({ key: MEMBER_ID, action: 'get'}); // 获取
```   

## 配置线上图片说明

### 1、线上图片引用，需要通过 `/src/app-config/project -> IMG_BASE_URL IMG_BASE_FOLDER` 属性配置，
配置对应线上图片的域名、IP以及存放图片的目录，两个属性都配置才有效，不要用线上图片配置空值即可，生产环境才有效，开发环境还是用本地图片  

``` jsons
"APP_CONFIG": {
  "IMG_BASE_URL": "https://example.com", // 图片的域名或IP前缀
  "IMG_BASE_FOLDER": "online-assets", // 存放线上图片文件目录, 不用加斜杆
}
```

### 2、代码里的图片src引用：  

2.1、可在路径前面加上 `IMG_BASE_URL` 全局变量
```html
<image :src="bgImg" mode="aspectFill"></image>
```

``` js
// 背景图片
// computed 计算属性
bgImg() {
  return `${this.IMG_BASE_URL}/pages-a/static/${this.THEME_NAME}/top_bg.png`;
}
```

2.2、跟原来图片引入一致，加上别名@，但是，不要用相对路径 `../../static/`

```html
  <image src="@/pages-a/static/logo_img.png"></image>
  <!-- 或者，最好带上 @ -->
  <image src="/pages-a/static/logo_img.png"></image>
```

### 3、部署图片到线上
打包/编译(生产环境)后，图片资源会打包到对应平台的目录下，例如 `h5 mp-weixin app-plus`，它里面会有个图片目录 例如：`online-assets`，此目录名是 `IMG_BASE_FOLDER`属性配置的，最后把线上图片文件夹放到(剪切移走)线上服务对应的目录里     


## 前端规范

### 一、命名规范  
1、工程里的目录、文件、组件名命名统一采用小写英文字母命名，字母间以中横杠 "-" 拼接，例如：项目配置的文件夹 app-config  
2、图片命名以采用小写英文字母命名，字母间以下划线拼接, 例如： home_icon.png  
3、css类名命名同样也是小写英文字母命名，字母间以中横杠 "-" 拼接，例如：.user-info；可采用BEM命名规范，例如：.block__element--modifier  
4、js代码采用小驼峰命名，例如：lowerCamelCase；像配置性常量可用大写英文字母以下划"_"线分割，例如：PROJECT_CODE

### 二、统一代码编辑器
1、使用 Visual Studio Code 编辑器(VSCODE)，使用tab缩进为2个空格 (编辑器偏右下方设置)   
2、使用 Prettier - Code formatter(PCF) 代码格式插件    
3、PCF 大部分使用默认参数
- 要设置下面三项：设置-> 工作区 -> Prettier
- Print Width：指定每行代码的最佳长度，如果超出该长度则格式化，设置长点为300，默认80  
- Tab Width：指定一个制表符等于的空格数，设置为2个空格
-  Single Quote：使用单引号，勾上

### 三、代码规范
1、声明变量、常量使用对应关键字 let、const  
2、使用箭头函数，就不用再声明常量 _self 引用 this 上下文  
3、代码里面的 console.log 调试，提交代码时去掉  
4、不要把代码里的 debug 调试也代码提交了  
5、vue组件模板里的html元素写上注释方便定位查找，method里的方法上方也是写上注释  
6、代码尽可能写的简洁、不要有重复代码、删除无用代码，使用语义化命名  
例如：

```js
    // 不推荐
    const fn = () => {}
    if (this.obj.a.b) {
        fn(this.obj.a.b)
    }

    // 可以这样
    const semanteme = this.obj?.a?.b // 起个语义化名字

    if (semanteme) {
        fn(semanteme)
    }
```
7、vue 组件style、template、script 顺序  
> template 放到中间更适合些，因为style跟js更多有跟html有关联，放在中间可以上下看

```
<style></style>

<template></template>

<script></script>

```

8、uni-app 主/分包
- 主包，即是tabbar页面相关文件到主包里pages目录，其他都放到对应分包里
- 分包，在 /src/目录下建， 通用分包以pages-a, b, c ... 命名， 项目相关分包以pages-项目名, 例如，pages-ebei


## 工程配置

### 一、项目配置
1、项目配置在 /src/app-config/project 目录里建json文件进行配置  

2、json配置文件要有NAME属性，作为选择项目时的名称，为空或无此属性时，项目选择项会没有此项目
  
3、APP_CONFIG：跟项目相关的环境变量，这里环境变量最终会挂在到Vue.prototype.$appConfig  
- PROJECT_CODE：作为项目判断常量，新建配置时自定义，以常量格式命名

4、MANIFEST：manifest.json的配置项  
- /src/app-config/manifest.json作为通用的配置文件
- MANIFEST里的属性会跟/src/app-config/manifest.json进行合并，会以项目配置里的MANIFEST为主  

### 二、脚本命令
1、切换项目配置：npm run switch
- 它会把用户所选的项目配置，通过node重写到/src/app-config/env.json文件，$appConfig会引用这配置
- 也会把项目配置里MANIFEST跟manifest.json合并生成新的配置，写到/src/manifest.json

2、选择项目并启动/打包：npm run script-xxx，例如：npm run script-dev:h5
- script-dev:h5 执行node runtime/run-script.js NPM_ARG=dev:h5
- NPM_ARG参数值，作为要执行uni-app原本哪个脚本命令，是dev:h5、还是dev:mp-weixin
- npm run script-xxx，会先根据用户所选的项目配置设置好再执行NPM_ARG的命令，它会设置好manifest.json、APP_CONFIG (node环境变量，可从$appConfig读取)
- 在小程序或App 不要同时启动多个项目，因为前个项目的manifest.json会覆盖后面启动项目的配置


## Pages.json 配置
>由于多项目共用一个工程，会存在不是通用的页面文件；如果全部页面路由都配置pages.json里，会导致不是该项目的文件会占用包大小，比如，微信小程序有包大小数量限制，所以，需要按需加载对应项目的pages。

### 一、pages.js 钩子

1、通过在 /src/pages.js 里 module.exports 导出函数，函数返回pages.json格式的对象就可以动态按需设置pages  

2、按需配置项目的pages
- 在 /src/pages-json-config/ 目录下新建项目pages配置文件，以项目名命名，例如：xin-yi-dai.js
- pages-json-config 目录 会有个common.js 项目通用的配置，以此通用配置为基础跟对应项目配置进行合并
- 配置js文件有三个属性，PROJECT_CODE: 对应 /src/app-config/project -> APP_CONFIG 里的 PROJECT_CODE；PAGES_JSON: pages.json配置对象；CALL_BACK：合并common.js跟项目里的PAGES_JSON，最后对pages对象(PAGES_JSON)最后的修改
- pages-json-config/index.js 为自动引入文件，要排除某个非项目pages配置js文件，同样需要在index.js里 excluedFile 添加
- 需要条件判断配置，可通过 process.env.VUE_APP_PLATFORM 变量来判断

CALL_BACK：示例说明

```js
// 例如：/src/pages-json-config/test.js 
const config = {
    // 如果写此回调，最后合并完会回调此方法
    CALL_BACK: (pagesJs) => {
        
        // 例如一些场景：common.js pages主包有 A B C D 四个tabbar页，这是通用的，但是，有个个别项目 pages主包 就只有 A B,
        // 最后合并完主包还是 A B C D, A B 是以项目的主包为准的， C D 需要删掉，此时需要CALL_BACK
        
        // pagesJs: common.js 跟 项目test.js 合并完
        // 可在这对pagesJs做最后逻辑处理，并返回

        pageJs.pages.splice(2, 2) // 删除 C D 页面
        pageJs.tabBar.list.splice(2, 2) // 删除 C D的tabbar

        return pagesJs
    }
}

```

## 主题皮肤
> 因为 uni-app 不能在 js 动态import 引入css文件 ，在小程序 App不支持，所以，通过元素里的 :style 设置 css 样式变量，协同开发起来有点麻烦


### 一、主题样式使用前提

1、需要在每个页面的根元素，绑定 `:class="[THEME_NAME]" :style="[THEME_CSS_VAR]"`  
2、THEME_NAME 值为主题名，THEME_CSS_VAR 值为对应主题 CSS 样式变量  
3、THEME_NAME、THEME_CSS_VAR 通过全局 minxin 引入组件，可在组件之间直接使用  
4、默认主题，可在 `/src/app-config/project -> APP_CONFIG` THEME_NAME 配置主题

### 二、主题样式文件

1、跟主题相关的样式文件都放到 /src/theme-skin 目录里，主题名称统一以theme-开头，例如：theme-test  
2、/src/theme-skin 目录下建对应主题样式文件夹，例如, theme-test，就建个主题名为test的文件夹  
3、主题文件夹下有index.js index.scss，index.js 定义样式变量，index.scss 定义主题相关样式     
4、/src/theme-skin/index.js 为自动引入主题样式变量的文件   
5、/src/theme-skin/test/index.scss 主题样式文件还需在 `APP.vue` style 里面 `@import`  
6、跟主题相关的图片都放到主题名文件夹里 `static/theme-default/` 通用的可放在外面


### 三、组件库 [u-view](https://www.uviewui.com/) 主题色修改
1、组件库主题色默认为蓝色，需要跟着主题色变化  
2、组件库主题色通过 sass 变量 `$u-primary` 来更改，这个变量不好动态更改  
3、需要 CSS 样式变量来修改主题色，例如，`--u-view-primary__theme-color`   
4、/src/theme-skin/u-view-var.scss，为全局修改组件主题色样式文件  
5、还可通过 `uni.$u.setConfig` 方法修改组件主题色，但是，只能应用初始化时配置，后续动态更改不了   
6、部分静态组件直接在 `u-view-var.scss` 修改，动态组件要通过 props 修改对应主题颜色值, 可在`/theme-skin/u-view-props.js` 修改

``` js

// 设置u-view组件库 组件主题色 或者其他默认属性； primaryColor：主题颜色值
export default ({ primaryColor } = {}) => {

  const colorProps = {
    color: primaryColor,
  };
  const activeColorProps = {
    activeColor: primaryColor,
  };
  
  // 返回对象为 uni.$u.setConfig({props}) 的 props
  return {
    datetimePicker: {
      confirmColor: primaryColor,
    },
    calendar: colorProps,
    checkboxGroup: activeColorProps,
    radioGroup: activeColorProps,
    switch: activeColorProps
  };

};

// /js/comm-logic.js
import defaultProps from '@/theme-skin/u-view-props';

uni.$u.setConfig({
	props: defaultProps({primaryColor})
});

```

### 四、主题样式写法/使用

1、组件里根元素绑定 `:class="[THEME_NAME]" :style="[THEME_CSS_VAR]"` 

``` html
<template>
  <view class="index" :class="[THEME_NAME]" :style="[THEME_CSS_VAR]">
	 <!--有部分组件无法通过 u-view-var.scss 修改，还是通过props 属性修改  -->
     <u-switch v-model="switchVal" :activeColor="THEME_COLOR"></u-switch>
  </view>
</template>

```

2、定义主题相关的样式变量

``` js

// 主题色
const primaryColor = '#13C3BF'

// uView组件样式变量
const uViewCssVar = {
    '--u-view-primary__theme-color': primaryColor,
    '--u-tag__error__theme-color': '#ff3c3c',
}

// uni-ui组件样式变量
const uniUiCssVar = {
   
}

const globalCssVar = {
    '--app-primary-color': primaryColor
}

// test/test.vue 页面样式值变量
const testTestCssVar = {
    '--skin-shape__bd-color': primaryColor
}


export default {
    themeCssVar: {
        ...uViewCssVar,
        ...uniUiCssVar,
        ...globalCssVar,
        ...testTestCssVar,
    },
    themeName: 'theme-test' // 主题以theme-开头
}

```

3、定义主题相关的scss样式

``` css
/* 命名格式 */
 /* 1、选择器尽量简洁，三级选择器以内 */
 /* 2、部分样式属性简写：[background-color：bg-color]  [border-color: bd-color] [background-image:bg-img] */
 /* 3、变量名命名规则：--元素(英文小写、单词之间以-拼接)__(元素或状态之间以__双下划线拼接)元素__样式属性(若多个样式属性共用一个值，起个通用语意名字) */

/* 主题 default */

/* view 增加css权重 */
view.theme-default.test {
  .skin-shape {
    border-radius: 50%;
  }
}

/* 主题 test */

/* view 增加css权重 */
view.theme-test.test {
  .skin-shape {
    border-radius: 10rpx;
    background-image: url(@/pages-a/static/logo.png);
    background-size: contain;
    border: 4rpx solid var(--skin-shape__bd-color);
  }
}

```

## 全局接口请求服务
需要到 `/src/service` 目录看文档使用说明


## uni-app 工程开发注意事项

### 一、node的版本管理器： NVM 
1、搭建此工程里时node版本为 `14.18.3`   
2、如果在其他版本的node安装依赖有问题，可以使用NVM调整node版本


### 二、分包配置
1、不是主包，即：不是tabbar的页面资源文件都放到分包里  
2、需要在pages.json 对象里 `subPackages` 配置对应分包的目录及页面路径(path)  
3、在主包不要引入分包的资源，在其他端会加载失败  
4、static 静态资源文件，不管是否有使用都会进行打包的，没用到的资源，像图片那些要删掉   

### 三、js 文件说明 (src/js)

1、constant.js 全局常量写到此文件，方便统一管理修改  
2、utils.js 全局自定义工具方法，像格式化时间之类方法写这里  
3、minxins.js 定义 全局、更多是组件级别的混合  
4、comm-logic.js 定义通用/复用的业务逻辑方法

### 四、字体图标使用
1、若设计将图标做到阿里的[iconfont](https://www.iconfont.cn/)网站上   
2、我的项目-> 找到对应项目 -> 下载至本地  
3、在static 建iconfont 存放 `iconfont.ttf` 文件  
4、在 `App.vue` style标签 引入  
``` css
	/* 引入字体图标 */
	@font-face {
		font-family: 'iconfont';
		src: url('~@/static/iconfont/iconfont.ttf?t=1663995538547') format('truetype');
	}
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 32rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

```
5、使用时，复制对应图标的 `unicode` 到 `text` 元素上及加上 `iconfont` 类名
```html
<text class="iconfont icon-service">&#xe64b;</text>
````  

> 注意，图片地址，都配置成 https://saas60.wuyeface.com/qw-online-assets ，然后统一上传到这台服务器上。

### 五、调试/开发：运行在App、小程序
1、执行 `npm run script-dev:mp-weixin`, 去到 `/dist/dev/mp-weixin` mp-weixin 目录用微信开发工具打开  
2、执行 `npm run switch` 选择切换完项目后，可用 `HBuilderX` 工具打开工程目录，运行 > 运行到手机或者模拟器 > 运行到手机基座  
3、App端：uni-app运行环境版本和编译器版本不一致的问题  
- 主要是 cli编译器跟 HBuilderX 版本不一致  
- [解决方法](https://ask.dcloud.net.cn/article/35627)
- [修改cli编译跟HBuilderX同版本](https://uniapp.dcloud.net.cn/quickstart.html#%E4%BF%AE%E6%94%B9%E4%BE%9D%E8%B5%96%E4%B8%BA%E6%8C%87%E5%AE%9A%E7%89%88%E6%9C%AC)

### 六、vuex数据状态与事件通信
1、全局通用的数据状态放到 `/store/index.js` ，跟项目相关的、某个模块放到 `/store/module` 里  
2、页面间的通信可用：`uni.$emit` `uni.$on` `uni.$off` 接口

### 七、组件库 [uni-ui](https://hellouniapp.dcloud.net.cn/)
1、优先使用 `u-view` 不满足需求，可以考虑 `uni-ui`   
2、不满足情况：没有对应业务组件、或者在多端兼容性不好   
3、主题皮肤设置跟 `u-view` 类似  
4、easycom：不用手动引入组件、注册，可直接使用；会按需打包组件  

### 八、nvue 组件 
1、nuve 组件接近原生渲染，可用于App端性能要求高的页面  
2、普通页面用vue组件

### 九、[APP打包教程](https://nativesupport.dcloud.net.cn/AppDocs/README)


## 项目配置事项


### 一、常用链接配置

用于“分享”操作，和用于“常用链接”操作。

projectType：需要去运营中心PC端查看

1、分享工单

* 来源：pages-workorder/workorder-detail/detail
* 标题：分享工单
* 图标：https://saas60.wuyeface.com/qw-online-assets/static/theme-default/common/gdxqShare.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=none&pathCode=repairProgress
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=none&pathCode=repairProgress&projectType=xxx
* appid：小程序/公众号 的APPID


2、分享催缴

* 来源：pages-payment/modules/payment-list
* 标题：分享催缴
* 图标：https://saas60.wuyeface.com/qw-online-assets/static/theme-default/common/payment-poster.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=none&pathCode=paymentCenterNew
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=none&pathCode=paymentCenterNew&projectType=xxx
* appid：小程序/公众号 的APPID


3、分享缴费

* 来源：pages-leasing/staffPayment
* 标题：分享缴费
* 图标：https://saas60.wuyeface.com/qw-online-assets/static/theme-default/index/payment.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=none&pathCode=staffPayment
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=none&pathCode=staffPayment&projectType=xxx
* appid：小程序/公众号 的APPID


4、报事报修

* 来源：pages-a/commonPage/index
* 标题：报事报修
* 图标：https://wy.gdxsjt.com/filemanager/previewFile?fileId=c4a397cd-1fe5-42da-b99c-606882cb5fc3&type=filedatabase/0e3abc74-6749-40d4-9a00-5370fd8ef2c7.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=none&pathCode=repair
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=none&pathCode=repair&projectType=xxx


5、投诉建议

* 来源：pages-a/commonPage/index
* 标题：投诉建议
* 图标：https://cms.wuyeface.com/filemanager/filedatabase/crm/img/2023/6/7/9139a001-48d4-44b7-ab2e-46cd81ea5ca6.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=none&pathCode=complaint
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=none&pathCode=complaint&projectType=xxx


6、房屋认证

* 来源：pages-a/commonPage/index
* 标题：房屋认证
* 图标：https://cms.wuyeface.com/filemanager/filedatabase/crm/img/2023/6/7/f03f0180-e5cb-4767-a839-9ace1cd79ec7.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=fw
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=fw&projectType=xxx


7、企业认证

* 来源：pages-a/commonPage/index
* 标题：企业认证
* 图标：https://cms.wuyeface.com/filemanager/filedatabase/crm/img/2023/6/9/e32cd59a-5f2f-4818-8bd4-3fc613ca6a50.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=qy
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=qy&projectType=xxx


8、分享会员活动

* 来源：pages-activity/modules/activity-sheet
* 标题：分享会员活动
* 图标：https://cms.wuyeface.com/filemanager/filedatabase/crm/img/2023/6/9/e32cd59a-5f2f-4818-8bd4-3fc613ca6a50.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=fw&pathCode=activityDetail
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=fw&pathCode=activityDetail&projectType=xxx


9、分享问卷

* 来源：pages-visit/questionnaire/investigation
* 标题：分享问卷
* 图标：https://cms.wuyeface.com/filemanager/filedatabase/crm/img/2023/9/7/42cb2109-6151-4cb5-a1a4-13f0497d77d0.png
* 页面-小程序：pages-a/authorization/auth-certify.html?authType=none&pathCode=questionDetail
* 页面-公众号：域名/uniwechat/#/pages-a/authorization/auth-certify?authType=none&pathCode=questionDetail&projectType=xxx


10、业户档案

* 来源：pages-archives/redirect-owner/index
* 标题：业户档案
* 图标：
* 页面-小程序：pages-archives/redirect-owner/index.html


11、业户工单

* 来源：pages-workorder/my-workorder/auth-order
* 标题：业户工单
* 图标：
* 页面-小程序：pages-workorder/my-workorder/auth-order.html


12、业户账单

* 来源：pages-leasing/selectProperty
* 标题：业户账单
* 图标：
* 页面-小程序：pages-leasing/selectProperty.html