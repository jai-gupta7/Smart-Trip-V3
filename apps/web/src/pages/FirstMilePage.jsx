import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import {
  ftlVehicleSizeOptions,
  ftlVehicleSourceOptions,
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
    toast.success(`Requested pickup ${updatedPickup.prqId} updated successfully`);
  };

  const handleUpdateFTL = (pickupId, field, value) => {
    setFtlData((prevData) =>
      prevData.map((pickup) =>
        pickup.id === pickupId ? { ...pickup, [field]: value } : pickup
      )
    );
  };

  return (
    <div className="om-container py-8">
      <BreadcrumbNav />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="w-full justify-start overflow-x-auto lg:w-auto">
            <TabsTrigger value="schedule">Schedule Pickups</TabsTrigger>
            <TabsTrigger value="potential">Potential Pickups</TabsTrigger>
            <TabsTrigger value="requested">Requested Pickups</TabsTrigger>
            <TabsTrigger value="ftl">FTL Pickups</TabsTrigger>
          </TabsList>

          {activeTab === 'requested' ? (
            <Button
              onClick={() => navigate('/smart-trip-creation')}
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

        <TabsContent value="potential" className="outline-none">
          <PotentialPickupsTable
            data={potentialData}
            onViewMap={handleViewMap}
            onEdit={(pickup) => openFirstMileEdit('potential', pickup)}
          />
        </TabsContent>

        <TabsContent value="requested" className="outline-none">
          <RequestedPickupsTable
            data={requestedData}
            onEdit={(pickup) => openFirstMileEdit('requested', pickup)}
          />
        </TabsContent>

        <TabsContent value="ftl" className="outline-none">
          <FTLPickupsTable
            data={ftlData}
            vehicleSizeOptions={ftlVehicleSizeOptions}
            vehicleSourceOptions={ftlVehicleSourceOptions}
            onUpdate={handleUpdateFTL}
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
    </div>
  );
};

export default FirstMilePage;
