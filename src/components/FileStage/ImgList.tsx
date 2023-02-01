import React from "react";
import { SpaceImg } from "@/stores/img";
import { bytes2MB, calcLossPercent } from "@/utils";
import Icon from "@/components/Icon";
import "./img-list.scss";

type Props = {
  imgs: SpaceImg[];
};

const StatusResult = (img: SpaceImg) => {
  switch (img.status) {
    case "start":
      return <Icon name="ShadowOuterIcon" className="compressing" />;
    case "success":
      return bytes2MB(img.compressedSize!);
    case "failed":
      return <>无法压缩</>;
    default:
      return <Icon name="ClockIcon" />;
  }
};

const ImgList: React.FC<Props> = ({ imgs }) => {
  const showInFolder = (outputPath?: string) => {
    if (outputPath) {
      window.img.showInFolder(outputPath);
    }
  };

  return (
    <div>
      <ul className="img-list">
        {imgs.map((element) => (
          <li key={element.path} className="img-list-item">
            <span className="img-path" title={element.path}>
              {element.path}
            </span>
            <span className="img-button">
              {element.outputPath && element.status === "success" && (
                <button
                  className="drag-none"
                  onClick={() => showInFolder(element.outputPath)}
                >
                  {element.outputPath && <Icon name="ExternalLinkIcon" />}
                </button>
              )}
            </span>
            <span className="img-size">{bytes2MB(element.size)}</span>
            <span className="img-compress">{StatusResult(element)}</span>
            <span className="img-percent">
              {element.compressedSize && element.status === "success" && (
                <>
                  <svg
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 24L24 42L43 24H31V6H17V24H5Z"
                      fill="#35af2e"
                      stroke="#35af2e"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {calcLossPercent(element.size, element.compressedSize)}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImgList;
