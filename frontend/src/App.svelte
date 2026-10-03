<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import { Events } from "@wailsio/runtime";
  import { app, pathsFromDrop } from "#lib/app-state.svelte";

  import Header from "#lib/components/Header.svelte";
  import DropZone from "#lib/components/DropZone.svelte";
  import TaskList from "#lib/components/TaskList.svelte";
  import Inspector from "#lib/components/Inspector.svelte";
  import SpaceModal from "#lib/components/SpaceModal.svelte";
  import AboutModal from "#lib/components/AboutModal.svelte";

  const prefersDark = new MediaQuery("prefers-color-scheme: dark");

  $effect.pre(() => {
    document.documentElement.classList.toggle("dark", prefersDark.current);
  });

  $effect(() => {
    app.persistSpaces();
  });

  $effect(() => {
    app.persistActiveSpace();
  });

  $effect(() => {
    try {
      return Events.On("files-dropped", (event) => {
        const files = pathsFromDrop(event.data ?? event);
        if (files.length > 0) void app.scanPaths(files);
      });
    } catch (err) {
      console.warn("Events.On files-dropped error:", err);
    }
  });
</script>

<div
  class="h-screen w-screen flex flex-col bg-(--apple-bg) text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors overflow-hidden"
>
  <Header
    spaces={app.spaces}
    currentSpace={app.currentSpace}
    onSelectSpace={app.selectSpace}
    onOpenNewSpaceModal={app.openSpaceModal}
    taskCount={app.summary.total}
    pendingCount={app.summary.idle}
    completedCount={app.summary.completed}
    isProcessing={app.summary.processing > 0}
    onSelectFiles={app.selectFiles}
    onSelectFolder={app.selectFolder}
    onStartAll={app.startAll}
    onExportZip={app.exportZip}
    onOpenAbout={app.openAbout}
    onToggleInspector={app.toggleInspector}
    isInspectorOpen={app.isInspectorOpen}
  />

  <div class="grow flex w-full overflow-hidden">
    <Inspector
      spaces={app.spaces}
      config={app.currentSpace}
      onUpdateConfig={app.updateSpace}
      onDeleteSpace={app.deleteSpace}
      onSelectOutputDir={app.selectOutputDir}
      isOpen={app.isInspectorOpen}
    />

    <main
      class="grow flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 transition-all duration-300"
    >
      <div class="w-full max-w-6xl mx-auto flex flex-col gap-6 grow">
        <DropZone
          hasTasks={app.tasks.length > 0}
          onSelectFiles={app.selectFiles}
          onSelectFolder={app.selectFolder}
          onDropFiles={app.scanPaths}
        />

        {#if app.tasks.length > 0}
          <TaskList
            tasks={app.tasks}
            onCompressSingle={app.compressOne}
            onRevealInFinder={app.reveal}
            onDeleteSingle={app.removeTask}
            onBatchCompress={app.compressMany}
            onBatchDelete={app.removeTasks}
          />
        {/if}
      </div>
    </main>
  </div>

  <SpaceModal
    isOpen={app.isSpaceModalOpen}
    onClose={app.closeSpaceModal}
    onSave={app.saveSpace}
  />

  <AboutModal isOpen={app.isAboutModalOpen} onClose={app.closeAbout} />
</div>
