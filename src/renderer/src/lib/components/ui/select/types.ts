import * as select from '@zag-js/select';

export interface SelectProps extends Omit<select.Context, 'id' | 'collection'> {
	items: { label: string; value: string }[];
	placeholder?: string;
}

export interface SelectContext {
	api: ReturnType<typeof select.connect>;
}
