import React, { useReducer } from "react";
import Scrollbar from "@/components/Scrollbar";
import { Select, SelectItem } from "@/components/Select";
import { Slider } from "@/components/Slider";
import "./configure.scss";

const formatOption: { name: string; value: Format }[] = [
  { name: "原格式", value: "original" },
  { name: "JPG", value: "jpg" },
  { name: "PNG", value: "png" },
  { name: "WebP", value: "webp" },
  { name: "AVIF", value: "avif" },
];

type FormValue = Omit<Space, "id" | "name" | "icon">;
type Action = {
  type: "update";
  key: keyof FormValue;
  vaule: FormValue[keyof FormValue];
};

const initState: FormValue = {
  suffix: "-mini",
  format: "original",
  quality: 2,
  outputOriginal: true,
  outputPath: "",
};

const reducer = (state: FormValue, action: Action) => {
  switch (action.type) {
    case "update":
      const newState = {
        ...state,
        [action.key]: action.vaule,
      };

      return newState;
    default:
      return state;
  }
};

const Configure: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <Scrollbar>
      <form className="configure" autoComplete="off">
        <div className="configure__item">
          <label htmlFor="width">宽</label>
          <input
            id="width"
            name="width"
            type="number"
            value={state.width}
            onChange={(e) => {
              dispatch({
                type: "update",
                key: "width",
                vaule: e.target.valueAsNumber,
              });
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
            value={state.height}
            onChange={(e) => {
              dispatch({
                type: "update",
                key: "height",
                vaule: e.target.valueAsNumber,
              });
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
            value={state.suffix}
            onChange={(e) =>
              dispatch({
                type: "update",
                key: "suffix",
                vaule: e.target.value,
              })
            }
          />
        </div>

        <div className="configure__item">
          <label htmlFor="format">输出格式</label>
          <Select
            id="format"
            name="format"
            defaultValue={initState.format}
            value={state.format}
            onValueChange={(value) =>
              dispatch({ type: "update", key: "format", vaule: value })
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
          <label>压缩强度：{state.quality}</label>
          <Slider
            name="quality"
            value={[state.quality]}
            onValueChange={(value) =>
              dispatch({ type: "update", key: "quality", vaule: value[0] })
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
                checked={state.outputOriginal === true}
                onChange={() =>
                  dispatch({
                    type: "update",
                    key: "outputOriginal",
                    vaule: true,
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
                checked={state.outputOriginal === false}
                onChange={() =>
                  dispatch({
                    type: "update",
                    key: "outputOriginal",
                    vaule: false,
                  })
                }
              />
              自定义
            </label>
          </div>
          {state.outputOriginal === false && (
            <input
              type="text"
              disabled
              placeholder="点击设置文件夹"
              value={state.outputPath}
            />
          )}
        </div>
      </form>
    </Scrollbar>
  );
};

export default Configure;
