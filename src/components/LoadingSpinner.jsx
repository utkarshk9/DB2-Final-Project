export default function LoadingSpinner() {
  return (
    <div className="flex justify-center py-6">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
    </div>
  );
}
