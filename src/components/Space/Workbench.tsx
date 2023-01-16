import React from "react";
import { useAtom } from "jotai";
import { currentSpaceIdAtom, spacesAtom } from "@/stores/space";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/Popover";
import Icon from "@/components/Icon";
import IconPane from "@/components/IconPane";
import "./workbench.scss";

const Workbench: React.FC = () => {
  const [spaces, setSpaces] = useAtom(spacesAtom);
  const [currentId, setCurrentId] = useAtom(currentSpaceIdAtom);

  const currentSpace = spaces.find((element) => element.id === currentId);

  function onSpaceNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    // TODO
  }

  function onIconChange(icon: string) {
    // TODO
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
      </ul>
    </div>
  );
};

export default Workbench;
