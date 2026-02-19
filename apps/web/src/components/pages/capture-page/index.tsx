import { CaptureButton } from "./button";
import { CapturedImage } from "./captured-image";
import { CapturePageProvider, useCapturePage } from "./core";
import { StreamView } from "./stream-view";

export const CapturePage = {
  Provider: CapturePageProvider,
  CaptureButton: CaptureButton,
  StreamView: StreamView,
  CapturedImage: CapturedImage,
};

export { useCapturePage };
