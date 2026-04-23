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
import { AlertTriangle, Edit, Info, MapPin } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { formatDateTime } from '@/utils/formatters';

const TableShell = ({ children }) => (
  <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
    <div className="overflow-x-auto">{children}</div>
  </div>
);

const getLocationLabel = (location) => {
  if (!location) return 'N/A';
  if (typeof location === 'string') return location;
  return location?.name || location?.label || 'N/A';
};

const LocationCell = ({ location, onViewMap, withMapAction = false }) => (
  <div className="flex items-center gap-2 max-w-[220px]">
    <span className="truncate" title={getLocationLabel(location)}>
      {getLocationLabel(location)}
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

const ftlStatusStageMap = {
  'Sourcing in Progress': 'placement',
  'Vehicle Allocated': 'placement',
  'Vehicle Reported': 'placement',
  'Loading in Progress': 'placement',
  Dispatched: 'intransit',
  'In Transit': 'intransit',
  'Reached Destination': 'delivery',
  Delivered: 'delivery',
  'POD Received': 'delivery',
};

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
            <TableHead>Operator Contact</TableHead>
            <TableHead>Driver Contact</TableHead>
            <TableHead>Expected Load</TableHead>
            <TableHead>Call Status</TableHead>
            <TableHead>PRQ Status</TableHead>
            <TableHead>Flag</TableHead>
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
                <TableCell>
                  <ContactCell contact={pickup.operatorContact} />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.driverContact} />
                </TableCell>
                <TableCell className="whitespace-nowrap">{pickup.expectedLoad}</TableCell>
                <TableCell className="text-muted-foreground min-w-[170px]">{pickup.callStatus}</TableCell>
                <TableCell>
                  <StatusBadge status={pickup.prqStatus} />
                </TableCell>
                <TableCell>
                  <FlagCell reason={pickup.yellowFlagReason} />
                </TableCell>
                <TableCell className="text-center">{pickup.ewayBillCount}</TableCell>
                <EditCell onClick={() => onEdit(pickup)} />
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={15} className="h-24 text-center text-muted-foreground">
                No potential pickups available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableShell>
  </TooltipProvider>
);

export const RequestedPickupsTable = ({ data, onEdit, onViewMap }) => (
  <TooltipProvider>
    <TableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PRQ ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Customer Address</TableHead>
            <TableHead>Contact Name &amp; No.</TableHead>
            <TableHead>Operator Contact</TableHead>
            <TableHead>Driver Contact</TableHead>
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
                <TableCell>
                  <LocationCell location={pickup.customerAddress} onViewMap={onViewMap} withMapAction />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.contact} />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.operatorContact} />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.driverContact} />
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(pickup.pickupSlot)}</TableCell>
                <TableCell className="whitespace-nowrap">{pickup.estimatedWeight}</TableCell>
                <TableCell>{pickup.loadType}</TableCell>
                <TableCell>{pickup.prqMode}</TableCell>
                <TableCell>
                  <FlagCell reason={pickup.yellowFlagReason} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={pickup.status} />
                </TableCell>
                <EditCell onClick={() => onEdit(pickup)} />
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={13} className="h-24 text-center text-muted-foreground">
                No regular pickups available.
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
  statusOptions,
  onUpdate,
  onViewMap,
  onTriggerMarketSourcing,
  onViewProcurer,
}) => (
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
            <TableHead>Requested Vehicle</TableHead>
            <TableHead>Select Vehicle Source</TableHead>
            <TableHead>POC Contact</TableHead>
            <TableHead>Requestor Name &amp; Contact Number</TableHead>
            <TableHead>Operator Contact</TableHead>
            <TableHead>Driver Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Flag</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((pickup) => {
              const ftlStage = ftlStatusStageMap[pickup.status] || 'placement';
              const showViewDetailsAction = ftlStage === 'placement';
              const showRouteMapAction = ftlStage === 'intransit' || ftlStage === 'delivery';
              const showLiveTrackAction = pickup.status === 'Vehicle Allocated';

              return (
              <TableRow key={pickup.id}>
                <TableCell className="font-medium whitespace-nowrap">{pickup.prqId}</TableCell>
                <TableCell>{pickup.customer}</TableCell>
                <TableCell>
                  <LocationCell location={pickup.customerAddress} onViewMap={onViewMap} withMapAction />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.contact} />
                </TableCell>
                <TableCell className="whitespace-nowrap">{formatDateTime(pickup.pickupSlot)}</TableCell>
                <TableCell className="whitespace-nowrap">{pickup.requestedVehicleDetail}</TableCell>
                <TableCell className="min-w-[220px]">
                  <div className="flex flex-col">
                    <Select
                      value={pickup.selectedVehicleSource || undefined}
                      onValueChange={(value) => onUpdate(pickup.id, 'selectedVehicleSource', value)}
                      disabled={!pickup.recommendedVehicleAvailable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="No vehicle available" />
                      </SelectTrigger>
                      <SelectContent>
                        {pickup.vehicleSourceOptions?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">{pickup.recommendedVehicleSource}</span>
                    {pickup.marketSourcingRequested ? (
                      <span className="text-xs text-muted-foreground">
                        Reason: {pickup.marketSourcingReason}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.pocContact} />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.requestor} />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.operatorContact} />
                </TableCell>
                <TableCell>
                  <ContactCell contact={pickup.driverContact} />
                </TableCell>
                <TableCell className="min-w-[190px]">
                  <Select value={pickup.status} onValueChange={(value) => onUpdate(pickup.id, 'status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <FlagCell reason={pickup.yellowFlagReason} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-2">
                    {showViewDetailsAction ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProcurer(pickup)}
                        className="whitespace-nowrap"
                      >
                        <Info className="mr-1.5 h-4 w-4" />
                        View Details
                      </Button>
                    ) : null}

                    {showRouteMapAction || showLiveTrackAction ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewMap(pickup.customerAddress)}
                        className="whitespace-nowrap"
                      >
                        <MapPin className="mr-1.5 h-4 w-4" />
                        {showLiveTrackAction ? 'Live Track' : 'View Map'}
                      </Button>
                    ) : null}

                    {!pickup.recommendedVehicleAvailable && showViewDetailsAction ? (
                      pickup.marketSourcingRequested ? (
                        <span className="text-sm text-muted-foreground">Request sent</span>
                      ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTriggerMarketSourcing(pickup)}
                        className="whitespace-nowrap"
                      >
                        Trigger Market Sourcing
                      </Button>
                      )
                    ) : null}

                    {pickup.recommendedVehicleAvailable && showViewDetailsAction ? (
                      <span className="text-sm text-muted-foreground">Auto selected</span>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={14} className="h-24 text-center text-muted-foreground">
                No FTL pickups available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableShell>
  </TooltipProvider>
);
