import { FaEye, FaHeart, FaShareAlt, FaClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const PropertyStats = ({ property }) => {
  const stats = [
    {
      icon: FaEye,
      label: 'Views',
      value: property.views || 0,
      color: 'text-blue-600',
    },
    {
      icon: FaHeart,
      label: 'Favorites',
      value: property.favoritesCount || 0,
      color: 'text-red-600',
    },
    {
      icon: FaShareAlt,
      label: 'Shares',
      value: property.sharesCount || 0,
      color: 'text-green-600',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Property Stats</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <stat.icon className={`text-3xl ${stat.color} mx-auto mb-2`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaClock />
          <span>
            Listed{' '}
            {formatDistanceToNow(new Date(property.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        {property.updatedAt !== property.createdAt && (
          <div className="flex items-center gap-2">
            <FaClock />
            <span>
              Updated{' '}
              {formatDistanceToNow(new Date(property.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyStats;