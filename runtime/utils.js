const fs = require("fs");
const path = require("path");
const hjson = require("hjson");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { spawn } = require("child_process");

// 判断是否对象
const paramIsObject = (param) => typeof param === "object" && param !== null && !Array.isArray(param);

const resolve = (...dir) => {
  return path.join(__dirname, '..', ...dir)
}

/**
 * @description: 返回用户选择项目配置文件
 * @return {*} Promise
 */
const selectProjectByMenu = () => {
  const projectPath = "../src/app-config/project";
  const configPath = path.resolve(__dirname, projectPath);
  const files = fs.readdirSync(configPath);
  const menu = files.map((file) => hjson.parse(fs.readFileSync(path.resolve(configPath + "/" + file), "utf-8"))).filter((item) => item.NAME);
  const choices = menu.map((item, index) => ({
    name: item.NAME,
    value: index,
  }));
  const questions = [
    {
      type: "rawlist",
      name: "index",
      message: "请选择项目序号：",
      choices,
    },
  ];
  return new Promise((resolve) => {
    inquirer
      .prompt(questions)
      .then(({ index }) => {
        const result = menu[index];
        resolve({ result });
      })
      .catch((error) => {
        resolve({ error });
      });
  });
};

/**
 * @description: 切换/转换配置对象，重写env.json
 * @param {*} project 项目配置信息
 * @return {*} Promise
 */
const switchEnvJson = (project) => {
  const isObject = paramIsObject(project && project.APP_CONFIG);
  return new Promise((resolve) => {
    if (isObject) {
      const appConfig = project.APP_CONFIG;
      const rewriteJson = JSON.stringify(appConfig, null, 4);
      fs.writeFileSync(path.resolve(__dirname, "../src/app-config/env.json"), rewriteJson, { encoding: 'utf-8', flag: 'w' });
      resolve({ code: 1 });
    } else {
      resolve({ error: "APP_CONFIG 不是一个对象" });
    }
  });
};

/**
 * @description: 切换项目manifest.json配置
 * @param {*} project 项目配置信息
 * @return {*} Promise
 */
const switchManifest = (project) => {
  return new Promise((resolve) => {
    const isObject = paramIsObject(project && project.MANIFEST);
    const isInstance = (d) => typeof d === "object" && d !== null;
    const hasOwnProp = (obj, k) => obj.hasOwnProperty(k);
    // 递归合并及修改Manifest
    const recursion = (prjMnfstDt, cmmMnfsDt) => {
      if (isInstance(prjMnfstDt)) {
        for (const k in prjMnfstDt) {
          const prjMnfstDtVal = prjMnfstDt[k];
          if (hasOwnProp(prjMnfstDt, k) && isInstance(prjMnfstDtVal)) {
            if (!hasOwnProp(cmmMnfsDt, k)) {
              const isArray = Array.isArray(prjMnfstDtVal);
              cmmMnfsDt[k] = isArray ? [] : {};
            }
            recursion(prjMnfstDtVal, cmmMnfsDt[k], k);
          } else {
            cmmMnfsDt[k] = prjMnfstDtVal;
          }
        }
      }
    };
    if (isObject) {
      // 单独配置
      const projectManifest = project.MANIFEST;
      // 通用配置
      const commonManifest = hjson.parse(fs.readFileSync(path.resolve(__dirname, "../src/app-config/manifest.json"), "utf-8"));
      // 以projectManifest为准修改commonManifest
      recursion(projectManifest, commonManifest);

      // 重写manifest.json
      fs.writeFileSync(path.resolve(__dirname, "../src/manifest.json"), JSON.stringify(commonManifest, null, 4));
      resolve({ code: 1 });
    } else {
      resolve({ error: "MANIFEST 不是一个对象" });
    }
  });
};

/**
 * @description: 转换project配置到env
 * @param {*} project APP_CONFIG对象
 * @return {*} void
 */
const convert2EnvFile = (project) => {
  const isObject = paramIsObject(project && project.APP_CONFIG);
  const appConfig = isObject ? project.APP_CONFIG : {};
  const envConfig = isObject ? `VUE_APP_CONFIG=${JSON.stringify(appConfig)}` : "";
  fs.writeFileSync(path.resolve(__dirname, "../src/app-config/.env"), envConfig);
};

/**
 * @description: 获取npm run scrip 参数
 * @param {Array} argv node 环境变量
 * @return {object} 参数对象
 */
const parseRunScriptArgs = (argv) => {
  const [nodeExec, scriptPath, ...args] = Array.isArray(argv) ? argv : [];
  const params = {};
  args.forEach((str) => {
    const [key, value] = str.split("=");
    params[key] = value;
  });
  return params;
};

const execScriptCmd = (cmd) => {
  spawn(cmd, { stdio: "inherit", shell: true });
};

/**
 * @description: 排除打包文件
 * @param {*} params
 * @return {function}
 */
const excludeFile = (params = {}) => {
  const isProd = process.env.NODE_ENV === "production";
  const { THEME_NAME } = (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || {};
  const themeName = (typeof THEME_NAME === "string" && THEME_NAME.replace(/^theme-/, "")) || "default";
  const excludeThemeFile = (context, request) => {
    const themeSkinFolder = new RegExp(`theme-skin$`).test(context);
    const themeCssVar = new RegExp(`^.\/.+\/index\.js$`).test(request);
    const excludeTheme = !new RegExp(`^.\/${themeName}\/index\.js$`).test(request);
    return isProd && themeSkinFolder && themeCssVar && excludeTheme;
  };
  return function (context, request, callback) {
    if (excludeThemeFile(context, request)) {
      callback(null, { excludeCssVar: "commonjs " + request });
    } else {
      callback();
    }
  };
};

/**
 * @description: 获取已选下项目的配置appConfig
 * @return {object}
 */
const selectedProject = () => {
  const appEnvJson = require('../src/app-config/env');
  return (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || appEnvJson || {};
}

// 拷贝 public/getAuthCode.html
function copyGetAuthCode() {
  const PRODUCTION = process.env.NODE_ENV === 'production'
  const H5 = process.env.UNI_PLATFORM === 'h5'

  if (!PRODUCTION || !H5) return []

  return [{
    from: resolve('public/getAuthCode.html'),
    to: resolve('dist', 'build', 'h5')
  }]
}

// 拷贝 public/payResult.html
function copyPayResult() {
  const PRODUCTION = process.env.NODE_ENV === 'production'
  const H5 = process.env.UNI_PLATFORM === 'h5'
  const { DOMAIN_DEV } = selectedProject()
  if (!PRODUCTION || !H5) return []

  return [{
    from: resolve('public/payResult.html'),
    to: resolve('dist', 'build', 'h5'),
    transform: (content, path) => {
      const baseUrlStr = `var baseUrl = '${DOMAIN_DEV}';`

      return content
        .toString()
        .replace(/var baseUrl = (.*)+;/g, baseUrlStr)
    }
  }]
}
// 拷贝 public/oauth.html
function copyOauth() {
  const PRODUCTION = process.env.NODE_ENV === 'production'
  const H5 = process.env.UNI_PLATFORM === 'h5'
  const { DOMAIN_DEV } = selectedProject()
  if (!PRODUCTION || !H5) return []

  return [{
    from: resolve('public/oauth.html'),
    to: resolve('dist', 'build', 'h5'),
    transform: (content, path) => {
      const baseUrlStr = `var baseUrl = '${DOMAIN_DEV}';`

      return content
        .toString()
        .replace(/var baseUrl = (.*)+;/g, baseUrlStr)
    }
  }]
}

// 拷贝 public/oauth.html
function copyOauth2() {
  const PRODUCTION = process.env.NODE_ENV === 'production'
  const H5 = process.env.UNI_PLATFORM === 'h5'
  const { DOMAIN_DEV } = selectedProject()
  if (!PRODUCTION || !H5) return []

  return [{
    from: resolve('public/oauth2.html'),
    to: resolve('dist', 'build', 'h5'),
    transform: (content, path) => {
      const baseUrlStr = `var baseUrl = '${DOMAIN_DEV}';`

      return content
        .toString()
        .replace(/var baseUrl = (.*)+;/g, baseUrlStr)
    }
  }]
}

/**
 * @description: 获取项目配置信息
 * @return {object}
 */
 const getAppConfig = () => {
  const appEnvJson = require('../src/app-config/env.json');
  return (process.env.VUE_APP_CONFIG && JSON.parse(process.env.VUE_APP_CONFIG)) || appEnvJson || {};
};

/**
 * 判断文件是否存在
 * @param {string} url
 * @param {object} options
 * @param {'file'|'directory'} options.mode
 */
function existFile(url = '', options = {}) {
  const mode = options.mode || 'file'

  const isExist = fs.existsSync(url)
  if (!isExist) return false

  const stat = fs.statSync(url)
  return mode === 'file' ? stat.isFile : mode === 'directory' ? stat.isDirectory : false
}

/**
 * 获取json文件内容
 */
function getJsonFile(url = '') {
  return hjson.parse(fs.readFileSync(url, "utf-8"))
}

/**
 * @description: 是否修改图片前缀，换线上
 * @return {boolean}
 */
 const hasImgBaseUrl = () => {
  const { IMG_BASE_URL, IMG_BASE_FOLDER } = getAppConfig();
  const production = process.env.NODE_ENV === 'production';
  const useOnline = typeof IMG_BASE_URL === 'string' && typeof IMG_BASE_FOLDER === 'string' && IMG_BASE_URL && IMG_BASE_FOLDER; // 有设置前缀才改
  return useOnline && production;
};

/**
 * @description: 修改图片路径前缀
 * @param {import("webpack-chain")} config ChainableConfig
 * @return {*}
 */
 const addImagesPrefix = (config) => {
  const { IMG_BASE_URL, IMG_BASE_FOLDER } = getAppConfig();
  const modifyImgBaseUrl = hasImgBaseUrl();

  if (modifyImgBaseUrl && config) {
    config.module
      .rule('images')
      .use('url-loader')
      .tap((args) => {
        const fallback = args.fallback || {}

        return Object.assign({}, args, {
          limit: false,
          fallback: {
            ...fallback,
            options: {
              publicPath: IMG_BASE_URL,
              name(resourcePath, resourceQuery) {
                resourcePath = (resourcePath || '').replace(/[\\\/]/g, '/')

                const staticPath = resourcePath.split('/src/')[1]
                return IMG_BASE_FOLDER + '/' + staticPath
              },
              emitFile: false,
            }
          }
        })
      })
      .end()
  }
};

// 迁移图片
class TransferImages {
  apply(compiler) {
    const modifyImgBaseUrl = hasImgBaseUrl();
    const { IMG_BASE_FOLDER } = getAppConfig();
    if (modifyImgBaseUrl) {
      compiler.hooks.emit.tap({ name: 'transferImages' }, (compilation) => {
        const tabbarImg = ['tabbar_home.png', 'tabbar_mine.png','tabbar_code.png', 'tabbar_service.png', 'tabbar_mall.png','tabbar_industry.png','tabbar_door.png'];
        Object.keys(compilation.assets).forEach((key) => {
          const imageTyppe = /\.(png|jpe?g|gif|webp)$/.test(key);
          const isTabbarImg = tabbarImg.some((img) => key.endsWith(img));
          const stringSource = compilation.assets[key].source && typeof compilation.assets[key].source() === 'string';

          // 迁移图片到 IMG_BASE_FOLDER
          if (imageTyppe && !isTabbarImg) {
            compilation.assets[`${IMG_BASE_FOLDER}/` + key] = compilation.assets[key];
            delete compilation.assets[key];
          }
          // 修改图片src
          if (stringSource) this.modifyImagesSrc(compilation, key);
        });
      });
    }
  }

  // 修改图片src
  modifyImagesSrc(compilation, key) {
    const platform = process.env.UNI_PLATFORM;
    const { IMG_BASE_URL, IMG_BASE_FOLDER } = getAppConfig();
    const urlPrefix = `${IMG_BASE_URL}/${IMG_BASE_FOLDER}`;
    const modifyFileTyppe = /\.(wxml|js)$/.test(key);
    let content = compilation.assets[key].source();
    const action = {
      resetContent(content) {
        compilation.assets[key] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          },
        };
      },
      h5() {
        // 修改 h5页面 css背景图片前缀
        const reg = /(background|background-image):url\(((@|~@)?\/pages-[^\s.]*)?\/static\/[^\s.]*\.(png|jpe?g|gif|svg)"/g;
        content = content.replace(reg, function (str) {
          const orignalStr = str.replace(/@|~@/, '');
          const flag = ':url(';
          const match = orignalStr.split(flag);
          const [head, tail] = match;
          return match.length >= 2 ? head + flag + urlPrefix + tail : str;
        });
        content = this.modifySrcInJs(content)
        this.resetContent(content);
      },
      'app-plus'() {
        content = this.modifySrcInJs(content)
        this.resetContent(content);
      },
      'mp-weixin'() {
        // 修改微信小程序wxml文件里的src前缀
        const reg = /src="((@|~@)?\/pages-[^\s.]*)?\/static\/[^\s.]*\.(png|jpe?g|gif|svg)"/g;
        content = content.replace(reg, function (str) {
          const orignalStr = str.replace(/@|~@/, '');
          const flag = 'src="';
          const match = orignalStr.split(flag);
          return match.length >= 2 ? flag + urlPrefix + match[1] : str;
        });
        this.resetContent(content);
      },
      // 修改js文件src前缀
      modifySrcInJs(content) {
        const reg = /attrs:{src:"((@|~@)?\/pages-[^\s.]*)?\/static\/[^\s.]*\.(png|jpe?g|gif|svg)"/g;
        content = content.replace(reg, function (str) {
          const orignalStr = str.replace(/@|~@/, '');
          const flag = 'attrs:{src:"';
          const match = orignalStr.split(flag);
          return match.length >= 2 ? flag + urlPrefix + match[1] : str;
        });
        return content
      }
    };
    if (modifyFileTyppe) action[platform] && action[platform]();
  }
}

module.exports = {
  paramIsObject,
  selectProjectByMenu,
  switchEnvJson,
  convert2EnvFile,
  parseRunScriptArgs,
  execScriptCmd,
  switchManifest,
  excludeFile,
  selectedProject,
  copyPayResult,
  copyGetAuthCode,
  addImagesPrefix,
  TransferImages,
  existFile,
  getJsonFile,
  copyOauth,
  copyOauth2,
  getAppConfig,
};
