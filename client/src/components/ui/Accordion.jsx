import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-left">{title}</span>
        <FaChevronDown
          className={clsx(
            'transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Accordion = ({ items, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleToggle = (index) => {
    if (allowMultiple) {
      setOpenIndexes((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndexes((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndexes.includes(index)}
          onClick={() => handleToggle(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;