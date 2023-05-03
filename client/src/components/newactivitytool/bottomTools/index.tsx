import { useSelector } from "react-redux";
import { BottomContainer, ToolBox } from "../styles/indexStyle";
import PhotoMenu from "./photo/photo";
import RecordMenu from "./record";
import StickerMenu from "./sticker";
import DrawToolsMenu from "./drawTools";
import {
  DECORATION,
  DRAWTOOLS,
  PHOTO,
  RECORD,
  ReducersType,
  STICKER,
  TEXT,
} from "../types";
import TextMenu from "./text";
import DecorationMenu from "./decorations";
import Colorbox from "./colorbox";

export default function BottomTools() {
  const nowCategory = useSelector(
    (state: ReducersType) => state.categoryReducer.category
  );
  const view = useSelector((state: ReducersType) => state.categoryReducer.view);

  return (
    <BottomContainer view={view ? 1 : 0}>
      <Colorbox />
      <ToolBox>
        {nowCategory === DRAWTOOLS && <DrawToolsMenu />}
        {nowCategory === RECORD && <RecordMenu />}
        {nowCategory === PHOTO && <PhotoMenu />}
        {nowCategory === STICKER && <StickerMenu />}
        {nowCategory === TEXT && <TextMenu />}
        {nowCategory === DECORATION && <DecorationMenu />}
      </ToolBox>
    </BottomContainer>
  );
}