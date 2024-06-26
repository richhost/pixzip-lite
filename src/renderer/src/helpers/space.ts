const DEFAULT_SPACE_KEY = "defaultSpace";

export function getDefaultSpace() {
  return localStorage.getItem(DEFAULT_SPACE_KEY);
}

export function setDefaultSpace(id: string) {
  localStorage.setItem(DEFAULT_SPACE_KEY, id);
}
