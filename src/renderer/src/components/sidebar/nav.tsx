import { forwardRef, createElement } from "react";
import * as IconPrimitive from "@radix-ui/react-icons";

import { ScrollArea } from "~/components/ui/scroll-area";
import { useWorkspace } from "~/hooks/use-workspace";

export function Nav() {
	const { workspaces } = useWorkspace();

	return (
		<ScrollArea>
			<nav className="space-y-2 p-1 text-sm">
				{workspaces.map(({ id, ...rest }) => (
					<NavItem key={id} {...rest} />
				))}
			</nav>
		</ScrollArea>
	);
}

function NavItem(props: Omit<Pixzip.Workspace, "id">) {
	return (
		<button
			type="button"
			className="flex w-full items-center justify-between gap-3 px-1 py-2 rounded cursor-default hover:bg-secondary font-semibold"
		>
			<div className="flex min-w-0 items-center gap-2">
				<Icon className="shrink-0" name={props.icon} />
				<span className="min-w-0 truncate">{props.name}</span>
			</div>
			{/* <div className="shrink-0">4</div> */}
		</button>
	);
}

const Icon = forwardRef<
	HTMLOrSVGElement,
	{ name?: string; className?: string; style?: React.CSSProperties }
>(({ name, ...props }, forwardRef) => {
	if (!name) return <></>;

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return createElement((IconPrimitive as any)[name], {
		...props,
		ref: forwardRef,
	});
});
