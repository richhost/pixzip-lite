import styles from "~/styles/OpenSource.module.css";

const data = [
  { name: "lovell/sharp", link: "https://github.com/lovell/sharp" },
  { name: "radix-ui", link: "https://github.com/radix-ui" },
  { name: "supercharge/fs", link: "https://github.com/supercharge/fs" },
  {
    name: "electron-vite/electron-vite-react",
    link: "https://github.com/electron-vite/electron-vite-react",
  },
];

export default function OpenSource() {
  return (
    <div className={styles.openSource + " full-bleed"}>
      <div className="container">
        <h2 className={styles.title}>开源项目</h2>
        <p>像素丢失建立在已有的开源项目之上，感谢参与以下项目的贡献者：</p>

        <ul className={styles.list}>
          {data.map((item) => (
            <li key={item.name} className={styles.item}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.pixlloss}>
          您可以点击
          <a
            href="https://github.com/9t5c/pixel-loss"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          访问源代码。同时，也期待您的反馈和建议，请与 uucc@live.com
          联系。像素丢失的灵感来自
          <a
            className={styles.tuya}
            href="https://tuya.xinxiao.tech/"
            target="_blank"
            rel="noreferrer"
          >
            图压
          </a>
          ，在此特别感谢。
        </div>
      </div>
    </div>
  );
}
