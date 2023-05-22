import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { categoryActions } from "../../../../store/common/categorySlice";
import { DECORATION, ReducersType } from "../../types";
import { selectable, unselectable } from "../../common/selectHandler";
import Template from "./template";
import Stamp from "./stamp";
import Tape from "./tape";
import SVG from "react-inlinesvg";
import { CategoryButton, Icon } from "../../style";
import { StampCategoryButton } from "./style";

export default function DecorationMenu() {
  const canvas = useSelector((state: ReducersType) => state.nodeReducer.canvas);
  const { template, stamp, tape } = useSelector(
    (state: ReducersType) => state.categoryReducer.subcategory
  );
  const option = useSelector(
    (state: ReducersType) => state.categoryReducer.option
  );
  const category = useSelector(
    (state: ReducersType) => state.categoryReducer.category
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (tape.state) {
      unselectable(canvas);
      canvas.tape.state = 1;
    } else {
      if (!stamp.state) selectable(canvas);
      canvas.tape.state = 0;
    }
  }, [tape.state]);

  useEffect(() => {
    if (stamp.state) {
      unselectable(canvas);
      canvas.stamp.state = 1;
    } else {
      if (!tape.state) selectable(canvas);
      canvas.stamp.state = 0;
    }
  }, [stamp.state]);

  return (
    <>
      <CategoryButton
        onClick={() => {
          if (!template.state) dispatch(categoryActions.templateOn());
          else dispatch(categoryActions.templateOff());
        }}
      >
        {category === DECORATION && template.state && <Template />}
        <Icon src={"/diary/decoration/template.png"} />
        <p>템플릿</p>
      </CategoryButton>
      <StampCategoryButton
        color={canvas.stamp.color}
        onClick={() => {
          if (!stamp.state) dispatch(categoryActions.stampOn());
          else if (!option) dispatch(categoryActions.optionChange(true));
          else if (option) dispatch(categoryActions.optionChange(false));
          else dispatch(categoryActions.stampOff());
        }}
      >
        {category === DECORATION && stamp.state && option && <Stamp />}

        {canvas.stamp.shape !== "" ? (
          <SVG src={canvas.stamp.shape} />
        ) : (
          <Icon src={"/diary/decoration/stamp.png"} />
        )}
        <p>스탬프</p>
      </StampCategoryButton>
      <CategoryButton
        onClick={() => {
          if (!tape.state) dispatch(categoryActions.tapeOn());
          else if (!option) dispatch(categoryActions.optionChange(true));
          else if (option) dispatch(categoryActions.optionChange(false));
          else dispatch(categoryActions.tapeOff());
        }}
      >
        {category === DECORATION && tape.state && option && <Tape />}
        <Icon src={"/diary/decoration/tape.png"} />
        <p>테이프</p>
      </CategoryButton>
    </>
  );
}
