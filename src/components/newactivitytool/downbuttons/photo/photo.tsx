import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Uploader } from "../../styles/commonStyle";
import { DEFAULT_X, ImageType, ReducersType } from "../../types";
import { photoEditorActions } from "../../../../store/common/photoEditorSlice";
import { imageCheck } from "./photoChecker";
import { Button } from "./style";
import { fabric } from "fabric-with-erasing";
import { Transform } from "fabric/fabric-impl";

const editIcon = "./diary/editButton.png";
const renderIcon = (
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number
) => {
  const size = 48;
  ctx.save();
  ctx.translate(left, top);
  const img = document.createElement("img");
  img.src = editIcon;
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
};

export default function PhotoMenu() {
  const [photo, setPhoto] = useState<string>("");
  const canvas = useSelector((state: ReducersType) => state.nodeReducer.canvas);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const editObject = (e: MouseEvent, transform: Transform) => {
    const target = transform.target;
    const canvas = target.canvas;
    const overlay = new fabric.Rect({
      left: 0,
      top: 0,
      fill: "rgba(0,0,0,0.5)",
      width: window.innerWidth,
      height: window.innerHeight,
    });
    console.log("target: ", target);

    const cropper = new fabric.Rect({
      left: target.left,
      top: target.top,
      fill: "black",
      selectable: true,
      width: target.width && target.scaleX ? target.width * target.scaleX : 1,
      height:
        target.height && target.scaleY ? target.height * target.scaleY : 1,
    });

    cropper.setControlVisible("deleteControl", false);
    cropper.setControlVisible("editControl", false);
    target.selectable = false;
    target.globalCompositeOperation = "source-atop";

    if (canvas !== undefined) {
      canvas.remove(target);
      canvas.add(overlay);

      canvas.add(cropper);
      canvas.add(target);
      canvas.setActiveObject(cropper);
      canvas.renderAll();
    }

    dispatch(photoEditorActions.setPhoto(photo));
    dispatch(photoEditorActions.setIsEditing(true));
  };

  useEffect(() => {
    const test = async () => {
      if (canvas && photo !== "") {
        if (await imageCheck(photo)) {
          new fabric.Image.fromURL(photo, (img: ImageType) => {
            img.hoverCursor = "auto";
            img.erasable = false;
            img.selectable = true;
            img.crossOrigin = "Anonymous";
            if (img.controls) {
              img.controls.editControl = new fabric.Control({
                x: -0.45,
                y: -0.45,
                cursorStyle: "pointer",
                mouseUpHandler: editObject,
                render: renderIcon,
                cornerSize: 30,
              });
            }
            if (img.width !== undefined) {
              const scale = DEFAULT_X / img.width;
              img.scaleX = scale;
              img.scaleY = scale;
            }

            canvas.add(img);
            canvas.setActiveObject(img);
          });
          setPhoto("");
        } else {
          alert("적합한 이미지가 아닙니다");
        }
      }
    };

    test();
  }, [photo, canvas]);

  const onUploadImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async (e: ProgressEvent<FileReader>) => {
        if (e.target !== null && typeof e.target.result === "string")
          setPhoto(e.target.result);
      };

      e.target.value = "";
    }
  }, []);

  const photoUpload = () => {
    if (inputRef.current !== null) inputRef.current?.click();
  };

  return (
    <>
      <Uploader
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onUploadImage}
      />
      <Button onClick={photoUpload}>앨범</Button>
      <Button>사진 찍기</Button>
    </>
  );
}