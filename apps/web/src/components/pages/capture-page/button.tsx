"use client";

import { Camera } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { useCapturePage } from "./core";

export function CaptureButton() {
  const { isCameraOpen, startCapture } = useCapturePage();

  return (
    <Button
      className="rounded-full text-base sm:text-xl h-auto py-2 sm:py-3 px-4! cursor-pointer"
      onClick={startCapture}
      disabled={isCameraOpen}
    >
      <Camera className="mr-1 sm:mr-2 size-4 sm:size-6" />
      문장 수집하기
    </Button>
  );
}
