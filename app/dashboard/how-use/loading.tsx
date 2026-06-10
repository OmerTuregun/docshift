export default function HowUseLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 h-3 w-40 animate-pulse rounded bg-gray-100" />
      <div className="mb-2 h-8 w-56 animate-pulse rounded bg-gray-100" />
      <div className="mb-8 h-4 w-80 animate-pulse rounded bg-gray-50" />
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="h-36 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-36 animate-pulse rounded-2xl bg-gray-100" />
      </div>
      <div className="mb-6 h-32 animate-pulse rounded-2xl bg-gray-100" />
      <div className="space-y-3">
        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
        <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
      </div>
    </main>
  );
}
