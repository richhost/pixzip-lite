import { z } from 'zod';

type Space = {
	id: string;
	name: string;
	width?: number;
	height?: number;
	suffix: string;
	format: Format;
	level: number;
	originalOutput: boolean;
	outputDir?: string;
	keepExif: boolean;
};

type Format = 'original' | 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif';

const formatSchema = z
	.literal('original')
	.or(z.literal('jpg'))
	.or(z.literal('jpeg'))
	.or(z.literal('png'))
	.or(z.literal('webp'))
	.or(z.literal('avif'));

export const formDataSchema = z.object({
	id: z.string(),
	name: z.string(),
	width: z.number().or(z.undefined()),
	height: z.number().or(z.undefined()),
	suffix: z.string(),
	format: formatSchema,
	level: z.number(),
	originalOutput: z.boolean(),
	outputDir: z.string().optional(),
	keepExif: z.boolean()
});
export type SpaceFormData = z.infer<typeof formDataSchema>;
