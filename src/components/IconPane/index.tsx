import React from "react";
import Icon from "@/components/Icon";
import "./icon-pane.scss";

export const icons = [
  "StarIcon",
  "HeartIcon",
  "BookmarkIcon",
  "LightningBoltIcon",
  "CookieIcon",
  "TargetIcon",
  "ShadowIcon",
  "FaceIcon",
  "MixIcon",
  "CameraIcon",
  "RocketIcon",
  "CubeIcon",
  "FileIcon",
  "ReaderIcon",
  "MobileIcon",
  "MarginIcon",
  "EnvelopeOpenIcon",
  "VideoIcon",
];

type Props = {
  active?: string;
  onChange?: (name: string) => void;
};

const IconPane: React.FC<Props> = ({ active, onChange }) => {
  return (
    <ul className="icon-pane">
      {icons.map((element) => (
        <li
          onClick={() => onChange && onChange(element)}
          key={element}
          className={"icon " + (element === active ? "icon__active" : "")}
        >
          <Icon name={element} />
        </li>
      ))}
    </ul>
  );
};

export default IconPane;
