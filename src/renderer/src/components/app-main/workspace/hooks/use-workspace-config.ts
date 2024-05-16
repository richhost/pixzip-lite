import { useAtomValue } from "jotai";
import { useState } from "react";
import { currentWksIDAtom } from "~/atoms/workspaces";
import { useWorkspace } from "~/hooks/use-workspace.ts";
import { type ConfigFormData, FormDataSchema } from "~/lib/schema";

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
  const currWksID = useAtomValue(currentWksIDAtom);
  const { workspaces, del, patch } = useWorkspace();

  const [formData, setFormData] = useState<ConfigFormData>(initState);

  const currentWks =
    workspaces.find((w) => w.id === currWksID) ?? workspaces[0];

  const [previewCurrentWks, setPreviewCurrentWks] =
    useState<Pixzip.Workspace>();

  const normalizedFormData = (workspace: Pixzip.Workspace) => {
    const data = FormDataSchema.parse(workspace);
    setFormData(data);
  };

  if (currentWks !== previewCurrentWks) {
    setPreviewCurrentWks(currentWks);
    normalizedFormData(currentWks);
  }

  const settingFormData = (data: ConfigFormData) => {
    setFormData(data);
    const res = FormDataSchema.parse(data);
    if (currWksID) {
      patch({ ...res, id: currWksID });
    }
  };

  const delWorkspace = () => {
    currWksID && del(currWksID);
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
