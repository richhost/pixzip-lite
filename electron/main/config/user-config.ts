import Store from "electron-store";

// 默认配置
const defaultConfig: IUserConfig = {
  format: "original",
  outputOriginal: true,
  quality: 3,
  suffix: "-min",
};

class UserConfig {
  private _config: IUserConfig;
  private store: Store;

  private setup() {
    this.store = new Store();

    let config = this.store.get("userConfig") as IUserConfig;

    // store 里如果没有配置，则添加默认配置
    if (!config) {
      config = { ...defaultConfig };
      this.store.set("userConfig", config);
    }
    this._config = config;
  }

  get config() {
    return this._config;
  }

  set config(val: IUserConfig) {
    this._config = val;
    this.store.set("userConfig", val);
  }

  constructor() {
    this.setup();
  }
}

export default new UserConfig();
