// 主题色
const primaryColor = '#27a343'

// uView组件样式变量
const uViewCssVar = {
    '--u-view-primary__theme-color': primaryColor,
    '--u-tag__error__theme-color': '#ff3c3c',
}

// uni-ui组件样式变量
const uniUiCssVar = {
   
}

// 全局css变量
const globalCssVar = {
    // 主题色变量
    '--app-primary-color': primaryColor
}

// test/test.vue 页面样式值变量
const testTestCssVar = {

}



export default {
    themeCssVar: {
        ...uViewCssVar,
        ...uniUiCssVar,
        ...globalCssVar,
    },
    themeName: 'theme-default' // 主题以theme-开头
}