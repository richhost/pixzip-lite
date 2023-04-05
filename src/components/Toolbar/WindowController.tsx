import React, { useEffect, useState } from "react";
import "./window-controller.scss";

const isLinux = window.util.platform === "linux";

const WindowController: React.FC = () => {
  const [windowStatus, setWindowStatus] = useState<"maximize" | "unmaximize">(
    "unmaximize"
  );

  const handleMinimize = () => {
    window.linux?.minimize();
  };
  const handleMaximize = () => {
    if (windowStatus === "unmaximize") {
      window.linux?.maximize();
    } else {
      window.linux?.unmaximize();
    }
  };
  const handleClose = () => {
    window.linux?.close();
  };

  useEffect(() => {
    if (isLinux) {
      window.linux?.onMaximize(() => setWindowStatus("maximize"));
      window.linux?.onUnmaximize(() => setWindowStatus("unmaximize"));

      return () => window.linux?.removeListeners();
    }
  }, []);

  return (
    <>
      {isLinux && (
        <div className="window-controller">
          <button className="drag-none" onClick={handleMinimize}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.755 12.5h16.492a.75.75 0 0 0 0-1.5H3.755a.75.75 0 0 0 0 1.5Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button className="drag-none" onClick={handleMaximize}>
            {windowStatus === "maximize" ? (
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 5.09325C2 4.23907 2.69245 3.54663 3.54663 3.54663H10.5767C11.4309 3.54663 12.1234 4.23907 12.1234 5.09325V12.1234C12.1234 12.9776 11.4309 13.67 10.5767 13.67H3.54663C2.69245 13.67 2 12.9776 2 12.1234V5.09325ZM3.54663 4.39024C3.15837 4.39024 2.84361 4.70499 2.84361 5.09325V12.1234C2.84361 12.5116 3.15837 12.8264 3.54663 12.8264H10.5767C10.965 12.8264 11.2798 12.5116 11.2798 12.1234V5.09325C11.2798 4.70499 10.965 4.39024 10.5767 4.39024H3.54663Z"
                  fill="currentColor"
                />
                <path
                  d="M5.09325 2C4.23907 2 3.54663 2.69245 3.54663 3.54663H4.39024C4.39024 3.15837 4.70499 2.84361 5.09325 2.84361H12.1234C12.5116 2.84361 12.8264 3.15837 12.8264 3.54663V10.5767C12.8264 10.965 12.5116 11.2798 12.1234 11.2798V12.1234C12.9776 12.1234 13.67 11.4309 13.67 10.5767V3.54663C13.67 2.69245 12.9776 2 12.1234 2H5.09325Z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75A2.75 2.75 0 0 1 5.75 3Zm0 1.5c-.69 0-1.25.56-1.25 1.25v12.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25H5.75Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>

          <button className="drag-none close-button" onClick={handleClose}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m4.397 4.554.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084-.073.084Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default WindowController;
