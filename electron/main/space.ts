import Store from "electron-store";
import { nanoid } from "nanoid";
import { clearImgs } from "./compress";

type SpaceSchema = {
  def: string; // default space id
  spaces: Space[];
};

const defaultSpaceData: Omit<Space, "id"> = {
  name: "Space 1",
  icon: "StarIcon",
  suffix: "-mini",
  format: "original",
  quality: 2,
  outputOriginal: true,
  outputPath: "",
};

const spaceSchema: SpaceSchema = {
  def: "",
  spaces: [],
};

const store = new Store<SpaceSchema>();

let def = store.get("def");
let spaces = store.get("spaces");

// 兼容 1.1 版本
if (store.get("currentSpaceId")) {
  def = store.get("currentSpaceId") as string;
  // @ts-ignore
  store.delete("currentSpaceId");
  store.set("def", def);
}
// @ts-ignore
if (store.get("userConfig")) store.delete("userConfig"); // 兼容 1.0 版本

if (!def) def = nanoid();
if (!spaces || spaces.length === 0) {
  spaces = [{ id: def, ...defaultSpaceData }];
}
spaceSchema.def = def;
spaceSchema.spaces = spaces;

export const getSpaces = () => {
  return spaceSchema.spaces;
};

export const addSpace = (): Space => {
  const id = nanoid();
  const space: Space = {
    id,
    name: "",
    icon: "StarIcon",
    suffix: "-mini",
    format: "original",
    quality: 2,
    outputOriginal: true,
    outputPath: "",
  };
  spaceSchema.spaces.push(space);
  store.set("spaces", spaceSchema.spaces);
  store.set("def", id);
  return space;
};

export const patchSpace = (data: Space) => {
  const index = spaceSchema.spaces.findIndex(
    (element) => element.id === data.id
  );
  if (index !== -1) {
    spaceSchema.spaces.splice(index, 1, data);
    store.set("spaces", spaceSchema.spaces);
  }
};

export const delSpace = (id: string): boolean | { def: string } => {
  if (spaceSchema.spaces.length === 1) return false;
  const spaces = spaceSchema.spaces.filter((element) => element.id !== id);
  spaceSchema.spaces = spaces;
  store.set("spaces", spaceSchema.spaces);
  clearImgs(id); // clear space imgs
  if (id === spaceSchema.def) {
    const def = spaceSchema.spaces.at(-1).id;
    spaceSchema.def = def;
    store.set("def", def);
    return { def };
  }
  return false;
};

export const getDefault = () => {
  return spaceSchema.def;
};

export const setDefault = (id: string): boolean => {
  const index = spaceSchema.spaces.findIndex((element) => element.id === id);
  if (index !== -1) {
    store.set("def", id);
    return true;
  }
  return false;
};
