export default function Empty() {
  return (
    <div className="flex flex-col items-center">
      <svg
        className="w-20 h-20 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="none"
          d="M22 14V5C22 3.9 21.1 3 20 3H4C2.9 3 2 3.9 2 5V15V17C2 18.1 2.9 19 4 19H14"
          clipRule="evenodd"
          fillRule="evenodd"
        ></path>
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1"
          stroke="currentColor"
          d="M22 14V5C22 3.9 21.1 3 20 3H4C2.9 3 2 3.9 2 5V15V17C2 18.1 2.9 19 4 19H14"
        ></path>
        <path
          fill="none"
          d="M22 14L17 8L11 16L6 12L2 15V17C2 18.1 2.9 19 4 19H14"
          clipRule="evenodd"
          fillRule="evenodd"
        ></path>
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1"
          stroke="currentColor"
          d="M22 14L17 8L11 16L6 12L2 15V17C2 18.1 2.9 19 4 19H14"
        ></path>
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1"
          stroke="currentColor"
          fill="none"
          d="M7 8C7.55228 8 8 7.55228 8 7C8 6.44772 7.55228 6 7 6C6.44772 6 6 6.44772 6 7C6 7.55228 6.44772 8 7 8Z"
        ></path>
        <path
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1"
          stroke="currentColor"
          d="M17 19H23"
        ></path>
        <path
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeWidth="1"
          stroke="currentColor"
          d="M20 16V22"
        ></path>
      </svg>

      <p className="font-smiley-sans mt-1 text-zinc-500">拖入图片开始压缩</p>
      <p className="text-xs scale-90 font-smiley-sans tracking-widest text-zinc-400">
        JPG / PNG / WebP / AVIF / GIF
      </p>
    </div>
  );
}
