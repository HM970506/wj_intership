import { useDispatch, useSelector } from "react-redux";
import { ReducersType } from "../types";
import { zoomActions } from "../../../store/common/zoomSlice";
import { ReturnButton } from "./style";
import { fabric } from "fabric-with-erasing";

export default function ZoomButton() {
  const canvas = useSelector((state: ReducersType) => state.nodeReducer.canvas);
  const zoom = useSelector((state: ReducersType) => state.zoomReducer.zoom);
  const dispath = useDispatch();

  return (
    <>
      <span> x{zoom}</span>
      <ReturnButton
        onClick={() => {
          if (zoom != 1) {
            canvas.zoomToPoint(
              { x: window.innerWidth / 2, y: window.innerHeight / 2 },
              1
            );
            dispath(zoomActions.setZoom(1));
          }
          canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        }}
      >
        🔄
      </ReturnButton>
    </>
  );
}
