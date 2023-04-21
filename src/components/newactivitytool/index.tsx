import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Background,
  Overlay,
  LoadButton,
  MainButton,
  NewButton,
} from "./styles/indexStyle";
import SideButtons from "./sideButtons";
import Canvas from "./canvas/canvas";
import TopButtons from "./topButtons";
import { getFirestoreData, getStorageData } from "../firestore/getData";
import { ReactQueryDevtools } from "react-query/devtools";
import { ReducersType } from "./types";
import nodeSlice, { nodeActions } from "../../store/common/nodeSlice";
import PhotoEditor from "./photoEditor/photoEditor";

export default function NewActivityTool() {
  const newActivityTool = useRef<HTMLDialogElement>(null);
  const canvas = useSelector((state: ReducersType) => state.nodeReducer.canvas);
  const [subButtonVisible, setSubButtonVisible] = useState<boolean>(false);
  const [activitytools, setActivitytools] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activitytools) newActivityTool.current?.showModal();
    else newActivityTool.current?.close();
  }, [activitytools]);

  const mainClick = () => {
    if (!activitytools) setSubButtonVisible((x) => !x);
    else {
      setSubButtonVisible(false);
      setActivitytools(false);
    }
  };

  const activitytoolsStart = () => {
    setSubButtonVisible(false);
    setActivitytools(true);
  };
  const activitytoolsEnd = () => {
    setActivitytools(false);
  };

  const getCanvas = async () => {
    const href = window.location.href.replaceAll("/", "_");
    const data = await getFirestoreData("saveData", href);
    const record = await getStorageData(
      `bottomTools/record/${window.location.href.replaceAll("/", "_")}`
    );
    if (record) dispatch(nodeActions.setRecord(record));
    if (data) {
      canvas.loadFromJSON(data?.data, () => canvas.renderAll());
      activitytoolsStart();
    } else alert("저장된 데이터가 없습니다");
  };

  const setCanvas = async () => {
    canvas.clear();
    activitytoolsStart();
  };

  return (
    <>
      <Background ref={newActivityTool}>
        <Overlay>
          <TopButtons />
          <SideButtons activitytoolsEnd={activitytoolsEnd} />
          <Canvas />
          <PhotoEditor />
          <ReactQueryDevtools />
        </Overlay>
      </Background>
      {!activitytools && (
        <>
          <MainButton onClick={mainClick}>활동툴</MainButton>
          {subButtonVisible && (
            <>
              <LoadButton onClick={getCanvas}>불러오기</LoadButton>
              <NewButton onClick={setCanvas}>새로하기</NewButton>
            </>
          )}
        </>
      )}
    </>
  );
}
