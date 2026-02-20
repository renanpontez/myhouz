import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";

/**
 * Identity translator for Zod schema factories in API routes.
 * API error keys are returned as-is (not i18n-translated).
 */
export const apiTranslator = (key: string) => key;

/**
 * Parse and validate a JSON request body against a Zod schema.
 * Returns `{ data }` on success or `{ error }` with a 400 NextResponse on failure.
 */
export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      error: NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      error: NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      ),
    };
  }

  return { data: parsed.data };
}
