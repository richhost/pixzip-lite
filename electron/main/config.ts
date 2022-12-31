import Store from "electron-store";

const defaultConfig: UserConfig = {
  format: "original",
  outputOriginal: true,
  quality: 3,
  suffix: "-min",
};

class Config {
  private _config: UserConfig;
  private store: Store;

  private setup() {
    this.store = new Store();

    let config = this.store.get("userConfig") as UserConfig;
    if (!config) {
      config = { ...defaultConfig };
      this.store.set("userConfig", defaultConfig);
    }
    this._config = config;
  }

  get config() {
    return this._config;
  }

  set config(val: UserConfig) {
    this._config = val;
    this.store.set("userConfig", val);
  }

  constructor() {
    this.setup();
  }
}

export default new Config();
