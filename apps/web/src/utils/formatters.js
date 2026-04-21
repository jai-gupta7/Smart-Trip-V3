
// Utility functions for formatting dates, times, weights, volumes, and status labels

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

export const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('en-IN', options);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
};

export const formatWeight = (weight) => {
  if (!weight) return 'N/A';
  if (typeof weight === 'string') return weight;
  return `${weight.toLocaleString('en-IN')} kg`;
};

export const formatVolume = (volume) => {
  if (!volume) return 'N/A';
  if (typeof volume === 'string') return volume;
  return `${volume.toFixed(1)} m³`;
};

export const formatStatusLabel = (status) => {
  if (!status) return 'Unknown';
  return status
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  return phone;
};

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const getStatusVariant = (status) => {
  if (!status) return 'default';
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('confirmed') || statusLower.includes('completed') || statusLower.includes('delivered') || statusLower.includes('resolved')) {
    return 'success';
  }
  
  if (statusLower.includes('pending') || statusLower.includes('scheduled') || statusLower.includes('in-progress') || statusLower.includes('under review')) {
    return 'warning';
  }
  
  if (statusLower.includes('failed') || statusLower.includes('issue') || statusLower.includes('flagged') || statusLower.includes('cancelled')) {
    return 'destructive';
  }
  
  return 'default';
};

export const calculateProgress = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatTimeWindow = (window) => {
  if (!window) return 'Flexible';
  if (window === 'Flexible') return window;
  return window;
};

export const getRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 0) return 'Overdue';
  if (diffMins < 60) return `In ${diffMins} min`;
  if (diffHours < 24) return `In ${diffHours} hr`;
  return `In ${diffDays} days`;
};
