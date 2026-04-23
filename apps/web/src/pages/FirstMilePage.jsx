import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import MapView from '@/components/MapView';
import {
  ftlStatusOptions,
  getFTLPickups,
  getPotentialPickups,
  getRequestedPickups,
  getSchedulePickups,
  schedulePickupsData,
} from '@/lib/dummyData';
import { toast } from 'sonner';

import SchedulePickupsFilters from '@/components/SchedulePickupsFilters';
import SchedulePickupsTable from '@/components/SchedulePickupsTable';
import LocationMapModal from '@/components/LocationMapModal';
import SchedulePickupsEditModal from '@/components/SchedulePickupsEditModal';
import FirstMilePickupEditModal from '@/components/FirstMilePickupEditModal';
import {
  FTLPickupsTable,
  PotentialPickupsTable,
  RequestedPickupsTable,
} from '@/components/FirstMilePickupTables';
import { Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const extractVehicleNumber = (vehicleSource) =>
  vehicleSource?.match(/[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}/)?.[0] || 'Awaiting vehicle allocation';

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

const ftlRouteColors = ['#2563eb', '#f97316', '#22c55e', '#ef4444', '#8b5cf6'];

const ftlRouteHubs = [
  { id: 'ftl-hub-pune', type: 'Pickup', name: 'Pune FTL Hub', address: 'Pune FTL Hub', lat: 18.5204, lng: 73.8567 },
  { id: 'ftl-hub-mumbai', type: 'Pickup', name: 'Mumbai FTL Hub', address: 'Mumbai FTL Hub', lat: 19.076, lng: 72.8777 },
  { id: 'ftl-hub-nagpur', type: 'Pickup', name: 'Nagpur FTL Hub', address: 'Nagpur FTL Hub', lat: 21.1458, lng: 79.0882 },
  { id: 'ftl-hub-ahmedabad', type: 'Pickup', name: 'Ahmedabad FTL Hub', address: 'Ahmedabad FTL Hub', lat: 23.0225, lng: 72.5714 },
];

const buildFtlRouteTrace = (pickup, index, stage) => {
  const hub = ftlRouteHubs[index % ftlRouteHubs.length];
  const destinationLabel =
    typeof pickup.customerAddress === 'string'
      ? pickup.customerAddress
      : pickup.customerAddress?.name || pickup.customer;
  const destination = {
    id: `${pickup.id}-destination`,
    type: 'Drop',
    name: destinationLabel,
    address: destinationLabel,
    customerAddress: pickup.customerAddress,
  };
  const checkpoint = {
    id: `${pickup.id}-checkpoint`,
    type: 'Waypoint',
    name: `${pickup.vehicleNumber || pickup.allocatedVehicleNumber || pickup.prqId} checkpoint`,
    address: `${destinationLabel} approach corridor`,
  };

  return {
    id: pickup.id,
    color: ftlRouteColors[index % ftlRouteColors.length],
    plannedLocations: [hub, checkpoint, destination],
    takenLocations: stage === 'delivery' ? [hub, checkpoint, destination] : [hub, checkpoint],
  };
};

const CURRENT_EDITOR = 'Jai Gupta';

const fallbackFtlProcurers = [
  { name: 'Aman Verma', phone: '+91 98770 61001', email: 'aman.verma@omlogistics.example', employeeId: 'OM-PROC-1041' },
  { name: 'Priya Nair', phone: '+91 98770 61002', email: 'priya.nair@omlogistics.example', employeeId: 'OM-PROC-1088' },
  { name: 'Rohit Sinha', phone: '+91 98770 61003', email: 'rohit.sinha@omlogistics.example', employeeId: 'OM-PROC-1126' },
  { name: 'Kavya Menon', phone: '+91 98770 61004', email: 'kavya.menon@omlogistics.example', employeeId: 'OM-PROC-1174' },
];

const getFallbackFtlProcurer = (pickupId = '') => {
  const numericPart = Number(String(pickupId).replace(/\D/g, ''));
  const fallbackIndex = Number.isFinite(numericPart) ? numericPart % fallbackFtlProcurers.length : 0;
  return fallbackFtlProcurers[fallbackIndex];
};

const fallbackContractors = [
  { name: 'TransCorp Logistics', phone: '+91 98765 43210', email: 'contact@transcorp.in', type: 'Fleet Owner' },
  { name: 'Speedway Carriers', phone: '+91 98765 43211', email: 'ops@speedway.in', type: 'Broker' },
];

const getFallbackContractor = (pickupId = '') => {
  const numericPart = Number(String(pickupId).replace(/\D/g, ''));
  const fallbackIndex = Number.isFinite(numericPart) ? numericPart % fallbackContractors.length : 0;
  return fallbackContractors[fallbackIndex];
};

const getValueFromPath = (source, path) =>
  path.split('.').reduce((current, key) => current?.[key], source);

const buildEditedValues = (currentRecord, nextRecord, fieldMap) =>
  fieldMap
    .filter(({ path }) => getValueFromPath(currentRecord, path) !== getValueFromPath(nextRecord, path))
    .map(({ label, path }) => `${label}: ${getValueFromPath(nextRecord, path) || '-'}`);

const getNextSubPrqSequence = (rows, mainPickupId) =>
  rows
    .filter((row) => row.parentPickupId === mainPickupId && row.prqMode === 'Sub-Scheduled')
    .reduce((maxValue, row) => Math.max(maxValue, Number(row.subPrqSequence || 0)), 0) + 1;

const buildSubPrqRow = (mainPickup, additionalRequirement, sequence, existingSubRow) => ({
  ...(existingSubRow || {}),
  ...mainPickup,
  id: existingSubRow?.id || `${mainPickup.id}-sub-${sequence}`,
  pickupId: `${mainPickup.parentPickupId || mainPickup.pickupId}S${sequence}`,
  parentPickupId: mainPickup.parentPickupId || mainPickup.pickupId,
  subPrqSequence: sequence,
  prqMode: 'Sub-Scheduled',
  selectedVehicleId: '',
  vehicle: additionalRequirement.label,
  driver: 'Awaiting allocation',
  driverContact: { name: 'Awaiting allocation', phone: 'To be assigned' },
  transporterDetails: null,
  liveVehicleRoute: null,
  etaToBranch: additionalRequirement.etaToBranch,
  branchLocation: mainPickup.branchLocation || null,
  additionalVehicleId: '',
  additionalVehicleDetails: null,
  additionalVehicleRequirement: additionalRequirement.requirement,
  subPrqId: '',
  generatedSubPrqId: '',
  marketVehicleRequest: null,
  editCount: existingSubRow?.editCount || 0,
});

const FirstMilePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: 'All',
    timeRange: 'All Time',
    search: '',
    startTime: '',
    endTime: '',
  });

  const [scheduleData, setScheduleData] = useState(() => getSchedulePickups());
  const [potentialData, setPotentialData] = useState(() => getPotentialPickups());
  const [requestedData, setRequestedData] = useState(() => getRequestedPickups());
  const [ftlData, setFtlData] = useState(() => getFTLPickups());

  const [mapLocation, setMapLocation] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [editingPickup, setEditingPickup] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editingFirstMilePickup, setEditingFirstMilePickup] = useState(null);
  const [editingFirstMileType, setEditingFirstMileType] = useState('potential');
  const [isFirstMileEditOpen, setIsFirstMileEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [regularPickupTab, setRegularPickupTab] = useState('confirmed');
  const [marketSourcingPickup, setMarketSourcingPickup] = useState(null);
  const [marketSourcingReason, setMarketSourcingReason] = useState('');
  const [procurerInfoPickup, setProcurerInfoPickup] = useState(null);
  const [ftlStageFilter, setFtlStageFilter] = useState('placement');

  useEffect(() => {
    setFilters(prev => ({ ...prev, status: 'All' }));
  }, [activeTab, regularPickupTab]);

  const applyFilters = (data, currentFilters) => {
    let filtered = [...data];

    if (currentFilters.status && currentFilters.status !== 'All') {
      filtered = filtered.filter((item) => {
        const itemStatus = item.status || item.prqStatus;
        return itemStatus === currentFilters.status;
      });
    }

    if (currentFilters.startTime) {
      const start = new Date(currentFilters.startTime).getTime();
      filtered = filtered.filter((item) => {
        const itemDate = item.slot || item.pickupDateTime || item.pickupSlot;
        return itemDate ? new Date(itemDate).getTime() >= start : true;
      });
    }

    if (currentFilters.endTime) {
      const end = new Date(currentFilters.endTime).getTime();
      filtered = filtered.filter((item) => {
        const itemDate = item.slot || item.pickupDateTime || item.pickupSlot;
        return itemDate ? new Date(itemDate).getTime() <= end : true;
      });
    }

    if (currentFilters.search) {
      const q = currentFilters.search.toLowerCase();
      filtered = filtered.filter((item) => {
        const cust = item.customerName || item.customer || '';
        const id = item.id || item.pickupId || item.prqId || '';
        const driver = item.driver || '';
        const vehicle = item.vehicle || item.vehicleNumber || item.allocatedVehicleNumber || '';
        const poc = item.poc?.name || item.contact?.name || item.pocContact?.name || '';
        return cust.toLowerCase().includes(q) || 
               id.toLowerCase().includes(q) || 
               driver.toLowerCase().includes(q) ||
               vehicle.toLowerCase().includes(q) ||
               poc.toLowerCase().includes(q);
      });
    }

    return filtered;
  };

  const filteredScheduleData = React.useMemo(() => applyFilters(scheduleData, filters), [scheduleData, filters]);
  const filteredPotentialData = React.useMemo(() => applyFilters(potentialData, filters), [potentialData, filters]);
  const filteredRequestedData = React.useMemo(() => applyFilters(requestedData, filters), [requestedData, filters]);
  const filteredFtlDataUnstaged = React.useMemo(() => applyFilters(ftlData, filters), [ftlData, filters]);

  const handleViewMap = (location) => {
    setMapLocation(location);
    setIsMapOpen(true);
  };

  const handleEditPickup = (pickup) => {
    setEditingPickup(pickup);
    setIsEditOpen(true);
  };

  const handleSavePickup = (updatedPickup) => {
    setScheduleData((prevData) => {
      const currentPickup = prevData.find((pickup) => pickup.id === updatedPickup.id) || updatedPickup;
      const nextEditCount = Number(currentPickup.editCount || 0) + 1;
      const editedValues = buildEditedValues(currentPickup, updatedPickup, [
        { label: 'Operator', path: 'operatorName' },
        { label: 'Vehicle', path: 'vehicle' },
        { label: 'Driver', path: 'driver' },
        { label: 'POC Name', path: 'poc.name' },
        { label: 'POC Phone', path: 'poc.phone' },
      ]);
      const nextPickup = {
        ...updatedPickup,
        editCount: nextEditCount,
        lastEditedBy: CURRENT_EDITOR,
        lastEditedAt: new Date().toISOString(),
        editedValues: editedValues.length ? editedValues : currentPickup.editedValues || [],
      };

      const nextData = prevData.map((pickup) => (pickup.id === nextPickup.id ? nextPickup : pickup));
      const baseMainPickupId = nextPickup.parentPickupId || nextPickup.pickupId;
      const existingSiblingSubRows = nextData.filter(
        (pickup) => pickup.parentPickupId === baseMainPickupId && pickup.id !== nextPickup.id
      );

      let mergedData = nextData;

      if (nextPickup.additionalVehicleDetails) {
        const explicitSequence = Number((nextPickup.generatedSubPrqId || '').split('S').pop());
        const sequence =
          Number.isFinite(explicitSequence) && explicitSequence > 0
            ? explicitSequence
            : getNextSubPrqSequence(nextData, baseMainPickupId);
        const existingSubRow = existingSiblingSubRows.find((pickup) => pickup.subPrqSequence === sequence);
        const subPrqRow = buildSubPrqRow(nextPickup, nextPickup.additionalVehicleDetails, sequence, existingSubRow);

        mergedData = mergedData
          .filter((pickup) => pickup.id !== subPrqRow.id)
          .concat(subPrqRow)
          .sort((first, second) => new Date(first.slot).getTime() - new Date(second.slot).getTime());
      } else if (nextPickup.prqMode !== 'Sub-Scheduled') {
        mergedData = mergedData.filter((pickup) => pickup.parentPickupId !== baseMainPickupId);
      }

      schedulePickupsData.length = 0;
      schedulePickupsData.push(...mergedData);

      if (nextEditCount > 3) {
        toast.warning(`PRQ ${nextPickup.pickupId} has been edited more than 3 times.`);
      }

      toast.success(`Pickup ${nextPickup.pickupId} updated successfully`);
      return mergedData;
    });
  };

  const openFirstMileEdit = (type, pickup) => {
    setEditingFirstMileType(type);
    setEditingFirstMilePickup(pickup);
    setIsFirstMileEditOpen(true);
  };

  const handleSaveFirstMilePickup = (updatedPickup) => {
    if (editingFirstMileType === 'potential') {
      setPotentialData((prevData) =>
        prevData.map((pickup) =>
          pickup.id === updatedPickup.id
            ? {
                ...updatedPickup,
                lastEditedBy: CURRENT_EDITOR,
                lastEditedAt: new Date().toISOString(),
                editedValues: buildEditedValues(pickup, updatedPickup, [
                  { label: 'Status', path: 'prqStatus' },
                  { label: 'Pickup Date & Time', path: 'pickupDateTime' },
                  { label: 'Customer Location', path: 'customerLocation.name' },
                  { label: 'POC Name', path: 'poc.name' },
                  { label: 'POC Phone', path: 'poc.phone' },
                ]),
              }
            : pickup
        )
      );
      toast.success(`Potential pickup ${updatedPickup.pickupId} updated successfully`);
      return;
    }

    setRequestedData((prevData) =>
      prevData.map((pickup) =>
        pickup.id === updatedPickup.id
          ? {
              ...updatedPickup,
              lastEditedBy: CURRENT_EDITOR,
              lastEditedAt: new Date().toISOString(),
                editedValues: buildEditedValues(pickup, updatedPickup, [
                  { label: 'Status', path: 'status' },
                  { label: 'Pickup Slot', path: 'pickupSlot' },
                  { label: 'Customer Address', path: 'customerAddress.name' },
                  { label: 'POC Name', path: 'contact.name' },
                  { label: 'POC Phone', path: 'contact.phone' },
                  { label: 'Operator', path: 'operatorName' },
                  { label: 'Trip Assignment', path: 'assignedTripId' },
                ]),
              }
            : pickup
        )
    );
    toast.success(`Regular pickup ${updatedPickup.prqId} updated successfully`);
  };

  const handleUpdateFTL = (pickupId, field, value) => {
    setFtlData((prevData) =>
      prevData.map((pickup) => {
        if (pickup.id !== pickupId) {
          return pickup;
        }

        const nextPickup = { ...pickup };

        if (field === 'status') {
          nextPickup.status = value;
        }

        if (field === 'selectedVehicleSource') {
          nextPickup.selectedVehicleSource = value;
          nextPickup.allocatedVehicleNumber = extractVehicleNumber(value);
          nextPickup.recommendedVehicleSource = 'Auto selected';
        }

        return nextPickup;
      })
    );
  };

  const handleOpenMarketSourcing = (pickup) => {
    setMarketSourcingPickup(pickup);
    setMarketSourcingReason(pickup.marketSourcingReason || '');
  };

  const handleOpenProcurerInfo = (pickup) => {
    setProcurerInfoPickup({
      ...pickup,
      procurer: pickup.procurer !== undefined ? pickup.procurer : getFallbackFtlProcurer(pickup.prqId || pickup.id),
      contractor: pickup.contractor !== undefined ? pickup.contractor : getFallbackContractor(pickup.prqId || pickup.id),
    });
  };

  const handleCloseMarketSourcing = () => {
    setMarketSourcingPickup(null);
    setMarketSourcingReason('');
  };

  const handleSubmitMarketSourcing = () => {
    const trimmedReason = marketSourcingReason.trim();

    if (!marketSourcingPickup || !trimmedReason) {
      toast.error('Please provide a reason for market sourcing.');
      return;
    }

    setFtlData((prevData) =>
      prevData.map((pickup) => {
        if (pickup.id !== marketSourcingPickup.id) {
          return pickup;
        }

        return {
          ...pickup,
          marketSourcingRequested: true,
          marketSourcingReason: trimmedReason,
          recommendedVehicleSource: 'Market sourcing requested',
          allocatedVehicleNumber: 'Awaiting market vehicle',
          status: 'Sourcing in Progress',
        };
      })
    );

    toast.success(`Market sourcing request raised for ${marketSourcingPickup.prqId}.`);
    handleCloseMarketSourcing();
  };

  const ftlFilterCounts = {
    placement: filteredFtlDataUnstaged.filter((pickup) => ftlStatusStageMap[pickup.status] === 'placement').length,
    intransit: filteredFtlDataUnstaged.filter((pickup) => ftlStatusStageMap[pickup.status] === 'intransit').length,
    delivery: filteredFtlDataUnstaged.filter((pickup) => ftlStatusStageMap[pickup.status] === 'delivery').length,
  };

  const filteredFtlData = filteredFtlDataUnstaged.filter((pickup) => ftlStatusStageMap[pickup.status] === ftlStageFilter);
  const showFtlMapPanel = ftlStageFilter === 'intransit' || ftlStageFilter === 'delivery';
  const ftlMapRoutes = filteredFtlData.map((pickup, index) =>
    buildFtlRouteTrace(pickup, index, ftlStageFilter)
  );

  return (
    <div className="om-container py-8">
      <BreadcrumbNav />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
            <TabsTrigger value="schedule">Schedule Pickups</TabsTrigger>
            <TabsTrigger value="requested">Regular Pickup</TabsTrigger>
            <TabsTrigger value="ftl">FTL Pickups</TabsTrigger>
          </TabsList>

          {activeTab === 'requested' && regularPickupTab === 'confirmed' ? (
            <Button
              onClick={() => navigate('/smart-trip-creation?source=first-mile&tripView=prq')}
              className="shrink-0"
            >
              <Map className="w-4 h-4 mr-2" />
              Smart Trip Creation
            </Button>
          ) : null}
        </div>

        <TabsContent value="schedule" className="space-y-4 outline-none">
          <SchedulePickupsFilters 
            filters={filters} 
            onFilterChange={setFilters} 
            statusOptions={['Confirmed', 'Pending', 'Cancelled']}
          />

          <SchedulePickupsTable
            data={filteredScheduleData}
            onViewMap={handleViewMap}
            onEdit={handleEditPickup}
          />
        </TabsContent>

        <TabsContent value="requested" className="outline-none">
          <Tabs value={regularPickupTab} onValueChange={setRegularPickupTab} className="w-full">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="potential">Potential</TabsTrigger>
              </TabsList>
            </div>

            <div className="mb-4">
              <SchedulePickupsFilters 
                filters={filters} 
                onFilterChange={setFilters} 
                statusOptions={['Confirmed', 'Rescheduled', 'Cancelled']}
              />
            </div>

            <TabsContent value="confirmed" className="outline-none">
              <RequestedPickupsTable
                data={filteredRequestedData}
                onViewMap={handleViewMap}
                onEdit={(pickup) => openFirstMileEdit('requested', pickup)}
              />
            </TabsContent>

            <TabsContent value="potential" className="outline-none">
              <PotentialPickupsTable
                data={filteredPotentialData}
                onViewMap={handleViewMap}
                onEdit={(pickup) => openFirstMileEdit('potential', pickup)}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="ftl" className="outline-none">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ButtonGroup className="w-full flex-wrap sm:w-auto">
              <Button
                type="button"
                variant={ftlStageFilter === 'placement' ? 'default' : 'outline'}
                onClick={() => setFtlStageFilter('placement')}
              >
                Placement
                <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">
                  {ftlFilterCounts.placement}
                </span>
              </Button>
              <Button
                type="button"
                variant={ftlStageFilter === 'intransit' ? 'default' : 'outline'}
                onClick={() => setFtlStageFilter('intransit')}
              >
                In Transit
                <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">
                  {ftlFilterCounts.intransit}
                </span>
              </Button>
              <Button
                type="button"
                variant={ftlStageFilter === 'delivery' ? 'default' : 'outline'}
                onClick={() => setFtlStageFilter('delivery')}
              >
                Delivery
                <span className="ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs">
                  {ftlFilterCounts.delivery}
                </span>
              </Button>
            </ButtonGroup>
          </div>

          <div className="mb-4">
            <SchedulePickupsFilters 
              filters={filters} 
              onFilterChange={setFilters} 
              statusOptions={['Sourcing in Progress', 'Vehicle Allocated', 'Loading in Progress', 'Dispatched', 'In Transit', 'Reached Destination', 'Delivered', 'POD Received']}
            />
          </div>

          <div className="space-y-4">
            {showFtlMapPanel ? (
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold">
                      {ftlStageFilter === 'intransit' ? 'In Transit Vehicle Map' : 'Delivery Vehicle Map'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Planned route trace vs. vehicle movement for the FTL rows currently visible.
                    </p>
                  </div>
                  <div className="rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {filteredFtlData.length} active {filteredFtlData.length === 1 ? 'route' : 'routes'}
                  </div>
                </div>
                <MapView routes={ftlMapRoutes} height="360px" />
              </div>
            ) : null}

            <FTLPickupsTable
              data={filteredFtlData}
              statusOptions={ftlStatusOptions}
              onUpdate={handleUpdateFTL}
              onViewMap={handleViewMap}
              onTriggerMarketSourcing={handleOpenMarketSourcing}
              onViewProcurer={handleOpenProcurerInfo}
            />
          </div>
        </TabsContent>
      </Tabs>

      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        location={mapLocation}
      />

      <SchedulePickupsEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        pickup={editingPickup}
        onSave={handleSavePickup}
      />

      <FirstMilePickupEditModal
        isOpen={isFirstMileEditOpen}
        onClose={() => setIsFirstMileEditOpen(false)}
        pickup={editingFirstMilePickup}
        type={editingFirstMileType}
        onSave={handleSaveFirstMilePickup}
      />

      <Dialog open={Boolean(marketSourcingPickup)} onOpenChange={(open) => !open && handleCloseMarketSourcing()}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Trigger Market Sourcing</DialogTitle>
            <DialogDescription>
              Raise a market vehicle request for {marketSourcingPickup?.prqId}. Add the reason so the sourcing team can act on it quickly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{marketSourcingPickup?.customer}</p>
              <p className="text-muted-foreground">{marketSourcingPickup?.requestedVehicleDetail}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="market-sourcing-reason" className="text-sm font-medium">
                Reason for market sourcing
              </label>
              <Textarea
                id="market-sourcing-reason"
                value={marketSourcingReason}
                onChange={(event) => setMarketSourcingReason(event.target.value)}
                placeholder="Example: no nearby branch vehicle available within the pickup SLA."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseMarketSourcing}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmitMarketSourcing}>
              Send Market Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(procurerInfoPickup)} onOpenChange={(open) => !open && setProcurerInfoPickup(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>View Details</DialogTitle>
            <DialogDescription>
              {procurerInfoPickup?.procurer ? 'Vehicle sourcing owner and contractor details for ' : 'Contractor details for '}
              {procurerInfoPickup?.prqId}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{procurerInfoPickup?.customer}</p>
              <p className="text-muted-foreground">{procurerInfoPickup?.status}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {procurerInfoPickup?.procurer && (
                <>
                  <div className="sm:col-span-2">
                    <h4 className="text-sm font-semibold border-b pb-1">Procurer Details</h4>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Procurer Name</p>
                    <p className="mt-1 font-medium">{procurerInfoPickup.procurer.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Contact Number</p>
                    <p className="mt-1 font-medium">{procurerInfoPickup.procurer.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium break-all">{procurerInfoPickup.procurer.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Employee ID</p>
                    <p className="mt-1 font-medium">{procurerInfoPickup.procurer.employeeId || '-'}</p>
                  </div>
                </>
              )}

              {procurerInfoPickup?.contractor && (
                <>
                  <div className="sm:col-span-2 mt-2">
                    <h4 className="text-sm font-semibold border-b pb-1">Contractor Details</h4>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Contractor Name</p>
                    <p className="mt-1 font-medium">{procurerInfoPickup.contractor.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Contact Number</p>
                    <p className="mt-1 font-medium">{procurerInfoPickup.contractor.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium break-all">{procurerInfoPickup.contractor.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Type</p>
                    <p className="mt-1 font-medium">{procurerInfoPickup.contractor.type || '-'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={() => setProcurerInfoPickup(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FirstMilePage;
