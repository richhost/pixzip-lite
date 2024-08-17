import { createContext } from '$lib/internal/create-context';
import type { MenuContext } from './types';

export const [getMenuContext, setMenuContext] = createContext<MenuContext>();
