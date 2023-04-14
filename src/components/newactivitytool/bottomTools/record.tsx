import { useRef, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useDispatch } from "react-redux";
import { nodeActions } from "../../../store/common/nodeSlice";

export default function RecordMenu() {
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
  navigator.mediaDevices.getUserMedia({ audio: true });

  const addNodes = (audioSrc: string) => {
    dispatch(nodeActions.setRecord(audioSrc));
  };

  const recorderControls = useAudioRecorder();
  const addAudioElement = (blob: any) => {
    const url = URL.createObjectURL(blob);
    setAudioSrc(url);
  };

  const audioComplete = async () => {
    if (audioSrc !== undefined) addNodes(audioSrc);
    setAudioSrc(undefined);
  };

  return (
    <>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
      />
      <audio ref={audioRef} src={audioSrc} controls={true} />
      <button onClick={audioComplete}>완성</button>
    </>
  );
}
