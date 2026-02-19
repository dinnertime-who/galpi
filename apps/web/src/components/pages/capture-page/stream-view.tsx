"use client";

import { RotateCcw, X } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";
import { useCapturePage } from "./core";

export function StreamView() {
  const { streamView, isCameraOpen, capturedCanvas, isFrozen, stopCapture, captureFrame, retake } = useCapturePage();

  return (
    <div className={cn("fixed inset-0 z-50", isCameraOpen ? "" : "hidden")}>
      <video
        ref={streamView}
        autoPlay
        playsInline
        muted
        // // isFrozen이면 숨김 (hidden)
        className={cn("absolute inset-0 w-full h-full object-cover")}
        // // 화면 터치 시 캡처
        onClick={captureFrame}
      />

      <p
        className={cn("absolute left-1/2 -translate-x-1/2 bottom-[5dvh] text-xl text-primary")}
        style={{ animation: "text-pulse 5s infinite" }}
      >
        화면을 터치해서 원하는 문장을 찍으세요
      </p>

      <canvas
        ref={capturedCanvas}
        className={cn("absolute inset-0 w-full h-full object-cover z-10", isFrozen ? "block" : "hidden")}
      />

      <div
        className={cn(
          "absolute left-0 right-0 p-4 transition-all duration-300 flex justify-center z-20 gap-2 bg-black/40 backdrop-blur-sm",
          isFrozen ? "bottom-0" : "-bottom-full",
        )}
      >
        <Button className="w-full rounded-full" onClick={retake}>
          <RotateCcw className="mr-2 h-4 w-4" />
          다시 찍기
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={stopCapture}
        className="absolute top-4 right-4 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
}
