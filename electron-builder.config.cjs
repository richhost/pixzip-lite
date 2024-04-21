/** @type {import('electron-builder').Configuration} */
const config = {
  appId: "fun.xiangsu.app",
  productName: "Pixzip",
  asar: false,
  directories: {
    buildResources: "build",
  },
  files: [
    "!**/.vscode/*",
    "!src/*",
    "!electron.vite.config.{js,ts,mjs,cjs}",
    "!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}",
    "!{.env,.env.*,.npmrc,pnpm-lock.yaml}",
    "!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}",
  ],
  artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
  win: {
    target: "nsis",
    icon: "resources/icons/win/icon.ico",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: true,
  },
  mac: {
    target: "dmg",
    icon: "resources/icons/mac/icon.icns",
  },
  electronDownload: {
    mirror: "https://npmmirror.com/mirrors/electron/",
  },
};

module.exports = config;
