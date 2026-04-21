export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const DEFAULT_MAP_CENTER = { lat: 20.5937, lng: 78.9629 };

let googleMapsScriptPromise = null;

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);

const hasCoords = (value) =>
  value &&
  isFiniteNumber(value.lat) &&
  isFiniteNumber(value.lng);

const hashString = (value) => {
  const input = value || 'india';
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
};

export const getStableCoordinates = (label = '', index = 0) => {
  const hash = hashString(`${label}-${index}`);
  const latitude = 8 + ((hash % 2600) / 100);
  const longitude = 68 + (((Math.floor(hash / 97) + index * 17) % 2100) / 100);

  return {
    lat: Number(latitude.toFixed(6)),
    lng: Number(longitude.toFixed(6)),
  };
};

const getLabelFromLocation = (location, fallbackIndex) => {
  if (!location) return `Location ${fallbackIndex + 1}`;
  if (typeof location === 'string') return location;

  return (
    location.name ||
    location.label ||
    location.customerName ||
    location.customer ||
    location.location ||
    location.customerAddress?.name ||
    location.customerAddress ||
    location.customerLocation?.name ||
    `Location ${fallbackIndex + 1}`
  );
};

export const normalizeMapLocation = (location, index = 0) => {
  const label = getLabelFromLocation(location, index);
  const candidateCoords = [
    location,
    location?.position,
    location?.mapView,
    location?.location,
    location?.customerLocation,
    location?.customerAddress,
  ].find(hasCoords);

  return {
    id: location?.id || `location-${index}`,
    label,
    type: location?.type || 'Drop',
    position: candidateCoords || getStableCoordinates(label, index),
  };
};

export const loadGoogleMapsApi = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google Maps is only available in the browser.'));
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(new Error('Google Maps API key is missing.'));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-google-maps-loader="true"]');

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps.')));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = 'true';
    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps did not initialize.'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps.'));

    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
};
