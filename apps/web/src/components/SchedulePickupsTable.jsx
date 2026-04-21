
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { MapPin, ArrowUpDown, Edit } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDateTime } from '@/utils/formatters';

const SchedulePickupsTable = ({ data, onViewMap, onEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'slot', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!data) return [];
    const sortableItems = [...data];
    sortableItems.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle nested properties
      if (sortConfig.key === 'locationName') {
        aValue = a.location?.name;
        bValue = b.location?.name;
      } else if (sortConfig.key === 'pocName') {
        aValue = a.poc?.name;
        bValue = b.poc?.name;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [data, sortConfig]);

  const SortableHead = ({ label, sortKey }) => (
    <TableHead onClick={() => handleSort(sortKey)} className="cursor-pointer hover:bg-muted/50 transition-colors whitespace-nowrap group">
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Pickup ID" sortKey="pickupId" />
              <SortableHead label="Customer Name" sortKey="customerName" />
              <SortableHead label="Location" sortKey="locationName" />
              <SortableHead label="Slot" sortKey="slot" />
              <SortableHead label="Operator" sortKey="operatorName" />
              <SortableHead label="Vehicle" sortKey="vehicle" />
              <SortableHead label="Driver" sortKey="driver" />
              <SortableHead label="POC" sortKey="pocName" />
              <SortableHead label="Status" sortKey="status" />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length > 0 ? (
              sortedData.map((pickup) => (
                <TableRow key={pickup.id}>
                  <TableCell className="font-medium">{pickup.pickupId}</TableCell>
                  <TableCell>{pickup.customerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-[200px]">
                      <span className="truncate" title={pickup.location?.name}>
                        {pickup.location?.name}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
                        onClick={() => onViewMap(pickup.location)}
                        title="View on Map"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground whitespace-nowrap">
                    {formatDateTime(pickup.slot)}
                  </TableCell>
                  <TableCell>{pickup.operatorName}</TableCell>
                  <TableCell>
                    <span className="text-sm border bg-muted/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {pickup.vehicle}
                    </span>
                  </TableCell>
                  <TableCell>{pickup.driver}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{pickup.poc?.name}</span>
                      <span className="text-xs text-muted-foreground">{pickup.poc?.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={pickup.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(pickup)}
                      className="hover:bg-muted"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                  No pickups found for the selected filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SchedulePickupsTable;
