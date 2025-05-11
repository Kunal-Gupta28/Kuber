const Loader = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
      {/* Dual Ring Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-b-transparent animate-spin"></div>
        <div className="absolute inset-1 rounded-full border-4 border-t-transparent border-b-blue-300 animate-spin-slow"></div>
      </div>

      {message && (
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">{message}</p>
      )}
    </div>
  );
};

export default Loader;
