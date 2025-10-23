const CopyWebpackPlugin = require('copy-webpack-plugin')
const { excludeFile, copyPayResult, copyGetAuthCode, addImagesPrefix, TransferImages, copyOauth, copyOauth2, getAppConfig } = require("./runtime/utils");
// const CopyStaticPlugins = require('@ebei-component/ebei-pay/plugins/copy-static-plugin')
const { IMG_BASE_URL, IMG_BASE_FOLDER } = getAppConfig()


module.exports = {
  transpileDependencies: ["@dcloudio/uni-ui", "uview-ui"],
  chainWebpack: (config) => {
    config.optimization.usedExports = true;
    config.optimization.minimize = true;

    // 全局script。指那些无法用npm，只能在html里通过script挂在的文件
    config.module
      .rule('global')
      .test(/jweixin\-1\.6\.0\.js$/)
      .use('script-loader')
      .loader('script-loader')
      .end()

    // 修改图片前缀 
    addImagesPrefix(config)

    return config;
  },
  configureWebpack: {
    // externals: excludeFile(),
    plugins: [
      new CopyWebpackPlugin([...copyPayResult(), ...copyGetAuthCode(), ...copyOauth(), ...copyOauth2()]),
      // new TransferImages(), //图片打包迁移问题
      // CopyStaticPlugins({
      //   to: IMG_BASE_FOLDER + '/static'
      // })
    ],
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
      }
    }
  },
};
