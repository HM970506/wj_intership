import { useSelector } from "react-redux";
import { fabric } from "fabric-with-erasing";
import { useEffect } from "react";
import { functionRemover } from "../../commonFunction";
import { ReducersType } from "../../types";
import { fabric as fabricType } from "fabric";

export default function Tape() {
  const { isPanning, isDrawing, canvas } = useSelector(
    (state: ReducersType) => state.nodeReducer
  );
  const tape = useSelector(
    (state: ReducersType) => state.categoryReducer.subcategory.tape
  );
  const tapeStep_1 = () => {
    const pointer = canvas.getPointer();
    const points = [pointer.x, pointer.y, pointer.x, pointer.y];

    const line = new fabric.Line(points, {
      strokeWidth: canvas.tapeState.size,
      opacity: canvas.tapeState.opacity,
      fill: canvas.toolColor,
      stroke: canvas.toolColor,
      originX: "center",
      originY: "center",
    });

    canvas.add(line);
    canvas.taping = 2;
  };

  const tapeStep_2 = () => {
    const pointer = canvas.getPointer();
    const now = canvas.getObjects()[canvas.getObjects().length - 1];
    now.set({
      x2: pointer.x,
      y2: pointer.y,
    });

    canvas.renderAll();
  };

  const tapeStep_3 = () => {
    const now = canvas.getObjects()[canvas.getObjects().length - 1];
    now.setCoords();
    canvas.taping = 1;
  };

  const tapeDown = () => {
    if (canvas.taping == 1) tapeStep_1();
  };

  const tapeMove = () => {
    if (canvas.taping == 2) tapeStep_2();
  };

  const tapeUp = () => {
    if (canvas.taping == 2) tapeStep_3();
  };

  const tapeOn = () => {
    canvas.on({
      "mouse:down": tapeDown,
      "mouse:move": tapeMove,
      "mouse:up": tapeUp,
    });
  };

  const tapeOff = (canvas: any) => {
    canvas.__eventListeners["mouse:down"] = functionRemover(
      canvas.__eventListeners["mouse:down"],
      tapeDown.name
    );
    canvas.__eventListeners["mouse:move"] = functionRemover(
      canvas.__eventListeners["mouse:move"],
      tapeMove.name
    );
    canvas.__eventListeners["mouse:up"] = functionRemover(
      canvas.__eventListeners["mouse:up"],
      tapeUp.name
    );
  };

  useEffect(() => {
    if (canvas) {
      tapeOff(canvas);
      if (!isPanning && !isDrawing) tapeOn();
      else tapeOff(canvas);
    }
  }, [isDrawing, isPanning]);

  return (
    <>
      투명도
      <input
        type="range"
        min="0"
        max="100"
        defaultValue={(tape.opacity * 100).toString()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          canvas.tapeState = {
            ...canvas.tapeState,
            opacity: e.target.value == "0" ? 0 : parseInt(e.target.value) / 100,
          };
        }}
      />
      크기
      <button
        onClick={() =>
          (canvas.tapeState = {
            ...canvas.tapeState,
            size: 30,
          })
        }
      >
        30
      </button>
      <button
        onClick={() =>
          (canvas.tapeState = {
            ...canvas.tapeState,
            size: 20,
          })
        }
      >
        20
      </button>
      <button
        onClick={() =>
          (canvas.tapeState = {
            ...canvas.tapeState,
            size: 10,
          })
        }
      >
        10
      </button>
    </>
  );
}
