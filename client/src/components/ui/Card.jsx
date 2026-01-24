import clsx from 'clsx';

const Card = ({
  children,
  className,
  hover = false,
  padding = true,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'card',
        hover && 'hover-lift',
        !padding && 'p-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
