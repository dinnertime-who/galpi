import "@/components/pages/capture-page/keyframes.css";
import { CapturePage } from "@/components/pages/capture-page";
import { Heading } from "@/components/ui/typography/headings";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center gap-4 justify-center">
      <Heading.H1 className="w-[7em] text-center">오늘의 문장을 수집해볼까요?</Heading.H1>

      <CapturePage.Provider>
        <CapturePage.CaptureButton />

        <CapturePage.StreamView />

        <CapturePage.CapturedImage />
      </CapturePage.Provider>
    </div>
  );
}
