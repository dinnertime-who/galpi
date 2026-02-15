"use client";

import { Camera, Check, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../shadcn/button";

export function CameraScanner() {
  // UI 상태 관리
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [captureImage, setCaptureImage] = useState<string | null>(null);

  // Ref는 항상 존재함 (DOM이 그려져 있으므로)
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // ★ 캔버스 Ref 추가
  const [isFrozen, setIsFrozen] = useState(false); // ★ 화면 정지 상태

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 4096 }, height: { ideal: 2160 } },
      });

      // [핵심] 비디오 태그가 이미 DOM에 숨겨져 있으므로 바로 연결 가능
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true); // CSS 클래스만 변경
      }
    } catch (err) {
      console.log((err as Error).message);
      console.error("Camera Error:", err);
      alert("카메라 권한이 필요합니다.");
    }
  };

  const stopCamera = () => {
    // [중요] 화면에서 숨기더라도 하드웨어(카메라)는 반드시 꺼야 함
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // 비디오 소스 끊기 (검은 화면 잔상 방지)
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (context) {
      // 1. 캔버스 크기를 비디오 원본 해상도에 맞춤 (화질 저하 방지)
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 2. 현재 비디오 화면을 캔버스에 '그리기' (복사)
      // drawImage(소스, x, y, 가로, 세로)
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 3. 상태 변경 -> 비디오 숨기고 캔버스 보여주기
      setIsFrozen(true);
    }
  };

  // ★ 다시 찍기 (Retake)
  const retake = () => {
    setIsFrozen(false);
    // 비디오는 계속 스트리밍 중이므로, CSS만 바꿔주면 다시 움직이는 화면이 보임
  };

  // ★ 확정 (Confirm) -> OCR 분석 요청할 곳
  const confirmCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 이미지 데이터 추출 (서버 전송용)
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
    console.log("캡처된 이미지:", imageDataUrl);

    setCaptureImage(imageDataUrl);

    setIsFrozen(false);
    setIsCameraOpen(false);

    // TODO: 여기서 Google Vision API 호출
    alert("이미지 추출 완료! 콘솔 확인");
  };

  // 언마운트 시 정리
  // biome-ignore lint/correctness/useExhaustiveDependencies: 의도된 동작
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F7F5F0]">
      {/* 배경색(#F7F5F0): Warm Off-White
       */}
      <div>debug: {isCameraOpen ? "true" : "false"}</div>

      <div className={cn("text-center space-y-4", isCameraOpen ? "hidden" : "block")}>
        <h2 className="text-2xl font-ridi text-[#0A3928] mb-8">
          오늘의 문장을
          <br />
          수집해볼까요?
        </h2>

        <Button
          onClick={startCamera}
          className="bg-[#0A3928] hover:bg-[#082f21] text-[#F7F5F0] rounded-full px-8 py-6 text-lg shadow-lg transition-transform active:scale-95"
        >
          <Camera className="mr-2 h-5 w-5" />
          문장 수집하기
        </Button>
      </div>

      <div>{captureImage && <img src={captureImage} alt="captured" className="w-full h-full object-cover" />}</div>

      <div className={cn("fixed inset-0 z-50 flex flex-col bg-black", isCameraOpen ? "block" : "hidden")}>
        {/* 상단 닫기 버튼 영역 */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-end p-4 bg-gradient-to-b from-black/50 to-transparent">
          <Button
            variant="ghost"
            size="icon"
            onClick={stopCamera}
            className="text-white hover:bg-white/20 rounded-full h-12 w-12"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* 비디오 뷰파인더 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          // isFrozen이면 숨김 (hidden)
          className={`absolute inset-0 w-full h-full object-cover ${isFrozen || !isCameraOpen ? "hidden" : "block"}`}
          // 화면 터치 시 캡처
          onClick={captureFrame}
        />

        {/* B. 캡처된 캔버스 (멈춤) */}
        <canvas
          ref={canvasRef}
          // isFrozen일 때만 보임 (block)
          className={`absolute inset-0 w-full h-full object-cover ${isFrozen ? "block" : "hidden"}`}
        />

        {/* 안내 문구 (캡처 전일 때만) */}
        {!isFrozen && (
          <div className="absolute bottom-20 w-full text-center text-white/80 pointer-events-none">
            <p className="text-sm font-medium animate-pulse">화면을 터치해서 문장을 잡으세요</p>
          </div>
        )}

        {/* --- 하단 컨트롤 바 (캡처 후에만 표시) --- */}
        {isFrozen && (
          <div className="absolute bottom-0 w-full p-6 bg-black/80 backdrop-blur-sm flex justify-around items-center z-30 animate-in slide-in-from-bottom-full">
            <Button
              variant="outline"
              onClick={retake}
              className="border-white/20 text-black hover:bg-white/10 rounded-full px-8"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> 다시 찍기
            </Button>

            <Button onClick={confirmCapture} className="bg-[#0A3928] text-white hover:bg-[#082f21] rounded-full px-8">
              <Check className="mr-2 h-4 w-4" /> 추출하기
            </Button>
          </div>
        )}

        {/* (추후 여기에 셔터/프리즈 버튼이 오버레이 됩니다) */}
      </div>
    </div>
  );
}
