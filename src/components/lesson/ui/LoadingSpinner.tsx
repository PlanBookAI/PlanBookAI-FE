export function LoadingSpinner() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-white border-opacity-30 border-t-white rounded-full animate-spin"></div>
      <p className="text-blue-200">Đang tải...</p>
    </div>
  );
}
