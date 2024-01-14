import { PropsWithChildren } from "react";

export function Layout({ children }: PropsWithChildren) {
	return <div className="flex h-screen">{children}</div>;
}

export function Aside({ children }: PropsWithChildren) {
	return (
		<aside
			className="bg-gray-200/70 border-r flex-shrink-0"
			style={{
				width: "clamp(var(--w-sidebar-min), 16%, var(--w-sidebar-max))",
			}}
		>
			{children}
		</aside>
	);
}

export function Main({ children }: PropsWithChildren) {
	return <main className="grow">{children}</main>;
}
