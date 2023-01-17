import Store from "electron-store";
import { nanoid } from "nanoid";

const SPACES = "spaces";
const CURRENT_SPACE_ID = "currentSpaceId";

class Db {
  private db: Store;
  private spaces: Space[];
  private currentSpaceId: string;

  private cleanOldConfig() {
    // 版本兼容 ----> 清除 v1.0.x 版本中的旧配置
    this.db.delete("userConfig");
  }

  private defaultSpaceData: Omit<Space, "id"> = {
    icon: "StarIcon",
    suffix: "-mini",
    format: "original",
    quality: 2,
    outputOriginal: true,
    outputPath: "",
  };

  private setup() {
    let spaces = this.db.get(SPACES) as Space[];
    if (!spaces) {
      const defaultSpaceData: Space = {
        id: nanoid(),
        ...this.defaultSpaceData,
      };
      spaces = [defaultSpaceData];
    }
    this.spaces = spaces;
    let currentId = this.db.get(CURRENT_SPACE_ID) as string;
    if (!currentId) currentId = spaces[0].id;

    this.currentSpaceId = currentId;
    this.db.set(SPACES, spaces);
    this.db.set(CURRENT_SPACE_ID, currentId);
  }

  add = (data: Omit<Space, "id">) => {
    const id = nanoid();
    const space: Space = { id, ...data };
    this.spaces.push(space);
    this.currentSpaceId = id;
    this.db.set(SPACES, this.spaces);
    this.db.set(CURRENT_SPACE_ID, this.currentSpaceId);

    return space;
  };

  del = (id: string) => {
    this.spaces = this.spaces.filter((element) => element.id !== id);
    this.currentSpaceId = this.spaces[this.spaces.length - 1].id;
    this.db.set(SPACES, this.spaces);
    this.db.set(CURRENT_SPACE_ID, this.currentSpaceId);
  };

  patch = (data: Space) => {
    this.spaces.forEach((element) => {
      if (element.id === data.id) {
        element = data;
      }
    });

    this.db.set(SPACES, this.spaces);
  };

  getSpace = () => {
    return this.spaces;
  };

  setCurrentSpaceId = (id: string) => {
    this.currentSpaceId = id;
    this.db.get(CURRENT_SPACE_ID, this.currentSpaceId);
  };

  getCurrentSpaceId = () => {
    return this.currentSpaceId;
  };

  constructor() {
    this.db = new Store();
    this.cleanOldConfig();
    this.setup();
  }
}

export default new Db();
