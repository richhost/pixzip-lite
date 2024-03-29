import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";
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

  const currentWks = useMemo(() => {
    return workspaces.find((w) => w.id === currWksID) ?? workspaces[0];
  }, [workspaces, currWksID]);

  const [previewCurrentWks, setPreviewCurrentWks] =
    useState<Pixzip.Workspace>();

  const normalizedFormData = useCallback((workspace: Pixzip.Workspace) => {
    const data = FormDataSchema.parse(workspace);
    setFormData(data);
  }, []);

  if (currentWks !== previewCurrentWks) {
    setPreviewCurrentWks(currentWks);
    normalizedFormData(currentWks);
  }

  const settingFormData = useCallback(
    (data: ConfigFormData) => {
      setFormData(data);
      const res = FormDataSchema.parse(data);
      if (currWksID) {
        patch({ ...res, id: currWksID });
      }
    },
    [currWksID, patch]
  );

  const delWorkspace = useCallback(() => {
    currWksID && del(currWksID);
  }, [currWksID, del]);

  const selectOutputDir = useCallback(() => {
    window.pixzip.action.folderPicker().then((dir) => {
      settingFormData({
        ...formData,
        outputDir: dir[0] ?? "",
      });
    });
  }, [formData, settingFormData]);

  return {
    formData,
    settingFormData,
    delWorkspace,
    selectOutputDir,
  };
}
