import { currentSpaceIdAtom, spacesAtom } from "@/stores/space";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import Configure from "./Configure";
import Workbench from "./Workbench";

const Space: React.FC = () => {
  const setSpaces = useSetAtom(spacesAtom);
  const setCurrentSpacesId = useSetAtom(currentSpaceIdAtom);

  useEffect(() => {
    window.lossApi["space:get"]().then((spaces) => {
      setSpaces(spaces);
    });
    window.lossApi["space:getCurrentId"]().then((id) => setCurrentSpacesId(id));
  }, []);

  return (
    <>
      <Workbench />
      <Configure />
    </>
  );
};

export default Space;
