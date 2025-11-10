import { formatDistanceToNow, format, isToday, isYesterday, differenceInDays } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatTimeAgo = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatRelativeDate = (date) => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'HH:mm')}`;
  }
  
  const days = differenceInDays(new Date(), dateObj);
  
  if (days < 7) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }
  
  return format(dateObj, 'MMM dd, yyyy');
};

export const isExpired = (date) => {
  return new Date(date) < new Date();
};

export const getDaysUntil = (date) => {
  return differenceInDays(new Date(date), new Date());
};