import React from "react";
import Scrollbar from "@/components/Scrollbar";
import useSpaceImg from "@/hooks/useSpaceImg";
import useAddImg from "@/hooks/useAddImg";
import Empty from "./Empty";
import ImgList from "./ImgList";
import "./file-stage.scss";
import useImgStatus from "@/hooks/useImgStatus";

const FileStage: React.FC = () => {
  const imgs = useSpaceImg();
  useImgStatus();
  const { handleDrop } = useAddImg();

  return (
    <Scrollbar>
      <div
        className="file-stage"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {imgs.length === 0 ? <Empty /> : <ImgList imgs={imgs} />}
      </div>
    </Scrollbar>
  );
};

export default FileStage;
