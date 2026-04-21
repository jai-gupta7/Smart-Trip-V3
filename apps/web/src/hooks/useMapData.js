
import { useState, useEffect } from 'react';

export const useMapData = (locations = []) => {
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Pune default
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (locations && locations.length > 0) {
      // Convert locations to markers
      const newMarkers = locations.map((loc, index) => ({
        id: loc.id || `marker-${index}`,
        position: loc.position || loc.mapView || { lat: 18.5204 + (index * 0.01), lng: 73.8567 + (index * 0.01) },
        label: loc.label || loc.customer || loc.location || `Location ${index + 1}`,
        type: loc.type || 'default',
      }));

      setMarkers(newMarkers);

      // Calculate center if multiple locations
      if (newMarkers.length > 1) {
        const avgLat = newMarkers.reduce((sum, m) => sum + m.position.lat, 0) / newMarkers.length;
        const avgLng = newMarkers.reduce((sum, m) => sum + m.position.lng, 0) / newMarkers.length;
        setMapCenter({ lat: avgLat, lng: avgLng });
      } else if (newMarkers.length === 1) {
        setMapCenter(newMarkers[0].position);
      }
    }
  }, [locations]);

  const addMarker = (marker) => {
    setMarkers(prev => [...prev, marker]);
  };

  const removeMarker = (id) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const updateMarker = (id, updates) => {
    setMarkers(prev =>
      prev.map(m => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  return {
    mapCenter,
    markers,
    zoom,
    setMapCenter,
    setZoom,
    addMarker,
    removeMarker,
    updateMarker,
  };
};
