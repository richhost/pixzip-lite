import React, { useRef, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover";
import Icon from "@/components/Icon";
import IconPane from "@/components/IconPane";
import { useSpace } from "@/hooks/useSpace";
import "./workbench.scss";

const Workbench: React.FC = () => {
  const {
    spaces,
    changeOption,
    currentSpace,
    setCurrentId,
    currentId,
    addSpace,
  } = useSpace();

  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    changeOption({ key: "name", value: value });
  };

  const onIconChange = (icon: string) => {
    changeOption({ key: "icon", value: icon });
  };

  const onPopoverOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const onAddSpace = () => {
    window.lossApi["space:add"]().then((data) => {
      addSpace(data);
      inputRef.current && inputRef.current.focus();
    });
  };

  return (
    <div className="workbench">
      <div className={"space-head " + (open ? "space-head__active " : "")}>
        <Popover onOpenChange={onPopoverOpenChange}>
          <PopoverTrigger>
            <span className="space-head-icon" title="修改空间图标">
              <Icon name={currentSpace?.icon} />
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <IconPane active={currentSpace?.icon} onChange={onIconChange} />
          </PopoverContent>
        </Popover>
        <input
          ref={inputRef}
          placeholder="Space name"
          className={"space-head-input"}
          value={currentSpace?.name || ""}
          type="text"
          maxLength={15}
          onChange={onSpaceNameChange}
        />
      </div>

      <ul className="space-list">
        {spaces.map((element) => (
          <li
            key={element.id}
            onClick={() => setCurrentId(element.id)}
            className={
              "space-item " +
              (element.id === currentId ? "space-item__active" : "")
            }
          >
            <Icon name={element.icon} />
          </li>
        ))}
        <li className="space-item space-plus" onClick={onAddSpace}>
          <Icon name="PlusIcon" />
        </li>
      </ul>
    </div>
  );
};

export default Workbench;
