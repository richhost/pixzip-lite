import React, { useEffect } from "react";
import { Spin } from "@arco-design/web-react";
import { Clock3 } from "lucide-react";

import { useAtom } from "jotai";
import { fileStatusAtom } from "@/stores";
import { prevent } from "@/utils/dom-event";
import { useAddFile } from "@/hooks/useAddFiles";
import { bytes2MB, calcLossPercent } from "@/utils";

import Empty from "./Empty";

const Main: React.FC = () => {
  const { files, handleDragFile } = useAddFile();

  const [fileStatusMap, setFileStatusMap] = useAtom(fileStatusAtom);

  const getStatus = (path: string, oldSize: number) => {
    const data = fileStatusMap.get(path);

    if (data?.status === "waiting") {
      return <Clock3 size="16" className="text-zinc-400" />;
    }

    if (data?.status === "processing") {
      return <Spin size={16} />;
    }

    if (data?.status === "failed") {
      return <p>无法压缩</p>;
    }

    if (data?.status === "success") {
      return (
        <span className="flex items-center justify-between">
          {bytes2MB(data.size || 0)}

          <span className="flex items-center gap-1 w-14">
            <svg
              width="18"
              height="18"
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
            {calcLossPercent(oldSize, data.size || 0)}
          </span>
        </span>
      );
    }
  };

  const setStatusCommon = (
    path: string,
    status: ProcessStatus,
    size?: number
  ) => {
    setFileStatusMap((prev) => {
      return new Map(prev.set(path, { status, size }));
    });
  };

  useEffect(() => {
    window.lossApi["compress:processing"]((_: unknown, data: SendFile) => {
      setStatusCommon(data.path, "processing");
    });

    window.lossApi["compress:failed"]((_: unknown, data: SendFile) => {
      setStatusCommon(data.path, "failed");
    });

    window.lossApi["compress:success"](
      (_: unknown, data: SendFile & { newSize: number }) => {
        setStatusCommon(data.path, "success", data.newSize);
      }
    );

    return () => {
      window.lossApi["compress:remove"]();
    };
  }, []);

  return (
    <div
      className={
        "flex flex-col w-full h-full scroll " +
        (files.length > 0 ? "" : "items-center justify-center")
      }
      onDragOver={prevent}
      onDrop={handleDragFile}
    >
      {files.length === 0 && <Empty />}

      {files.length > 0 && (
        <div className="file-list border-b h-8 bg-white sticky top-0">
          <span className="filename flex items-center border-r h-full">
            文件名
          </span>
          <span className="oldsize-wrap flex items-center border-r h-full">
            原图大小
          </span>
          <span className="compress-wrap flex items-center h-full">
            压缩后大小
          </span>
        </div>
      )}

      {files.map((item) => (
        <div
          key={item.path}
          className="file-list h-10 text-zinc-500 even:bg-zinc-100"
        >
          <span className="filename truncate">{item.path}</span>
          <span className="oldsize-wrap">{bytes2MB(item.size)}</span>
          <span className="compress-wrap">
            {getStatus(item.path, item.size)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Main;
