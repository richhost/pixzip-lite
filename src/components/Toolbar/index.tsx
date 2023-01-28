import { useFile } from "@/hooks/useFile";
import React from "react";
import Icon from "../Icon";
import "./toolbar.scss";

const Toolbar: React.FC = () => {
  const { inputRef, handleInputAddFile, again, clean } = useFile();

  return (
    <div className="toolbar">
      <div className="toolbar-btn-group">
        <label className="add-img-btn drag-none" title="添加图片">
          <Icon name="PlusIcon" />
          <input
            ref={inputRef}
            onChange={handleInputAddFile}
            type="file"
            accept="image/avif, image/jpeg, image/png, image/tiff, image/webp, image/gif"
            multiple
            hidden
          />
        </label>
        <button className="drag-none" title="再次压缩" onClick={again}>
          <Icon name="ReloadIcon" />
        </button>
        <button className="drag-none" title="清空列表" onClick={clean}>
          <Icon name="EraserIcon" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
