// Dummy data service for Om Logistics Trip Management System

export const operatorContactDirectory = {
  'Ravi Operator': { name: 'Ravi Operator', phone: '+91 98111 20001', branch: 'Pune Control Tower' },
  'Amit Ops': { name: 'Amit Ops', phone: '+91 98111 20002', branch: 'Mumbai Planning Desk' },
  'Neha Desk': { name: 'Neha Desk', phone: '+91 98111 20003', branch: 'Delhi Operations Desk' },
  'Vikram Desk': { name: 'Vikram Desk', phone: '+91 98111 20004', branch: 'West Region Control' },
};

export const driverContactDirectory = {
  'Rajesh Kumar': { name: 'Rajesh Kumar', phone: '+91 98991 11001', branch: 'Delhi Hub' },
  'Amit Sharma': { name: 'Amit Sharma', phone: '+91 98991 11002', branch: 'Mumbai Hub' },
  'Priya Patel': { name: 'Priya Patel', phone: '+91 98991 11003', branch: 'Navi Mumbai Hub' },
  'Vikram Singh': { name: 'Vikram Singh', phone: '+91 98991 11004', branch: 'Thane Hub' },
  'Sneha Desai': { name: 'Sneha Desai', phone: '+91 98991 11005', branch: 'Pune Hub' },
  'Arjun Reddy': { name: 'Arjun Reddy', phone: '+91 98991 11006', branch: 'Nashik Hub' },
  'Kavita Nair': { name: 'Kavita Nair', phone: '+91 98991 11007', branch: 'Pune Hub' },
  'Suresh Iyer': { name: 'Suresh Iyer', phone: '+91 98991 11008', branch: 'Pune Hub' },
  'Deepak Joshi': { name: 'Deepak Joshi', phone: '+91 98991 11009', branch: 'Pune Hub' },
  'Meera Kulkarni': { name: 'Meera Kulkarni', phone: '+91 98991 11010', branch: 'Pune Hub' },
  'Ravi Menon': { name: 'Ravi Menon', phone: '+91 98991 11011', branch: 'Mumbai Hub' },
  'Anjali Rao': { name: 'Anjali Rao', phone: '+91 98991 11012', branch: 'Mumbai Hub' },
  'Karan Mehta': { name: 'Karan Mehta', phone: '+91 98991 11013', branch: 'Mumbai Hub' },
  'Pooja Gupta': { name: 'Pooja Gupta', phone: '+91 98991 11014', branch: 'Mumbai Hub' },
  'Nikhil Shah': { name: 'Nikhil Shah', phone: '+91 98991 11015', branch: 'Mumbai Hub' },
  'Sanjay Patil': { name: 'Sanjay Patil', phone: '+91 98991 11016', branch: 'Mumbai Hub' },
  'Rekha Verma': { name: 'Rekha Verma', phone: '+91 98991 11017', branch: 'Mumbai Hub' },
  'Anil Kumar': { name: 'Anil Kumar', phone: '+91 98991 11018', branch: 'Mumbai Hub' },
};

const operatorContacts = Object.values(operatorContactDirectory);
const driverContacts = Object.values(driverContactDirectory);

function getOperatorContact(operatorName, index = 0) {
  return operatorContactDirectory[operatorName] || operatorContacts[index % operatorContacts.length];
}

function getDriverContact(driverName, index = 0) {
  return driverContactDirectory[driverName] || driverContacts[index % driverContacts.length];
}

export const schedulePickupsData = [
  { id: '1', pickupId: 'SP-2847', customerName: 'Tata Motors', location: { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 }, slot: '2026-04-21T09:30', operatorName: 'Ravi Operator', vehicle: 'MH-12-AB-1234 (14ft)', driver: 'Rajesh Kumar', poc: { name: 'Sanjay Dutt', phone: '+91 9876543210' }, status: 'Confirmed' },
  { id: '2', pickupId: 'SP-2848', customerName: 'Mahindra Logistics', location: { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 }, slot: '2026-04-21T10:15', operatorName: 'Amit Ops', vehicle: 'MH-02-CD-5678 (17ft)', driver: 'Amit Sharma', poc: { name: 'Priya Singh', phone: '+91 9876543211' }, status: 'Pending' },
  { id: '3', pickupId: 'SP-2849', customerName: 'Reliance Industries', location: { name: 'Navi Mumbai, Maharashtra', lat: 19.0330, lng: 73.0297 }, slot: '2026-04-21T11:00', operatorName: 'Neha Desk', vehicle: 'MH-04-EF-9012 (20ft)', driver: 'Priya Patel', poc: { name: 'Rahul Verma', phone: '+91 9876543212' }, status: 'Confirmed' },
  { id: '4', pickupId: 'SP-2850', customerName: 'Godrej Consumer', location: { name: 'Thane, Maharashtra', lat: 19.2183, lng: 72.9781 }, slot: '2026-04-21T11:45', operatorName: 'Ravi Operator', vehicle: 'MH-05-GH-3456 (10ft)', driver: 'Vikram Singh', poc: { name: 'Anjali Rao', phone: '+91 9876543213' }, status: 'Cancelled' },
  { id: '5', pickupId: 'SP-2851', customerName: 'Asian Paints', location: { name: 'Kalyan, Maharashtra', lat: 19.2403, lng: 73.1305 }, slot: '2026-04-21T13:00', operatorName: 'Vikram Desk', vehicle: 'MH-06-IJ-7890 (14ft)', driver: 'Sneha Desai', poc: { name: 'Karan Mehta', phone: '+91 9876543214' }, status: 'Confirmed' },
  { id: '6', pickupId: 'SP-2852', customerName: 'Larsen & Toubro', location: { name: 'Nashik, Maharashtra', lat: 19.9975, lng: 73.7898 }, slot: '2026-04-21T14:30', operatorName: 'Amit Ops', vehicle: 'MH-15-KL-2345 (24ft)', driver: 'Arjun Reddy', poc: { name: 'Pooja Gupta', phone: '+91 9876543215' }, status: 'Pending' },
  { id: '7', pickupId: 'SP-2853', customerName: 'Wipro Limited', location: { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 }, slot: '2026-04-21T15:15', operatorName: 'Neha Desk', vehicle: 'MH-12-MN-6789 (17ft)', driver: 'Kavita Nair', poc: { name: 'Nikhil Shah', phone: '+91 9876543216' }, status: 'Confirmed' },
  { id: '8', pickupId: 'SP-2854', customerName: 'Infosys Technologies', location: { name: 'Hinjewadi, Pune', lat: 18.5913, lng: 73.7389 }, slot: '2026-04-21T16:00', operatorName: 'Ravi Operator', vehicle: 'MH-14-OP-0123 (14ft)', driver: 'Suresh Iyer', poc: { name: 'Sanjay Patil', phone: '+91 9876543217' }, status: 'Confirmed' },
  { id: '9', pickupId: 'SP-2855', customerName: 'Tech Mahindra', location: { name: 'Magarpatta, Pune', lat: 18.5158, lng: 73.9272 }, slot: '2026-04-22T08:30', operatorName: 'Vikram Desk', vehicle: 'MH-12-QR-4567 (32ft)', driver: 'Deepak Joshi', poc: { name: 'Rekha Verma', phone: '+91 9876543218' }, status: 'Pending' },
  { id: '10', pickupId: 'SP-2856', customerName: 'Bajaj Auto', location: { name: 'Akurdi, Pune', lat: 18.6489, lng: 73.7622 }, slot: '2026-04-22T09:45', operatorName: 'Amit Ops', vehicle: 'MH-14-ST-8901 (40ft)', driver: 'Meera Kulkarni', poc: { name: 'Anil Kumar', phone: '+91 9876543219' }, status: 'Confirmed' },
  { id: '11', pickupId: 'SP-2857', customerName: 'Hindustan Unilever', location: { name: 'Andheri, Mumbai', lat: 19.1136, lng: 72.8697 }, slot: '2026-04-22T10:30', operatorName: 'Neha Desk', vehicle: 'MH-02-UV-2345 (14ft)', driver: 'Ravi Menon', poc: { name: 'Suresh Nair', phone: '+91 9876543220' }, status: 'Cancelled' },
  { id: '12', pickupId: 'SP-2858', customerName: 'ITC Limited', location: { name: 'Bandra, Mumbai', lat: 19.0596, lng: 72.8295 }, slot: '2026-04-22T11:15', operatorName: 'Ravi Operator', vehicle: 'MH-01-WX-6789 (17ft)', driver: 'Anjali Rao', poc: { name: 'Meena Kumari', phone: '+91 9876543221' }, status: 'Confirmed' },
  { id: '13', pickupId: 'SP-2859', customerName: 'Aditya Birla Group', location: { name: 'Worli, Mumbai', lat: 19.0166, lng: 72.8166 }, slot: '2026-04-22T12:00', operatorName: 'Vikram Desk', vehicle: 'MH-03-YZ-0123 (20ft)', driver: 'Karan Mehta', poc: { name: 'Rajiv Dixit', phone: '+91 9876543222' }, status: 'Pending' },
  { id: '14', pickupId: 'SP-2860', customerName: 'Cipla Pharmaceuticals', location: { name: 'Vikhroli, Mumbai', lat: 19.1114, lng: 72.9278 }, slot: '2026-04-22T13:30', operatorName: 'Amit Ops', vehicle: 'MH-04-AB-4567 (10ft)', driver: 'Pooja Gupta', poc: { name: 'Sunil Shetty', phone: '+91 9876543223' }, status: 'Confirmed' },
  { id: '15', pickupId: 'SP-2861', customerName: 'Sun Pharma', location: { name: 'Goregaon, Mumbai', lat: 19.1663, lng: 72.8526 }, slot: '2026-04-22T14:15', operatorName: 'Neha Desk', vehicle: 'MH-02-CD-8901 (14ft)', driver: 'Nikhil Shah', poc: { name: 'Kavita Das', phone: '+91 9876543224' }, status: 'Confirmed' },
  { id: '16', pickupId: 'SP-2862', customerName: 'Dr. Reddy\'s Labs', location: { name: 'Malad, Mumbai', lat: 19.1860, lng: 72.8485 }, slot: '2026-04-22T15:00', operatorName: 'Ravi Operator', vehicle: 'MH-01-EF-2345 (24ft)', driver: 'Sanjay Patil', poc: { name: 'Arun Jaitley', phone: '+91 9876543225' }, status: 'Pending' },
  { id: '17', pickupId: 'SP-2863', customerName: 'Lupin Pharma', location: { name: 'Kandivali, Mumbai', lat: 19.2047, lng: 72.8364 }, slot: '2026-04-22T16:30', operatorName: 'Vikram Desk', vehicle: 'MH-03-GH-6789 (17ft)', driver: 'Rekha Verma', poc: { name: 'Geeta Phogat', phone: '+91 9876543226' }, status: 'Confirmed' },
  { id: '18', pickupId: 'SP-2864', customerName: 'Biocon Limited', location: { name: 'Borivali, Mumbai', lat: 19.2307, lng: 72.8567 }, slot: '2026-04-23T09:00', operatorName: 'Amit Ops', vehicle: 'MH-04-IJ-0123 (32ft)', driver: 'Anil Kumar', poc: { name: 'Ramesh Powar', phone: '+91 9876543227' }, status: 'Cancelled' },
].map((item, index) => ({
  ...item,
  prqMode: index % 4 === 1 ? 'API' : 'Scheduled',
  editCount: 0,
  parentPickupId: null,
  subPrqSequence: null,
  lastEditedBy: index % 3 === 0 ? 'Nisha Operations' : '',
  lastEditedAt: index % 3 === 0 ? `2026-04-${String(18 + index).padStart(2, '0')}T1${index % 5}:20` : '',
  editedValues:
    index % 3 === 0
      ? ['Vehicle: feeder vehicle updated', 'POC: branch contact corrected']
      : [],
  operatorContact: getOperatorContact(item.operatorName, index),
  driverContact: getDriverContact(item.driver, index),
  yellowFlagReason:
    index % 5 === 0 ? 'Contact detail mismatch detected during dispatch readiness check.' : '',
}));

const scheduledPickupBranchNodes = [
  { id: 'SCH-BR-01', name: 'Pune Consolidation Center', lat: 18.5348, lng: 73.8762 },
  { id: 'SCH-BR-02', name: 'Mumbai Linehaul Branch', lat: 19.1075, lng: 72.8826 },
  { id: 'SCH-BR-03', name: 'Navi Mumbai Cross Dock', lat: 19.0365, lng: 73.0207 },
  { id: 'SCH-BR-04', name: 'Thane Feeder Bay', lat: 19.2049, lng: 72.9763 },
  { id: 'SCH-BR-05', name: 'Kalyan Regional Dock', lat: 19.2502, lng: 73.1380 },
  { id: 'SCH-BR-06', name: 'Nashik Consolidation Hub', lat: 19.9944, lng: 73.7691 },
];

const scheduledPickupTransporters = [
  { name: 'Sai Carriers', phone: '+91 90045 21001', coordinator: 'Sanjay More', lane: 'Branch feeder' },
  { name: 'Metro Fleet Services', phone: '+91 90045 21002', coordinator: 'Namrata Kulkarni', lane: 'Dedicated shuttle' },
  { name: 'Western Link Logistics', phone: '+91 90045 21003', coordinator: 'Naveen Shetty', lane: 'Milk run feeder' },
  { name: 'RapidHaul Transport', phone: '+91 90045 21004', coordinator: 'Dinesh Pawar', lane: 'Priority pickup lane' },
];

const buildScheduledPickupRouteToBranch = (branch, index) => {
  const offset = index % 4;
  const start = {
    id: `${branch.id}-start-${index}`,
    name: 'Vehicle dispatched',
    type: 'Pickup',
    lat: Number((branch.lat - 0.16 + offset * 0.01).toFixed(6)),
    lng: Number((branch.lng - 0.18 + offset * 0.012).toFixed(6)),
  };
  const checkpoint = {
    id: `${branch.id}-checkpoint-${index}`,
    name: 'Current vehicle position',
    type: 'Pickup',
    lat: Number((branch.lat - 0.07 + offset * 0.004).toFixed(6)),
    lng: Number((branch.lng - 0.08 + offset * 0.005).toFixed(6)),
  };
  const destination = {
    id: `${branch.id}-destination-${index}`,
    name: branch.name,
    type: 'Drop',
    lat: branch.lat,
    lng: branch.lng,
  };

  return {
    takenLocations: [start, checkpoint],
    plannedLocations: [checkpoint, destination],
  };
};

export const scheduledPickupVehicleOptions = schedulePickupsData.map((pickup, index) => {
  const branch = scheduledPickupBranchNodes[index % scheduledPickupBranchNodes.length];
  const transporter = scheduledPickupTransporters[index % scheduledPickupTransporters.length];
  const routeToBranch = buildScheduledPickupRouteToBranch(branch, index);
  const vehicleNumber = pickup.vehicle.match(/[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}/)?.[0] || pickup.vehicle;

  return {
    id: `SP-VH-${String(index + 1).padStart(3, '0')}`,
    label: pickup.vehicle,
    vehicleNumber,
    vehicleType: pickup.vehicle.split('(')[1]?.replace(')', '') || 'Standard truck',
    currentStatus: index % 3 === 0 ? 'Approaching branch' : index % 3 === 1 ? 'Waiting at checkpoint' : 'On feeder route',
    etaToBranch: ['18 min', '24 min', '31 min', '12 min', '27 min', '35 min'][index % 6],
    branch,
    driver: getDriverContact(pickup.driver, index),
    transporter: {
      ...transporter,
      etaDesk: `Desk ${String((index % 4) + 1).padStart(2, '0')}`,
    },
    routeToBranch,
  };
});

export const scheduledPickupTripsInProgress = [
  'Pune West feeder run',
  'Mumbai north shuttle',
  'Navi Mumbai milk run',
  'Thane priority pickup loop',
  'Kalyan retailer feeder',
  'Nashik branch replenishment',
].map((name, index) => {
  const vehicle = scheduledPickupVehicleOptions[index];

  return {
    id: `SP-TRIP-${701 + index}`,
    name,
    status: index % 2 === 0 ? 'In Progress' : 'Vehicle Reaching Branch',
    vehicleId: vehicle.id,
    branchName: vehicle.branch.name,
    etaToBranch: vehicle.etaToBranch,
    prqCount: 4 + index,
    touchPoints: 6 + index,
    utilization: `${62 + index * 4}%`,
  };
});

schedulePickupsData.forEach((pickup, index) => {
  const associatedVehicle =
    scheduledPickupVehicleOptions.find((vehicle) => vehicle.label === pickup.vehicle) ||
    scheduledPickupVehicleOptions[index % scheduledPickupVehicleOptions.length];
  const associatedTrip =
    index % 4 === 1
      ? null
      : scheduledPickupTripsInProgress[index % scheduledPickupTripsInProgress.length];

  Object.assign(pickup, {
    assignedTripId: associatedTrip?.id || '__create_new__',
    selectedVehicleId: associatedVehicle?.id || '',
    transporterDetails: associatedVehicle?.transporter || null,
    liveVehicleRoute: associatedVehicle?.routeToBranch || null,
    etaToBranch: associatedVehicle?.etaToBranch || 'Awaiting vehicle allocation',
    branchLocation: associatedVehicle?.branch || null,
    additionalVehicleId: '',
    subPrqId: '',
    marketVehicleRequest: null,
  });
});

export const getSchedulePickups = (filters = {}) => {
  let filteredData = [...schedulePickupsData];

  if (filters.status && filters.status !== 'All') {
    filteredData = filteredData.filter((item) => item.status === filters.status);
  }

  if (filters.startTime) {
    const start = new Date(filters.startTime).getTime();
    filteredData = filteredData.filter((item) => new Date(item.slot).getTime() >= start);
  }

  if (filters.endTime) {
    const end = new Date(filters.endTime).getTime();
    filteredData = filteredData.filter((item) => new Date(item.slot).getTime() <= end);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filteredData = filteredData.filter((item) =>
      (item.pickupId && item.pickupId.toLowerCase().includes(q)) ||
      (item.customerName && item.customerName.toLowerCase().includes(q)) ||
      (item.driver && item.driver.toLowerCase().includes(q)) ||
      (item.vehicle && item.vehicle.toLowerCase().includes(q)) ||
      (item.poc && item.poc.name && item.poc.name.toLowerCase().includes(q))
    );
  }

  return filteredData;
};

// Extracted unique collections for form dropdowns
export const operators = [
  'Ravi Operator',
  'Amit Ops',
  'Neha Desk',
  'Vikram Desk'
];

export const vehicles = [
  'MH-12-AB-1234 (14ft)', 'MH-02-CD-5678 (17ft)', 'MH-04-EF-9012 (20ft)',
  'MH-05-GH-3456 (10ft)', 'MH-06-IJ-7890 (14ft)', 'MH-15-KL-2345 (24ft)',
  'MH-12-MN-6789 (17ft)', 'MH-14-OP-0123 (14ft)', 'MH-12-QR-4567 (32ft)',
  'MH-14-ST-8901 (40ft)', 'MH-02-UV-2345 (14ft)', 'MH-01-WX-6789 (17ft)',
  'MH-03-YZ-0123 (20ft)', 'MH-04-AB-4567 (10ft)', 'MH-02-CD-8901 (14ft)',
  'MH-01-EF-2345 (24ft)', 'MH-03-GH-6789 (17ft)', 'MH-04-IJ-0123 (32ft)'
];

export const drivers = [
  'Rajesh Kumar', 'Amit Sharma', 'Priya Patel', 'Vikram Singh',
  'Sneha Desai', 'Arjun Reddy', 'Kavita Nair', 'Suresh Iyer',
  'Deepak Joshi', 'Meera Kulkarni', 'Ravi Menon', 'Anjali Rao',
  'Karan Mehta', 'Pooja Gupta', 'Nikhil Shah', 'Sanjay Patil',
  'Rekha Verma', 'Anil Kumar'
];

const normalizePotentialCallStatus = (status) => {
  const normalizedStatus = (status || '').toLowerCase();

  if (normalizedStatus.includes('completed') || normalizedStatus.includes('auto')) {
    return 'Auto Confirmed';
  }

  if (normalizedStatus.includes('pending') || normalizedStatus.includes('progress') || normalizedStatus.includes('scheduled')) {
    return 'CS Pending';
  }

  return 'Branch Required';
};

export const pickupStatusOptions = ['Confirmed', 'Pending Confirmation', 'Rescheduled', 'Cancelled'];

export const potentialPickups = [
  {
    id: 'PP-3101',
    pickupId: 'PICK-3101',
    pickupDateTime: '2026-04-21T09:30',
    ewayBillNumber: '271009885421',
    ewayBillCreatedAt: '2026-04-21T07:45',
    customerName: 'Tata Steel',
    customerLocation: { name: 'Jamshedpur, Jharkhand', lat: 22.8046, lng: 86.2029 },
    poc: { name: 'Ramesh Gupta', phone: '+91 98765 43210' },
    expectedLoad: '12.5 MT',
    callStatus: 'AI Call Completed',
    prqStatus: 'Confirmed',
    ewayBillCount: 3,
  },
  {
    id: 'PP-3102',
    pickupId: 'PICK-3102',
    pickupDateTime: '2026-04-21T11:00',
    ewayBillNumber: '291004552813',
    ewayBillCreatedAt: '2026-04-21T08:20',
    customerName: 'JSW Steel',
    customerLocation: { name: 'Vijayanagar, Karnataka', lat: 15.1394, lng: 76.9214 },
    poc: { name: 'Lakshmi Iyer', phone: '+91 98765 43211' },
    expectedLoad: '18.0 MT',
    callStatus: 'Branch Call Pending',
    prqStatus: 'Rescheduled',
    ewayBillCount: 5,
  },
  {
    id: 'PP-3103',
    pickupId: 'PICK-3103',
    pickupDateTime: '2026-04-21T13:15',
    ewayBillNumber: '211007144908',
    ewayBillCreatedAt: '2026-04-21T10:05',
    customerName: 'Vedanta Resources',
    customerLocation: { name: 'Lanjigarh, Odisha', lat: 19.6324, lng: 83.1573 },
    poc: { name: 'Sunil Rao', phone: '+91 98765 43212' },
    expectedLoad: '9.4 MT',
    callStatus: 'AI Call Escalated to Branch',
    prqStatus: 'Cancelled',
    ewayBillCount: 2,
  },
  {
    id: 'PP-3104',
    pickupId: 'PICK-3104',
    pickupDateTime: '2026-04-21T16:00',
    ewayBillNumber: '331002458764',
    ewayBillCreatedAt: '2026-04-21T12:10',
    customerName: 'NTPC Limited',
    customerLocation: { name: 'Korba, Chhattisgarh', lat: 22.3595, lng: 82.7501 },
    poc: { name: 'Anjali Desai', phone: '+91 98765 43215' },
    expectedLoad: '21.3 MT',
    callStatus: 'Branch Call Completed',
    prqStatus: 'Confirmed',
    ewayBillCount: 6,
  },
  {
    id: 'PP-3105',
    pickupId: 'PICK-3105',
    pickupDateTime: '2026-04-22T08:45',
    ewayBillNumber: '241003872551',
    ewayBillCreatedAt: '2026-04-22T06:55',
    customerName: 'Hindalco Industries',
    customerLocation: { name: 'Renukoot, Uttar Pradesh', lat: 24.2086, lng: 83.0361 },
    poc: { name: 'Priya Sharma', phone: '+91 98765 43213' },
    expectedLoad: '14.2 MT',
    callStatus: 'AI Call Completed',
    prqStatus: 'Confirmed',
    ewayBillCount: 4,
  },
  {
    id: 'PP-3106',
    pickupId: 'PICK-3106',
    pickupDateTime: '2026-04-22T10:15',
    ewayBillNumber: '321008664102',
    ewayBillCreatedAt: '2026-04-22T08:05',
    customerName: 'Coal India',
    customerLocation: { name: 'Dhanbad, Jharkhand', lat: 23.7957, lng: 86.4304 },
    poc: { name: 'Vijay Singh', phone: '+91 98765 43214' },
    expectedLoad: '25.0 MT',
    callStatus: 'Branch Call Pending',
    prqStatus: 'Rescheduled',
    ewayBillCount: 7,
  },
  {
    id: 'PP-3107',
    pickupId: 'PICK-3107',
    pickupDateTime: '2026-04-22T12:30',
    ewayBillNumber: '191002347780',
    ewayBillCreatedAt: '2026-04-22T09:50',
    customerName: 'Power Grid Corp',
    customerLocation: { name: 'Gurugram, Haryana', lat: 28.4595, lng: 77.0266 },
    poc: { name: 'Rajiv Malhotra', phone: '+91 98765 43216' },
    expectedLoad: '8.8 MT',
    callStatus: 'AI Call In Progress',
    prqStatus: 'Rescheduled',
    ewayBillCount: 2,
  },
  {
    id: 'PP-3108',
    pickupId: 'PICK-3108',
    pickupDateTime: '2026-04-22T15:00',
    ewayBillNumber: '271000554321',
    ewayBillCreatedAt: '2026-04-22T11:40',
    customerName: 'ONGC Limited',
    customerLocation: { name: 'Dehradun, Uttarakhand', lat: 30.3165, lng: 78.0322 },
    poc: { name: 'Kavita Nair', phone: '+91 98765 43217' },
    expectedLoad: '16.7 MT',
    callStatus: 'Branch Call Completed',
    prqStatus: 'Confirmed',
    ewayBillCount: 5,
  },
  {
    id: 'PP-3109',
    pickupId: 'PICK-3109',
    pickupDateTime: '2026-04-22T17:20',
    ewayBillNumber: '091006782210',
    ewayBillCreatedAt: '2026-04-22T14:25',
    customerName: 'Indian Oil Corp',
    customerLocation: { name: 'Mathura, Uttar Pradesh', lat: 27.4924, lng: 77.6737 },
    poc: { name: 'Deepak Joshi', phone: '+91 98765 43218' },
    expectedLoad: '11.1 MT',
    callStatus: 'AI Call Escalated to Branch',
    prqStatus: 'Cancelled',
    ewayBillCount: 3,
  },
  {
    id: 'PP-3110',
    pickupId: 'PICK-3110',
    pickupDateTime: '2026-04-23T09:10',
    ewayBillNumber: '341005129873',
    ewayBillCreatedAt: '2026-04-23T07:20',
    customerName: 'BPCL Limited',
    customerLocation: { name: 'Kochi, Kerala', lat: 9.9312, lng: 76.2673 },
    poc: { name: 'Meera Menon', phone: '+91 98765 43219' },
    expectedLoad: '19.4 MT',
    callStatus: 'AI Call Scheduled',
    prqStatus: 'Rescheduled',
    ewayBillCount: 6,
  },
  {
    id: 'PP-3111',
    pickupId: 'PICK-3111',
    pickupDateTime: '2026-04-23T11:40',
    ewayBillNumber: '371001990214',
    ewayBillCreatedAt: '2026-04-23T08:55',
    customerName: 'HPCL Limited',
    customerLocation: { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
    poc: { name: 'Arjun Reddy', phone: '+91 98765 43220' },
    expectedLoad: '22.1 MT',
    callStatus: 'Branch Call Completed',
    prqStatus: 'Confirmed',
    ewayBillCount: 8,
  },
  {
    id: 'PP-3112',
    pickupId: 'PICK-3112',
    pickupDateTime: '2026-04-23T14:05',
    ewayBillNumber: '231007511640',
    ewayBillCreatedAt: '2026-04-23T10:30',
    customerName: 'GAIL India',
    customerLocation: { name: 'Vijaipur, Madhya Pradesh', lat: 26.2236, lng: 77.4896 },
    poc: { name: 'Sneha Kulkarni', phone: '+91 98765 43221' },
    expectedLoad: '13.3 MT',
    callStatus: 'AI Call In Progress',
    prqStatus: 'Rescheduled',
    ewayBillCount: 4,
  },
].map((item, index) => {
  const operatorContact = getOperatorContact(operators[index % operators.length], index);
  const driverContact = getDriverContact(drivers[(index + 4) % drivers.length], index + 4);

  return {
    ...item,
    operatorName: operatorContact.name,
    operatorContact,
    driver: driverContact.name,
    driverContact,
    callStatus: normalizePotentialCallStatus(item.callStatus),
    yellowFlagReason:
      index % 4 === 0 ? 'E-way bill and pickup window need manual review before dispatch.' : '',
  };
});

export const requestedPickups = [
  {
    id: 'REQ-4201',
    prqId: 'PRQ-4201',
    customer: 'Maruti Suzuki',
    customerAddress: { name: 'Manesar, Haryana', lat: 28.3511, lng: 76.9425 },
    contact: { name: 'Amit Bansal', phone: '+91 98211 45001' },
    pickupSlot: '2026-04-21T14:00',
    estimatedWeight: '1,876 kg',
    loadType: 'Palletized',
      prqMode: 'Potential',
    yellowFlagReason: 'Address pin and typed address differ by 2.3 km.',
    status: 'Rescheduled',
  },
  {
    id: 'REQ-4202',
    prqId: 'PRQ-4202',
    customer: 'Hyundai Motor',
    customerAddress: { name: 'Sriperumbudur, Tamil Nadu', lat: 12.9675, lng: 79.9419 },
    contact: { name: 'Karthik Raman', phone: '+91 98211 45002' },
    pickupSlot: '2026-04-21T15:30',
    estimatedWeight: '2,345 kg',
    loadType: 'Loose Cartons',
    prqMode: 'Scheduled',
    yellowFlagReason: '',
    status: 'Confirmed',
  },
  {
    id: 'REQ-4203',
    prqId: 'PRQ-4203',
    customer: 'Hero MotoCorp',
    customerAddress: { name: 'Gurugram, Haryana', lat: 28.4595, lng: 77.0266 },
    contact: { name: 'Neeraj Saini', phone: '+91 98211 45003' },
    pickupSlot: '2026-04-21T17:15',
    estimatedWeight: '1,654 kg',
    loadType: 'Crated',
      prqMode: 'Potential',
    yellowFlagReason: 'Repeated reschedule requests in the last 24 hours.',
    status: 'Cancelled',
  },
  {
    id: 'REQ-4204',
    prqId: 'PRQ-4204',
    customer: 'Ashok Leyland',
    customerAddress: { name: 'Ennore, Chennai', lat: 13.2146, lng: 80.3203 },
    contact: { name: 'Swetha Ravi', phone: '+91 98211 45004' },
    pickupSlot: '2026-04-22T09:00',
    estimatedWeight: '3,280 kg',
    loadType: 'Machinery',
    prqMode: 'Scheduled',
    yellowFlagReason: '',
    status: 'Confirmed',
  },
  {
    id: 'REQ-4205',
    prqId: 'PRQ-4205',
    customer: 'TVS Motor',
    customerAddress: { name: 'Hosur, Tamil Nadu', lat: 12.7409, lng: 77.8253 },
    contact: { name: 'Rohit Narayan', phone: '+91 98211 45005' },
    pickupSlot: '2026-04-22T10:30',
    estimatedWeight: '1,240 kg',
    loadType: 'Spare Parts',
      prqMode: 'Potential',
    yellowFlagReason: 'POC mobile number failed automated verification.',
    status: 'Rescheduled',
  },
  {
    id: 'REQ-4206',
    prqId: 'PRQ-4206',
    customer: 'Bosch India',
    customerAddress: { name: 'Bidadi, Karnataka', lat: 12.7975, lng: 77.3836 },
    contact: { name: 'Maya Joseph', phone: '+91 98211 45006' },
    pickupSlot: '2026-04-22T12:15',
    estimatedWeight: '2,910 kg',
    loadType: 'Palletized',
    prqMode: 'Chatbot',
    yellowFlagReason: '',
    status: 'Confirmed',
  },
  {
    id: 'REQ-4207',
    prqId: 'PRQ-4207',
    customer: 'CEAT Tyres',
    customerAddress: { name: 'Halol, Gujarat', lat: 22.5039, lng: 73.4737 },
    contact: { name: 'Hemant Patel', phone: '+91 98211 45007' },
    pickupSlot: '2026-04-22T14:45',
    estimatedWeight: '4,380 kg',
    loadType: 'Tyres',
    prqMode: 'Scheduled',
    yellowFlagReason: 'Expected weight is above route average and needs review.',
    status: 'Cancelled',
  },
  {
    id: 'REQ-4208',
    prqId: 'PRQ-4208',
    customer: 'Apollo Hospitals',
    customerAddress: { name: 'Jubilee Hills, Hyderabad', lat: 17.4326, lng: 78.4071 },
    contact: { name: 'Nazia Khan', phone: '+91 98211 45008' },
    pickupSlot: '2026-04-22T16:00',
    estimatedWeight: '860 kg',
    loadType: 'Medical Equipment',
    prqMode: 'Chatbot',
    yellowFlagReason: '',
    status: 'Confirmed',
  },
  {
    id: 'REQ-4209',
    prqId: 'PRQ-4209',
    customer: 'Pidilite Industries',
    customerAddress: { name: 'Mahad, Maharashtra', lat: 18.0830, lng: 73.4178 },
    contact: { name: 'Shubham More', phone: '+91 98211 45009' },
    pickupSlot: '2026-04-23T09:20',
    estimatedWeight: '1,970 kg',
    loadType: 'Drums',
    prqMode: 'Bulk Upload',
    yellowFlagReason: '',
    status: 'Rescheduled',
  },
  {
    id: 'REQ-4210',
    prqId: 'PRQ-4210',
    customer: 'Blue Star',
    customerAddress: { name: 'Wada, Maharashtra', lat: 19.6552, lng: 73.1380 },
    contact: { name: 'Kedar Joshi', phone: '+91 98211 45010' },
    pickupSlot: '2026-04-23T11:10',
    estimatedWeight: '2,260 kg',
    loadType: 'Finished Goods',
    prqMode: 'Scheduled',
    yellowFlagReason: 'Customer address geocode is low confidence.',
    status: 'Rescheduled',
  },
  {
    id: 'REQ-4211',
    prqId: 'PRQ-4211',
    customer: 'Crompton',
    customerAddress: { name: 'Baddi, Himachal Pradesh', lat: 30.9578, lng: 76.7914 },
    contact: { name: 'Anmol Verma', phone: '+91 98211 45011' },
    pickupSlot: '2026-04-23T13:35',
    estimatedWeight: '3,040 kg',
    loadType: 'Cartons',
    prqMode: 'Chatbot',
    yellowFlagReason: '',
    status: 'Confirmed',
  },
  {
    id: 'REQ-4212',
    prqId: 'PRQ-4212',
    customer: 'Whirlpool India',
    customerAddress: { name: 'Faridabad, Haryana', lat: 28.4089, lng: 77.3178 },
    contact: { name: 'Puneet Arora', phone: '+91 98211 45012' },
    pickupSlot: '2026-04-23T15:50',
    estimatedWeight: '2,720 kg',
    loadType: 'Appliances',
    prqMode: 'Bulk Upload',
    yellowFlagReason: 'Request was modified twice after confirmation.',
    status: 'Cancelled',
  },
].map((item, index) => {
  const operatorContact = getOperatorContact(operators[(index + 1) % operators.length], index + 1);
  const driverContact = getDriverContact(drivers[(index + 7) % drivers.length], index + 7);

  return {
    ...item,
    operatorName: operatorContact.name,
    operatorContact,
    driver: driverContact.name,
    driverContact,
    assignedTripId:
      index % 4 === 0
        ? '__create_new__'
        : scheduledPickupTripsInProgress[index % scheduledPickupTripsInProgress.length].id,
    selectedVehicleId:
      scheduledPickupVehicleOptions[(index + 2) % scheduledPickupVehicleOptions.length].id,
    transporterDetails:
      scheduledPickupVehicleOptions[(index + 2) % scheduledPickupVehicleOptions.length].transporter,
    liveVehicleRoute:
      scheduledPickupVehicleOptions[(index + 2) % scheduledPickupVehicleOptions.length].routeToBranch,
    etaToBranch:
      scheduledPickupVehicleOptions[(index + 2) % scheduledPickupVehicleOptions.length].etaToBranch,
    branchLocation:
      scheduledPickupVehicleOptions[(index + 2) % scheduledPickupVehicleOptions.length].branch,
    additionalVehicleId: '',
    additionalVehicleDetails: null,
    subPrqId: '',
    marketVehicleRequest: null,
    lastEditedBy: index % 2 === 0 ? 'Ananya Singh' : '',
    lastEditedAt: index % 2 === 0 ? `2026-04-${String(17 + index).padStart(2, '0')}T0${(index % 5) + 9}:15` : '',
    editedValues:
      index % 2 === 0
        ? ['Pickup Slot: reassigned to next feeder run', 'Customer Address: geocode adjusted']
        : [],
  };
});

export const ftlVehicleSizeOptions = [
  '17 ft',
  '20 ft',
  '32 ft Container',
  '40 ft Container',
];

export const ftlStatusOptions = [
  'Sourcing in Progress',
  'Vehicle Allocated',
  'Vehicle Reported',
  'Loading in Progress',
  'Dispatched',
  'In Transit',
  'Reached Destination',
  'Delivered',
  'POD Received',
];

const normalizeFTLStatus = (status, hasRecommendedVehicle) => {
  const normalizedStatus = (status || '').toLowerCase();

  if (normalizedStatus.includes('pod')) {
    return 'POD Received';
  }

  if (normalizedStatus.includes('deliver')) {
    return 'Delivered';
  }

  if (normalizedStatus.includes('destination')) {
    return 'Reached Destination';
  }

  if (normalizedStatus.includes('transit')) {
    return 'In Transit';
  }

  if (normalizedStatus.includes('dispatch')) {
    return 'Dispatched';
  }

  if (normalizedStatus.includes('loading')) {
    return 'Loading in Progress';
  }

  if (normalizedStatus.includes('report')) {
    return 'Vehicle Reported';
  }

  if (normalizedStatus.includes('allocat') || hasRecommendedVehicle) {
    return 'Vehicle Allocated';
  }

  if (normalizedStatus.includes('sourcing') || normalizedStatus.includes('pending') || normalizedStatus.includes('awaiting')) {
    return 'Sourcing in Progress';
  }

  return hasRecommendedVehicle ? 'Vehicle Allocated' : 'Sourcing in Progress';
};

const extractVehicleNumber = (vehicleSource) =>
  vehicleSource?.match(/[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}/)?.[0] || '';

const ftlVehicleSourceDirectory = {
  '32 ft Container': [
    'Pune Branch Vehicle - MH-12-AB-2468',
    'Nagpur Branch Vehicle - MH-49-EF-8642',
    'Nashik Branch Vehicle - MH-15-ZX-4217',
  ],
  '40 ft Container': [
    'Mumbai Branch Vehicle - MH-02-CD-1357',
    'Ahmedabad Branch Vehicle - GJ-01-LM-7843',
    'Pune Branch Vehicle - MH-12-QR-5521',
  ],
  '20 ft': [
    'Mumbai Branch Vehicle - MH-02-KL-4421',
    'Nagpur Branch Vehicle - MH-49-PQ-1184',
    'Pune Branch Vehicle - MH-12-TU-6305',
  ],
  '17 ft': [
    'Pune Branch Vehicle - MH-12-RS-2408',
    'Nagpur Branch Vehicle - MH-49-VW-7720',
    'Mumbai Branch Vehicle - MH-02-YZ-9163',
  ],
};

const ftlProcurers = [
  { name: 'Aman Verma', phone: '+91 98770 61001', email: 'aman.verma@omlogistics.example', employeeId: 'OM-PROC-1041' },
  { name: 'Priya Nair', phone: '+91 98770 61002', email: 'priya.nair@omlogistics.example', employeeId: 'OM-PROC-1088' },
  { name: 'Rohit Sinha', phone: '+91 98770 61003', email: 'rohit.sinha@omlogistics.example', employeeId: 'OM-PROC-1126' },
  { name: 'Kavya Menon', phone: '+91 98770 61004', email: 'kavya.menon@omlogistics.example', employeeId: 'OM-PROC-1174' },
];

export const ftlPickups = [
  {
    id: 'FTL-9821',
    prqId: 'PRQ-FTL-9821',
    customer: 'Tata Motors',
    customerAddress: 'Pune, Maharashtra',
    contact: { name: 'Sanjay Kulkarni', phone: '+91 98980 44001' },
    pickupSlot: '2026-04-21T18:00',
    vehicleSize: '32 ft Container',
    pocContact: { name: 'Nilesh Patil', phone: '+91 98980 44011' },
    requestor: { name: 'Ritu Sharma', phone: '+91 98980 44101' },
    status: 'Pending Vehicle',
    vehicleSource: 'Pune Branch Vehicle - MH-12-AB-2468',
  },
  {
    id: 'FTL-9822',
    prqId: 'PRQ-FTL-9822',
    customer: 'Mahindra & Mahindra',
    customerAddress: 'Nashik, Maharashtra',
    contact: { name: 'Harish Nair', phone: '+91 98980 44002' },
    pickupSlot: '2026-04-22T08:30',
    vehicleSize: '40 ft Container',
    pocContact: { name: 'Ramesh Yadav', phone: '+91 98980 44012' },
    requestor: { name: 'Asha Menon', phone: '+91 98980 44102' },
    status: 'Vehicle Allocated',
    vehicleSource: 'Market Source',
  },
  {
    id: 'FTL-9823',
    prqId: 'PRQ-FTL-9823',
    customer: 'Adani Wilmar',
    customerAddress: 'Mundra, Gujarat',
    contact: { name: 'Devansh Shah', phone: '+91 98980 44003' },
    pickupSlot: '2026-04-22T12:45',
    vehicleSize: '20 ft',
    pocContact: { name: 'Mitesh Solanki', phone: '+91 98980 44013' },
    requestor: { name: 'Kavya Trivedi', phone: '+91 98980 44103' },
    status: 'Awaiting Confirmation',
    vehicleSource: 'Mumbai Branch Vehicle - MH-02-CD-1357',
  },
  {
    id: 'FTL-9824',
    prqId: 'PRQ-FTL-9824',
    customer: 'UltraTech Cement',
    customerAddress: 'Kotputli, Rajasthan',
    contact: { name: 'Saket Jain', phone: '+91 98980 44004' },
    pickupSlot: '2026-04-23T07:30',
    vehicleSize: '40 ft Container',
    pocContact: { name: 'Dheeraj Kumar', phone: '+91 98980 44014' },
    requestor: { name: 'Shweta Batra', phone: '+91 98980 44104' },
    status: 'Pending Vehicle',
    vehicleSource: 'Market Source',
  },
  {
    id: 'FTL-9825',
    prqId: 'PRQ-FTL-9825',
    customer: 'Asian Paints',
    customerAddress: 'Ankleshwar, Gujarat',
    contact: { name: 'Faizan Shaikh', phone: '+91 98980 44005' },
    pickupSlot: '2026-04-23T10:15',
    vehicleSize: '32 ft Container',
    pocContact: { name: 'Jayesh Parmar', phone: '+91 98980 44015' },
    requestor: { name: 'Rachna Sood', phone: '+91 98980 44105' },
    status: 'Dispatched',
    vehicleSource: 'Nagpur Branch Vehicle - MH-49-EF-8642',
  },
  {
    id: 'FTL-9826',
    prqId: 'PRQ-FTL-9826',
    customer: 'Nestle India',
    customerAddress: 'Moga, Punjab',
    contact: { name: 'Ishaan Khurana', phone: '+91 98980 44006' },
    pickupSlot: '2026-04-23T13:40',
    vehicleSize: '20 ft',
    pocContact: { name: 'Lovepreet Singh', phone: '+91 98980 44016' },
    requestor: { name: 'Megha Suri', phone: '+91 98980 44106' },
    status: 'Awaiting Confirmation',
    vehicleSource: 'Market Source',
  },
  {
    id: 'FTL-9827',
    prqId: 'PRQ-FTL-9827',
    customer: 'ACC Limited',
    customerAddress: 'Wadi, Karnataka',
    contact: { name: 'Girish Patil', phone: '+91 98980 44007' },
    pickupSlot: '2026-04-23T16:10',
    vehicleSize: '40 ft Container',
    pocContact: { name: 'Raghu Hegde', phone: '+91 98980 44017' },
    requestor: { name: 'Neha Bansal', phone: '+91 98980 44107' },
    status: 'In Transit',
    vehicleSource: 'Mumbai Branch Vehicle - MH-02-CD-1357',
  },
  {
    id: 'FTL-9828',
    prqId: 'PRQ-FTL-9828',
    customer: 'Dabur India',
    customerAddress: 'Pantnagar, Uttarakhand',
    contact: { name: 'Manav Kapoor', phone: '+91 98980 44008' },
    pickupSlot: '2026-04-24T08:20',
    vehicleSize: '17 ft',
    pocContact: { name: 'Prakash Rawat', phone: '+91 98980 44018' },
    requestor: { name: 'Ananya Seth', phone: '+91 98980 44108' },
    status: 'Reached Destination',
    vehicleSource: 'Pune Branch Vehicle - MH-12-AB-2468',
  },
  {
    id: 'FTL-9829',
    prqId: 'PRQ-FTL-9829',
    customer: 'JK Tyre',
    customerAddress: 'Kankroli, Rajasthan',
    contact: { name: 'Tarun Mathur', phone: '+91 98980 44009' },
    pickupSlot: '2026-04-24T11:55',
    vehicleSize: '32 ft Container',
    pocContact: { name: 'Rakesh Chouhan', phone: '+91 98980 44019' },
    requestor: { name: 'Priyal Dave', phone: '+91 98980 44109' },
    status: 'Delivered',
    vehicleSource: 'Market Source',
  },
  {
    id: 'FTL-9830',
    prqId: 'PRQ-FTL-9830',
    customer: 'PepsiCo India',
    customerAddress: 'Sangareddy, Telangana',
    contact: { name: 'Vikram Rao', phone: '+91 98980 44010' },
    pickupSlot: '2026-04-24T15:25',
    vehicleSize: '20 ft',
    pocContact: { name: 'Sai Charan', phone: '+91 98980 44020' },
    requestor: { name: 'Ira Malhotra', phone: '+91 98980 44110' },
    status: 'POD Received',
    vehicleSource: 'Nagpur Branch Vehicle - MH-49-EF-8642',
  },
  {
    id: 'FTL-9831',
    prqId: 'PRQ-FTL-9831',
    customer: 'Britannia Industries',
    customerAddress: 'Ranjangaon, Maharashtra',
    contact: { name: 'Sumeet Gokhale', phone: '+91 98980 44021' },
    pickupSlot: '2026-04-24T17:15',
    vehicleSize: '32 ft Container',
    pocContact: { name: 'Omkar Jagtap', phone: '+91 98980 44031' },
    requestor: { name: 'Shalini Purohit', phone: '+91 98980 44111' },
    status: 'Dispatched',
    vehicleSource: 'Pune Branch Vehicle - MH-12-AB-2468',
  },
  {
    id: 'FTL-9832',
    prqId: 'PRQ-FTL-9832',
    customer: 'Pidilite Industries',
    customerAddress: 'Vapi, Gujarat',
    contact: { name: 'Rohan Mehta', phone: '+91 98980 44022' },
    pickupSlot: '2026-04-25T07:45',
    vehicleSize: '20 ft',
    pocContact: { name: 'Hemant Joshi', phone: '+91 98980 44032' },
    requestor: { name: 'Niharika Bose', phone: '+91 98980 44112' },
    status: 'In Transit',
    vehicleSource: 'Mumbai Branch Vehicle - MH-02-KL-4421',
  },
  {
    id: 'FTL-9833',
    prqId: 'PRQ-FTL-9833',
    customer: 'Parle Products',
    customerAddress: 'Neemrana, Rajasthan',
    contact: { name: 'Vivek Saini', phone: '+91 98980 44023' },
    pickupSlot: '2026-04-25T10:30',
    vehicleSize: '17 ft',
    pocContact: { name: 'Gaurav Dahiya', phone: '+91 98980 44033' },
    requestor: { name: 'Mansi Kapoor', phone: '+91 98980 44113' },
    status: 'Reached Destination',
    vehicleSource: 'Pune Branch Vehicle - MH-12-RS-2408',
  },
  {
    id: 'FTL-9834',
    prqId: 'PRQ-FTL-9834',
    customer: 'Colgate Palmolive',
    customerAddress: 'Baddi, Himachal Pradesh',
    contact: { name: 'Anurag Thakur', phone: '+91 98980 44024' },
    pickupSlot: '2026-04-25T13:50',
    vehicleSize: '40 ft Container',
    pocContact: { name: 'Ritu Sood', phone: '+91 98980 44034' },
    requestor: { name: 'Preeti Arora', phone: '+91 98980 44114' },
    status: 'Delivered',
    vehicleSource: 'Ahmedabad Branch Vehicle - GJ-01-LM-7843',
  },
  {
    id: 'FTL-9835',
    prqId: 'PRQ-FTL-9835',
    customer: 'Reliance Retail',
    customerAddress: 'Silvassa, Dadra & Nagar Haveli',
    contact: { name: 'Rahul Desai', phone: '+91 98980 44025' },
    pickupSlot: '2026-04-25T16:20',
    vehicleSize: '32 ft Container',
    pocContact: { name: 'Kamlesh Shah', phone: '+91 98980 44035' },
    requestor: { name: 'Aditi Verma', phone: '+91 98980 44115' },
    status: 'Dispatched',
    vehicleSource: 'Market Source',
  },
  {
    id: 'FTL-9836',
    prqId: 'PRQ-FTL-9836',
    customer: 'Marico Limited',
    customerAddress: 'Jalgaon, Maharashtra',
    contact: { name: 'Santosh Chavan', phone: '+91 98980 44026' },
    pickupSlot: '2026-04-26T08:15',
    vehicleSize: '20 ft',
    pocContact: { name: 'Ajay Munde', phone: '+91 98980 44036' },
    requestor: { name: 'Pooja Reddy', phone: '+91 98980 44116' },
    status: 'In Transit',
    vehicleSource: 'Pune Branch Vehicle - MH-12-TU-6305',
  },
  {
    id: 'FTL-9837',
    prqId: 'PRQ-FTL-9837',
    customer: 'Godrej Consumer',
    customerAddress: 'Malanpur, Madhya Pradesh',
    contact: { name: 'Vikas Tomar', phone: '+91 98980 44027' },
    pickupSlot: '2026-04-26T11:45',
    vehicleSize: '17 ft',
    pocContact: { name: 'Ravi Jatav', phone: '+91 98980 44037' },
    requestor: { name: 'Sneha Patel', phone: '+91 98980 44117' },
    status: 'Reached Destination',
    vehicleSource: 'Market Source',
  },
  {
    id: 'FTL-9838',
    prqId: 'PRQ-FTL-9838',
    customer: 'ITC Limited',
    customerAddress: 'Haridwar, Uttarakhand',
    contact: { name: 'Amitabh Singh', phone: '+91 98980 44028' },
    pickupSlot: '2026-04-26T14:30',
    vehicleSize: '40 ft Container',
    pocContact: { name: 'Deepak Bisht', phone: '+91 98980 44038' },
    requestor: { name: 'Neha Sharma', phone: '+91 98980 44118' },
    status: 'POD Received',
    vehicleSource: 'Ahmedabad Branch Vehicle - GJ-01-LM-7843',
  },
  {
    id: 'FTL-9839',
    prqId: 'PRQ-FTL-9839',
    customer: 'Hindustan Unilever',
    customerAddress: 'Khamgaon, Maharashtra',
    contact: { name: 'Karan Singh', phone: '+91 98980 44029' },
    pickupSlot: '2026-04-26T15:45',
    vehicleSize: '20 ft',
    pocContact: { name: 'Praveen Kadam', phone: '+91 98980 44039' },
    requestor: { name: 'Geeta Phogat', phone: '+91 98980 44119' },
    status: 'Loading in Progress',
    vehicleSource: 'Pune Branch Vehicle - MH-12-AB-2468',
    procurer: null,
  },
  {
    id: 'FTL-9840',
    prqId: 'PRQ-FTL-9840',
    customer: 'Wipro Limited',
    customerAddress: 'Tumkur, Karnataka',
    contact: { name: 'Srinivas Rao', phone: '+91 98980 44030' },
    pickupSlot: '2026-04-26T17:15',
    vehicleSize: '32 ft Container',
    pocContact: { name: 'Ramesh Babu', phone: '+91 98980 44040' },
    requestor: { name: 'Sita Ramam', phone: '+91 98980 44120' },
    status: 'Loading in Progress',
    vehicleSource: 'Market Source',
    procurer: null,
  },
].map((item, index) => {
  const operatorContact = getOperatorContact(operators[(index + 2) % operators.length], index + 2);
  const driverContact = getDriverContact(drivers[(index + 9) % drivers.length], index + 9);
  const hasRecommendedVehicle = item.vehicleSource !== 'Market Source';
  const vehicleSourceOptions = hasRecommendedVehicle
    ? Array.from(new Set([item.vehicleSource, ...(ftlVehicleSourceDirectory[item.vehicleSize] || [])]))
    : [];
  const allocatedVehicleNumber = hasRecommendedVehicle
    ? extractVehicleNumber(item.vehicleSource) || 'MH-12-AB-2468'
    : 'No vehicle available';

  return {
    ...item,
    requestedVehicleDetail: item.vehicleSize,
    vehicleSourceOptions,
    selectedVehicleSource: hasRecommendedVehicle ? item.vehicleSource : '',
    allocatedVehicleNumber,
    recommendedVehicleSource: hasRecommendedVehicle
      ? 'Auto selected'
      : 'No recommended branch vehicle available',
    recommendedVehicleAvailable: hasRecommendedVehicle,
    marketSourcingRequested: false,
    marketSourcingReason: '',
    operatorName: operatorContact.name,
    operatorContact,
    driver: driverContact.name,
    driverContact,
    procurer: 'procurer' in item ? item.procurer : ftlProcurers[index % ftlProcurers.length],
    status: normalizeFTLStatus(item.status, hasRecommendedVehicle),
    yellowFlagReason:
      index % 3 === 0 ? 'Vehicle source and loading slot overlap with an active dispatch.' : '',
  };
});

export const appointmentCNs = [
  {
    id: 'CN-LM-1001',
    cn: 'CN-LM-1001',
    customer: 'Apollo Pharmacy',
    customerAddress: 'Shop 18, Saket District Centre, New Delhi',
    invoices: ['INV-AP-1001', 'INV-AP-1002'],
    boxes: 24,
    weight: '420 kg',
    appointmentDate: '2026-04-22',
    appointmentSlot: '10:00 - 11:00',
    referenceNo: 'REF-DEL-8801',
    vehicleSuggestion: '17 ft Closed Body',
    operatorName: 'Neha Desk',
    driver: 'Rajesh Kumar',
    status: 'Confirmed',
    yellowFlagReason: '',
  },
  {
    id: 'CN-LM-1002',
    cn: 'CN-LM-1002',
    customer: 'Big Basket',
    customerAddress: 'Plot 5, Sector 12 Market, Dwarka, New Delhi',
    invoices: ['INV-BB-2401'],
    boxes: 18,
    weight: '295 kg',
    appointmentDate: '2026-04-22',
    appointmentSlot: '11:30 - 12:15',
    referenceNo: 'REF-DEL-8802',
    vehicleSuggestion: '20 ft Truck',
    operatorName: 'Ravi Operator',
    driver: 'Amit Sharma',
    status: 'Pending Confirmation',
    yellowFlagReason: 'Appointment window is close to route cutoff.',
  },
  {
    id: 'CN-LM-1003',
    cn: 'CN-LM-1003',
    customer: 'Reliance Fresh',
    customerAddress: 'Tower C, Sector 62 Commercial Block, Noida',
    invoices: ['INV-RF-3301', 'INV-RF-3302', 'INV-RF-3303'],
    boxes: 31,
    weight: '510 kg',
    appointmentDate: '2026-04-22',
    appointmentSlot: '13:00 - 14:00',
    referenceNo: 'REF-NCR-8803',
    vehicleSuggestion: '17 ft Closed Body',
    operatorName: 'Amit Ops',
    driver: 'Priya Patel',
    status: 'Confirmed',
    yellowFlagReason: '',
  },
  {
    id: 'CN-LM-1004',
    cn: 'CN-LM-1004',
    customer: 'Croma',
    customerAddress: 'Mall Mile Complex, Sector 29, Gurugram',
    invoices: ['INV-CR-9011', 'INV-CR-9012'],
    boxes: 16,
    weight: '260 kg',
    appointmentDate: '2026-04-22',
    appointmentSlot: '15:00 - 16:00',
    referenceNo: 'REF-GGN-8804',
    vehicleSuggestion: '32 ft Container',
    operatorName: 'Vikram Desk',
    driver: 'Vikram Singh',
    status: 'Cancelled',
    yellowFlagReason: 'Customer requested confirmation callback before dispatch.',
  },
].map((item, index) => ({
  ...item,
  deliveryLocation: item.customerAddress,
  timeWindow: item.appointmentSlot,
  invoiceCount: item.invoices.length,
  operatorContact: getOperatorContact(item.operatorName, index),
  driverContact: getDriverContact(item.driver, index),
}));
  
export const regularCNs = [
  {
    id: 'CN-LM-2001',
    cn: 'CN-LM-2001',
    type: 'CN',
    customer: 'Metro Wholesale',
    customerAddress: 'Warehouse 3, Sector 15, Rohini, New Delhi',
    invoices: ['INV-MW-2001', 'INV-MW-2002'],
    boxes: 22,
    weight: '420 kg',
    priority: 'High',
    operatorName: 'Ravi Operator',
    driver: 'Kavita Nair',
    status: 'Confirmed',
    yellowFlagReason: '',
  },
  {
    id: 'CN-LM-2002',
    cn: 'CN-LM-2002',
    type: 'CN',
    customer: 'Medicure Plus',
    customerAddress: '11/4 Main Vikas Marg, Laxmi Nagar, Delhi',
    invoices: ['INV-MP-1210'],
    boxes: 14,
    weight: '280 kg',
    priority: 'Medium',
    operatorName: 'Neha Desk',
    driver: 'Suresh Iyer',
    status: 'Pending Confirmation',
    yellowFlagReason: 'Delivery address geocode and typed address need confirmation.',
  },
  {
    id: 'CN-LM-2003',
    cn: 'CN-LM-2003',
    type: 'CN',
    customer: 'Urban Mart',
    customerAddress: 'Plot 81, Sector 58 Industrial Area, Faridabad',
    invoices: ['INV-UM-7781', 'INV-UM-7782', 'INV-UM-7783'],
    boxes: 27,
    weight: '510 kg',
    priority: 'High',
    operatorName: 'Amit Ops',
    driver: 'Deepak Joshi',
    status: 'Confirmed',
    yellowFlagReason: '',
  },
  {
    id: 'CN-LM-2004',
    cn: 'CN-LM-2004',
    type: 'CN',
    customer: 'Daily Needs',
    customerAddress: 'Transport Nagar Yard, Bahadurgarh, Haryana',
    invoices: ['INV-DN-9091'],
    boxes: 19,
    weight: '360 kg',
    priority: 'Low',
    operatorName: 'Vikram Desk',
    driver: 'Meera Kulkarni',
    status: 'Cancelled',
    yellowFlagReason: 'Consignee not reachable for unloading confirmation.',
  },
].map((item, index) => ({
  ...item,
  location: item.customerAddress,
  volume: item.boxes ? `${(item.boxes / 8).toFixed(1)} m3` : 'N/A',
  deliveryTimeWindow:
    ['09:30 - 10:30', '11:00 - 12:00', '13:15 - 14:15', '15:30 - 16:10'][index] || 'Flexible',
  invoiceCount: item.invoices.length,
  operatorContact: getOperatorContact(item.operatorName, index + 4),
  driverContact: getDriverContact(item.driver, index + 4),
}));

export const yellowFlagCNs = [...appointmentCNs, ...regularCNs].filter(
  (item) => item.yellowFlagReason
);
export const labourResources = [];
export const docks = [];
export const smartTripDrivers = [
  { id: 'DRV-201', name: 'Rajesh Kumar', phone: '+91 98991 11001', successRate: '96%', branch: 'Delhi Hub' },
  { id: 'DRV-202', name: 'Aman Yadav', phone: '+91 98991 11002', successRate: '94%', branch: 'Gurugram Hub' },
  { id: 'DRV-203', name: 'Pankaj Chauhan', phone: '+91 98991 11003', successRate: '92%', branch: 'Noida Hub' },
  { id: 'DRV-204', name: 'Saurabh Malik', phone: '+91 98991 11004', successRate: '95%', branch: 'West Delhi Hub' },
];

export const smartTripVehicles = [
  { id: 'VH-301', label: '32 ft Container', number: 'DL-01-CD-1245', type: 'Closed Body', totalCapacity: '3.0 T', utilizedCapacity: '2.76 T', remainingCapacity: '0.24 T' },
  { id: 'VH-302', label: '20 ft Truck', number: 'HR-55-EF-8821', type: 'Open Body', totalCapacity: '2.2 T', utilizedCapacity: '1.72 T', remainingCapacity: '0.48 T' },
  { id: 'VH-303', label: '17 ft Truck', number: 'UP-16-GH-4431', type: 'Closed Body', totalCapacity: '1.8 T', utilizedCapacity: '1.28 T', remainingCapacity: '0.52 T' },
  { id: 'VH-304', label: '40 ft Trailer', number: 'DL-1L-JK-9020', type: 'High Deck', totalCapacity: '5.0 T', utilizedCapacity: '4.15 T', remainingCapacity: '0.85 T' },
];

export const nearbyBranchVehicles = [
  { id: 'NBV-401', branch: 'Gurugram Hub', label: '20 ft Truck', number: 'HR-38-AT-4412', eta: '22 min', capacity: '2.0 T', status: 'Empty' },
  { id: 'NBV-402', branch: 'Noida Hub', label: '17 ft Truck', number: 'UP-16-BX-2204', eta: '31 min', capacity: '1.7 T', status: 'Empty' },
  { id: 'NBV-403', branch: 'West Delhi Hub', label: '32 ft Container', number: 'DL-1M-CQ-1008', eta: '39 min', capacity: '3.0 T', status: 'Empty' },
];

const parseDurationToMinutes = (duration) => {
  const hours = Number(duration.match(/(\d+)h/i)?.[1] || 0);
  const minutes = Number(duration.match(/(\d+)m/i)?.[1] || 0);
  return hours * 60 + minutes;
};

const formatDurationMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
};

const getVehicleSizeRank = (label = '') => {
  if (label.includes('17 ft')) return 1;
  if (label.includes('20 ft')) return 2;
  if (label.includes('32 ft')) return 3;
  if (label.includes('40 ft')) return 4;
  return 0;
};

const tripConstraintRules = {
  'route-a-south-delhi': {
    zoneName: 'South Delhi mixed-access zone',
    maxVehicleSize: '20 ft Truck',
    requiredVehicleCount: 2,
    impactedAreas: ['Lajpat Nagar', 'Nehru Place', 'Saket'],
    reason: 'Dense market lanes and timed entry restrictions require splitting the route into smaller vehicles.',
    additionalVehicleIds: [],
  },
  'route-d-west-delhi': {
    zoneName: 'West Delhi lane-restriction cluster',
    maxVehicleSize: '20 ft Truck',
    requiredVehicleCount: 2,
    impactedAreas: ['Punjabi Bagh', 'Paschim Vihar', 'Nangloi'],
    reason: 'Trailer turning radius is restricted in the interior delivery lanes for these touchpoints.',
    additionalVehicleIds: ['VH-302'],
  },
  'route-o-aerocity-corridor': {
    zoneName: 'Aerocity controlled-access corridor',
    maxVehicleSize: '17 ft Truck',
    requiredVehicleCount: 3,
    impactedAreas: ['Aerocity', 'Vasant Kunj', 'Safdarjung Enclave'],
    reason: 'Airport corridor dwell-time rules and enclave access limits require additional smaller vehicles.',
    additionalVehicleIds: ['VH-303'],
  },
};

const reconciliationStatuses = ['Pending Reconciliation', 'Closure Review', 'Payment Pending', 'Ready to Close'];
const reconciliationPaymentActions = ['Collect COD', 'Release vendor payment', 'Reconcile freight bill', 'Hold for claim review'];

export const sampleTrips = [
  {
    id: 'route-a-south-delhi',
    routeName: 'Route A - South Delhi',
    aiConfidence: 94,
    cnsCount: 18,
    cnsWeight: '820 kg',
    prqsCount: 5,
    prqsWeight: '210 kg',
    estimatedTime: '4h 30m',
    distance: '45.2 km',
    client: 'Om Retail',
    vehicleUtilization: 92,
    idleDispatchTime: '18 min',
    consignmentCount: 4,
    boxes: 150,
    totalWeight: '1000 KG',
    status: 'Recommended',
    driver: smartTripDrivers[0],
    vehicle: smartTripVehicles[0],
    stops: [
      { id: 'CN-2024-009', type: 'Pickup', label: 'Sector 15, Rohini', client: 'Om Retail', address: 'Sector 15, Rohini, Delhi', cns: 8, boxes: 24, weight: '4.5 kg', timeWindow: '12:20 - 14:20', lat: 28.7402, lng: 77.1114 },
      { id: 'CN-2024-014', type: 'Appointment', label: 'Kirti Nagar DC', client: 'Om Retail', address: 'Kirti Nagar, Delhi', cns: 3, boxes: 36, weight: '115 kg', timeWindow: '13:10 - 14:00', lat: 28.6534, lng: 77.1444 },
      { id: 'PRQ-4412', type: 'Pickup', label: 'Lajpat Nagar', client: 'Om Retail', address: 'Lajpat Nagar, Delhi', cns: 2, boxes: 28, weight: '96 kg', timeWindow: '14:30 - 15:20', lat: 28.5677, lng: 77.2431 },
      { id: 'CN-2024-027', type: 'Appointment', label: 'Saket Fulfilment', client: 'Om Retail', address: 'Saket, Delhi', cns: 4, boxes: 31, weight: '138 kg', timeWindow: '15:40 - 16:25', lat: 28.5245, lng: 77.2066 },
      { id: 'PRQ-4431', type: 'Pickup', label: 'Nehru Place', client: 'Om Retail', address: 'Nehru Place, Delhi', cns: 1, boxes: 31, weight: '646 kg', timeWindow: '16:40 - 17:35', lat: 28.5494, lng: 77.2513 },
    ],
  },
  {
    id: 'route-b-gurugram-core',
    routeName: 'Route B - Gurugram Core',
    aiConfidence: 91,
    cnsCount: 14,
    cnsWeight: '630 kg',
    prqsCount: 4,
    prqsWeight: '180 kg',
    estimatedTime: '3h 45m',
    distance: '38.8 km',
    client: 'Metro Bazaar',
    vehicleUtilization: 78,
    idleDispatchTime: '12 min',
    consignmentCount: 5,
    boxes: 114,
    totalWeight: '810 KG',
    status: 'Recommended',
    driver: smartTripDrivers[1],
    vehicle: smartTripVehicles[1],
    stops: [
      { id: 'CN-2024-101', type: 'Pickup', label: 'Udyog Vihar', client: 'Metro Bazaar', address: 'Udyog Vihar Phase 3, Gurugram', cns: 4, boxes: 22, weight: '120 kg', timeWindow: '09:30 - 10:15', lat: 28.4978, lng: 77.0833 },
      { id: 'PRQ-4510', type: 'Pickup', label: 'Cyber City', client: 'Metro Bazaar', address: 'Cyber City, Gurugram', cns: 2, boxes: 18, weight: '82 kg', timeWindow: '10:30 - 11:10', lat: 28.4949, lng: 77.0890 },
      { id: 'CN-2024-118', type: 'Appointment', label: 'Golf Course Road', client: 'Metro Bazaar', address: 'Sector 54, Gurugram', cns: 3, boxes: 27, weight: '156 kg', timeWindow: '11:25 - 12:20', lat: 28.4329, lng: 77.1010 },
      { id: 'CN-2024-122', type: 'Appointment', label: 'Sohna Road', client: 'Metro Bazaar', address: 'Sector 48, Gurugram', cns: 3, boxes: 21, weight: '144 kg', timeWindow: '12:45 - 13:30', lat: 28.4149, lng: 77.0407 },
      { id: 'PRQ-4516', type: 'Pickup', label: 'New Gurugram', client: 'Metro Bazaar', address: 'Sector 83, Gurugram', cns: 2, boxes: 26, weight: '308 kg', timeWindow: '13:50 - 14:40', lat: 28.3860, lng: 76.9644 },
    ],
  },
  {
    id: 'route-c-noida-express',
    routeName: 'Route C - Noida Express',
    aiConfidence: 89,
    cnsCount: 16,
    cnsWeight: '710 kg',
    prqsCount: 3,
    prqsWeight: '150 kg',
    estimatedTime: '4h 05m',
    distance: '41.6 km',
    client: 'Prime Cart',
    vehicleUtilization: 71,
    idleDispatchTime: '16 min',
    consignmentCount: 5,
    boxes: 126,
    totalWeight: '860 KG',
    status: 'Recommended',
    driver: smartTripDrivers[2],
    vehicle: smartTripVehicles[2],
    stops: [
      { id: 'CN-2024-205', type: 'Pickup', label: 'Sector 62', client: 'Prime Cart', address: 'Sector 62, Noida', cns: 5, boxes: 20, weight: '102 kg', timeWindow: '10:10 - 10:50', lat: 28.6270, lng: 77.3649 },
      { id: 'PRQ-4603', type: 'Pickup', label: 'Film City', client: 'Prime Cart', address: 'Sector 16A, Noida', cns: 1, boxes: 12, weight: '54 kg', timeWindow: '11:00 - 11:35', lat: 28.6034, lng: 77.3605 },
      { id: 'CN-2024-219', type: 'Appointment', label: 'Noida Expressway', client: 'Prime Cart', address: 'Sector 142, Noida', cns: 4, boxes: 29, weight: '178 kg', timeWindow: '12:00 - 12:50', lat: 28.5046, lng: 77.4167 },
      { id: 'CN-2024-228', type: 'Appointment', label: 'Pari Chowk', client: 'Prime Cart', address: 'Knowledge Park, Greater Noida', cns: 3, boxes: 31, weight: '196 kg', timeWindow: '13:20 - 14:10', lat: 28.4744, lng: 77.5030 },
      { id: 'PRQ-4609', type: 'Pickup', label: 'Yamuna Authority', client: 'Prime Cart', address: 'Sector 22D, Yamuna Expressway', cns: 3, boxes: 34, weight: '330 kg', timeWindow: '14:30 - 15:15', lat: 28.3615, lng: 77.5401 },
    ],
  },
  {
    id: 'route-d-west-delhi',
    routeName: 'Route D - West Delhi',
    aiConfidence: 96,
    cnsCount: 22,
    cnsWeight: '910 kg',
    prqsCount: 6,
    prqsWeight: '240 kg',
    estimatedTime: '5h 10m',
    distance: '52.4 km',
    client: 'Urban Basket',
    vehicleUtilization: 83,
    idleDispatchTime: '21 min',
    consignmentCount: 6,
    boxes: 168,
    totalWeight: '1150 KG',
    status: 'Recommended',
    driver: smartTripDrivers[3],
    vehicle: smartTripVehicles[3],
    stops: [
      { id: 'CN-2024-301', type: 'Pickup', label: 'Janakpuri', client: 'Urban Basket', address: 'Janakpuri, Delhi', cns: 5, boxes: 26, weight: '114 kg', timeWindow: '08:50 - 09:30', lat: 28.6219, lng: 77.0878 },
      { id: 'PRQ-4702', type: 'Pickup', label: 'Tilak Nagar', client: 'Urban Basket', address: 'Tilak Nagar, Delhi', cns: 1, boxes: 17, weight: '75 kg', timeWindow: '09:45 - 10:10', lat: 28.6397, lng: 77.0909 },
      { id: 'CN-2024-315', type: 'Appointment', label: 'Punjabi Bagh', client: 'Urban Basket', address: 'Punjabi Bagh, Delhi', cns: 4, boxes: 30, weight: '172 kg', timeWindow: '10:30 - 11:15', lat: 28.6686, lng: 77.1251 },
      { id: 'CN-2024-319', type: 'Appointment', label: 'Paschim Vihar', client: 'Urban Basket', address: 'Paschim Vihar, Delhi', cns: 4, boxes: 24, weight: '145 kg', timeWindow: '11:30 - 12:20', lat: 28.6710, lng: 77.1018 },
      { id: 'PRQ-4708', type: 'Pickup', label: 'Peeragarhi', client: 'Urban Basket', address: 'Peeragarhi, Delhi', cns: 3, boxes: 32, weight: '213 kg', timeWindow: '12:45 - 13:25', lat: 28.6797, lng: 77.0928 },
      { id: 'CN-2024-332', type: 'Appointment', label: 'Nangloi', client: 'Urban Basket', address: 'Nangloi, Delhi', cns: 5, boxes: 39, weight: '431 kg', timeWindow: '13:45 - 14:35', lat: 28.6833, lng: 77.0672 },
    ],
  },
  {
    id: 'route-e-east-delhi',
    routeName: 'Route E - East Delhi',
    aiConfidence: 93,
    cnsCount: 17,
    cnsWeight: '760 kg',
    prqsCount: 4,
    prqsWeight: '190 kg',
    estimatedTime: '4h 00m',
    distance: '39.7 km',
    client: 'CityCart',
    vehicleUtilization: 84,
    idleDispatchTime: '14 min',
    consignmentCount: 5,
    boxes: 132,
    totalWeight: '950 KG',
    status: 'Recommended',
    driver: smartTripDrivers[0],
    vehicle: smartTripVehicles[1],
    stops: [
      { id: 'CN-2024-401', type: 'Pickup', label: 'Mayur Vihar', client: 'CityCart', address: 'Mayur Vihar Phase 1, Delhi', cns: 4, boxes: 21, weight: '106 kg', timeWindow: '09:00 - 09:40', lat: 28.6067, lng: 77.2947 },
      { id: 'PRQ-4802', type: 'Pickup', label: 'Laxmi Nagar', client: 'CityCart', address: 'Laxmi Nagar, Delhi', cns: 2, boxes: 18, weight: '79 kg', timeWindow: '10:00 - 10:35', lat: 28.6328, lng: 77.2773 },
      { id: 'CN-2024-415', type: 'Appointment', label: 'Preet Vihar', client: 'CityCart', address: 'Preet Vihar, Delhi', cns: 3, boxes: 24, weight: '143 kg', timeWindow: '10:50 - 11:35', lat: 28.6415, lng: 77.2952 },
      { id: 'CN-2024-422', type: 'Appointment', label: 'Anand Vihar', client: 'CityCart', address: 'Anand Vihar, Delhi', cns: 4, boxes: 29, weight: '171 kg', timeWindow: '12:00 - 12:45', lat: 28.6469, lng: 77.3150 },
      { id: 'PRQ-4809', type: 'Pickup', label: 'Patparganj', client: 'CityCart', address: 'Patparganj Industrial Area, Delhi', cns: 4, boxes: 40, weight: '451 kg', timeWindow: '13:10 - 14:00', lat: 28.6260, lng: 77.3093 },
    ],
  },
  {
    id: 'route-f-central-delhi',
    routeName: 'Route F - Central Delhi',
    aiConfidence: 90,
    cnsCount: 13,
    cnsWeight: '580 kg',
    prqsCount: 5,
    prqsWeight: '220 kg',
    estimatedTime: '3h 35m',
    distance: '31.2 km',
    client: 'Capital Foods',
    vehicleUtilization: 76,
    idleDispatchTime: '11 min',
    consignmentCount: 4,
    boxes: 108,
    totalWeight: '800 KG',
    status: 'Recommended',
    driver: smartTripDrivers[1],
    vehicle: smartTripVehicles[2],
    stops: [
      { id: 'CN-2024-501', type: 'Pickup', label: 'Karol Bagh', client: 'Capital Foods', address: 'Karol Bagh, Delhi', cns: 3, boxes: 19, weight: '88 kg', timeWindow: '08:40 - 09:20', lat: 28.6516, lng: 77.1909 },
      { id: 'PRQ-4904', type: 'Pickup', label: 'Paharganj', client: 'Capital Foods', address: 'Paharganj, Delhi', cns: 2, boxes: 13, weight: '64 kg', timeWindow: '09:35 - 10:00', lat: 28.6431, lng: 77.2167 },
      { id: 'CN-2024-512', type: 'Appointment', label: 'Connaught Place', client: 'Capital Foods', address: 'Connaught Place, Delhi', cns: 3, boxes: 28, weight: '140 kg', timeWindow: '10:20 - 11:05', lat: 28.6315, lng: 77.2167 },
      { id: 'CN-2024-518', type: 'Appointment', label: 'ITO', client: 'Capital Foods', address: 'ITO, Delhi', cns: 2, boxes: 17, weight: '97 kg', timeWindow: '11:20 - 11:50', lat: 28.6289, lng: 77.2410 },
      { id: 'PRQ-4911', type: 'Pickup', label: 'Daryaganj', client: 'Capital Foods', address: 'Daryaganj, Delhi', cns: 3, boxes: 31, weight: '411 kg', timeWindow: '12:10 - 12:55', lat: 28.6445, lng: 77.2419 },
    ],
  },
  {
    id: 'route-g-north-delhi',
    routeName: 'Route G - North Delhi',
    aiConfidence: 95,
    cnsCount: 19,
    cnsWeight: '845 kg',
    prqsCount: 4,
    prqsWeight: '205 kg',
    estimatedTime: '4h 20m',
    distance: '42.9 km',
    client: 'FreshLane',
    vehicleUtilization: 88,
    idleDispatchTime: '19 min',
    consignmentCount: 5,
    boxes: 141,
    totalWeight: '1050 KG',
    status: 'Recommended',
    driver: smartTripDrivers[2],
    vehicle: smartTripVehicles[0],
    stops: [
      { id: 'CN-2024-601', type: 'Pickup', label: 'Model Town', client: 'FreshLane', address: 'Model Town, Delhi', cns: 4, boxes: 23, weight: '116 kg', timeWindow: '09:10 - 09:50', lat: 28.7049, lng: 77.1904 },
      { id: 'PRQ-5003', type: 'Pickup', label: 'Azadpur', client: 'FreshLane', address: 'Azadpur, Delhi', cns: 2, boxes: 15, weight: '71 kg', timeWindow: '10:05 - 10:30', lat: 28.7060, lng: 77.1810 },
      { id: 'CN-2024-614', type: 'Appointment', label: 'Mukherjee Nagar', client: 'FreshLane', address: 'Mukherjee Nagar, Delhi', cns: 4, boxes: 28, weight: '162 kg', timeWindow: '10:50 - 11:35', lat: 28.7114, lng: 77.2140 },
      { id: 'CN-2024-620', type: 'Appointment', label: 'Civil Lines', client: 'FreshLane', address: 'Civil Lines, Delhi', cns: 3, boxes: 24, weight: '138 kg', timeWindow: '11:55 - 12:35', lat: 28.6762, lng: 77.2250 },
      { id: 'PRQ-5010', type: 'Pickup', label: 'Kashmere Gate', client: 'FreshLane', address: 'Kashmere Gate, Delhi', cns: 6, boxes: 51, weight: '563 kg', timeWindow: '13:00 - 14:05', lat: 28.6673, lng: 77.2290 },
    ],
  },
  {
    id: 'route-h-dwarka-loop',
    routeName: 'Route H - Dwarka Loop',
    aiConfidence: 92,
    cnsCount: 15,
    cnsWeight: '640 kg',
    prqsCount: 5,
    prqsWeight: '230 kg',
    estimatedTime: '3h 55m',
    distance: '36.5 km',
    client: 'QuickShip',
    vehicleUtilization: 81,
    idleDispatchTime: '13 min',
    consignmentCount: 5,
    boxes: 118,
    totalWeight: '870 KG',
    status: 'Recommended',
    driver: smartTripDrivers[3],
    vehicle: smartTripVehicles[3],
    stops: [
      { id: 'CN-2024-701', type: 'Pickup', label: 'Sector 10 Dwarka', client: 'QuickShip', address: 'Sector 10, Dwarka, Delhi', cns: 3, boxes: 20, weight: '94 kg', timeWindow: '08:50 - 09:25', lat: 28.5854, lng: 77.0577 },
      { id: 'PRQ-5102', type: 'Pickup', label: 'Sector 12 Dwarka', client: 'QuickShip', address: 'Sector 12, Dwarka, Delhi', cns: 2, boxes: 14, weight: '62 kg', timeWindow: '09:40 - 10:05', lat: 28.5921, lng: 77.0460 },
      { id: 'CN-2024-715', type: 'Appointment', label: 'Sector 21 Dwarka', client: 'QuickShip', address: 'Sector 21, Dwarka, Delhi', cns: 4, boxes: 26, weight: '151 kg', timeWindow: '10:25 - 11:05', lat: 28.5540, lng: 77.0688 },
      { id: 'CN-2024-721', type: 'Appointment', label: 'Palam', client: 'QuickShip', address: 'Palam, Delhi', cns: 2, boxes: 18, weight: '103 kg', timeWindow: '11:30 - 12:05', lat: 28.5907, lng: 77.0902 },
      { id: 'PRQ-5110', type: 'Pickup', label: 'Najafgarh Road', client: 'QuickShip', address: 'Najafgarh Road, Delhi', cns: 4, boxes: 40, weight: '460 kg', timeWindow: '12:25 - 13:20', lat: 28.6129, lng: 77.0316 },
    ],
  },
  {
    id: 'route-i-ghaziabad-link',
    routeName: 'Route I - Ghaziabad Link',
    aiConfidence: 91,
    cnsCount: 16,
    cnsWeight: '690 kg',
    prqsCount: 4,
    prqsWeight: '185 kg',
    estimatedTime: '4h 05m',
    distance: '40.8 km',
    client: 'RapidKart',
    vehicleUtilization: 79,
    idleDispatchTime: '15 min',
    consignmentCount: 5,
    boxes: 124,
    totalWeight: '875 KG',
    status: 'Recommended',
    driver: smartTripDrivers[0],
    vehicle: smartTripVehicles[2],
    stops: [
      { id: 'CN-2024-801', type: 'Pickup', label: 'Vaishali', client: 'RapidKart', address: 'Vaishali, Ghaziabad', cns: 3, boxes: 19, weight: '88 kg', timeWindow: '09:10 - 09:45', lat: 28.6457, lng: 77.3391 },
      { id: 'PRQ-5202', type: 'Pickup', label: 'Indirapuram', client: 'RapidKart', address: 'Indirapuram, Ghaziabad', cns: 2, boxes: 16, weight: '71 kg', timeWindow: '10:00 - 10:30', lat: 28.6387, lng: 77.3690 },
      { id: 'CN-2024-814', type: 'Appointment', label: 'Kaushambi', client: 'RapidKart', address: 'Kaushambi, Ghaziabad', cns: 4, boxes: 27, weight: '152 kg', timeWindow: '10:50 - 11:35', lat: 28.6463, lng: 77.3105 },
      { id: 'CN-2024-821', type: 'Appointment', label: 'Raj Nagar Extension', client: 'RapidKart', address: 'Raj Nagar Extension, Ghaziabad', cns: 3, boxes: 24, weight: '136 kg', timeWindow: '12:05 - 12:50', lat: 28.7197, lng: 77.4342 },
      { id: 'PRQ-5209', type: 'Pickup', label: 'Crossings Republik', client: 'RapidKart', address: 'Crossings Republik, Ghaziabad', cns: 4, boxes: 38, weight: '428 kg', timeWindow: '13:15 - 14:00', lat: 28.6254, lng: 77.4351 },
    ],
  },
  {
    id: 'route-j-faridabad-run',
    routeName: 'Route J - Faridabad Run',
    aiConfidence: 88,
    cnsCount: 14,
    cnsWeight: '610 kg',
    prqsCount: 5,
    prqsWeight: '210 kg',
    estimatedTime: '3h 50m',
    distance: '37.1 km',
    client: 'Industrial Hub',
    vehicleUtilization: 74,
    idleDispatchTime: '17 min',
    consignmentCount: 4,
    boxes: 116,
    totalWeight: '820 KG',
    status: 'Recommended',
    driver: smartTripDrivers[1],
    vehicle: smartTripVehicles[1],
    stops: [
      { id: 'CN-2024-901', type: 'Pickup', label: 'Badarpur Border', client: 'Industrial Hub', address: 'Badarpur Border, Delhi', cns: 3, boxes: 18, weight: '82 kg', timeWindow: '08:45 - 09:20', lat: 28.5006, lng: 77.3020 },
      { id: 'PRQ-5303', type: 'Pickup', label: 'Sector 37', client: 'Industrial Hub', address: 'Sector 37, Faridabad', cns: 2, boxes: 14, weight: '68 kg', timeWindow: '09:40 - 10:10', lat: 28.4356, lng: 77.3327 },
      { id: 'CN-2024-914', type: 'Appointment', label: 'Mathura Road', client: 'Industrial Hub', address: 'Mathura Road, Faridabad', cns: 3, boxes: 26, weight: '148 kg', timeWindow: '10:30 - 11:10', lat: 28.4089, lng: 77.3178 },
      { id: 'CN-2024-920', type: 'Appointment', label: 'Ballabgarh', client: 'Industrial Hub', address: 'Ballabgarh, Faridabad', cns: 2, boxes: 21, weight: '129 kg', timeWindow: '11:35 - 12:15', lat: 28.3404, lng: 77.3206 },
      { id: 'PRQ-5311', type: 'Pickup', label: 'Sector 58', client: 'Industrial Hub', address: 'Sector 58, Faridabad', cns: 4, boxes: 37, weight: '393 kg', timeWindow: '12:40 - 13:25', lat: 28.4048, lng: 77.3666 },
    ],
  },
  {
    id: 'route-k-bahadurgarh-shift',
    routeName: 'Route K - Bahadurgarh Shift',
    aiConfidence: 93,
    cnsCount: 18,
    cnsWeight: '790 kg',
    prqsCount: 3,
    prqsWeight: '165 kg',
    estimatedTime: '4h 15m',
    distance: '43.4 km',
    client: 'Om Retail',
    vehicleUtilization: 86,
    idleDispatchTime: '14 min',
    consignmentCount: 5,
    boxes: 134,
    totalWeight: '955 KG',
    status: 'Recommended',
    driver: smartTripDrivers[2],
    vehicle: smartTripVehicles[0],
    stops: [
      { id: 'CN-2025-001', type: 'Pickup', label: 'Mundka', client: 'Om Retail', address: 'Mundka, Delhi', cns: 4, boxes: 22, weight: '97 kg', timeWindow: '09:00 - 09:35', lat: 28.6823, lng: 77.0290 },
      { id: 'PRQ-5402', type: 'Pickup', label: 'Tikri Kalan', client: 'Om Retail', address: 'Tikri Kalan, Delhi', cns: 1, boxes: 13, weight: '55 kg', timeWindow: '09:50 - 10:10', lat: 28.6888, lng: 76.9874 },
      { id: 'CN-2025-014', type: 'Appointment', label: 'Bahadurgarh City', client: 'Om Retail', address: 'Bahadurgarh, Haryana', cns: 4, boxes: 28, weight: '166 kg', timeWindow: '10:35 - 11:20', lat: 28.6921, lng: 76.9350 },
      { id: 'CN-2025-021', type: 'Appointment', label: 'MIE Industrial Area', client: 'Om Retail', address: 'MIE Part B, Bahadurgarh', cns: 4, boxes: 29, weight: '174 kg', timeWindow: '11:45 - 12:30', lat: 28.7004, lng: 76.9004 },
      { id: 'PRQ-5409', type: 'Pickup', label: 'Asoda Mod', client: 'Om Retail', address: 'Asoda Mod, Bahadurgarh', cns: 5, boxes: 42, weight: '463 kg', timeWindow: '12:50 - 13:40', lat: 28.7246, lng: 76.9015 },
    ],
  },
  {
    id: 'route-l-manesar-cluster',
    routeName: 'Route L - Manesar Cluster',
    aiConfidence: 90,
    cnsCount: 17,
    cnsWeight: '720 kg',
    prqsCount: 4,
    prqsWeight: '195 kg',
    estimatedTime: '4h 10m',
    distance: '44.1 km',
    client: 'Auto Chain',
    vehicleUtilization: 82,
    idleDispatchTime: '18 min',
    consignmentCount: 5,
    boxes: 129,
    totalWeight: '915 KG',
    status: 'Recommended',
    driver: smartTripDrivers[3],
    vehicle: smartTripVehicles[3],
    stops: [
      { id: 'CN-2025-101', type: 'Pickup', label: 'IMT Manesar 1', client: 'Auto Chain', address: 'IMT Manesar, Sector 1', cns: 4, boxes: 20, weight: '91 kg', timeWindow: '08:55 - 09:30', lat: 28.3555, lng: 76.9436 },
      { id: 'PRQ-5502', type: 'Pickup', label: 'IMT Manesar 3', client: 'Auto Chain', address: 'IMT Manesar, Sector 3', cns: 2, boxes: 16, weight: '73 kg', timeWindow: '09:45 - 10:15', lat: 28.3502, lng: 76.9488 },
      { id: 'CN-2025-114', type: 'Appointment', label: 'Sector 8 Manesar', client: 'Auto Chain', address: 'Sector 8, IMT Manesar', cns: 4, boxes: 27, weight: '158 kg', timeWindow: '10:35 - 11:15', lat: 28.3389, lng: 76.9431 },
      { id: 'CN-2025-120', type: 'Appointment', label: 'Kasan Village', client: 'Auto Chain', address: 'Kasan, Gurugram', cns: 3, boxes: 25, weight: '146 kg', timeWindow: '11:35 - 12:20', lat: 28.3203, lng: 76.9325 },
      { id: 'PRQ-5510', type: 'Pickup', label: 'Pachgaon', client: 'Auto Chain', address: 'Pachgaon, Gurugram', cns: 4, boxes: 41, weight: '447 kg', timeWindow: '12:45 - 13:30', lat: 28.3050, lng: 76.9041 },
    ],
  },
  {
    id: 'route-m-sonipat-ring',
    routeName: 'Route M - Sonipat Ring',
    aiConfidence: 87,
    cnsCount: 13,
    cnsWeight: '560 kg',
    prqsCount: 5,
    prqsWeight: '205 kg',
    estimatedTime: '4h 00m',
    distance: '46.3 km',
    client: 'North Goods',
    vehicleUtilization: 73,
    idleDispatchTime: '20 min',
    consignmentCount: 4,
    boxes: 109,
    totalWeight: '765 KG',
    status: 'Recommended',
    driver: smartTripDrivers[0],
    vehicle: smartTripVehicles[1],
    stops: [
      { id: 'CN-2025-201', type: 'Pickup', label: 'Kundli', client: 'North Goods', address: 'Kundli Industrial Area, Sonipat', cns: 3, boxes: 18, weight: '79 kg', timeWindow: '09:20 - 09:50', lat: 28.9987, lng: 77.0414 },
      { id: 'PRQ-5604', type: 'Pickup', label: 'Rai', client: 'North Goods', address: 'Rai Industrial Area, Sonipat', cns: 2, boxes: 15, weight: '67 kg', timeWindow: '10:10 - 10:35', lat: 28.9341, lng: 77.1025 },
      { id: 'CN-2025-214', type: 'Appointment', label: 'Murthal', client: 'North Goods', address: 'Murthal, Sonipat', cns: 3, boxes: 24, weight: '134 kg', timeWindow: '10:55 - 11:35', lat: 29.0272, lng: 77.0640 },
      { id: 'CN-2025-219', type: 'Appointment', label: 'Atlas Road', client: 'North Goods', address: 'Atlas Road, Sonipat', cns: 2, boxes: 20, weight: '122 kg', timeWindow: '11:55 - 12:30', lat: 28.9931, lng: 77.0151 },
      { id: 'PRQ-5610', type: 'Pickup', label: 'Sector 15 Sonipat', client: 'North Goods', address: 'Sector 15, Sonipat', cns: 3, boxes: 32, weight: '363 kg', timeWindow: '12:55 - 13:35', lat: 28.9917, lng: 77.0019 },
    ],
  },
  {
    id: 'route-n-greater-noida-west',
    routeName: 'Route N - Greater Noida West',
    aiConfidence: 92,
    cnsCount: 15,
    cnsWeight: '670 kg',
    prqsCount: 4,
    prqsWeight: '188 kg',
    estimatedTime: '3h 55m',
    distance: '35.9 km',
    client: 'Prime Cart',
    vehicleUtilization: 80,
    idleDispatchTime: '12 min',
    consignmentCount: 4,
    boxes: 117,
    totalWeight: '858 KG',
    status: 'Recommended',
    driver: smartTripDrivers[1],
    vehicle: smartTripVehicles[2],
    stops: [
      { id: 'CN-2025-301', type: 'Pickup', label: 'Gaur City 1', client: 'Prime Cart', address: 'Gaur City 1, Greater Noida West', cns: 3, boxes: 17, weight: '74 kg', timeWindow: '09:05 - 09:35', lat: 28.6082, lng: 77.4307 },
      { id: 'PRQ-5702', type: 'Pickup', label: 'Bisrakh', client: 'Prime Cart', address: 'Bisrakh, Greater Noida West', cns: 2, boxes: 15, weight: '68 kg', timeWindow: '09:50 - 10:15', lat: 28.5987, lng: 77.4328 },
      { id: 'CN-2025-314', type: 'Appointment', label: 'Techzone 4', client: 'Prime Cart', address: 'Techzone 4, Greater Noida West', cns: 4, boxes: 25, weight: '147 kg', timeWindow: '10:35 - 11:20', lat: 28.6153, lng: 77.4458 },
      { id: 'CN-2025-320', type: 'Appointment', label: 'Ek Murti Chowk', client: 'Prime Cart', address: 'Ek Murti Chowk, Greater Noida West', cns: 2, boxes: 22, weight: '131 kg', timeWindow: '11:45 - 12:20', lat: 28.6215, lng: 77.4381 },
      { id: 'PRQ-5710', type: 'Pickup', label: 'Knowledge Park V', client: 'Prime Cart', address: 'Knowledge Park V, Greater Noida', cns: 4, boxes: 38, weight: '438 kg', timeWindow: '12:45 - 13:30', lat: 28.5682, lng: 77.4549 },
    ],
  },
  {
    id: 'route-o-aerocity-corridor',
    routeName: 'Route O - Aerocity Corridor',
    aiConfidence: 94,
    cnsCount: 18,
    cnsWeight: '805 kg',
    prqsCount: 3,
    prqsWeight: '154 kg',
    estimatedTime: '3h 40m',
    distance: '29.8 km',
    client: 'Sky Retail',
    vehicleUtilization: 89,
    idleDispatchTime: '10 min',
    consignmentCount: 5,
    boxes: 138,
    totalWeight: '959 KG',
    status: 'Recommended',
    driver: smartTripDrivers[2],
    vehicle: smartTripVehicles[0],
    stops: [
      { id: 'CN-2025-401', type: 'Pickup', label: 'Mahipalpur', client: 'Sky Retail', address: 'Mahipalpur, Delhi', cns: 4, boxes: 19, weight: '86 kg', timeWindow: '08:40 - 09:15', lat: 28.5470, lng: 77.1221 },
      { id: 'PRQ-5802', type: 'Pickup', label: 'Aerocity', client: 'Sky Retail', address: 'Aerocity, Delhi', cns: 1, boxes: 12, weight: '51 kg', timeWindow: '09:30 - 09:50', lat: 28.5527, lng: 77.1211 },
      { id: 'CN-2025-414', type: 'Appointment', label: 'Vasant Kunj', client: 'Sky Retail', address: 'Vasant Kunj, Delhi', cns: 4, boxes: 28, weight: '161 kg', timeWindow: '10:10 - 10:55', lat: 28.5244, lng: 77.1588 },
      { id: 'CN-2025-420', type: 'Appointment', label: 'RK Puram', client: 'Sky Retail', address: 'RK Puram, Delhi', cns: 4, boxes: 31, weight: '182 kg', timeWindow: '11:20 - 12:00', lat: 28.5677, lng: 77.1766 },
      { id: 'PRQ-5810', type: 'Pickup', label: 'Safdarjung Enclave', client: 'Sky Retail', address: 'Safdarjung Enclave, Delhi', cns: 5, boxes: 48, weight: '479 kg', timeWindow: '12:25 - 13:15', lat: 28.5605, lng: 77.1960 },
    ],
  },
].map((trip, index) => ({
  ...trip,
  travelTime: formatDurationMinutes(Math.max(60, Math.round(parseDurationToMinutes(trip.estimatedTime) * 0.64 / 5) * 5)),
  serviceTime: formatDurationMinutes(
    Math.max(
      35,
      parseDurationToMinutes(trip.estimatedTime) -
        Math.max(60, Math.round(parseDurationToMinutes(trip.estimatedTime) * 0.64 / 5) * 5)
    )
  ),
  runningHoursLimit: trip.vehicle.label.includes('40 ft') ? 9 : trip.vehicle.label.includes('17 ft') ? 7 : 8,
  runningHoursUsed: Number(
    (
      parseDurationToMinutes(trip.estimatedTime) / 60 +
      2.35 +
      (index % 4) * 0.45
    ).toFixed(1)
  ),
  vehicleConstraint: tripConstraintRules[trip.id]
    ? {
        ...tripConstraintRules[trip.id],
        currentVehicleSize: trip.vehicle.label,
      }
    : null,
  additionalVehicles: (tripConstraintRules[trip.id]?.additionalVehicleIds || [])
    .map((vehicleId) => smartTripVehicles.find((vehicle) => vehicle.id === vehicleId))
    .filter(Boolean),
  runningHoursApprovalRequired:
    Number(
      (
        parseDurationToMinutes(trip.estimatedTime) / 60 +
        2.35 +
        (index % 4) * 0.45
      ).toFixed(1)
    ) > (trip.vehicle.label.includes('40 ft') ? 9 : trip.vehicle.label.includes('17 ft') ? 7 : 8),
  runningHoursApprovalReason: '',
  reconciliation: {
    drsNumber: `DRS-${2401 + index}`,
    cnPlanned: trip.cnsCount,
    cnDelivered: Math.max(trip.cnsCount - (index % 3), 0),
    prqPlanned: trip.prqsCount,
    prqPicked: Math.max(trip.prqsCount - (index % 2), 0),
    nrdCount: index % 4 === 0 ? 1 : 0,
    partialDeliveryCount: index % 5 === 0 ? 1 : 0,
    status: reconciliationStatuses[index % reconciliationStatuses.length],
    paymentAction: reconciliationPaymentActions[index % reconciliationPaymentActions.length],
    closureStatus: index % 3 === 0 ? 'Open' : 'Pending',
  },
  operatorContact: operatorContacts[index % operatorContacts.length],
  autoAssignedVehicle:
    index % 3 === 0
      ? {
          source: 'Auto picked by system',
          vehicle: smartTripVehicles[index % smartTripVehicles.length],
          confidence: `${92 - (index % 4) * 3}%`,
          available: true,
        }
      : {
          source: 'Auto picked by system',
          vehicle: null,
          confidence: `${84 - (index % 4) * 2}%`,
          available: false,
        },
  nearbyBranchVehicleOptions:
    index % 3 === 0
      ? []
      : nearbyBranchVehicles.slice(0, (index % nearbyBranchVehicles.length) + 1),
  branchVehicleRequestStatus: 'Not Sent',
  marketVehicleRequestStatus: 'Not Raised',
  status: index % 3 === 0 ? 'Planned' : 'Routing Pending',
}));

export const getPotentialPickups = () => potentialPickups;
export const getRequestedPickups = () => requestedPickups;
export const getFTLPickups = () => ftlPickups;
export const getAppointmentCNs = () => appointmentCNs;
export const getYellowFlagCNs = () => yellowFlagCNs;
export const getRegularCNs = () => regularCNs;
export const getVehicles = () => vehicles;
export const getDrivers = () => drivers;
export const getOperators = () => operators;
export const getSmartTripDrivers = () => smartTripDrivers;
export const getSmartTripVehicles = () => smartTripVehicles;
export const getLabourResources = () => labourResources;
export const getDocks = () => docks;
export const getSampleTrips = () => sampleTrips;
