const Alert = ({ message, type = 'error' }) => {
  if (!message) return null;

  return (
    <div className="mb-6 flex items-start space-x-3 bg-[#F9FAFB] border border-gray-100 p-4 rounded-sm">
      <span className="text-gray-500 mt-0.5 text-xs">
        {type === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <p className="text-[13px] text-gray-700 font-normal">
        {message}
      </p>
    </div>
  );
};

export default Alert;