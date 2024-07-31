import { tipc } from '@egoist/tipc/main';

const t = tipc.create();

export const router = {
	sum: t.procedure.input<{ a: number; b: number }>().action(async ({ input }) => {
		return input.a + input.b;
	})
};

export type Router = typeof router;
