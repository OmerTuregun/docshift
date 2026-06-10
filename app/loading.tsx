export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 pt-16">
        <div className="mx-auto mb-4 h-8 w-48 animate-pulse rounded-xl bg-gray-100" />
        <div className="mx-auto mb-12 h-4 w-64 animate-pulse rounded-lg bg-gray-50" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
