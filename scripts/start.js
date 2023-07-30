const { execSync } = require("child_process");

execSync(`webpack-dev-server --config ${__dirname}/configs/webpack.dev.js --open`);
