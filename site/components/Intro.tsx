import { Rocket, Layers, FileLock2, Heart } from "lucide-react";
import styles from "~/styles/Intro.module.css";

const intro = [
  {
    icon: <Rocket />,
    title: "工作空间",
    content:
      "省去频繁修改参数的烦恼，让图片压缩更高效。利用像素丢失的工作空间，您可以将输出尺寸、输出格式、压缩强度、保持路径等任意组合，并快速切换。",
  },
  {
    icon: <Layers />,
    title: "支持多种格式",
    content:
      "除了最常见的 JPG、PNG、GIF 格式，像素丢失还提供压缩效率更高的 WebP 和 AVIF 格式，将图片压缩到更小，加快您的 Web 应用加载速度。",
  },
  {
    icon: <FileLock2 />,
    title: "隐私保护",
    content: "像素丢失不会上传您的任何数据，所有的工作只在您的电脑上完成。",
  },
  {
    icon: <Heart />,
    title: "免费开源",
    content: "所有人和企业都可以免费使用，且源代码开放，没有任何烦恼。",
  },
];

export default function Intro() {
  return (
    <div className={styles.introWrap}>
      {intro.map((element) => (
        <div key={element.title} className={styles.intro}>
          <figcaption>{element.icon}</figcaption>
          <article>
            <h3>{element.title}</h3>
            <p>{element.content}</p>
          </article>
        </div>
      ))}
    </div>
  );
}
