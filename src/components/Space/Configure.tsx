import React from "react";
import Scrollbar from "@/components/Scrollbar";
import { Select, SelectItem } from "@/components/Select";
import { Slider } from "@/components/Slider";
import { Tooltip } from "@/components/Tooltip";
import { useSpace } from "@/hooks/useSpace";
import "./configure.scss";

const formatOption: { name: string; value: Format }[] = [
  { name: "原格式", value: "original" },
  { name: "JPG", value: "jpg" },
  { name: "PNG", value: "png" },
  { name: "WebP", value: "webp" },
  { name: "AVIF", value: "avif" },
];

const Configure: React.FC = () => {
  const { currentSpace, changeOption, onOpenFolder } = useSpace();

  return (
    <Scrollbar>
      <form className="configure" autoComplete="off">
        <div className="configure__item">
          <label htmlFor="width">宽</label>
          <input
            id="width"
            name="width"
            type="number"
            value={currentSpace?.width || ""}
            onChange={(e) => {
              changeOption({ key: "width", value: e.target.valueAsNumber });
            }}
            min={0}
            placeholder="自动"
          />
        </div>

        <div className="configure__item">
          <label htmlFor="height">高</label>
          <input
            id="height"
            name="height"
            type="number"
            value={currentSpace?.height || ""}
            onChange={(e) => {
              changeOption({ key: "height", value: e.target.valueAsNumber });
            }}
            min={0}
            placeholder="自动"
          />
        </div>

        <div className="configure__item">
          <label htmlFor="suffix">文件后缀</label>
          <input
            id="suffix"
            name="suffix"
            type="text"
            value={currentSpace?.suffix || ""}
            onChange={(e) =>
              changeOption({ key: "suffix", value: e.target.value })
            }
          />
        </div>

        <div className="configure__item">
          <label htmlFor="format">输出格式</label>
          <Select
            id="format"
            name="format"
            value={currentSpace?.format}
            onValueChange={(value) =>
              changeOption({ key: "format", value: value })
            }
          >
            {formatOption.map((element) => (
              <SelectItem key={element.value} value={element.value}>
                {element.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="configure__item">
          <label>压缩强度：{currentSpace?.quality}</label>
          <Slider
            name="quality"
            value={[currentSpace?.quality || 2]}
            onValueChange={(value) =>
              changeOption({ key: "quality", value: value[0] })
            }
            min={1}
            max={9}
          />
        </div>

        <div className="configure__item">
          <label>保存到</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="outputOriginal"
                value="true"
                checked={currentSpace?.outputOriginal === true}
                onChange={() =>
                  changeOption({
                    key: "outputOriginal",
                    value: true,
                  })
                }
              />
              原目录
            </label>
            <label>
              <input
                type="radio"
                name="outputOriginal"
                value="false"
                checked={currentSpace?.outputOriginal === false}
                onChange={() =>
                  changeOption({
                    key: "outputOriginal",
                    value: false,
                  })
                }
              />
              自定义
            </label>
          </div>
          {currentSpace && currentSpace.outputOriginal === false && (
            <Tooltip content={<>{currentSpace.outputPath}</>}>
              <span onClick={onOpenFolder}>
                <input
                  type="text"
                  disabled
                  placeholder="点击设置文件夹"
                  value={currentSpace.outputPath || ""}
                />
              </span>
            </Tooltip>
          )}
        </div>
      </form>
    </Scrollbar>
  );
};

export default Configure;
