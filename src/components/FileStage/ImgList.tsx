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
      return (
        <svg
          className="compressing"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      );
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
