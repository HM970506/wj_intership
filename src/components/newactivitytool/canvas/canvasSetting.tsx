//import ReactTouchEvents from "react-touch-events";

import { IEvent } from "fabric/fabric-impl";
import { canvasType } from "../types";
import editControlHandler from "../common/editControlHandler";
import { categoryActions } from "../../../store/common/categorySlice";
import { nodeActions } from "../../../store/common/nodeSlice";

export default function canvasSetting(canvas: canvasType, dispatch: any) {
  const DeselctMultipleObjects = () => {
    if (canvas.getActiveObject().type === "activeSelection") {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const HistorySetteing = () => {
    if (canvas.historyRedo.length > 0) {
      canvas.historyRedo = [];
      dispatch(nodeActions.setRedo(0));
    }

    if (canvas.historyUndo.length > 4) canvas.historyUndo.shift();

    dispatch(nodeActions.setUndo(canvas.historyUndo.length));
  };

  const OptionSetting = () => {
    dispatch(categoryActions.optionChange(false));
    dispatch(categoryActions.setMeatball(false));
  };

  const Mathrounding = (now: any) => {
    return {
      ...now,
      width: now.width !== undefined ? Math.round(now.width) : 0,
      height: now.height !== undefined ? Math.round(now.height) : 0,
      top: now.top !== undefined ? Math.round(now.top) : 0,
      left: now.left !== undefined ? Math.round(now.left) : 0,
      angle: now.angle !== undefined ? Math.round(now.angle) : 0,
      scaleX:
        now.scaleX !== undefined ? Math.round(now.scaleX * 1000) / 1000 : 0,
      scaleY:
        now.scaleY !== undefined ? Math.round(now.scaleY * 1000) / 1000 : 0,
    };
  };

  canvas.on({
    "mouse:up": () => {
      HistorySetteing();
    },
    "mouse:down": () => {
      OptionSetting();
    },
    "selection:created": () => {
      DeselctMultipleObjects();
      editControlHandler(canvas);
      dispatch(nodeActions.setUndo(canvas.historyUndo.length));
    },
    "selection:updated": () => {
      DeselctMultipleObjects();
      editControlHandler(canvas);
    },

    "object:modified": (e: IEvent) => {
      e.target = Mathrounding(e.target);
    },
  });
  return canvas;
}
