export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main className="bg-background min-h-dvh flex flex-col">{children}</main>
    </div>
  );
}
