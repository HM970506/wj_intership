import { fabric } from "fabric-with-erasing";
import "fabric-history";
import { useDispatch, useSelector } from "react-redux";
import { nodeActions } from "../../../store/common/nodeSlice";
import { useEffect, useRef, useState } from "react";
import { CanvasBackground } from "../style";
import fabricSetting from "./fabricSetting";
import windowSetting from "./windowSetting";
import {
  BACKGROUND_BRUSH,
  CRAYON,
  DEFAULT_CANVAS,
  DRAWTOOLS,
  ERASER,
  FELTPEN,
  HIGHLIGHTER,
  INK,
  ReducersType,
  SPRAY,
} from "../types";
import canvasSetting from "./canvasSetting";
import { useGesture } from "@use-gesture/react";
import zoomSlice, { zoomActions } from "../../../store/common/zoomSlice";
import functionSetting from "./functionSetting";
import { debounce } from "lodash";
import { drawActions } from "../../../store/common/drawSlice";
import CrayonMaker from "./brushes/crayon_brush";
import HighlighterMaker from "./brushes/marker_brush";
import InkMaker from "./brushes/ink_brush";
import { categoryActions } from "../../../store/common/categorySlice";

export default function Canvas() {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const category = useSelector(
    (state: ReducersType) => state.categoryReducer.category
  );
  const canvas = useSelector((state: ReducersType) => state.nodeReducer.canvas);
  const option = useSelector(
    (state: ReducersType) => state.categoryReducer.option
  );

  const drawModeDebounce = debounce(() => {
    if (category == DRAWTOOLS && canvas) canvas.isDrawingMode = true;
  }, 100);

  const zoomSetting = (zoom: number) => {
    const nowZoom = Math.round(zoom * 10) / 10;

    if (nowZoom > 5) return 5;
    else if (nowZoom < 0.1) return 0.1;
    else return nowZoom;
  };

  //function setting함수를 여기 넣지 않은 이유: canvas.getPointer함수를 사용하지 못하게 됨!
  const bind = useGesture({
    onPinch: ({ origin, offset }) => {
      canvas.isDrawingMode = false;

      const nowZoom = zoomSetting(offset[0]);
      canvas.zoomToPoint(
        { x: Math.round(origin[0]), y: Math.round(origin[1]) },
        nowZoom
      );
      dispatch(zoomActions.setZoom(canvas.getZoom()));

      drawModeDebounce();
    },
  });

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      ...DEFAULT_CANVAS,
      height: window.innerHeight,
      width: window.innerWidth,
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,

      pinchZoom: { state: 0, coord: { x: 0, y: 0 } },
    });
    canvas.freeDrawingBrush.inverted = true;

    fabricSetting();
    functionSetting(canvas);
    canvasSetting(canvas);
    windowSetting(canvas, dispatch);

    CrayonMaker(fabric);
    HighlighterMaker(fabric);
    InkMaker(fabric);

    canvas.renderAll();

    dispatch(nodeActions.setTextareaContainer(containerRef.current));
    dispatch(nodeActions.setCanvas(canvas));

    //브러쉬 초기세팅 관련 코드 시작
    dispatch(
      drawActions.setting({
        name: FELTPEN,
        brush: new fabric.PencilBrush(canvas, { color: "black", width: 1 }),
      })
    );
    dispatch(
      drawActions.setting({
        name: CRAYON,
        brush: new fabric.CrayonBrush(canvas, {
          color: "black",
          width: 1,
          opacity: 0.1,
        }),
      })
    );
    dispatch(
      drawActions.setting({
        name: SPRAY,
        brush: new fabric.SprayBrush(canvas, {
          density: 2,
          color: "black",
          width: 1,
        }),
      })
    );
    dispatch(
      drawActions.setting({
        name: BACKGROUND_BRUSH,
        brush: new fabric.PatternBrush(canvas, {
          color: "black",
          width: 1,
        }),
      })
    );
    dispatch(
      drawActions.setting({
        name: HIGHLIGHTER,
        brush: new fabric.MarkerBrush(canvas, { color: "black", width: 1 }),
      })
    );
    dispatch(
      drawActions.setting({
        name: INK,
        brush: new fabric.InkBrush(canvas, { color: "black", width: 1 }),
      })
    );
    dispatch(
      drawActions.setting({
        name: ERASER,
        brush: new fabric.EraserBrush(canvas, { color: "black", width: 1 }),
      })
    );

    //브러쉬 초기세팅 관련 코드 끝

    //히스토리 초기세팅 관련 코드 시작
    canvas.on("mouse:up", () => {
      if (canvas.historyRedo.length > 0) {
        canvas.historyRedo = [];
        dispatch(nodeActions.setRedo(0));
      }

      if (canvas.historyUndo.length > 4) canvas.historyUndo.shift();

      dispatch(nodeActions.setUndo(canvas.historyUndo.length));
    });
    //히스토리 초기세팅 관련코드 끝

    //옵션 초기세팅 시작
    canvas.on("mouse:down", () => {
      dispatch(categoryActions.optionChange(false));
    });

    //옵션 초기세팅 끝

    //마우스 휠 줌 세팅 코드 시작
    canvas.on("mouse:wheel", (opt: any) => {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      dispatch(zoomActions.setZoom(zoom));
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    //마우스 휠 줌 세팅 코드 끝
  }, []);

  return (
    <CanvasBackground ref={containerRef} {...bind()}>
      <canvas ref={canvasRef}></canvas>
    </CanvasBackground>
  );
}
