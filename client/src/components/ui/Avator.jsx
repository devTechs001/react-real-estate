import { FaUser } from 'react-icons/fa';
import clsx from 'clsx';

const Avatar = ({ src, alt, size = 'md', online = false }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx('rounded-full object-cover', sizes[size])}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full bg-gray-300 flex items-center justify-center',
            sizes[size]
          )}
        >
          <FaUser className="text-gray-600" />
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
      )}
    </div>
  );
};

export default Avatar;