// Coimbatore Urban Mobility Data Models and Geographic Coordinates

export interface CoimbatoreLocation {
  id: string;
  name: string;
  road: string;
  district: string;
  lat: number;
  lng: number;
  type: 'junction' | 'hospital' | 'railway' | 'landmark';
  connectedTo?: string[];
}

export const COIMBATORE_JUNCTIONS: CoimbatoreLocation[] = [
  {
    id: 'node-1',
    name: 'Gandhipuram Signal',
    road: 'Sathy Road / Cross Cut Road',
    district: 'Commercial Core',
    lat: 11.0183,
    lng: 76.9655,
    type: 'junction',
    connectedTo: ['node-2', 'node-10', 'node-8']
  },
  {
    id: 'node-2',
    name: 'Lakshmi Mills Junction',
    road: 'Avinashi Road',
    district: 'Avinashi Corridor',
    lat: 11.0094,
    lng: 76.9856,
    type: 'junction',
    connectedTo: ['node-1', 'node-9', 'node-10']
  },
  {
    id: 'node-3',
    name: 'Hopes College Junction',
    road: 'Avinashi Road',
    district: 'Educational Hub / Peelamedu',
    lat: 11.0264,
    lng: 77.0163,
    type: 'junction',
    connectedTo: ['node-9', 'node-7', 'node-11']
  },
  {
    id: 'node-4',
    name: 'Uppilipalayam Signal',
    road: 'Trichy Road / Avinashi Flyover',
    district: 'Transport Hub',
    lat: 11.0050,
    lng: 76.9620,
    type: 'junction',
    connectedTo: ['node-10', 'node-5', 'node-6']
  },
  {
    id: 'node-5',
    name: 'Singanallur Junction',
    road: 'Trichy Road',
    district: 'Trichy Corridor',
    lat: 10.9992,
    lng: 77.0210,
    type: 'junction',
    connectedTo: ['node-4', 'node-7', 'node-3']
  },
  {
    id: 'node-6',
    name: 'Ukkadam Junction',
    road: 'Pollachi Road / Palakkad Road',
    district: 'South Bus Terminus',
    lat: 10.9880,
    lng: 76.9580,
    type: 'junction',
    connectedTo: ['node-4']
  },
  {
    id: 'node-7',
    name: 'Airport Junction',
    road: 'Avinashi Road / SITRA',
    district: 'SITRA / Airport Gateway',
    lat: 11.0312,
    lng: 77.0425,
    type: 'junction',
    connectedTo: ['node-3', 'node-5']
  },
  {
    id: 'node-8',
    name: 'Cinthamani Signal',
    road: 'Mettupalayam Road',
    district: 'North Coimbatore / RS Puram',
    lat: 11.0118,
    lng: 76.9510,
    type: 'junction',
    connectedTo: ['node-1', 'node-10']
  },
  {
    id: 'node-9',
    name: 'Nava India',
    road: 'Avinashi Road',
    district: 'Peelamedu East',
    lat: 11.0210,
    lng: 76.9950,
    type: 'junction',
    connectedTo: ['node-2', 'node-3', 'node-11']
  },
  {
    id: 'node-10',
    name: 'Anna Silai Junction',
    road: 'Avinashi Road / Old Post Office',
    district: 'Collectorate Sector',
    lat: 11.0062,
    lng: 76.9754,
    type: 'junction',
    connectedTo: ['node-1', 'node-2', 'node-4']
  },
  {
    id: 'node-11',
    name: 'Peelamedu Signal',
    road: 'Avinashi Road / Fun Republic',
    district: 'Peelamedu Tech Hub',
    lat: 11.0250,
    lng: 77.0050,
    type: 'junction',
    connectedTo: ['node-9', 'node-3']
  }
];

export interface CoimbatoreHospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  nearestJunctionId: string;
  emergencyPhone: string;
  departments: string[];
}

export const COIMBATORE_HOSPITALS: CoimbatoreHospital[] = [
  {
    id: 'hosp-psg',
    name: 'PSG Hospitals',
    address: 'Avinashi Road, Peelamedu, Coimbatore - 641004',
    lat: 11.0285,
    lng: 77.0028,
    nearestJunctionId: 'node-11',
    emergencyPhone: '0422 257 0170',
    departments: ['Trauma Center', 'Cardiac Emergency', 'Neurology', 'Pediatric ICU']
  },
  {
    id: 'hosp-kmch',
    name: 'KMCH (Kovai Medical Center & Hospital)',
    address: '99, Avinashi Rd, Peelamedu, Civil Aerodrome Post, Coimbatore - 641014',
    lat: 11.0435,
    lng: 77.0385,
    nearestJunctionId: 'node-7',
    emergencyPhone: '0422 432 3800',
    departments: ['Level 1 Emergency Trauma', 'Stroke Center', 'Critical Care Unit']
  },
  {
    id: 'hosp-ganga',
    name: 'Ganga Hospital',
    address: '313, Mettupalayam Rd, Sai Baba Colony, Coimbatore - 641043',
    lat: 11.0250,
    lng: 76.9500,
    nearestJunctionId: 'node-8',
    emergencyPhone: '0422 248 5000',
    departments: ['Orthopaedic Trauma', 'Plastic & Reconstructive Surgery', 'Burns Unit']
  },
  {
    id: 'hosp-cmch',
    name: 'Coimbatore Medical College Hospital (CMCH)',
    address: 'Trichy Rd, Gopalapuram, Coimbatore - 641018',
    lat: 10.9980,
    lng: 76.9680,
    nearestJunctionId: 'node-4',
    emergencyPhone: '0422 230 1393',
    departments: ['Govt Emergency Casualty', 'Mass Casualty Triage', 'Ambulance Central Depot']
  }
];

export interface RailwayTrainInfo {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  scheduledDeparture: string;
  status: string;
  platform: string;
  crossingImpactNode: string;
}

export const COIMBATORE_RAILWAY_LIVE: {
  stationName: string;
  stationCode: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  trains: RailwayTrainInfo[];
} = {
  stationName: 'Coimbatore Junction',
  stationCode: 'CBE',
  source: 'eRail.in — Coimbatore Junction (CBE)',
  sourceUrl: 'https://erail.in/station-live/coimbatore-jn-CBE',
  lastUpdated: 'Live Reference Schedule (Third-Party)',
  trains: [
    {
      trainNumber: '12676',
      trainName: 'Kovai Superfast Express',
      origin: 'Coimbatore Jn (CBE)',
      destination: 'MGR Chennai Central (MAS)',
      scheduledArrival: 'Source',
      scheduledDeparture: '15:15',
      status: 'On Time / Ready at PF 2',
      platform: '2',
      crossingImpactNode: 'node-3'
    },
    {
      trainNumber: '12673',
      trainName: 'Cheran Superfast Express',
      origin: 'MGR Chennai Central (MAS)',
      destination: 'Coimbatore Jn (CBE)',
      scheduledArrival: '06:00',
      scheduledDeparture: 'Destination',
      status: 'Arrived / Cleared Crossing',
      platform: '1',
      crossingImpactNode: 'node-4'
    },
    {
      trainNumber: '22666',
      trainName: 'Coimbatore - KSR Bengaluru Uday Express',
      origin: 'Coimbatore Jn (CBE)',
      destination: 'KSR Bengaluru (SBC)',
      scheduledArrival: 'Source',
      scheduledDeparture: '05:45',
      status: 'On Time',
      platform: '3',
      crossingImpactNode: 'node-3'
    },
    {
      trainNumber: '12671',
      trainName: 'Nilgiri (Blue Mountain) Express',
      origin: 'MGR Chennai Central (MAS)',
      destination: 'Mettupalayam (MTP)',
      scheduledArrival: '05:15',
      scheduledDeparture: '05:20',
      status: 'Through North Gate',
      platform: '2',
      crossingImpactNode: 'node-8'
    },
    {
      trainNumber: '12084',
      trainName: 'Coimbatore - Mayiladuturai Jan Shatabdi',
      origin: 'Coimbatore Jn (CBE)',
      destination: 'Mayiladuturai Jn (MV)',
      scheduledArrival: 'Source',
      scheduledDeparture: '07:15',
      status: 'On Time',
      platform: '4',
      crossingImpactNode: 'node-4'
    }
  ]
};

export const MAJOR_CORRIDORS = [
  {
    id: 'corr-avinashi',
    name: 'Avinashi Road Express Corridor',
    nodes: ['node-10', 'node-2', 'node-9', 'node-11', 'node-3', 'node-7'],
    totalLengthKm: 11.2,
    avgSpeedKmh: 48,
    primaryHospital: 'hosp-kmch'
  },
  {
    id: 'corr-trichy',
    name: 'Trichy Road Green Wave Corridor',
    nodes: ['node-4', 'node-5', 'node-7'],
    totalLengthKm: 8.5,
    avgSpeedKmh: 42,
    primaryHospital: 'hosp-cmch'
  },
  {
    id: 'corr-sathy',
    name: 'Sathy Road - Gandhipuram Arterial',
    nodes: ['node-8', 'node-1', 'node-2'],
    totalLengthKm: 6.0,
    avgSpeedKmh: 36,
    primaryHospital: 'hosp-ganga'
  }
];

export const VEHICLE_TYPE_CONFIG: { [key: string]: { label: string; icon: string; color: string; size: number } } = {
  car: { label: 'Car', icon: '🚗', color: '#0284c7', size: 14 },
  motorcycle: { label: 'Motorcycle', icon: '🏍️', color: '#059669', size: 12 },
  scooter: { label: 'Scooter', icon: '🛵', color: '#10b981', size: 12 },
  auto_rickshaw: { label: 'Auto Rickshaw', icon: '🛺', color: '#d97706', size: 13 },
  bus: { label: 'Bus', icon: '🚌', color: '#7c3aed', size: 16 },
  truck: { label: 'Truck', icon: '🚚', color: '#ea580c', size: 16 },
  ambulance: { label: 'Ambulance (Emergency)', icon: '🚑', color: '#dc2626', size: 20 },
  fire_engine: { label: 'Fire Engine', icon: '🚒', color: '#e11d48', size: 20 },
  police: { label: 'Police Cruiser', icon: '🚓', color: '#2563eb', size: 16 }
};
