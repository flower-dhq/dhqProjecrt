import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import styleImport, { VantResolve } from 'vite-plugin-style-import';
const { join } = require('path');
const VITE_APP_CONFIG = process.env.VITE_APP_CONFIG || '{}';

const generateProxy = () => {
  const { PROXY_MAP = [] } = JSON.parse(VITE_APP_CONFIG);
  const proxys = {};

  if (Array.isArray(PROXY_MAP)) {
    PROXY_MAP.forEach((item) => {
      const { PATH, DOMAIN } = item;
      proxys[PATH] = {
        target: DOMAIN,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${PATH}`), ''),
      };
    });
  }

  return proxys;
};

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    styleImport({
      resolves: [VantResolve()],
    }),
  ],
  // 打包配置
  build: {
    target: 'modules', // 设置最终构建的浏览器兼容目标。modules:支持原生 ES 模块的浏览器
    outDir: 'dist', // 指定输出路径
    assetsDir: './assets', // 指定生成静态资源的存放路径
    sourcemap: false, // 构建后是否生成 source map 文件
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    host: 'localhost', // 指定服务器主机名
    port: 3000, // 指定服务器端口
    // open: true, // 在服务器启动时自动在浏览器中打开应用程序
    strictPort: false, // 设为 false 时，若端口已被占用则会尝试下一个可用端口,而不是直接退出
    https: false, // 是否开启 https
    cors: true, // 为开发服务器配置 CORS。默认启用并允许任何源
    proxy: {
      ...generateProxy(),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/style/common.scss";', // 添加公共样式
      },
    },
  },
});
