import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import {
  DEFAULT_MAP_CENTER,
  GOOGLE_MAPS_API_KEY,
  loadGoogleMapsApi,
  normalizeMapLocation,
} from '@/utils/googleMaps';

const getMarkerIcon = (maps, location) => {
  const isPickup = location.type?.toLowerCase() === 'pickup';

  return {
    path: maps.SymbolPath.CIRCLE,
    fillColor: isPickup ? '#f97316' : '#2563eb',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeOpacity: 1,
    strokeWeight: 2,
    scale: 8,
  };
};

const MapView = ({ locations = [], height = '400px', interactive = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [error, setError] = useState('');

  const normalizedLocations = useMemo(
    () => locations.map((location, index) => normalizeMapLocation(location, index)),
    [locations]
  );

  useEffect(() => {
    let isCancelled = false;

    if (!GOOGLE_MAPS_API_KEY) {
      setError('Google Maps API key is missing.');
      return () => {};
    }

    const initializeMap = async () => {
      try {
        const maps = await loadGoogleMapsApi();

        if (isCancelled || !mapRef.current) return;

        setError('');

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new maps.Map(mapRef.current, {
            center: DEFAULT_MAP_CENTER,
            zoom: 5,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        }

        markersRef.current.forEach((marker) => {
          if (typeof marker.setMap === 'function') {
            marker.setMap(null);
          } else {
            marker.map = null;
          }
        });
        markersRef.current = [];

        if (polylineRef.current) {
          polylineRef.current.setMap(null);
          polylineRef.current = null;
        }

        if (normalizedLocations.length === 0) {
          mapInstanceRef.current.setCenter(DEFAULT_MAP_CENTER);
          mapInstanceRef.current.setZoom(5);
          return;
        }

        const bounds = new maps.LatLngBounds();

        normalizedLocations.forEach((location) => {
          const marker = new maps.Marker({
            map: mapInstanceRef.current,
            position: location.position,
            title: location.label,
            icon: getMarkerIcon(maps, location),
          });

          const infoWindow = new maps.InfoWindow({
            content: `<div style="padding: 4px 6px; font-size: 13px;">${location.label}</div>`,
          });

          marker.addListener('click', () => {
            infoWindow.open({
              anchor: marker,
              map: mapInstanceRef.current,
            });
          });

          markersRef.current.push(marker);
          bounds.extend(location.position);
        });

        if (normalizedLocations.length > 1) {
          polylineRef.current = new maps.Polyline({
            path: normalizedLocations.map((location) => location.position),
            geodesic: true,
            strokeColor: '#2563eb',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map: mapInstanceRef.current,
          });
        }

        if (normalizedLocations.length === 1) {
          mapInstanceRef.current.setCenter(normalizedLocations[0].position);
          mapInstanceRef.current.setZoom(12);
        } else {
          mapInstanceRef.current.fitBounds(bounds, 48);
        }
      } catch (mapError) {
        if (!isCancelled) {
          setError(mapError.message || 'Unable to load Google Maps.');
        }
      }
    };

    initializeMap();

    return () => {
      isCancelled = true;
    };
  }, [normalizedLocations]);

  return (
    <div
      className="w-full rounded-xl border border-border relative overflow-hidden bg-muted/20"
      style={{ height }}
    >
      <div
        ref={mapRef}
        className={`absolute inset-0 ${interactive ? '' : 'pointer-events-none'}`}
      />

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 p-6 text-center">
          <div className="space-y-3">
            <MapPin className="w-10 h-10 text-primary mx-auto opacity-70" />
            <p className="font-medium">Unable to load Google Maps</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : null}

      {!error && normalizedLocations.length === 0 ? (
        <div className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-2 text-sm text-muted-foreground shadow">
          No locations available for this view.
        </div>
      ) : null}
    </div>
  );
};

export default MapView;
