import { useAtomValue } from "jotai";
import { useFile } from "@/hooks/useFile";
import { bytes2MB, calcLossPercent } from "@/utils";
import Scrollbar from "@/components/Scrollbar";
import Empty from "./Empty";
import { currentSpaceIdAtom } from "@/stores/space";
import Icon from "@/components/Icon";
import "./file-stage.scss";

function FileStatus(
  status: ProcessStatus,
  originalSize?: number,
  compressedSize?: number
) {
  switch (status) {
    case "waiting":
      return <Icon name="ClockIcon" />;
    case "processing":
      return <>正在压缩</>;
    case "failed":
      return <>无法压缩</>;
    case "success":
      return (
        <div className="compress-success">
          {bytes2MB(compressedSize!)}
          <svg
            className="down-icon"
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
          {calcLossPercent(originalSize!, compressedSize!)}
        </div>
      );
    default:
      return <></>;
  }
}

export default function FileStage() {
  const { handleDragFile, files } = useFile();
  const currentSpaceId = useAtomValue(currentSpaceIdAtom);

  const fileList = files.filter(
    (element) => element.spaceId === currentSpaceId
  );

  const openFolder = (path: string) => {
    window.lossApi["file:showInFolder"](path);
  };

  return (
    <Scrollbar>
      <div
        className="file-stage"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDragFile}
      >
        {fileList.length === 0 && <Empty />}

        <div>
          <ul className="file-list">
            {fileList.map((element) => (
              <li key={element.path} className="file-item">
                <span className="path">{element.path}</span>
                {element.status === "success" && (
                  <button
                    className="open-folder"
                    onClick={() => openFolder(element.outputPath!)}
                  >
                    <Icon name="ExternalLinkIcon" />
                  </button>
                )}
                <span className="original-size">{bytes2MB(element.size)}</span>
                <span className="compress-result">
                  {FileStatus(
                    element.status,
                    element.size,
                    element.compressedSize
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scrollbar>
  );
}
