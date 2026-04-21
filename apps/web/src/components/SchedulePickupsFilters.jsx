
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Filter } from 'lucide-react';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  subWeeks, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  subMonths 
} from 'date-fns';

const SchedulePickupsFilters = ({ filters, onFilterChange }) => {
  
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (val) => {
    onFilterChange({ ...filters, status: val });
  };

  const handleTimeRangeChange = (val) => {
    let startTime = '';
    let endTime = '';
    
    // Using the system's current date context (2026-04-21) as the reference point
    const referenceDate = new Date('2026-04-21T12:00:00Z');

    switch (val) {
      case 'Today':
        startTime = startOfDay(referenceDate).toISOString();
        endTime = endOfDay(referenceDate).toISOString();
        break;
      case 'This Week':
        startTime = startOfWeek(referenceDate).toISOString();
        endTime = endOfWeek(referenceDate).toISOString();
        break;
      case 'Last Week':
        const lastWeek = subWeeks(referenceDate, 1);
        startTime = startOfWeek(lastWeek).toISOString();
        endTime = endOfWeek(lastWeek).toISOString();
        break;
      case 'Last 15 Days':
        startTime = startOfDay(subDays(referenceDate, 15)).toISOString();
        endTime = endOfDay(referenceDate).toISOString();
        break;
      case 'This Month':
        startTime = startOfMonth(referenceDate).toISOString();
        endTime = endOfMonth(referenceDate).toISOString();
        break;
      case 'Last Month':
        const lastMonth = subMonths(referenceDate, 1);
        startTime = startOfMonth(lastMonth).toISOString();
        endTime = endOfMonth(lastMonth).toISOString();
        break;
      case 'All Time':
      default:
        startTime = '';
        endTime = '';
        break;
    }

    onFilterChange({ ...filters, timeRange: val, startTime, endTime });
  };

  return (
    <div className="bg-card p-4 rounded-xl border shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
      
      {/* Search Filter */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by ID, Customer, Driver, Vehicle, POC..." 
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="pl-9 w-full"
        />
      </div>

      {/* Time Range Filter */}
      <div className="w-full md:w-48 shrink-0">
        <Select 
          value={filters.timeRange || 'All Time'} 
          onValueChange={handleTimeRangeChange}
        >
          <SelectTrigger className="w-full">
            <Calendar className="w-4 h-4 mr-2 opacity-50" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Today">Today</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="Last Week">Last Week</SelectItem>
            <SelectItem value="Last 15 Days">Last 15 Days</SelectItem>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="Last Month">Last Month</SelectItem>
            <SelectItem value="All Time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-48 shrink-0">
        <Select 
          value={filters.status || 'All'} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-full">
            <Filter className="w-4 h-4 mr-2 opacity-50" />
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};

export default SchedulePickupsFilters;
