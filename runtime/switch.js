const chalk = require("chalk");
const { selectProjectByMenu, switchManifest, switchEnvJson } = require("./utils");

async function exec() {
  // 选择项目
  const { result, error: slPjErr } = await selectProjectByMenu();
  if (slPjErr) return console.log(chalk.red("选择项目出错!"));

  // 切换项目env.json
  const { error: envErr } = await switchEnvJson(result);
  if (envErr) return console.log(chalk.red(`切换env.json出错: ${envErr}!`));

  // 切换项目manifest.json
  const { error: mnstErr } = await switchManifest(result);
  if (mnstErr) return console.log(chalk.red(`切换manifest.json出错: ${mnstErr}!`));

  console.log(chalk.green("项目配置切换完"));
}

exec();
