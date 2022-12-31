import { useEffect, useState } from "react";
import { FolderCog } from "lucide-react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Slider,
  Tooltip,
  Switch,
} from "@arco-design/web-react";

const FormItem = Form.Item;

const options = [
  { label: "原格式", value: "original" },
  { label: "JPG", value: "jpg" },
  { label: "PNG", value: "png" },
  { label: "WebP", value: "webp" },
  { label: "AVIF", value: "avif" },
];

export default function FromSection() {
  // 从后端获取配置文件
  useEffect(() => {
    window.lossApi["config:get"]().then((config) => {
      form.setFieldsValue(config);

      // 非原文件夹
      if (!config.outputOriginal) setShowSelectFolder(true);

      // 有自定义路径
      if (config.outputPath) setOutputPath(config.outputPath);
    });
  }, []);

  // 自定义路径
  const [outputPath, setOutputPath] = useState("");
  // 表单
  const [form] = Form.useForm<UserConfig>();
  // 是否显示自定义路径
  const [showSelectFolder, setShowSelectFolder] = useState(false);

  // 表单值改变
  const onChange = (
    value: Partial<UserConfig>,
    values: Partial<UserConfig>
  ) => {
    if (value.outputOriginal !== undefined)
      setShowSelectFolder(!value.outputOriginal);

    // 修改配置文件
    const data = {
      ...values,
      outputPath,
    };
    window.lossApi["config:set"](data as UserConfig);
  };

  // 打开文件夹的回调
  const onOpenFolder = async () => {
    const filePath = await window.lossApi["dialog:openFolder"]();

    if (filePath) {
      // 修改配置文件
      const values = form.getFieldsValue();
      const data = {
        ...values,
        outputPath: filePath,
      };
      window.lossApi["config:set"](data as UserConfig);
      setOutputPath(filePath);
    }
  };

  return (
    <section className="flex-1 px-4 scroll">
      <h1 className="text-xl font-medium mt-4 font-smiley-sans">像素丢失</h1>
      <h2 className="font-smiley-sans text-xs text-zinc-400 tracking-wider">
        Pixel Loss
      </h2>

      <Form
        form={form}
        autoComplete="off"
        size="small"
        labelAlign="left"
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
        onChange={onChange}
      >
        <h2 className="mt-6 text-zinc-400 mb-3 pb-2 border-b">基本设置</h2>

        <FormItem label="宽" field="width">
          <InputNumber placeholder="自动" hideControl />
        </FormItem>
        <FormItem label="高" field="height">
          <InputNumber placeholder="自动" hideControl />
        </FormItem>
        <FormItem label="输出格式" field="format">
          <Select options={options} />
        </FormItem>
        <FormItem label="文件后缀" field="suffix">
          <Input />
        </FormItem>

        <h2 className="mt-6 text-zinc-400 mb-3 pb-2 border-b">更多设置</h2>

        <FormItem
          labelCol={{ span: 18 }}
          wrapperCol={{ span: 6 }}
          label="保存到原文件夹"
          field="outputOriginal"
          triggerPropName="checked"
        >
          <Switch type="line" className="float-right" />
        </FormItem>

        {showSelectFolder && (
          <>
            <div className="arco-form-label-item flex items-center justify-between">
              <label>自定义路径</label>
              <span
                onClick={onOpenFolder}
                className="w-6 h-6 flex items-center justify-center bg-zinc-100 rounded-full hover:bg-zinc-200 active:bg-zinc-300"
              >
                <FolderCog size={13} />
              </span>
            </div>
            <Tooltip content={outputPath} position="top" className="text-xs">
              <p className="text-xs text-right truncate text-zinc-400 mb-2">
                {outputPath || "原文件夹"}
              </p>
            </Tooltip>
          </>
        )}

        <FormItem label="压缩强度" field="quality" layout="vertical">
          <Slider
            max={9}
            min={1}
            showTicks
            marks={{
              1: "1",
              9: "9",
            }}
            className="px-2"
          />
        </FormItem>
      </Form>
    </section>
  );
}
