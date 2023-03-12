import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { defAtom, spacesAtom } from "~/stores/space";
import Configure from "./Configure";
import Workbench from "./Workbench";

const Space: React.FC = () => {
  const setSpaces = useSetAtom(spacesAtom);
  const setDef = useSetAtom(defAtom);

  useEffect(() => {
    window.space.getSpaces().then((spaces) => setSpaces(spaces));
    window.space.getDefault().then((id) => setDef(id));
  }, []);

  return (
    <>
      <Workbench />
      <Configure />
    </>
  );
};

export default Space;
