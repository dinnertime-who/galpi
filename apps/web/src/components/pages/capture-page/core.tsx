"use client";

import { useRef, useState } from "react";
import { withContext } from "@/components/ui/with-context";

const { useContext, Provider } = withContext<{
  isCameraOpen: boolean;
  isFrozen: boolean;

  startCapture: () => Promise<void>;
  stopCapture: () => void;
  captureFrame: () => void;
  retake: () => void;

  capturedImageData: string | null;

  streamView: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  capturedCanvas: React.RefObject<HTMLCanvasElement | null>;
}>();

export const useCapturePage = useContext;

export function CapturePageProvider({ children }: { children: React.ReactNode }) {
  const streamView = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const capturedCanvas = useRef<HTMLCanvasElement>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [capturedImageData, setCapturedImageData] = useState<string | null>(null);

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 4096 }, height: { ideal: 2160 } },
      });

      // [핵심] 비디오 태그가 이미 DOM에 숨겨져 있으므로 바로 연결 가능
      if (streamView.current) {
        streamView.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true); // CSS 클래스만 변경
      }
    } catch (err) {
      console.log((err as Error).message);
      console.error("Capture Error:", err);
      alert("카메라 권한이 필요합니다.");
    }
  };

  const stopCapture = () => {
    // [중요] 화면에서 숨기더라도 하드웨어(카메라)는 반드시 꺼야 함
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // 비디오 소스 끊기 (검은 화면 잔상 방지)
    if (streamView.current) {
      streamView.current.srcObject = null;
    }

    setIsCameraOpen(false);
    setIsFrozen(false);
  };

  const captureFrame = () => {
    if (!streamView.current || !capturedCanvas.current) return;

    const video = streamView.current;
    const canvas = capturedCanvas.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // 1. 캔버스 크기를 비디오 원본 해상도에 맞춤 (화질 저하 방지)
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 2. 현재 비디오 화면을 캔버스에 '그리기' (복사)
    // drawImage(소스, x, y, 가로, 세로)
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

    // setCapturedImageData(imageDataUrl);

    // stopCapture();

    setIsFrozen(true);
  };

  const retake = () => {
    setIsFrozen(false);
  };

  return (
    <Provider
      context={{
        isCameraOpen,
        isFrozen,
        startCapture,
        stopCapture,
        captureFrame,
        retake,
        capturedImageData,
        streamView,
        streamRef,
        capturedCanvas,
      }}
    >
      {children}
    </Provider>
  );
}
