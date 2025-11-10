import clsx from 'clsx';

const Switch = ({ checked, onChange, label, disabled = false }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div
          className={clsx(
            'block w-14 h-8 rounded-full transition-colors',
            checked ? 'bg-primary-600' : 'bg-gray-300',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
        <div
          className={clsx(
            'absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform',
            checked && 'transform translate-x-6'
          )}
        />
      </div>
      {label && <span className="ml-3 text-gray-700">{label}</span>}
    </label>
  );
};

export default Switch;