import { storageService } from './storageService';
import type { User } from '../types';

const MOCK_USERS = [
  {
    id: '1',
    email: 'user@intellidr.demo',
    password: 'user123',
    role: 'user',
    name: 'Atharva More',
    assignedVehicle: 'V-102',
    status: 'active'
  },
  {
    id: '2',
    email: 'admin@intellidr.demo',
    password: 'admin123',
    role: 'admin',
    name: 'System Admin',
    status: 'active'
  }
];

export const authService = {
  async login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          const userToReturn = userWithoutPassword as unknown as User;
          storageService.setAuthSession(userToReturn);
          resolve(userToReturn);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 300);
    });
  },

  async logout(): Promise<void> {
    return new Promise(resolve => {
      storageService.removeAuthSession();
      resolve();
    });
  },

  getCurrentUser(): User | null {
    return storageService.getAuthSession();
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
};
