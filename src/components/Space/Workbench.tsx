import React, { useRef, useState } from "react";
import { useAtom } from "jotai";
import produce from "immer";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover";
import Icon from "@/components/Icon";
import IconPane from "@/components/IconPane";
import { AlertDialog } from "@/components/AlertDialog";
import { defAtom, spacesAtom } from "@/stores/space";
import "./workbench.scss";

const Workbench: React.FC = () => {
  const [delAlertDialogOpen, setDelAlertDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const delId = useRef("");

  const [spaces, setSpaces] = useAtom(spacesAtom);
  const [def, setDef] = useAtom(defAtom);

  const currentSpace = spaces.find((element) => element.id === def);

  const onSetDefault = (id: string) => {
    window.space.setDefault(id).then((res) => {
      if (res) {
        setDef(id);
      }
    });
  };

  const onAddSpace = () => {
    window.space.addSpace().then((space) => {
      const nextState = produce(spaces, (draft) => {
        draft.push(space);
      });
      setSpaces(nextState);
      setDef(space.id);
      inputRef.current && inputRef.current.focus();
    });
  };

  const onDelSpace = (id: string) => {
    delId.current = id;
    setDelAlertDialogOpen(true);
  };

  const delSpace = () => {
    window.space.delSpace(delId.current).then((res) => {
      if (res !== false) {
        const defId = res.def;
        const nextState = spaces.filter(
          (element) => element.id !== delId.current
        );
        setSpaces(nextState);
        setDef(defId);
        setDelAlertDialogOpen(false);
      }
    });
  };

  const onIconChange = (name: string) => {
    window.space.patchSpace({
      ...currentSpace!,
      icon: name,
    });
    const nextState = produce(spaces, (draft) => {
      const index = draft.findIndex((element) => element.id === def);
      if (index !== -1) draft[index].icon = name;
    });
    setSpaces(nextState);
  };
  const onSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const nextState = produce(spaces, (draft) => {
      const index = draft.findIndex((element) => element.id === def);
      if (index !== -1) draft[index].name = value;
    });
    setSpaces(nextState);
  };

  return (
    <>
      <div className="workbench">
        <div className="space-head">
          <Popover>
            <PopoverTrigger>
              <span className="space-head-icon" title="修改空间图标">
                <Icon name={currentSpace?.icon} />
              </span>
            </PopoverTrigger>
            <PopoverContent align="start">
              <IconPane active={currentSpace?.icon} onChange={onIconChange} />
            </PopoverContent>
          </Popover>
          <input
            ref={inputRef}
            placeholder="Space name"
            className={"space-head-input"}
            value={currentSpace?.name || ""}
            type="text"
            maxLength={30}
            onChange={onSpaceNameChange}
            spellCheck={false}
          />
        </div>

        <ul className="space-list">
          {spaces.map((element) => (
            <li
              key={element.id}
              onClick={() => onSetDefault(element.id)}
              className={
                "space-item " + (element.id === def ? "space-item__active" : "")
              }
            >
              {spaces.length > 1 && (
                <span
                  className="del-space"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelSpace(element.id);
                  }}
                >
                  <Icon name="Cross2Icon" className="del-space-icon" />
                </span>
              )}
              <Icon name={element.icon} />
            </li>
          ))}
          <li className="space-item space-plus" onClick={onAddSpace}>
            <Icon name="PlusIcon" />
          </li>
        </ul>
      </div>

      <AlertDialog
        open={delAlertDialogOpen}
        title="删除 Space"
        description="进行中的任务不会被中止"
        onCancel={() => setDelAlertDialogOpen(false)}
        onAction={() => delSpace()}
      />
    </>
  );
};

export default Workbench;
