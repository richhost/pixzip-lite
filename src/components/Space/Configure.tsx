import React from "react";
import { useAtom, useAtomValue } from "jotai";
import produce from "immer";
import Scrollbar from "~/components/Scrollbar";
import { Select, SelectItem } from "~/components/Select";
import { Slider } from "~/components/Slider";
import { Tooltip } from "~/components/Tooltip";
import { defAtom, spacesAtom } from "~/stores/space";
import "./configure.scss";

const formatOption: { name: string; value: Format }[] = [
  { name: "原格式", value: "original" },
  { name: "JPG", value: "jpg" },
  { name: "PNG", value: "png" },
  { name: "WebP", value: "webp" },
  { name: "AVIF", value: "avif" },
];

const Configure: React.FC = () => {
  const [spaces, setSpaces] = useAtom(spacesAtom);
  const def = useAtomValue(defAtom);
  const currentSpace = spaces.find((element) => element.id === def);

  const changeOption: <K extends keyof Space>(
    key: K,
    value: Space[K]
  ) => void = (key, value) => {
    const nextState = produce(spaces, (draft) => {
      const index = draft.findIndex((element) => element.id === def);
      if (index !== -1 && key !== "id") {
        if (Object.is(value, NaN)) {
          delete draft[index][key];
        } else {
          draft[index][key] = value;
        }
      }
    });
    const target = nextState.find((element) => element.id === def);
    if (target) {
      window.space.patchSpace(target);
      setSpaces(nextState);
    }
  };

  const onOpenFolder = () => {
    window.util.folderPicker().then((path) => {
      if (path.length) {
        changeOption("outputPath", path[0]);
      }
    });
  };

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
              changeOption("width", e.target.valueAsNumber);
            }}
            min={0}
            placeholder="自动"
            spellCheck={false}
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
              changeOption("height", e.target.valueAsNumber);
            }}
            min={0}
            placeholder="自动"
            spellCheck={false}
          />
        </div>

        <div className="configure__item">
          <label htmlFor="suffix">文件后缀</label>
          <input
            id="suffix"
            name="suffix"
            type="text"
            value={currentSpace?.suffix || ""}
            onChange={(e) => changeOption("suffix", e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="configure__item">
          <label htmlFor="format">输出格式</label>
          <Select
            id="format"
            name="format"
            value={currentSpace?.format}
            onValueChange={(value) => changeOption("format", value as Format)}
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
            onValueChange={(value) => changeOption("quality", value[0])}
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
                onChange={() => changeOption("outputOriginal", true)}
                spellCheck={false}
              />
              原目录
            </label>
            <label>
              <input
                type="radio"
                name="outputOriginal"
                value="false"
                checked={currentSpace?.outputOriginal === false}
                onChange={() => changeOption("outputOriginal", false)}
                spellCheck={false}
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
                  spellCheck={false}
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
