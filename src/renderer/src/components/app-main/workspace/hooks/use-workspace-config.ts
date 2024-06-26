import { useState } from "react";
import { useStore } from "@tanstack/react-store";

import { type ConfigFormData, FormDataSchema } from "~/lib/schema";
import { defaultSpaceStore } from "~/stores/space";
import { useSpace } from "~/hooks/use-spaces";

const initState: ConfigFormData = {
  name: "",
  icon: "",
  width: undefined,
  height: undefined,
  suffix: "-min",
  format: "original",
  level: 1,
  autoExec: true,
  originalOutput: true,
  outputDir: "",
  keepExif: false,
};

export function useWorkspaceConfig() {
  const spaceId = useStore(defaultSpaceStore);
  const { spaces, delSpace, updateSpace } = useSpace();

  const [formData, setFormData] = useState<ConfigFormData>(initState);

  const currentSpace = spaces.find((w) => w.id === spaceId) ?? spaces[0];

  const [previewCurrentWks, setPreviewCurrentWks] =
    useState<Pixzip.Workspace>();

  const normalizedFormData = (workspace: Pixzip.Workspace) => {
    const data = FormDataSchema.parse(workspace);
    setFormData(data);
  };

  if (currentSpace !== previewCurrentWks) {
    setPreviewCurrentWks(currentSpace);
    normalizedFormData(currentSpace);
  }

  const settingFormData = (data: ConfigFormData) => {
    setFormData(data);
    const res = FormDataSchema.parse(data);
    if (spaceId) {
      updateSpace({ ...res, id: spaceId });
    }
  };

  const delWorkspace = () => {
    spaceId && delSpace(spaceId);
  };

  const selectOutputDir = () => {
    window.pixzip.action.folderPicker().then((dir) => {
      settingFormData({
        ...formData,
        outputDir: dir[0] ?? "",
      });
    });
  };

  return {
    formData,
    settingFormData,
    delWorkspace,
    selectOutputDir,
  };
}
