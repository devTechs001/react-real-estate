import { useState } from 'react';
import clsx from 'clsx';

const Tabs = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div>
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={clsx(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === index
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default Tabs;