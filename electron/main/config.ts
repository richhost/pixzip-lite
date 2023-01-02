import Store from "electron-store";

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
    if (!config) {
      config = { ...defaultConfig };
      this.store.set("userConfig", defaultConfig);
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
