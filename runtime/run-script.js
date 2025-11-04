const { argv, cwd } = require("process");
const path = require("path");
const dotenv = require("dotenv");
const chalk = require("chalk");
const { convert2EnvFile, selectProjectByMenu, parseRunScriptArgs, execScriptCmd, switchManifest, existFile, getJsonFile } = require("./utils");

// 执行
async function exec() {
  // env路径
  const envPath = "../src/app-config/.env";

  // 解析run script参数
  const { NPM_ARG, CUSTOM_PLAFORM, PROJECT, MODULE} = parseRunScriptArgs(argv);
  // 编译环境变量
  const compilationEnv = {
    module: MODULE
  }
  const cmd = `npm run ${NPM_ARG} ${CUSTOM_PLAFORM || ''}`;
  const includedKeyword = NPM_ARG.startsWith("script");

  // 不能递归执行npm run script
  if (includedKeyword) {
    console.log(chalk.red("npm run script NPM_ARG 参数不包含 'script' 开头参数值!"));
    return;
  }

  let result = ''
  let error = ''

  let projectPath = path.join(cwd(), 'src/app-config/project', PROJECT + '.json')
  if (PROJECT && existFile(projectPath)) {
    result = getJsonFile(projectPath)
  } else {
    // 选择项目
    const selRes = await selectProjectByMenu()
    result = selRes.result
    error = selRes.error
  }

  // 切换项目manifest.json
  const { error: mnstErr } = await switchManifest(result);
  if (mnstErr) return;

  // 转换配置到 ENV文件
  convert2EnvFile(result, compilationEnv);

  // 设置到Node环境变量
  dotenv.config({ path: path.resolve(__dirname, envPath) });

  // 执行script命令
  execScriptCmd(cmd);
}

exec();
