import Cat from "~/assets/cat.svg";

export function Empty() {
  return (
    <div className="grow flex flex-col items-center justify-center text-sm text-muted-foreground">
      <img src={Cat} className="max-h-[300px]" alt="" />
      <div className="text-center -mt-10">
        <p>将图片拖入此处开始压缩</p>
        <p>支持 JPG / PNG / GIF / WebP / AVIF</p>
      </div>
    </div>
  );
}
