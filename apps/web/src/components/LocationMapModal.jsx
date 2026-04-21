
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MapView from '@/components/MapView';
import { normalizeMapLocation } from '@/utils/googleMaps';

const LocationMapModal = ({ isOpen, onClose, location }) => {
  if (!location) return null;

  const normalizedLocation = normalizeMapLocation(location);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Location Map View</DialogTitle>
          <DialogDescription>
            {normalizedLocation.label} (Lat: {normalizedLocation.position.lat}, Lng: {normalizedLocation.position.lng})
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 rounded-xl overflow-hidden border">
          <MapView locations={[normalizedLocation]} height="400px" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationMapModal;
