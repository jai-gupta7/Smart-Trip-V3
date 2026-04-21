import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AlertTriangle, Edit, MapPin } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatDateTime } from '@/utils/formatters';

const TableShell = ({ children }) => (
  <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
    <div className="overflow-x-auto">{children}</div>
  </div>
);

const LocationCell = ({ location, onViewMap, withMapAction = false }) => (
  <div className="flex items-center gap-2 max-w-[220px]">
    <span className="truncate" title={location?.name}>
      {location?.name || 'N/A'}
    </span>
    {withMapAction && location ? (
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
        onClick={() => onViewMap(location)}
        title="View on map"
      >
        <MapPin className="w-3.5 h-3.5" />
      </Button>
    ) : null}
  </div>
);

const ContactCell = ({ contact }) => (
  <div className="flex flex-col min-w-[150px]">
    <span>{contact?.name || 'N/A'}</span>
    <span className="text-xs text-muted-foreground">{contact?.phone || 'N/A'}</span>
  </div>
);

const EditCell = ({ onClick }) => (
  <TableCell className="text-right">
    <Button variant="ghost" size="sm" onClick={onClick} className="hover:bg-muted">
      <Edit className="w-4 h-4 mr-1.5" />
      Edit
    </Button>
  </TableCell>
);

export const PotentialPickupsTable = ({ data, onViewMap, onEdit }) => (
  <TooltipProvider>
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pickup ID</TableHead>
            <TableHead>Pickup Date * Time</TableHead>
            <TableHead>Eway Bill Number</TableHead>
            <TableHead>Eway Bill Creation Date &amp; Time</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Customer Location</TableHead>
            <TableHead>POC Contact</TableHead>
            <TableHead>Expected Load</TableHead>
            <TableHead>Call Status</TableHead>
            <TableHead>PRQ Status</TableHead>
            <TableHead className="text-center">E-way Bill Count</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((pickup) => (
              <TableRow key={pickup.id}>
                <TableCell className="font-medium whitespace-nowrap">{pickup.pickupId}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(pickup.pickupDateTime)}</TableCell>
                <TableCell className="whitespace-nowrap">{pickup.ewayBillNumber}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(pickup.ewayBillCreatedAt)}</TableCell>
                <TableCell>{pickup.customerName}</TableCell>
                <TableCell>
                  <LocationCell location={pickup.customerLocation} onViewMap={onViewMap} withMapAction />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.poc} />
                </TableCell>
                <TableCell className="whitespace-nowrap">{pickup.expectedLoad}</TableCell>
                <TableCell className="text-muted-foreground min-w-[170px]">{pickup.callStatus}</TableCell>
                <TableCell>
                  <StatusBadge status={pickup.prqStatus} />
                </TableCell>
                <TableCell className="text-center">{pickup.ewayBillCount}</TableCell>
                <EditCell onClick={() => onEdit(pickup)} />
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                No potential pickups available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableShell>
  </TooltipProvider>
);

export const RequestedPickupsTable = ({ data, onEdit }) => (
  <TooltipProvider>
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PRQ ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Customer Address</TableHead>
            <TableHead>Contact Name &amp; No.</TableHead>
            <TableHead>Pickup Slot</TableHead>
            <TableHead>Est. Weight</TableHead>
            <TableHead>Load Type</TableHead>
            <TableHead>PRQ Mode</TableHead>
            <TableHead>Flag</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((pickup) => (
              <TableRow key={pickup.id}>
                <TableCell className="font-medium whitespace-nowrap">{pickup.prqId}</TableCell>
                <TableCell>{pickup.customer}</TableCell>
                <TableCell className="min-w-[180px]">{pickup.customerAddress?.name}</TableCell>
                <TableCell>
                  <ContactCell contact={pickup.contact} />
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(pickup.pickupSlot)}</TableCell>
                <TableCell className="whitespace-nowrap">{pickup.estimatedWeight}</TableCell>
                <TableCell>{pickup.loadType}</TableCell>
                <TableCell>{pickup.prqMode}</TableCell>
                <TableCell>
                  {pickup.yellowFlagReason ? (
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
                      <TooltipContent className="max-w-xs">{pickup.yellowFlagReason}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={pickup.status} />
                </TableCell>
                <EditCell onClick={() => onEdit(pickup)} />
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                No requested pickups available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableShell>
  </TooltipProvider>
);

export const FTLPickupsTable = ({
  data,
  vehicleSizeOptions,
  vehicleSourceOptions,
  onUpdate,
}) => (
  <TableShell>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PRQ ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Customer Address</TableHead>
          <TableHead>Contact Name &amp; No.</TableHead>
          <TableHead>Pickup Slot</TableHead>
          <TableHead>Select Vehicle Size</TableHead>
          <TableHead>POC Contact</TableHead>
          <TableHead>Requestor Name &amp; Contact Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Select Vehicle Source</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((pickup) => (
            <TableRow key={pickup.id}>
              <TableCell className="font-medium whitespace-nowrap">{pickup.prqId}</TableCell>
              <TableCell>{pickup.customer}</TableCell>
              <TableCell className="min-w-[180px]">{pickup.customerAddress}</TableCell>
              <TableCell>
                <ContactCell contact={pickup.contact} />
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDateTime(pickup.pickupSlot)}</TableCell>
              <TableCell className="min-w-[190px]">
                <Select value={pickup.vehicleSize} onValueChange={(value) => onUpdate(pickup.id, 'vehicleSize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleSizeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <ContactCell contact={pickup.pocContact} />
              </TableCell>
              <TableCell>
                <ContactCell contact={pickup.requestor} />
              </TableCell>
              <TableCell>
                <StatusBadge status={pickup.status} />
              </TableCell>
              <TableCell className="min-w-[220px]">
                <Select value={pickup.vehicleSource} onValueChange={(value) => onUpdate(pickup.id, 'vehicleSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleSourceOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
              No FTL pickups available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableShell>
);
