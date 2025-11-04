const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const { normalizePath } = require('@dcloudio/uni-cli-shared/lib/util')
const { excludeFile, copyPayResult, copyGetAuthCode, addImagesPrefix, TransferImages} = require("./runtime/utils");

  

module.exports = {
  transpileDependencies: ["uview-ui"],
  /**
   * @type {Function}
   * @param {import('webpack-chain')} config
   */
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


    // process.env.UNI_PLATFORM == 'mp-weixin' && config.plugin('source-map-devtool')
    //   .use(webpack.SourceMapDevToolPlugin, [{
    //     test: [/\.js$/],
    //     exclude: [/pages\.json/, /node_modules/, /vue&type=template/, /vue&type=style/],
    //     filename: '.sourcemap/' + process.env.UNI_PLATFORM + '/[file].map',
    //     append: '\n//# sourceMappingURL=' + normalizePath('file:///' + path.join(process.env.UNI_CLI_CONTEXT, 'dist/dev/.sourcemap', process.env.UNI_PLATFORM + '/[file].map'))
    //   }])

    return config;
  },
  configureWebpack: {
    // externals: excludeFile(),
    plugins: [
			new CopyWebpackPlugin([...copyPayResult(), ...copyGetAuthCode()]),
      new TransferImages()
		]
  },
};
