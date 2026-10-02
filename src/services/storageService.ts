export const storageService = {
  prefix: 'intellidr_',

  set(key: string, value: any) {
    try {
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  },

  get(key: string) {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  },

  // Specific helpers
  getAuthSession() { return this.get('auth_session'); },
  setAuthSession(session: any) { this.set('auth_session', session); },
  removeAuthSession() { this.remove('auth_session'); },

  getVehicles() { return this.get('vehicles') || []; },
  setVehicles(vehicles: any) { this.set('vehicles', vehicles); },

  getUsers() { return this.get('users') || []; },
  setUsers(users: any) { this.set('users', users); },

  getEvents() { return this.get('events') || []; },
  setEvents(events: any) { this.set('events', events); },

  getTrips() { return this.get('trips') || []; },
  setTrips(trips: any) { this.set('trips', trips); },

  getSettings() { return this.get('settings') || {}; },
  setSettings(settings: any) { this.set('settings', settings); },
};
