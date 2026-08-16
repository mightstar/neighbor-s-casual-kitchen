export async function readJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    return { error: "The server returned an empty response. Try again." } as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return { error: "Something went wrong. Please try again." } as T;
  }
}

export function databaseErrorMessage(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code?: string }).code)
      : "";
  if (code === "P2021" || code === "P2022") {
    return "The database is not set up yet. Run `npx prisma db push`.";
  }
  if (code === "P1001" || code === "P1017") {
    return "Could not reach the database. Check DATABASE_URL.";
  }
  return "Something went wrong. Please try again.";
}
