import { cn } from "@/lib/utils";

function H1({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={cn("text-2xl sm:text-4xl leading-tight sm:leading-normal font-ridi text-primary", className)}>
      {children}
    </h1>
  );
}

export const Heading = {
  H1,
};
