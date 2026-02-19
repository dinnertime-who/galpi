"use client";

import { useCapturePage } from "./core";

export function CapturedImage() {
  const { capturedImageData } = useCapturePage();

  if (!capturedImageData) return null;

  // biome-ignore lint/performance/noImgElement: use data url
  return <img src={capturedImageData} alt="captured" className="aspect-3/4 w-full max-w-[640px] object-cover" />;
}
