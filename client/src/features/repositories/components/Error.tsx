export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-red-500">
        Failed to Load Data
      </h2>
      <p className="text-gray-500 mt-2 text-center">
        An error occurred while fetching repository metrics. Please try again.
      </p>
    </div>
  );
}
