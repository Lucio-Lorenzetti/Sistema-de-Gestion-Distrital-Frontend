const Alert = ({ message, type = 'error' }) => {
  if (!message) return null;
  const isError = type === 'error';

  return (
    <div className={`mb-6 flex items-start space-x-3 border p-4 rounded-sm ${isError ? 'bg-scout-accent-light border-scout-accent/20' : 'bg-scout-bg-panel border-scout-border'}`}>
      <span className={`mt-0.5 text-xs ${isError ? 'text-scout-accent' : 'text-scout-muted'}`}>
        {isError ? '⚠️' : 'ℹ️'}
      </span>
      <p className={`text-[13px] font-normal ${isError ? 'text-scout-accent' : 'text-scout-ink'}`}>
        {message}
      </p>
    </div>
  );
};

export default Alert;