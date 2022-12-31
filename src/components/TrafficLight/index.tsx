import "./style.less";

export default function TrafficLight() {
  const onClose = () => {
    window.lossApi["window:close"]();
  };
  const onMinimize = () => {
    window.lossApi["window:minimize"]();
  };
  const onMaximize = () => {
    window.lossApi["window:maximize"]();
  };

  const isMacOS = window.lossApi.isMacOS;

  if (isMacOS) return <></>;

  return (
    <div className="traffic-lights recovery-drag">
      <button onClick={onClose} className="traffic-light traffic-light-close">
        <svg
          viewBox="0 0 124 124"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="26.8701"
            y="88.3883"
            width="87"
            height="11"
            transform="rotate(-45 26.8701 88.3883)"
          />
          <rect
            x="26.8701"
            y="34.6482"
            width="11"
            height="87"
            transform="rotate(-45 26.8701 34.6482)"
          />
        </svg>
      </button>
      <button
        onClick={onMinimize}
        className="traffic-light traffic-light-minimize"
      >
        <svg viewBox="0 0 87 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="87" height="16" />
        </svg>
      </button>
      <button
        onClick={onMaximize}
        className="traffic-light traffic-light-maximize"
      >
        <svg
          viewBox="0 0 143 143"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M32.8833 33.8862C32.8818 33.3317 33.3317 32.8817 33.8862 32.8833L87.5891 33.0361C88.4786 33.0387 88.9223 34.1142 88.2934 34.7432L34.7432 88.2933C34.1142 88.9223 33.0387 88.4786 33.0361 87.5891L32.8833 33.8862Z" />
          <path d="M109.245 108.242C109.247 108.797 108.797 109.247 108.242 109.245L54.5394 109.092C53.6498 109.09 53.2061 108.014 53.8351 107.385L107.385 53.8351C108.014 53.2061 109.09 53.6498 109.092 54.5394L109.245 108.242Z" />
        </svg>
      </button>
    </div>
  );
}
