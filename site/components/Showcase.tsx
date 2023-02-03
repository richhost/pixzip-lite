import ReactCompareImage from "react-compare-image";
import styles from "~/styles/Showcase.module.css";

export default function Showcase() {
  return (
    <div className={styles.showcase}>
      <h2 className={styles.title}>样例图片</h2>

      <ReactCompareImage
        aspectRatio="wider"
        leftImage="/showcase/IMG_7774.jpg"
        leftImageLabel="压缩前：1.5MB"
        rightImage="/showcase/IMG_7774-loss.jpg"
        rightImageLabel="压缩后：842KB"
      />

      <div className={styles.double}>
        <ReactCompareImage
          aspectRatio="wider"
          leftImage="/showcase/1.jpg"
          leftImageLabel="压缩前：221KB"
          rightImage="/showcase/1-loss.jpg"
          rightImageLabel="压缩后：105KB"
        />
        <ReactCompareImage
          aspectRatio="wider"
          leftImage="/showcase/2.jpg"
          leftImageLabel="压缩前：346KB"
          rightImage="/showcase/2-loss.jpg"
          rightImageLabel="压缩后：176KB"
        />
      </div>
    </div>
  );
}
