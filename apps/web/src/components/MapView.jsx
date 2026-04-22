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

const MapView = ({ locations = [], routes = [], height = '400px', interactive = true }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const [error, setError] = useState('');

  const activeRoutes = useMemo(() => {
    return routes && routes.length > 0 ? routes : (locations && locations.length > 0 ? [{ locations }] : []);
  }, [routes, locations]);

  const allNormalizedLocations = useMemo(() => {
    return activeRoutes.flatMap(route => {
      const allLocs = [...(route.locations || []), ...(route.plannedLocations || []), ...(route.takenLocations || [])];
      return Array.from(new Set(allLocs.map(l => l.id || l.name))).map(id => allLocs.find(l => (l.id || l.name) === id));
    }).map((loc, index) => normalizeMapLocation(loc, index));
  }, [activeRoutes]);

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

        polylinesRef.current.forEach(p => p.setMap(null));
        polylinesRef.current = [];

        if (allNormalizedLocations.length === 0) {
          mapInstanceRef.current.setCenter(DEFAULT_MAP_CENTER);
          mapInstanceRef.current.setZoom(5);
          return;
        }

        const bounds = new maps.LatLngBounds();

        allNormalizedLocations.forEach((location) => {
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

        activeRoutes.forEach((route, index) => {
          const color = route.color || ['#2563eb', '#eab308', '#22c55e', '#ef4444'][index % 4];

          if (route.plannedLocations && route.plannedLocations.length > 1) {
            const normPlanned = route.plannedLocations.map((loc, i) => normalizeMapLocation(loc, i));
            const polyline = new maps.Polyline({
              path: normPlanned.map((loc) => loc.position),
              geodesic: true,
              strokeColor: color,
              strokeOpacity: 0.5,
              strokeWeight: 4,
              map: mapInstanceRef.current,
            });
            polylinesRef.current.push(polyline);
          }

          if (route.takenLocations && route.takenLocations.length > 1) {
            const normTaken = route.takenLocations.map((loc, i) => normalizeMapLocation(loc, i));
            const polyline = new maps.Polyline({
              path: normTaken.map((loc) => loc.position),
              geodesic: true,
              strokeColor: color,
              strokeOpacity: 1,
              strokeWeight: 4,
              map: mapInstanceRef.current,
            });
            polylinesRef.current.push(polyline);
            
            const lastLoc = normTaken[normTaken.length - 1];
            const prevLoc = normTaken[Math.max(0, normTaken.length - 2)];

            let isMovingRight = true;
            if (lastLoc && prevLoc && lastLoc !== prevLoc) {
              const getLng = (pos) => typeof pos.lng === 'function' ? pos.lng() : pos.lng;
              const dx = getLng(lastLoc.position) - getLng(prevLoc.position);
              isMovingRight = dx >= 0;
            }

            const truckMarker = new maps.Marker({
              map: mapInstanceRef.current,
              position: lastLoc.position,
              title: "Current Location",
              icon: {
                url: isMovingRight ? '/truck_right.png' : '/truck_left.png',
                scaledSize: new maps.Size(40, 40),
                anchor: new maps.Point(20, 20)
              },
              zIndex: 999
            });
            markersRef.current.push(truckMarker);
          }

          if (route.locations && route.locations.length > 1) {
            const normLocs = route.locations.map((loc, i) => normalizeMapLocation(loc, i));
            const polyline = new maps.Polyline({
              path: normLocs.map((loc) => loc.position),
              geodesic: true,
              strokeColor: color,
              strokeOpacity: 0.9,
              strokeWeight: 4,
              map: mapInstanceRef.current,
            });
            polylinesRef.current.push(polyline);
          }
        });

        if (allNormalizedLocations.length === 1) {
          mapInstanceRef.current.setCenter(allNormalizedLocations[0].position);
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
  }, [allNormalizedLocations, activeRoutes]);

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

      {!error && allNormalizedLocations.length === 0 ? (
        <div className="absolute left-4 top-4 rounded-md bg-background/90 px-3 py-2 text-sm text-muted-foreground shadow">
          No locations available for this view.
        </div>
      ) : null}
    </div>
  );
};

export default MapView;
