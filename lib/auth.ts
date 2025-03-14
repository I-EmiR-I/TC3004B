import { create } from 'zustand';

interface User {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password: string) => boolean;
  register: (userData: Omit<User, 'id'>) => boolean;
  logout: () => void;
  recoverPassword: (email: string) => boolean;
}

// En un entorno real, esto estaría en una base de datos
const USERS_KEY = 'users';

const getStoredUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [
    {
      email: 'admin@example.com',
      password: 'password123',
      nombre: 'Admin',
      apellidos: 'Usuario',
      telefono: '123456789',
      direccion: 'Calle Principal 123'
    }
  ];
};

const saveUsers = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

export const useAuth = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  users: getStoredUsers(),
  
  login: (email: string, password: string) => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  register: (userData) => {
    const users = getStoredUsers();
    if (users.some(u => u.email === userData.email)) {
      return false;
    }
    
    const newUsers = [...users, userData];
    saveUsers(newUsers);
    set({ users: newUsers });
    return true;
  },

  logout: () => set({ isAuthenticated: false }),

  recoverPassword: (email: string) => {
    const users = getStoredUsers();
    return users.some(u => u.email === email);
  }
}));