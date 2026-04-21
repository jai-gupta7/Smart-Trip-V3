
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant, formatStatusLabel } from '@/utils/formatters';

const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null;

  const variant = getStatusVariant(status);
  const label = formatStatusLabel(status);

  const variantClasses = {
    success: 'om-status-confirmed',
    warning: 'om-status-pending',
    destructive: 'om-status-issue',
    default: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Badge
      variant="outline"
      className={`${variantClasses[variant]} font-medium text-xs px-2.5 py-0.5 ${className}`}
    >
      {label}
    </Badge>
  );
};

export default StatusBadge;
