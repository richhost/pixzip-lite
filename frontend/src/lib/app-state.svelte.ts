import { ImageService } from '../../bindings/changeme';
import type { CompressTask, ImageItem } from '../../bindings/changeme';
import type { FileTask, CompressConfig } from '#lib/types';
import { DEFAULT_PRESETS } from '#lib/defaultConfig';
import { summarizeTasks } from '#lib/utils';

const PRESETS_KEY = 'pixzip_presets_v1';
const ACTIVE_KEY = 'pixzip_active_preset';
// Older storage generations, adopted one-time so an update never resets work.
const SINGLE_CONFIG_KEY = 'pixzip_config_v1';
const LEGACY_SPACES_KEY = 'pixzip_spaces_v2';
const LEGACY_ACTIVE_KEY = 'pixzip_active_space';
const CONCURRENCY = 3;

// 'fit' and 'scale' no longer exist in the UI; adopt the closest mode.
function normalizePreset(s: CompressConfig): CompressConfig {
  const mode = s.resizeMode === 'fit' ? 'width' : s.resizeMode === 'scale' ? 'none' : s.resizeMode;
  return { ...s, resizeMode: mode };
}

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadPersisted(): { spaces: CompressConfig[]; activeId: string } {
  const fallbackId = DEFAULT_PRESETS[0].id;
  if (typeof localStorage === 'undefined') {
    return { spaces: DEFAULT_PRESETS, activeId: fallbackId };
  }

  let spaces: CompressConfig[] | null = null;
  let activeId: string | null = null;

  const current = readJson(PRESETS_KEY);
  if (Array.isArray(current) && current.length > 0) {
    spaces = (current as CompressConfig[]).map(normalizePreset);
    const saved = localStorage.getItem(ACTIVE_KEY);
    activeId = saved && spaces.some((s) => s.id === saved) ? saved : spaces[0].id;
  }

  if (!spaces) {
    // Previous generation stored a single anonymous config.
    const single = readJson(SINGLE_CONFIG_KEY) as CompressConfig | null;
    if (single && typeof single.format === 'string') {
      spaces = [
        normalizePreset({
          ...DEFAULT_PRESETS[0],
          ...single,
          id: 'default',
          name: '默认配置',
          description: '来自旧版本的单一配置',
        }),
      ];
      activeId = 'default';
    }
  }

  if (!spaces) {
    // Oldest generation stored a preset list with names.
    const legacy = readJson(LEGACY_SPACES_KEY);
    if (Array.isArray(legacy) && legacy.length > 0) {
      spaces = (legacy as CompressConfig[]).map(normalizePreset);
      const saved = localStorage.getItem(LEGACY_ACTIVE_KEY);
      activeId = saved && spaces.some((s) => s.id === saved) ? saved : spaces[0].id;
    }
  }

  return { spaces: spaces ?? DEFAULT_PRESETS, activeId: activeId ?? fallbackId };
}

function asPaths(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

export function pathsFromDrop(payload: unknown): string[] {
  const source =
    payload && typeof payload === 'object' && 'data' in payload
      ? ((payload as { data?: unknown }).data ?? payload)
      : payload;

  const direct = asPaths(source);
  if (direct.length > 0) return direct;
  if (source && typeof source === 'object' && 'files' in source) {
    return asPaths((source as { files?: unknown }).files);
  }
  return [];
}

/**
 * Desktop session state. Fields use runes so components can read them
 * directly; the instance itself is never reassigned, which is what Svelte 5
 * allows exporting across modules.
 */
export class AppState {
  spaces = $state<CompressConfig[]>(DEFAULT_PRESETS);
  currentSpaceId = $state(DEFAULT_PRESETS[0].id);
  // The queue is only ever replaced, never mutated in place.
  tasks = $state.raw<FileTask[]>([]);
  isInspectorOpen = $state(true);
  isSpaceModalOpen = $state(false);
  isAboutModalOpen = $state(false);
  compareId = $state<string | null>(null);

  currentSpace = $derived(
    this.spaces.find((space) => space.id === this.currentSpaceId) ?? this.spaces[0] ?? DEFAULT_PRESETS[0]
  );

  compareTask = $derived(
    this.compareId === null ? null : (this.tasks.find((task) => task.id === this.compareId) ?? null)
  );

  summary = $derived(summarizeTasks(this.tasks));

  #pumping = false;
  #scanning = new Set<string>();
  #generation = new Map<string, number>();
  #chain = new Map<string, Promise<void>>();

  constructor() {
    const loaded = loadPersisted();
    this.spaces = loaded.spaces;
    this.currentSpaceId = loaded.activeId;
    if (typeof window !== 'undefined') {
      this.isInspectorOpen = window.innerWidth >= 1024;
    }
  }

  persistSpaces = () => {
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify($state.snapshot(this.spaces)));
    } catch {
      // Storage can throw in private or quota-exceeded contexts.
    }
  };

  persistActiveSpace = () => {
    try {
      localStorage.setItem(ACTIVE_KEY, this.currentSpaceId);
    } catch {
      // Storage can throw in private or quota-exceeded contexts.
    }
  };

  selectSpace = (space: CompressConfig) => {
    this.currentSpaceId = space.id;
  };

  updateSpace = (updated: CompressConfig) => {
    this.spaces = this.spaces.map((space) => (space.id === updated.id ? updated : space));
  };

  deleteSpace = (id: string) => {
    // The last preset is the app's configuration — deleting it is never allowed.
    if (this.spaces.length <= 1) return;
    const next = this.spaces.filter((space) => space.id !== id);
    this.spaces = next;
    if (this.currentSpaceId === id) this.currentSpaceId = next[0]?.id ?? DEFAULT_PRESETS[0].id;
  };

  saveSpace = (space: CompressConfig) => {
    this.spaces = [space, ...this.spaces];
    this.currentSpaceId = space.id;
  };

  openSpaceModal = () => {
    this.isSpaceModalOpen = true;
  };

  closeSpaceModal = () => {
    this.isSpaceModalOpen = false;
  };

  openAbout = () => {
    this.isAboutModalOpen = true;
  };

  closeAbout = () => {
    this.isAboutModalOpen = false;
  };

  toggleInspector = () => {
    this.isInspectorOpen = !this.isInspectorOpen;
  };

  openCompare = (task: FileTask) => {
    this.compareId = task.id;
  };

  closeCompare = () => {
    this.compareId = null;
  };

  selectFiles = async () => {
    try {
      const paths = await ImageService.SelectFiles();
      if (paths && paths.length > 0) await this.scanPaths(paths);
    } catch (err) {
      console.error('SelectFiles failed:', err);
    }
  };

  selectFolder = async () => {
    try {
      const dir = await ImageService.SelectDirectory();
      if (dir) await this.scanPaths([dir]);
    } catch (err) {
      console.error('SelectDirectory failed:', err);
    }
  };

  selectOutputDir = async () => {
    try {
      const dir = await ImageService.SelectDirectory();
      if (dir) this.updateSpace({ ...this.currentSpace, outputDir: dir });
    } catch (err) {
      console.error('SelectDirectory failed:', err);
    }
  };

  scanPaths = async (paths: string[]) => {
    const fresh = paths.filter(
      (path) => path && !this.tasks.some((task) => task.path === path) && !this.#scanning.has(path)
    );
    if (fresh.length === 0) return;

    for (const path of fresh) this.#scanning.add(path);
    try {
      const items = await ImageService.ScanFiles(fresh);
      if (items && items.length > 0) {
        this.addItems(items);
      }
    } catch (err) {
      console.error('ScanFiles failed:', err);
    } finally {
      for (const path of fresh) this.#scanning.delete(path);
    }
  };

  addItems = (items: ImageItem[]) => {
    const seen = new Set(this.tasks.map((task) => task.path));
    const fresh: FileTask[] = [];
    for (const item of items) {
      if (!item.path || seen.has(item.path)) continue;
      seen.add(item.path);
      fresh.push(this.#toTask(item));
    }
    if (fresh.length === 0) return;
    this.tasks = [...fresh, ...this.tasks];
    void this.#pump();
  };

  startAll = () => {
    void this.#pump();
  };

  compressOne = (task: FileTask) => {
    this.#invalidate(task.id);
    this.#patch(task.id, { status: 'idle', error: undefined });
    void this.#pump();
  };

  compressMany = (ids: string[]) => {
    const idSet = new Set(ids);
    const targets = this.tasks.filter((task) => idSet.has(task.id));
    if (targets.length === 0) return;
    void this.#runPool(targets, this.currentSpace);
  };

  exportZip = async () => {
    const files = this.tasks.flatMap((task) =>
      task.status === 'completed' && task.outputPath ? [task.outputPath] : []
    );
    if (files.length === 0) return;
    const defaultName = `PixZip_${this.currentSpace.name}_${new Date().toISOString().slice(0, 10)}.zip`;
    try {
      await ImageService.ExportZip(files, defaultName);
    } catch (err) {
      console.error('ExportZip failed:', err);
    }
  };

  reveal = async (targetPath: string) => {
    if (!targetPath) return;
    try {
      await ImageService.RevealInFinder(targetPath);
    } catch (err) {
      console.error('RevealInFinder failed:', err);
    }
  };

  removeTask = (id: string) => {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    if (this.compareId === id) this.compareId = null;
  };

  removeTasks = (ids: string[]) => {
    const idSet = new Set(ids);
    this.tasks = this.tasks.filter((task) => !idSet.has(task.id));
    if (this.compareId && idSet.has(this.compareId)) this.compareId = null;
  };

  #toTask(item: ImageItem): FileTask {
    return {
      id: item.id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      path: item.path,
      name: item.name,
      originalSize: item.size,
      originalWidth: item.width || 0,
      originalHeight: item.height || 0,
      status: 'idle',
      originalFormat: item.format || 'JPG',
    };
  }

  #patch(id: string, updates: Partial<FileTask>) {
    let changed = false;
    const next = this.tasks.map((task) => {
      if (task.id !== id) return task;
      changed = true;
      return { ...task, ...updates };
    });
    if (changed) this.tasks = next;
  }

  #invalidate(id: string) {
    this.#generation.set(id, (this.#generation.get(id) ?? 0) + 1);
  }

  #payload(task: FileTask, space: CompressConfig): CompressTask {
    return {
      id: task.id,
      spaceId: space.id,
      inputPath: task.path,
      outputDir: space.originalOutput ? '' : space.outputDir || '',
      originalOutput: space.originalOutput,
      suffix: space.suffix || '',
      format: space.format,
      quality: space.quality,
      resizeMode: space.resizeMode,
      width: space.width || 0,
      height: space.height || 0,
      scale: space.scale || 0,
      keepExif: space.keepExif,
    };
  }

  /**
   * Same-file compressions share a chain so a newer request supersedes the
   * previous result without two writers hitting one output path.
   */
  #enqueue(task: FileTask, space: CompressConfig): Promise<void> {
    const generation = (this.#generation.get(task.id) ?? 0) + 1;
    this.#generation.set(task.id, generation);
    const previous = this.#chain.get(task.id) ?? Promise.resolve();
    const run = previous
      .catch(() => undefined)
      .then(() => this.#execute(task, space, generation));
    this.#chain.set(task.id, run);
    return run;
  }

  async #execute(task: FileTask, space: CompressConfig, generation: number) {
    if (this.#generation.get(task.id) !== generation) return;
    this.#patch(task.id, { status: 'processing', error: undefined });

    try {
      const result = await ImageService.Compress(this.#payload(task, space));
      if (this.#generation.get(task.id) !== generation) return;
      if (!result.success) {
        this.#patch(task.id, { status: 'error', error: result.error || '压缩失败' });
        return;
      }
      this.#patch(task.id, {
        status: 'completed',
        compressedSize: result.compressedSize,
        compressedWidth: result.compressedWidth,
        compressedHeight: result.compressedHeight,
        outputPath: result.outputPath,
        durationMs: result.durationMs,
      });
    } catch (err) {
      if (this.#generation.get(task.id) !== generation) return;
      this.#patch(task.id, {
        status: 'error',
        error: err instanceof Error ? err.message : '压缩处理异常',
      });
    }
  }

  async #runPool(batch: FileTask[], space: CompressConfig) {
    const queue = [...batch];
    const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
      while (queue.length > 0) {
        const task = queue.shift();
        if (!task) return;
        await this.#enqueue(task, space);
      }
    });
    await Promise.all(workers);
  }

  async #pump(): Promise<void> {
    if (this.#pumping) return;
    this.#pumping = true;
    try {
      while (true) {
        const batch = this.tasks.filter((task) => task.status === 'idle').slice(0, CONCURRENCY);
        if (batch.length === 0) break;
        const space = this.currentSpace;
        await Promise.all(batch.map((task) => this.#enqueue(task, space)));
      }
    } finally {
      this.#pumping = false;
    }

    // Items queued in the window after the last empty check still get picked up.
    if (this.tasks.some((task) => task.status === 'idle')) await this.#pump();
  }
}

export const app = new AppState();
