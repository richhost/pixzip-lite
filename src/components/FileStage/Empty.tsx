import "./empty.scss";

export default function Empty() {
  return (
    <div className="file-empty">
      <img src="/imgs/cat.svg" alt="" />
      <div>
        <p>将图片拖入此处开始压缩</p>
        <p>支持 JPG / PNG / GIF / WebP / AVIF</p>
      </div>
    </div>
  );
}
