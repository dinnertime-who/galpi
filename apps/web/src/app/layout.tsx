import type { Metadata } from "next";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/shadcn/tooltip";
import { kyobohand } from "@/config/fonts/kyobohand";
import { pretendard } from "@/config/fonts/pretendard";
import { ridi } from "@/config/fonts/ridi";
import { defaultMetadata } from "@/config/metadata/default";
import { TanstackQueryProvider } from "@/integrations/tanstack-query/provider";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${ridi.variable} ${kyobohand.variable} font-pretendard antialiased`}>
        <TooltipProvider>
          <TanstackQueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TanstackQueryProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
