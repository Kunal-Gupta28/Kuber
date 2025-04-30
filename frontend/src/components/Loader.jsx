const Loader = ({ message }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
        {message && <p className="text-center text-gray-600">{message}</p>}
      </div>
    );
  };
  
  export default Loader;
  