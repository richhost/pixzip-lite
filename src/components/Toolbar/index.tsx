import React from "react";
import useAddImg from "@/hooks/useAddImg";
import useClearImg from "@/hooks/useClearImg";
import Icon from "@/components/Icon";
import "./toolbar.scss";

const Toolbar: React.FC = () => {
  const { handleInputAddFile, inputRef, again } = useAddImg();
  const { onClear } = useClearImg();

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
            spellCheck={false}
          />
        </label>
        <button className="drag-none" title="再次压缩" onClick={again}>
          <Icon name="ReloadIcon" />
        </button>
        <button className="drag-none" title="清空列表" onClick={onClear}>
          <Icon name="EraserIcon" />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
