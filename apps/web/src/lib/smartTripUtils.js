import { getSampleTrips } from '@/lib/dummyData';

export const cloneTrips = () => JSON.parse(JSON.stringify(getSampleTrips()));

export const getNumericWeight = (weight) =>
  Number.parseFloat(String(weight || '0').replace(/[^\d.]/g, '')) || 0;

export const getVehicleSizeRank = (label = '') => {
  if (label.includes('17 ft')) return 1;
  if (label.includes('20 ft')) return 2;
  if (label.includes('32 ft')) return 3;
  if (label.includes('40 ft')) return 4;
  return 0;
};

export const matchesTripView = (stop, tripView) => {
  if (tripView === 'prq') {
    return String(stop.id || '').startsWith('PRQ');
  }

  if (tripView === 'cn') {
    return String(stop.id || '').startsWith('CN');
  }

  return true;
};

export const summarizeTripForView = (trip, tripView) => {
  const filteredStops = trip.stops.filter((stop) => matchesTripView(stop, tripView));
  const cardStops = filteredStops.length > 0 ? filteredStops : trip.stops;
  const cnStops = cardStops.filter((stop) => String(stop.id || '').startsWith('CN'));
  const prqStops = cardStops.filter((stop) => String(stop.id || '').startsWith('PRQ'));

  return {
    ...trip,
    cardStops,
    cardStopCount: cardStops.length,
    cardCnCount: cnStops.reduce((sum, stop) => sum + (Number(stop.cns) || 0), 0),
    cardPrqCount: prqStops.length,
    cardPrqWeight: `${prqStops
      .reduce((sum, stop) => sum + getNumericWeight(stop.weight), 0)
      .toFixed(1)} kg`,
    cardWeight: `${cardStops
      .reduce((sum, stop) => sum + getNumericWeight(stop.weight), 0)
      .toFixed(1)} kg`,
  };
};
