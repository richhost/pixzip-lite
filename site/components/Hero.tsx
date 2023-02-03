import Image from "next/image";
import styles from "~/styles/Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.hero}>
      <article>
        <h1 className={styles.h1}>像素丢失</h1>
        <h2 className={styles.h2}>面向现代 Web 应用的开源图片压缩软件</h2>
        <p>通过最新算法，在不损失视觉质量的前提下，大幅度减少图片文件大小</p>
        <p className={styles.download}>
          <a
            className={styles.github}
            href="https://github.com/9t5c/pixel-loss/releases"
            target="_blank"
            rel="noreferrer"
          >
            免费下载
          </a>
          <a
            className={styles.china}
            href="https://www.123pan.com/s/072SVv-Dl7cv"
            target="_blank"
            rel="noreferrer"
          >
            网盘下载
          </a>
        </p>
        <p className={styles.system}>支持 macOS 和 Windows 系统</p>
        <p className={styles.version}>版本：v1.2.0，更新日期：2023/02/01</p>
      </article>

      <figcaption className={styles.screenshot}>
        <div>
          <Image
            src="/screenshot.webp"
            width={1760}
            height={1160}
            alt="screenshot"
          />
        </div>
      </figcaption>
    </div>
  );
}
