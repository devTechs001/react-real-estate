import React, { useState } from 'react';

const AdminUserImpersonation = () => {
  const [impersonatedUser, setImpersonatedUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'buyer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'seller' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'agent' }
  ]);

  const handleSelectUser = (user) => {
    setImpersonatedUser(user);
  };

  const endImpersonation = () => {
    setImpersonatedUser(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">User Impersonation</h3>
      
      {!impersonatedUser ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select User to Impersonate:
          </label>
          <select
            onChange={(e) => {
              const user = users.find(u => u.id === parseInt(e.target.value));
              handleSelectUser(user);
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Choose a user...</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email}) - {user.role}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <p className="font-medium">Currently impersonating: {impersonatedUser.name}</p>
            <p className="text-sm text-gray-600">{impersonatedUser.email} - {impersonatedUser.role}</p>
          </div>
          <button
            onClick={endImpersonation}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            End Impersonation
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserImpersonation;