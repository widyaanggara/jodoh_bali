import { notFound } from "next/navigation";

export default async function PalmEvaluationPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const { default: PalmEvaluationClient } = await import(
    "@/components/netra-hasta/PalmEvaluationClient"
  );

  return (
    <main className="min-h-screen bg-[#f7f1e5] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-[96rem]">
        <PalmEvaluationClient />
      </div>
    </main>
  );
}
