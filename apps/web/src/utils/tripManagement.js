
export const suggestVehicle = (weight, volume) => {
  const numWeight = parseFloat(weight?.toString().replace(/,/g, '') || 0);
  const numVolume = parseFloat(volume?.toString() || 0);

  if (numWeight <= 1500 && numVolume <= 8) return '10ft Van';
  if (numWeight <= 3500 && numVolume <= 18) return '14ft Truck';
  if (numWeight <= 5000 && numVolume <= 28) return '17ft Truck';
  if (numWeight <= 7500 && numVolume <= 38) return '20ft Truck';
  if (numWeight <= 10000 && numVolume <= 48) return '24ft Truck';
  if (numWeight <= 18000 && numVolume <= 65) return '32ft Container';
  return '40ft Container';
};

export const calculateIdealDispatchTime = (appointmentTime, transitHours = 2) => {
  if (!appointmentTime) return null;
  const date = new Date(appointmentTime);
  date.setHours(date.getHours() - transitHours);
  return date.toISOString();
};

export const isMissedWindow = (appointmentTime) => {
  if (!appointmentTime) return false;
  return new Date(appointmentTime) < new Date();
};

export const generateTripSummary = (items) => {
  const totalWeight = items.reduce((sum, item) => sum + parseFloat(item.weight?.toString().replace(/,/g, '') || 0), 0);
  const totalVolume = items.reduce((sum, item) => sum + parseFloat(item.volume?.toString() || 0), 0);
  
  return {
    totalItems: items.length,
    totalWeight: `${totalWeight.toLocaleString('en-IN')} kg`,
    totalVolume: `${totalVolume.toFixed(1)} m³`,
    suggestedVehicle: suggestVehicle(totalWeight, totalVolume)
  };
};
