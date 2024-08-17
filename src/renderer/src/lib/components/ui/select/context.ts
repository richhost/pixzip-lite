import { createContext } from '$lib/internal/create-context';
import type { SelectContext } from './types';

export const [getSelectContext, setSelectContext, key] = createContext<SelectContext>();
