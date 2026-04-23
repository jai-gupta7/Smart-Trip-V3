
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BreadcrumbNav from '@/components/BreadcrumbNav';
import SchedulePickupsFilters from '@/components/SchedulePickupsFilters';
import StatusBadge from '@/components/StatusBadge';
import ActionButton from '@/components/ActionButton';
import LocationMapModal from '@/components/LocationMapModal';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAppointmentCNs, getRegularCNs } from '@/lib/dummyData';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Calendar, AlertTriangle, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LastMilePage = () => {
  const [filters, setFilters] = useState({
    status: 'All',
    timeRange: 'All Time',
    search: '',
    startTime: '',
    endTime: '',
  });

  const [activeTab, setActiveTab] = useState('appointments');
  const [mapLocation, setMapLocation] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const navigate = useNavigate();
  
  const appointmentCNsData = getAppointmentCNs();
  const regularCNsData = getRegularCNs();

  React.useEffect(() => {
    setFilters((prev) => ({ ...prev, status: 'All' }));
  }, [activeTab]);

  const applyFilters = (data, currentFilters) => {
    let filtered = [...data];

    if (currentFilters.status && currentFilters.status !== 'All') {
      filtered = filtered.filter((item) => item.status === currentFilters.status);
    }

    if (currentFilters.startTime) {
      const start = new Date(currentFilters.startTime).getTime();
      filtered = filtered.filter((item) => {
        const itemDate = item.appointmentDate;
        return itemDate ? new Date(itemDate).getTime() >= start : true;
      });
    }

    if (currentFilters.endTime) {
      const end = new Date(currentFilters.endTime).getTime();
      filtered = filtered.filter((item) => {
        const itemDate = item.appointmentDate;
        return itemDate ? new Date(itemDate).getTime() <= end : true;
      });
    }

    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      filtered = filtered.filter((item) => {
        const cn = item.cn || '';
        const cust = item.customer || '';
        const ref = item.referenceNo || '';
        const inv = item.invoices ? item.invoices.join(' ') : '';
        return cn.toLowerCase().includes(q) || 
               cust.toLowerCase().includes(q) ||
               ref.toLowerCase().includes(q) ||
               inv.toLowerCase().includes(q);
      });
    }

    return filtered;
  };

  const filteredAppointmentCNs = React.useMemo(() => applyFilters(appointmentCNsData, filters), [appointmentCNsData, filters]);
  const filteredRegularCNs = React.useMemo(() => applyFilters(regularCNsData, filters), [regularCNsData, filters]);

  const FlagCell = ({ reason }) => (
    reason ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-amber-500 transition-colors hover:bg-amber-500/10"
            aria-label="View flag reason"
          >
            <AlertTriangle className="w-4 h-4 fill-current" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{reason}</TooltipContent>
      </Tooltip>
    ) : (
      <span className="text-muted-foreground">-</span>
    )
  );

  const InvoiceCell = ({ invoices = [], count = 0 }) => (
    <div className="flex flex-col">
      <span className="font-medium">{count}</span>
      <span className="text-xs text-muted-foreground">{invoices.slice(0, 2).join(', ')}</span>
    </div>
  );

  const TableShell = ({ children }) => (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );

  const AddressCell = ({ address }) => (
    <div className="flex items-center gap-2 max-w-[260px]">
      <span className="truncate" title={address}>
        {address}
      </span>
      {address ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            setMapLocation(address);
            setIsMapOpen(true);
          }}
          className="h-6 w-6 rounded-full shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
          title="View on map"
          aria-label="View address on map"
        >
          <Map className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="om-container py-8">
        <BreadcrumbNav />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
          <TabsTrigger value="appointments">Appointments & Scheduled</TabsTrigger>
          <TabsTrigger value="regular">Regular CN Only</TabsTrigger>
          </TabsList>

          {activeTab === 'regular' ? (
            <ActionButton 
              label="Create Smart Trip" 
              icon={Map} 
              size="lg"
              onClick={() => navigate('/smart-trip-creation?source=last-mile&tripView=cn')}
            />
          ) : null}
        </div>

        <TabsContent value="appointments">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Appointment CNs</h3>
              <SchedulePickupsFilters 
                filters={filters} 
                onFilterChange={setFilters} 
                statusOptions={['Confirmed', 'Pending Confirmation', 'Rescheduled', 'Cancelled']}
              />
              <TableShell>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoices</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Customer Address</TableHead>
                      <TableHead>Boxes</TableHead>
                      <TableHead>Wt</TableHead>
                      <TableHead>Appointment Slot &amp; Date</TableHead>
                      <TableHead>Reference No</TableHead>
                      <TableHead>Flag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointmentCNs.slice(0, 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium whitespace-nowrap">{item.cn}</TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                        <TableCell><InvoiceCell invoices={item.invoices} count={item.invoiceCount} /></TableCell>
                        <TableCell>{item.customer}</TableCell>
                        <TableCell className="min-w-[220px]"><AddressCell address={item.customerAddress} /></TableCell>
                        <TableCell>{item.boxes}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.weight}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span>{item.appointmentSlot}</span>
                              <span className="text-xs text-muted-foreground">{item.appointmentDate}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{item.referenceNo}</TableCell>
                        <TableCell><FlagCell reason={item.yellowFlagReason} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableShell>
          </div>
        </TabsContent>

        <TabsContent value="regular">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">Regular CN Only</h3>
              <SchedulePickupsFilters 
                filters={filters} 
                onFilterChange={setFilters} 
                statusOptions={['Confirmed', 'Pending Confirmation', 'Rescheduled', 'Cancelled']}
              />
              <TableShell>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CN</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invoices</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Customer Address</TableHead>
                      <TableHead>Boxes</TableHead>
                      <TableHead>Wt</TableHead>
                      <TableHead>Flag</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegularCNs.slice(0, 10).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium whitespace-nowrap">{item.cn}</TableCell>
                        <TableCell><StatusBadge status={item.status} /></TableCell>
                        <TableCell><InvoiceCell invoices={item.invoices} count={item.invoiceCount} /></TableCell>
                        <TableCell>{item.customer}</TableCell>
                        <TableCell className="min-w-[220px]"><AddressCell address={item.customerAddress} /></TableCell>
                        <TableCell>{item.boxes}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.weight}</TableCell>
                        <TableCell><FlagCell reason={item.yellowFlagReason} /></TableCell>
                        <TableCell>{item.priority}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableShell>
          </div>
        </TabsContent>
      </Tabs>

      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        location={mapLocation}
      />
      </div>
    </TooltipProvider>
  );
};

export default LastMilePage;
