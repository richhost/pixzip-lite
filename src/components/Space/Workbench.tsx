import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover";
import Icon from "@/components/Icon";
import IconPane from "@/components/IconPane";
import { useSpace } from "@/hooks/useSpace";
import "./workbench.scss";

const Workbench: React.FC = () => {
  const { spaces, changeOption, currentSpace, currentId } = useSpace();

  function onSpaceNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    changeOption({ key: "name", value: value });
  }

  function onIconChange(icon: string) {
    changeOption({ key: "icon", value: icon });
  }

  return (
    <div className="workbench">
      <div className="space-head">
        <Popover>
          <PopoverTrigger>
            <span className="space-head__icon">
              <Icon name={currentSpace?.icon} />
            </span>
          </PopoverTrigger>
          <PopoverContent>
            <IconPane active={currentSpace?.icon} onChange={onIconChange} />
          </PopoverContent>
        </Popover>
        <input
          placeholder="input Space name"
          className={"space-head__input"}
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
            className={
              "space-item " +
              (element.id === currentId ? "space-item__active" : "")
            }
          >
            <Icon name={element.icon} />
          </li>
        ))}
        <li className="space-item space-plus">
          <Icon name="PlusIcon" />
        </li>
      </ul>
    </div>
  );
};

export default Workbench;
