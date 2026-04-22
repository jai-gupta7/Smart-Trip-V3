export const smartTripRouteColors = ['#2563eb', '#eab308', '#22c55e', '#ef4444'];

export const smartTripLoadingProgress = [
  {
    id: 'LP-01',
    scannedCNs: 0,
    remainingCNs: 5,
    vehicleModel: 'Eicher Pro 2110 20 ft / CBC',
    truckSize: '24 ft truck',
    truckDimensions: '24x6x6 ft',
    capacity: '7.5 T',
    progress: 0,
    driverName: 'Rajesh Kumar',
    successRate: '4.1',
    driverContact: '9876543210',
    dockName: '-',
    loaderName: '-',
    loaderContact: '-',
    loadingStartTime: '-',
    lastScannedBox: '-',
    lastScannedTime: '-',
  },
  {
    id: 'LP-02',
    scannedCNs: 18,
    remainingCNs: 12,
    vehicleModel: 'Tata LPT 1918 24 ft',
    truckSize: '24 ft truck',
    truckDimensions: '24x8x8 ft',
    capacity: '12 T',
    progress: 32,
    driverName: 'Amit Singh',
    successRate: '4.5',
    driverContact: '9123456780',
    dockName: 'Dock 4A',
    loaderName: 'Sunil Verma',
    loaderContact: '9876501234',
    loadingStartTime: '09:15 AM',
    lastScannedBox: 'CN-90412',
    lastScannedTime: '10:05 AM',
  },
  {
    id: 'LP-03',
    scannedCNs: 45,
    remainingCNs: 0,
    vehicleModel: 'Ashok Leyland Dost+',
    truckSize: '14 ft truck',
    truckDimensions: '14x6x6 ft',
    capacity: '3.5 T',
    progress: 92,
    driverName: 'Vikram Patil',
    successRate: '4.8',
    driverContact: '9988776655',
    dockName: 'Dock 2B',
    loaderName: 'Rohan Deshmukh',
    loaderContact: '9988771122',
    loadingStartTime: '07:30 AM',
    lastScannedBox: 'CN-11004',
    lastScannedTime: '08:45 AM',
  },
  {
    id: 'LP-04',
    scannedCNs: 25,
    remainingCNs: 8,
    vehicleModel: 'Tata Ultra T.16 AMT',
    truckSize: '24 ft truck',
    truckDimensions: '24x6x6 ft',
    capacity: '7.5 T',
    progress: 62,
    driverName: 'Sanjay Kumar',
    successRate: '4.3',
    driverContact: '9887766552',
    dockName: 'Dock 1A',
    loaderName: 'Arjun Patel',
    loaderContact: '9347821056',
  },
];

const createOffsetClone = (parent, index) => {
  const offsetLat = Math.random() * 0.3 - 0.15;
  const offsetLng = Math.random() * 0.3 - 0.15;
  const clone = JSON.parse(JSON.stringify(parent));

  clone.id = `OR-0${index + 4}`;
  clone.routeName = `${parent.routeName} - Run ${Math.floor(index / 3) + 2}`;
  clone.vehicleNumber = `MH-${10 + index}-XX-${1000 + index}`;

  clone.plannedLocations.forEach((location) => {
    location.id += `_${index}`;
    location.lat += offsetLat;
    location.lng += offsetLng;
  });

  clone.takenLocations.forEach((location) => {
    location.id += `_${index}`;
    location.lat += offsetLat;
    location.lng += offsetLng;
  });

  return clone;
};

export const smartTripOnRouteVehicles = (() => {
  const base = [
    {
      id: 'OR-01',
      routeName: 'Andheri to Vashi Link',
      vehicleNumber: 'MH-02-CD-5566',
      driverName: 'Amit Sharma',
      routeDecided: '45 km',
      routeTraveled: '32 km',
      cnPlanned: 120,
      cnDelivered: 85,
      prqPlanned: 15,
      prqPicked: 12,
      noOfStops: 8,
      stopsCompleted: 6,
      exceptionRaised: 'Traffic Delay at Toll Naka',
      gateOutTime: '10:15 AM',
      podUploadCount: '4/6',
      cashCollectedActual: 'Rs 12,500',
      cashCollectedProjected: 'Rs 15,000',
      plannedLocations: [
        { id: 'L1', type: 'PRQ', address: 'Andheri', name: 'Andheri', lat: 19.1136, lng: 72.8697 },
        { id: 'L1_mid', type: 'WAYPOINT', address: 'Kurla', name: 'Kurla', lat: 19.0728, lng: 72.8826 },
        { id: 'L2', type: 'CN', address: 'Vashi', name: 'Vashi', lat: 19.077, lng: 72.9989 },
      ],
      takenLocations: [
        { id: 'L1', type: 'PRQ', address: 'Andheri', name: 'Andheri', lat: 19.1136, lng: 72.8697 },
        { id: 'L1_mid', type: 'WAYPOINT', address: 'Kurla', name: 'Kurla', lat: 19.0728, lng: 72.8826 },
      ],
    },
    {
      id: 'OR-02',
      routeName: 'Bandra to Thane Express',
      vehicleNumber: 'MH-47-XY-1234',
      driverName: 'Rahul Desai',
      routeDecided: '38 km',
      routeTraveled: '15 km',
      cnPlanned: 90,
      cnDelivered: 40,
      prqPlanned: 5,
      prqPicked: 5,
      noOfStops: 5,
      stopsCompleted: 3,
      exceptionRaised: '',
      gateOutTime: '08:30 AM',
      podUploadCount: '3/3',
      cashCollectedActual: 'Rs 8,200',
      cashCollectedProjected: 'Rs 8,200',
      plannedLocations: [
        { id: 'L3', type: 'PRQ', address: 'Bandra', name: 'Bandra', lat: 19.0596, lng: 72.8295 },
        { id: 'L4', type: 'CN', address: 'Sion', name: 'Sion', lat: 19.039, lng: 72.8619 },
        { id: 'L5', type: 'CN', address: 'Thane', name: 'Thane', lat: 19.2183, lng: 72.9781 },
      ],
      takenLocations: [
        { id: 'L3', type: 'PRQ', address: 'Bandra', name: 'Bandra', lat: 19.0596, lng: 72.8295 },
        { id: 'L4', type: 'CN', address: 'Sion', name: 'Sion', lat: 19.039, lng: 72.8619 },
      ],
    },
    {
      id: 'OR-03',
      routeName: 'Navi Mumbai Industrial Transit',
      vehicleNumber: 'MH-04-AB-9876',
      driverName: 'Sanjay Patil',
      routeDecided: '55 km',
      routeTraveled: '50 km',
      cnPlanned: 150,
      cnDelivered: 145,
      prqPlanned: 20,
      prqPicked: 18,
      noOfStops: 12,
      stopsCompleted: 11,
      exceptionRaised: 'Customer Unavailable',
      gateOutTime: '06:45 AM',
      podUploadCount: '9/11',
      cashCollectedActual: 'Rs 34,000',
      cashCollectedProjected: 'Rs 40,000',
      plannedLocations: [
        { id: 'L6', type: 'PRQ', address: 'Turbhe', name: 'Turbhe', lat: 19.07, lng: 73.0188 },
        { id: 'L7', type: 'CN', address: 'Mahape', name: 'Mahape', lat: 19.1026, lng: 73.015 },
        { id: 'L8', type: 'PRQ', address: 'Rabale', name: 'Rabale', lat: 19.1419, lng: 73.0039 },
      ],
      takenLocations: [
        { id: 'L6', type: 'PRQ', address: 'Turbhe', name: 'Turbhe', lat: 19.07, lng: 73.0188 },
        { id: 'L7_mid', type: 'WAYPOINT', address: 'Kopar Khairane', name: 'Kopar Khairane', lat: 19.103, lng: 73.008 },
      ],
    },
  ];

  const extended = [...base];
  for (let index = 0; index < 6; index += 1) {
    extended.push(createOffsetClone(base[index % 3], index));
  }

  return extended;
})();

export const smartTripOnRouteVehicleColorById = Object.fromEntries(
  smartTripOnRouteVehicles.map((vehicle, index) => [
    vehicle.id,
    smartTripRouteColors[index % smartTripRouteColors.length],
  ])
);
