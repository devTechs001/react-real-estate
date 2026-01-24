import React, { useState } from 'react';

const UserSwitchToggle = ({ onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState('admin');

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
    { value: 'agent', label: 'Agent' }
  ];

  const handleChange = (role) => {
    setSelectedRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
      <span className="text-gray-700 font-medium">View As:</span>
      <div className="flex space-x-2">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => handleChange(role.value)}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedRole === role.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSwitchToggle;