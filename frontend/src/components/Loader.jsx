import { createPortal } from 'react-dom';

const Loader = ({ message }) => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center h-screen w-screen bg-black/50 dark:bg-gray-900/50 backdrop-blur-sm">
      {/* Dual Ring Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-b-transparent animate-spin"></div>
        <div className="absolute inset-1 rounded-full border-4 border-t-transparent border-b-blue-300 animate-spin-slow"></div>
      </div>

      {message && (
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">{message}</p>
      )}
    </div>,
    document.body
  );
};

export const MapLoader = ({ message }) => {
  return (
    <div className="absolute inset-0  flex flex-col items-center justify-center bg-black/30 dark:bg-gray-900/30 backdrop-blur-[2px]">
      {/* Dual Ring Spinner */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-3 border-t-blue-500 border-b-transparent animate-spin"></div>
        <div className="absolute inset-1 rounded-full border-3 border-t-transparent border-b-blue-300 animate-spin-slow"></div>
      </div>

      {message && (
        <p className="text-center text-gray-600 dark:text-gray-300 text-xs mt-2">{message}</p>
      )}
    </div>
  );
};

export default Loader;
