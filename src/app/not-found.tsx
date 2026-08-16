import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="display text-5xl">That page isn&apos;t on the board.</h1>
      <p className="mt-4 text-muted">Every link here goes somewhere real — this one just missed.</p>
      <Link href="/" className="mt-6 inline-block text-copper underline underline-offset-4">
        Back to the kitchen
      </Link>
    </div>
  );
}
