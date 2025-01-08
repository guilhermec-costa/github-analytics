export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 animate-spin w-16 h-16 border-4 border-t-accent border-gray-200 rounded-full"></div>
        <div className="absolute inset-4 w-8 h-8 border-4 border-t-accent border-gray-300 rounded-full animate-spin-reverse"></div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-700 mt-8">
        Loading Repository Metrics
      </h2>
      <p className="text-gray-500 mt-2">
        Please wait while we fetch the data for you.
      </p>
      <p className="text-sm text-gray-400 mt-6">
        This may take a few seconds, depending on your network.
      </p>
    </div>
  );
}
