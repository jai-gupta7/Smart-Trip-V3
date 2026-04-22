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
import {
  ftlStatusOptions,
  getFTLPickups,
  getPotentialPickups,
  getRequestedPickups,
  getSchedulePickups,
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

const FirstMilePage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: 'All',
    timeRange: 'All Time',
    search: '',
    startTime: '',
    endTime: '',
  });

  const [scheduleData, setScheduleData] = useState([]);
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
  const [ftlStageFilter, setFtlStageFilter] = useState('placement');

  useEffect(() => {
    const data = getSchedulePickups(filters);
    setScheduleData(data);
  }, [filters]);

  const handleViewMap = (location) => {
    setMapLocation(location);
    setIsMapOpen(true);
  };

  const handleEditPickup = (pickup) => {
    setEditingPickup(pickup);
    setIsEditOpen(true);
  };

  const handleSavePickup = (updatedPickup) => {
    setScheduleData((prevData) =>
      prevData.map((pickup) => (pickup.id === updatedPickup.id ? updatedPickup : pickup))
    );
    toast.success(`Pickup ${updatedPickup.pickupId} updated successfully`);
  };

  const openFirstMileEdit = (type, pickup) => {
    setEditingFirstMileType(type);
    setEditingFirstMilePickup(pickup);
    setIsFirstMileEditOpen(true);
  };

  const handleSaveFirstMilePickup = (updatedPickup) => {
    if (editingFirstMileType === 'potential') {
      setPotentialData((prevData) =>
        prevData.map((pickup) => (pickup.id === updatedPickup.id ? updatedPickup : pickup))
      );
      toast.success(`Potential pickup ${updatedPickup.pickupId} updated successfully`);
      return;
    }

    setRequestedData((prevData) =>
      prevData.map((pickup) => (pickup.id === updatedPickup.id ? updatedPickup : pickup))
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
    placement: ftlData.filter((pickup) => ftlStatusStageMap[pickup.status] === 'placement').length,
    intransit: ftlData.filter((pickup) => ftlStatusStageMap[pickup.status] === 'intransit').length,
    delivery: ftlData.filter((pickup) => ftlStatusStageMap[pickup.status] === 'delivery').length,
  };

  const filteredFtlData = ftlData.filter((pickup) => ftlStatusStageMap[pickup.status] === ftlStageFilter);

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
          <SchedulePickupsFilters filters={filters} onFilterChange={setFilters} />

          <SchedulePickupsTable
            data={scheduleData}
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

            <TabsContent value="confirmed" className="outline-none">
              <RequestedPickupsTable
                data={requestedData}
                onViewMap={handleViewMap}
                onEdit={(pickup) => openFirstMileEdit('requested', pickup)}
              />
            </TabsContent>

            <TabsContent value="potential" className="outline-none">
              <PotentialPickupsTable
                data={potentialData}
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

          <FTLPickupsTable
            data={filteredFtlData}
            statusOptions={ftlStatusOptions}
            onUpdate={handleUpdateFTL}
            onViewMap={handleViewMap}
            onTriggerMarketSourcing={handleOpenMarketSourcing}
          />
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
    </div>
  );
};

export default FirstMilePage;
