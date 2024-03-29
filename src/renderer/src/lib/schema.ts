import { z } from "zod";

const preprocessNumber = z.preprocess((val) => {
  return Object.is(Number(val), Number.NaN) ? undefined : Number(val);
}, z.number().or(z.undefined()));

const formatSchema = z
  .literal("original")
  .or(z.literal("jpg"))
  .or(z.literal("png"))
  .or(z.literal("webp"))
  .or(z.literal("avif"))
  .or(z.literal("jpeg"));

const baseSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  width: preprocessNumber,
  height: preprocessNumber,
  suffix: z.string(),
  format: formatSchema,
  level: z.number().min(1).max(9).default(1),
  /**
   * auto execution
   *
   * if true, the command will be executed automatically when the add images
   */
  autoExec: z.boolean().default(false),
  originalOutput: z.boolean().default(true),
  outputDir: z.string().default(""),
  keepExif: z.boolean().default(false),
});

export const FormDataSchema = baseSchema.omit({ id: true });
export const WorkspaceSchema = baseSchema;

export type ConfigFormData = z.infer<typeof FormDataSchema>;
