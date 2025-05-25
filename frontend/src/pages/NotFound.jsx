import { useNavigate, useLocation } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] text-center px-4">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
        Oops! The path <code className="text-red-500">{location.pathname}</code> doesn’t exist.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
