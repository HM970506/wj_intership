import { useEffect, useRef, useState } from "react";
import {
  BRUSH,
  ERASER,
  NodeMakerType,
  PEN,
  PHOTO,
  RECORD,
  STICKER,
  TEXT,
  TransformerType,
} from "../types";
import RecordMaker from "./record";
import TextMaker from "./text";
import StickerMaker from "./sticker";
import PhotoMaker from "./photo";
import DrawToolsMaker from "./drawTools";
import { useDispatch, useSelector } from "react-redux";
import { nodeActions } from "../../../store/common/nodeSlice";
import { selectActions } from "../../../store/common/selectSlice";

export default function Node({ index, type, shapeProps }: NodeMakerType) {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<TransformerType>(null);
  const dispatch = useDispatch();
  const nowSelect = useSelector((state: any) => state.selectReducer.select);
  const isSelected = nowSelect === index ? true : false;

  useEffect(() => {
    dispatch(selectActions.selectChange(null));
  }, []);

  useEffect(() => {
    if (isSelected && trRef) {
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  //공통으로 쓰는 함수들-----------------------------
  const onChange = (newAttr: any) => {
    dispatch(nodeActions.modifyNodes({ index: index, modifyProps: newAttr }));
  };

  const onSelect = () => {
    dispatch(selectActions.selectChange(index));
  };

  const draw = useSelector((state: any) => state.drawReducer.tool);

  const [isNotDrawing, setIsNotDrawing] = useState<boolean>(
    draw == "" ? true : false
  );

  const onSelectCheck = () => {
    if (isNotDrawing) onSelect();
  };

  useEffect(() => {
    setIsNotDrawing(draw == "" ? true : false);
  }, [draw]);

  const props = {
    shapeProps: shapeProps,
    index: index,
    shapeRef: shapeRef,
    trRef: trRef,
    onChange: onChange,
    onSelectCheck: onSelectCheck,
    isSelected: isSelected,
    isNotDrawing: isNotDrawing,
  };

  switch (type) {
    case RECORD:
      return <RecordMaker shapeProps={shapeProps} />;
    case TEXT:
      return <TextMaker {...props} />;
    case STICKER:
      return <StickerMaker {...props} />;
    case PHOTO:
      return <PhotoMaker {...props} />;
    case PEN:
      return <DrawToolsMaker type={type} shapeProps={shapeProps} />;
    case BRUSH:
      return <DrawToolsMaker type={type} shapeProps={shapeProps} />;
    case ERASER:
      return <DrawToolsMaker type={type} shapeProps={shapeProps} />;
  }
  return <></>;
}
