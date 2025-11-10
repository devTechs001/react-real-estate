import clsx from 'clsx';

const Radio = ({ label, name, value, checked, onChange, error }) => {
  return (
    <div className="flex items-center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={clsx(
          'w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500',
          error && 'border-red-500'
        )}
      />
      {label && (
        <label className="ml-2 text-sm text-gray-700">{label}</label>
      )}
    </div>
  );
};

export default Radio;