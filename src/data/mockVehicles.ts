import type { Vehicle } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'V-101',
    name: 'Logistics Van 101',
    status: 'active',
    assignedUser: 'user1',
    assignedUserName: 'Atharva More',
    position: { lat: 28.6129, lng: 77.2295 },
    speed: 45,
    heading: 90,
    gnssStatus: 'denied',
    navigationMode: 'ai_dead_reckoning',
    connectionStatus: 'connected',
    lastUpdate: 'Just now',
    tripId: 'TRP-101'
  },
  {
    id: 'V-102',
    name: 'Delivery Unit 102',
    status: 'active',
    assignedUser: 'user2',
    assignedUserName: 'Rohan Sharma',
    position: { lat: 28.6145, lng: 77.2230 },
    speed: 58,
    heading: 180,
    gnssStatus: 'available',
    navigationMode: 'gnss_ins',
    connectionStatus: 'connected',
    lastUpdate: 'Just now',
    tripId: 'TRP-102'
  },
  {
    id: 'V-103',
    name: 'Cargo Truck 103',
    status: 'idle',
    position: { lat: 28.6315, lng: 77.2167 },
    speed: 0,
    heading: 45,
    gnssStatus: 'available',
    navigationMode: 'gnss_ins',
    connectionStatus: 'connected',
    lastUpdate: '10 min ago'
  },
  {
    id: 'V-104',
    name: 'Express Van 104',
    status: 'active',
    position: { lat: 28.6514, lng: 77.1906 },
    speed: 32,
    heading: 270,
    gnssStatus: 'degraded',
    navigationMode: 'gnss_restoring',
    connectionStatus: 'connected',
    lastUpdate: 'Just now'
  },
  {
    id: 'V-105',
    name: 'Hauler 105',
    status: 'maintenance',
    position: { lat: 28.5494, lng: 77.2001 },
    speed: 0,
    heading: 0,
    gnssStatus: 'available',
    navigationMode: 'gnss_ins',
    connectionStatus: 'disconnected',
    lastUpdate: '1 day ago'
  },
  {
    id: 'V-106',
    name: 'Depot Shuttle 106',
    status: 'offline',
    position: { lat: 28.5005, lng: 77.0755 },
    speed: 0,
    heading: 120,
    gnssStatus: 'available',
    navigationMode: 'gnss_ins',
    connectionStatus: 'disconnected',
    lastUpdate: '2 hours ago'
  }
];
