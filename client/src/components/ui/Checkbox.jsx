import clsx from 'clsx';

const Checkbox = ({ label, error, className, ...props }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          className={clsx(
            'w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label className="text-gray-700">{label}</label>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;