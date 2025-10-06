import { z } from "zod";

const envVarsSchema = z.object({
  VITE_HELIUS_RPC_URL: z.string().min(1),
});

export const envVars = envVarsSchema.parse(import.meta.env);
