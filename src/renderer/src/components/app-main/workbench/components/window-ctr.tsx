import { type ButtonHTMLAttributes } from "react";
import WindowClose from "~/assets/window-close.svg?react";
import WindowMinimize from "~/assets/window-minimize.svg?react";
import WindowMaximize from "~/assets/window-maximize.svg?react";
import WindowRestore from "~/assets/window-restore.svg?react";
import { useWindowCtr } from "../hooks/use-window-ctr";

export function WindowCtr() {
	const { min, max, close, restore, maximized } = useWindowCtr();

	return (
		<div className="flex items-center gap-3 h-full px-3">
			<IconButton onPointerUp={min}>
				<WindowMinimize width={16} height={16} />
			</IconButton>
			<IconButton
				onPointerUp={() => {
					maximized ? restore() : max();
				}}
			>
				{maximized ? (
					<WindowRestore width={16} height={16} />
				) : (
					<WindowMaximize width={16} height={16} />
				)}
			</IconButton>
			<IconButton onPointerUp={close}>
				<WindowClose width={16} height={16} />
			</IconButton>
		</div>
	);
}

function IconButton({
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			type="button"
			className="bg-gray-100 rounded-full w-6 h-6 grid place-items-center no-drag hover:bg-gray-200 active:bg-gray-300 transition-[background]"
		>
			{children}
		</button>
	);
}
