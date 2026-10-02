import type { User } from '../types';

export const mockUsersData: User[] = [
  {
    id: '1',
    name: 'Atharva More',
    email: 'user@intellidr.demo',
    role: 'user',
    assignedVehicle: 'V-102',
    status: 'active',
    lastActive: 'Just now'
  },
  {
    id: '2',
    name: 'System Admin',
    email: 'admin@intellidr.demo',
    role: 'admin',
    status: 'active',
    lastActive: 'Just now'
  },
  {
    id: '3',
    name: 'Rohan Sharma',
    email: 'rohan@intellidr.demo',
    role: 'user',
    assignedVehicle: 'V-103',
    status: 'active',
    lastActive: '15 min ago'
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram@intellidr.demo',
    role: 'user',
    assignedVehicle: 'V-104',
    status: 'inactive',
    lastActive: '1 day ago'
  }
];

export const mockUsers = mockUsersData;
