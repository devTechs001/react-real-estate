const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className={`loader ${sizes[size]}`}></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <div className={`loader ${sizes[size]}`}></div>
    </div>
  );
};

export default Loader;