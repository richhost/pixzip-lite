import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
  return <div className="flex h-screen overflow-hidden">{children}</div>;
}

export function Aside({ children }: PropsWithChildren) {
  return (
    <aside
      className="border-r shrink-0"
      style={{
        width: "clamp(var(--w-sidebar-min), 16%, var(--w-sidebar-max))",
      }}
    >
      {children}
    </aside>
  );
}

export function Main({ children }: PropsWithChildren) {
  return <main className="grow bg-background">{children}</main>;
}
